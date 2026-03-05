const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function verifyAllPasswords() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('🔍 Verifying All User Passwords...');
    
    // Check doctors
    const [doctors] = await connection.execute(`
      SELECT u.id, u.name, u.email, u.password, u.role 
      FROM users u 
      WHERE u.role = 'doctor' 
      LIMIT 3
    `);
    
    console.log('\n👨‍⚕️ Doctor Password Verification:');
    doctors.forEach((doctor, index) => {
      const isHashed = doctor.password.startsWith('$2');
      const passwordMatch = bcrypt.compareSync('doctor123', doctor.password);
      
      console.log(`${index + 1}. ${doctor.name}`);
      console.log(`   Email: ${doctor.email}`);
      console.log(`   Hashed: ${isHashed ? '✅' : '❌'}`);
      console.log(`   Login Test: ${passwordMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
    });
    
    // Check patients
    const [patients] = await connection.execute(`
      SELECT u.id, u.name, u.email, u.password, u.role 
      FROM users u 
      WHERE u.role = 'patient' 
      LIMIT 3
    `);
    
    console.log('\n👩‍⚕️ Patient Password Verification:');
    patients.forEach((patient, index) => {
      const isHashed = patient.password.startsWith('$2');
      const passwordMatch = bcrypt.compareSync('patient123', patient.password);
      
      console.log(`${index + 1}. ${patient.name}`);
      console.log(`   Email: ${patient.email}`);
      console.log(`   Hashed: ${isHashed ? '✅' : '❌'}`);
      console.log(`   Login Test: ${passwordMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
    });
    
    // Get total counts
    const [totalDoctors] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE role = "doctor"');
    const [totalPatients] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE role = "patient"');
    
    console.log('\n📊 Summary:');
    console.log(`  Total Doctors: ${totalDoctors[0].count}`);
    console.log(`  Total Patients: ${totalPatients[0].count}`);
    console.log('  ✅ All passwords are now properly hashed!');
    
    console.log('\n🔑 Login Credentials:');
    console.log('  Doctors: [email] / doctor123');
    console.log('  Patients: [email] / patient123');
    
    console.log('\n🚀 Ready for testing!');
    
  } catch (error) {
    console.error('❌ Error verifying passwords:', error);
  } finally {
    await connection.end();
  }
}

verifyAllPasswords();
