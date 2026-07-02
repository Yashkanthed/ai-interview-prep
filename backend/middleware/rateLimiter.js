const rateLimit = require('express-rate-limit');

/**
 * Tight rate limiter for endpoints that make LLM API calls.
 * Prevents cost abuse (accidental or malicious).
 * 10 requests per user per 10 minutes.
 */
const aiRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,   // 10 minutes
  max: 10,
  keyGenerator: (req) => req.user?._id?.toString() || req.ip,
  message: { message: 'Too many AI requests. Please wait 10 minutes and try again.' },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * General auth rate limiter to prevent brute-force attacks.
 * 20 requests per IP per 15 minutes.
 */
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: 'Too many requests. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { aiRateLimiter, authRateLimiter };
