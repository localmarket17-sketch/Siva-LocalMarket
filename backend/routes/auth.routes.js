const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');

// Auth routes
router.post('/login', AuthController.login);
router.post('/verify-otp', AuthController.verifyOtp);

// ✅ New: Send OTP before register
router.post('/send-otp', AuthController.sendOtp);

// ✅ Logout route — clears the cookie or session
router.post('/logout', AuthController.logout);

// ✅ Session check route — used to verify current logged-in user (Frontend: AuthContext)
router.get('/session', AuthController.getSessionUser);

module.exports = router;
