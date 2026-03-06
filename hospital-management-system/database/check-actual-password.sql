-- CHECK ACTUAL PASSWORDS IN DATABASE

-- Check admin user password exactly as stored
SELECT 
    id,
    name,
    email,
    role,
    password,
    CHAR_LENGTH(password) as password_length,
    CASE 
        WHEN password = 'admin123' THEN 'PLAIN TEXT CORRECT'
        WHEN password LIKE '$2b$%' THEN 'HASHED - NEEDS FIX'
        ELSE 'UNKNOWN FORMAT'
    END as password_type
FROM users 
WHERE email = 'admin@hospital.com';

-- Check all users
SELECT 
    email,
    role,
    LEFT(password, 20) as password_preview,
    CASE 
        WHEN password = 'admin123' THEN 'ADMIN CORRECT'
        WHEN password = 'doctor123' THEN 'DOCTOR CORRECT'
        WHEN password = 'patient123' THEN 'PATIENT CORRECT'
        WHEN password LIKE '$2b$%' THEN 'HASHED'
        ELSE 'PLAIN TEXT OTHER'
    END as status
FROM users 
ORDER BY role, id;

-- If admin password is wrong, force update it
UPDATE users 
SET password = 'admin123' 
WHERE email = 'admin@hospital.com' 
AND password != 'admin123';

-- Show final result
SELECT email, password, 'FINAL CHECK' as status FROM users WHERE email = 'admin@hospital.com';
