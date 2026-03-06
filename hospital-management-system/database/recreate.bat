@echo off
echo ========================================
echo Hospital Management System
echo Database Recreation Script
echo ========================================
echo.

echo Step 1: Dropping old database...
mysql -u root -p -e "DROP DATABASE IF EXISTS hospital_management;"

echo.
echo Step 2: Creating new database...
mysql -u root -p -e "CREATE DATABASE hospital_management;"

echo.
echo Step 3: Creating tables and inserting data...
mysql -u root -p hospital_management < recreate-database.sql

echo.
echo ========================================
echo ✅ Database recreated successfully!
echo ========================================
echo.
echo Login Credentials:
echo Admin: admin@hospital.com / admin123
echo Doctor: anjali.reddy@hospital.com / doctor123
echo Patient: rahul.sharma@patient.com / patient123
echo.
echo Now you can run your project!
echo.
pause
