const mysql = require('mysql2/promise');

async function fixAppointmentsTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management'
  });

  try {
    console.log('Disabling foreign key checks...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    console.log('Dropping and recreating appointments table...');
    await connection.execute('DROP TABLE IF EXISTS appointments');

    await connection.execute(`
      CREATE TABLE appointments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id INT NOT NULL,
        doctor_id INT NOT NULL,
        appointment_date DATETIME NOT NULL,
        symptoms TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        prescription TEXT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
        FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Appointments table fixed successfully!');

  } catch (err) {
    console.error('Error fixing appointments table:', err);
  } finally {
    console.log('Re-enabling foreign key checks...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    await connection.end();
  }
}

fixAppointmentsTable();
