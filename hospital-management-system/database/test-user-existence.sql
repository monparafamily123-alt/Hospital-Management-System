-- Test user existence in database
-- This will help verify the database check logic

-- Check if admin user exists
SELECT 
    email,
    role,
    CASE 
        WHEN email IS NOT NULL THEN '✅ EXISTS'
        ELSE '❌ NOT FOUND'
    END as status
FROM users 
WHERE email = 'admin@hospital.com';

-- Check all test users
SELECT 
    email,
    role,
    password,
    CASE 
        WHEN password = 'admin123' THEN 'PLAIN TEXT'
        WHEN password LIKE '$2b$%' THEN 'HASHED'
        ELSE 'OTHER'
    END as password_type
FROM users 
WHERE email IN ('admin@hospital.com', 'anjali.reddy@hospital.com', 'rahul.sharma@patient.com')
ORDER BY role;

-- Test with non-existent user
SELECT 
    'nonexistent@test.com' as test_email,
    'This user should NOT exist' as expected_result;

-- If you want to test logout for non-existent user
-- Try logging in with: nonexistent@test.com / anypassword
-- Expected: "Invalid credentials" error
