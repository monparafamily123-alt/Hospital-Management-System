require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testDoctorCreation() {
  console.log('🧪 Testing Doctor Creation...\n');
  
  try {
    // 1. Get initial doctors list
    console.log('📋 Getting initial doctors list...');
    const initialResponse = await axios.get(`${API_BASE_URL}/admin/doctors`);
    console.log(`✅ Initial doctors count: ${initialResponse.data.length}`);
    
    // 2. Create a new doctor
    console.log('\n➕ Creating new doctor...');
    const newDoctor = {
      name: 'Dr. Test Doctor',
      email: 'test.doctor@hospital.com',
      password: 'password123',
      departmentId: 1,
      experience: '3 years',
      availableTime: '9am - 5pm',
      qualification: 'MBBS',
      consultationFee: 600
    };
    
    const createResponse = await axios.post(`${API_BASE_URL}/admin/doctors`, newDoctor);
    console.log('✅ Doctor created successfully!');
    console.log('📄 Response:', createResponse.data);
    
    // 3. Get updated doctors list
    console.log('\n📋 Getting updated doctors list...');
    const updatedResponse = await axios.get(`${API_BASE_URL}/admin/doctors`);
    console.log(`✅ Updated doctors count: ${updatedResponse.data.length}`);
    
    // 4. Verify the new doctor is in the list
    const createdDoctor = updatedResponse.data.find(doc => doc.email === 'test.doctor@hospital.com');
    if (createdDoctor) {
      console.log('✅ New doctor found in list!');
      console.log(`📝 Doctor name: ${createdDoctor.name}`);
      console.log(`📧 Doctor email: ${createdDoctor.email}`);
      console.log(`🏥 Doctor specialization: ${createdDoctor.specialization}`);
    } else {
      console.log('❌ New doctor not found in list');
    }
    
    console.log('\n🎉 Doctor creation test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('🔍 Response data:', error.response.data);
      console.error('🔍 Status:', error.response.status);
    }
  }
}

testDoctorCreation().catch(console.error);
