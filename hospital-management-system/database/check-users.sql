-- Check all users in database
SELECT 
    id,
    name,
    email,
    role,
    password,
    created_at
FROM users 
ORDER BY role, id;

-- Check if admin user exists
SELECT * FROM users WHERE email = 'admin@hospital.com';

-- Check total users count
SELECT 
    role,
    COUNT(*) as count
FROM users 
GROUP BY role;
