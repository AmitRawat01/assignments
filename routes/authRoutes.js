import express from 'express';
import authController from '../controllers/authController';
import { forgotPassword, verifyResetPassword } from '../controllers/passwordController';

const router = express.Router();

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', forgotPassword);
router.put('/verify-reset-password/:token', verifyResetPassword);

export default router;
