const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function fixPatientPasswords() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('🔧 Fixing Patient Passwords...');
    
    // Get all patients with unhashed passwords
    const [patients] = await connection.execute(`
      SELECT u.id, u.name, u.email, u.password, u.role 
      FROM users u 
      WHERE u.role = 'patient' AND password NOT LIKE '$2%'
    `);
    
    const patientData = patients || [];
    console.log(`\n📊 Found ${patientData.length} patients with unhashed passwords:`);
    
    if (patientData.length === 0) {
      console.log('✅ All patient passwords are already properly hashed!');
      return;
    }
    
    // Fix all unhashed passwords
    for (const patient of patientData) {
      console.log(`\n🔧 Fixing: ${patient.name} (${patient.email})`);
      
      // Hash the password
      const hashedPassword = bcrypt.hashSync('patient123', 10);
      
      // Update the password
      await connection.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, patient.id]
      );
      
      console.log(`✅ Password hashed for: ${patient.name}`);
    }
    
    console.log('\n✅ All patient passwords have been successfully hashed!');
    
  } catch (error) {
    console.error('❌ Error fixing patient passwords:', error);
  } finally {
    await connection.end();
  }
}

fixPatientPasswords();
