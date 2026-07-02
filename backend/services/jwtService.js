const jwt = require('jsonwebtoken');

/**
 * Generate a short-lived access token (default 15 min).
 * Only contains the user ID to keep payloads small.
 */
const generateAccessToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m'
  });

/**
 * Generate a long-lived refresh token (default 7 days).
 * Sent as an httpOnly cookie; also stored in the User document for revocation.
 */
const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });

/**
 * Verify a refresh token and return its decoded payload.
 * Throws if the token is invalid or expired.
 */
const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

/**
 * Cookie options for the refresh token.
 * httpOnly prevents JS access; secure enforces HTTPS in production.
 */
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days in ms
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  REFRESH_COOKIE_OPTIONS
};
