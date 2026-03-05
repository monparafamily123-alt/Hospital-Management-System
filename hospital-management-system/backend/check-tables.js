const mysql = require('mysql2/promise');

async function checkTables() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('Checking users table structure...');
    const [users] = await connection.execute('DESCRIBE users');
    console.log('Users table columns:');
    users.forEach(column => {
      console.log(`- ${column.Field}: ${column.Type}`);
    });

    console.log('\nChecking doctors table structure...');
    const [doctors] = await connection.execute('DESCRIBE doctors');
    console.log('Doctors table columns:');
    doctors.forEach(column => {
      console.log(`- ${column.Field}: ${column.Type}`);
    });

  } catch (error) {
    console.error('Error checking tables:', error);
  } finally {
    await connection.end();
  }
}

checkTables();
