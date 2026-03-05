const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function checkDoctorPasswords() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('🔍 Checking Doctor Passwords...');
    
    // Get doctors with their passwords
    const [doctors] = await connection.execute(`
      SELECT u.id, u.name, u.email, u.password, u.role 
      FROM users u 
      WHERE u.role = 'doctor' 
      LIMIT 5
    `);
    
    const doctorData = doctors || [];
    console.log(`\n📊 Found ${doctorData.length} doctors:`);
    
    doctorData.forEach((doctor, index) => {
      console.log(`\n${index + 1}. ${doctor.name}`);
      console.log(`   Email: ${doctor.email}`);
      console.log(`   Password: ${doctor.password}`);
      console.log(`   Is Hashed: ${doctor.password.startsWith('$2') ? 'YES' : 'NO'}`);
      
      // Test password verification
      const testPassword = 'doctor123';
      let passwordMatch = false;
      
      if (doctor.password.startsWith('$2')) {
        // Hashed password - test with bcrypt
        try {
          passwordMatch = bcrypt.compareSync(testPassword, doctor.password);
        } catch (error) {
          console.log('   ❌ Error comparing hashed password:', error.message);
        }
      } else {
        // Plain text password
        passwordMatch = doctor.password === testPassword;
      }
      
      console.log(`   Test Login (doctor123): ${passwordMatch ? '✅ SUCCESS' : '❌ FAILED'}`);
    });
    
    // Check if passwords need to be hashed
    const unhashedPasswords = doctorData.filter(d => !d.password.startsWith('$2'));
    
    if (unhashedPasswords.length > 0) {
      console.log(`\n⚠️ Found ${unhashedPasswords.length} doctors with unhashed passwords`);
      console.log('🔧 Fixing passwords...');
      
      for (const doctor of unhashedPasswords) {
        const hashedPassword = bcrypt.hashSync('doctor123', 10);
        
        await connection.execute(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashedPassword, doctor.id]
        );
        
        console.log(`✅ Fixed password for: ${doctor.name}`);
      }
      
      console.log('✅ All doctor passwords have been hashed!');
    } else {
      console.log('\n✅ All doctor passwords are properly hashed');
    }
    
  } catch (error) {
    console.error('❌ Error checking doctor passwords:', error);
  } finally {
    await connection.end();
  }
}

checkDoctorPasswords();
