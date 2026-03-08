// Simple image upload controller - no database dependencies
const Doctor = require('../models/Doctor');
const { getImageUrl } = require('../middleware/upload');

class DoctorControllerSimple {
  static async uploadProfileImage(req, res) {
    try {
      console.log('📸 SIMPLE: Uploading doctor profile image...');
      console.log('👤 User ID from token:', req.user.userId);
      console.log('📁 File received:', req.file);
      
      if (!req.file) {
        console.log('❌ No file provided');
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Just return success without database update
      const imageUrl = getImageUrl(req.file.filename);
      console.log('🖼️ Image URL generated:', imageUrl);
      console.log('✅ Profile image upload successful (simple mode)');

      res.json({ 
        message: 'Profile image uploaded successfully',
        profileImage: imageUrl,
        note: 'Simple mode - no database update'
      });
      
    } catch (error) {
      console.error('❌ SIMPLE Upload error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

module.exports = DoctorControllerSimple;
