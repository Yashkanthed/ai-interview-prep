const router = require('express').Router();
const authController = require('../controllers/authController');
const validate = require('../middleware/validate');
const { authRateLimiter } = require('../middleware/rateLimiter');
const Joi = require('joi');
const { registerSchema, loginSchema, forgotPasswordSchema } = require('../utils/schemas');

const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).pattern(/^\d+$/).required()
});

const verifyResetOtpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().length(6).pattern(/^\d+$/).required()
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
  resetToken: Joi.string().required(),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[A-Za-z])(?=.*\d)/)
    .required()
});

const resendOtpSchema = Joi.object({
  email: Joi.string().email().required()
});

router.use(authRateLimiter);

router.post('/register',          validate(registerSchema),        authController.register);
router.post('/verify-otp',        validate(otpSchema),             authController.verifyOtp);
router.post('/resend-otp',        validate(resendOtpSchema),       authController.resendOtp);
router.post('/login',             validate(loginSchema),           authController.login);
router.post('/refresh',                                            authController.refresh);
router.post('/logout',                                             authController.logout);
router.post('/forgot-password',   validate(forgotPasswordSchema),  authController.forgotPassword);
router.post('/verify-reset-otp',  validate(verifyResetOtpSchema),  authController.verifyResetOtp);
router.post('/reset-password',    validate(resetPasswordSchema),   authController.resetPassword);

module.exports = router;