const mysql = require('mysql2/promise');

async function fixMissingDoctorRecords() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('🔧 Fixing Missing Doctor Records...');
    
    // Get all doctor users without doctor records
    const [users] = await connection.execute(`
      SELECT u.id, u.name, u.email 
      FROM users u 
      WHERE u.role = 'doctor' 
      AND u.id NOT IN (SELECT user_id FROM doctors)
    `);
    
    const usersWithoutDoctor = users || [];
    console.log(`\n📊 Found ${usersWithoutDoctor.length} users without doctor records`);
    
    // Get available departments
    const [departments] = await connection.execute('SELECT id, name FROM departments');
    const availableDepts = departments || [];
    console.log(`\n📊 Available Departments: ${availableDepts.length}`);
    availableDepts.forEach(dept => {
      console.log(`  ID: ${dept.id} -> ${dept.name}`);
    });
    
    if (availableDepts.length === 0) {
      console.log('❌ No departments found. Creating default departments...');
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS departments (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // Insert default departments
      const defaultDepts = [
        ['Cardiology', 'Heart and cardiovascular diseases'],
        ['Neurology', 'Brain and nervous system disorders'],
        ['Orthopedics', 'Bones, joints, and muscles'],
        ['Gynecology', 'Female reproductive system'],
        ['Pediatrics', 'Children healthcare'],
        ['Dermatology', 'Skin diseases and conditions']
      ];
      
      for (const [name, description] of defaultDepts) {
        await connection.execute(
          'INSERT IGNORE INTO departments (name, description) VALUES (?, ?)',
          [name, description]
        );
      }
      
      // Get departments again
      const [newDepts] = await connection.execute('SELECT id, name FROM departments');
      availableDepts.push(...(newDepts || []));
    }
    
    // Create doctor records for missing users
    for (const user of usersWithoutDoctor) {
      try {
        // Assign a department (cycle through available departments)
        const deptIndex = (user.id - 1) % availableDepts.length;
        const department = availableDepts[deptIndex];
        
        // Create doctor record with default values
        await connection.execute(`
          INSERT INTO doctors (
            user_id, 
            department_id, 
            experience, 
            available_time, 
            qualification, 
            consultation_fee
          ) VALUES (?, ?, ?, ?, ?, ?)
        `, [
          user.id,
          department.id,
          '5 years', // Default experience
          '9:00 AM - 5:00 PM', // Default available time
          'MBBS, MD', // Default qualification
          500 // Default consultation fee
        ]);
        
        console.log(`✅ Created doctor record for: ${user.name} (Dept: ${department.name})`);
      } catch (error) {
        console.error(`❌ Error creating doctor record for ${user.name}:`, error.message);
      }
    }
    
    console.log('\n✅ Missing doctor records fixed!');
    
    // Verify the fix
    const [finalUsers] = await connection.execute('SELECT COUNT(*) as count FROM users WHERE role = "doctor"');
    const [finalDoctors] = await connection.execute('SELECT COUNT(*) as count FROM doctors');
    
    console.log(`\n📊 Final Count:`);
    console.log(`  Users Table (Doctors): ${finalUsers[0].count}`);
    console.log(`  Doctors Table: ${finalDoctors[0].count}`);
    
    if (finalUsers[0].count === finalDoctors[0].count) {
      console.log('✅ Perfect! User and Doctor tables are now synchronized.');
    } else {
      console.log('⚠️  There might still be some mismatches.');
    }
    
  } catch (error) {
    console.error('❌ Error fixing doctor records:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed.');
  }
}

fixMissingDoctorRecords();
