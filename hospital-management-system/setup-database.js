const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function setupDatabase() {
  try {
    console.log('Connecting to MySQL...');
    
    // Connect to MySQL without database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    console.log('Reading SQL file...');
    const sql = fs.readFileSync('./database/hospital_management.sql', 'utf8');
    
    console.log('Executing SQL script...');
    await connection.execute(sql);
    
    console.log('Database setup completed successfully!');
    await connection.end();
    
  } catch (error) {
    console.error('Database setup error:', error);
    process.exit(1);
  }
}

setupDatabase();
