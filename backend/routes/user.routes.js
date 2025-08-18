const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Protect all user routes
router.use(authMiddleware);

// Profile routes
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.delete('/profile', UserController.deleteProfile);

// Cart routes
router.get('/cart', UserController.getCart); // ✅ Add this in user.controller.js

// Address routes
router.get('/addresses', UserController.getAddresses); // ✅ Add this too

module.exports = router;
