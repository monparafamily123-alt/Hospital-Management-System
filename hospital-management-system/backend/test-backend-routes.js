const axios = require('axios');

async function testBackendRoutes() {
  console.log('🧪 Testing Backend Routes...');
  
  try {
    // Test health endpoint
    console.log('\n1. Testing health endpoint...');
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Health:', healthResponse.data);
    
    // Test auth profile endpoint (this might fail without proper token)
    console.log('\n2. Testing auth profile endpoint (without token)...');
    try {
      const profileResponse = await axios.get('http://localhost:5000/api/auth/profile');
      console.log('❌ Should have failed without token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly requires authentication');
      } else {
        console.log('⚠️ Unexpected error:', error.response?.status);
      }
    }
    
    // Test doctor profile image endpoint (without token)
    console.log('\n3. Testing doctor profile image endpoint (without token)...');
    try {
      const imageResponse = await axios.post('http://localhost:5000/api/doctor/profile/image');
      console.log('❌ Should have failed without token');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correctly requires authentication');
      } else if (error.response?.status === 404) {
        console.log('❌ Route not found - backend needs restart');
      } else {
        console.log('⚠️ Unexpected error:', error.response?.status);
      }
    }
    
    console.log('\n📊 Test Summary:');
    console.log('• If profile image shows 404, restart backend server');
    console.log('• If auth profile shows 500, check backend logs');
    console.log('• Health endpoint should always work');
    
  } catch (error) {
    console.error('❌ Backend not accessible:', error.message);
    console.log('💡 Make sure backend is running on port 5000');
  }
}

testBackendRoutes();
