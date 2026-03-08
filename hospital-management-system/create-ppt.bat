@echo off
echo ========================================
echo Hospital Management System PPT Creator
echo ========================================
echo.

echo 1. Starting servers for screenshots...
echo.

REM Start backend
echo Starting backend server...
cd "d:\Final Sem\hospital-management\hospital-management-system\backend"
start "Backend Server" cmd /k "npm start"

REM Wait for backend to start
timeout /t 5 /nobreak >nul

REM Start frontend
echo Starting frontend server...
cd "d:\Final Sem\hospital-management\hospital-management-system\frontend"
start "Frontend Server" cmd /k "npm run dev"

REM Wait for frontend to start
timeout /t 10 /nobreak >nul

echo.
echo 2. Servers are ready!
echo.
echo 3. Open these URLs to capture screenshots:
echo    - Login Page: http://localhost:5173/login
echo    - Admin Dashboard: http://localhost:5173/admin/dashboard
echo    - Doctor Dashboard: http://localhost:5173/doctor/dashboard
echo    - Patient Dashboard: http://localhost:5173/patient/dashboard
echo.
echo 4. Login Credentials:
echo    - Admin: admin@hospital.com / admin123
echo    - Doctor: anjali.reddy@hospital.com / doctor123
echo    - Patient: rahul.sharma@patient.com / patient123
echo.
echo 5. Use Windows Snipping Tool (Win + Shift + S) to capture screenshots
echo.
echo 6. Save screenshots in the project folder with these names:
echo    - login-page.png
echo    - admin-dashboard.png
echo    - doctor-dashboard.png
echo    - patient-dashboard.png
echo    - database-schema.png
echo    - api-testing.png
echo    - code-editor.png
echo    - project-structure.png
echo.
echo 7. Refer to HOSPITAL-MANAGEMENT-PPT.md for presentation content
echo.
echo ========================================
echo Press any key to exit...
pause >nul
