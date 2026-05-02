import express from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  logout,
  refresh,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
  ],
  register
);

router.post('/login', login);
router.post('/logout', logout);
router.get('/refresh', refresh);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
