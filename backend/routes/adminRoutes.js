const router = require('express').Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { updateRoleSchema } = require('../utils/schemas');

// All admin routes: must be authenticated AND be an admin
router.use(authenticate, authorize('admin'));

router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserById);
router.put('/users/:userId/role', validate(updateRoleSchema), adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);
router.get('/sessions', adminController.getAllSessions);

module.exports = router;
