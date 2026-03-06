-- Fix ALL existing users' passwords to plain text
-- This will resolve login issues for all existing accounts

-- Update admin password
UPDATE users SET password = 'admin123' WHERE email = 'admin@hospital.com';

-- Update doctor passwords
UPDATE users SET password = 'doctor123' WHERE email IN (
    'anjali.reddy@hospital.com', 
    'doctor1@hospital.com', 
    'doctor2@hospital.com', 
    'doctor3@hospital.com'
);

-- Update patient passwords
UPDATE users SET password = 'patient123' WHERE email IN (
    'first.patient@hospital.com',
    'rahul.sharma@patient.com',
    'patient1@hospital.com',
    'patient2@hospital.com',
    'patient3@hospital.com'
);

-- Show updated users
SELECT 
    id,
    name,
    email,
    role,
    password,
    'PLAIN TEXT - Ready for login' as status
FROM users 
ORDER BY role, id;

-- Count updated users
SELECT 
    role,
    COUNT(*) as count,
    'Passwords updated to plain text' as status
FROM users 
GROUP BY role;

SELECT 'All existing users passwords updated!' AS message;
