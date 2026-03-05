import React, { useState, useEffect } from 'react';
import { Calendar, User, Building, Clock, FileText, Search } from 'lucide-react';
import { patientAPI } from '../../services/api';
import FormField from '../../components/FormField';
import { showSuccess, showError } from '../../utils/toast';

const BookAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    doctorId: '',
    appointmentDate: '',
    symptoms: ''
  });
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDepartments();
    fetchDoctors();
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [selectedDepartment]);

  const fetchDepartments = async () => {
    try {
      const response = await patientAPI.getDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await patientAPI.getDoctors(selectedDepartment);
      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    console.log('🚀 Starting appointment booking...');
    console.log('📝 Form data:', formData);
    
    try {
      const response = await patientAPI.bookAppointment(formData);
      console.log('✅ Appointment booking response:', response);
      
      showSuccess('Appointment booked successfully!');
      setFormData({
        doctorId: '',
        appointmentDate: '',
        symptoms: '',
      });
    } catch (error) {
      console.error('❌ Error booking appointment:', error);
      console.error('🔍 Error details:', error.response?.data || error.message);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to book appointment. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
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
        <h1 className="text-3xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-gray-600 mt-2">Schedule an appointment with our doctors</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Doctors</h3>
            <div className="space-y-4">
              <FormField
                label="Department"
                name="department"
                type="select"
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                helpText="Filter doctors by their department"
                options={[
                  { value: '', label: 'All Departments' },
                  ...departments.map((dept) => ({ value: dept.id, label: dept.name }))
                ]}
              />
              <FormField
                label="Search Doctors"
                name="search"
                type="text"
                placeholder="Search by name or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                helpText="Find doctors by name or department specialization"
                icon={Search}
              />
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Doctors</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    formData.doctorId === doctor.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, doctorId: doctor.id })}
                >
                  <div className="flex items-start space-x-3">
                    <User className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{doctor.name}</h4>
                      <p className="text-xs text-gray-500">{doctor.department_name}</p>
                      <p className="text-xs text-gray-500 mt-1">{doctor.qualification}</p>
                      <p className="text-xs text-gray-500">Experience: {doctor.experience}</p>
                      <p className="text-xs text-gray-500">Available: {doctor.available_time}</p>
                      <p className="text-xs font-medium text-primary-600 mt-1">
                        Consultation Fee: ${doctor.consultation_fee}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Appointment Details</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField
                label="Selected Doctor"
                name="doctor"
                type="text"
                value={
                  doctors.find(d => d.id === formData.doctorId)?.name || 'No doctor selected'
                }
                readOnly
                placeholder="Select a doctor from the list"
                helpText="The doctor you selected from the available doctors list"
                icon={User}
              />

              <FormField
                label="Appointment Date & Time"
                name="appointmentDate"
                type="datetime-local"
                value={formData.appointmentDate}
                onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                placeholder="Select date and time"
                min={getMinDateTime()}
                required
                helpText="Select your preferred appointment date and time"
                icon={Calendar}
              />

              <FormField
                label="Symptoms (Optional)"
                name="symptoms"
                type="textarea"
                rows="4"
                placeholder="Describe your symptoms..."
                value={formData.symptoms}
                onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                helpText="Provide details about your symptoms to help the doctor prepare"
                icon={FileText}
              />

              <button
                type="submit"
                className="w-full btn btn-primary"
                disabled={!formData.doctorId || !formData.appointmentDate}
              >
                Book Appointment
              </button>
            </form>
          </div>

          <div className="card mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Clock className="h-4 w-4 text-gray-600 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Please arrive 15 minutes before your scheduled appointment time
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <FileText className="h-4 w-4 text-gray-600 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Bring any previous medical records or test results
                </p>
              </div>
              <div className="flex items-start space-x-2">
                <Building className="h-4 w-4 text-gray-600 mt-0.5" />
                <p className="text-sm text-gray-600">
                  Check with reception for any specific preparation requirements
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
