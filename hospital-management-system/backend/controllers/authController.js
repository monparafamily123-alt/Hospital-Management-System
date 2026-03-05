const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { generateToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');

class AuthController {
  static async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role, age, gender, phone, address, medicalHistory } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      const userId = await User.create({ name, email, password, role });

      if (role === 'doctor') {
        const { departmentId, experience, availableTime, qualification, consultationFee } = req.body;
        await Doctor.create({
          userId,
          departmentId,
          experience,
          availableTime,
          qualification,
          consultationFee
        });
      } else if (role === 'patient') {
        await Patient.create({
          userId,
          age,
          gender,
          phone,
          address,
          medicalHistory
        });
      }

      const token = generateToken({ userId, email, role });

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: userId, name, email, role }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isValidPassword = await User.validatePassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken({ userId: user.id, email: user.email, role: user.role });

      res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      let profileData = { ...user };

      if (user.role === 'doctor') {
        const doctor = await Doctor.findByUserId(user.id);
        profileData = { ...profileData, doctor };
      } else if (user.role === 'patient') {
        const patient = await Patient.findByUserId(user.id);
        profileData = { ...profileData, patient };
      }

      res.json(profileData);
    } catch (error) {
      console.error('Profile error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthController;
