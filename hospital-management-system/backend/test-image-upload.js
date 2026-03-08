// Test image upload endpoint directly
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

async function testImageUpload() {
  try {
    console.log('🧪 Testing image upload endpoint...');
    
    // Create a test image file
    const testImagePath = 'test-image.jpg';
    const testImageData = Buffer.from('fake image data');
    fs.writeFileSync(testImagePath, testImageData);
    
    // Create form data
    const form = new FormData();
    form.append('image', fs.createReadStream(testImagePath));
    
    // Get auth token (you need to replace with actual token)
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjE3LCJlbWFpbCI6InNhaGlsZG9jdG9yQGdtYWlsLmNvbSIsInJvbGUiOiJkb2N0b3IiLCJpYXQiOjE3NTE0NjQzNDIsImV4cCI6MTc1MTU1MDc0Mn0.test';
    
    // Make request
    const response = await axios.post('http://localhost:5000/api/doctor/profile/image', form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Response:', response.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  } finally {
    // Clean up
    if (fs.existsSync('test-image.jpg')) {
      fs.unlinkSync('test-image.jpg');
    }
  }
}

testImageUpload();
