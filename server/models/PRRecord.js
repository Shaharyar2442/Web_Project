import mongoose from 'mongoose';

const prRecordSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  exerciseName: { type: String, required: true },
  weight: { type: Number, required: true },
  reps: { type: Number, required: true },
  estimatedOneRM: { type: Number, required: true },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

prRecordSchema.index({ user: 1, exercise: 1 }, { unique: true });

const PRRecord = mongoose.model('PRRecord', prRecordSchema);
export default PRRecord;
