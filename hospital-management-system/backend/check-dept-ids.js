const mysql = require('mysql2/promise');

async function checkDeptIds() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('Checking department IDs...');
    const [departments] = await connection.execute('SELECT id, name FROM departments ORDER BY id');
    console.log('Available department IDs:');
    if (departments[0] && departments[0].length > 0) {
      departments[0].forEach(dept => {
        console.log(`ID: ${dept.id} -> ${dept.name}`);
      });
    } else {
      console.log('No departments found.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkDeptIds();
