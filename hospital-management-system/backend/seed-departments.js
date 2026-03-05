const mysql = require('mysql2/promise');

async function seedDepartments() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('Connecting to database...');
    
    // Check existing departments
    const [existingDepts] = await connection.execute('SELECT * FROM departments');
    console.log('Existing departments:');
    if (existingDepts[0] && existingDepts[0].length > 0) {
      existingDepts[0].forEach(dept => {
        console.log(`- ID: ${dept.id}, Name: ${dept.name}`);
      });
    } else {
      console.log('No departments found.');
    }

    // Add departments if they don't exist
    const departments = [
      { id: 1, name: 'Cardiology', description: 'Heart and cardiovascular diseases' },
      { id: 2, name: 'Neurology', description: 'Brain and nervous system disorders' },
      { id: 3, name: 'Orthopedics', description: 'Bones, joints, and muscles' },
      { id: 4, name: 'Gynecology', description: 'Female reproductive system' },
      { id: 5, name: 'Pediatrics', description: 'Children healthcare' },
      { id: 6, name: 'Dermatology', description: 'Skin diseases and conditions' }
    ];

    console.log('\nAdding departments...');
    for (const dept of departments) {
      try {
        await connection.execute(
          'INSERT IGNORE INTO departments (id, name, description) VALUES (?, ?, ?)',
          [dept.id, dept.name, dept.description]
        );
        console.log(`✅ Added/Exists: ${dept.name}`);
      } catch (error) {
        console.error(`❌ Error adding ${dept.name}:`, error.message);
      }
    }
    
    console.log('✅ Department seeding completed!');
    
  } catch (error) {
    console.error('❌ Error seeding departments:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed.');
  }
}

seedDepartments();
