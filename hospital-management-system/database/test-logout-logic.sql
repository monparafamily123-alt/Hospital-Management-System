-- Test Logout Logic - Delete users and verify logout

-- Step 1: Check current users
SELECT '=== BEFORE DELETE ===' as step;
SELECT email, role FROM users ORDER BY role;

-- Step 2: Delete all users (simulate your scenario)
DELETE FROM users;

-- Step 3: Verify users are deleted
SELECT '=== AFTER DELETE ===' as step;
SELECT COUNT(*) as remaining_users FROM users;

-- Step 4: Test what happens now
-- Expected behavior:
-- 1. Existing logged-in users should be logged out when they try to access protected routes
-- 2. New login attempts should fail with "Invalid credentials"
-- 3. Profile check should return 401 for deleted users

-- To restore users for testing, run this:
-- INSERT INTO users (name, email, password, role) VALUES
-- ('Admin User', 'admin@hospital.com', 'admin123', 'admin'),
-- ('Dr. Anjali Reddy', 'anjali.reddy@hospital.com', 'doctor123', 'doctor'),
-- ('Rahul Sharma', 'rahul.sharma@patient.com', 'patient123', 'patient');

SELECT 'Logout logic test ready!' AS message;
