import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, FileText, Heart, User } from 'lucide-react';
import { patientAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    approvedAppointments: 0,
    completedAppointments: 0,
    totalPrescriptions: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('🏥 Patient Dashboard - User:', user);
    console.log('🏥 Patient Dashboard - Authenticated:', isAuthenticated);
    
    if (isAuthenticated && user?.role === 'patient') {
      fetchDashboardStats();
    } else {
      console.log('❌ User is not authenticated or not a patient');
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const fetchDashboardStats = async () => {
    try {
      const response = await patientAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Pending Appointments',
      value: stats.pendingAppointments,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Approved Appointments',
      value: stats.approvedAppointments,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Prescriptions',
      value: stats.totalPrescriptions,
      icon: FileText,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your health portal</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/patient/book-appointment')} 
              className="w-full btn btn-primary"
            >
              Book New Appointment
            </button>
            <button 
              onClick={() => navigate('/patient/appointments')} 
              className="w-full btn btn-secondary"
            >
              View My Appointments
            </button>
            <button 
              onClick={() => navigate('/patient/prescriptions')} 
              className="w-full btn btn-secondary"
            >
              View Prescriptions
            </button>
            <button 
              onClick={() => navigate('/patient/profile')} 
              className="w-full btn btn-secondary"
            >
              Update Profile
            </button>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Tips</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <Heart className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Stay Hydrated</p>
                <p className="text-xs text-gray-600">Drink at least 8 glasses of water daily</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <User className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Regular Exercise</p>
                <p className="text-xs text-gray-600">30 minutes of physical activity daily</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Regular Checkups</p>
                <p className="text-xs text-gray-600">Schedule routine health examinations</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Appointments</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">General Checkup</p>
                <p className="text-xs text-gray-500">Dr. John Smith - Cardiology</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Tomorrow</p>
              <p className="text-xs text-gray-500">10:00 AM</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-gray-900">Follow-up Consultation</p>
                <p className="text-xs text-gray-500">Dr. Sarah Johnson - Neurology</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Next Week</p>
              <p className="text-xs text-gray-500">2:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
