const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads/profile-images');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for profile image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + req.user.userId + '-' + uniqueSuffix + ext);
  }
});

// File filter for images only
const fileFilter = (req, file, cb) => {
  // Accept only image files
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Configure upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only one file allowed
  }
});

// Single file upload middleware
const uploadProfileImage = upload.single('profileImage');

// Get image URL helper
const getImageUrl = (filename) => {
  if (!filename) {
    return null;
  }
  
  // If it's already a full URL (like UI Avatars), return as is
  if (filename.startsWith('http')) {
    return filename;
  }
  
  // Otherwise, return the local file URL
  return `http://localhost:5000/uploads/profile-images/${filename}`;
};

// Delete old image helper
const deleteOldImage = (filename) => {
  if (!filename || filename.startsWith('http')) {
    return; // Don't delete external URLs
  }
  
  const filePath = path.join(uploadsDir, filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    console.log('🗑️ Deleted old profile image:', filename);
  }
};

module.exports = {
  uploadProfileImage,
  getImageUrl,
  deleteOldImage
};
