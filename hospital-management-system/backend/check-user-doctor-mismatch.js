const mysql = require('mysql2/promise');

async function checkUserDoctorMismatch() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('🔍 Checking User-Doctor Mismatch...');
    
    // Check users table
    const [users] = await connection.execute('SELECT id, name, email, role FROM users WHERE role = "doctor"');
    const usersData = users || [];
    console.log(`\n📊 Users Table - Doctors: ${usersData.length}`);
    if (usersData.length > 0) {
      usersData.forEach(user => {
        console.log(`  ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
      });
    }
    
    // Check doctors table
    const [doctors] = await connection.execute('SELECT id, user_id FROM doctors');
    const doctorsData = doctors || [];
    console.log(`\n📊 Doctors Table: ${doctorsData.length}`);
    if (doctorsData.length > 0) {
      doctorsData.forEach(doctor => {
        console.log(`  ID: ${doctor.id}, User ID: ${doctor.user_id}`);
      });
    }
    
    // Find users without doctor records
    const userDoctorIds = doctorsData.map(d => d.user_id);
    const usersWithoutDoctor = usersData.filter(u => !userDoctorIds.includes(u.id));
    
    console.log(`\n❌ Users without Doctor Records: ${usersWithoutDoctor.length}`);
    if (usersWithoutDoctor.length > 0) {
      usersWithoutDoctor.forEach(user => {
        console.log(`  ID: ${user.id}, Name: ${user.name}, Email: ${user.email}`);
      });
    }
    
    // Find doctor records without valid users
    const doctorUserIds = usersData.map(u => u.id);
    const doctorsWithoutUser = doctorsData.filter(d => !doctorUserIds.includes(d.user_id));
    
    console.log(`\n❌ Doctor Records without Valid Users: ${doctorsWithoutUser.length}`);
    if (doctorsWithoutUser.length > 0) {
      doctorsWithoutUser.forEach(doctor => {
        console.log(`  ID: ${doctor.id}, User ID: ${doctor.user_id}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking mismatch:', error);
  } finally {
    await connection.end();
  }
}

checkUserDoctorMismatch();
