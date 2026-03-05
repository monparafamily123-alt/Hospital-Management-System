const mysql = require('mysql2/promise');

async function simpleSeedDepartments() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('Creating departments table if not exists...');
    
    // Create departments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS departments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('Inserting departments...');
    
    const departments = [
      ['Cardiology', 'Heart and cardiovascular diseases'],
      ['Neurology', 'Brain and nervous system disorders'],
      ['Orthopedics', 'Bones, joints, and muscles'],
      ['Gynecology', 'Female reproductive system'],
      ['Pediatrics', 'Children healthcare'],
      ['Dermatology', 'Skin diseases and conditions']
    ];

    for (const [name, description] of departments) {
      try {
        await connection.execute(
          'INSERT IGNORE INTO departments (name, description) VALUES (?, ?)',
          [name, description]
        );
        console.log(`✅ Added: ${name}`);
      } catch (error) {
        console.error(`❌ Error adding ${name}:`, error.message);
      }
    }
    
    console.log('✅ Department seeding completed!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

simpleSeedDepartments();
