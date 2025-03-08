const User = require('../models/User');
const bcrypt = require('bcrypt');

// Get admin data (name, email, phone)
exports.getAdminData = async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  if (!email) {
    return res.status(400).json({ message: 'Email is required in query parameters' });
  }

  try {
    // Find the admin by email
    const admin = await User.findOne({ email, role: 'Admin' }, { first_name: 1, last_name: 1, email: 1, phone_number: 1 });

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Return admin data
    res.json({
      name: `${admin.first_name} ${admin.last_name}`,
      email: admin.email,
      phone: admin.phone_number,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Get doctor data (name, email, phone, birth date, level of expertise)
exports.getDoctorData = async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  if (!email) {
    return res.status(400).json({ message: 'Email is required in query parameters' });
  }

  try {
    // Find the doctor by email
    const doctor = await User.findOne(
        { email, role: 'Doctor' },
        { first_name: 1, last_name: 1, email: 1, phone_number: 1, birth_date: 1, level_of_expertise: 1,_id:1 }
    );

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Return doctor data
    res.json({
      ID: doctor._id,
      name: `${doctor.first_name} ${doctor.last_name}`,
      email: doctor.email,
      phone: doctor.phone_number,
      birthDate: doctor.birth_date,
      expertiseLevel: doctor.level_of_expertise
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getPatientData = async (req, res) => {
  const { email } = req.query; // Get email from query parameters

  if (!email) {
    return res.status(400).json({ message: 'Email is required in query parameters' });
  }

  try {
    // Find the patient by email
    const patient = await User.findOne({ email, role: 'Patient' }, { first_name: 1, last_name: 1, email: 1, phone_number: 1, gender: 1 });

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Return patient data
    res.json({
      name: `${patient.first_name} ${patient.last_name}`,
      email: patient.email,
      phone: patient.phone_number, // Fixed typo here
      gender: patient.gender,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, { password_hash: 0 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a doctor (Admin only)
exports.addDoctor = async (req, res) => {
  const { first_name, last_name, birth_date, gender, email, phone_number, level_of_expertise, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      first_name,
      last_name,
      birth_date,
      gender,
      email,
      phone_number,
      role: 'Doctor',
      level_of_expertise,
      password_hash: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: 'Doctor added successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user (Admin only)
exports.deleteUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    await User.findByIdAndDelete(user_id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user information (Admin, Doctor, or Patient)
exports.updateUser = async (req, res) => {
  const { user_id } = req.params;
  const { first_name, last_name, birth_date, email, phone_number, gender } = req.body;
  console.log(user_id);
  console.log("user_id");


  try {
    const user = await User.findById(user_id);
    if (!user) return res.status(404).json({ message: 'User not found',id:user_id });

    // Role-specific restrictions
    if (user.role === 'Doctor') {
      // Doctors can only update birth_date, email, and phone_number
      user.birth_date = birth_date || user.birth_date;
      user.email = email || user.email;
      user.phone_number = phone_number || user.phone_number;
    } else if (user.role === 'Patient') {
      // Patients can update all fields except gender
      user.first_name = first_name || user.first_name;
      user.last_name = last_name || user.last_name;
      user.birth_date = birth_date || user.birth_date;
      user.email = email || user.email;
      user.phone_number = phone_number || user.phone_number;
    } else if (user.role === 'Admin') {
      // Admins can update all fields
      user.first_name = first_name || user.first_name;
      user.last_name = last_name || user.last_name;
      user.birth_date = birth_date || user.birth_date;
      user.email = email || user.email;
      user.phone_number = phone_number || user.phone_number;
      user.gender = gender || user.gender;
    }

    await user.save();
    res.json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all patients (for Doctors, Admins)
exports.getAllPatients = async (req, res) => {
  try {
    // Fetch all patients from the database
    const patients = await User.find({ role: 'Patient' }, { first_name: 1, last_name: 1, birth_date: 1, phone_number: 1, email: 1,_id:1 });

    // Calculate age from birth_date
    const patientsWithAge = patients.map(patient => {
      const age = new Date().getFullYear() - new Date(patient.birth_date).getFullYear();
      return {
        ID: patient._id,
        name: `${patient.first_name} ${patient.last_name}`,
        age: age,
        phone_number: patient.phone_number,
        email: patient.email,
      };
    });

    res.json(patientsWithAge);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all doctors (for Patients, Admins)
exports.getAllDoctors = async (req, res) => {
  try {
    // Fetch all doctors from the database
    const doctors = await User.find({ role: 'Doctor' }, { first_name: 1, last_name: 1, phone_number: 1, email: 1,_id:1 });

    // Format the response
    const formattedDoctors = doctors.map(doctor => ({
      ID: doctor._id,
      name: `${doctor.first_name} ${doctor.last_name}`,
      phone_number: doctor.phone_number,
      email: doctor.email,
    }));

    res.json(formattedDoctors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};