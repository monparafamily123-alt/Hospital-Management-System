-- Emergency Password Fix - Use plain text for testing
-- This will allow login to work immediately

-- Update admin password to plain text 'admin123' (temporary fix)
UPDATE users SET password = 'admin123' WHERE email = 'admin@hospital.com';

-- Update doctor passwords to plain text 'doctor123' (temporary fix)
UPDATE users SET password = 'doctor123' WHERE email IN ('anjali.reddy@hospital.com', 'doctor1@hospital.com', 'doctor2@hospital.com', 'doctor3@hospital.com');

-- Update patient passwords to plain text 'patient123' (temporary fix)
UPDATE users SET password = 'patient123' WHERE email IN ('first.patient@hospital.com', 'rahul.sharma@patient.com', 'patient1@hospital.com', 'patient2@hospital.com', 'patient3@hospital.com');

-- Verify the updates
SELECT email, role, password FROM users ORDER BY role, email;

SELECT 'Emergency password fix applied!' AS message;
