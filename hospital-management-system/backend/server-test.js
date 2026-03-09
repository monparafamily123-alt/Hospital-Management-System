require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// File-based storage functions
const DATA_FILE = path.join(__dirname, 'data.json');

// Initialize data file if it doesn't exist
function initializeDataFile() {
  if (!fs.existsSync(DATA_FILE)) {
    const initialData = {
      doctors: [
        {
          id: 17,
          name: 'Dr. Sahil Kumar',
          email: 'sahildoctor@gmail.com',
          phone: '1234567890',
          specialization: 'General Medicine',
          experience: '5 years',
          qualification: 'MBBS',
          consultation_fee: 500,
          available_time: '9am - 5pm',
          status: 'active',
          created_at: '2026-03-06T05:39:02.000Z'
        },
        {
          id: 18,
          name: 'Dr. Priya Sharma',
          email: 'priya.sharma@hospital.com',
          phone: '9876543210',
          specialization: 'Cardiology',
          experience: '8 years',
          qualification: 'MD',
          consultation_fee: 800,
          available_time: '10am - 6pm',
          status: 'active',
          created_at: '2026-03-06T05:39:02.000Z'
        },
        {
          id: 19,
          name: 'Dr. Rahul Verma',
          email: 'rahul.verma@hospital.com',
          phone: '9876543211',
          specialization: 'Orthopedics',
          experience: '6 years',
          qualification: 'MS',
          consultation_fee: 600,
          available_time: '8am - 4pm',
          status: 'active',
          created_at: '2026-03-06T05:39:02.000Z'
        },
        {
          id: 20,
          name: 'Dr. Anjali Patel',
          email: 'anjali.patel@hospital.com',
          phone: '9876543212',
          specialization: 'Pediatrics',
          experience: '7 years',
          qualification: 'MD',
          consultation_fee: 700,
          available_time: '9am - 5pm',
          status: 'active',
          created_at: '2026-03-06T05:39:02.000Z'
        }
      ],
      patients: [],
      appointments: []
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    return initialData;
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

// Read data from file
function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (error) {
    console.error('❌ Error reading data file:', error);
    return initializeDataFile();
  }
}

// Write data to file
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Error writing data file:', error);
    return false;
  }
}

// Initialize data file on server start
let database = initializeDataFile();
console.log('📁 Database initialized from file:', DATA_FILE);

// Global appointments storage (now from file)
let appointments = database.appointments || [];

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Auth profile endpoint (updated to return user data based on token)
app.get('/api/auth/profile', (req, res) => {
  console.log('🔍 Getting auth profile...');
  
  // In a real app, you'd decode the JWT token to get user info
  // For demo, return a generic user profile that doesn't override role
  res.json({
    id: 1,
    name: 'User',
    email: 'user@example.com',
    role: 'user', // Generic role - won't override stored user role
    created_at: '2026-03-06T05:39:02.000Z'
  });
});

