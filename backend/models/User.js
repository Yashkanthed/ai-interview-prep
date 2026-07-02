const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    experienceLevel: {
      type: String,
      enum: ['fresher', '0-1', '1-3', '3-5', '5-8', '8+', ''],
      default: ''
    },
    isEmailVerified: { type: Boolean, default: false },

    // OTP for email verification
    emailOtp: { type: String, select: false },
    emailOtpExpires: { type: Date, select: false },

    // OTP for password reset
    passwordResetOtp: { type: String, select: false },
    passwordResetOtpExpires: { type: Date, select: false },

    // Refresh tokens stored server-side for revocation
    refreshTokens: { type: [String], select: false }
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);