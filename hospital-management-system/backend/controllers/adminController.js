const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const Department = require('../models/Department');
const Appointment = require('../models/Appointment');
const { validationResult } = require('express-validator');

class AdminController {
  static async getDoctors(req, res) {
    try {
      const doctors = await Doctor.getAll();
      res.json(doctors);
    } catch (error) {
      console.error('Get doctors error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createDoctor(req, res) {
    try {
      console.log('🚀 Backend: Creating doctor...');
      console.log('📝 Request body:', req.body);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, departmentId, experience, availableTime, qualification, consultationFee } = req.body;
      console.log('👨‍⚕️ Doctor data:', { name, email, departmentId, experience, availableTime, qualification, consultationFee });

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        console.log('❌ User already exists with email:', email);
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      console.log('🔐 Creating user account...');
      const userId = await User.create({ name, email, password, role: 'doctor' });
      console.log('✅ User created with ID:', userId);

      console.log('🏥 Creating doctor record...');
      const doctorId = await Doctor.create({
        userId,
        departmentId,
        experience,
        availableTime,
        qualification,
        consultationFee
      });
      console.log('✅ Doctor created with ID:', doctorId);

      console.log('🔍 Fetching complete doctor data...');
      const doctor = await Doctor.findById(doctorId);
      console.log('✅ Doctor data retrieved:', doctor);

      console.log('🎉 Doctor creation completed successfully!');
      res.status(201).json({ success: true, message: 'Doctor created successfully', doctor });
    } catch (error) {
      console.error('❌ Create doctor error:', error);
      console.error('🔍 Error stack:', error.stack);
      console.error('🌐 Error details:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  }

  static async updateDoctor(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name, email, departmentId, experience, availableTime, qualification, consultationFee } = req.body;

      const doctor = await Doctor.findById(id);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      await User.update(doctor.user_id, { name, email });
      await Doctor.update(id, { departmentId, experience, availableTime, qualification, consultationFee });

      const updatedDoctor = await Doctor.findById(id);
      res.json({ message: 'Doctor updated successfully', doctor: updatedDoctor });
    } catch (error) {
      console.error('Update doctor error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteDoctor(req, res) {
    try {
      const { id } = req.params;

      const doctor = await Doctor.findById(id);
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor not found' });
      }

      await Doctor.delete(id);
      await User.delete(doctor.user_id);

      res.json({ message: 'Doctor deleted successfully' });
    } catch (error) {
      console.error('Delete doctor error:', error);
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

  static async createDepartment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, description } = req.body;

      const departmentId = await Department.create({ name, description });
      const department = await Department.findById(departmentId);

      res.status(201).json({ message: 'Department created successfully', department });
    } catch (error) {
      console.error('Create department error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateDepartment(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name, description } = req.body;

      const department = await Department.findById(id);
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }

      await Department.update(id, { name, description });
      const updatedDepartment = await Department.findById(id);

      res.json({ message: 'Department updated successfully', department: updatedDepartment });
    } catch (error) {
      console.error('Update department error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deleteDepartment(req, res) {
    try {
      const { id } = req.params;

      const department = await Department.findById(id);
      if (!department) {
        return res.status(404).json({ message: 'Department not found' });
      }

      await Department.delete(id);
      res.json({ message: 'Department deleted successfully' });
    } catch (error) {
      console.error('Delete department error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getPatients(req, res) {
    try {
      console.log('👥 Backend: Fetching patients...');
      const patients = await Patient.getAll();
      console.log('✅ Patients data retrieved:', patients);
      console.log('📊 Total patients:', patients.length);
      res.json(patients);
    } catch (error) {
      console.error('❌ Get patients error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async createPatient(req, res) {
    try {
      console.log('🚀 Backend: Creating patient...');
      console.log('📝 Request body:', req.body);
      console.log('🔍 Headers:', req.headers);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, age, phone, medicalHistory } = req.body;
      console.log('👤 Patient data:', { name, email, age, phone, medicalHistory });

      console.log('🔐 Creating user account...');
      const userId = await User.create({ name, email, password, role: 'patient' });
      console.log('✅ User created with ID:', userId);

      console.log('🏥 Creating patient record...');
      const patientId = await Patient.create({
        userId,
        age,
        phone,
        medical_history: medicalHistory
      });
      console.log('✅ Patient created with ID:', patientId);

      console.log('🔍 Fetching complete patient data...');
      const patient = await Patient.findById(patientId);
      console.log('✅ Patient data retrieved:', patient);

      console.log('🎉 Patient creation completed successfully!');
      res.status(201).json({ success: true, message: 'Patient created successfully', patient });
    } catch (error) {
      console.error('❌ Create patient error:', error);
      console.error('🔍 Error stack:', error.stack);
      console.error('🌐 Error details:', error.message);
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
  }

  static async updatePatient(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { name, email, age, phone, medicalHistory } = req.body;

      const patient = await Patient.findById(id);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }

      await Patient.update(id, { age, phone, medical_history });
      await User.update(patient.user_id, { name, email });

      const updatedPatient = await Patient.findById(id);
      res.json({ message: 'Patient updated successfully', patient: updatedPatient });
    } catch (error) {
      console.error('Update patient error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async deletePatient(req, res) {
    try {
      const { id } = req.params;
      
      const patient = await Patient.findById(id);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
      
      await Patient.delete(id);
      res.json({ message: 'Patient deleted successfully' });
    } catch (error) {
      console.error('Delete patient error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getAppointments(req, res) {
    try {
      const appointments = await Appointment.getAll();
      res.json(appointments);
    } catch (error) {
      console.error('Get appointments error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async updateAppointmentStatus(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { status } = req.body;

      const appointment = await Appointment.findById(id);
      if (!appointment) {
        return res.status(404).json({ message: 'Appointment not found' });
      }

      await Appointment.updateStatus(id, status);
      const updatedAppointment = await Appointment.findById(id);

      res.json({ message: 'Appointment status updated successfully', appointment: updatedAppointment });
    } catch (error) {
      console.error('Update appointment status error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getDashboardStats(req, res) {
    try {
      const doctors = await Doctor.getAll();
      const patients = await Patient.getAll();
      const appointments = await Appointment.getAll();
      const departments = await Department.getAll();

      const pendingAppointments = appointments.filter(apt => apt.status === 'pending').length;
      const approvedAppointments = appointments.filter(apt => apt.status === 'approved').length;
      const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;

      res.json({
        totalDoctors: doctors.length,
        totalPatients: patients.length,
        totalAppointments: appointments.length,
        totalDepartments: departments.length,
        pendingAppointments,
        approvedAppointments,
        completedAppointments
      });
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AdminController;