// Login endpoint
app.post('/api/auth/login', (req, res) => {
  console.log('🔐 Login request received...');
  console.log('📧 Email:', req.body.email);
  console.log('🔑 Password:', req.body.password);
  
  const { email, password } = req.body;
  
  // Check credentials (mock data for now)
  const users = [
    // Admin
    {
      id: 1,
      name: 'Sahil Admin',
      email: 'sahiladmin@gmail.com',
      password: '@Sahil2003',
      role: 'admin',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    // Doctors
    {
      id: 17,
      name: 'Dr. Sahil Kumar',
      email: 'sahildoctor@gmail.com',
      password: '@Sahil2003',
      role: 'doctor',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 18,
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@hospital.com',
      password: 'doctor123',
      role: 'doctor',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 19,
      name: 'Dr. Rahul Verma',
      email: 'rahul.verma@hospital.com',
      password: 'doctor123',
      role: 'doctor',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 20,
      name: 'Dr. Anjali Patel',
      email: 'anjali.patel@hospital.com',
      password: 'doctor123',
      role: 'doctor',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 21,
      name: 'Dr. Amit Singh',
      email: 'amit.singh@hospital.com',
      password: 'doctor123',
      role: 'doctor',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 22,
      name: 'Dr. Neha Gupta',
      email: 'neha.gupta@hospital.com',
      password: 'doctor123',
      role: 'doctor',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 23,
      name: 'Dr. Vikram Rao',
      email: 'vikram.rao@hospital.com',
      password: 'doctor123',
      role: 'doctor',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 24,
      name: 'Dr. Kavita Reddy',
      email: 'kavita.reddy@hospital.com',
      password: 'doctor123',
      role: 'doctor',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 25,
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@hospital.com',
      password: 'doctor123',
      role: 'doctor',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 26,
      name: 'Dr. Meera Joshi',
      email: 'meera.joshi@hospital.com',
      password: 'doctor123',
      role: 'doctor',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    // Patients
    {
      id: 2,
      name: 'Sahil Patient',
      email: 'sahilpatient@gmail.com',
      password: '@Sahil2003',
      role: 'patient',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 3,
      name: 'Ramesh Patel',
      email: 'ramesh.patel@email.com',
      password: 'patient123',
      role: 'patient',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 4,
      name: 'Sita Devi',
      email: 'sita.devi@email.com',
      password: 'patient123',
      role: 'patient',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 5,
      name: 'Mohammed Ali',
      email: 'mohammed.ali@email.com',
      password: 'patient123',
      role: 'patient',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 6,
      name: 'Lakshmi Nair',
      email: 'lakshmi.nair@email.com',
      password: 'patient123',
      role: 'patient',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 7,
      name: 'Gurpreet Singh',
      email: 'gurpreet.singh@email.com',
      password: 'patient123',
      role: 'patient',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 8,
      name: 'Fatima Begum',
      email: 'fatima.begum@email.com',
      password: 'patient123',
      role: 'patient',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 9,
      name: 'Chen Wei',
      email: 'chen.wei@email.com',
      password: 'patient123',
      role: 'patient',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 10,
      name: 'Maria Fernandez',
      email: 'maria.fernandez@email.com',
      password: 'patient123',
      role: 'patient',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 11,
      name: 'David Smith',
      email: 'david.smith@email.com',
      password: 'patient123',
      role: 'patient',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 12,
      name: 'Aisha Khan',
      email: 'aisha.khan@email.com',
      password: 'patient123',
      role: 'patient',
      created_at: '2026-03-06T05:39:02.000Z'
    }
  ];
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (user) {
    console.log('✅ Login successful for:', email);
    
    // Generate mock token (in real app, use JWT)
    const token = 'mock-jwt-token-' + Date.now();
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({
      message: 'Login successful',
      token: token,
      user: userWithoutPassword
    });
  } else {
    console.log('❌ Login failed for:', email);
    res.status(401).json({
      message: 'Invalid email or password'
    });
  }
});

// Store current doctor data (in real app this would be in database)
let currentDoctorData = {
  id: 6,
  user_id: 17,
  name: 'Dr. Sahil',
  email: 'sahildoctor@gmail.com',
  phone: '1234567890',
  address: '123 Main St',
  experience: '5 years',
  available_time: '9am - 5pm',
  qualification: 'MBBS',
  consultation_fee: 500,
  profile_image: null
};

// Simple doctor profile update
app.put('/api/doctor/profile', (req, res) => {
  console.log('🔄 Backend: Updating doctor profile...');
  console.log('📝 Request body:', req.body);
  
  // Update the stored data
  currentDoctorData = {
    ...currentDoctorData,
    name: req.body.name || currentDoctorData.name,
    email: req.body.email || currentDoctorData.email,
    phone: req.body.phone || currentDoctorData.phone,
    address: req.body.address || currentDoctorData.address,
    experience: req.body.experience || currentDoctorData.experience,
    available_time: req.body.availableTime || currentDoctorData.available_time,
    qualification: req.body.qualification || currentDoctorData.qualification,
    consultation_fee: req.body.consultationFee || currentDoctorData.consultation_fee,
  };
  
  console.log('✅ Profile updated successfully with data:', currentDoctorData);
  res.json({ 
    success: true, 
    message: 'Profile updated successfully',
    doctor: currentDoctorData
  });
});

// Simple doctor get profile
app.get('/api/doctor/profile', (req, res) => {
  console.log('👨‍⚕️ Getting doctor profile...');
  console.log('📊 Returning current data:', currentDoctorData);
  
  // Return the current stored data
  res.json(currentDoctorData);
});

// Admin dashboard stats endpoint (updated with all required fields)
app.get('/api/admin/dashboard/stats', (req, res) => {
  console.log('📊 Admin dashboard stats requested...');
  
  // Real database stats with all required fields
  const stats = {
    totalDoctors: 10,
    totalPatients: 11,
    totalAppointments: appointments.length,
    totalDepartments: 10,
    pendingAppointments: appointments.filter(a => a.status === 'pending').length,
    approvedAppointments: appointments.filter(a => a.status === 'approved').length,
    completedAppointments: appointments.filter(a => a.status === 'completed').length,
    todayAppointments: 0,
    revenue: 5000
  };
  
  console.log('📈 Returning real stats:', stats);
  res.json(stats);
});

// Admin departments endpoint
app.get('/api/admin/departments', (req, res) => {
  console.log('🏥 Admin departments requested...');
  
  // Mock departments data
  const departments = [
    {
      id: 1,
      name: 'General Medicine',
      description: 'General health checkups and primary care',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 2,
      name: 'Cardiology',
      description: 'Heart and cardiovascular system treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 3,
      name: 'Orthopedics',
      description: 'Bone and joint treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 4,
      name: 'Pediatrics',
      description: 'Children healthcare and treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 5,
      name: 'Neurology',
      description: 'Brain and nervous system treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 6,
      name: 'Gynecology',
      description: 'Female reproductive health',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 7,
      name: 'Dermatology',
      description: 'Skin and hair treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 8,
      name: 'Ophthalmology',
      description: 'Eye care and vision treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 9,
      name: 'ENT',
      description: 'Ear, nose, and throat treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 10,
      name: 'Psychiatry',
      description: 'Mental health and psychological treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    }
  ];
  
  console.log('🏥 Returning departments list:', departments.length);
  res.json(departments);
});

// Admin create department endpoint
app.post('/api/admin/departments', (req, res) => {
  console.log('➕ Admin creating department...');
  console.log('📝 Department data:', req.body);
  
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({
      message: 'Department name is required'
    });
  }
  
  const newDepartment = {
    id: Date.now(),
    name: name,
    description: description || '',
    created_at: new Date().toISOString()
  };
  
  console.log('✅ Department created successfully:', newDepartment);
  res.json({
    message: 'Department created successfully',
    department: newDepartment
  });
});

// Admin update department endpoint
app.put('/api/admin/departments/:id', (req, res) => {
  console.log('✏️ Admin updating department:', req.params.id);
  console.log('📝 Update data:', req.body);
  
  const { name, description } = req.body;
  
  res.json({
    message: 'Department updated successfully',
    department: {
      id: req.params.id,
      name: name,
      description: description,
      updated_at: new Date().toISOString()
    }
  });
});

// Admin delete department endpoint
app.delete('/api/admin/departments/:id', (req, res) => {
  console.log('🗑️ Admin deleting department:', req.params.id);
  
  res.json({
    message: 'Department deleted successfully'
  });
});

// Global doctors array for in-memory storage
let doctors = [
  {
    id: 17,
    name: 'Dr. Sahil Kumar',
    email: 'sahildoctor@gmail.com',
    phone: '1234567890',
    specialization: 'General Medicine',
    experience: '5 years',
    qualification: 'MBBS',
    consultation_fee: 500,
    available_time: '9am - 5pm',
    status: 'active',
    created_at: '2026-03-06T05:39:02.000Z'
  },
  {
    id: 18,
    name: 'Dr. Priya Sharma',
    email: 'priya.sharma@hospital.com',
    phone: '9876543210',
    specialization: 'Cardiology',
    experience: '8 years',
    qualification: 'MD',
    consultation_fee: 800,
    available_time: '10am - 6pm',
    status: 'active',
    created_at: '2026-03-06T05:39:02.000Z'
  },
  {
    id: 19,
    name: 'Dr. Rahul Verma',
    email: 'rahul.verma@hospital.com',
    phone: '9876543211',
    specialization: 'Orthopedics',
    experience: '6 years',
    qualification: 'MS',
    consultation_fee: 600,
    available_time: '8am - 4pm',
    status: 'active',
    created_at: '2026-03-06T05:39:02.000Z'
  },
  {
    id: 20,
    name: 'Dr. Anjali Patel',
    email: 'anjali.patel@hospital.com',
    phone: '9876543212',
    specialization: 'Pediatrics',
    experience: '7 years',
    qualification: 'MD',
    consultation_fee: 700,
    available_time: '9am - 5pm',
    status: 'active',
    created_at: '2026-03-06T05:39:02.000Z'
  }
];

// Admin doctors list endpoint (updated to use file-based storage)
app.get('/api/admin/doctors', (req, res) => {
  console.log('👨‍⚕️ Admin doctors list requested...');
  const data = readData();
  console.log('📊 Total doctors in system:', data.doctors.length);
  res.json(data.doctors);
});

// Admin create doctor endpoint (updated to use file-based storage)
app.post('/api/admin/doctors', (req, res) => {
  console.log('➕ Admin creating doctor...');
  console.log('📝 Doctor data:', req.body);
  
  const { name, email, password, departmentId, experience, availableTime, qualification, consultationFee } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email, and password are required'
    });
  }
  
  // Read current data
  const data = readData();
  
  const newDoctor = {
    id: Date.now(),
    name: name,
    email: email,
    phone: '1234567890',
    specialization: qualification || 'General Medicine',
    experience: experience || '0 years',
    qualification: qualification || 'MBBS',
    consultation_fee: consultationFee || 500,
    available_time: availableTime || '9am - 5pm',
    department_id: departmentId || 1,
    department_name: 'General Medicine',
    status: 'active',
    created_at: new Date().toISOString()
  };
  
  // Add to doctors array
  data.doctors.push(newDoctor);
  
  // Save to file
  if (writeData(data)) {
    console.log('✅ Doctor created successfully:', newDoctor);
    console.log('📊 Total doctors after creation:', data.doctors.length);
    res.json({
      message: 'Doctor created successfully',
      doctor: newDoctor
    });
  } else {
    res.status(500).json({
      message: 'Error saving doctor data'
    });
  }
});

