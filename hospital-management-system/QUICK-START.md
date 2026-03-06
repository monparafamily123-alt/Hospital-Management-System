# 🚀 Quick Start Commands

## 📋 कल Project Run करने के लिए Simple Commands

---

### 🔥 सिर्फ 3 Commands - और कुछ नहीं!

**1. Backend Start (Terminal 1 में):**
```bash
cd "d:\Final Sem\hospital-management\hospital-management-system\backend"
npm start
```

**2. Frontend Start (Terminal 2 में):**
```bash
cd "d:\Final Sem\hospital-management\hospital-management-system\frontend"
npm run dev
```

**3. Browser Open:**
```
http://localhost:5173
```

---

## 👤 Login Credentials

**Admin:** admin@hospital.com / admin123
**Doctor:** anjali.reddy@hospital.com / doctor123
**Patient:** rahul.sharma@patient.com / patient123

---

## ⚡ Super Quick Setup

### Option 1: Manual (2-3 minutes)
```bash
# Terminal 1 - Backend
cd "d:\Final Sem\hospital-management\hospital-management-system\backend"
npm start

# Terminal 2 - Frontend  
cd "d:\Final Sem\hospital-management\hospital-management-system\frontend"
npm run dev
```

### Option 2: Batch File (1 click)
```bash
# Create start.bat file with:
start cmd /k "cd backend && npm start"
timeout /t 3
start cmd /k "cd frontend && npm run dev"
start http://localhost:5173
```

---

## 🔧 Troubleshooting

### Port Already in Use?
```bash
# Backend port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Frontend port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Database Not Connected?
```bash
# Check MySQL service
# Database already setup - no need to recreate
```

---

## ✅ Success Indicators

**Backend Running When:**
```
🚀 Server starting...
📡 Server running on port: 5000
✅ Server started successfully!
```

**Frontend Running When:**
```
VITE v5.x.x
Local:   http://localhost:5173/
```

---

## 🎯 What's Already Done?

✅ Database setup complete  
✅ All dependencies installed  
✅ All features implemented  
✅ Code committed to GitHub  
✅ Ready to run anytime  

---

## 🚀 Just Run These 3 Commands!

**Command 1 (Backend):**
```bash
cd "d:\Final Sem\hospital-management\hospital-management-system\backend" && npm start
```

**Command 2 (Frontend):**
```bash
cd "d:\Final Sem\hospital-management\hospital-management-system\frontend" && npm run dev
```

**Command 3 (Browser):**
```
http://localhost:5173
```

---

**🎉 That's it! Your project is ready to run anytime!**

*No additional setup required - everything is already configured!*
