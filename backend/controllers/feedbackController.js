const Feedback = require('../models/Feedback');
const Answer = require('../models/Answer');
const InterviewSession = require('../models/InterviewSession');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/feedback/:answerId
exports.getFeedback = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findOne({
    answer: req.params.answerId,
    user: req.user._id
  });
  if (!feedback) return res.status(404).json({ message: 'Feedback not found' });
  res.json({ feedback });
});

// GET /api/feedback/dashboard
exports.getDashboard = asyncHandler(async (req, res) => {
  const sessions = await InterviewSession.find({
    user: req.user._id,
    status: 'completed'
  })
    .sort({ createdAt: 1 })
    .lean();

  const overall =
    sessions.length > 0
      ? sessions.reduce((s, sess) => s + (sess.averageScore || 0), 0) / sessions.length
      : null;

  res.json({ sessions, overallAverage: overall });
});
