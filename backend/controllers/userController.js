const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/users/me
exports.getProfile = asyncHandler(async (req, res) => {
  // req.user is attached by authenticate middleware (already sanitized)
  res.json({ user: req.user });
});

// PUT /api/users/me
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, experienceLevel } = req.body;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (experienceLevel !== undefined) updateFields.experienceLevel = experienceLevel;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    updateFields,
    { new: true, runValidators: true }
  );

  res.json({ user });
});
