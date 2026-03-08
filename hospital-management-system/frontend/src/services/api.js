import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🌐 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      headers: config.headers
    });
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      url: error.config?.url,
      message: error.message,
      data: error.response?.data
    });
    
    // Only logout on 401 (Unauthorized) errors
    if (error.response?.status === 401) {
      console.log('🔐 Unauthorized - Clearing auth and redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    // Don't logout on network errors or other HTTP errors
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
};

export const adminAPI = {
  getDashboardStats: () => {
    console.log('📊 Fetching admin dashboard stats...');
    return api.get('/admin/dashboard/stats');
  },
  getDoctors: () => {
    console.log('👨‍⚕️ Fetching doctors list...');
    return api.get('/admin/doctors');
  },
  createDoctor: (doctorData) => {
    console.log('➕ Creating doctor with data:', doctorData);
    return api.post('/admin/doctors', doctorData);
  },
  updateDoctor: (id, doctorData) => {
    console.log('✏️ Updating doctor:', id, doctorData);
    return api.put(`/admin/doctors/${id}`, doctorData);
  },
  deleteDoctor: (id) => {
    console.log('🗑️ Deleting doctor:', id);
    return api.delete(`/admin/doctors/${id}`);
  },
  getDepartments: () => {
    console.log('🏥 Fetching departments...');
    return api.get('/admin/departments');
  },
  createDepartment: (departmentData) => {
    console.log('➕ Creating department:', departmentData);
    return api.post('/admin/departments', departmentData);
  },
  updateDepartment: (id, departmentData) => {
    console.log('✏️ Updating department:', id, departmentData);
    return api.put(`/admin/departments/${id}`, departmentData);
  },
  deleteDepartment: (id) => {
    console.log('🗑️ Deleting department:', id);
    return api.delete(`/admin/departments/${id}`);
  },
  getPatients: () => {
    console.log('👥 Fetching patients list...');
    return api.get('/admin/patients');
  },
  createPatient: (patientData) => {
    console.log('➕ Creating patient with data:', patientData);
    console.log('🌐 Making POST request to: /admin/patients');
    return api.post('/admin/patients', patientData);
  },
  updatePatient: (id, patientData) => {
    console.log('✏️ Updating patient:', id, patientData);
    return api.put(`/admin/patients/${id}`, patientData);
  },
  deletePatient: (id) => {
    console.log('🗑️ Deleting patient:', id);
    return api.delete(`/admin/patients/${id}`);
  },
  getAppointments: () => {
    console.log('📅 Fetching appointments...');
    return api.get('/admin/appointments');
  },
  updateAppointmentStatus: (id, status) => {
    console.log('🔄 Updating appointment status:', id, status);
    return api.put(`/admin/appointments/${id}/status`, { status });
  },
};

export const doctorAPI = {
  getDashboardStats: () => api.get('/doctor/dashboard/stats'),
  getAppointments: () => api.get('/doctor/appointments'),
  getPrescriptions: () => api.get('/doctor/prescriptions'),
  getProfile: () => api.get('/doctor/profile'),
  updateProfile: (profileData) => api.put('/doctor/profile', profileData),
  uploadProfileImage: (formData) => {
    console.log('📸 Uploading doctor profile image...');
    return api.post('/doctor/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  updatePrescription: (id, prescription) => api.put(`/doctor/appointments/${id}/prescription`, { prescription }),
  markAppointmentCompleted: (id) => api.put(`/doctor/appointments/${id}/complete`),
};

export const patientAPI = {
  getDashboardStats: () => api.get('/patient/dashboard/stats'),
  getAppointments: () => api.get('/patient/appointments'),
  bookAppointment: (appointmentData) => api.post('/patient/appointments', appointmentData),
  getPrescriptions: () => api.get('/patient/prescriptions'),
  getDoctors: (departmentId) => api.get('/patient/doctors', { params: { departmentId } }),
  getDepartments: () => api.get('/patient/departments'),
  getProfile: () => api.get('/patient/profile'),
  uploadProfileImage: (formData) => {
    console.log('📸 Uploading patient profile image...');
    return api.post('/patient/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default api;
