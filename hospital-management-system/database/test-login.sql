-- Test login with correct password hash
SELECT * FROM users WHERE email = 'admin@hospital.com';

-- Update with correct bcrypt hash for 'admin123'
UPDATE users SET password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' WHERE email = 'admin@hospital.com';

-- Verify update
SELECT * FROM users WHERE email = 'admin@hospital.com' AND password = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi';
