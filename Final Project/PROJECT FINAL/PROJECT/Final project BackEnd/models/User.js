// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  birth_date: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  email: { type: String, required: true, unique: true },
  phone_number: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Doctor', 'Patient'], required: true },
  level_of_expertise: { type: String }, // Only for Doctors
  password_hash: { type: String, required: true },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password_hash')) {
    this.password_hash = await bcrypt.hash(this.password_hash, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;