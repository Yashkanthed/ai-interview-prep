/**
 * Centralized error handling middleware.
 * All errors thrown with next(err) or unhandled promise rejections land here.
 * Returns a consistent JSON shape so the frontend can reliably parse errors.
 */
const errorHandler = (err, req, res, next) => {
  // Log in development for easier debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error(`[${new Date().toISOString()}] ERROR:`, err.message);
    if (err.stack) console.error(err.stack);
  }

  // Mongoose duplicate key (e.g. email already exists)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ message: `${field} already exists` });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join('. ') });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    message: err.message || 'Internal server error'
  });
};

module.exports = errorHandler;
