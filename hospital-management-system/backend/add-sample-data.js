const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function addSampleData() {
  try {
    console.log('Connecting to database...');
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    console.log('Adding sample data...');
    
    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 10);
    const doctorPassword = await bcrypt.hash('admin123', 10);
    const patientPassword = await bcrypt.hash('admin123', 10);

    // Insert admin user
    await connection.execute(
      'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin User', 'admin@hospital.com', adminPassword, 'admin']
    );

    // Insert departments
    await connection.execute(
      'INSERT IGNORE INTO departments (name, description) VALUES (?, ?)',
      ['Cardiology', 'Heart and cardiovascular system']
    );
    await connection.execute(
      'INSERT IGNORE INTO departments (name, description) VALUES (?, ?)',
      ['Neurology', 'Brain and nervous system']
    );
    await connection.execute(
      'INSERT IGNORE INTO departments (name, description) VALUES (?, ?)',
      ['General Medicine', 'General healthcare']
    );

    // Insert doctor users
    await connection.execute(
      'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Dr. John Smith', 'doctor1@hospital.com', doctorPassword, 'doctor']
    );
    await connection.execute(
      'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Dr. Sarah Johnson', 'doctor2@hospital.com', doctorPassword, 'doctor']
    );

    // Insert doctor details
    await connection.execute(
      'INSERT IGNORE INTO doctors (user_id, department_id, experience, available_time, qualification, consultation_fee) VALUES (?, ?, ?, ?, ?, ?)',
      [2, 1, '10 years', 'Mon-Fri 9AM-5PM', 'MD Cardiology', 500.00]
    );
    await connection.execute(
      'INSERT IGNORE INTO doctors (user_id, department_id, experience, available_time, qualification, consultation_fee) VALUES (?, ?, ?, ?, ?, ?)',
      [3, 2, '8 years', 'Mon-Sat 10AM-6PM', 'MD Neurology', 600.00]
    );

    // Insert patient users
    await connection.execute(
      'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Alice Wilson', 'patient1@hospital.com', patientPassword, 'patient']
    );
    await connection.execute(
      'INSERT IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Bob Davis', 'patient2@hospital.com', patientPassword, 'patient']
    );

    // Insert patient details
    await connection.execute(
      'INSERT IGNORE INTO patients (user_id, age, gender, phone, address, medical_history) VALUES (?, ?, ?, ?, ?, ?)',
      [4, 35, 'female', '1234567890', '123 Main St, City', 'Hypertension']
    );
    await connection.execute(
      'INSERT IGNORE INTO patients (user_id, age, gender, phone, address, medical_history) VALUES (?, ?, ?, ?, ?, ?)',
      [5, 45, 'male', '0987654321', '456 Oak Ave, City', 'Diabetes Type 2']
    );

    console.log('Sample data added successfully!');
    await connection.end();
    
  } catch (error) {
    console.error('Error adding sample data:', error);
    process.exit(1);
  }
}

addSampleData();
