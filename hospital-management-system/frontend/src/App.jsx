import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import Login from './components/Login';
import Register from './components/Register';
import './utils/global-debug'; // Load debug functions
import './utils/test-patient-auth'; // Load patient test functions
import './utils/patient-dashboard-test'; // Load patient dashboard tests
import './utils/doctor-dashboard-test'; // Load doctor dashboard tests
import './utils/doctor-dashboard-summary'; // Load doctor dashboard summary
import './utils/debug-doctor-profile'; // Load doctor profile debug
import './utils/doctor-profile-test'; // Load doctor profile tests
import './utils/login-test-guide'; // Load login test guide
import './utils/profile-image-test'; // Load profile image tests
import './utils/prescription-form-guide'; // Load prescription form guide
import './utils/prescription-display-fix'; // Load prescription display fix
import './utils/pdf-generator'; // Load PDF generator
import './utils/prescription-download-test'; // Load prescription download test
import './utils/notification-system-test'; // Load notification system test

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
