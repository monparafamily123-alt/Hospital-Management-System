// Debug authentication state
export const debugAuth = () => {
  console.log('🔍 Debugging Authentication State...');
  console.log('📦 localStorage:');
  console.log('  - token:', localStorage.getItem('token') ? 'EXISTS' : 'MISSING');
  console.log('  - user:', localStorage.getItem('user') ? 'EXISTS' : 'MISSING');
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      console.log('✅ User Data:', userData);
      console.log('🔑 Token Length:', token.length);
      console.log('🔑 Token Preview:', token.substring(0, 20) + '...');
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
    }
  } else {
    console.log('❌ No authentication data in localStorage');
  }
};

// Clear all auth data
export const clearAllAuth = () => {
  console.log('🗑️ Clearing all authentication data...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('✅ Authentication data cleared');
};

// Set test auth data
export const setTestAuth = () => {
  console.log('🧪 Setting test authentication data...');
  const testUser = {
    id: 1,
    name: 'Test Doctor',
    email: 'test@hospital.com',
    role: 'doctor'
  };
  const testToken = 'test-token-' + Date.now();
  
  localStorage.setItem('token', testToken);
  localStorage.setItem('user', JSON.stringify(testUser));
  
  console.log('✅ Test auth data set');
  console.log('👤 User:', testUser);
  console.log('🔑 Token:', testToken);
};
