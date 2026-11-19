const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Route for user registration
router.post('/register', registerUser);

// Route for user login
router.post('/login', loginUser);

// Route to get user profile details
router.get('/profile', protect, getUserProfile);

// Route to request password reset code
router.post('/forgot-password', forgotPassword);

// Route to reset password with code
router.post('/reset-password', resetPassword);

module.exports = router;
