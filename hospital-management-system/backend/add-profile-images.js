const mysql = require('mysql2/promise');

async function addProfileImages() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('🖼️ Adding Profile Image Support...');
    
    // Add profile_image column to users table
    console.log('📝 Adding profile_image column to users table...');
    
    try {
      await connection.execute(`
        ALTER TABLE users 
        ADD COLUMN profile_image VARCHAR(255) DEFAULT NULL 
        AFTER password
      `);
      console.log('✅ profile_image column added to users table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ profile_image column already exists');
      } else {
        throw error;
      }
    }
    
    // Add profile_image column to doctors table
    console.log('📝 Adding profile_image column to doctors table...');
    
    try {
      await connection.execute(`
        ALTER TABLE doctors 
        ADD COLUMN profile_image VARCHAR(255) DEFAULT NULL 
        AFTER consultation_fee
      `);
      console.log('✅ profile_image column added to doctors table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ profile_image column already exists in doctors table');
      } else {
        throw error;
      }
    }
    
    // Add profile_image column to patients table
    console.log('📝 Adding profile_image column to patients table...');
    
    try {
      await connection.execute(`
        ALTER TABLE patients 
        ADD COLUMN profile_image VARCHAR(255) DEFAULT NULL 
        AFTER phone
      `);
      console.log('✅ profile_image column added to patients table');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('✅ profile_image column already exists in patients table');
      } else {
        throw error;
      }
    }
    
    // Set default profile images for existing users
    console.log('🖼️ Setting default profile images...');
    
    // Default avatar URLs (using a service like UI Avatars)
    const defaultAvatars = [
      'https://ui-avatars.com/api/?name=Dr.+Sanjay+Kumar&background=0D8ABC&color=fff&size=128',
      'https://ui-avatars.com/api/?name=Dr.+Meera+Sharma&background=0D8ABC&color=fff&size=128',
      'https://ui-avatars.com/api/?name=Dr.+Rohan+Patel&background=0D8ABC&color=fff&size=128',
      'https://ui-avatars.com/api/?name=Dr.+Anjali+Reddy&background=0D8ABC&color=fff&size=128',
      'https://ui-avatars.com/api/?name=Dr.+Karan+Singh&background=0D8ABC&color=fff&size=128'
    ];
    
    // Update some doctors with default avatars
    const [doctors] = await connection.execute(`
      SELECT u.id, u.name 
      FROM users u 
      WHERE u.role = 'doctor' 
      LIMIT 5
    `);
    
    for (let i = 0; i < doctors.length; i++) {
      const doctor = doctors[i];
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0D8ABC&color=fff&size=128`;
      
      await connection.execute(
        'UPDATE users SET profile_image = ? WHERE id = ?',
        [avatarUrl, doctor.id]
      );
      
      console.log(`✅ Set default avatar for: ${doctor.name}`);
    }
    
    // Update some patients with default avatars
    const [patients] = await connection.execute(`
      SELECT u.id, u.name 
      FROM users u 
      WHERE u.role = 'patient' 
      LIMIT 5
    `);
    
    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(patient.name)}&background=28A745&color=fff&size=128`;
      
      await connection.execute(
        'UPDATE users SET profile_image = ? WHERE id = ?',
        [avatarUrl, patient.id]
      );
      
      console.log(`✅ Set default avatar for: ${patient.name}`);
    }
    
    console.log('\n✅ Profile image support added successfully!');
    console.log('📊 Database updated with profile image columns');
    console.log('🖼️ Default avatars set for sample users');
    
  } catch (error) {
    console.error('❌ Error adding profile images:', error);
  } finally {
    await connection.end();
  }
}

addProfileImages();
