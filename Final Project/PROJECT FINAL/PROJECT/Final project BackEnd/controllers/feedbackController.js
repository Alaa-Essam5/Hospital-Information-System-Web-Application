const Feedback = require('../models/Feedback');

// Get all feedback (accessible to Admins or Doctors)
exports.getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().populate('patient_id', 'first_name last_name');
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Add feedback (accessible to Patients)
exports.addFeedback = async (req, res) => {
  const { name, email,message } = req.body;

  try {
    const newFeedback = new Feedback({ name, email, message });
    await newFeedback.save();
    res.status(201).json({ message: 'Feedback added successfully', feedback: newFeedback });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};