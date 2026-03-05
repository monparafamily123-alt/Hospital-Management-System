const express = require('express');
const { body } = require('express-validator');
const DoctorController = require('../controllers/doctorController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { uploadProfileImage, getImageUrl, deleteOldImage } = require('../middleware/upload');

const router = express.Router();

router.use(authenticateToken);
router.use(authorizeRoles('doctor'));

const prescriptionValidation = [
  body('prescription').trim().notEmpty().withMessage('Prescription is required')
];

router.get('/dashboard/stats', DoctorController.getDashboardStats);
router.get('/appointments', DoctorController.getAppointments);
router.get('/prescriptions', DoctorController.getPrescriptions);
router.get('/profile', DoctorController.getProfile);
router.put('/profile', DoctorController.updateProfile);
router.post('/profile/image', uploadProfileImage, DoctorController.uploadProfileImage);
router.put('/appointments/:id/prescription', prescriptionValidation, DoctorController.updatePrescription);
router.put('/appointments/:id/complete', DoctorController.markAppointmentCompleted);

module.exports = router;
