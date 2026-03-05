const mysql = require('mysql2/promise');

async function addMissingDepartments() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('Checking current departments...');
    const [current] = await connection.execute('SELECT id, name FROM departments ORDER BY id');
    console.log('Current departments:');
    if (current[0] && current[0].length > 0) {
      current[0].forEach(dept => {
        console.log(`ID: ${dept.id} -> ${dept.name}`);
      });
    } else {
      console.log('No departments found.');
    }

    // Add missing departments with specific IDs
    const missingDepts = [
      [1, 'Cardiology', 'Heart and cardiovascular diseases'],
      [2, 'Neurology', 'Brain and nervous system disorders'],
      [3, 'Orthopedics', 'Bones, joints, and muscles'],
      [5, 'Pediatrics', 'Children healthcare'],
      [6, 'Dermatology', 'Skin diseases and conditions']
    ];

    console.log('\nAdding missing departments...');
    for (const [id, name, description] of missingDepts) {
      try {
        await connection.execute(
          'INSERT IGNORE INTO departments (id, name, description) VALUES (?, ?, ?)',
          [id, name, description]
        );
        console.log(`✅ Added: ID ${id} -> ${name}`);
      } catch (error) {
        console.error(`❌ Error adding ${name}:`, error.message);
      }
    }
    
    console.log('✅ Missing departments added!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await connection.end();
  }
}

addMissingDepartments();
