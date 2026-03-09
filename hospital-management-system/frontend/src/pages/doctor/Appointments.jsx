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
    medicines: [
      { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
      { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
      { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
      { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
      { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ],
    followUp: ''
  });
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  // Function to handle medicine field changes
  const handleMedicineChange = (index, field, value) => {
    const updatedMedicines = [...prescriptionData.medicines];
    updatedMedicines[index][field] = value;
    setPrescriptionData({...prescriptionData, medicines: updatedMedicines});
  };

  // Function to handle tab key press for adding new row
  const handleTabKeyPress = (e, index, field) => {
    if (e.key === 'Tab' && index === prescriptionData.medicines.length - 1 && field === 'instructions') {
      e.preventDefault();
      addNewRow();
    }
  };

  // Function to add new row
  const addNewRow = () => {
    setPrescriptionData({
      ...prescriptionData,
      medicines: [
        ...prescriptionData.medicines,
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
      ]
    });
  };

  // Function to remove row
  const removeRow = (index) => {
    if (prescriptionData.medicines.length > 1) {
      const updatedMedicines = prescriptionData.medicines.filter((_, i) => i !== index);
      setPrescriptionData({...prescriptionData, medicines: updatedMedicines});
    }
  };

  useEffect(() => {
    fetchAppointments();
    
    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      fetchAppointments();
    }, 30000);
    
    // Set up visibility change listener (when user returns to tab)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchAppointments();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const fetchAppointments = async () => {
    try {
      console.log('👨‍⚕️ Fetching doctor appointments...');
      const response = await doctorAPI.getAppointments();
      console.log('✅ Doctor appointments API response:', response);
      console.log('📊 Appointments data:', response.data);
      setAppointments(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPrescription = (appointment) => {
    setSelectedAppointment(appointment);
    setPrescriptionData({
      medicines: [
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
      ],
      followUp: ''
    });
    setShowPrescriptionModal(true);
  };

  const handleSavePrescription = async () => {
    try {
      // Create formatted prescription text from structured data
      const medicinesList = prescriptionData.medicines
        .filter(med => med.name.trim() !== '')
        .map((med, index) => 
          `${index + 1}. ${med.name} - ${med.dosage} - ${med.frequency} - ${med.duration} - ${med.instructions}`
        ).join('\n');

      const formattedPrescription = `
MEDICINES:
${medicinesList}

FOLLOW-UP: ${prescriptionData.followUp || 'Not required'}
      `.trim();

      await doctorAPI.updatePrescription(selectedAppointment.id, formattedPrescription);
      fetchAppointments();
      setShowPrescriptionModal(false);
      setSelectedAppointment(null);
      setPrescriptionData({
        medicines: [
          { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
          { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
          { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
          { name: '', dosage: '', frequency: '', duration: '', instructions: '' },
          { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
        ],
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
  
  console.log('🔍 Search term:', searchTerm);
  console.log('📊 Total appointments:', appointments.length);
  console.log('👤 Filtered appointments:', filteredAppointments.length);

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
                          {(() => {
                            if (appointment.appointment_date) {
                              const date = new Date(appointment.appointment_date);
                              const time = appointment.appointment_time || appointment.time || 'Not specified';
                              
                              // Convert time to 12-hour format
                              let formattedTime = time;
                              if (time && time !== 'Not specified' && time.includes(':')) {
                                const [hours, minutes] = time.split(':');
                                const hour = parseInt(hours);
                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                const displayHour = hour % 12 || 12;
                                formattedTime = `${displayHour}:${minutes} ${ampm}`;
                              }
                              
                              return `${date.toLocaleDateString()} at ${formattedTime}`;
                            } else if (appointment.date) {
                              // Fallback for different field names
                              const date = new Date(appointment.date);
                              const time = appointment.time || 'Not specified';
                              
                              // Convert time to 12-hour format
                              let formattedTime = time;
                              if (time && time !== 'Not specified' && time.includes(':')) {
                                const [hours, minutes] = time.split(':');
                                const hour = parseInt(hours);
                                const ampm = hour >= 12 ? 'PM' : 'AM';
                                const displayHour = hour % 12 || 12;
                                formattedTime = `${displayHour}:${minutes} ${ampm}`;
                              }
                              
                              return `${date.toLocaleDateString()} at ${formattedTime}`;
                            } else {
                              return 'Date not available';
                            }
                          })()}
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
          <div className="relative top-10 mx-auto p-5 border w-[800px] shadow-lg rounded-md bg-white max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Add Prescription for {selectedAppointment?.patient_name}
            </h3>
            
            {/* Prescription Table */}
            <div className="mb-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medicine Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dosage
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Taking Time
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructions
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {prescriptionData.medicines.map((medicine, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                          placeholder="e.g., Paracetamol 500mg"
                          value={medicine.name}
                          onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                          placeholder="e.g., 1 tablet"
                          value={medicine.dosage}
                          onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                          placeholder="e.g., 3 times a day"
                          value={medicine.frequency}
                          onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                          placeholder="e.g., 5 days"
                          value={medicine.duration}
                          onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <input
                          type="text"
                          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
                          placeholder="e.g., Take after food"
                          value={medicine.instructions}
                          onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                          onKeyDown={(e) => handleTabKeyPress(e, index, 'instructions')}
                        />
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap">
                        <button
                          onClick={() => removeRow(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                          disabled={prescriptionData.medicines.length === 1}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Add Row Button */}
              <div className="mt-4">
                <button
                  onClick={addNewRow}
                  className="btn btn-secondary text-sm"
                >
                  + Add Medicine Row
                </button>
              </div>
            </div>

            {/* Follow-up Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Follow-up Required
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., After 1 week, Not required"
                value={prescriptionData.followUp}
                onChange={(e) => setPrescriptionData({...prescriptionData, followUp: e.target.value})}
              />
            </div>

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
      )}
    </div>
  );
};

export default DoctorAppointments;
