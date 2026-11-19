const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Resume = require('../models/Resume');

// Generate JWT Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    // Password length validation
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    // Confirm password check
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Check duplicate email
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Store user in database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: 'Registration successful.',
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data.' });
    }

  } catch (error) {
    console.error('Registration Controller Error:', error);
    res.status(500).json({ success: false, message: 'Server Error during registration.' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password.' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error('Login Controller Error:', error);
    res.status(500).json({ success: false, message: 'Server Error during login.' });
  }
};

// @desc    Get user profile data
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    // Calculate total analyses count
    const totalAnalyses = await Resume.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        totalAnalyses,
      },
    });

  } catch (error) {
    console.error('Profile Controller Error:', error);
    res.status(500).json({ success: false, message: 'Server Error retrieving profile.' });
  }
};

// @desc    Request password reset (Forgot Password)
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Please enter your email.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email.' });
    }

    // Generate random 6-digit reset PIN
    const resetPin = Math.floor(100000 + Math.random() * 900000).toString();

    // Store PIN and expiration date (10 minutes)
    user.resetPasswordToken = resetPin;
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Log the PIN to console (simulating sending it to the user's email)
    console.log('\n=============================================');
    console.log(`[PASSWORD RESET PIN FOR ${email}]: ${resetPin}`);
    console.log('=============================================\n');

    res.status(200).json({
      success: true,
      message: 'Password reset code has been sent. Please check your console.',
    });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ success: false, message: 'Server Error during forgot password request.' });
  }
};

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, token, newPassword, confirmPassword } = req.body;

    if (!email || !token || !newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match.' });
    }

    // Find user by email and matching token, and check if token is not expired
    const user = await User.findOne({
      email,
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset code.' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear reset password fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. You can now login with your new password.',
    });

  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ success: false, message: 'Server Error during password reset.' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  forgotPassword,
  resetPassword,
};
