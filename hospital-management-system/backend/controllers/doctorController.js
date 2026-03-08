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
      console.log('🔄 Backend: Updating prescription...');
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

      // Update prescription
      await Appointment.updatePrescription(id, prescription);
      
      // Automatically mark appointment as completed when prescription is added
      await Appointment.updateStatus(id, 'completed');
      
      const updatedAppointment = await Appointment.findById(id);

      console.log('✅ Prescription updated and appointment marked as completed');
      res.json({ message: 'Prescription updated successfully', appointment: updatedAppointment });
    } catch (error) {
      console.error('❌ Update prescription error:', error);
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

      console.log('👨‍⚕️ Doctor profile data:', doctor);
      console.log('🖼️ Profile image from DB:', doctor.profile_image);
      
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
      const prescriptions = appointments.filter(apt => apt.prescription && apt.prescription.trim() !== '');
      
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
      console.log('📸 FINAL: Uploading doctor profile image...');
      console.log('👤 User ID from token:', req.user.userId);
      console.log('📁 File received:', req.file);
      
      if (!req.file) {
        console.log('❌ No file provided');
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Generate image URL
      const imageUrl = getImageUrl(req.file.filename);
      console.log('🖼️ Image URL generated:', imageUrl);

      // Get database connection
      const pool = require('../config/database').pool;

      // Try database update with proper error handling
      try {
        console.log('📝 Attempting database update...');
        
        // First check if doctor exists
        const [doctorRows] = await pool.execute(
          'SELECT id FROM doctors WHERE user_id = ?',
          [req.user.userId]
        );
        
        if (doctorRows.length === 0) {
          console.log('❌ Doctor not found in database');
        } else {
          const doctorId = doctorRows[0].id;
          console.log('👨‍⚕️ Doctor found in database, ID:', doctorId);
          
          // Check if column exists
          const [columns] = await pool.execute(
            "SHOW COLUMNS FROM doctors WHERE Field = 'profile_image'"
          );
          
          if (columns.length === 0) {
            console.log('🔧 Adding profile_image column...');
            await pool.execute('ALTER TABLE doctors ADD COLUMN profile_image VARCHAR(500) NULL');
            console.log('✅ Column added successfully');
          }
          
          // Update the profile image
          const [result] = await pool.execute(
            'UPDATE doctors SET profile_image = ? WHERE id = ?',
            [imageUrl, doctorId]
          );
          
          console.log('✅ Database update result:', result);
          console.log('✅ Profile image updated in database');
        }
        
      } catch (dbError) {
        console.error('❌ Database update failed:', dbError.message);
        // Don't fail the upload - just continue
      }

      console.log('✅ Profile image upload successful');
      res.json({ 
        message: 'Profile image uploaded successfully',
        profileImage: imageUrl
      });
      
    } catch (error) {
      console.error('❌ Upload error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = DoctorController;
