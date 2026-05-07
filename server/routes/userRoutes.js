import express from 'express';
import { updateProfile, updateEmail, updatePassword, deleteAccount } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.put('/email', updateEmail);
router.put('/password', updatePassword);
router.delete('/account', deleteAccount);

export default router;
