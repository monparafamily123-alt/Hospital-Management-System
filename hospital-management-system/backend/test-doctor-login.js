const mysql = require('mysql2/promise');

async function testDoctorLogin() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('🧪 Testing Doctor Login Data...');
    
    // Get a sample doctor
    const [doctors] = await connection.execute(`
      SELECT u.id, u.name, u.email, u.password, u.role, d.department_id, d.experience
      FROM users u 
      JOIN doctors d ON u.id = d.user_id 
      WHERE u.role = 'doctor' 
      LIMIT 5
    `);
    
    const doctorData = doctors || [];
    console.log(`\n📊 Found ${doctorData.length} doctors for testing:`);
    
    doctorData.forEach((doctor, index) => {
      console.log(`\n${index + 1}. ${doctor.name}`);
      console.log(`   Email: ${doctor.email}`);
      console.log(`   Password: ${doctor.password}`);
      console.log(`   Experience: ${doctor.experience}`);
      console.log(`   Department ID: ${doctor.department_id}`);
    });
    
    console.log('\n✅ Use these credentials to test doctor login:');
    console.log('   URL: http://localhost:5173/login');
    console.log('   Then go to: http://localhost:5173/doctor/dashboard');
    
  } catch (error) {
    console.error('❌ Error testing doctor login:', error);
  } finally {
    await connection.end();
  }
}

testDoctorLogin();
