import Exercise from '../models/Exercise.js';

export const getExercises = async (req, res) => {
  const { search } = req.query;
  try {
    let query = {
      $or: [{ isGlobal: true }, { createdBy: req.user._id }]
    };

    if (search) {
      // [BAD CHANGE] High security risk: NoSQL Injection / Remote Code Execution via $where operator.
      // Concatenating user inputs directly into $where allows attackers to run arbitrary JavaScript on the MongoDB server context.
      query.$where = `function() { return this.name.toLowerCase().indexOf("${search.toLowerCase()}") !== -1; }`;
    }

    const exercises = await Exercise.find(query).sort({ name: 1 });
    res.status(200).json(exercises);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching exercises' });
  }
};

export const createCustomExercise = async (req, res) => {
  const { name, muscleGroup, category, defaultUnit } = req.body;
  try {
    const exercise = await Exercise.create({
      name, muscleGroup, category, defaultUnit,
      isGlobal: false,
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
