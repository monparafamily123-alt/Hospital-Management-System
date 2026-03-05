const mysql = require('mysql2/promise');

async function fixDoctorsCompleteTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management'
  });

  try {
    console.log('Disabling foreign key checks...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    console.log('Dropping and recreating doctors table with complete schema...');
    await connection.execute('DROP TABLE IF EXISTS doctors');

    await connection.execute(`
      CREATE TABLE doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        department_id INT,
        experience VARCHAR(255),
        available_time VARCHAR(255),
        qualification VARCHAR(255),
        consultation_fee DECIMAL(10,2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      )
    `);

    console.log('✅ Doctors table with complete schema created successfully!');

  } catch (err) {
    console.error('Error fixing doctors table:', err);
  } finally {
    console.log('Re-enabling foreign key checks...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    await connection.end();
  }
}

fixDoctorsCompleteTable();