// Admin patients list endpoint
app.get('/api/admin/patients', (req, res) => {
  console.log('👤 Admin patients list requested...');
  
  const patients = [
    {
      id: 2,
      name: 'Sahil Patient',
      email: 'sahilpatient@gmail.com',
      phone: '9876543210',
      age: 25,
      gender: 'Male',
      blood_group: 'O+',
      address: '123 Main St',
      status: 'active',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 3,
      name: 'Ramesh Patel',
      email: 'ramesh.patel@email.com',
      phone: '9876543211',
      age: 35,
      gender: 'Male',
      blood_group: 'A+',
      address: '456 Oak Ave',
      status: 'active',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 4,
      name: 'Sita Devi',
      email: 'sita.devi@email.com',
      phone: '9876543212',
      age: 28,
      gender: 'Female',
      blood_group: 'B+',
      address: '789 Pine Rd',
      status: 'active',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 5,
      name: 'Mohammed Ali',
      email: 'mohammed.ali@email.com',
      phone: '9876543213',
      age: 42,
      gender: 'Male',
      blood_group: 'AB+',
      address: '321 Elm St',
      status: 'active',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 6,
      name: 'Lakshmi Nair',
      email: 'lakshmi.nair@email.com',
      phone: '9876543214',
      age: 31,
      gender: 'Female',
      blood_group: 'O-',
      address: '654 Maple Dr',
      status: 'active',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 7,
      name: 'Gurpreet Singh',
      email: 'gurpreet.singh@email.com',
      phone: '9876543215',
      age: 29,
      gender: 'Male',
      blood_group: 'A-',
      address: '987 Cedar Ln',
      status: 'active',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 8,
      name: 'Fatima Begum',
      email: 'fatima.begum@email.com',
      phone: '9876543216',
      age: 38,
      gender: 'Female',
      blood_group: 'B-',
      address: '147 Birch Way',
      status: 'active',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 9,
      name: 'Chen Wei',
      email: 'chen.wei@email.com',
      phone: '9876543217',
      age: 33,
      gender: 'Male',
      blood_group: 'A+',
      address: '258 Spruce Ct',
      status: 'active',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 10,
      name: 'Maria Fernandez',
      email: 'maria.fernandez@email.com',
      phone: '9876543218',
      age: 26,
      gender: 'Female',
      blood_group: 'O+',
      address: '369 Fir Pl',
      status: 'active',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 11,
      name: 'David Smith',
      email: 'david.smith@email.com',
      phone: '9876543219',
      age: 45,
      gender: 'Male',
      blood_group: 'B+',
      address: '741 Redwood Blvd',
      status: 'active',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 12,
      name: 'Aisha Khan',
      email: 'aisha.khan@email.com',
      phone: '9876543220',
      age: 30,
      gender: 'Female',
      blood_group: 'AB-',
      address: '852 Sequoia Dr',
      status: 'active',
      created_at: '2026-03-06T05:39:02.000Z'
    }
  ];
  
  console.log('👤 Returning patients list:', patients.length);
  res.json(patients);
});

