@echo off
echo ========================================
echo Password Fix Script
echo ========================================
echo.

echo Fixing user passwords...
mysql -u root -p hospital_management < fix-user-passwords.sql

echo.
echo ✅ Passwords updated!
echo.
echo New Login Credentials:
echo Admin: admin@hospital.com / admin123
echo Doctor: anjali.reddy@hospital.com / doctor123
echo Patient: rahul.sharma@patient.com / patient123
echo.
echo Try login now!
echo.
pause
