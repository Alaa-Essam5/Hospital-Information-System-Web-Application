const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');
const { authorize } = require('../middleware/authMiddleware');

// Get all feedback (accessible to Admins or Doctors)
router.get('/feedback', authorize(['Admin', 'Doctor']), feedbackController.getFeedback); // only admins can view feedback

// Add feedback (accessible to Patients)
router.post('/feedback', feedbackController.addFeedback); //email as a query parameter to check that it is a patient ,patient needs to provide his id for the feedback

module.exports = router;