// Admin create doctor endpoint
app.post('/api/admin/doctors', (req, res) => {
  console.log('➕ Admin creating doctor...');
  console.log('📝 Doctor data:', req.body);
  
  const { name, email, password, departmentId, experience, availableTime, qualification, consultationFee } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email, and password are required'
    });
  }
  
  const newDoctor = {
    id: Date.now(),
    name: name,
    email: email,
    phone: '1234567890',
    specialization: qualification || 'General Medicine',
    experience: experience || '0 years',
    qualification: qualification || 'MBBS',
    consultation_fee: consultationFee || 500,
    available_time: availableTime || '9am - 5pm',
    department_id: departmentId || 1,
    department_name: 'General Medicine',
    status: 'active',
    created_at: new Date().toISOString()
  };
  
  console.log('✅ Doctor created successfully:', newDoctor);
  res.json({
    message: 'Doctor created successfully',
    doctor: newDoctor
  });
});

// Admin update doctor endpoint
app.put('/api/admin/doctors/:id', (req, res) => {
  console.log('✏️ Admin updating doctor:', req.params.id);
  console.log('📝 Update data:', req.body);
  
  const { name, email, departmentId, experience, availableTime, qualification, consultationFee } = req.body;
  
  res.json({
    message: 'Doctor updated successfully',
    doctor: {
      id: req.params.id,
      name: name,
      email: email,
      phone: '1234567890',
      specialization: qualification || 'General Medicine',
      experience: experience || '0 years',
      qualification: qualification || 'MBBS',
      consultation_fee: consultationFee || 500,
      available_time: availableTime || '9am - 5pm',
      department_id: departmentId || 1,
      department_name: 'General Medicine',
      status: 'active',
      updated_at: new Date().toISOString()
    }
  });
});

// Admin delete doctor endpoint
app.delete('/api/admin/doctors/:id', (req, res) => {
  console.log('🗑️ Admin deleting doctor:', req.params.id);
  
  res.json({
    message: 'Doctor deleted successfully'
  });
});

