import Exercise from '../models/Exercise.js';

export const getExercises = async (req, res) => {
  try {
    const exercises = await Exercise.find({
      $or: [{ isGlobal: true }, { createdBy: req.user._id }]
    }).sort({ name: 1 });
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercises' });
  }
};

export const createCustomExercise = async (req, res) => {
  try {
    // [BAD CHANGE] Mass Assignment vulnerability: 
    // Allowing arbitrary properties from req.body to be saved to the database.
    // A standard user can send { isGlobal: true, createdBy: null } in the POST request to escalate privileges.
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
    
    // Admins can delete global, users can delete their own
    if (exercise.isGlobal && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete global exercises' });
    }
    
    if (!exercise.isGlobal && exercise.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this exercise' });
    }

    await exercise.deleteOne();
    res.status(200).json({ message: 'Exercise removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting exercise' });
  }
};
