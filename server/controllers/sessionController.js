import Session from '../models/Session.js';
import Routine from '../models/Routine.js';
import PRRecord from '../models/PRRecord.js';

export const getActiveSession = async (req, res) => {
  try {
    const session = await Session.findOne({ user: req.user._id, isActive: true })
      .populate('exercises.exercise');
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching active session' });
  }
};

export const startSession = async (req, res) => {
  const { routineId } = req.body;
  
  try {
    // Check if there is already an active session
    let activeSession = await Session.findOne({ user: req.user._id, isActive: true });
    if (activeSession) {
      return res.status(400).json({ message: 'An active session already exists. Finish it first.' });
    }

    let newSessionData = {
      user: req.user._id,
      name: 'Freestyle Workout',
      exercises: []
    };

    if (routineId) {
      const routine = await Routine.findById(routineId).populate('exercises.exercise');
      if (!routine) return res.status(404).json({ message: 'Routine not found' });
      
      newSessionData.name = routine.name;
      newSessionData.routine = routine._id;
      
      // Map routine exercises to session exercises
      newSessionData.exercises = routine.exercises.map(ex => ({
        exercise: ex.exercise._id || ex.exercise,
        exerciseName: ex.exercise.name || 'Unknown Exercise',
        order: ex.order,
        sets: ex.sets.map(s => ({
          reps: s.reps,
          weight: s.weight,
          isCompleted: false,
          note: s.note || '',
          isPR: false
        }))
      }));
    }

    const session = await Session.create(newSessionData);
    const populatedSession = await Session.findById(session._id).populate('exercises.exercise');
    
    res.status(201).json(populatedSession);
  } catch (error) {
    res.status(500).json({ message: 'Error starting session' });
  }
};

export const updateSession = async (req, res) => {
  let { exercises } = req.body;
  
  try {
    if (exercises) {
      exercises = exercises.map(ex => ({
        ...ex,
        exercise: ex.exercise._id || ex.exercise,
        exerciseName: ex.exerciseName || (ex.exercise && ex.exercise.name) || 'Unknown Exercise'
      }));
    }

    const session = await Session.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, isActive: true },
      { exercises },
      { new: true }
    ).populate('exercises.exercise');
    
    if (!session) return res.status(404).json({ message: 'Active session not found' });
    
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error updating session' });
  }
};

export const finishSession = async (req, res) => {
  const { exercises } = req.body;
  
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id, isActive: true }).populate('exercises.exercise');
    if (!session) return res.status(404).json({ message: 'Active session not found' });

    session.isActive = false;
    session.endTime = new Date();
    
    if (exercises) {
      session.exercises = exercises.map(ex => ({
        ...ex,
        exercise: ex.exercise._id || ex.exercise,
        exerciseName: ex.exerciseName || (ex.exercise && ex.exercise.name) || 'Unknown Exercise'
      }));
    }

    let totalVolume = 0;
    let setsCompleted = 0;
    const prUpdates = [];

    session.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.isCompleted) {
          setsCompleted += 1;
          totalVolume += (set.reps * set.weight);

          if (set.weight > 0 && set.reps > 0) {
            const estimatedOneRM = set.weight * (1 + (set.reps / 30));
            const exerciseId = ex.exercise._id || ex.exercise;
            const exerciseName = ex.exercise.name || ex.exerciseName || 'Unknown Exercise';

            prUpdates.push({
              setRef: set,
              exerciseId,
              exerciseName,
              weight: set.weight,
              reps: set.reps,
              estimatedOneRM,
              date: session.endTime
            });
          }
        }
      });
    });

    // Process PRs sequentially to avoid race conditions with multiple sets of same exercise
    for (const pr of prUpdates) {
      const existingPR = await PRRecord.findOne({ user: req.user._id, exercise: pr.exerciseId });
      if (!existingPR || pr.estimatedOneRM > existingPR.estimatedOneRM) {
        pr.setRef.isPR = true; // Flag the set as a PR right before saving the session
        await PRRecord.findOneAndUpdate(
          { user: req.user._id, exercise: pr.exerciseId },
          {
            exerciseName: pr.exerciseName,
            weight: pr.weight,
            reps: pr.reps,
            estimatedOneRM: pr.estimatedOneRM,
            date: pr.date
          },
          { upsert: true, new: true }
        );
      }
    }

    session.totalVolume = totalVolume;
    session.setsCompleted = setsCompleted;

    await session.save();

    // Sync notes back to the original routine template
    if (session.routine) {
      const routine = await Routine.findById(session.routine);
      if (routine) {
        session.exercises.forEach(sessionEx => {
          const exerciseId = sessionEx.exercise._id ? sessionEx.exercise._id.toString() : sessionEx.exercise.toString();
          const routineEx = routine.exercises.find(rEx => rEx.exercise.toString() === exerciseId);
          if (routineEx) {
            sessionEx.sets.forEach((sessionSet, idx) => {
              if (routineEx.sets[idx] && sessionSet.note) {
                routineEx.sets[idx].note = sessionSet.note;
              }
            });
          }
        });
        await routine.save();
      }
    }

    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error finishing session' });
  }
};

