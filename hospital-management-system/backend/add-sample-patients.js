const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function addSamplePatients() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management'
  });

  try {
    console.log('Adding sample patients...');

    // Sample patient data
    const patients = [
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        password: 'patient123',
        age: 35,
        phone: '9876543210',
        gender: 'Male',
        address: '123 Main St, City',
        medical_history: 'No major medical issues'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        password: 'patient123',
        age: 28,
        phone: '9876543211',
        gender: 'Female',
        address: '456 Oak Ave, Town',
        medical_history: 'Allergic to penicillin'
      },
      {
        name: 'Michael Brown',
        email: 'michael.b@email.com',
        password: 'patient123',
        age: 42,
        phone: '9876543212',
        gender: 'Male',
        address: '789 Pine Rd, Village',
        medical_history: 'Hypertension controlled with medication'
      }
    ];

    for (const patient of patients) {
      // Check if user already exists
      const [existingUser] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [patient.email]
      );

      if (existingUser.length === 0) {
        // Create user
        const hashedPassword = await bcrypt.hash(patient.password, 10);
        const [userResult] = await connection.execute(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [patient.name, patient.email, hashedPassword, 'patient']
        );
        
        const userId = userResult.insertId;

        // Create patient record
        await connection.execute(
          'INSERT INTO patients (user_id, age, phone, gender, address, medical_history) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, patient.age, patient.phone, patient.gender, patient.address, patient.medical_history]
        );

        console.log(`✅ Added patient: ${patient.name}`);
      } else {
        console.log(`⚠️ Patient ${patient.email} already exists`);
      }
    }

    console.log('🎉 Sample patients added successfully!');

  } catch (error) {
    console.error('❌ Error adding sample patients:', error);
  } finally {
    await connection.end();
  }
}

addSamplePatients();
