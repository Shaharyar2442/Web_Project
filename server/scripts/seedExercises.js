import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Exercise from '../models/Exercise.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const exercises = [
  { name: 'Bench Press', category: 'Barbell', muscleGroup: 'Chest' },
  { name: 'Incline Bench Press', category: 'Barbell', muscleGroup: 'Chest' },
  { name: 'Decline Bench Press', category: 'Barbell', muscleGroup: 'Chest' },
  { name: 'Chest Fly', category: 'Dumbbell', muscleGroup: 'Chest' },
  { name: 'Cable Crossover', category: 'Cable', muscleGroup: 'Chest' },
  { name: 'Squat', category: 'Barbell', muscleGroup: 'Legs' },
  { name: 'Front Squat', category: 'Barbell', muscleGroup: 'Legs' },
  { name: 'Romanian Deadlift', category: 'Barbell', muscleGroup: 'Legs' },
  { name: 'Leg Press', category: 'Machine', muscleGroup: 'Legs' },
  { name: 'Leg Curl', category: 'Machine', muscleGroup: 'Legs' },
  { name: 'Leg Extension', category: 'Machine', muscleGroup: 'Legs' },
  { name: 'Deadlift', category: 'Barbell', muscleGroup: 'Back' },
  { name: 'Bent Over Row', category: 'Barbell', muscleGroup: 'Back' },
  { name: 'Pull-Up', category: 'Bodyweight', muscleGroup: 'Back' },
  { name: 'Lat Pulldown', category: 'Cable', muscleGroup: 'Back' },
  { name: 'Seated Cable Row', category: 'Cable', muscleGroup: 'Back' },
  { name: 'Overhead Press', category: 'Barbell', muscleGroup: 'Shoulders' },
  { name: 'Lateral Raise', category: 'Dumbbell', muscleGroup: 'Shoulders' },
  { name: 'Face Pull', category: 'Cable', muscleGroup: 'Shoulders' },
  { name: 'Arnold Press', category: 'Dumbbell', muscleGroup: 'Shoulders' },
  { name: 'Barbell Curl', category: 'Barbell', muscleGroup: 'Biceps' },
  { name: 'Dumbbell Curl', category: 'Dumbbell', muscleGroup: 'Biceps' },
  { name: 'Hammer Curl', category: 'Dumbbell', muscleGroup: 'Biceps' },
  { name: 'Preacher Curl', category: 'Machine', muscleGroup: 'Biceps' },
  { name: 'Skull Crusher', category: 'Barbell', muscleGroup: 'Triceps' },
  { name: 'Tricep Pushdown', category: 'Cable', muscleGroup: 'Triceps' },
  { name: 'Overhead Tricep Extension', category: 'Dumbbell', muscleGroup: 'Triceps' },
  { name: 'Dips', category: 'Bodyweight', muscleGroup: 'Triceps' },
  { name: 'Hip Thrust', category: 'Barbell', muscleGroup: 'Glutes' },
  { name: 'Bulgarian Split Squat', category: 'Dumbbell', muscleGroup: 'Legs' },
  { name: 'Calf Raise', category: 'Machine', muscleGroup: 'Legs' },
  { name: 'Plank', category: 'Bodyweight', muscleGroup: 'Core' },
  { name: 'Ab Wheel Rollout', category: 'Bodyweight', muscleGroup: 'Core' },
  { name: 'Hanging Leg Raise', category: 'Bodyweight', muscleGroup: 'Core' },
  { name: 'Cable Crunch', category: 'Cable', muscleGroup: 'Core' },
  { name: 'Farmer\'s Walk', category: 'Dumbbell', muscleGroup: 'Full Body' },
  { name: 'Shrugs', category: 'Barbell', muscleGroup: 'Shoulders' },
  { name: 'Incline Dumbbell Press', category: 'Dumbbell', muscleGroup: 'Chest' },
  { name: 'Pec Deck', category: 'Machine', muscleGroup: 'Chest' },
  { name: 'T-Bar Row', category: 'Barbell', muscleGroup: 'Back' },
  { name: 'Hack Squat', category: 'Machine', muscleGroup: 'Legs' },
  { name: 'Sumo Deadlift', category: 'Barbell', muscleGroup: 'Legs' },
  { name: 'Good Morning', category: 'Barbell', muscleGroup: 'Legs' },
  { name: 'Seated Dumbbell Press', category: 'Dumbbell', muscleGroup: 'Shoulders' },
  { name: 'Push-Up', category: 'Bodyweight', muscleGroup: 'Chest' },
  { name: 'Chin-Up', category: 'Bodyweight', muscleGroup: 'Biceps' },
  { name: 'Dumbbell Row', category: 'Dumbbell', muscleGroup: 'Back' },
  { name: 'Rope Pushdown', category: 'Cable', muscleGroup: 'Triceps' },
  { name: 'EZ Bar Curl', category: 'Barbell', muscleGroup: 'Biceps' },
  { name: 'Box Jump', category: 'Bodyweight', muscleGroup: 'Legs' }
].map(ex => ({ ...ex, isGlobal: true, defaultUnit: 'kg' }));

const seedDB = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for Seeding');
    
    await Exercise.deleteMany({ isGlobal: true });
    await Exercise.insertMany(exercises);
    
    console.log('50 Global exercises seeded successfully!');
    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDB();
