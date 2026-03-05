const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Department = require('../models/Department');
const { validationResult } = require('express-validator');

class PatientController {
  static async getAppointments(req, res) {
    try {
      const patient = await Patient.findByUserId(req.user.userId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }

      const appointments = await Appointment.getByPatientId(patient.id);
      res.json(appointments);
    } catch (error) {
      console.error('Get patient appointments error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async bookAppointment(req, res) {
    try {
      console.log('🚀 Backend: Booking appointment...');
      console.log('📝 Request body:', req.body);
      console.log('👤 Authenticated user:', req.user);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { doctorId, appointmentDate, symptoms } = req.body;
      console.log('📅 Appointment data:', { doctorId, appointmentDate, symptoms });

      console.log('🔍 Finding patient profile...');
      const patient = await Patient.findByUserId(req.user.userId);
      if (!patient) {
        console.log('❌ Patient profile not found for user ID:', req.user.userId);
        return res.status(404).json({ message: 'Patient profile not found' });
      }
      console.log('✅ Patient found:', patient);

      console.log('🔍 Finding doctor...');
      const doctor = await Doctor.findById(doctorId);
      if (!doctor) {
        console.log('❌ Doctor not found with ID:', doctorId);
        return res.status(404).json({ message: 'Doctor not found' });
      }
      console.log('✅ Doctor found:', doctor);

      console.log('📅 Creating appointment...');
      const appointmentId = await Appointment.create({
        patientId: patient.id,
        doctorId,
        appointmentDate,
        symptoms
      });
      console.log('✅ Appointment created with ID:', appointmentId);

      console.log('🔍 Fetching complete appointment data...');
      const appointment = await Appointment.findById(appointmentId);
      console.log('✅ Appointment data retrieved:', appointment);

      console.log('🎉 Appointment booking completed successfully!');
      res.status(201).json({ success: true, message: 'Appointment booked successfully', appointment });
    } catch (error) {
      console.error('❌ Book appointment error:', error);
      console.error('🔍 Error stack:', error.stack);
      console.error('🌐 Error details:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  }

  static async getPrescriptionHistory(req, res) {
    try {
      const patient = await Patient.findByUserId(req.user.userId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }

      const prescriptions = await Patient.getPrescriptionHistory(patient.id);
      res.json(prescriptions);
    } catch (error) {
      console.error('Get prescription history error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getProfile(req, res) {
    try {
      const patient = await Patient.findByUserId(req.user.userId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }

      res.json(patient);
    } catch (error) {
      console.error('Get patient profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getAvailableDoctors(req, res) {
    try {
      const { departmentId } = req.query;
      const doctors = await Doctor.getAvailableDoctors(departmentId);
      res.json(doctors);
    } catch (error) {
      console.error('Get available doctors error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getDepartments(req, res) {
    try {
      const departments = await Department.getAll();
      res.json(departments);
    } catch (error) {
      console.error('Get departments error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getDashboardStats(req, res) {
    try {
      const patient = await Patient.findByUserId(req.user.userId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }

      const appointments = await Appointment.getByPatientId(patient.id);
      const prescriptions = await Patient.getPrescriptionHistory(patient.id);
      
      const pendingAppointments = appointments.filter(apt => 
        apt.status === 'pending'
      ).length;
      
      const approvedAppointments = appointments.filter(apt => 
        apt.status === 'approved'
      ).length;
      
      const completedAppointments = appointments.filter(apt => 
        apt.status === 'completed'
      ).length;

      res.json({
        totalAppointments: appointments.length,
        pendingAppointments,
        approvedAppointments,
        completedAppointments,
        totalPrescriptions: prescriptions.length
      });
    } catch (error) {
      console.error('Get patient dashboard stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = PatientController;
