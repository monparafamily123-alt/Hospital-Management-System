// Debug doctor profile API
export const debugDoctorProfile = async () => {
  console.log('🔍 Debugging Doctor Profile API...');
  
  // Check authentication
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('📝 Token exists:', !!token);
  console.log('👤 User exists:', !!user);
  
  if (!token || !user) {
    console.log('❌ No authentication found. Please login first.');
    return;
  }
  
  try {
    const userData = JSON.parse(user);
    console.log('✅ User Data:', userData);
    console.log('🔑 User Role:', userData.role);
    console.log('🆔 User ID:', userData.id);
    
    if (userData.role !== 'doctor') {
      console.log('❌ User is not a doctor! Current role:', userData.role);
      return;
    }
    
    // Test API call
    console.log('\n🌐 Testing doctor profile API call...');
    
    const response = await fetch('http://localhost:5000/api/doctor/profile', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Response Status:', response.status);
    console.log('📊 Response OK:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Profile Data:', data);
      
      // Check if required fields exist
      const requiredFields = ['name', 'email', 'experience', 'qualification'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        console.log('⚠️ Missing fields:', missingFields);
      } else {
        console.log('✅ All required fields present');
      }
    } else {
      console.error('❌ API Error:', response.status, response.statusText);
      
      const errorText = await response.text();
      console.error('❌ Error Details:', errorText);
      
      if (response.status === 404) {
        console.log('💡 Possible causes:');
        console.log('  - Doctor record not found in database');
        console.log('  - User ID mismatch between users and doctors tables');
        console.log('  - Authentication token issue');
      }
    }
    
  } catch (error) {
    console.error('❌ Network Error:', error);
  }
};

// Test doctor authentication
export const testDoctorAuth = () => {
  console.log('🧪 Testing Doctor Authentication...');
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      console.log('✅ Authenticated User:', userData.name);
      console.log('🔑 Role:', userData.role);
      console.log('🆔 ID:', userData.id);
      
      if (userData.role === 'doctor') {
        console.log('✅ User is a doctor - should have access to profile');
      } else {
        console.log('❌ User is not a doctor');
      }
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
    }
  } else {
    console.log('❌ No authentication data found');
  }
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  window.debugDoctorProfile = debugDoctorProfile;
  window.testDoctorAuth = testDoctorAuth;
  
  console.log('🔧 Doctor profile debug functions available:');
  console.log('  - debugDoctorProfile() - Debug profile API');
  console.log('  - testDoctorAuth() - Test authentication');
}
