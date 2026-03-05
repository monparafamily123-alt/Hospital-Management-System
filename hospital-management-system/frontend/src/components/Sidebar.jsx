import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  Building,
  UserPlus,
  Settings,
  Stethoscope,
  Heart,
  Clock,
  CheckCircle,
} from 'lucide-react';

const Sidebar = ({ user }) => {
  const location = useLocation();

  const adminMenuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/doctors', icon: UserPlus, label: 'Doctors' },
    { path: '/admin/patients', icon: Users, label: 'Patients' },
    { path: '/admin/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/admin/departments', icon: Building, label: 'Departments' },
  ];

  const doctorMenuItems = [
    { path: '/doctor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/doctor/appointments', icon: Calendar, label: 'Appointments' },
    { path: '/doctor/prescriptions', icon: FileText, label: 'Prescriptions' },
    { path: '/doctor/profile', icon: Settings, label: 'Profile' },
  ];

  const patientMenuItems = [
    { path: '/patient/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/patient/book-appointment', icon: Calendar, label: 'Book Appointment' },
    { path: '/patient/appointments', icon: Clock, label: 'My Appointments' },
    { path: '/patient/prescriptions', icon: FileText, label: 'Prescriptions' },
    { path: '/patient/profile', icon: Settings, label: 'Profile' },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return adminMenuItems;
      case 'doctor':
        return doctorMenuItems;
      case 'patient':
        return patientMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg lg:block hidden">
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <Heart className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-gray-900">HMS</span>
        </div>
      </div>
      
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;
