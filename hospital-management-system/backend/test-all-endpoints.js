require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAllEndpoints() {
  console.log('🧪 Testing all endpoints...\n');
  
  const tests = [
    // Auth endpoints
    { method: 'GET', url: '/health', description: 'Health Check' },
    { method: 'GET', url: '/auth/profile', description: 'Auth Profile' },
    
    // Admin endpoints
    { method: 'GET', url: '/admin/dashboard/stats', description: 'Admin Dashboard Stats' },
    { method: 'GET', url: '/admin/doctors', description: 'Admin Doctors List' },
    { method: 'GET', url: '/admin/patients', description: 'Admin Patients List' },
    { method: 'GET', url: '/admin/appointments', description: 'Admin Appointments' },
    { method: 'GET', url: '/admin/departments', description: 'Admin Departments' },
    { method: 'GET', url: '/admin/notifications', description: 'Admin Notifications' },
    
    // Doctor endpoints
    { method: 'GET', url: '/doctor/dashboard/stats', description: 'Doctor Dashboard Stats' },
    { method: 'GET', url: '/doctor/appointments', description: 'Doctor Appointments' },
    { method: 'GET', url: '/doctor/prescriptions', description: 'Doctor Prescriptions' },
    { method: 'GET', url: '/doctor/profile', description: 'Doctor Profile' },
    
    // Patient endpoints
    { method: 'GET', url: '/patient/dashboard/stats', description: 'Patient Dashboard Stats' },
    { method: 'GET', url: '/patient/appointments', description: 'Patient Appointments' },
    { method: 'GET', url: '/patient/departments', description: 'Patient Departments' },
    { method: 'GET', url: '/patient/doctors', description: 'Patient Doctors' },
    { method: 'GET', url: '/patient/profile', description: 'Patient Profile' },
    { method: 'GET', url: '/patient/notifications', description: 'Patient Notifications' },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    try {
      const response = await axios.get(`${API_BASE_URL}${test.url}`, {
        timeout: 5000
      });
      
      console.log(`✅ ${test.description} - ${response.status}`);
      passed++;
    } catch (error) {
      console.log(`❌ ${test.description} - ${error.response?.status || 'Network Error'}: ${error.message}`);
      failed++;
    }
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
  
  if (failed > 0) {
    console.log('\n🔧 Some endpoints are failing. Project may not work completely.');
  } else {
    console.log('\n🎉 All endpoints are working! Project should work completely.');
  }
}

testAllEndpoints().catch(console.error);
