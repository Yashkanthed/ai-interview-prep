/**
 * Role-based authorization middleware factory.
 * Usage: authorize('admin') or authorize('admin', 'moderator')
 * Must be used AFTER the authenticate middleware.
 */
const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return res.status(403).json({
      message: `Access denied. Required role(s): ${roles.join(', ')}`
    });
  }
  next();
};

module.exports = authorize;
