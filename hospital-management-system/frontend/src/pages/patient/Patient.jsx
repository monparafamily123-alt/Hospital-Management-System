import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, FileText, Heart, Activity } from 'lucide-react';
import { patientAPI } from '../../services/api';

const Patient = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPatientData();
  }, []);

  const fetchPatientData = async () => {
    try {
      const [profileRes, appointmentsRes, prescriptionsRes] = await Promise.all([
        patientAPI.getProfile(),
        patientAPI.getAppointments(),
        patientAPI.getPrescriptions()
      ]);
      
      setProfile(profileRes.data);
      setAppointments(appointmentsRes.data);
      setPrescriptions(prescriptionsRes.data);
    } catch (error) {
      console.error('Error fetching patient data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-900">Patient Portal</h1>
        <p className="text-gray-600 mt-2">Your health information dashboard</p>
      </div>

      {/* Profile Overview */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-primary-100 rounded-full">
              <User className="h-8 w-8 text-primary-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
              <p className="text-gray-600">{profile?.email}</p>
            </div>
          </div>
          <button className="btn btn-primary">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Age</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{profile?.age || 'Not specified'}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Phone className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Phone</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{profile?.phone || 'Not provided'}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Activity className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Gender</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{profile?.gender || 'Not specified'}</p>
          </div>

          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <span className="text-sm font-medium text-gray-700">Appointments</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{appointments.length}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['overview', 'appointments', 'prescriptions', 'medical-history'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="card">
        {activeTab === 'overview' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Medical History</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {profile?.medical_history || 'No medical history recorded'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-md font-medium text-gray-900 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  {appointments.slice(0, 3).map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-4 w-4 text-gray-600" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {appointment.doctor_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(appointment.appointment_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs font-medium ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appointments' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointments</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Doctor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Symptoms
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-600 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{appointment.doctor_name}</div>
                            <div className="text-xs text-gray-500">{appointment.doctor_department}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {new Date(appointment.appointment_date).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {appointment.symptoms || 'No symptoms recorded'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'prescriptions' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Prescriptions</h3>
            <div className="space-y-4">
              {prescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No prescriptions found</p>
                  <p className="text-sm text-gray-400">Your doctor will add prescriptions here after your appointments</p>
                </div>
              ) : (
                prescriptions.map((prescription) => (
                  <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center mb-2">
                          <User className="h-5 w-5 text-gray-600 mr-2" />
                          <div>
                            <h4 className="text-lg font-medium text-gray-900">{prescription.doctor_name}</h4>
                            <p className="text-sm text-gray-500">{prescription.doctor_department}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(prescription.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="text-md font-medium text-gray-900 mb-2">Prescription Details</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                          <p className="text-sm text-gray-600">{prescription.diagnosis || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Medication:</p>
                          <p className="text-sm text-gray-600">{prescription.medication || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Dosage:</p>
                          <p className="text-sm text-gray-600">{prescription.dosage || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">Notes:</p>
                          <p className="text-sm text-gray-600">{prescription.notes || 'No additional notes'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'medical-history' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical History</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="space-y-4">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">Medical Conditions</h4>
                  <p className="text-sm text-gray-600">
                    {profile?.medical_history || 'No medical conditions recorded'}
                  </p>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-2">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Blood Type:</p>
                      <p className="text-sm text-gray-600">Not specified</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Allergies:</p>
                      <p className="text-sm text-gray-600">Not specified</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Medications:</p>
                      <p className="text-sm text-gray-600">Not specified</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Emergency Contact:</p>
                      <p className="text-sm text-gray-600">Not specified</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Patient;
