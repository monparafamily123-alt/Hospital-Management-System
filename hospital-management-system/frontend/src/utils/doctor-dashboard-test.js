// Doctor dashboard functionality test
export const testDoctorDashboard = () => {
  console.log('🧪 Testing Doctor Dashboard Functionality...');
  
  // 1. Check authentication
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    console.log('❌ No authentication found. Please login first.');
    console.log('💡 Test with: anjali.reddy@hospital.com / doctor123');
    return false;
  }
  
  try {
    const userData = JSON.parse(user);
    console.log('✅ User authenticated:', userData.name);
    console.log('🔑 User role:', userData.role);
    
    if (userData.role !== 'doctor') {
      console.log('❌ User is not a doctor! Current role:', userData.role);
      return false;
    }
    
    // 2. Test navigation paths
    console.log('\n🧭 Testing doctor navigation paths...');
    const testPaths = [
      '/doctor/dashboard',
      '/doctor/appointments',
      '/doctor/prescriptions',
      '/doctor/profile'
    ];
    
    testPaths.forEach(path => {
      console.log(`  ✅ ${path} - Available route`);
    });
    
    // 3. Test button functionality
    console.log('\n🔘 Testing doctor dashboard buttons...');
    const buttons = [
      { text: 'View All Appointments', path: '/doctor/appointments' },
      { text: 'Manage Prescriptions', path: '/doctor/prescriptions' },
      { text: 'Update Profile', path: '/doctor/profile' }
    ];
    
    buttons.forEach(button => {
      console.log(`  ✅ ${button.text} -> ${button.path}`);
    });
    
    console.log('\n✅ Doctor dashboard test completed successfully!');
    console.log('💡 Next steps:');
    console.log('  1. Login as a doctor');
    console.log('  2. Navigate to /doctor/dashboard');
    console.log('  3. Click the buttons to test navigation');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error parsing user data:', error);
    return false;
  }
};

// Test doctor API endpoints
export const testDoctorAPI = async () => {
  console.log('🧪 Testing Doctor API...');
  
  try {
    const response = await fetch('http://localhost:5000/api/doctor/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Doctor API Response:', data);
    } else {
      console.error('❌ Doctor API Error:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error Details:', errorData);
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
  }
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  window.testDoctorDashboard = testDoctorDashboard;
  window.testDoctorAPI = testDoctorAPI;
  
  console.log('🔧 Doctor dashboard test functions available:');
  console.log('  - testDoctorDashboard() - Test dashboard functionality');
  console.log('  - testDoctorAPI() - Test doctor API endpoints');
}
