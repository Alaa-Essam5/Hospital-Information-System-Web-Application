const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).json({ message: 'Invalid password' });

    res.json({ 
      role: user.role,
      userId: user._id,
      name: `${user.first_name} ${user.last_name}`,
     }); // Return the user's role
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.signup = async (req, res) => {
  const { first_name, last_name, birth_date, gender, email, phone_number, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const newUser = new User({
      first_name,
      last_name,
      birth_date,
      gender,
      email,
      phone_number,
      role: role || 'Patient', // Use the role from the request body, or default to 'Patient'
      password_hash: password, // Password will be hashed by the pre-save hook
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};