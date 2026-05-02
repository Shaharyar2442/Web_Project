import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  unitPreference: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
  weeklyGoal: { type: Number, default: 3 },
  profilePhoto: { type: String },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
