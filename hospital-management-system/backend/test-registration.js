// Test registration endpoint
const axios = require('axios');

async function testRegistration() {
  try {
    console.log('🔍 Testing registration endpoint...');
    
    const testData = {
      name: 'Test Admin',
      email: 'test.admin@example.com',
      password: 'admin123',
      role: 'admin'
    };
    
    console.log('📤 Sending data:', testData);
    
    const response = await axios.post('http://localhost:5000/api/auth/register', testData);
    
    console.log('✅ Registration successful:', response.data);
  } catch (error) {
    console.log('❌ Registration failed:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Error:', error.message);
    
    if (error.response?.data?.errors) {
      console.log('Validation errors:', error.response.data.errors);
    }
  }
}

testRegistration();
