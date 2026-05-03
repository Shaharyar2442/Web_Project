import express from 'express';
import { getRoutines, createRoutine, getRoutineById, updateRoutine, deleteRoutine } from '../controllers/routineController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getRoutines)
  .post(createRoutine);

router.route('/:id')
  .get(getRoutineById)
  .put(updateRoutine)
  .delete(deleteRoutine);

export default router;
