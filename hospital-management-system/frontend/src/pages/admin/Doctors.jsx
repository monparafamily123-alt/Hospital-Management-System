import React, { useState, useEffect } from 'react';
import { UserPlus, Edit, Trash2, Search, Filter, User, Mail, Lock, Building, Clock, DollarSign, Award, GraduationCap } from 'lucide-react';
import { adminAPI } from '../../services/api';
import FormField from '../../components/FormField';
import { showSuccess, showError } from '../../utils/toast';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    departmentId: '',
    experience: '',
    availableTime: '',
    qualification: '',
    consultationFee: '',
  });

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
  }, []);

  const fetchDoctors = async () => {
    try {
      console.log('👨‍⚕️ Fetching doctors list...');
      const response = await adminAPI.getDoctors();
      console.log('✅ Doctors API response:', response);
      console.log('📊 Response data:', response.data);
      setDoctors(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      console.log('🏥 Fetching departments for doctor form...');
      const response = await adminAPI.getDepartments();
      console.log('✅ Departments API response:', response);
      setDepartments(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching departments:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form data being submitted:', formData);
    console.log('Editing doctor:', editingDoctor);
    
    try {
      if (editingDoctor) {
        console.log('Updating doctor with ID:', editingDoctor.id);
        await adminAPI.updateDoctor(editingDoctor.id, formData);
        showSuccess('Doctor updated successfully!');
      } else {
        console.log('Creating new doctor...');
        const response = await adminAPI.createDoctor(formData);
        console.log('Doctor creation response:', response);
        showSuccess('Doctor added successfully!');
      }
      fetchDoctors();
      setShowModal(false);
      resetForm();
    } catch (error) {
      console.error('❌ Error saving doctor:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save doctor. Please try again.';
      setError(errorMessage);
      showError(errorMessage);
    }
  };

  const handleEdit = (doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      email: doctor.email,
      password: '',
      departmentId: doctor.department_id,
      experience: doctor.experience,
      availableTime: doctor.available_time,
      qualification: doctor.qualification,
      consultationFee: doctor.consultation_fee,
    });
    setShowModal(true);
  };

  const handleDelete = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await adminAPI.deleteDoctor(doctorId);
        fetchDoctors();
      } catch (error) {
        console.error('Error deleting doctor:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      departmentId: '',
      experience: '',
      availableTime: '',
      qualification: '',
      consultationFee: '',
    });
    setEditingDoctor(null);
  };

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.department_name.toLowerCase().includes(searchTerm.toLowerCase())
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Doctors</h1>
          <p className="text-gray-600 mt-2">Manage hospital doctors</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="btn btn-primary flex items-center"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Add Doctor
        </button>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <FormField
              label="Search Doctors"
              name="search"
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              helpText="Search by name, email, or department"
              icon={Search}
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Experience
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Consultation Fee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      <User className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-lg font-medium">No doctors found</p>
                      <p className="text-sm">Add your first doctor to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doctor) => (
                  <tr key={doctor.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{doctor.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{doctor.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{doctor.department_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{doctor.experience}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{doctor.available_time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">${doctor.consultation_fee}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <FormField
                  label="Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Dr. John Smith"
                  helpText="Enter the doctor's full name"
                  required
                  icon={User}
                />
                <FormField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="doctor@hospital.com"
                  helpText="Enter the doctor's professional email address"
                  required
                  icon={Mail}
                />
                {!editingDoctor && (
                  <FormField
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    helpText="Set a temporary password for the doctor's account"
                    required
                    icon={Lock}
                  />
                )}
                <FormField
                  label="Department"
                  name="departmentId"
                  type="select"
                  value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  helpText="Select the department this doctor belongs to"
                  required
                  icon={Building}
                  options={[
                    { value: '', label: 'Select Department' },
                    ...departments.map(dept => ({
                      value: dept.id,
                      label: dept.name
                    }))
                  ]}
                />
                <FormField
                  label="Experience"
                  name="experience"
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="5 years"
                  helpText="Enter years of experience (e.g., '5 years', '10+ years')"
                  required
                  icon={Award}
                />
                <FormField
                  label="Available Time"
                  name="availableTime"
                  type="text"
                  value={formData.availableTime}
                  onChange={(e) => setFormData({ ...formData, availableTime: e.target.value })}
                  placeholder="9 AM - 5 PM"
                  helpText="Enter available consultation hours (e.g., '9 AM - 5 PM')"
                  required
                  icon={Clock}
                />
                <FormField
                  label="Qualification"
                  name="qualification"
                  type="text"
                  value={formData.qualification}
                  onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                  placeholder="MBBS, MD - Cardiology"
                  helpText="Enter medical qualifications and degrees"
                  required
                  icon={GraduationCap}
                />
                <FormField
                  label="Consultation Fee"
                  name="consultationFee"
                  type="number"
                  step="0.01"
                  value={formData.consultationFee}
                  onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                  placeholder="150.00"
                  helpText="Enter the consultation fee in USD"
                  required
                  icon={DollarSign}
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingDoctor ? 'Update' : 'Add'} Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
