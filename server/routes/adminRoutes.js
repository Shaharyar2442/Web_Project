import express from 'express';
import { getPlatformStats, getUsers, updateUserStatus, updateUserRole } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes here are protected and require admin role
router.use(protect, admin);

router.get('/stats', getPlatformStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/role', updateUserRole);

export default router;
