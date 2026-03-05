# Hospital Management System

A full-stack Hospital Management System built with React.js, Node.js, Express.js, and MySQL.

## Tech Stack

### Frontend
- React.js (Vite)
- React Router
- Axios
- Tailwind CSS
- Lucide Icons

### Backend
- Node.js
- Express.js
- MySQL
- JWT Authentication
- bcrypt for password hashing

### Database
- MySQL (XAMPP phpMyAdmin)

## Project Structure

```
hospital-management-system/
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── config/
│   ├── .env
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── database/
│   └── hospital_management.sql
└── README.md
```

## Features

### Role-Based Authentication
- Admin
- Doctor
- Patient
- JWT based login
- Protected routes
- Password hashing

### Admin Panel
- Add / Update / Delete Doctors
- Add Departments
- View all patients
- View all appointments
- Approve or Reject appointments

### Doctor Panel
- Login
- View assigned appointments
- Update prescription
- Mark appointment as completed

### Patient Panel
- Register & Login
- Book appointment
- View appointment status
- View prescription history

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- XAMPP (for MySQL and phpMyAdmin)
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hospital-management-system
```

### 2. Database Setup
1. Start XAMPP and start Apache and MySQL services
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Create a new database named `hospital_management`
4. Import the SQL file: `database/hospital_management.sql`

### 3. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hospital_management
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
```

Start the backend server:
```bash
npm start
```

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## Default Login Credentials

### Admin
- Email: admin@hospital.com
- Password: admin123

### Doctor
- Email: doctor@hospital.com
- Password: doctor123

### Patient
- Email: patient@hospital.com
- Password: patient123

## API Endpoints

### Authentication
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/profile

### Admin Routes
- GET /api/admin/doctors
- POST /api/admin/doctors
- PUT /api/admin/doctors/:id
- DELETE /api/admin/doctors/:id
- GET /api/admin/departments
- POST /api/admin/departments
- GET /api/admin/patients
- GET /api/admin/appointments
- PUT /api/admin/appointments/:id/status

### Doctor Routes
- GET /api/doctor/appointments
- PUT /api/doctor/appointments/:id/prescription
- PUT /api/doctor/appointments/:id/complete

### Patient Routes
- GET /api/patient/appointments
- POST /api/patient/appointments
- GET /api/patient/prescriptions

## Database Schema

### Tables
- users (id, name, email, password, role)
- doctors (id, user_id, department, experience, available_time)
- patients (id, user_id, age, medical_history)
- departments (id, name)
- appointments (id, patient_id, doctor_id, date, status, prescription)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
