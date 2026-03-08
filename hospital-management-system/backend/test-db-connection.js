// Test database connection
const pool = require('../config/database');

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...');
    
    // Test basic connection
    const [rows] = await pool.execute('SELECT 1 as test');
    console.log('✅ Database connection successful:', rows);
    
    // Test doctors table
    const [doctors] = await pool.execute('DESCRIBE doctors');
    console.log('📋 Doctors table structure:', doctors);
    
    // Check if profile_image column exists
    const [columns] = await pool.execute(
      "SHOW COLUMNS FROM doctors WHERE Field = 'profile_image'"
    );
    console.log('🔍 Profile image column:', columns);
    
    // Add column if not exists
    if (columns.length === 0) {
      console.log('🔧 Adding profile_image column...');
      await pool.execute('ALTER TABLE doctors ADD COLUMN profile_image VARCHAR(500) NULL');
      console.log('✅ Column added successfully');
    }
    
    // Test doctor data
    const [doctorData] = await pool.execute(
      'SELECT * FROM doctors WHERE user_id = 17'
    );
    console.log('👨‍⚕️ Doctor data:', doctorData);
    
  } catch (error) {
    console.error('❌ Database test error:', error);
  }
}

testDatabase();
