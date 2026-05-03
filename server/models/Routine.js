import mongoose from 'mongoose';

const setSchema = new mongoose.Schema({
  reps: { type: Number, default: 10, min: 1 },
  weight: { type: Number, default: 0 },
  restTimerSeconds: { type: Number, default: 90, min: 0 }
});

const routineExerciseSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  sets: [setSchema],
  order: { type: Number, required: true }
});

const routineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notes: { type: String, default: '' },
  exercises: [routineExerciseSchema]
}, { timestamps: true });

export default mongoose.model('Routine', routineSchema);
