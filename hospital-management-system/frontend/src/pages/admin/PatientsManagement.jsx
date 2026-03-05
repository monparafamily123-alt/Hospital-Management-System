import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, Plus, Edit, Trash2, Search } from 'lucide-react';
import { adminAPI } from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';

const PatientsManagement = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    phone: '',
    medicalHistory: '',
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      console.log('👥 Fetching patients list...');
      const response = await adminAPI.getPatients();
      console.log('✅ Patients API response:', response);
      console.log('📊 Response data:', response.data);
      
      // Debug: Check first patient data structure
      if (response.data && response.data.length > 0) {
        console.log('🔍 First patient data structure:', response.data[0]);
        console.log('📧 First patient email:', response.data[0].email);
      }
      
      setPatients(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = () => {
    setEditingPatient(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      age: '',
      phone: '',
      medicalHistory: '',
    });
    setShowModal(true);
  };

  const handleEditPatient = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      email: patient.email,
      password: '',
      age: patient.age,
      phone: patient.phone,
      medicalHistory: patient.medical_history,
    });
    setShowModal(true);
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await adminAPI.deletePatient(patientId);
        fetchPatients();
        showSuccess('Patient deleted successfully!');
      } catch (error) {
        console.error('Error deleting patient:', error);
        showError('Error deleting patient. Please try again.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Starting patient submission...');
    console.log('📝 Form data being submitted:', formData);
    console.log('🔧 Editing patient:', editingPatient);
    
    try {
      if (editingPatient) {
        console.log('✏️ Updating patient with ID:', editingPatient.id);
        const response = await adminAPI.updatePatient(editingPatient.id, formData);
        console.log('✅ Patient update response:', response);
        showSuccess('Patient updated successfully!');
      } else {
        console.log('➕ Creating new patient...');
        const response = await adminAPI.createPatient(formData);
        console.log('✅ Patient creation response:', response);
        showSuccess('Patient added successfully!');
      }
      console.log('🔄 Refreshing patient list...');
      fetchPatients();
      setShowModal(false);
      resetForm();
      console.log('✅ Patient submission completed successfully!');
    } catch (error) {
      console.error('❌ Error saving patient:', error);
      console.error('🔍 Error details:', error.response?.data || error.message);
      console.error('🌐 Full error object:', error);
      showError('Error saving patient. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      age: '',
      phone: '',
      medicalHistory: '',
    });
    setEditingPatient(null);
  };

  const filteredPatients = patients.filter(patient =>
    patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-3xl font-bold text-gray-900">Patients Management</h1>
        <p className="text-gray-600 mt-2">Manage hospital patients</p>
      </div>

      <div className="card mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">All Patients</h3>
          <button
            onClick={handleAddPatient}
            className="btn btn-primary flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Patient
          </button>
        </div>

        <div className="flex items-center">
          <Search className="h-5 w-5 text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medical History
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPatients.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center">
                  <div className="text-gray-500">
                    <User className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-lg font-medium">No patients found</p>
                    <p className="text-sm">Add your first patient to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{patient.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-600 mr-2" />
                    <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{patient.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-600 mr-2" />
                    <div className="text-sm text-gray-500">{patient.phone || 'Not provided'}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">{patient.age || 'Not specified'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {patient.medical_history || 'No medical history'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditPatient(patient)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      title="Edit Patient"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete Patient"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="flex items-center justify-center min-h-full p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  {editingPatient ? 'Edit Patient' : 'Add New Patient'}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="Enter patient name"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="Enter patient email"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="input-field"
                      placeholder="Enter password"
                      required
                    />
                  </div>

                  <div>
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="input-field"
                      placeholder="Enter patient age"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Phone</label>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="input-field"
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label">Medical History</label>
                  <div className="flex items-start">
                    <User className="h-5 w-5 text-gray-400 mr-3 mt-2" />
                    <textarea
                      name="medicalHistory"
                      value={formData.medicalHistory}
                      onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                      className="input-field"
                      rows="3"
                      placeholder="Enter medical history"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    {editingPatient ? 'Update Patient' : 'Add Patient'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientsManagement;
