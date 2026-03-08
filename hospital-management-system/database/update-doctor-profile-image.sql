-- Update doctor profile image
-- Run this in phpMyAdmin

-- Check current doctor data
SELECT id, user_id, name, profile_image FROM doctors WHERE user_id = 17;

-- Update profile image for user_id 17
UPDATE doctors 
SET profile_image = '/uploads/profile-images/profile-17-1772793909732-731114440.webp' 
WHERE user_id = 17;

-- Verify update
SELECT id, user_id, name, profile_image FROM doctors WHERE user_id = 17;
