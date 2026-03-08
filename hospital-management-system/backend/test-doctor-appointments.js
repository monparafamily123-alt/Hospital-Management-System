require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testDoctorAppointments() {
  console.log('🧪 Testing Doctor Appointments...\n');
  
  try {
    // 1. Book a new appointment first
    console.log('📅 Booking new appointment...');
    const appointmentData = {
      doctorId: 18,
      appointmentDate: '2026-03-09T14:00',
      symptoms: 'Chest pain consultation'
    };
    
    const bookingResponse = await axios.post(`${API_BASE_URL}/patient/appointments`, appointmentData);
    console.log('✅ Appointment booked successfully!');
    
    // 2. Check patient appointments
    console.log('\n👤 Checking patient appointments...');
    const patientAppointments = await axios.get(`${API_BASE_URL}/patient/appointments`);
    console.log(`✅ Patient appointments: ${patientAppointments.data.length}`);
    patientAppointments.data.forEach((apt, i) => {
      console.log(`  ${i+1}. ${apt.doctor_name} - ${apt.date} - ${apt.status}`);
    });
    
    // 3. Check doctor appointments
    console.log('\n👨‍⚕️ Checking doctor appointments...');
    const doctorAppointments = await axios.get(`${API_BASE_URL}/doctor/appointments`);
    console.log(`✅ Doctor appointments: ${doctorAppointments.data.length}`);
    doctorAppointments.data.forEach((apt, i) => {
      console.log(`  ${i+1}. ${apt.patient_name} - ${apt.date} - ${apt.status}`);
    });
    
    // 4. Check admin appointments
    console.log('\n👨‍💼 Checking admin appointments...');
    const adminAppointments = await axios.get(`${API_BASE_URL}/admin/appointments`);
    console.log(`✅ Admin appointments: ${adminAppointments.data.length}`);
    adminAppointments.data.forEach((apt, i) => {
      console.log(`  ${i+1}. ${apt.doctor_name} - ${apt.date} - ${apt.status}`);
    });
    
    console.log('\n🎉 Doctor appointments test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('🔍 Response data:', error.response.data);
    }
  }
}

testDoctorAppointments().catch(console.error);
