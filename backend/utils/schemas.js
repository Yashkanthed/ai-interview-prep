const Joi = require('joi');

// ── Auth Schemas ───────────────────────────────────────────────────────────────

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
    .required()
    .messages({
      'string.pattern.base': 'Password must contain at least one letter and one number'
    }),
  experienceLevel: Joi.string()
    .valid('fresher', '0-1', '1-3', '3-5', '5-8', '8+', '')
    .optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required()
});

const resetPasswordSchema = Joi.object({
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
    .required()
});

// ── User Schemas ───────────────────────────────────────────────────────────────

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  experienceLevel: Joi.string()
    .valid('fresher', '0-1', '1-3', '3-5', '5-8', '8+', '')
    .optional()
});

// ── Interview Schemas ──────────────────────────────────────────────────────────

const createSessionSchema = Joi.object({
  role: Joi.string().min(2).max(100).required(),
  experienceLevel: Joi.string()
    .valid('fresher', '0-1', '1-3', '3-5', '5-8', '8+')
    .required(),
  topic: Joi.string().min(2).max(100).required()
});

const submitAnswerSchema = Joi.object({
  text: Joi.string().max(5000).allow('').optional(),
  timeTakenSeconds: Joi.number().integer().min(0).optional()
});

// ── Admin Schemas ──────────────────────────────────────────────────────────────

const updateRoleSchema = Joi.object({
  role: Joi.string().valid('user', 'admin').required()
});

module.exports = {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
  createSessionSchema,
  submitAnswerSchema,
  updateRoleSchema
};
