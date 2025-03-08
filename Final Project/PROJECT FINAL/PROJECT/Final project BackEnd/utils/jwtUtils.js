const jwt = require('jsonwebtoken');

const generateToken = (user_id, role) => {
  return jwt.sign({ user_id, role }, 'your-secret-key', { expiresIn: '1h' });
};

module.exports = { generateToken };