-- Verify login fix - Check all users with plain text passwords

-- Check all users
SELECT 
    id,
    name,
    email,
    role,
    password,
    CASE 
        WHEN password IN ('admin123', 'doctor123', 'patient123') THEN '✅ READY'
        ELSE '❌ NEEDS FIX'
    END as login_status
FROM users 
ORDER BY role, id;

-- Test login credentials
SELECT '=== LOGIN CREDENTIALS ===' as info;
SELECT 'Admin: admin@hospital.com / admin123' as admin_login;
SELECT 'Doctor: anjali.reddy@hospital.com / doctor123' as doctor_login;
SELECT 'Patient: rahul.sharma@patient.com / patient123' as patient_login;

-- Count users by role
SELECT 
    role,
    COUNT(*) as total_users,
    SUM(CASE WHEN password IN ('admin123', 'doctor123', 'patient123') THEN 1 ELSE 0 END) as ready_users
FROM users 
GROUP BY role;

SELECT 'Login fix verification complete!' AS message;
