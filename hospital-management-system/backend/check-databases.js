const mysql = require('mysql2/promise');

async function checkDatabases() {
  try {
    console.log('Testing MySQL connection...');
    
    // Try without password first
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: ''
    });
    
    console.log('✅ Connected to MySQL (no password)');
    
    const [databases] = await connection.execute('SHOW DATABASES');
    console.log('Available databases:');
    databases.forEach(db => console.log('- ' + db.Database));
    
    await connection.end();
    
    // Now try with password
    console.log('\nTesting with password 8761...');
    const connection2 = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '8761'
    });
    
    console.log('✅ Connected to MySQL (with password)');
    const [databases2] = await connection2.execute('SHOW DATABASES');
    console.log('Available databases:');
    databases2.forEach(db => console.log('- ' + db.Database));
    
    await connection2.end();
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('🔍 Error details:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState
    });
  }
}

checkDatabases();
