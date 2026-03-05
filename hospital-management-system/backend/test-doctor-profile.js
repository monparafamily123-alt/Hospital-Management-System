const mysql = require('mysql2/promise');

async function testDoctorProfile() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('🧪 Testing Doctor Profile Data...');
    
    // Get a sample doctor with user info
    const [doctors] = await connection.execute(`
      SELECT d.*, u.name, u.email, dep.name as department_name 
      FROM doctors d 
      JOIN users u ON d.user_id = u.id 
      LEFT JOIN departments dep ON d.department_id = dep.id 
      WHERE u.role = 'doctor' 
      LIMIT 3
    `);
    
    const doctorData = doctors || [];
    console.log(`\n📊 Found ${doctorData.length} doctors with profile data:`);
    
    doctorData.forEach((doctor, index) => {
      console.log(`\n${index + 1}. ${doctor.name}`);
      console.log(`   Email: ${doctor.email}`);
      console.log(`   User ID: ${doctor.user_id}`);
      console.log(`   Doctor ID: ${doctor.id}`);
      console.log(`   Department: ${doctor.department_name || 'Not assigned'}`);
      console.log(`   Experience: ${doctor.experience}`);
      console.log(`   Available Time: ${doctor.available_time}`);
      console.log(`   Qualification: ${doctor.qualification}`);
      console.log(`   Consultation Fee: ${doctor.consultation_fee}`);
    });
    
    // Test the exact query used in Doctor.findByUserId
    console.log('\n🔍 Testing Doctor.findByUserId query...');
    const testUserId = doctorData[0]?.user_id;
    
    if (testUserId) {
      const [testResult] = await connection.execute(`
        SELECT d.*, u.name, u.email, dep.name as department_name 
        FROM doctors d 
        JOIN users u ON d.user_id = u.id 
        LEFT JOIN departments dep ON d.department_id = dep.id 
        WHERE d.user_id = ?
      `, [testUserId]);
      
      console.log('✅ Query result:', testResult[0] || 'No results');
    }
    
    console.log('\n✅ Doctor profile test completed!');
    
  } catch (error) {
    console.error('❌ Error testing doctor profile:', error);
  } finally {
    await connection.end();
  }
}

testDoctorProfile();
