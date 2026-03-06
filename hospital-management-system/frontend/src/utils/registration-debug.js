// Registration Debug Helper
export const debugRegistration = () => {
  console.log('🔧 Registration Debug Helper');
  console.log('');
  
  console.log('📋 Common Registration Issues:');
  console.log('1. Name too short (min 2 characters)');
  console.log('2. Invalid email format');
  console.log('3. Password too short (min 6 characters)');
  console.log('4. Network connection issues');
  console.log('5. Backend server not running');
  console.log('');
  
  console.log('🔍 Test Registration Data:');
  const testData = {
    name: 'Test Admin',
    email: 'test.admin@example.com',
    password: 'admin123',
    confirmPassword: 'admin123',
    role: 'admin'
  };
  
  console.log('✅ Valid Example:', testData);
  console.log('');
  
  console.log('🚀 Manual Registration Test:');
  console.log('1. Open browser console');
  console.log('2. Run: testRegistrationAPI()');
  console.log('');
  
  console.log('🔧 Backend Check:');
  console.log('1. Backend running: http://localhost:5000/api/health');
  console.log('2. Registration endpoint: http://localhost:5000/api/auth/register');
  console.log('');
  
  console.log('📊 Frontend Check:');
  console.log('1. Form validation working?');
  console.log('2. Network requests visible in browser dev tools?');
  console.log('3. Error messages in console?');
};

// Test registration API directly
export const testRegistrationAPI = async () => {
  try {
    console.log('🔍 Testing registration API...');
    
    const testData = {
      name: 'Test Admin',
      email: 'test.admin@example.com',
      password: 'admin123',
      role: 'admin'
    };
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration successful:', data);
    } else {
      console.log('❌ Registration failed:', data);
    }
  } catch (error) {
    console.error('❌ API test error:', error);
  }
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  window.debugRegistration = debugRegistration;
  window.testRegistrationAPI = testRegistrationAPI;
  
  console.log('🔧 Registration debug functions available:');
  console.log('  - debugRegistration() - Complete debug guide');
  console.log('  - testRegistrationAPI() - Test API directly');
}
