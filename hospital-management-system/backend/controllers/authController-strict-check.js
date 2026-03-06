// STRICT DATABASE CHECK - No fallback, database only
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { validationResult } = require('express-validator');

class AuthControllerStrictCheck {
  static async login(req, res) {
    try {
      console.log('🔍 STRICT DATABASE CHECK Login attempt:', req.body);
      
      const { email, password } = req.body;

      // MUST check database first - no fallbacks
      const user = await User.findByEmail(email);
      
      if (!user) {
        console.log('❌ User NOT found in database:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('✅ User found in database:', user.email);
      console.log('🔐 Stored password:', user.password);
      console.log('🔑 Provided password:', password);

      // Check password type and validate
      let isValidPassword = false;
      
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
        console.log('❌ Password mismatch for:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('✅ Database authentication successful for:', user.email);
      
      const token = generateToken({ userId: user.id, email: user.email, role: user.role });
      
      return res.json({
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
      });

    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  static async getProfile(req, res) {
    try {
      console.log('🔍 STRICT PROFILE CHECK for user ID:', req.user.userId);
      
      const user = await User.findById(req.user.userId);
      
      if (!user) {
        console.log('❌ User NOT found in database during profile check:', req.user.userId);
        // Clear the token by returning 401
        return res.status(401).json({ message: 'User not found' });
      }

      console.log('✅ Profile check successful for:', user.email);
      
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      });
    } catch (error) {
      console.error('❌ Profile check error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = AuthControllerStrictCheck;
