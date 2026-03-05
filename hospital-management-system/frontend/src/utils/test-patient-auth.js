// Test patient authentication and API
export const testPatientAuth = () => {
  console.log('🧪 Testing Patient Authentication...');
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('📝 Token exists:', !!token);
  console.log('👤 User exists:', !!user);
  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      console.log('✅ User Data:', userData);
      console.log('🔑 User Role:', userData.role);
      
      if (userData.role !== 'patient') {
        console.log('❌ User is not a patient! Current role:', userData.role);
        console.log('💡 Please login as a patient to test patient dashboard');
      } else {
        console.log('✅ User is a patient - should have access to patient dashboard');
      }
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
    }
  } else {
    console.log('❌ No authentication data found');
    console.log('💡 Please login first');
  }
};

// Test patient API call
export const testPatientAPI = async () => {
  console.log('🧪 Testing Patient API...');
  
  try {
    const response = await fetch('http://localhost:5000/api/patient/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Patient API Response:', data);
    } else {
      console.error('❌ Patient API Error:', response.status, response.statusText);
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ Error Details:', errorData);
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
  }
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  window.testPatientAuth = testPatientAuth;
  window.testPatientAPI = testPatientAPI;
  
  console.log('🔧 Patient test functions available:');
  console.log('  - testPatientAuth() - Check patient authentication');
  console.log('  - testPatientAPI() - Test patient API call');
}
