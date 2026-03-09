require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAllAppointments() {
  console.log('🧪 Testing All Appointments Pages Date Display...\n');
  
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
    
    // Login as doctor
    console.log('\n👨‍⚕️ Logging in as doctor...');
    const doctorLoginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'sahildoctor@gmail.com',
      password: '@Sahil2003'
    });
    
    const doctorToken = doctorLoginResponse.data.token;
    console.log('✅ Doctor login successful');
    
    // Get doctor appointments
    console.log('\n👨‍⚕️ Fetching doctor appointments...');
    const doctorAppointmentsResponse = await axios.get(`${API_BASE_URL}/doctor/appointments`, {
      headers: { 'Authorization': `Bearer ${doctorToken}` }
    });
    
    // Login as patient
    console.log('\n👤 Logging in as patient...');
    const patientLoginResponse = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'sahilpatient@gmail.com',
      password: '@Sahil2003'
    });
    
    const patientToken = patientLoginResponse.data.token;
    console.log('✅ Patient login successful');
    
    // Get patient appointments
    console.log('\n👤 Fetching patient appointments...');
    const patientAppointmentsResponse = await axios.get(`${API_BASE_URL}/patient/appointments`, {
      headers: { 'Authorization': `Bearer ${patientToken}` }
    });
    
    console.log('\n📊 Date Field Analysis for All Pages:');
    
    // Check admin appointments
    if (adminAppointmentsResponse.data && adminAppointmentsResponse.data.length > 0) {
      console.log('\n🔍 ADMIN APPOINTMENTS:');
      adminAppointmentsResponse.data.forEach((apt, index) => {
        console.log(`  Appointment ${index + 1}:`);
        console.log(`    - appointment_date: ${apt.appointment_date}`);
        console.log(`    - appointment_time: ${apt.appointment_time}`);
        console.log(`    - date: ${apt.date}`);
        console.log(`    - time: ${apt.time}`);
        console.log(`    - Formatted: ${(() => {
          if (apt.appointment_date) {
            const date = new Date(apt.appointment_date);
            const time = apt.appointment_time || apt.time || 'Not specified';
            return `${date.toLocaleDateString()} at ${time}`;
          } else if (apt.date) {
            const date = new Date(apt.date);
            const time = apt.time || 'Not specified';
            return `${date.toLocaleDateString()} at ${time}`;
          } else {
            return 'Date not available';
          }
        })()}`);
      });
    }
    
    // Check doctor appointments
    if (doctorAppointmentsResponse.data && doctorAppointmentsResponse.data.length > 0) {
      console.log('\n👨‍⚕️ DOCTOR APPOINTMENTS:');
      doctorAppointmentsResponse.data.forEach((apt, index) => {
        console.log(`  Appointment ${index + 1}:`);
        console.log(`    - appointment_date: ${apt.appointment_date}`);
        console.log(`    - appointment_time: ${apt.appointment_time}`);
        console.log(`    - date: ${apt.date}`);
        console.log(`    - time: ${apt.time}`);
        console.log(`    - Formatted: ${(() => {
          if (apt.appointment_date) {
            const date = new Date(apt.appointment_date);
            const time = apt.appointment_time || apt.time || 'Not specified';
            return `${date.toLocaleDateString()} at ${time}`;
          } else if (apt.date) {
            const date = new Date(apt.date);
            const time = apt.time || 'Not specified';
            return `${date.toLocaleDateString()} at ${time}`;
          } else {
            return 'Date not available';
          }
        })()}`);
      });
    }
    
    // Check patient appointments
    if (patientAppointmentsResponse.data && patientAppointmentsResponse.data.length > 0) {
      console.log('\n👤 PATIENT APPOINTMENTS:');
      patientAppointmentsResponse.data.forEach((apt, index) => {
        console.log(`  Appointment ${index + 1}:`);
        console.log(`    - appointment_date: ${apt.appointment_date}`);
        console.log(`    - appointment_time: ${apt.appointment_time}`);
        console.log(`    - date: ${apt.date}`);
        console.log(`    - time: ${apt.time}`);
        console.log(`    - Formatted: ${(() => {
          if (apt.appointment_date) {
            const date = new Date(apt.appointment_date);
            const time = apt.appointment_time || apt.time || 'Not specified';
            return `${date.toLocaleDateString()} at ${time}`;
          } else if (apt.date) {
            const date = new Date(apt.date);
            const time = apt.time || 'Not specified';
            return `${date.toLocaleDateString()} at ${time}`;
          } else {
            return 'Date not available';
          }
        })()}`);
      });
    }
    
    console.log('\n🎉 All appointments date test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('🔍 Response data:', error.response.data);
      console.error('🔍 Status:', error.response.status);
    }
  }
}

testAllAppointments().catch(console.error);
