const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixDoctors() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    
    await connection.execute('DROP TABLE IF EXISTS doctors');
    await connection.execute(`
      CREATE TABLE doctors (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        department_id INT NOT NULL,
        experience VARCHAR(255),
        available_time VARCHAR(255),
        qualification VARCHAR(255),
        consultation_fee DECIMAL(10, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
      )
    `);
    
    console.log('Doctors table fixed!');
    await connection.end();
    
  } catch (error) {
    console.error('Error:', error);
  }
}

fixDoctors();
