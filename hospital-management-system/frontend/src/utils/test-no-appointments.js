// Utility to test no appointments state
export const testNoAppointments = () => {
  console.log('🧪 Testing No Appointments State...');
  
  // This can be used to simulate empty appointments array for testing
  const testEmptyState = () => {
    console.log('📋 Simulating empty appointments...');
    // In development, you can temporarily set appointments to [] to test the UI
    console.log('✅ No appointments message should appear');
  };
  
  return {
    testEmptyState
  };
};
