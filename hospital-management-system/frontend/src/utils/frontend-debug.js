// Frontend Debug - Check if login request is being sent
export const monitorLoginRequests = () => {
  console.log('🔧 Monitoring login requests...');
  
  // Monitor fetch requests
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    console.log('🌐 Fetch Request:', args[0], args[1]);
    
    return originalFetch.apply(this, args)
      .then(response => {
        console.log('📥 Fetch Response:', response.status, response.statusText);
        
        // Clone response to read body
        const clonedResponse = response.clone();
        clonedResponse.json().then(data => {
          console.log('📥 Response Data:', data);
        }).catch(() => {
          console.log('📥 Response Body: Not JSON');
        });
        
        return response;
      })
      .catch(error => {
        console.error('❌ Fetch Error:', error);
        throw error;
      });
  };
  
  console.log('✅ Request monitoring enabled');
};

// Check login form submission
export const checkLoginFormSubmission = () => {
  console.log('🔍 Checking login form...');
  
  // Find login form
  const loginForm = document.querySelector('form');
  const submitButton = document.querySelector('button[type="submit"]');
  
  console.log('📝 Login form:', loginForm ? '✅ Found' : '❌ Not found');
  console.log('🔘 Submit button:', submitButton ? '✅ Found' : '❌ Not found');
  
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      console.log('🚀 Form submitted!');
      console.log('📊 Form data:', new FormData(loginForm));
      
      const emailInput = document.querySelector('input[type="email"]');
      const passwordInput = document.querySelector('input[type="password"]');
      
      console.log('📧 Email:', emailInput?.value);
      console.log('🔒 Password:', passwordInput?.value ? '***' : 'empty');
    });
  }
  
  // Monitor button clicks
  if (submitButton) {
    submitButton.addEventListener('click', (e) => {
      console.log('🖱️ Submit button clicked!');
    });
  }
};

// Test login API directly from frontend
export const testLoginFromFrontend = async () => {
  try {
    console.log('🔍 Testing login from frontend...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@hospital.com',
        password: 'admin123'
      })
    });
    
    console.log('📥 Response status:', response.status);
    
    const data = await response.json();
    console.log('📥 Response data:', data);
    
    if (response.ok) {
      console.log('✅ Frontend API test successful!');
    } else {
      console.log('❌ Frontend API test failed:', data.message);
    }
  } catch (error) {
    console.error('❌ Frontend API test error:', error);
  }
};

// Add to window
if (typeof window !== 'undefined') {
  window.monitorLoginRequests = monitorLoginRequests;
  window.checkLoginFormSubmission = checkLoginFormSubmission;
  window.testLoginFromFrontend = testLoginFromFrontend;
  
  console.log('🔧 Frontend debug functions available:');
  console.log('  - monitorLoginRequests() - Monitor all fetch requests');
  console.log('  - checkLoginFormSubmission() - Check form submission');
  console.log('  - testLoginFromFrontend() - Test API from frontend');
}
