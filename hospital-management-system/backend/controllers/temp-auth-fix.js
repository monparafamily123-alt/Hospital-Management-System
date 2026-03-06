// Temporary auth controller fix for plain text passwords
// This bypasses bcrypt validation for testing

const User = require('../models/User');
const { generateToken } = require('../utils/jwt');

class TempAuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      console.log('🔍 Login attempt:', { email, password });

      const user = await User.findByEmail(email);
      if (!user) {
        console.log('❌ User not found:', email);
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('✅ User found:', user.email);
      console.log('🔐 Stored password:', user.password);
      console.log('🔑 Provided password:', password);

      // Temporary fix: Compare plain text passwords
      const isValidPassword = (password === user.password);
      
      if (!isValidPassword) {
        console.log('❌ Password mismatch');
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('✅ Login successful');

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
}

module.exports = TempAuthController;
