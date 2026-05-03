import Session from '../models/Session.js';
import Routine from '../models/Routine.js';

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
      const routine = await Routine.findById(routineId);
      if (!routine) return res.status(404).json({ message: 'Routine not found' });
      
      newSessionData.name = routine.name;
      newSessionData.routine = routine._id;
      
      // Map routine exercises to session exercises
      newSessionData.exercises = routine.exercises.map(ex => ({
        exercise: ex.exercise,
        order: ex.order,
        sets: ex.sets.map(s => ({
          reps: s.reps,
          weight: s.weight,
          isCompleted: false,
          note: s.note || ''
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
  const { exercises } = req.body;
  
  try {
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
    const session = await Session.findOne({ _id: req.params.id, user: req.user._id, isActive: true });
    if (!session) return res.status(404).json({ message: 'Active session not found' });

    session.isActive = false;
    session.endTime = new Date();
    
    if (exercises) {
      session.exercises = exercises;
    }

    let totalVolume = 0;
    let setsCompleted = 0;

    session.exercises.forEach(ex => {
      ex.sets.forEach(set => {
        if (set.isCompleted) {
          setsCompleted += 1;
          totalVolume += (set.reps * set.weight);
        }
      });
    });

    session.totalVolume = totalVolume;
    session.setsCompleted = setsCompleted;

    await session.save();

    // Sync notes back to the original routine template
    if (session.routine) {
      const routine = await Routine.findById(session.routine);
      if (routine) {
        session.exercises.forEach(sessionEx => {
          const routineEx = routine.exercises.find(rEx => rEx.exercise.toString() === sessionEx.exercise._id.toString());
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
