import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  muscleGroup: { 
    type: String, 
    enum: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Legs', 'Glutes', 'Core', 'Full Body', 'Cardio'],
    required: true 
  },
  category: { 
    type: String, 
    enum: ['Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight', 'Cardio'],
    required: true 
  },
  defaultUnit: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
  isGlobal: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
}, { timestamps: true });

export default mongoose.model('Exercise', exerciseSchema);
