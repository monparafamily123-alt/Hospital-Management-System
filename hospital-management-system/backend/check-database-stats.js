require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkDatabaseStats() {
  try {
    console.log('📊 Checking real database stats...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hospital_management'
    });

    // Get real stats
    const [doctorCount] = await connection.execute('SELECT COUNT(*) as total FROM users WHERE role = "doctor"');
    const [patientCount] = await connection.execute('SELECT COUNT(*) as total FROM users WHERE role = "patient"');
    const [appointmentCount] = await connection.execute('SELECT COUNT(*) as total FROM appointments');
    const [pendingAppointments] = await connection.execute('SELECT COUNT(*) as total FROM appointments WHERE status = "pending"');
    const [completedAppointments] = await connection.execute('SELECT COUNT(*) as total FROM appointments WHERE status = "completed"');
    
    console.log('📈 Real Database Stats:');
    console.log(`  - Total Doctors: ${doctorCount[0].total}`);
    console.log(`  - Total Patients: ${patientCount[0].total}`);
    console.log(`  - Total Appointments: ${appointmentCount[0].total}`);
    console.log(`  - Pending Appointments: ${pendingAppointments[0].total}`);
    console.log(`  - Completed Appointments: ${completedAppointments[0].total}`);

    // Get doctor details
    const [doctors] = await connection.execute(`
      SELECT u.id, u.name, u.email, d.experience, d.qualification, d.consultation_fee 
      FROM users u 
      JOIN doctors d ON u.id = d.user_id 
      WHERE u.role = 'doctor'
    `);
    
    console.log('\n👨‍⚕️ Doctors in database:');
    doctors.forEach(doctor => {
      console.log(`  - ${doctor.name} (${doctor.email})`);
    });

    // Get patient details
    const [patients] = await connection.execute(`
      SELECT u.id, u.name, u.email, p.age, p.gender, p.phone 
      FROM users u 
      JOIN patients p ON u.id = p.user_id 
      WHERE u.role = 'patient'
    `);
    
    console.log('\n👤 Patients in database:');
    patients.forEach(patient => {
      console.log(`  - ${patient.name} (${patient.email})`);
    });

    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkDatabaseStats();