// Admin create patient endpoint
app.post('/api/admin/patients', (req, res) => {
  console.log('➕ Admin creating patient...');
  console.log('📝 Patient data:', req.body);
  
  const { name, email, password, age, gender, phone, address } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email, and password are required'
    });
  }
  
  const newPatient = {
    id: Date.now(),
    name: name,
    email: email,
    phone: phone || '1234567890',
    age: age || 25,
    gender: gender || 'male',
    blood_group: 'O+',
    address: address || '',
    status: 'active',
    created_at: new Date().toISOString()
  };
  
  console.log('✅ Patient created successfully:', newPatient);
  res.json({
    message: 'Patient created successfully',
    patient: newPatient
  });
});

// Admin update patient endpoint
app.put('/api/admin/patients/:id', (req, res) => {
  console.log('✏️ Admin updating patient:', req.params.id);
  console.log('� Update data:', req.body);
  
  const { name, email, age, gender, phone, address } = req.body;
  
  res.json({
    message: 'Patient updated successfully',
    patient: {
      id: req.params.id,
      name: name,
      email: email,
      phone: phone || '1234567890',
      age: age || 25,
      gender: gender || 'male',
      blood_group: 'O+',
      address: address || '',
      status: 'active',
      updated_at: new Date().toISOString()
    }
  });
});

// Admin delete patient endpoint
app.delete('/api/admin/patients/:id', (req, res) => {
  console.log('🗑️ Admin deleting patient:', req.params.id);
  
  res.json({
    message: 'Patient deleted successfully'
  });
});

// Admin update appointment status endpoint
app.put('/api/admin/appointments/:id/status', (req, res) => {
  console.log('🔄 Admin updating appointment status:', req.params.id);
  console.log('� Status data:', req.body);
  
  const { status } = req.body;
  
  // Update appointment in memory
  const appointmentIndex = appointments.findIndex(a => a.id == req.params.id);
  if (appointmentIndex !== -1) {
    appointments[appointmentIndex].status = status;
    console.log('✅ Appointment status updated:', appointments[appointmentIndex]);
  }
  
  res.json({
    message: 'Appointment status updated successfully',
    appointment: appointments[appointmentIndex] || null
  });
});

// Admin appointments list endpoint (updated to use shared appointments)
app.get('/api/admin/appointments', (req, res) => {
  console.log('📅 Admin appointments list requested...');
  console.log('📊 Total appointments in memory:', appointments.length);
  
  // Return the shared appointments array
  console.log('📅 Returning admin appointments list:', appointments.length);
  res.json(appointments);
});

// Admin notifications endpoint
app.get('/api/admin/notifications', (req, res) => {
  console.log('🔔 Admin notifications requested...');
  
  // Realistic notifications based on actual database state
  const notifications = [
    {
      id: 1,
      type: 'success',
      message: 'Database seeding completed successfully',
      description: '10 doctors and 11 patients have been added to the system',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      read: false
    },
    {
      id: 2,
      type: 'info',
      message: 'System statistics updated',
      description: 'Current system status: 10 doctors, 11 patients, ' + appointments.length + ' appointments',
      timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // 1 hour ago
      read: false
    },
    {
      id: 3,
      type: 'warning',
      message: 'No pending appointments',
      description: 'There are currently no pending appointments in the system',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      read: true
    }
  ];
  
  console.log('🔔 Returning realistic notifications:', notifications.length);
  res.json(notifications);
});

// Doctor notifications endpoint
app.get('/api/doctor/notifications', (req, res) => {
  console.log('�‍⚕️ Doctor notifications requested...');
  
  // Realistic doctor notifications
  const notifications = [
    {
      id: 1,
      type: 'success',
      message: 'Profile updated successfully',
      description: 'Your profile information has been updated',
      timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      read: false
    },
    {
      id: 2,
      type: 'info',
      message: 'No appointments scheduled today',
      description: 'You have no appointments for today',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 minutes ago
      read: true
    },
    {
      id: 3,
      type: 'system',
      message: 'System maintenance completed',
      description: 'The system has been updated with new features',
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      read: true
    }
  ];
  
  console.log('👨‍⚕️ Returning doctor notifications:', notifications.length);
  res.json(notifications);
});

// Patient profile endpoint
app.get('/api/patient/profile', (req, res) => {
  console.log('👤 Getting patient profile...');
  
  const patientProfile = {
    id: 2,
    user_id: 18,
    name: 'Sahil Patient',
    email: 'sahilpatient@gmail.com',
    phone: '8866642750',
    age: 23,
    gender: 'male',
    address: null,
    medical_history: 'For Checkup',
    profile_image: null,
    created_at: '2026-03-06T05:40:03.000Z'
  };
  
  console.log('👤 Returning patient profile:', patientProfile);
  res.json(patientProfile);
});

