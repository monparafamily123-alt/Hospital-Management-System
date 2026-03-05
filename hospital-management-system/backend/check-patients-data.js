const mysql = require('mysql2/promise');

async function checkPatientsData() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management'
  });

  try {
    console.log('=== CHECKING PATIENTS TABLE ===');
    const [patients] = await connection.execute('SELECT * FROM patients');
    console.log('Patients table data:', patients);
    console.log('Total patients in table:', patients.length);

    console.log('\n=== CHECKING USERS TABLE FOR PATIENTS ===');
    const [userPatients] = await connection.execute('SELECT * FROM users WHERE role = "patient"');
    console.log('Users with patient role:', userPatients);
    console.log('Total patient users:', userPatients.length);

    console.log('\n=== CHECKING JOIN QUERY (like backend) ===');
    const [joinedData] = await connection.execute(`
      SELECT p.*, u.name, u.email 
      FROM patients p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY u.name
    `);
    console.log('Joined data (what backend returns):', joinedData);
    console.log('Total joined records:', joinedData.length);

    console.log('\n=== CHECKING FOR NULL USER_ID ===');
    const [nullUserId] = await connection.execute('SELECT * FROM patients WHERE user_id IS NULL');
    console.log('Patients with NULL user_id:', nullUserId);

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkPatientsData();
