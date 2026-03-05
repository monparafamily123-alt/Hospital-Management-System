import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import Doctors from './pages/admin/Doctors';
import Departments from './pages/admin/Departments';
import AdminAppointments from './pages/admin/Appointments';
import PatientsManagement from './pages/admin/PatientsManagement';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorAppointments from './pages/doctor/Appointments';
import DoctorPrescriptions from './pages/doctor/Prescriptions';
import DoctorProfile from './pages/doctor/Profile';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import BookAppointment from './pages/patient/BookAppointment';
import Appointments from './pages/patient/Appointments';
import Prescriptions from './pages/patient/Prescriptions';
import Profile from './pages/patient/Profile';
import Patient from './pages/patient/Patient';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Protected Routes */}
          <Route path="/" element={<Layout />}>
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/doctors" element={<Doctors />} />
            <Route path="/admin/departments" element={<Departments />} />
            <Route path="/admin/patients" element={<PatientsManagement />} />
            <Route path="/admin/appointments" element={<AdminAppointments />} />
            
            {/* Doctor Routes */}
            <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
            <Route path="/doctor/appointments" element={<DoctorAppointments />} />
            <Route path="/doctor/prescriptions" element={<DoctorPrescriptions />} />
            <Route path="/doctor/profile" element={<DoctorProfile />} />
            
            {/* Patient Routes */}
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/patient/book-appointment" element={<BookAppointment />} />
            <Route path="/patient/appointments" element={<Appointments />} />
            <Route path="/patient/prescriptions" element={<Prescriptions />} />
            <Route path="/patient/profile" element={<Profile />} />
            <Route path="/patient" element={<Patient />} />
          </Route>
          
          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
