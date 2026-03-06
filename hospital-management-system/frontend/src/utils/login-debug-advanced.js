// Advanced Login Debug Helper
export const advancedLoginDebug = () => {
  console.log('🔧 Advanced Login Debug Helper');
  console.log('');
  
  console.log('📋 Current Status Check:');
  console.log('1. Backend running: http://localhost:5000/api/health');
  console.log('2. Frontend running: http://localhost:5173');
  console.log('3. Database passwords updated');
  console.log('');
  
  console.log('🔍 Debug Steps:');
  console.log('1. Open browser Dev Tools (F12)');
  console.log('2. Go to Network tab');
  console.log('3. Try login with admin credentials');
  console.log('4. Check if login request appears');
  console.log('5. Check request/response details');
  console.log('');
  
  console.log('🚀 Manual API Test:');
  console.log('Run: testLoginAPI() in console');
  console.log('');
  
  console.log('📊 Test Data:');
  const testData = {
    email: 'admin@hospital.com',
    password: 'admin123'
  };
  console.log('✅ Valid credentials:', testData);
  console.log('');
  
  console.log('🔧 Common Issues:');
  console.log('1. Form validation blocking submit');
  console.log('2. Network request not being sent');
  console.log('3. Backend not responding');
  console.log('4. CORS issues');
  console.log('5. Frontend validation errors');
};

// Test login API with detailed logging
export const testLoginAPI = async () => {
  try {
    console.log('🔍 Testing login API directly...');
    
    const testData = {
      email: 'admin@hospital.com',
      password: 'admin123'
    };
    
    console.log('📤 Request data:', testData);
    console.log('🌐 Request URL: http://localhost:5000/api/auth/login');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', [...response.headers.entries()]);
    
    const data = await response.json();
    console.log('📥 Response data:', data);
    
    if (response.ok) {
      console.log('✅ API Login successful!');
      console.log('🎫 Token:', data.token);
      console.log('👤 User:', data.user);
    } else {
      console.log('❌ API Login failed:', data.message);
    }
  } catch (error) {
    console.error('❌ API Test Error:', error);
    console.log('🔍 Error details:', {
      message: error.message,
      stack: error.stack
    });
  }
};

// Test backend health
export const testBackendHealth = async () => {
  try {
    console.log('🔍 Testing backend health...');
    
    const response = await fetch('http://localhost:5000/api/health');
    const data = await response.json();
    
    console.log('✅ Backend health:', data);
  } catch (error) {
    console.error('❌ Backend health check failed:', error);
  }
};

// Check form validation
export const checkLoginForm = () => {
  console.log('🔍 Checking login form...');
  
  const emailInput = document.querySelector('input[type="email"]');
  const passwordInput = document.querySelector('input[type="password"]');
  const submitButton = document.querySelector('button[type="submit"]');
  
  console.log('📧 Email input:', emailInput ? '✅ Found' : '❌ Not found');
  console.log('🔒 Password input:', passwordInput ? '✅ Found' : '❌ Not found');
  console.log('🔘 Submit button:', submitButton ? '✅ Found' : '❌ Not found');
  
  if (emailInput && passwordInput) {
    console.log('📧 Email value:', emailInput.value);
    console.log('🔒 Password value:', passwordInput.value ? '***' : 'empty');
  }
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  window.advancedLoginDebug = advancedLoginDebug;
  window.testLoginAPI = testLoginAPI;
  window.testBackendHealth = testBackendHealth;
  window.checkLoginForm = checkLoginForm;
  
  console.log('🔧 Advanced login debug functions available:');
  console.log('  - advancedLoginDebug() - Complete debug guide');
  console.log('  - testLoginAPI() - Test login API directly');
  console.log('  - testBackendHealth() - Test backend connection');
  console.log('  - checkLoginForm() - Check form elements');
}
