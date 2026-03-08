-- Check doctors table structure
DESCRIBE doctors;

-- Check if profile_image column exists
SHOW COLUMNS FROM doctors WHERE Field = 'profile_image';

-- Add profile_image column if it doesn't exist
ALTER TABLE doctors ADD COLUMN profile_image VARCHAR(500) NULL AFTER consultation_fee;

-- Verify column added
DESCRIBE doctors;

-- Test with existing doctor
SELECT id, user_id, name, profile_image FROM doctors d 
JOIN users u ON d.user_id = u.id 
WHERE u.email = 'sahildoctor@gmail.com';
