const InterviewSession = require('../models/InterviewSession');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Feedback = require('../models/Feedback');
const asyncHandler = require('../utils/asyncHandler');
const { generateInterviewQuestions, generateAnswerFeedback } = require('../services/aiService');

// POST /api/interviews/sessions
exports.createSession = asyncHandler(async (req, res) => {
  const { role, experienceLevel, topic, questionCount } = req.body;  // ADD questionCount;

  const session = await InterviewSession.create({
    user: req.user._id,
    role,
    experienceLevel,
    topic,
    questionCount: questionCount || 5   // ADD THIS LINE
  });

  res.status(201).json({ session });
});

// POST /api/interviews/sessions/:sessionId/questions  (AI call)
exports.generateQuestions = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id });
  if (!session) return res.status(404).json({ message: 'Session not found' });

  // Prevent duplicate generation
  const existing = await Question.find({ session: sessionId });
  if (existing.length > 0) {
    return res.json({ questions: existing, message: 'Questions already generated' });
  }

  const raw = await generateInterviewQuestions({
    role: session.role,
    experienceLevel: session.experienceLevel,
    topic: session.topic,
    count: session.questionCount || 5
  });

  const questions = await Question.insertMany(
    raw.map((q, i) => ({
      session: sessionId,
      text: q.text,
      difficulty: q.difficulty || 'medium',
      orderIndex: i
    }))
  );

  await InterviewSession.findByIdAndUpdate(sessionId, { totalQuestions: questions.length });

  res.status(201).json({ questions });
});

// POST /api/interviews/sessions/:sessionId/questions/:questionId/answer
exports.submitAnswer = asyncHandler(async (req, res) => {
  const { sessionId, questionId } = req.params;
  const { text, timeTakenSeconds } = req.body;

  // Verify session ownership
  const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id });
  if (!session) return res.status(404).json({ message: 'Session not found' });

  const question = await Question.findOne({ _id: questionId, session: sessionId });
  if (!question) return res.status(404).json({ message: 'Question not found' });

  // Upsert answer (allow re-submission before session complete)
  let answer = await Answer.findOne({ session: sessionId, question: questionId });
  if (answer) {
    answer.text = text || '';
    answer.timeTakenSeconds = timeTakenSeconds || 0;
    await answer.save();
  } else {
    answer = await Answer.create({
      session: sessionId,
      question: questionId,
      user: req.user._id,
      text: text || '',
      timeTakenSeconds: timeTakenSeconds || 0
    });
  }

  // Generate AI feedback immediately after answer submission
  const feedbackData = await generateAnswerFeedback({
    question: question.text,
    answer: text,
    role: session.role,
    experienceLevel: session.experienceLevel,
    topic: session.topic
  });

  // Upsert feedback
  await Feedback.findOneAndUpdate(
    { answer: answer._id },
    {
      answer: answer._id,
      session: sessionId,
      user: req.user._id,
      score: feedbackData.score,
      strengths: feedbackData.strengths,
      weaknesses: feedbackData.weaknesses,
      suggestions: feedbackData.suggestions,
      rawAiResponse: feedbackData.rawAiResponse
    },
    { upsert: true, new: true }
  );

  res.json({ answer });
});

// PUT /api/interviews/sessions/:sessionId/complete
exports.completeSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id });
  if (!session) return res.status(404).json({ message: 'Session not found' });

  // Compute average score across all feedback in this session
  const feedbacks = await Feedback.find({ session: sessionId });
  const avg =
    feedbacks.length > 0
      ? feedbacks.reduce((sum, f) => sum + f.score, 0) / feedbacks.length
      : null;

  const updated = await InterviewSession.findByIdAndUpdate(
    sessionId,
    { status: 'completed', averageScore: avg, completedAt: new Date() },
    { new: true }
  );

  res.json({ session: updated });
});

// GET /api/interviews/sessions/:sessionId
exports.getSession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  const session = await InterviewSession.findOne({ _id: sessionId, user: req.user._id })
    .populate('questions')
    .lean();

  if (!session) return res.status(404).json({ message: 'Session not found' });

  // Attach answers with their feedback
  const answers = await Answer.find({ session: sessionId })
    .populate({ path: 'feedback', model: 'Feedback' })
    .lean();

  session.answers = answers;

  res.json({ session });
});

// GET /api/interviews/sessions
exports.getSessionHistory = asyncHandler(async (req, res) => {
  const sessions = await InterviewSession.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .lean();

  res.json({ sessions });
});
