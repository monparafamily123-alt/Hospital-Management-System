const express = require('express');
const { body } = require('express-validator');
const PatientController = require('../controllers/patientController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('patient'));

const appointmentValidation = [
  body('doctorId').isInt().withMessage('Doctor ID must be an integer'),
  body('appointmentDate').isISO8601().withMessage('Please provide a valid date'),
  body('symptoms').optional().trim()
];

router.get('/dashboard/stats', PatientController.getDashboardStats);
router.get('/appointments', PatientController.getAppointments);
router.post('/appointments', appointmentValidation, PatientController.bookAppointment);
router.get('/prescriptions', PatientController.getPrescriptionHistory);
router.get('/doctors', PatientController.getAvailableDoctors);
router.get('/departments', PatientController.getDepartments);
router.get('/profile', PatientController.getProfile);

module.exports = router;