export const deleteSession = async (req, res) => {
  try {
    await Session.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    res.status(200).json({ message: 'Session deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting session' });
  }
};

export const getHistory = async (req, res) => {
  try {
    const sessions = await Session.find({ user: req.user._id, isActive: false })
      .populate('exercises.exercise')
      .sort({ endTime: -1 });

    const totalWorkouts = sessions.length;
    let totalVolume = 0;
    let totalSets = 0;

    const muscleVolumeMap = {};
    const activityDates = {};

    sessions.forEach(s => {
      totalVolume += (s.totalVolume || 0);
      totalSets += (s.setsCompleted || 0);

      // Heatmap dates aggregation
      if (s.endTime) {
        // use local date if possible, but simpler to use ISO string date part
        const dateString = new Date(s.endTime).toISOString().split('T')[0];
        activityDates[dateString] = (activityDates[dateString] || 0) + 1;
      }

      // Muscle volume aggregation
      s.exercises.forEach(ex => {
        if (ex.exercise && ex.exercise.muscleGroup) {
          const muscle = ex.exercise.muscleGroup;
          let exVolume = 0;
          ex.sets.forEach(set => {
            if (set.isCompleted && set.weight > 0 && set.reps > 0) {
              exVolume += (set.weight * set.reps);
            }
          });
          if (exVolume > 0) {
            muscleVolumeMap[muscle] = (muscleVolumeMap[muscle] || 0) + exVolume;
          }
        }
      });
    });

    const heatmapData = Object.keys(activityDates).map(date => ({
      date,
      count: activityDates[date]
    }));

    const muscleData = Object.keys(muscleVolumeMap).map(muscle => ({
      name: muscle,
      value: muscleVolumeMap[muscle]
    })).sort((a, b) => b.value - a.value);

    res.status(200).json({
      sessions,
      stats: {
        totalWorkouts,
        totalVolume,
        totalSets,
        heatmapData,
        muscleData
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching history' });
  }
};

export const getSingleSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id })
      .populate('exercises.exercise')
      .populate('routine');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching session details' });
  }
};

export const getPreviousSessionData = async (req, res) => {
  try {
    const { routineId } = req.query;

    let previousRoutineSession = null;
    if (routineId && routineId !== 'undefined' && routineId !== 'null') {
      previousRoutineSession = await Session.findOne({ 
        user: req.user._id, 
        routine: routineId, 
        isActive: false 
      }).sort({ endTime: -1 }).populate('exercises.exercise');
    }

    const allSessions = await Session.find({ user: req.user._id, isActive: false })
      .sort({ endTime: -1 })
      .select('name endTime exercises');

    const lastTimeMap = {};
    for (const s of allSessions) {
      for (const ex of s.exercises) {
        const exId = ex.exercise.toString();
        if (!lastTimeMap[exId]) {
          const completedSets = ex.sets.filter(set => set.isCompleted);
          if (completedSets.length > 0) {
            lastTimeMap[exId] = {
              sessionName: s.name,
              date: s.endTime,
              sets: completedSets.map(set => ({ reps: set.reps, weight: set.weight }))
            };
          }
        }
      }
    }

    res.status(200).json({
      previousRoutineSession,
      lastTimeMap
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching previous data' });
  }
};
