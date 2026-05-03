import express from 'express';
import { getActiveSession, startSession, updateSession, finishSession, getHistory } from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/active', getActiveSession);
router.get('/history', getHistory);
router.post('/start', startSession);
router.put('/:id', updateSession);
router.post('/:id/finish', finishSession);

export default router;
