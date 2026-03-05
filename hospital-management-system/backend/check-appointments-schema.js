const mysql = require('mysql2/promise');

async function checkAppointmentsSchema() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management'
  });

  try {
    console.log('=== CURRENT APPOINTMENTS TABLE SCHEMA ===');
    const [columns] = await connection.execute('DESCRIBE appointments');
    columns.forEach(col => console.log(`${col.Field}: ${col.Type}`));
    
    console.log('\n=== SAMPLE DATA ===');
    const [sample] = await connection.execute('SELECT * FROM appointments LIMIT 3');
    console.log(sample);
    
    await connection.end();
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAppointmentsSchema();
