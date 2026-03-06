const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { generateToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');

class AuthController {
  static async register(req, res) {
    try {
      console.log('🔍 Registration attempt:', req.body);
      
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log('❌ Validation errors:', errors.array());
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password, role, age, gender, phone, address, medicalHistory } = req.body;

      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        console.log('❌ User already exists:', email);
        return res.status(400).json({ message: 'User already exists with this email' });
      }

      console.log('✅ Creating new user:', { name, email, role });
      const userId = await User.create({ name, email, password, role });
      console.log('✅ User created with ID:', userId);

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
        console.log('✅ Doctor profile created');
      } else if (role === 'patient') {
        await Patient.create({
          userId,
          age,
          gender,
          phone,
          address,
          medicalHistory
        });
        console.log('✅ Patient profile created');
      } else if (role === 'admin') {
        // Admin doesn't need additional profile
        console.log('✅ Admin user created (no additional profile needed)');
      }

      const token = generateToken({ userId, email, role });

      console.log('✅ Registration successful for:', email);

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: { id: userId, name, email, role }
      });
    } catch (error) {
      console.error('❌ Registration error:', error);
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

      console.log('🔍 Login attempt:', { email, password });

      const user = await User.findByEmail(email);
      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('✅ User found:', user.email);
      console.log('🔐 Stored password type:', typeof user.password);
      console.log('🔑 Provided password:', password);

      // Check if password is hashed (starts with $2b$) or plain text
      let isValidPassword;
      if (user.password.startsWith('$2b$')) {
        // Hashed password - use bcrypt
        isValidPassword = await User.validatePassword(password, user.password);
        console.log('🔒 Using bcrypt validation');
      } else {
        // Plain text password - direct comparison
        isValidPassword = (password === user.password);
        console.log('🔓 Using plain text validation');
      }
      
      if (!isValidPassword) {
        console.log('❌ Password mismatch');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('✅ Login successful for:', user.email);

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
