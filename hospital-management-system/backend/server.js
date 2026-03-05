require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const doctorRoutes = require('./routes/doctor');
const patientRoutes = require('./routes/patient');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Hospital Management System API is running' });
});

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log('🚀 Server starting...');
  console.log('🌐 Environment:', process.env.NODE_ENV || 'development');
  console.log('🔗 Database:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD ? '[SET]' : '[EMPTY]'
  });
  console.log('📡 Server running on port:', PORT);
  console.log('🔗 Health check: http://localhost:5000/api/health');
  console.log('✅ Server started successfully!');
});
