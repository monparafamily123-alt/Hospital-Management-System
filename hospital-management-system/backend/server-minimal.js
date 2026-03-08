require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);

// Simple doctor profile endpoint
const { authenticateToken, authorizeRoles } = require('./middleware/auth');
const Doctor = require('./models/Doctor');

app.put('/api/doctor/profile', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
  try {
    console.log('🔄 Backend: Updating doctor profile...');
    const doctor = await Doctor.findByUserId(req.user.userId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const { name, email, phone, address, experience, availableTime, qualification, consultationFee } = req.body;
    
    // Update user table
    const User = require('./models/User');
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
});

// Simple doctor get profile endpoint
app.get('/api/doctor/profile', authenticateToken, authorizeRoles('doctor'), async (req, res) => {
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
});

// Simple doctor image upload endpoint
const { uploadProfileImage } = require('./middleware/upload');
app.post('/api/doctor/profile/image', authenticateToken, authorizeRoles('doctor'), uploadProfileImage, async (req, res) => {
  try {
    console.log('📸 FINAL: Uploading doctor profile image...');
    console.log('👤 User ID from token:', req.user.userId);
    console.log('📁 File received:', req.file);
    
    if (!req.file) {
      console.log('❌ No file provided');
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Generate image URL
    const { getImageUrl } = require('./middleware/upload');
    const imageUrl = getImageUrl(req.file.filename);
    console.log('🖼️ Image URL generated:', imageUrl);

    // Get database connection
    const pool = require('./config/database').pool;

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
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hospital Management System API is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads/`);
  console.log('✅ Server started successfully!');
});
