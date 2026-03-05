// Add debug functions to window object for easy access in browser console
import { debugAuth, clearAllAuth, setTestAuth } from './debug-auth';

// Make debug functions available globally
if (typeof window !== 'undefined') {
  window.debugAuth = debugAuth;
  window.clearAllAuth = clearAllAuth;
  window.setTestAuth = setTestAuth;
  
  console.log('🔧 Debug functions available in window:');
  console.log('  - debugAuth() - Check authentication state');
  console.log('  - clearAllAuth() - Clear all auth data');
  console.log('  - setTestAuth() - Set test auth data');
}
