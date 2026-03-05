const express = require('express');
const { body } = require('express-validator');
const AdminController = require('../controllers/adminController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('admin'));

const doctorValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('departmentId').isInt().withMessage('Department ID must be an integer'),
  body('experience').trim().notEmpty().withMessage('Experience is required'),
  body('availableTime').trim().notEmpty().withMessage('Available time is required'),
  body('qualification').trim().notEmpty().withMessage('Qualification is required'),
  body('consultationFee').isFloat({ min: 0 }).withMessage('Consultation fee must be a positive number')
];

const patientValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('age').isInt({ min: 1, max: 120 }).withMessage('Age must be between 1 and 120'),
  body('phone').optional().isMobilePhone().withMessage('Please provide a valid phone number'),
  body('medicalHistory').optional().trim()
];

const departmentValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Department name must be at least 2 characters'),
  body('description').optional().trim()
];

const appointmentStatusValidation = [
  body('status').isIn(['pending', 'approved', 'rejected', 'completed']).withMessage('Invalid status')
];

router.get('/dashboard/stats', AdminController.getDashboardStats);
router.get('/doctors', AdminController.getDoctors);
router.post('/doctors', doctorValidation, AdminController.createDoctor);
router.put('/doctors/:id', doctorValidation, AdminController.updateDoctor);
router.delete('/doctors/:id', AdminController.deleteDoctor);
router.get('/departments', AdminController.getDepartments);
router.post('/departments', departmentValidation, AdminController.createDepartment);
router.put('/departments/:id', departmentValidation, AdminController.updateDepartment);
router.delete('/departments/:id', AdminController.deleteDepartment);
router.get('/patients', AdminController.getPatients);
router.post('/patients', patientValidation, (req, res, next) => {
  console.log('🛣️ Admin Route: POST /patients');
  console.log('📝 Request received at:', new Date().toISOString());
  console.log('👤 Request from IP:', req.ip);
  console.log('🔐 Authenticated user:', req.user);
  AdminController.createPatient(req, res, next);
});
router.put('/patients/:id', patientValidation, AdminController.updatePatient);
router.delete('/patients/:id', AdminController.deletePatient);
router.get('/appointments', AdminController.getAppointments);
router.put('/appointments/:id/status', appointmentStatusValidation, AdminController.updateAppointmentStatus);

module.exports = router;
