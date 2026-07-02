/**
 * Express middleware that validates req.body against a Joi schema.
 * If validation fails it returns 400 with clear field-level messages.
 *
 * Usage:
 *   router.post('/register', validate(registerSchema), authController.register);
 */
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, {
    abortEarly: false,   // collect ALL errors, not just first
    stripUnknown: true   // silently drop fields not in schema
  });

  if (error) {
    const messages = error.details.map((d) => d.message).join('. ');
    return res.status(400).json({ message: messages });
  }
  next();
};

module.exports = validate;
