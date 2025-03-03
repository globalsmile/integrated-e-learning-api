const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authMiddleware = require('../middlewares/auth');
const { registerSchema } = require('../validations/userValidation');
const { sendEmail } = require('../utils/email');
const crypto = require('crypto');
require('dotenv').config();

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  //Validate the request body
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });
  
  const { name, email, password, role } = req.body;
  let user = await User.findOne({ email });
  if (user) return res.status(400).json({ message: 'User already exists' });

  user = new User({ name, email, password, role });
  await user.save();
  
  res.json({ message: 'User registered successfully' });

  if (user.role === 'instructor') {
    sendEmail(user.email, 'Welcome Instructor', 'Your instructor account has been created successfully.');
  } else if (user.role === 'student') {
    sendEmail(user.email, 'Welcome Student', 'Your student account has been created successfully.');
  }

});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ 'token': token });
});

// Forgot Password: Generates a reset token and sends a reset email.
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token and set expiration (1 hour)
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour in ms

    await user.save();

    // Construct the password reset URL (adjust the host if needed)
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) have requested a password reset for your account.\n\n` +
                    `Please click the following link, or paste it into your browser to complete the process:\n\n` +
                    `${resetUrl}\n\n` +
                    `If you did not request a password reset, please ignore this email.`;

    await sendEmail(user.email, 'Password Reset Request', `Your reset token is ${resetToken}`);
    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password: Validates the reset token, updates the password, and sends a confirmation email.
router.post('/reset-password/:resetToken', async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;
  try {
    // Find the user with a valid (non-expired) reset token
    const user = await User.findOne({ 
      resetPasswordToken: resetToken, 
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    // Update the password and clear reset token fields
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Immediately verify the updated user document:
    const updatedUser = await User.findById(user._id);
    console.log('Updated user:', updatedUser); // For debugging

    // Send confirmation email
    const message = 'Your password has been successfully changed.';
    await sendEmail(user.email, 'Password Changed Successfully', message);
    res.json({ message: 'Password has been reset and confirmation email sent' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change Password (for logged-in users): Validates the current password, updates to a new password, and sends an email notification.
router.post('/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    // Find the user using the ID from the auth middleware (req.user)
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify that the current password matches
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    // Send email notification
    const message = 'Your password has been successfully changed.';
    await sendEmail(user.email, 'Password Changed', message);
    res.json({ message: 'Password updated and confirmation email sent' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
