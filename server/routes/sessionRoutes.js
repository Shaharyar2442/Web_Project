import express from 'express';
import { getActiveSession, startSession, updateSession } from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/active', getActiveSession);
router.post('/start', startSession);
router.put('/:id', updateSession);

export default router;
