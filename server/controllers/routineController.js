import Routine from '../models/Routine.js';

export const getRoutines = async (req, res) => {
  try {
    const routines = await Routine.find({ user: req.user._id })
      .populate('exercises.exercise')
      .sort({ updatedAt: -1 });
    res.status(200).json(routines);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routines' });
  }
};

export const getRoutineById = async (req, res) => {
  try {
    const routine = await Routine.findOne({ _id: req.params.id, user: req.user._id })
      .populate('exercises.exercise');
    if (!routine) return res.status(404).json({ message: 'Routine not found' });
    res.status(200).json(routine);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching routine' });
  }
};

export const createRoutine = async (req, res) => {
  const { name, notes, exercises } = req.body;
  try {
    const routine = await Routine.create({
      name,
      notes,
      exercises,
      user: req.user._id
    });
    res.status(201).json(routine);
  } catch (error) {
    res.status(500).json({ message: 'Error creating routine' });
  }
};

export const updateRoutine = async (req, res) => {
  const { name, notes, exercises } = req.body;
  try {
    const routine = await Routine.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, notes, exercises },
      { new: true }
    );
    if (!routine) return res.status(404).json({ message: 'Routine not found' });
    res.status(200).json(routine);
  } catch (error) {
    res.status(500).json({ message: 'Error updating routine' });
  }
};

export const deleteRoutine = async (req, res) => {
  try {
    const routine = await Routine.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!routine) return res.status(404).json({ message: 'Routine not found' });
    res.status(200).json({ message: 'Routine removed' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting routine' });
  }
};
