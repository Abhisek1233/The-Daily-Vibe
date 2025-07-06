import express from 'express';
import {
  register,
  verify,
  login,
  logout,
  getMe,
  forgot,
  reset,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.get('/verify-email', verify);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.post('/forgot-password', forgot);
router.post('/reset-password', reset);

export default router;
