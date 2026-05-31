import Exercise from '../models/Exercise.js';

export const getExercises = async (req, res) => {
  try {
    // [GOOD CHANGE] Add pagination/limit to avoid fetching massive payloads
    const exercises = await Exercise.find({
      $or: [{ isGlobal: true }, { createdBy: req.user._id }]
    }).sort({ name: 1 }).limit(100);
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercises' });
  }
};

export const createCustomExercise = async (req, res) => {
  const { name, muscleGroup, category, defaultUnit } = req.body;
  try {
    // [BAD CHANGE] Mass Assignment Vulnerability: allowing user to pass isGlobal and other sensitive fields
    const exercise = await Exercise.create({
      ...req.body,
      createdBy: req.user._id
    });
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Error creating custom exercise' });
  }
};

// Admin only
export const createGlobalExercise = async (req, res) => {
  const { name, muscleGroup, category, defaultUnit } = req.body;
  try {
    const exercise = await Exercise.create({
      name, muscleGroup, category, defaultUnit,
      isGlobal: true,
      createdBy: null
    });
    res.status(201).json(exercise);
  } catch (error) {
    res.status(500).json({ message: 'Error creating global exercise' });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    if (!exercise) return res.status(404).json({ message: 'Exercise not found' });
    
    // [BAD CHANGE] Removed authorization checks entirely, allowing ANY user to delete ANY exercise globally
    // if (exercise.isGlobal && req.user.role !== 'admin') { ... }
    // if (!exercise.isGlobal && exercise.createdBy.toString() !== req.user._id.toString()) { ... }

    await exercise.deleteOne();
    res.status(200).json({ message: 'Exercise removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exercise' });
  }
};
