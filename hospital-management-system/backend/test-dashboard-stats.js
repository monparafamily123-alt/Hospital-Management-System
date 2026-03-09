require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testDashboardStats() {
  console.log('🧪 Testing Doctor Dashboard Stats...\n');
  
  try {
    // First login as doctor to get token
    console.log('🔐 Logging in as doctor...');
    const loginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'sahildoctor@gmail.com',
      password: '@Sahil2003'
    });
    
    const token = loginResponse.data.token;
    console.log('✅ Login successful');
    
    // Test dashboard stats
    console.log('\n📊 Fetching dashboard stats...');
    const statsResponse = await axios.get(`${API_BASE_URL}/doctor/dashboard/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Dashboard stats fetched successfully!');
    console.log('📈 Stats:', statsResponse.data);
    
    // Verify stats structure
    const stats = statsResponse.data;
    console.log('\n🔍 Stats Analysis:');
    console.log(`📅 Total Appointments: ${stats.totalAppointments}`);
    console.log(`📅 Today's Appointments: ${stats.todayAppointments}`);
    console.log(`⏳ Pending Appointments: ${stats.pendingAppointments}`);
    console.log(`✅ Completed Appointments: ${stats.completedAppointments}`);
    
    console.log('\n🎉 Dashboard stats test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('🔍 Response data:', error.response.data);
      console.error('🔍 Status:', error.response.status);
    }
  }
}

testDashboardStats().catch(console.error);
