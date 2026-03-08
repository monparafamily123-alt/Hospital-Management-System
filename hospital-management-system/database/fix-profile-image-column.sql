-- Fix profile_image column in doctors table
-- Run this in phpMyAdmin or MySQL console

-- Check if column exists
DESCRIBE doctors;

-- Add profile_image column if it doesn't exist
ALTER TABLE doctors ADD COLUMN profile_image VARCHAR(500) NULL AFTER consultation_fee;

-- Verify column added
SHOW COLUMNS FROM doctors WHERE Field = 'profile_image';

-- Update specific doctor with test image
UPDATE doctors 
SET profile_image = '/uploads/profile-images/profile-17-1772793909732-731114440.webp' 
WHERE user_id = 17;

-- Check result
SELECT id, user_id, profile_image FROM doctors WHERE user_id = 17;
