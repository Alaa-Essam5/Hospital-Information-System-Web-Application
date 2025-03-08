

const User = require('../models/User');

exports.authorize = (roles) => {
  return async (req, res, next) => {
    const email = req.query.email 
    // || req.headers.email; // Get email from query or headers

    try {
      // Find the user in the database
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: 'User not found' });

      // Check if the user's role is allowed
      if (!roles.includes(user.role)) {
        return res.status(403).json({ message: 'Your role isnt allowed to access' });
      }

      // Attach the user to the request object for later use (optional)
      req.user = user;
      next();
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};