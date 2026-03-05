import React, { useState, useEffect, useRef } from 'react';
import { Bell, LogOut, User, X, Calendar, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ user }) => {
  const { logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notificationRef = useRef(null);

  const handleLogout = () => {
    logout();
  };

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Generate sample notifications based on user role
  useEffect(() => {
    const generateNotifications = () => {
      const baseNotifications = [
        {
          id: 1,
          type: 'appointment',
          title: 'New Appointment Request',
          message: 'You have a new appointment request pending approval',
          time: '2 hours ago',
          read: false,
          icon: Calendar,
          color: 'text-blue-600'
        },
        {
          id: 2,
          type: 'patient',
          title: 'Patient Registration',
          message: 'New patient has registered in the system',
          time: '5 hours ago',
          read: false,
          icon: UserCheck,
          color: 'text-green-600'
        },
        {
          id: 3,
          type: 'system',
          title: 'System Update',
          message: 'Hospital management system has been updated',
          time: '1 day ago',
          read: true,
          icon: CheckCircle,
          color: 'text-gray-600'
        }
      ];

      // Role-specific notifications
      if (user?.role === 'doctor') {
        return [
          {
            id: 4,
            type: 'appointment',
            title: 'Appointment Approved',
            message: 'Your appointment request has been approved',
            time: '30 minutes ago',
            read: false,
            icon: CheckCircle,
            color: 'text-green-600'
          },
          ...baseNotifications
        ];
      } else if (user?.role === 'patient') {
        return [
          {
            id: 5,
            type: 'appointment',
            title: 'Appointment Confirmed',
            message: 'Your appointment has been confirmed',
            time: '1 hour ago',
            read: false,
            icon: CheckCircle,
            color: 'text-green-600'
          },
          {
            id: 6,
            type: 'prescription',
            title: 'New Prescription',
            message: 'Doctor has added your prescription',
            time: '3 hours ago',
            read: false,
            icon: AlertCircle,
            color: 'text-orange-600'
          },
          ...baseNotifications
        ];
      } else if (user?.role === 'admin') {
        return baseNotifications;
      }

      return baseNotifications;
    };

    setNotifications(generateNotifications());
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Hospital Management System
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative" ref={notificationRef}>
              <button 
                className="p-2 rounded-full hover:bg-gray-100 relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                )}
                {unreadCount > 1 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                        <p>No notifications</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <notification.icon className={`h-5 w-5 ${notification.color} mt-0.5 flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="p-3 border-t border-gray-200">
                    <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">
                  {user?.name}
                </span>
                <span className="text-xs text-gray-500 capitalize">
                  ({user?.role})
                </span>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-gray-100"
                title="Logout"
              >
                <LogOut className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
