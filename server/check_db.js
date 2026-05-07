import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const cleanup = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const Session = mongoose.model('Session', new mongoose.Schema({}, { strict: false }));
    
    const result = await Session.deleteMany({ isActive: true });
    console.log(`Deleted ${result.deletedCount} phantom active sessions.`);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

cleanup();
