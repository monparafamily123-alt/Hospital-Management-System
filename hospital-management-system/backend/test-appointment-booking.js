require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testAppointmentBooking() {
  console.log('🧪 Testing Appointment Booking Flow...\n');
  
  try {
    // 1. Check current appointments
    console.log('📅 Checking current appointments...');
    const currentAppointments = await axios.get(`${API_BASE_URL}/patient/appointments`);
    console.log(`✅ Current appointments: ${currentAppointments.data.length}`);
    currentAppointments.data.forEach((apt, i) => {
      console.log(`  ${i+1}. ${apt.doctor_name} - ${apt.date} - ${apt.status}`);
    });
    
    // 2. Book new appointment
    console.log('\n📅 Booking new appointment...');
    const appointmentData = {
      doctorId: 18,
      appointmentDate: '2026-03-09T10:30',
      symptoms: 'Headache and fever'
    };
    
    const bookingResponse = await axios.post(`${API_BASE_URL}/patient/appointments`, appointmentData);
    console.log('✅ Appointment booked successfully!');
    console.log(`📝 Booking response:`, bookingResponse.data);
    
    // 3. Check appointments after booking
    console.log('\n📅 Checking appointments after booking...');
    const updatedAppointments = await axios.get(`${API_BASE_URL}/patient/appointments`);
    console.log(`✅ Updated appointments: ${updatedAppointments.data.length}`);
    updatedAppointments.data.forEach((apt, i) => {
      console.log(`  ${i+1}. ${apt.doctor_name} - ${apt.date} - ${apt.status}`);
    });
    
    // 4. Check admin appointments
    console.log('\n📅 Checking admin appointments...');
    const adminAppointments = await axios.get(`${API_BASE_URL}/admin/appointments`);
    console.log(`✅ Admin appointments: ${adminAppointments.data.length}`);
    adminAppointments.data.forEach((apt, i) => {
      console.log(`  ${i+1}. ${apt.doctor_name} - ${apt.date} - ${apt.status}`);
    });
    
    console.log('\n🎉 Appointment booking flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('🔍 Response data:', error.response.data);
    }
  }
}

testAppointmentBooking().catch(console.error);
