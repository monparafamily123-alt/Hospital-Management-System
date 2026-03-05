const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function fixAllDoctorPasswords() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('🔧 Fixing All Doctor Passwords...');
    
    // Get all doctors with unhashed passwords
    const [doctors] = await connection.execute(`
      SELECT u.id, u.name, u.email, u.password, u.role 
      FROM users u 
      WHERE u.role = 'doctor' AND password NOT LIKE '$2%'
    `);
    
    const doctorData = doctors || [];
    console.log(`\n📊 Found ${doctorData.length} doctors with unhashed passwords:`);
    
    if (doctorData.length === 0) {
      console.log('✅ All doctor passwords are already properly hashed!');
      return;
    }
    
    // Fix all unhashed passwords
    for (const doctor of doctorData) {
      console.log(`\n🔧 Fixing: ${doctor.name} (${doctor.email})`);
      
      // Hash the password
      const hashedPassword = bcrypt.hashSync('doctor123', 10);
      
      // Update the password
      await connection.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, doctor.id]
      );
      
      console.log(`✅ Password hashed for: ${doctor.name}`);
    }
    
    console.log('\n✅ All doctor passwords have been successfully hashed!');
    
    // Verify the fix
    const [updatedDoctors] = await connection.execute(`
      SELECT u.id, u.name, u.email, u.password 
      FROM users u 
      WHERE u.role = 'doctor' 
      LIMIT 3
    `);
    
    console.log('\n🔍 Verification - Sample doctors after fix:');
    updatedDoctors.forEach((doctor, index) => {
      console.log(`\n${index + 1}. ${doctor.name}`);
      console.log(`   Email: ${doctor.email}`);
      console.log(`   Password: ${doctor.password.substring(0, 20)}...`);
      console.log(`   Is Hashed: ${doctor.password.startsWith('$2') ? 'YES' : 'NO'}`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing doctor passwords:', error);
  } finally {
    await connection.end();
  }
}

fixAllDoctorPasswords();
