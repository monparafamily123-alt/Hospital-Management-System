const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const User = require('../models/User');
const { validationResult } = require('express-validator');
const { getImageUrl, deleteOldImage } = require('../middleware/upload');

class DoctorController {
  static async getAppointments(req, res) {
    try {
      const doctor = await Doctor.findByUserId(req.user.userId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }

      const appointments = await Appointment.getByDoctorId(doctor.id);
      res.json(appointments);
    } catch (error) {
      console.error('Get doctor appointments error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updatePrescription(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { prescription } = req.body;

      const doctor = await Doctor.findByUserId(req.user.userId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }

      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      if (appointment.doctor_id !== doctor.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      await Appointment.updatePrescription(id, prescription);
      const updatedAppointment = await Appointment.findById(id);

      res.json({ message: 'Prescription updated successfully', appointment: updatedAppointment });
    } catch (error) {
      console.error('Update prescription error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async markAppointmentCompleted(req, res) {
    try {
      const { id } = req.params;

      const doctor = await Doctor.findByUserId(req.user.userId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }

      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      if (appointment.doctor_id !== doctor.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      await Appointment.markCompleted(id);
      const updatedAppointment = await Appointment.findById(id);

      res.json({ message: 'Appointment marked as completed', appointment: updatedAppointment });
    } catch (error) {
      console.error('Mark appointment completed error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getProfile(req, res) {
    try {
      const doctor = await Doctor.findByUserId(req.user.userId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }

      res.json(doctor);
    } catch (error) {
      console.error('Get doctor profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateProfile(req, res) {
    try {
      console.log('🔄 Backend: Updating doctor profile...');
      const doctor = await Doctor.findByUserId(req.user.userId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }

      const { name, email, phone, address, experience, availableTime, qualification, consultationFee } = req.body;
      
      // Update user table
      await User.update(doctor.user_id, { name, email });
      
      // Update doctor table
      await Doctor.update(doctor.id, {
        experience,
        available_time: availableTime,
        qualification,
        consultation_fee: consultationFee
      });

      // Fetch updated profile
      const updatedDoctor = await Doctor.findByUserId(req.user.userId);
      
      console.log('✅ Profile updated successfully');
      res.json({ success: true, message: 'Profile updated successfully', doctor: updatedDoctor });
    } catch (error) {
      console.error('❌ Update profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getPrescriptions(req, res) {
    try {
      console.log('📋 Backend: Fetching doctor prescriptions...');
      const doctor = await Doctor.findByUserId(req.user.userId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }

      const appointments = await Appointment.getByDoctorId(doctor.id);
      const prescriptions = appointments.filter(apt => apt.prescription && apt.status === 'completed');
      
      console.log('✅ Prescriptions retrieved:', prescriptions.length);
      res.json(prescriptions);
    } catch (error) {
      console.error('❌ Get prescriptions error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getDashboardStats(req, res) {
    try {
      const doctor = await Doctor.findByUserId(req.user.userId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }

      const appointments = await Appointment.getByDoctorId(doctor.id);
      const today = new Date().toISOString().split('T')[0];
      
      const todayAppointments = appointments.filter(apt => 
        apt.appointment_date.startsWith(today)
      ).length;
      
      const pendingAppointments = appointments.filter(apt => 
        apt.status === 'pending' || apt.status === 'approved'
      ).length;
      
      const completedAppointments = appointments.filter(apt => 
        apt.status === 'completed'
      ).length;

      res.json({
        totalAppointments: appointments.length,
        todayAppointments,
        pendingAppointments,
        completedAppointments
      });
    } catch (error) {
      console.error('Get doctor dashboard stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async uploadProfileImage(req, res) {
    try {
      console.log('📸 Uploading doctor profile image...');
      
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const doctor = await Doctor.findByUserId(req.user.userId);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }

      // Delete old image if it exists and is not an external URL
      if (doctor.profile_image && !doctor.profile_image.startsWith('http')) {
        const oldFilename = doctor.profile_image.split('/').pop();
        deleteOldImage(oldFilename);
      }

      // Update profile image in users table
      const imageUrl = getImageUrl(req.file.filename);
      await User.update(doctor.user_id, { profile_image: imageUrl });

      // Also update in doctors table
      await Doctor.update(doctor.id, { profile_image: imageUrl });

      console.log('✅ Profile image uploaded successfully');
      res.json({ 
        message: 'Profile image uploaded successfully',
        profileImage: imageUrl
      });
    } catch (error) {
      console.error('Upload profile image error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = DoctorController;
