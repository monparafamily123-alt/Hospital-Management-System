import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, FileText, Search, User } from 'lucide-react';
import { doctorAPI } from '../../services/api';
import FormField from '../../components/FormField';

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [prescriptionData, setPrescriptionData] = useState({
    medicines: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    followUp: ''
  });
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
    setPrescriptionData({
      medicines: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      followUp: ''
    });
    setShowPrescriptionModal(true);
  };

  const handleSavePrescription = async () => {
    try {
      // Create formatted prescription text from structured data
      const formattedPrescription = `
MEDICINES:
${prescriptionData.medicines}

DOSAGE: ${prescriptionData.dosage}
FREQUENCY: ${prescriptionData.frequency}
DURATION: ${prescriptionData.duration}

INSTRUCTIONS:
${prescriptionData.instructions}

FOLLOW-UP: ${prescriptionData.followUp || 'Not required'}
      `.trim();

      await doctorAPI.updatePrescription(selectedAppointment.id, formattedPrescription);
      fetchAppointments();
      setShowPrescriptionModal(false);
      setSelectedAppointment(null);
      setPrescriptionData({
        medicines: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        followUp: ''
      });
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
          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments found</h3>
              <p className="text-gray-500">
                {searchTerm 
                  ? 'No appointments match your search criteria'
                  : 'You don\'t have any appointments scheduled yet'
                }
              </p>
            </div>
          ) : (
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
          )}
        </div>
      </div>

      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-[600px] shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Add Prescription for {selectedAppointment?.patient_name}
            </h3>
            <div className="space-y-4">
              {/* Medicines */}
              <FormField
                label="Medicines"
                name="medicines"
                type="textarea"
                rows="3"
                placeholder="e.g., Paracetamol 500mg, Amoxicillin 250mg"
                value={prescriptionData.medicines}
                onChange={(e) => setPrescriptionData({...prescriptionData, medicines: e.target.value})}
                helpText="List all prescribed medicines"
                icon={FileText}
              />

              {/* Dosage and Frequency in same row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  label="Dosage"
                  name="dosage"
                  type="text"
                  placeholder="e.g., 1 tablet, 2 tsp"
                  value={prescriptionData.dosage}
                  onChange={(e) => setPrescriptionData({...prescriptionData, dosage: e.target.value})}
                  helpText="Amount per dose"
                  icon={FileText}
                />
                
                <FormField
                  label="Frequency"
                  name="frequency"
                  type="text"
                  placeholder="e.g., 3 times a day, twice daily"
                  value={prescriptionData.frequency}
                  onChange={(e) => setPrescriptionData({...prescriptionData, frequency: e.target.value})}
                  helpText="How often to take"
                  icon={Clock}
                />
              </div>

              {/* Duration */}
              <FormField
                label="Duration"
                name="duration"
                type="text"
                placeholder="e.g., 5 days, 1 week, 2 weeks"
                value={prescriptionData.duration}
                onChange={(e) => setPrescriptionData({...prescriptionData, duration: e.target.value})}
                helpText="How long to continue medication"
                icon={Calendar}
              />

              {/* Instructions */}
              <FormField
                label="Instructions"
                name="instructions"
                type="textarea"
                rows="3"
                placeholder="e.g., Take after food, avoid dairy products, complete full course"
                value={prescriptionData.instructions}
                onChange={(e) => setPrescriptionData({...prescriptionData, instructions: e.target.value})}
                helpText="Special instructions for the patient"
                icon={FileText}
              />

              {/* Follow-up */}
              <FormField
                label="Follow-up Required"
                name="followUp"
                type="text"
                placeholder="e.g., After 1 week, After 5 days, Not required"
                value={prescriptionData.followUp}
                onChange={(e) => setPrescriptionData({...prescriptionData, followUp: e.target.value})}
                helpText="When should the patient visit again"
                icon={Calendar}
              />

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  onClick={() => {
                    setShowPrescriptionModal(false);
                    setSelectedAppointment(null);
                    setPrescriptionData({
                      medicines: '',
                      dosage: '',
                      frequency: '',
                      duration: '',
                      instructions: '',
                      followUp: ''
                    });
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
