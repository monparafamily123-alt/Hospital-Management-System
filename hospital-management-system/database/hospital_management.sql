-- Hospital Management System Database Schema

-- Create database
CREATE DATABASE IF NOT EXISTS hospital_management;
USE hospital_management;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'doctor', 'patient') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Doctors table
CREATE TABLE doctors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    department_id INT NOT NULL,
    experience VARCHAR(255),
    available_time VARCHAR(255),
    qualification VARCHAR(255),
    consultation_fee DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

-- Patients table
CREATE TABLE patients (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    age INT,
    gender ENUM('male', 'female', 'other'),
    phone VARCHAR(20),
    address TEXT,
    medical_history TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments table
CREATE TABLE appointments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status ENUM('pending', 'approved', 'rejected', 'completed') DEFAULT 'pending',
    symptoms TEXT,
    prescription TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Insert default admin user (password: admin123)
INSERT INTO users (name, email, password, role) VALUES 
('Admin User', 'admin@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJqJqJqJqJqJ', 'admin');

-- Insert default departments
INSERT INTO departments (name, description) VALUES 
('Cardiology', 'Heart and cardiovascular system'),
('Neurology', 'Brain and nervous system'),
('Orthopedics', 'Bones and joints'),
('Pediatrics', 'Children healthcare'),
('General Medicine', 'General healthcare'),
('Dermatology', 'Skin and hair'),
('Psychiatry', 'Mental health'),
('Gynecology', 'Women healthcare');

-- Insert sample doctors
INSERT INTO users (name, email, password, role) VALUES 
('Dr. John Smith', 'doctor1@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJqJqJqJqJqJ', 'doctor'),
('Dr. Sarah Johnson', 'doctor2@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJqJqJqJqJqJ', 'doctor'),
('Dr. Michael Brown', 'doctor3@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJqJqJqJqJqJ', 'doctor');

-- Insert doctor details
INSERT INTO doctors (user_id, department_id, experience, available_time, qualification, consultation_fee) VALUES 
(2, 1, '10 years', 'Mon-Fri 9AM-5PM', 'MD Cardiology', 500.00),
(3, 2, '8 years', 'Mon-Sat 10AM-6PM', 'MD Neurology', 600.00),
(4, 3, '12 years', 'Mon-Fri 8AM-4PM', 'MS Orthopedics', 450.00);

-- Insert sample patients
INSERT INTO users (name, email, password, role) VALUES 
('Alice Wilson', 'patient1@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJqJqJqJqJqJ', 'patient'),
('Bob Davis', 'patient2@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJqJqJqJqJqJ', 'patient'),
('Carol Martinez', 'patient3@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJqJqJqJqJqJ', 'patient');

-- Insert patient details
INSERT INTO patients (user_id, age, gender, phone, address, medical_history) VALUES 
(5, 35, 'female', '1234567890', '123 Main St, City', 'Hypertension'),
(6, 45, 'male', '0987654321', '456 Oak Ave, City', 'Diabetes Type 2'),
(7, 28, 'female', '1122334455', '789 Pine Rd, City', 'No known allergies');

-- Insert sample appointments
INSERT INTO appointments (patient_id, doctor_id, appointment_date, status, symptoms) VALUES 
(1, 1, '2024-01-15 10:00:00', 'approved', 'Chest pain, shortness of breath'),
(2, 2, '2024-01-16 14:00:00', 'pending', 'Frequent headaches, dizziness'),
(3, 3, '2024-01-17 11:00:00', 'completed', 'Knee pain, difficulty walking');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_doctors_department_id ON doctors(department_id);
