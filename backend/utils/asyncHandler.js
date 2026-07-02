/**
 * Wraps an async controller function and forwards any thrown errors
 * to Express's next() so they reach the centralized error handler.
 * Eliminates repetitive try/catch blocks in every controller.
 *
 * Usage: router.get('/path', asyncHandler(myController));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
