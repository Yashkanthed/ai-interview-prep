const User = require('../models/User');
const InterviewSession = require('../models/InterviewSession');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/admin/users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  res.json({ users, total: users.length });
});

// GET /api/admin/users/:userId
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId).lean();
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user });
});

// PUT /api/admin/users/:userId/role
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  // Prevent admin from accidentally demoting themselves
  if (req.params.userId === req.user._id.toString() && role !== 'admin') {
    return res.status(400).json({ message: 'Cannot change your own admin role' });
  }

  const user = await User.findByIdAndUpdate(
    req.params.userId,
    { role },
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).json({ message: 'User not found' });

  res.json({ user, message: `Role updated to ${role}` });
});

// DELETE /api/admin/users/:userId
exports.deleteUser = asyncHandler(async (req, res) => {
  if (req.params.userId === req.user._id.toString()) {
    return res.status(400).json({ message: 'Cannot delete your own account via admin panel' });
  }
  const user = await User.findByIdAndDelete(req.params.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User deleted successfully' });
});

// GET /api/admin/sessions
exports.getAllSessions = asyncHandler(async (req, res) => {
  const sessions = await InterviewSession.find()
    .populate('user', 'name email experienceLevel')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ sessions, total: sessions.length });
});
