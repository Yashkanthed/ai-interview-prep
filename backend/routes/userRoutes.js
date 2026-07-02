const router = require('express').Router();
const userController = require('../controllers/userController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { updateProfileSchema } = require('../utils/schemas');

// All user routes require authentication
router.use(authenticate);

router.get('/me', userController.getProfile);
router.put('/me', validate(updateProfileSchema), userController.updateProfile);

module.exports = router;
