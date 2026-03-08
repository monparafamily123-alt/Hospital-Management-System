require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testPrescriptionSave() {
  console.log('🧪 Testing Prescription Save...\n');
  
  try {
    // 1. Get doctor appointments first
    console.log('📅 Getting doctor appointments...');
    const appointmentsResponse = await axios.get(`${API_BASE_URL}/doctor/appointments`);
    console.log(`✅ Found ${appointmentsResponse.data.length} appointments`);
    
    if (appointmentsResponse.data.length === 0) {
      console.log('❌ No appointments found to test prescription save');
      return;
    }
    
    const firstAppointment = appointmentsResponse.data[0];
    console.log(`📝 Testing with appointment ID: ${firstAppointment.id}`);
    
    // 2. Save prescription
    console.log('\n💾 Saving prescription...');
    const prescriptionData = {
      prescription: `MEDICINES:
1. Paracetamol 500mg - 1 tablet - 3 times a day - 5 days - Take after food
2. Amoxicillin 250mg - 1 capsule - twice daily - 7 days - With food

FOLLOW-UP: After 1 week`
    };
    
    const saveResponse = await axios.put(`${API_BASE_URL}/doctor/appointments/${firstAppointment.id}/prescription`, prescriptionData);
    console.log('✅ Prescription saved successfully!');
    console.log('📄 Response:', saveResponse.data);
    
    // 3. Verify appointment status changed
    console.log('\n🔍 Verifying appointment status...');
    const updatedAppointmentsResponse = await axios.get(`${API_BASE_URL}/doctor/appointments`);
    const updatedAppointment = updatedAppointmentsResponse.data.find(apt => apt.id === firstAppointment.id);
    
    if (updatedAppointment) {
      console.log(`✅ Appointment status: ${updatedAppointment.status}`);
      console.log(`📋 Prescription saved: ${updatedAppointment.prescription ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Appointment not found after update');
    }
    
    console.log('\n🎉 Prescription save test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('🔍 Response data:', error.response.data);
      console.error('🔍 Status:', error.response.status);
    }
  }
}

testPrescriptionSave().catch(console.error);
