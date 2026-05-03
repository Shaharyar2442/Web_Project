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
          isCompleted: false
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
