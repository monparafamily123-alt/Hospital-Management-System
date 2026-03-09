-- Hospital Management System Database Setup
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'patient') NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE IF NOT EXISTS doctors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  department_id INT NOT NULL,
  experience VARCHAR(100),
  available_time VARCHAR(100),
  qualification VARCHAR(255),
  consultation_fee DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Patients table
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  age INT,
  phone VARCHAR(20),
  medical_history TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  doctor_id INT NOT NULL,
  patient_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  time TIME NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
  reason TEXT,
  symptoms TEXT,
  prescription TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctors(id),
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Insert default departments
INSERT IGNORE INTO departments (id, name, description) VALUES
(1, 'General Medicine', 'General medical consultations and check-ups'),
(2, 'Cardiology', 'Heart and cardiovascular system treatments'),
(3, 'Orthopedics', 'Bone and joint treatments'),
(4, 'Pediatrics', 'Child healthcare and treatments'),
(5, 'Neurology', 'Brain and nervous system treatments'),
(6, 'Dermatology', 'Skin treatments and care'),
(7, 'Ophthalmology', 'Eye care and treatments'),
(8, 'ENT', 'Ear, nose, and throat treatments'),
(9, 'Psychiatry', 'Mental health treatments'),
(10, 'Gynecology', 'Female reproductive health');

-- Insert default admin user
INSERT IGNORE INTO users (id, name, email, password, role) VALUES
(1, 'Admin User', 'sahiladmin@gmail.com', '@Sahil2003', 'admin');

-- Insert default doctor user
INSERT IGNORE INTO users (id, name, email, password, role) VALUES
(2, 'Dr. Sahil Kumar', 'saahildoctor@gmail.com', '@Sahil2003', 'doctor');

-- Insert default doctor record
INSERT IGNORE INTO doctors (user_id, department_id, experience, available_time, qualification, consultation_fee) VALUES
(2, 1, '5 years', '9am - 5pm', 'MBBS', 500);

-- Insert default patient user
INSERT IGNORE INTO users (id, name, email, password, role) VALUES
(3, 'Sahil Patient', 'sahilpatient@gmail.com', '@Sahil2003', 'patient');

-- Insert default patient record
INSERT IGNORE INTO patients (user_id, age, phone) VALUES
(3, 25, '1234567890');

-- Insert sample appointments
INSERT IGNORE INTO appointments (doctor_id, patient_id, appointment_date, time, status, reason, symptoms) VALUES
(1, 1, '2026-03-09', '10:00:00', 'pending', 'General checkup', 'Feeling fine but want routine checkup'),
(1, 1, '2026-03-08', '11:00:00', 'completed', 'Follow-up', 'Checking previous treatment progress');

SELECT 'Database setup completed successfully!' AS message;
