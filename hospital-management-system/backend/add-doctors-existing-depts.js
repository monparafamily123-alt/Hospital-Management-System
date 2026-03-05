const mysql = require('mysql2/promise');

async function addDoctorsExistingDepts() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('Connecting to database...');
    
    // First check what departments exist
    const [deptsResult] = await connection.execute('SELECT id, name FROM departments ORDER BY id');
    const existingDepts = deptsResult[0] || [];
    console.log('Available departments:');
    if (existingDepts && existingDepts.length > 0) {
      existingDepts.forEach(dept => {
        console.log(`ID: ${dept.id} -> ${dept.name}`);
      });
    } else {
      console.log('No departments found.');
    }

    // Create doctors only for existing departments
    const doctors = [
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar2@hospital.com',
        password: 'doctor123',
        department_id: 1, // Cardiology
        experience: '10 years',
        available_time: '9:00 AM - 5:00 PM',
        qualification: 'MBBS, MD',
        consultation_fee: 500
      },
      {
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma2@hospital.com',
        password: 'doctor123',
        department_id: 2, // Neurology
        experience: '8 years',
        available_time: '10:00 AM - 6:00 PM',
        qualification: 'MBBS, MS',
        consultation_fee: 600
      },
      {
        name: 'Dr. Amit Patel',
        email: 'amit.patel2@hospital.com',
        password: 'doctor123',
        department_id: 3, // Orthopedics
        experience: '12 years',
        available_time: '8:00 AM - 4:00 PM',
        qualification: 'MBBS, MD',
        consultation_fee: 700
      },
      {
        name: 'Dr. Vikram Singh',
        email: 'vikram.singh2@hospital.com',
        password: 'doctor123',
        department_id: 1, // Cardiology
        experience: '15 years',
        available_time: '8:00 AM - 2:00 PM',
        qualification: 'MBBS, MS',
        consultation_fee: 800
      },
      {
        name: 'Dr. Anjali Gupta',
        email: 'anjali.gupta2@hospital.com',
        password: 'doctor123',
        department_id: 2, // Neurology
        experience: '7 years',
        available_time: '10:00 AM - 7:00 PM',
        qualification: 'MBBS, MD',
        consultation_fee: 550
      },
      {
        name: 'Dr. Rahul Verma',
        email: 'rahul.verma2@hospital.com',
        password: 'doctor123',
        department_id: 5, // Pediatrics
        experience: '9 years',
        available_time: '9:00 AM - 5:00 PM',
        qualification: 'MBBS, MS',
        consultation_fee: 650
      },
      {
        name: 'Dr. Kavita Nair',
        email: 'kavita.nair2@hospital.com',
        password: 'doctor123',
        department_id: 6, // Dermatology
        experience: '11 years',
        available_time: '8:00 AM - 4:00 PM',
        qualification: 'MBBS, MD',
        consultation_fee: 750
      },
      {
        name: 'Dr. Arjun Mehta',
        email: 'arjun.mehta2@hospital.com',
        password: 'doctor123',
        department_id: 3, // Orthopedics
        experience: '5 years',
        available_time: '10:00 AM - 6:00 PM',
        qualification: 'MBBS, MS',
        consultation_fee: 450
      }
    ];

    console.log('Adding 8 doctors for existing departments...');
    
    for (const doctor of doctors) {
      try {
        // First insert into users table
        const [userResult] = await connection.execute(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [doctor.name, doctor.email, doctor.password, 'doctor']
        );
        
        // Then insert into doctors table
        await connection.execute(
          `INSERT INTO doctors (
            user_id, department_id, experience, 
            available_time, qualification, consultation_fee
          ) VALUES (?, ?, ?, ?, ?, ?)`,
          [
            userResult.insertId,
            doctor.department_id,
            doctor.experience,
            doctor.available_time,
            doctor.qualification,
            doctor.consultation_fee
          ]
        );
        
        console.log(`✅ Added: ${doctor.name} (Dept ID: ${doctor.department_id})`);
      } catch (error) {
        console.error(`❌ Error adding ${doctor.name}:`, error.message);
      }
    }
    
    console.log('✅ 8 doctors added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding doctors:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed.');
  }
}

addDoctorsExistingDepts();
