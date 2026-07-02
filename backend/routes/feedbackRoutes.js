const router = require('express').Router();
const feedbackController = require('../controllers/feedbackController');
const authenticate = require('../middleware/authenticate');

router.use(authenticate);

router.get('/dashboard', feedbackController.getDashboard);
router.get('/:answerId', feedbackController.getFeedback);

module.exports = router;
