const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDoctorsTable() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  
  console.log('=== DOCTORS TABLE ===');
  const [doctors] = await connection.execute('DESCRIBE doctors');
  doctors.forEach(row => console.log(row.Field, row.Type));
  
  console.log('\n=== SAMPLE DOCTORS ===');
  const [sampleDoctors] = await connection.execute('SELECT * FROM doctors LIMIT 5');
  console.log(sampleDoctors);
  
  console.log('\n=== DOCTOR USERS ===');
  const [doctorUsers] = await connection.execute('SELECT id, name, email, role FROM users WHERE role = "doctor" LIMIT 5');
  console.log(doctorUsers);
  
  await connection.end();
}

checkDoctorsTable();
