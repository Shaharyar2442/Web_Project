import User from '../models/User.js';
import Session from '../models/Session.js';
import Exercise from '../models/Exercise.js';

export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalGlobalExercises = await Exercise.countDocuments({ isGlobal: true });
    
    // Aggregate completed sessions
    const completedSessions = await Session.find({ isActive: false });
    const totalCompletedSessions = completedSessions.length;
    const totalVolume = completedSessions.reduce((sum, session) => sum + (session.totalVolume || 0), 0);

    res.status(200).json({
      totalUsers,
      totalGlobalExercises,
      totalCompletedSessions,
      totalVolume
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching platform stats' });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

export const updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot deactivate your own account' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    ).select('-passwordHash');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-passwordHash');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
};
