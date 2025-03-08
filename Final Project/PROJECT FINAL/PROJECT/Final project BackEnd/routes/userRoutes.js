
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authorize } = require('../middleware/authMiddleware');

// Define user management routes

// Get admin data (name, email, phone)
router.get('/admin/data', authorize(['Admin']), userController.getAdminData); // GET /api/admin/data?email=admin@example.com

// Get Patient data (name, email, phone)
router.get('/patient/data', authorize(['Patient']), userController.getPatientData); // GET /api/patient/data?email=admin@example.com
const { getDoctorData } = require('../controllers/userController');

router.get('/doctor/data', getDoctorData); // API لجلب بيانات الطبيب

// Admins can get all users
router.get('/users', authorize(['Admin']), userController.getAllUsers); // GET /api/users we use query here by user email to check his role iof its Admin then the request is accepted otherwise it will be rejected

// Admins can add a new doctor
router.post('/users', authorize(['Admin']), userController.addDoctor); // POST /api/users

// Admins can delete a user
router.delete('/users/:user_id', authorize(['Admin']), userController.deleteUser); // DELETE /api/users/:user_id

// All of the above are tested kolohom shaghaleen w ay haga b ttcheck el user role it takes el user email as a query parameter to check his role lw admin yeb2a allowed✅
//✅✅

// Admins, Doctors, and Patients can update their own information
router.put('/users/:user_id', authorize(['Admin', 'Doctor', 'Patient']), userController.updateUser); // PUT /api/users/:user_id

// Doctors can view all patients
router.get('/patients', authorize(['Doctor','Admin']), userController.getAllPatients); // GET /api/patients

// Patients can view all doctors
router.get('/doctors', authorize(['Patient','Admin']), userController.getAllDoctors); // GET /api/doctors

module.exports = router;