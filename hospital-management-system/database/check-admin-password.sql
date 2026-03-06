-- Check admin user password
SELECT 
    id,
    name,
    email,
    role,
    password,
    LENGTH(password) as password_length,
    CASE 
        WHEN password = 'admin123' THEN '✅ CORRECT'
        ELSE '❌ WRONG'
    END as password_status
FROM users 
WHERE email = 'admin@hospital.com';

-- If password is wrong, fix it
UPDATE users 
SET password = 'admin123' 
WHERE email = 'admin@hospital.com' AND password != 'admin123';

-- Verify after update
SELECT 
    email,
    password,
    CASE 
        WHEN password = 'admin123' THEN '✅ FIXED'
        ELSE '❌ STILL WRONG'
    END as final_status
FROM users 
WHERE email = 'admin@hospital.com';
