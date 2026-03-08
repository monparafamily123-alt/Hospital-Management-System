-- Add profile_image column to users table
ALTER TABLE users ADD COLUMN profile_image VARCHAR(500) NULL AFTER role;

-- Add profile_image column to doctors table
ALTER TABLE doctors ADD COLUMN profile_image VARCHAR(500) NULL AFTER consultation_fee;

-- Verify columns added
DESCRIBE users;
DESCRIBE doctors;

-- Test update
UPDATE users SET profile_image = '/uploads/profile-images/test.jpg' WHERE email = 'sahildoctor@gmail.com' LIMIT 1;

-- Check result
SELECT id, name, email, profile_image FROM users WHERE email = 'sahildoctor@gmail.com';
