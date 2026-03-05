import React, { useState, useEffect, useRef } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Award, Clock, Building, DollarSign, Edit, Save, X, Camera, Upload } from 'lucide-react';
import { doctorAPI } from '../../services/api';
import { showSuccess, showError } from '../../utils/toast';
import { useAuth } from '../../contexts/AuthContext';

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [apiError, setApiError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const { user, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    experience: '',
    availableTime: '',
    qualification: '',
    consultationFee: '',
  });

  useEffect(() => {
    console.log('👨‍⚕️ Doctor Profile Component - User:', user);
    console.log('👨‍⚕️ Doctor Profile Component - Authenticated:', isAuthenticated);
    
    if (isAuthenticated && user?.role === 'doctor') {
      fetchProfile();
    } else {
      console.log('❌ User is not authenticated or not a doctor');
      setApiError('User is not authenticated as a doctor');
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const fetchProfile = async () => {
    try {
      console.log('👨‍⚕️ Fetching doctor profile...');
      setApiError(null);
      const response = await doctorAPI.getProfile();
      console.log('✅ Doctor profile response:', response);
      setDoctor(response.data);
      setFormData({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
        experience: response.data.experience || '',
        availableTime: response.data.available_time || '',
        qualification: response.data.qualification || '',
        consultationFee: response.data.consultation_fee || '',
      });
    } catch (error) {
      console.error('❌ Error fetching profile:', error);
      setApiError(error.response?.data?.message || 'Failed to fetch profile');
      setDoctor(null);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError('');
    setSuccess('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showError('Please select an image file');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      showError('Image size should be less than 5MB');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', file);

    setUploadingImage(true);
    try {
      const response = await doctorAPI.uploadProfileImage(formData);
      showSuccess('Profile image updated successfully');
      
      // Update the doctor state with new image
      setDoctor(prev => ({
        ...prev,
        profile_image: response.data.profileImage
      }));
    } catch (error) {
      console.error('Error uploading image:', error);
      
      if (error.response?.status === 404) {
        showError('Profile image upload not available. Please restart the backend server.');
      } else if (error.response?.status === 500) {
        showError('Server error. Please check backend logs.');
      } else {
        showError('Failed to upload profile image');
      }
    } finally {
      setUploadingImage(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCancel = () => {
    setEditing(false);
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        email: doctor.email || '',
        phone: doctor.phone || '',
        address: doctor.address || '',
        experience: doctor.experience || '',
        availableTime: doctor.available_time || '',
        qualification: doctor.qualification || '',
        consultationFee: doctor.consultation_fee || '',
      });
    }
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    try {
      console.log('🔄 Updating doctor profile...');
      const response = await doctorAPI.updateProfile(formData);
      console.log('✅ Profile update response:', response);
      
      showSuccess('Profile updated successfully!');
      setEditing(false);
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      setError('Failed to update profile. Please try again.');
      showError('Failed to update profile. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="text-center py-8">
        <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profile Not Found</h3>
        <p className="text-gray-500 mb-4">
          {apiError || 'Unable to load your profile information'}
        </p>
        {apiError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 max-w-md mx-auto">
            <div className="text-sm text-red-800">
              <strong>Error:</strong> {apiError}
            </div>
          </div>
        )}
        <div className="mt-4 text-sm text-gray-600">
          <p>Please ensure you are logged in as a doctor.</p>
          <button 
            onClick={() => window.location.href = '/login'} 
            className="mt-2 btn btn-primary"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Doctor Profile</h1>
        <p className="text-gray-600 mt-2">Manage your professional information</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="card">
            <div className="text-center">
              {/* Profile Image */}
              <div className="relative inline-block">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-gray-100">
                  {doctor.profile_image ? (
                    <img 
                      src={doctor.profile_image} 
                      alt={doctor.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=0D8ABC&color=fff&size=128`;
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="h-12 w-12 text-primary-600" />
                    </div>
                  )}
                </div>
                
                {/* Upload Button */}
                <button
                  onClick={triggerFileInput}
                  disabled={uploadingImage}
                  className="absolute bottom-2 right-0 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors disabled:opacity-50"
                  title="Change profile picture"
                >
                  {uploadingImage ? (
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </button>
              </div>
              
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <h2 className="text-xl font-bold text-gray-900">{doctor.name}</h2>
              <p className="text-gray-600">{doctor.department_name}</p>
              
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {doctor.email}
                </div>
                {doctor.phone && (
                  <div className="flex items-center justify-center">
                    <Phone className="h-4 w-4 mr-2" />
                    {doctor.phone}
                  </div>
                )}
                <div className="flex items-center justify-center">
                  <Award className="h-4 w-4 mr-2" />
                  {doctor.experience}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  <div className="flex items-center justify-center mb-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    Joined {new Date(doctor.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
              {!editing ? (
                <button
                  onClick={handleEdit}
                  className="btn btn-primary flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-3">
                  <button
                    onClick={handleCancel}
                    className="btn btn-secondary flex items-center"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="btn btn-primary flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Dr. John Smith"
                    disabled={!editing}
                  />
                </div>

                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="doctor@hospital.com"
                    disabled={!editing}
                  />
                </div>

                <div>
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+1 234 567 8900"
                    disabled={!editing}
                  />
                </div>

                <div>
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="123 Medical Center, City"
                    disabled={!editing}
                  />
                </div>

                <div>
                  <label className="form-label">Experience</label>
                  <input
                    type="text"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="5 years"
                    disabled={!editing}
                  />
                </div>

                <div>
                  <label className="form-label">Available Time</label>
                  <input
                    type="text"
                    name="availableTime"
                    value={formData.availableTime}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="9 AM - 5 PM"
                    disabled={!editing}
                  />
                </div>

                <div>
                  <label className="form-label">Qualification</label>
                  <input
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="MBBS, MD - Cardiology"
                    disabled={!editing}
                  />
                </div>

                <div>
                  <label className="form-label">Consultation Fee</label>
                  <input
                    type="number"
                    name="consultationFee"
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="150.00"
                    step="0.01"
                    disabled={!editing}
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Department</label>
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    value={doctor.department_name || 'Not assigned'}
                    className="input-field"
                    disabled
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
