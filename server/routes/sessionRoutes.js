import express from 'express';
import { getActiveSession, startSession, updateSession, finishSession, getHistory, deleteSession } from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/active', getActiveSession);
router.get('/history', getHistory);
router.post('/start', startSession);
router.put('/:id', updateSession);
router.delete('/:id', deleteSession);
router.post('/:id/finish', finishSession);

export default router;
