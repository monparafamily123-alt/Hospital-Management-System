// Utility to test authentication persistence
export const testAuthPersistence = () => {
  console.log('🔍 Testing Authentication Persistence...');
  
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  console.log('📝 Token exists:', !!token);
  console.log('👤 User exists:', !!user);
  
  if (token && user) {
    try {
      const userData = JSON.parse(user);
      console.log('✅ User data:', userData);
      console.log('🔑 Token length:', token.length);
      return true;
    } catch (error) {
      console.error('❌ Error parsing user data:', error);
      return false;
    }
  } else {
    console.log('❌ No authentication data found');
    return false;
  }
};

export const clearAuthData = () => {
  console.log('🗑️ Clearing authentication data...');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('✅ Authentication data cleared');
};
