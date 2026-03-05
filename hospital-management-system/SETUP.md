# 🚀 Setup & Run Guide - Hospital Management System

## 📋 Prerequisites

Make sure you have the following installed on your system:

1. **Node.js** (v14 or higher) - [Download Node.js](https://nodejs.org/)
2. **XAMPP** - [Download XAMPP](https://www.apachefriends.org/)
3. **Git** - [Download Git](https://git-scm.com/)

## 🗂️ Project Structure

```
hospital-management-system/
├── backend/          # Node.js + Express.js Backend
├── frontend/         # React.js Frontend
├── database/         # MySQL Database Files
└── README.md         # Project Documentation
```

## 🛠️ Step-by-Step Setup

### Step 1: Database Setup (XAMPP)

1. **Start XAMPP Control Panel**
   - Open XAMPP Control Panel
   - Start **Apache** and **MySQL** services

2. **Create Database**
   - Open your web browser
   - Go to `http://localhost/phpmyadmin`
   - Click on **"New"** in the left sidebar
   - Enter database name: `hospital_management`
   - Click **"Create"**

3. **Import Database Schema**
   - Select the `hospital_management` database
   - Click on **"Import"** tab
   - Choose file: `database/hospital_management.sql`
   - Click **"Go"** (bottom of the page)

4. **Verify Database**
   - You should see tables: users, doctors, patients, departments, appointments
   - Click on each table to verify data is imported

### Step 2: Backend Setup

1. **Open Terminal/Command Prompt**
   ```bash
   # Navigate to backend directory
   cd "d:/Final Sem/React js/hospital-management-system/backend"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   - Open `.env` file in the backend folder
   - Verify the settings:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=hospital_management
   PORT=5000
   JWT_SECRET=your_jwt_secret_key_here_change_this_in_production
   ```
   - **Important**: If your MySQL has a password, update `DB_PASSWORD`

4. **Start Backend Server**
   ```bash
   npm start
   ```
   
   **Success Indicators:**
   - You should see: `Server is running on port 5000`
   - Test API: Open browser → `http://localhost:5000/api/health`
   - Should return: `{"status":"OK","message":"Hospital Management System API is running"}`

### Step 3: Frontend Setup

1. **Open New Terminal/Command Prompt** (keep backend running)
   ```bash
   # Navigate to frontend directory
   cd "d:/Final Sem/React js/hospital-management-system/frontend"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Frontend Development Server**
   ```bash
   npm run dev
   ```

4. **Access the Application**
   - Open browser: `http://localhost:5173`
   - You should see the login page

## 🔐 Default Login Credentials

| Role      | Email                    | Password    |
|-----------|--------------------------|-------------|
| Admin     | admin@hospital.com       | admin123    |
| Doctor    | doctor1@hospital.com     | doctor123   |
| Patient   | patient1@hospital.com    | patient123  |

## 🧪 Testing the System

### 1. Test Admin Login
1. Go to `http://localhost:5173`
2. Login with admin credentials
3. You should be redirected to Admin Dashboard
4. Try adding a new doctor

### 2. Test Doctor Login
1. Logout and login with doctor credentials
2. You should see Doctor Dashboard
3. Check appointments section

### 3. Test Patient Registration/Login
1. Register a new patient account
2. Login and try booking an appointment

## 🚨 Common Issues & Solutions

### Issue 1: Database Connection Error
**Error:** `ECONNREFUSED` or `Access denied`
**Solution:**
- Make sure XAMPP MySQL service is running
- Check database name is correct: `hospital_management`
- Verify MySQL password in `.env` file

### Issue 2: Port Already in Use
**Error:** `EADDRINUSE: address already in use :::5000`
**Solution:**
```bash
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Issue 3: Frontend Not Loading
**Error:** Blank page or errors
**Solution:**
- Make sure backend is running on port 5000
- Check browser console for errors (F12 → Console)
- Clear browser cache and reload

### Issue 4: CORS Errors
**Error:** CORS policy error in browser console
**Solution:**
- Backend server should be running
- Check `vite.config.js` has correct proxy settings

## 🔄 Development Workflow

### For Development:
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### For Production:
```bash
# Backend
cd backend
npm start

# Frontend (build and serve)
cd frontend
npm run build
# Then serve the dist folder with any static server
```

## 📱 Access URLs

- **Frontend Application:** `http://localhost:5173`
- **Backend API:** `http://localhost:5000`
- **API Health Check:** `http://localhost:5000/api/health`
- **Database (phpMyAdmin):** `http://localhost/phpmyadmin`

## 🛡️ Security Notes

1. **Change Default Passwords:** Update all default login credentials
2. **JWT Secret:** Change the `JWT_SECRET` in `.env` file
3. **Database Security:** Set a strong MySQL password
4. **HTTPS:** Use HTTPS in production

## 🆘 Need Help?

If you encounter any issues:

1. **Check Console Logs:** Always check browser console (F12) and terminal output
2. **Verify Services:** Ensure XAMPP services are running
3. **Check Ports:** Make sure ports 5000 and 5173 are available
4. **Restart Services:** Sometimes restarting XAMPP and terminals helps

## 🎯 Quick Start Commands

```bash
# Quick setup (run in order)
cd "d:/Final Sem/React js/hospital-management-system/backend"
npm install
npm start

# Open new terminal
cd "d:/Final Sem/React js/hospital-management-system/frontend"
npm install
npm run dev
```

That's it! Your Hospital Management System should now be running successfully! 🎉
