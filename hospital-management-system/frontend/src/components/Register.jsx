import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Mail, Lock, User, Calendar, Phone, MapPin, FileText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import FormField from './FormField';
import { showSuccess, showError } from '../utils/toast';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    age: '',
    gender: 'male',
    phone: '',
    address: '',
    medicalHistory: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (formData.role === 'patient') {
      if (!formData.age) {
        newErrors.age = 'Age is required';
      } else if (isNaN(formData.age) || formData.age < 1 || formData.age > 120) {
        newErrors.age = 'Please enter a valid age';
      }
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const { confirmPassword, ...submitData } = formData;
    const result = await register(submitData);
    
    if (result.success) {
      showSuccess('Registration successful!');
      const user = JSON.parse(localStorage.getItem('user'));
      switch (user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'patient':
          navigate('/patient/dashboard');
          break;
        default:
          navigate('/login');
      }
    } else {
      showError(result.error || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Heart className="h-12 w-12 text-primary-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-primary-600 hover:text-primary-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <FormField
              label="Full Name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              helpText="Enter your legal full name as it appears on official documents"
              required
              icon={User}
            />

            <FormField
              label="Email address"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              helpText="We'll use this email for account verification and communications"
              required
              icon={Mail}
            />

            <FormField
              label="Register as"
              name="role"
              type="select"
              value={formData.role}
              onChange={handleChange}
              helpText="Select your role in the hospital management system"
              options={[
                { value: 'patient', label: 'Patient' },
                { value: 'doctor', label: 'Doctor' },
                { value: 'admin', label: 'Admin' }
              ]}
            />
            
            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              helpText="Password must be at least 6 characters long"
              required
              icon={Lock}
              showPasswordToggle
              showPassword={showPassword}
              onPasswordToggle={() => setShowPassword(!showPassword)}
            />

            <FormField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              helpText="Re-enter your password to confirm it's correct"
              required
              icon={Lock}
              showPasswordToggle
              showPassword={showConfirmPassword}
              onPasswordToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {formData.role === 'patient' && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Age"
                    name="age"
                    type="number"
                    placeholder="Age"
                    value={formData.age}
                    onChange={handleChange}
                    error={errors.age}
                    helpText="Enter your current age in years"
                    icon={Calendar}
                  />

                  <FormField
                    label="Gender"
                    name="gender"
                    type="select"
                    value={formData.gender}
                    onChange={handleChange}
                    helpText="Select your gender"
                    options={[
                      { value: 'male', label: 'Male' },
                      { value: 'female', label: 'Female' },
                      { value: 'other', label: 'Other' }
                    ]}
                  />
                </div>

                <FormField
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  helpText="Enter your contact number for appointment reminders"
                  icon={Phone}
                />

                <FormField
                  label="Address"
                  name="address"
                  type="textarea"
                  rows="2"
                  placeholder="Your address"
                  value={formData.address}
                  onChange={handleChange}
                  helpText="Enter your residential address for record keeping"
                  icon={MapPin}
                />

                <FormField
                  label="Medical History (Optional)"
                  name="medicalHistory"
                  type="textarea"
                  rows="3"
                  placeholder="Any existing medical conditions"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  helpText="Provide any relevant medical history or existing conditions"
                  icon={FileText}
                />
              </>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary flex justify-center items-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
