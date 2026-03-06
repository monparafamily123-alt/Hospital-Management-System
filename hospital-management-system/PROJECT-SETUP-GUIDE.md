# 🏥 Hospital Management System - Complete Setup Guide

## 🚀 Quick Start Instructions

### 📋 Prerequisites
- Node.js (v14 or higher)
- MySQL Database
- Git (already installed)

---

## 🗄️ Database Setup

### 1. Create Database
```sql
CREATE DATABASE hospital_management;
USE hospital_management;
```

### 2. Import Sample Data
```bash
cd backend
mysql -u root -p hospital_management < database.sql
```

---

## 🔧 Backend Setup

### 1. Navigate to Backend
```bash
cd "d:\Final Sem\hospital-management\hospital-management-system\backend"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
# Check .env file exists with:
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=hospital_management
PORT=5000
JWT_SECRET=your_jwt_secret
```

### 4. Start Backend Server
```bash
npm start
```

**Expected Output:**
```
🚀 Server starting...
📡 Server running on port: 5000
✅ Server started successfully!
```

---

## 🎨 Frontend Setup

### 1. Open New Terminal
```bash
cd "d:\Final Sem\hospital-management\hospital-management-system\frontend"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Frontend Server
```bash
npm run dev
```

**Expected Output:**
```
VITE v5.x.x
Local:   http://localhost:5173/
Network: use --host to expose
```

---

## 🌐 Access the Application

### Frontend URL
```
http://localhost:5173
```

### Backend API
```
http://localhost:5000/api
```

---

## 👤 Login Credentials

### Admin Login
```
Email: admin@hospital.com
Password: admin123
```

### Doctor Login
```
Email: anjali.reddy@hospital.com
Password: doctor123
```

### Patient Login
```
Email: rahul.sharma@patient.com
Password: patient123
```

---

## ✅ Verification Steps

### 1. Check Backend Health
```bash
curl http://localhost:5000/api/health
```
**Expected:** `{"status":"OK","message":"Hospital Management System API is running"}`

### 2. Check Frontend
- Open browser: http://localhost:5173
- Should see login page
- Try login with any credentials above

### 3. Test Features
- ✅ Login/Logout
- ✅ Dashboard (Admin/Doctor/Patient)
- ✅ Profile Management
- ✅ Appointment Management
- ✅ Prescription System
- ✅ Notification System

---

## 🔧 Troubleshooting

### Backend Issues

#### Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### Database Connection Error
```bash
# Check MySQL service
# Verify .env file credentials
# Ensure database exists
```

### Frontend Issues

#### Port Already in Use
```bash
# Kill process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

#### Module Not Found
```bash
# Reinstall dependencies
npm install
```

---

## 🚀 Production Deployment

### Backend Production
```bash
cd backend
npm run build
npm start
```

### Frontend Production
```bash
cd frontend
npm run build
# Deploy dist folder to web server
```

---

## 📊 Features Available

### ✅ Implemented Features
- User Authentication (Admin/Doctor/Patient)
- Profile Management with Image Upload
- Appointment Management
- Prescription System (Structured Format)
- PDF Download for Prescriptions
- Notification System
- Dashboard with Statistics
- Department Management
- Patient Management

### 🔧 Technical Stack
- **Frontend:** React.js + Vite + Tailwind CSS
- **Backend:** Node.js + Express + MySQL
- **Authentication:** JWT Tokens
- **File Upload:** Multer
- **Icons:** Lucide React

---

## 🎯 Quick Test Commands

### In Browser Console
```javascript
// Test all systems
authTest()                    // Authentication test
doctorDashboardTest()        // Doctor dashboard test
patientDashboardTest()       // Patient dashboard test
prescriptionFormGuide()      // Prescription guide
notificationSystemTest()     // Notification test
```

---

## 📞 Support

### Common Issues & Solutions
1. **Backend won't start:** Check MySQL connection
2. **Frontend errors:** Clear browser cache
3. **Login fails:** Verify user credentials in database
4. **Images not uploading:** Check backend uploads folder

### Debug Commands
```javascript
// Check system status
console.log('Frontend URL:', window.location.origin);
console.log('Backend API:', 'http://localhost:5000/api');
```

---

## 🎉 Success Indicators

### ✅ Everything Working When:
- Backend starts on port 5000
- Frontend starts on port 5173
- Login page loads successfully
- All user roles can login
- Dashboard displays correctly
- Features work as expected

---

**🚀 Your Hospital Management System is ready to use!**

*Last Updated: March 2026*
*Version: 1.0.0*
