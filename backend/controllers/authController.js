const crypto = require('crypto');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  REFRESH_COOKIE_OPTIONS
} = require('../services/jwtService');
const { sendVerificationOtp, sendPasswordResetOtp } = require('../services/emailService');

// Generate a 6-digit OTP
const generateOtp = () =>
  crypto.randomInt(100000, 1000000).toString();
const safeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  experienceLevel: user.experienceLevel,
  isEmailVerified: user.isEmailVerified,
  createdAt: user.createdAt
});

// POST /api/auth/register
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, experienceLevel } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email already registered' });

  const otp = generateOtp();
  const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const user = await User.create({
    name,
    email,
    password,
    experienceLevel: experienceLevel || '',
    emailOtp: otp,
    emailOtpExpires: otpExpires,
    isEmailVerified: false
  });

  try {
  await sendVerificationOtp({ to: email, name, otp });
} catch (mailErr) {
  console.error('OTP email failed:', mailErr.message);
  // Delete the user since email failed
  await User.findByIdAndDelete(user._id);
  return res.status(500).json({
    message: 'Could not send OTP email. Please check your email address and try again.'
  });
}

  res.status(201).json({
    message: 'Account created! Check your email for the 6-digit OTP.',
    email: user.email,
    requiresVerification: true
  });
});

// POST /api/auth/verify-otp
exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email })
    .select('+emailOtp +emailOtpExpires +refreshTokens');

  if (!user) return res.status(404).json({ message: 'User not found' });

  if (user.isEmailVerified) {
    return res.status(400).json({ message: 'Email already verified. Please login.' });
  }

  if (!user.emailOtp || user.emailOtp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  if (user.emailOtpExpires < new Date()) {
    return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
  }

  user.isEmailVerified = true;
  user.emailOtp = undefined;
  user.emailOtpExpires = undefined;

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  user.refreshTokens = [...(user.refreshTokens || []), refreshToken].slice(-5);
  await user.save();

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  res.json({ accessToken, user: safeUser(user) });
});

// POST /api/auth/resend-otp
exports.resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email })
    .select('+emailOtp +emailOtpExpires');

  if (!user) return res.status(404).json({ message: 'User not found' });
  if (user.isEmailVerified) {
    return res.status(400).json({ message: 'Email already verified' });
  }

  const otp = generateOtp();
  user.emailOtp = otp;
  user.emailOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  try {
    await sendVerificationOtp({ to: email, name: user.name, otp });
  } catch (mailErr) {
    return res.status(500).json({ message: 'Could not send OTP. Try again.' });
  }

  res.json({ message: 'New OTP sent to your email.' });
});

// POST /api/auth/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password +refreshTokens');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  if (!user.isEmailVerified) {
    return res.status(403).json({
      message: 'Please verify your email first.',
      requiresVerification: true,
      email: user.email
    });
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  const tokens = [...(user.refreshTokens || []), refreshToken].slice(-5);
  user.refreshTokens = tokens;
  await user.save();

  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);
  res.json({ accessToken, user: safeUser(user) });
});

// POST /api/auth/refresh
exports.refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) return res.status(401).json({ message: 'No refresh token' });

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const user = await User.findById(decoded.id).select('+refreshTokens');
  if (!user || !user.refreshTokens.includes(token)) {
    return res.status(401).json({ message: 'Refresh token revoked' });
  }

  const newRefreshToken = generateRefreshToken(user._id);
  user.refreshTokens = user.refreshTokens.filter((t) => t !== token);
  user.refreshTokens.push(newRefreshToken);
  await user.save();

  res.cookie('refreshToken', newRefreshToken, REFRESH_COOKIE_OPTIONS);
  res.json({ accessToken: generateAccessToken(user._id) });
});

// POST /api/auth/logout
exports.logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await User.findOneAndUpdate(
      { refreshTokens: token },
      { $pull: { refreshTokens: token } }
    );
  }
  res.clearCookie('refreshToken');
  res.json({ message: 'Logged out successfully' });
});

// POST /api/auth/forgot-password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email })
    .select('+passwordResetOtp +passwordResetOtpExpires');

  if (!user) {
    return res.json({ message: 'If that email exists, an OTP was sent.' });
  }

  const otp = generateOtp();
  user.passwordResetOtp = otp;
  user.passwordResetOtpExpires = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  try {
    await sendPasswordResetOtp({ to: email, name: user.name, otp });
  } catch (mailErr) {
    console.error('Reset OTP email failed:', mailErr.message);
    return res.status(500).json({ message: 'Could not send OTP. Try again later.' });
  }

  res.json({ message: 'If that email exists, an OTP was sent.' });
});

// POST /api/auth/verify-reset-otp
exports.verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email })
    .select('+passwordResetOtp +passwordResetOtpExpires');

  if (!user) return res.status(404).json({ message: 'User not found' });

  if (!user.passwordResetOtp || user.passwordResetOtp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  if (user.passwordResetOtpExpires < new Date()) {
    return res.status(400).json({ message: 'OTP expired. Please request a new one.' });
  }

  // Replace OTP with a one-time reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  user.passwordResetOtp = resetToken;
  user.passwordResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  res.json({ resetToken, message: 'OTP verified. You can now reset your password.' });
});

// POST /api/auth/reset-password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, resetToken, password } = req.body;

  const user = await User.findOne({ email })
    .select('+passwordResetOtp +passwordResetOtpExpires +refreshTokens');

  if (
    !user ||
    !user.passwordResetOtp ||
    user.passwordResetOtp !== resetToken ||
    user.passwordResetOtpExpires < new Date()
  ) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  user.password = password;
  user.passwordResetOtp = undefined;
  user.passwordResetOtpExpires = undefined;
  user.refreshTokens = [];
  await user.save();

  res.json({ message: 'Password reset successful. Please log in.' });
});