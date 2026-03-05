const mysql = require('mysql2/promise');

async function fixDoctorsTable() {
  const connection = await mysql.createConnection({
    host: 'localhost',       // aapka host
    user: 'root',            // aapka db user
    password: '',            // aapka db password (empty)
    database: 'hospital_management', // aapka db name
  });

  try {
    console.log('Disabling foreign key checks...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    console.log('Dropping and recreating doctors table...');
    await connection.execute('DROP TABLE IF EXISTS doctors');

    await connection.execute(`
      CREATE TABLE doctors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        department_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (department_id) REFERENCES departments(id)
      )
    `);

    console.log('Doctors table fixed successfully!');

  } catch (err) {
    console.error('Error fixing doctors table:', err);
  } finally {
    console.log('Re-enabling foreign key checks...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    await connection.end();
  }
}

fixDoctorsTable();