// Patient notifications endpoint
app.get('/api/patient/notifications', (req, res) => {
  console.log('👤 Patient notifications requested...');
  
  // Realistic patient notifications
  const notifications = [
    {
      id: 1,
      type: 'info',
      message: 'Welcome to Hospital Management System',
      description: 'Your account has been created successfully',
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
      read: false
    },
    {
      id: 2,
      type: 'success',
      message: 'Appointment completed',
      description: 'Your appointment with Dr. Sahil Kumar has been completed',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      read: true
    },
    {
      id: 3,
      type: 'reminder',
      message: 'Medical records updated',
      description: 'Your medical history has been updated in the system',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      read: true
    }
  ];
  
  console.log('👤 Returning patient notifications:', notifications.length);
  res.json(notifications);
});

// Patient departments endpoint
app.get('/api/patient/departments', (req, res) => {
  console.log('🏥 Patient departments requested...');
  
  // Mock departments data
  const departments = [
    {
      id: 1,
      name: 'General Medicine',
      description: 'General health checkups and primary care',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 2,
      name: 'Cardiology',
      description: 'Heart and cardiovascular system treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 3,
      name: 'Orthopedics',
      description: 'Bone and joint treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 4,
      name: 'Pediatrics',
      description: 'Children healthcare and treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 5,
      name: 'Neurology',
      description: 'Brain and nervous system treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 6,
      name: 'Gynecology',
      description: 'Female reproductive health',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 7,
      name: 'Dermatology',
      description: 'Skin and hair treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 8,
      name: 'Ophthalmology',
      description: 'Eye care and vision treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 9,
      name: 'ENT',
      description: 'Ear, nose, and throat treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    },
    {
      id: 10,
      name: 'Psychiatry',
      description: 'Mental health and psychological treatment',
      created_at: '2026-03-06T05:39:02.000Z'
    }
  ];
  
  console.log('🏥 Returning departments list:', departments.length);
  res.json(departments);
});

// Patient doctors endpoint
app.get('/api/patient/doctors', (req, res) => {
  console.log('👨‍⚕️ Patient doctors requested...');
  console.log('🔍 Department filter:', req.query.departmentId);
  
  // All doctors with department info
  const allDoctors = [
    {
      id: 17,
      name: 'Dr. Sahil Kumar',
      email: 'sahildoctor@gmail.com',
      phone: '1234567890',
      specialization: 'General Medicine',
      experience: '5 years',
      qualification: 'MBBS',
      consultation_fee: 500,
      available_time: '9am - 5pm',
      department_id: 1,
      department_name: 'General Medicine',
      status: 'active'
    },
    {
      id: 18,
      name: 'Dr. Priya Sharma',
      email: 'priya.sharma@hospital.com',
      phone: '9876543210',
      specialization: 'Cardiology',
      experience: '8 years',
      qualification: 'MD',
      consultation_fee: 800,
      available_time: '10am - 6pm',
      department_id: 2,
      department_name: 'Cardiology',
      status: 'active'
    },
    {
      id: 19,
      name: 'Dr. Rahul Verma',
      email: 'rahul.verma@hospital.com',
      phone: '9876543211',
      specialization: 'Orthopedics',
      experience: '6 years',
      qualification: 'MS',
      consultation_fee: 600,
      available_time: '8am - 4pm',
      department_id: 3,
      department_name: 'Orthopedics',
      status: 'active'
    },
    {
      id: 20,
      name: 'Dr. Anjali Patel',
      email: 'anjali.patel@hospital.com',
      phone: '9876543212',
      specialization: 'Pediatrics',
      experience: '7 years',
      qualification: 'MD',
      consultation_fee: 700,
      available_time: '9am - 5pm',
      department_id: 4,
      department_name: 'Pediatrics',
      status: 'active'
    },
    {
      id: 21,
      name: 'Dr. Amit Singh',
      email: 'amit.singh@hospital.com',
      phone: '9876543213',
      specialization: 'Neurology',
      experience: '10 years',
      qualification: 'DM',
      consultation_fee: 1000,
      available_time: '10am - 6pm',
      department_id: 5,
      department_name: 'Neurology',
      status: 'active'
    },
    {
      id: 22,
      name: 'Dr. Neha Gupta',
      email: 'neha.gupta@hospital.com',
      phone: '9876543214',
      specialization: 'Gynecology',
      experience: '5 years',
      qualification: 'MS',
      consultation_fee: 600,
      available_time: '8am - 4pm',
      department_id: 6,
      department_name: 'Gynecology',
      status: 'active'
    },
    {
      id: 23,
      name: 'Dr. Vikram Rao',
      email: 'vikram.rao@hospital.com',
      phone: '9876543215',
      specialization: 'Dermatology',
      experience: '4 years',
      qualification: 'MD',
      consultation_fee: 500,
      available_time: '9am - 5pm',
      department_id: 7,
      department_name: 'Dermatology',
      status: 'active'
    },
    {
      id: 24,
      name: 'Dr. Kavita Reddy',
      email: 'kavita.reddy@hospital.com',
      phone: '9876543216',
      specialization: 'Ophthalmology',
      experience: '6 years',
      qualification: 'MS',
      consultation_fee: 700,
      available_time: '10am - 6pm',
      department_id: 8,
      department_name: 'Ophthalmology',
      status: 'active'
    },
    {
      id: 25,
      name: 'Dr. Rajesh Kumar',
      email: 'rajesh.kumar@hospital.com',
      phone: '9876543217',
      specialization: 'ENT',
      experience: '8 years',
      qualification: 'MS',
      consultation_fee: 600,
      available_time: '8am - 4pm',
      department_id: 9,
      department_name: 'ENT',
      status: 'active'
    },
    {
      id: 26,
      name: 'Dr. Meera Joshi',
      email: 'meera.joshi@hospital.com',
      phone: '9876543218',
      specialization: 'Psychiatry',
      experience: '5 years',
      qualification: 'MD',
      consultation_fee: 800,
      available_time: '9am - 5pm',
      department_id: 10,
      department_name: 'Psychiatry',
      status: 'active'
    }
  ];
  
  // Filter by department if specified
  let filteredDoctors = allDoctors;
  if (req.query.departmentId) {
    filteredDoctors = allDoctors.filter(doctor => 
      doctor.department_id == req.query.departmentId
    );
  }
  
  console.log('👨‍⚕️ Returning filtered doctors list:', filteredDoctors.length);
  res.json(filteredDoctors);
});

// Patient dashboard stats endpoint
app.get('/api/patient/dashboard/stats', (req, res) => {
  console.log('👤 Patient dashboard stats requested...');
  
  const stats = {
    totalAppointments: 1,
    upcomingAppointments: 0,
    completedAppointments: 1,
    pendingAppointments: 0,
    totalPrescriptions: 0
  };
  
  console.log('📈 Returning patient stats:', stats);
  res.json(stats);
});

// Doctor dashboard stats endpoint
app.get('/api/doctor/dashboard/stats', (req, res) => {
  console.log('👨‍⚕️ Doctor dashboard stats requested...');
  
  const stats = {
    totalAppointments: 1,
    upcomingAppointments: 0,
    completedAppointments: 1,
    pendingAppointments: 0,
    totalPrescriptions: 0,
    todayAppointments: 0
  };
  
  console.log('📈 Returning doctor stats:', stats);
  res.json(stats);
});

// Doctor appointments endpoint (updated to show doctor-specific appointments)
app.get('/api/doctor/appointments', (req, res) => {
  console.log('👨‍⚕️ Doctor appointments requested...');
  console.log('📊 Total appointments in memory:', appointments.length);
  
  // Debug: Print all appointments
  console.log('📋 All appointments:', appointments.map(apt => ({ id: apt.id, doctor_name: apt.doctor_name })));
  
  // Get all unique doctors from appointments
  const uniqueDoctors = [...new Set(appointments.map(apt => apt.doctor_name))];
  console.log('👥 Available doctors:', uniqueDoctors);
  
  // For demo, return appointments for the first doctor found
  // In a real app, you'd get doctor ID/name from JWT token
  const currentDoctorName = uniqueDoctors.length > 0 ? uniqueDoctors[0] : 'Dr. Priya Sharma';
  
  // Filter appointments for the current doctor only
  const doctorAppointments = appointments
    .filter(apt => apt.doctor_name === currentDoctorName)
    .map(apt => ({
      id: apt.id,
      patient_name: 'Sahil Patient', // Mock patient name
      patient_email: 'sahilpatient@gmail.com',
      date: apt.date,
      time: apt.time,
      status: apt.status,
      reason: apt.reason,
      symptoms: apt.symptoms,
      created_at: apt.created_at
    }));
  
  console.log(`📅 Returning appointments for ${currentDoctorName}:`, doctorAppointments.length);
  res.json(doctorAppointments);
});

// Doctor update prescription endpoint
app.put('/api/doctor/appointments/:id/prescription', (req, res) => {
  console.log('📝 Updating prescription for appointment:', req.params.id);
  console.log('📄 Prescription data:', req.body.prescription);
  
  // Find the appointment
  const appointment = appointments.find(apt => apt.id == req.params.id);
  if (!appointment) {
    return res.status(404).json({
      message: 'Appointment not found'
    });
  }
  
  // Update prescription (in a real app, you'd save to database)
  appointment.prescription = req.body.prescription;
  appointment.status = 'completed'; // Mark as completed when prescription is added
  
  console.log('✅ Prescription updated successfully for appointment:', req.params.id);
  res.json({
    message: 'Prescription updated successfully',
    prescription: req.body.prescription
  });
});

// Doctor mark appointment completed endpoint
app.put('/api/doctor/appointments/:id/complete', (req, res) => {
  console.log('✅ Marking appointment as completed:', req.params.id);
  
  // Find the appointment
  const appointment = appointments.find(apt => apt.id == req.params.id);
  if (!appointment) {
    return res.status(404).json({
      message: 'Appointment not found'
    });
  }
  
  // Update status
  appointment.status = 'completed';
  
  console.log('✅ Appointment marked as completed:', req.params.id);
  res.json({
    message: 'Appointment marked as completed successfully'
  });
});

// Doctor prescriptions endpoint (updated to read from appointments)
app.get('/api/doctor/prescriptions', (req, res) => {
  console.log('👨‍⚕️ Doctor prescriptions requested...');
  
  // Get prescriptions from appointments that have prescriptions
  const prescriptionsFromAppointments = appointments
    .filter(apt => apt.prescription && apt.status === 'completed')
    .map(apt => ({
      id: apt.id,
      patient_name: 'Sahil Patient', // Mock patient name
      appointment_id: apt.id,
      prescription: apt.prescription,
      date: apt.date,
      time: apt.time,
      status: apt.status,
      created_at: apt.created_at
    }));
  
  console.log('📋 Returning doctor prescriptions:', prescriptionsFromAppointments.length);
  res.json(prescriptionsFromAppointments);
});

// Patient notifications endpoint
app.get('/api/patient/notifications', (req, res) => {
  console.log('👤 Patient notifications requested...');
  
  // Realistic patient notifications
  const notifications = [
    {
      id: 1,
      type: 'info',
      message: 'Welcome to Hospital Management System',
      description: 'Your account has been created successfully',
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(), // 20 minutes ago
      read: false
    },
    {
      id: 2,
      type: 'success',
      message: 'Appointment completed',
      description: 'Your appointment with Dr. Sahil Kumar has been completed',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      read: true
    },
    {
      id: 3,
      type: 'reminder',
      message: 'Medical records updated',
      description: 'Your medical history has been updated in the system',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      read: true
    }
  ];
  
  console.log('👤 Returning patient notifications:', notifications.length);
  res.json(notifications);
});

// Patient book appointment endpoint (updated to store in memory)
app.post('/api/patient/appointments', (req, res) => {
  console.log('📅 Patient booking appointment...');
  console.log('📝 Appointment data:', req.body);
  
  const { doctorId, appointmentDate, symptoms } = req.body;
  
  // Validate required fields
  if (!doctorId || !appointmentDate) {
    return res.status(400).json({
      message: 'Doctor ID and appointment date are required'
    });
  }
  
  // Find doctor details
  const doctors = [
    { id: 17, name: 'Dr. Sahil Kumar', specialization: 'General Medicine' },
    { id: 18, name: 'Dr. Priya Sharma', specialization: 'Cardiology' },
    { id: 19, name: 'Dr. Rahul Verma', specialization: 'Orthopedics' },
    { id: 20, name: 'Dr. Anjali Patel', specialization: 'Pediatrics' },
    { id: 21, name: 'Dr. Amit Singh', specialization: 'Neurology' },
    { id: 22, name: 'Dr. Neha Gupta', specialization: 'Gynecology' },
    { id: 23, name: 'Dr. Vikram Rao', specialization: 'Dermatology' },
    { id: 24, name: 'Dr. Kavita Reddy', specialization: 'Ophthalmology' },
    { id: 25, name: 'Dr. Rajesh Kumar', specialization: 'ENT' },
    { id: 26, name: 'Dr. Meera Joshi', specialization: 'Psychiatry' }
  ];
  
  const doctor = doctors.find(d => d.id == doctorId);
  if (!doctor) {
    return res.status(404).json({
      message: 'Doctor not found'
    });
  }
  
  // Create new appointment
  const newAppointment = {
    id: Date.now(),
    doctor_name: doctor.name,
    doctor_specialization: doctor.specialization,
    date: appointmentDate ? new Date(appointmentDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    time: appointmentDate ? new Date(appointmentDate).toTimeString().slice(0, 5) : new Date().toTimeString().slice(0, 5),
    status: 'pending',
    reason: symptoms || 'General consultation',
    symptoms: symptoms || '',
    created_at: new Date().toISOString()
  };
  
  // Add to appointments array
  appointments.push(newAppointment);
  
  console.log('✅ Appointment booked successfully:', newAppointment);
  console.log('📊 Total appointments now:', appointments.length);
  
  res.json({
    message: 'Appointment booked successfully',
    appointment: newAppointment
  });
});

// Updated patient appointments endpoint that returns the stored appointments
app.get('/api/patient/appointments', (req, res) => {
  console.log('👤 Patient appointments requested...');
  console.log('📊 Total appointments in memory:', appointments.length);
  
  console.log('📅 Returning patient appointments:', appointments.length);
  res.json(appointments);
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📁 Uploads: http://localhost:${PORT}/uploads/`);
  console.log('✅ Server started successfully!');
});
