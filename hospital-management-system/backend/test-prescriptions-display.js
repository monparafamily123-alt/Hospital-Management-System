require('dotenv').config();
const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000/api';

async function testPrescriptionsDisplay() {
  console.log('🧪 Testing Prescriptions Display...\n');
  
  try {
    // 1. Get doctor prescriptions
    console.log('📋 Getting doctor prescriptions...');
    const prescriptionsResponse = await axios.get(`${API_BASE_URL}/doctor/prescriptions`);
    console.log(`✅ Found ${prescriptionsResponse.data.length} prescriptions`);
    
    if (prescriptionsResponse.data.length === 0) {
      console.log('ℹ️ No prescriptions found. Let me add one first...');
      
      // 2. Add a prescription first
      console.log('\n💾 Adding a prescription...');
      const appointmentResponse = await axios.get(`${API_BASE_URL}/doctor/appointments`);
      
      if (appointmentResponse.data.length > 0) {
        const appointment = appointmentResponse.data[0];
        const prescriptionData = {
          prescription: `MEDICINES:
1. Paracetamol 500mg - 1 tablet - 3 times a day - 5 days - Take after food

FOLLOW-UP: After 1 week`
        };
        
        await axios.put(`${API_BASE_URL}/doctor/appointments/${appointment.id}/prescription`, prescriptionData);
        console.log('✅ Prescription added successfully');
        
        // 3. Get prescriptions again
        console.log('\n📋 Getting prescriptions after adding...');
        const updatedPrescriptionsResponse = await axios.get(`${API_BASE_URL}/doctor/prescriptions`);
        console.log(`✅ Found ${updatedPrescriptionsResponse.data.length} prescriptions after adding`);
        
        // Display prescription details
        updatedPrescriptionsResponse.data.forEach((prescription, index) => {
          console.log(`\n📄 Prescription ${index + 1}:`);
          console.log(`  Patient: ${prescription.patient_name}`);
          console.log(`  Date: ${prescription.date}`);
          console.log(`  Status: ${prescription.status}`);
          console.log(`  Prescription: ${prescription.prescription.substring(0, 100)}...`);
        });
      }
    } else {
      // Display existing prescriptions
      prescriptionsResponse.data.forEach((prescription, index) => {
        console.log(`\n📄 Prescription ${index + 1}:`);
        console.log(`  Patient: ${prescription.patient_name}`);
        console.log(`  Date: ${prescription.date}`);
        console.log(`  Status: ${prescription.status}`);
        console.log(`  Prescription: ${prescription.prescription.substring(0, 100)}...`);
      });
    }
    
    console.log('\n🎉 Prescriptions display test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('🔍 Response data:', error.response.data);
      console.error('🔍 Status:', error.response.status);
    }
  }
}

testPrescriptionsDisplay().catch(console.error);
