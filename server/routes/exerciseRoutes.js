import express from 'express';
import { getExercises, createCustomExercise, createGlobalExercise, deleteExercise } from '../controllers/exerciseController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getExercises)
  .post(createCustomExercise);

router.post('/global', admin, createGlobalExercise);
router.delete('/:id', deleteExercise);

export default router;
