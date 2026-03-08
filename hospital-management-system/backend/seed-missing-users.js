require('dotenv').config();
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function seedMissingUsers() {
  try {
    console.log('🌱 Starting missing users seeding...');
    
    // Database connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'hospital_management'
    });

    console.log('✅ Database connected successfully');

    // Hash password function
    const hashPassword = async (password) => {
      const saltRounds = 10;
      return await bcrypt.hash(password, saltRounds);
    };

    // Check existing users
    const [existingUsers] = await connection.execute('SELECT email FROM users');
    const existingEmails = existingUsers.map(user => user.email);
    console.log('📋 Existing users:', existingEmails.length);

    // Doctors to add (only if not exists)
    const doctors = [
      {
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma@hospital.com',
        password: 'doctor123',
        phone: '9876543210',
        specialization: 'Cardiology',
        experience: '8 years',
        qualification: 'MD',
        consultation_fee: 800,
        available_time: '10am - 6pm'
      },
      {
        name: 'Dr. Rahul Verma',
        email: 'rahul.verma@hospital.com',
        password: 'doctor123',
        phone: '9876543211',
        specialization: 'Orthopedics',
        experience: '6 years',
        qualification: 'MS',
        consultation_fee: 600,
        available_time: '8am - 4pm'
      },
      {
        name: 'Dr. Anjali Patel',
        email: 'anjali.patel@hospital.com',
        password: 'doctor123',
        phone: '9876543212',
        specialization: 'Pediatrics',
        experience: '7 years',
        qualification: 'MD',
        consultation_fee: 700,
        available_time: '9am - 5pm'
      },
      {
        name: 'Dr. Amit Singh',
        email: 'amit.singh@hospital.com',
        password: 'doctor123',
        phone: '9876543213',
        specialization: 'Neurology',
        experience: '10 years',
        qualification: 'DM',
        consultation_fee: 1000,
        available_time: '10am - 6pm'
      },
      {
        name: 'Dr. Neha Gupta',
        email: 'neha.gupta@hospital.com',
        password: 'doctor123',
        phone: '9876543214',
        specialization: 'Gynecology',
        experience: '5 years',
        qualification: 'MS',
        consultation_fee: 600,
        available_time: '8am - 4pm'
      },
      {
        name: 'Dr. Vikram Rao',
        email: 'vikram.rao@hospital.com',
        password: 'doctor123',
        phone: '9876543215',
        specialization: 'Dermatology',
        experience: '4 years',
        qualification: 'MD',
        consultation_fee: 500,
        available_time: '9am - 5pm'
      },
      {
        name: 'Dr. Kavita Reddy',
        email: 'kavita.reddy@hospital.com',
        password: 'doctor123',
        phone: '9876543216',
        specialization: 'Ophthalmology',
        experience: '6 years',
        qualification: 'MS',
        consultation_fee: 700,
        available_time: '10am - 6pm'
      },
      {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@hospital.com',
        password: 'doctor123',
        phone: '9876543217',
        specialization: 'ENT',
        experience: '8 years',
        qualification: 'MS',
        consultation_fee: 600,
        available_time: '8am - 4pm'
      },
      {
        name: 'Dr. Meera Joshi',
        email: 'meera.joshi@hospital.com',
        password: 'doctor123',
        phone: '9876543218',
        specialization: 'Psychiatry',
        experience: '5 years',
        qualification: 'MD',
        consultation_fee: 800,
        available_time: '9am - 5pm'
      }
    ];

    // Get department IDs
    const [departments] = await connection.execute('SELECT id FROM departments LIMIT 10');
    
    let doctorsAdded = 0;
    for (const doctor of doctors) {
      if (!existingEmails.includes(doctor.email)) {
        // Add to users table
        const hashedPassword = await hashPassword(doctor.password);
        const [userResult] = await connection.execute(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [doctor.name, doctor.email, hashedPassword, 'doctor']
        );
        
        const userId = userResult.insertId;
        
        // Add to doctors table
        const departmentId = departments[doctorsAdded % departments.length]?.id || 1;
        await connection.execute(
          'INSERT INTO doctors (user_id, department_id, experience, available_time, qualification, consultation_fee) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, departmentId, doctor.experience, doctor.available_time, doctor.qualification, doctor.consultation_fee]
        );
        
        console.log(`✅ Added doctor: ${doctor.name}`);
        doctorsAdded++;
      } else {
        console.log(`⏭️  Doctor already exists: ${doctor.email}`);
      }
    }

    // Patients to add (only if not exists)
    const patients = [
      {
        name: 'Ramesh Patel',
        email: 'ramesh.patel@email.com',
        password: 'patient123',
        phone: '9876543211',
        age: 35,
        gender: 'Male',
        blood_group: 'A+',
        address: '456 Oak Ave'
      },
      {
        name: 'Sita Devi',
        email: 'sita.devi@email.com',
        password: 'patient123',
        phone: '9876543212',
        age: 28,
        gender: 'Female',
        blood_group: 'B+',
        address: '789 Pine Rd'
      },
      {
        name: 'Mohammed Ali',
        email: 'mohammed.ali@email.com',
        password: 'patient123',
        phone: '9876543213',
        age: 42,
        gender: 'Male',
        blood_group: 'AB+',
        address: '321 Elm St'
      },
      {
        name: 'Lakshmi Nair',
        email: 'lakshmi.nair@email.com',
        password: 'patient123',
        phone: '9876543214',
        age: 31,
        gender: 'Female',
        blood_group: 'O-',
        address: '654 Maple Dr'
      },
      {
        name: 'Gurpreet Singh',
        email: 'gurpreet.singh@email.com',
        password: 'patient123',
        phone: '9876543215',
        age: 29,
        gender: 'Male',
        blood_group: 'A-',
        address: '987 Cedar Ln'
      },
      {
        name: 'Fatima Begum',
        email: 'fatima.begum@email.com',
        password: 'patient123',
        phone: '9876543216',
        age: 38,
        gender: 'Female',
        blood_group: 'B-',
        address: '147 Birch Way'
      },
      {
        name: 'Chen Wei',
        email: 'chen.wei@email.com',
        password: 'patient123',
        phone: '9876543217',
        age: 33,
        gender: 'Male',
        blood_group: 'A+',
        address: '258 Spruce Ct'
      },
      {
        name: 'Maria Fernandez',
        email: 'maria.fernandez@email.com',
        password: 'patient123',
        phone: '9876543218',
        age: 26,
        gender: 'Female',
        blood_group: 'O+',
        address: '369 Fir Pl'
      },
      {
        name: 'David Smith',
        email: 'david.smith@email.com',
        password: 'patient123',
        phone: '9876543219',
        age: 45,
        gender: 'Male',
        blood_group: 'B+',
        address: '741 Redwood Blvd'
      },
      {
        name: 'Aisha Khan',
        email: 'aisha.khan@email.com',
        password: 'patient123',
        phone: '9876543220',
        age: 30,
        gender: 'Female',
        blood_group: 'AB-',
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
        
        // Add to patients table
        await connection.execute(
          'INSERT INTO patients (user_id, age, gender, blood_group, address) VALUES (?, ?, ?, ?, ?)',
          [userId, patient.age, patient.gender, patient.blood_group, patient.address]
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

    console.log('🎉 Database seeding completed successfully!');
    console.log(`📊 Added ${doctorsAdded} new doctors and ${patientsAdded} new patients`);
    console.log(`📈 Total doctors in database: ${finalUsers[0].total}`);
    console.log(`📈 Total patients in database: ${finalPatients[0].total}`);
    
    await connection.end();
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedMissingUsers();
