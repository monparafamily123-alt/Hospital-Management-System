require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to format time like frontend
function formatTime(time) {
  if (!time || time === 'Not specified' || !time.includes(':')) {
    return time;
  }
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

async function testTimeFormat() {
  console.log('🧪 Testing Time Format (hh:mm AM/PM)...\n');
  
  try {
    // Login as admin
    console.log('🔐 Logging in as admin...');
    const adminLoginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'sahiladmin@gmail.com',
      password: '@Sahil2003'
    });
    
    const adminToken = adminLoginResponse.data.token;
    console.log('✅ Admin login successful');
    
    // Get admin appointments
    console.log('\n📅 Fetching admin appointments...');
    const adminAppointmentsResponse = await axios.get(`${API_BASE_URL}/admin/appointments`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    
    console.log('\n📊 Time Format Analysis:');
    
    if (adminAppointmentsResponse.data && adminAppointmentsResponse.data.length > 0) {
      console.log('\n🔍 ADMIN APPOINTMENTS:');
      adminAppointmentsResponse.data.forEach((apt, index) => {
        console.log(`  Appointment ${index + 1}:`);
        console.log(`    - Original time: ${apt.appointment_time}`);
        
        // Format date and time like frontend
        if (apt.appointment_date) {
          const date = new Date(apt.appointment_date);
          const formattedTime = formatTime(apt.appointment_time);
          console.log(`    - Formatted: ${date.toLocaleDateString()} at ${formattedTime}`);
        }
      });
    }
    
    // Test specific time conversions
    console.log('\n🕐 Time Conversion Examples:');
    const testTimes = ['00:17:00', '14:11:00', '09:30:00', '23:45:00', '12:00:00'];
    testTimes.forEach(time => {
      const formatted = formatTime(time);
      console.log(`    ${time} → ${formatted}`);
    });
    
    console.log('\n🎉 Time format test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('🔍 Response data:', error.response.data);
      console.error('🔍 Status:', error.response.status);
    }
  }
}

testTimeFormat().catch(console.error);
