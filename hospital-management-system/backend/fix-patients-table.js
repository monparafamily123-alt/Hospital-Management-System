const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixPatientsTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    
    console.log('Dropping and recreating patients table...');
    await connection.execute('DROP TABLE IF EXISTS patients');
    
    await connection.execute(`
      CREATE TABLE patients (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        age INT,
        gender ENUM('male', 'female', 'other'),
        phone VARCHAR(20),
        address TEXT,
        medical_history TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Patients table fixed successfully!');
    await connection.end();
    
  } catch (error) {
    console.error('Error fixing patients table:', error);
  }
}

fixPatientsTable();
