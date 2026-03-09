require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAppointmentsDate() {
  console.log('🧪 Testing Doctor Appointments Date Display...\n');
  
  try {
    // Login as doctor
    console.log('🔐 Logging in as doctor...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'sahildoctor@gmail.com',
      password: '@Sahil2003'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Get appointments
    console.log('\n📅 Fetching doctor appointments...');
    const appointmentsResponse = await axios.get(`${API_BASE_URL}/doctor/appointments`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Appointments fetched successfully!');
    console.log('📊 Appointments:', appointmentsResponse.data);
    
    // Check date fields
    if (appointmentsResponse.data && appointmentsResponse.data.length > 0) {
      console.log('\n🔍 Date Field Analysis:');
      appointmentsResponse.data.forEach((apt, index) => {
        console.log(`\nAppointment ${index + 1}:`);
        console.log(`  - ID: ${apt.id}`);
        console.log(`  - Patient: ${apt.patient_name}`);
        console.log(`  - appointment_date: ${apt.appointment_date}`);
        console.log(`  - time: ${apt.time}`);
        console.log(`  - Status: ${apt.status}`);
        
        // Test date formatting
        if (apt.appointment_date) {
          const formattedDate = new Date(apt.appointment_date).toLocaleDateString();
          console.log(`  - Formatted: ${formattedDate} at ${apt.time || 'Not specified'}`);
        } else {
          console.log(`  - Formatted: Date not available`);
        }
      });
    } else {
      console.log('📭 No appointments found');
    }
    
    console.log('\n🎉 Appointments date test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('🔍 Response data:', error.response.data);
      console.error('🔍 Status:', error.response.status);
    }
  }
}

testAppointmentsDate().catch(console.error);
