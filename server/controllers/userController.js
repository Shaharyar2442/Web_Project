import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const updateProfile = async (req, res) => {
  const { name, unitPreference, weeklyGoal, profilePhoto } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, unitPreference, weeklyGoal, profilePhoto },
      { new: true }
    ).select('-passwordHash');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
};

export const updateEmail = async (req, res) => {
  const { newEmail, password } = req.body;

  try {
    // [GOOD CHANGE] Robust email validation using a secure RFC 5322 regex pattern before updating email
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!newEmail || !emailRegex.test(newEmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists && emailExists._id.toString() !== user._id.toString()) {
      return res.status(409).json({ message: 'Email is already in use' });
    }

    user.email = newEmail;
    await user.save();

    const userResponse = { ...user._doc };
    delete userResponse.passwordHash;

    res.status(200).json(userResponse);
  } catch (error) {
    res.status(500).json({ message: 'Error updating email' });
  }
};

export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(12);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating password' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Soft delete: anonymize email and deactivate
    user.isActive = false;
    user.email = `deleted_user_${user._id}@anonymized.com`;
    // We can also anonymize the name if needed, but keeping it helps preserve some history context 
    // depending on privacy requirements. Let's anonymize name too just to be safe.
    user.name = `Deleted User`;
    user.profilePhoto = '';
    
    await user.save();

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting account' });
  }
};
