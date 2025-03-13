const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', require('../controllers/passwordController').forgotPassword);
router.put('/verify-reset-password/:token', require('../controllers/passwordController').verifyResetPassword);

module.exports = router;
