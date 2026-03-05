const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDepartments() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    
    await connection.execute('DROP TABLE IF EXISTS departments');
    await connection.execute(`
      CREATE TABLE departments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Departments table fixed!');
    await connection.end();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixDepartments();
