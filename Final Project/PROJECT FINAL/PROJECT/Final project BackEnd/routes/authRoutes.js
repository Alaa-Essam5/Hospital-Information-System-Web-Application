const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Define authentication routes
router.post('/login', authController.login); // POST /api/auth/login
router.post('/signup', authController.signup); // POST /api/auth/signup

module.exports = router;