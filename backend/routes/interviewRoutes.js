const router = require('express').Router();
const interviewController = require('../controllers/interviewController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { aiRateLimiter } = require('../middleware/rateLimiter');
const { createSessionSchema, submitAnswerSchema } = require('../utils/schemas');

router.use(authenticate);

// Session management
router.post('/sessions', validate(createSessionSchema), interviewController.createSession);
router.get('/sessions', interviewController.getSessionHistory);
router.get('/sessions/:sessionId', interviewController.getSession);
router.put('/sessions/:sessionId/complete', interviewController.completeSession);

// AI-powered endpoints get the stricter rate limiter
router.post(
  '/sessions/:sessionId/questions',
  aiRateLimiter,
  interviewController.generateQuestions
);

router.post(
  '/sessions/:sessionId/questions/:questionId/answer',
  aiRateLimiter,
  validate(submitAnswerSchema),
  interviewController.submitAnswer
);

module.exports = router;
