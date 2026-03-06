// Test login directly with backend
const axios = require('axios');

async function testLogin() {
  try {
    console.log('🔍 Testing login with existing user...');
    
    const loginData = {
      email: 'admin@hospital.com',
      password: 'admin123'
    };
    
    console.log('📤 Sending login data:', loginData);
    
    const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
    
    console.log('✅ Login successful:', response.data);
  } catch (error) {
    console.log('❌ Login failed:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message);
    console.log('Full error:', error.message);
    
    if (error.response?.data) {
      console.log('Response data:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

testLogin();
