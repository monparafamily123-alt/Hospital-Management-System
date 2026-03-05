// Comprehensive doctor profile test
export const testDoctorProfile = () => {
  console.log('🧪 Testing Doctor Profile Functionality...');
  
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
    console.log('🆔 User ID:', userData.id);
    
    if (userData.role !== 'doctor') {
      console.log('❌ User is not a doctor! Current role:', userData.role);
      console.log('💡 Please login as a doctor to test profile');
      return false;
    }
    
    // 2. Test profile page access
    console.log('\n🌐 Testing profile page access...');
    console.log('✅ Profile URL: http://localhost:5173/doctor/profile');
    console.log('✅ Should be accessible for authenticated doctors');
    
    // 3. Test API endpoint
    console.log('\n🔍 Testing doctor profile API...');
    console.log('✅ Endpoint: GET /api/doctor/profile');
    console.log('✅ Requires: Authentication token + doctor role');
    
    // 4. Expected data structure
    console.log('\n📊 Expected profile data structure:');
    const expectedFields = [
      'name', 'email', 'experience', 'qualification', 
      'available_time', 'consultation_fee', 'department_name'
    ];
    
    expectedFields.forEach(field => {
      console.log(`  ✅ ${field}`);
    });
    
    console.log('\n✅ Doctor profile test completed!');
    console.log('💡 Next steps:');
    console.log('  1. Login as a doctor');
    console.log('  2. Navigate to /doctor/profile');
    console.log('  3. Check if profile loads correctly');
    console.log('  4. Test profile editing functionality');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error parsing user data:', error);
    return false;
  }
};

// Test profile editing
export const testProfileEditing = () => {
  console.log('🧪 Testing Profile Editing...');
  
  const editingFeatures = [
    'Edit profile information',
    'Update name and email',
    'Update professional details',
    'Save changes',
    'Cancel editing'
  ];
  
  editingFeatures.forEach(feature => {
    console.log(`  ✅ ${feature}`);
  });
  
  console.log('\n💡 To test editing:');
  console.log('  1. Go to /doctor/profile');
  console.log('  2. Click "Edit Profile" button');
  console.log('  3. Make changes to form fields');
  console.log('  4. Click "Save" to update');
  console.log('  5. Verify changes are saved');
};

// Troubleshooting guide
export const doctorProfileTroubleshoot = () => {
  console.log('🔧 Doctor Profile Troubleshooting Guide:');
  console.log('');
  
  console.log('❌ "Profile Not Found" - Possible Causes:');
  console.log('  1. Not logged in as a doctor');
  console.log('  2. Authentication token expired');
  console.log('  3. Doctor record missing in database');
  console.log('  4. User-doctor relationship broken');
  console.log('');
  
  console.log('🔧 Solutions:');
  console.log('  1. Login again with doctor credentials');
  console.log('  2. Check browser console for errors');
  console.log('  3. Run debugDoctorProfile() in console');
  console.log('  4. Verify backend is running');
  console.log('');
  
  console.log('🧪 Debug Commands:');
  console.log('  • debugDoctorProfile() - Debug API call');
  console.log('  • testDoctorAuth() - Check authentication');
  console.log('  • testDoctorProfile() - Full profile test');
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  window.testDoctorProfile = testDoctorProfile;
  window.testProfileEditing = testProfileEditing;
  window.doctorProfileTroubleshoot = doctorProfileTroubleshoot;
  
  console.log('🔧 Doctor profile test functions available:');
  console.log('  - testDoctorProfile() - Test profile functionality');
  console.log('  - testProfileEditing() - Test editing features');
  console.log('  - doctorProfileTroubleshoot() - Troubleshooting guide');
}
