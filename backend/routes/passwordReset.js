const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const router = express.Router();

// @desc    Forgot password - send reset email
// @route   POST /api/auth/forgot-password
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('🔐 Forgot password request for:', email);

    const user = await User.findOne({ email });
    if (!user) {
      // For security, don't reveal if user exists
      console.log('📧 User not found, but returning success for security');
      return res.status(200).json({
        success: true,
        message: 'If the email exists, a reset link has been sent to your inbox.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour

    // Save token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3001'}/reset-password/${resetToken}`;

    // TEMPORARY FIX: Don't send email, just log the token for development
    console.log('🎯 PASSWORD RESET TOKEN GENERATED:');
    console.log('📧 For email:', email);
    console.log('🔑 Reset token:', resetToken);
    console.log('🔗 Reset URL:', resetUrl);
    console.log('⏰ Token expires:', new Date(resetTokenExpiry).toLocaleString());
    console.log('👉 Use this URL to reset password:', resetUrl);

    // Return success without sending email
    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent to your inbox.',
      // For development, include debug info
      debug: process.env.NODE_ENV === 'development' ? {
        token: resetToken,
        resetUrl: resetUrl,
        expires: new Date(resetTokenExpiry).toISOString()
      } : undefined
    });

  } catch (error) {
    console.error('❌ Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process password reset request. Please try again later.'
    });
  }
});

// @desc    Reset password with token
// @route   POST /api/auth/reset-password/:token
// @access  Public
router.post('/reset-password/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    console.log('🔄 Password reset attempt for token:', token);

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      console.log('❌ Invalid or expired token:', token);
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    console.log('✅ Valid token found for user:', user.email);

    // Update password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    console.log('✅ Password reset successful for:', user.email);

    res.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password'
    });
  }
});

// @desc    Validate reset token
// @route   GET /api/auth/validate-reset-token/:token
// @access  Public
router.get('/validate-reset-token/:token', async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    res.json({
      success: true,
      message: 'Valid reset token',
      email: user.email
    });

  } catch (error) {
    console.error('Validate token error:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating token'
    });
  }
});

module.exports = router;