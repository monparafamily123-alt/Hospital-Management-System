-- ========================================
-- Hospital Management System - phpMyAdmin Import
-- ========================================
-- Instructions:
-- 1. Open phpMyAdmin
-- 2. Select hospital_management database
-- 3. Click "Import" tab
-- 4. Choose this file
-- 5. Click "Go"

-- Drop existing tables if they exist
DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS patients;
DROP TABLE IF EXISTS doctors;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS users;

-- Create users table with profile_image support
CREATE TABLE `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `email` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `role` enum('admin','doctor','patient') NOT NULL,
    `profile_image` varchar(500) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create departments table
CREATE TABLE `departments` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `description` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create doctors table with profile_image support
CREATE TABLE `doctors` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `department_id` int(11) NOT NULL,
    `experience` varchar(255) DEFAULT NULL,
    `available_time` varchar(255) DEFAULT NULL,
    `qualification` varchar(255) DEFAULT NULL,
    `consultation_fee` decimal(10,2) DEFAULT 0.00,
    `profile_image` varchar(500) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    KEY `department_id` (`department_id`),
    CONSTRAINT `doctors_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
    CONSTRAINT `doctors_ibfk_2` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create patients table with profile_image support
CREATE TABLE `patients` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `age` int(11) DEFAULT NULL,
    `gender` enum('male','female','other') DEFAULT NULL,
    `phone` varchar(20) DEFAULT NULL,
    `address` text DEFAULT NULL,
    `medical_history` text DEFAULT NULL,
    `profile_image` varchar(500) DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `user_id` (`user_id`),
    CONSTRAINT `patients_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Create appointments table
CREATE TABLE `appointments` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `patient_id` int(11) NOT NULL,
    `doctor_id` int(11) NOT NULL,
    `appointment_date` datetime NOT NULL,
    `status` enum('pending','approved','rejected','completed') NOT NULL DEFAULT 'pending',
    `symptoms` text DEFAULT NULL,
    `prescription` text DEFAULT NULL,
    `notes` text DEFAULT NULL,
    `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
    `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    PRIMARY KEY (`id`),
    KEY `patient_id` (`patient_id`),
    KEY `doctor_id` (`doctor_id`),
    KEY `status` (`status`),
    KEY `appointment_date` (`appointment_date`),
    CONSTRAINT `appointments_ibfk_1` FOREIGN KEY (`patient_id`) REFERENCES `patients` (`id`) ON DELETE CASCADE,
    CONSTRAINT `appointments_ibfk_2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert default admin user (password: admin123)
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Admin User', 'admin@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJqJ', 'admin');

-- Insert default departments
INSERT INTO `departments` (`name`, `description`) VALUES
('Cardiology', 'Heart and cardiovascular system'),
('Neurology', 'Brain and nervous system'),
('Orthopedics', 'Bones and joints'),
('Pediatrics', 'Children healthcare'),
('General Medicine', 'General healthcare'),
('Dermatology', 'Skin and hair'),
('Psychiatry', 'Mental health'),
('Gynecology', 'Women healthcare');

-- Insert sample doctors with proper hashed passwords (password: doctor123)
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('Dr. Anjali Reddy', 'anjali.reddy@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJqJ', 'doctor'),
('Dr. John Smith', 'doctor1@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJqJ', 'doctor'),
('Dr. Sarah Johnson', 'doctor2@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJqJ', 'doctor'),
('Dr. Michael Brown', 'doctor3@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJ', 'doctor');

-- Insert doctor details
INSERT INTO `doctors` (`user_id`, `department_id`, `experience`, `available_time`, `qualification`, `consultation_fee`) VALUES
(2, 8, '15 years', 'Mon-Fri 9AM-5PM', 'MD Gynecology', 800.00),
(3, 1, '10 years', 'Mon-Fri 9AM-5PM', 'MD Cardiology', 500.00),
(4, 2, '8 years', 'Mon-Sat 10AM-6PM', 'MD Neurology', 600.00),
(5, 3, '12 years', 'Mon-Fri 8AM-4PM', 'MS Orthopedics', 450.00);

-- Insert sample patients with proper hashed passwords (password: patient123)
INSERT INTO `users` (`name`, `email`, `password`, `role`) VALUES
('First Patient', 'first.patient@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJ', 'patient'),
('Rahul Sharma', 'rahul.sharma@patient.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJqJ', 'patient'),
('Alice Wilson', 'patient1@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJ', 'patient'),
('Bob Davis', 'patient2@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJ', 'patient'),
('Carol Martinez', 'patient3@hospital.com', '$2b$10$rQZ8kHWKtGY5uKx4vJ2K/.3qJqJqJqJqJqJqJqJqJqJ', 'patient');

-- Insert patient details
INSERT INTO `patients` (`user_id`, `age`, `gender`, `phone`, `address`, `medical_history`) VALUES
(6, 25, 'male', '9876543210', '123 Main St, City', 'No known allergies'),
(7, 35, 'male', '1234567890', '456 Oak Ave, City', 'Hypertension'),
(8, 45, 'male', '0987654321', '789 Pine Rd, City', 'Diabetes Type 2'),
(9, 28, 'female', '1122334455', '789 Pine Rd, City', 'No known allergies');

-- Insert sample appointments
INSERT INTO `appointments` (`patient_id`, `doctor_id`, `appointment_date`, `status`, `symptoms`) VALUES
(1, 1, '2026-03-06 10:00:00', 'approved', 'For Check'),
(2, 2, '2026-03-06 14:00:00', 'pending', 'Chest pain, shortness of breath'),
(3, 3, '2026-03-06 11:00:00', 'completed', 'Frequent headaches, dizziness'),
(1, 3, '2026-03-07 15:00:00', 'pending', 'Knee pain, difficulty walking');

-- Create indexes for better performance
CREATE INDEX `idx_users_email` ON `users` (`email`);
CREATE INDEX `idx_users_role` ON `users` (`role`);
CREATE INDEX `idx_appointments_patient_id` ON `appointments` (`patient_id`);
CREATE INDEX `idx_appointments_doctor_id` ON `appointments` (`doctor_id`);
CREATE INDEX `idx_appointments_status` ON `appointments` (`status`);
CREATE INDEX `idx_appointments_date` ON `appointments` (`appointment_date`);
CREATE INDEX `idx_doctors_department_id` ON `doctors` (`department_id`);

-- Success message
SELECT 'Database tables created successfully!' AS message;
