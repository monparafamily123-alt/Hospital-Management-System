require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seedPatients() {
  try {
    console.log('🌱 Starting patients seeding...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hospital_management'
    });

    console.log('✅ Database connected successfully');

    const hashPassword = async (password) => {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    };

    // Check existing users
    const [existingUsers] = await connection.execute('SELECT email FROM users');
    const existingEmails = existingUsers.map(user => user.email);
    console.log('📋 Existing users:', existingEmails.length);

    // Patients to add (only if not exists)
    const patients = [
      {
        name: 'Ramesh Patel',
        email: 'ramesh.patel@email.com',
        password: 'patient123',
        phone: '9876543211',
        age: 35,
        gender: 'male',
        address: '456 Oak Ave'
      },
      {
        name: 'Sita Devi',
        email: 'sita.devi@email.com',
        password: 'patient123',
        phone: '9876543212',
        age: 28,
        gender: 'female',
        address: '789 Pine Rd'
      },
      {
        name: 'Mohammed Ali',
        email: 'mohammed.ali@email.com',
        password: 'patient123',
        phone: '9876543213',
        age: 42,
        gender: 'male',
        address: '321 Elm St'
      },
      {
        name: 'Lakshmi Nair',
        email: 'lakshmi.nair@email.com',
        password: 'patient123',
        phone: '9876543214',
        age: 31,
        gender: 'female',
        address: '654 Maple Dr'
      },
      {
        name: 'Gurpreet Singh',
        email: 'gurpreet.singh@email.com',
        password: 'patient123',
        phone: '9876543215',
        age: 29,
        gender: 'male',
        address: '987 Cedar Ln'
      },
      {
        name: 'Fatima Begum',
        email: 'fatima.begum@email.com',
        password: 'patient123',
        phone: '9876543216',
        age: 38,
        gender: 'female',
        address: '147 Birch Way'
      },
      {
        name: 'Chen Wei',
        email: 'chen.wei@email.com',
        password: 'patient123',
        phone: '9876543217',
        age: 33,
        gender: 'male',
        address: '258 Spruce Ct'
      },
      {
        name: 'Maria Fernandez',
        email: 'maria.fernandez@email.com',
        password: 'patient123',
        phone: '9876543218',
        age: 26,
        gender: 'female',
        address: '369 Fir Pl'
      },
      {
        name: 'David Smith',
        email: 'david.smith@email.com',
        password: 'patient123',
        phone: '9876543219',
        age: 45,
        gender: 'male',
        address: '741 Redwood Blvd'
      },
      {
        name: 'Aisha Khan',
        email: 'aisha.khan@email.com',
        password: 'patient123',
        phone: '9876543220',
        age: 30,
        gender: 'female',
        address: '852 Sequoia Dr'
      }
    ];

    let patientsAdded = 0;
    for (const patient of patients) {
      if (!existingEmails.includes(patient.email)) {
        // Add to users table
        const hashedPassword = await hashPassword(patient.password);
        const [userResult] = await connection.execute(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [patient.name, patient.email, hashedPassword, 'patient']
        );
        
        const userId = userResult.insertId;
        
        // Add to patients table (without blood_group)
        await connection.execute(
          'INSERT INTO patients (user_id, age, gender, phone, address) VALUES (?, ?, ?, ?, ?)',
          [userId, patient.age, patient.gender, patient.phone, patient.address]
        );
        
        console.log(`✅ Added patient: ${patient.name}`);
        patientsAdded++;
      } else {
        console.log(`⏭️  Patient already exists: ${patient.email}`);
      }
    }

    // Check final counts
    const [finalUsers] = await connection.execute('SELECT COUNT(*) as total FROM users WHERE role = "doctor"');
    const [finalPatients] = await connection.execute('SELECT COUNT(*) as total FROM users WHERE role = "patient"');

    console.log('🎉 Patients seeding completed successfully!');
    console.log(`📊 Added ${patientsAdded} new patients`);
    console.log(`📈 Total doctors in database: ${finalUsers[0].total}`);
    console.log(`📈 Total patients in database: ${finalPatients[0].total}`);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error seeding patients:', error);
  }
}

seedPatients();
