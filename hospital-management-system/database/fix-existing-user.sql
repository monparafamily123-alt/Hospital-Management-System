-- Fix existing user login issue
-- Update the newly created user's password to plain text

-- Find the most recently created user
SELECT id, name, email, role, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 1;

-- Update the most recent user's password to plain text
UPDATE users 
SET password = 'admin123' 
WHERE id = (SELECT MAX(id) FROM users);

-- Verify the fix
SELECT id, name, email, role, password, created_at 
FROM users 
ORDER BY created_at DESC 
LIMIT 1;

SELECT 'Existing user password fixed!' AS message;
