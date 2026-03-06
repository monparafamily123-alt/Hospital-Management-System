-- IMMEDIATE PASSWORD FIX - Run this NOW!

-- Check current admin password
SELECT email, password, LENGTH(password) as len FROM users WHERE email = 'admin@hospital.com';

-- Force update admin password
UPDATE users SET password = 'admin123' WHERE email = 'admin@hospital.com';

-- Verify update
SELECT email, password, 'FIXED' as status FROM users WHERE email = 'admin@hospital.com';

-- Also fix other users
UPDATE users SET password = 'doctor123' WHERE email = 'anjali.reddy@hospital.com';
UPDATE users SET password = 'patient123' WHERE email = 'rahul.sharma@patient.com';

-- Show all fixed users
SELECT email, password, role FROM users WHERE email IN ('admin@hospital.com', 'anjali.reddy@hospital.com', 'rahul.sharma@patient.com') ORDER BY role;

SELECT 'IMMEDIATE PASSWORD FIX COMPLETED!' AS message;
