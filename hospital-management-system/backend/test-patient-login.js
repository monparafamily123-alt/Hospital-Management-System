const mysql = require('mysql2/promise');

async function testPatientLogin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('🧪 Testing Patient Login Data...');
    
    // Get a sample patient
    const [patients] = await connection.execute(`
      SELECT u.id, u.name, u.email, u.password, u.role, p.age, p.gender, p.phone
      FROM users u 
      JOIN patients p ON u.id = p.user_id 
      WHERE u.role = 'patient' 
      LIMIT 5
    `);
    
    const patientData = patients || [];
    console.log(`\n📊 Found ${patientData.length} patients for testing:`);
    
    patientData.forEach((patient, index) => {
      console.log(`\n${index + 1}. ${patient.name}`);
      console.log(`   Email: ${patient.email}`);
      console.log(`   Password: ${patient.password}`);
      console.log(`   Age: ${patient.age}, Gender: ${patient.gender}`);
      console.log(`   Phone: ${patient.phone}`);
    });
    
    console.log('\n✅ Use these credentials to test patient login:');
    console.log('   URL: http://localhost:5173/login');
    console.log('   Then go to: http://localhost:5173/patient/dashboard');
    
  } catch (error) {
    console.error('❌ Error testing patient login:', error);
  } finally {
    await connection.end();
  }
}

testPatientLogin();
