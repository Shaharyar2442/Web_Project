import express from 'express';
import { getPRs, getChartsData } from '../controllers/progressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

router.get('/prs', getPRs);
router.get('/charts/:exerciseId', getChartsData);

export default router;
