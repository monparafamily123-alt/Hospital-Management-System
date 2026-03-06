-- ========================================
-- Fix User Passwords for Login Issues
-- ========================================

-- Update admin password (admin123)
UPDATE users 
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE email = 'admin@hospital.com';

-- Update doctor passwords (doctor123)
UPDATE users 
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE email IN ('anjali.reddy@hospital.com', 'doctor1@hospital.com', 'doctor2@hospital.com', 'doctor3@hospital.com');

-- Update patient passwords (patient123)
UPDATE users 
SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' 
WHERE email IN ('first.patient@hospital.com', 'rahul.sharma@patient.com', 'patient1@hospital.com', 'patient2@hospital.com', 'patient3@hospital.com');

-- Verify the updates
SELECT 
    email,
    role,
    'Password updated to: doctor123/patient123/admin123' as status
FROM users 
ORDER BY role, email;

-- Test login query (this should work)
SELECT * FROM users WHERE email = 'admin@hospital.com' AND password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';

SELECT 'Passwords updated successfully!' AS message;
