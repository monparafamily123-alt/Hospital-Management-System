-- Check the newly registered user
SELECT * FROM users WHERE email LIKE '%test.admin%' ORDER BY created_at DESC LIMIT 1;

-- Check all recent users
SELECT 
    id,
    name,
    email,
    role,
    LEFT(password, 20) as password_preview,
    CASE 
        WHEN password LIKE '$2b$%' THEN 'Hashed'
        ELSE 'Plain Text'
    END as password_type,
    created_at
FROM users 
ORDER BY created_at DESC 
LIMIT 5;

-- If new user has hashed password, update it to plain text for testing
UPDATE users 
SET password = 'admin123' 
WHERE email LIKE '%test.admin%' AND password LIKE '$2b$%';

SELECT 'Password updated for testing' AS message;
