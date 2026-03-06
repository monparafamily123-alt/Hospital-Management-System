// Temporary auth bypass for testing
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

class TempAuthBypass {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      console.log('🔍 BYPASS Login attempt:', { email, password });

      const user = await User.findByEmail(email);
      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('✅ User found:', user.email);
      console.log('🔐 Stored password:', user.password);
      console.log('🔑 Provided password:', password);

      // TEMPORARY BYPASS: Accept any password for admin users
      let isValidPassword = false;
      if (email === 'admin@hospital.com' && password === 'admin123') {
        isValidPassword = true;
        console.log('✅ Admin bypass - password accepted');
      } else if (email === 'anjali.reddy@hospital.com' && password === 'doctor123') {
        isValidPassword = true;
        console.log('✅ Doctor bypass - password accepted');
      } else if (email === 'rahul.sharma@patient.com' && password === 'patient123') {
        isValidPassword = true;
        console.log('✅ Patient bypass - password accepted');
      } else {
        // Try normal validation
        if (user.password.startsWith('$2b$')) {
          isValidPassword = await User.validatePassword(password, user.password);
          console.log('🔒 Using bcrypt validation');
        } else {
          isValidPassword = (password === user.password);
          console.log('🔓 Using plain text validation');
        }
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
      console.error('❌ Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = TempAuthBypass;
