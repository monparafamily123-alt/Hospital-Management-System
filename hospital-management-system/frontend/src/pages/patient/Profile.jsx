import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, FileText } from 'lucide-react';
import { patientAPI } from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    phone: '',
    address: '',
    medicalHistory: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await patientAPI.getProfile();
      setProfile(response.data);
      setFormData({
        age: response.data.age || '',
        gender: response.data.gender || 'male',
        phone: response.data.phone || '',
        address: response.data.address || '',
        medicalHistory: response.data.medical_history || '',
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await patientAPI.updateProfile(formData);
      setProfile(prev => ({ ...prev, ...formData }));
      setEditing(false);
      showSuccess('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Error updating profile. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your personal information</p>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="btn btn-primary"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={() => setEditing(false)}
              className="btn btn-secondary"
            >
              Cancel
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label">Phone Number</label>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400 mr-3" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Address</label>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-2" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field"
                  rows="3"
                  placeholder="Enter address"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Medical History</label>
              <div className="flex items-start">
                <FileText className="h-5 w-5 text-gray-400 mr-3 mt-2" />
                <textarea
                  name="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  className="input-field"
                  rows="4"
                  placeholder="Enter medical history"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="submit"
                className="btn btn-primary"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-3 mb-4">
              <User className="h-10 w-10 text-gray-600" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">{profile.name}</h3>
                <p className="text-sm text-gray-500">{profile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Age:</p>
                    <p className="text-sm text-gray-600">{profile.age || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <User className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Gender:</p>
                    <p className="text-sm text-gray-600">{profile.gender || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone:</p>
                    <p className="text-sm text-gray-600">{profile.phone || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start space-x-2 mb-2">
                  <MapPin className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Address:</p>
                    <p className="text-sm text-gray-600">{profile.address || 'Not specified'}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-start space-x-2 mb-2">
                  <FileText className="h-5 w-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Medical History:</p>
                    <p className="text-sm text-gray-600">{profile.medical_history || 'No medical history'}</p>
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

export default Profile;
