require('dotenv').config();
const mysql = require('mysql2/promise');

async function checkPatientsTable() {
  try {
    console.log('🔍 Checking patients table structure...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hospital_management'
    });

    // Check table structure
    const [structure] = await connection.execute('DESCRIBE patients');
    console.log('📋 Patients table structure:');
    structure.forEach(column => {
      console.log(`  - ${column.Field}: ${column.Type} (${column.Null === 'YES' ? 'NULL' : 'NOT NULL'})`);
    });

    // Check existing data
    const [data] = await connection.execute('SELECT * FROM patients LIMIT 5');
    console.log('\n📊 Existing patients data:');
    console.log(data);

    await connection.end();
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkPatientsTable();
