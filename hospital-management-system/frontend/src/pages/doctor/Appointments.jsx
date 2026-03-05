import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, FileText, Search, User } from 'lucide-react';
import { doctorAPI } from '../../services/api';
import FormField from '../../components/FormField';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await doctorAPI.getAppointments();
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setPrescriptionText(appointment.prescription || '');
    setShowPrescriptionModal(true);
  };

  const handleSavePrescription = async () => {
    try {
      await doctorAPI.updatePrescription(selectedAppointment.id, prescriptionText);
      fetchAppointments();
      setShowPrescriptionModal(false);
      setSelectedAppointment(null);
      setPrescriptionText('');
    } catch (error) {
      console.error('Error saving prescription:', error);
    }
  };

  const handleMarkCompleted = async (appointmentId) => {
    try {
      await doctorAPI.markAppointmentCompleted(appointmentId);
      fetchAppointments();
    } catch (error) {
      console.error('Error marking appointment as completed:', error);
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

  const filteredAppointments = appointments.filter(appointment =>
    appointment.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.patient_email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <h1 className="text-3xl font-bold text-gray-900">My Appointments</h1>
        <p className="text-gray-600 mt-2">Manage your patient appointments</p>
      </div>

      <div className="card mb-6">
        <FormField
          label="Search Patients"
          name="search"
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          helpText="Search patients by name or email"
          icon={Search}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prescription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-5 w-5 text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{appointment.patient_name}</div>
                        <div className="text-sm text-gray-500">{appointment.patient_email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="text-sm text-gray-500">
                        {new Date(appointment.appointment_date).toLocaleString()}
                      </div>
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
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 max-w-xs truncate">
                      {appointment.prescription || 'No prescription'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {(appointment.status === 'approved' || appointment.status === 'pending') && (
                        <>
                          <button
                            onClick={() => handleAddPrescription(appointment)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Add Prescription"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleMarkCompleted(appointment.id)}
                            className="text-green-600 hover:text-green-900"
                            title="Mark as Completed"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Add Prescription for {selectedAppointment?.patient_name}
            </h3>
            <div className="space-y-4">
              <FormField
                label="Prescription"
                name="prescription"
                type="textarea"
                rows="6"
                placeholder="Enter prescription details..."
                value={prescriptionText}
                onChange={(e) => setPrescriptionText(e.target.value)}
                helpText="Enter detailed prescription including medications and dosage instructions"
                icon={FileText}
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowPrescriptionModal(false);
                    setSelectedAppointment(null);
                    setPrescriptionText('');
                  }}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSavePrescription}
                  className="btn btn-primary"
                >
                  Save Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;
