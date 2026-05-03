import mongoose from 'mongoose';

const sessionSetSchema = new mongoose.Schema({
  reps: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false }
});

const sessionExerciseSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  sets: [sessionSetSchema],
  order: { type: Number, required: true }
});

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  routine: { type: mongoose.Schema.Types.ObjectId, ref: 'Routine', default: null },
  name: { type: String, required: true },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  exercises: [sessionExerciseSchema]
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema);
