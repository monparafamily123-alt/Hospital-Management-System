const mysql = require('mysql2/promise');

async function fixPatientsCompleteTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management'
  });

  try {
    console.log('Disabling foreign key checks...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    console.log('Dropping and recreating patients table...');
    await connection.execute('DROP TABLE IF EXISTS patients');

    await connection.execute(`
      CREATE TABLE patients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        age INT,
        phone VARCHAR(20),
        gender VARCHAR(10),
        address TEXT,
        medical_history TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Patients table fixed successfully!');

  } catch (err) {
    console.error('Error fixing patients table:', err);
  } finally {
    console.log('Re-enabling foreign key checks...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    await connection.end();
  }
}

fixPatientsCompleteTable();
