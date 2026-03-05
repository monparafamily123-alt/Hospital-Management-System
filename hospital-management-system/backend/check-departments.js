const mysql = require('mysql2/promise');

async function checkDepartments() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('Checking departments...');
    const [departments] = await connection.execute('SELECT * FROM departments');
    console.log('Available departments:');
    if (departments[0] && departments[0].length > 0) {
      departments[0].forEach(dept => {
        console.log(`ID: ${dept.id}, Name: ${dept.name}`);
      });
    } else {
      console.log('No departments found.');
    }

    console.log('\nChecking doctors...');
    const [doctors] = await connection.execute(`
      SELECT d.*, u.name, u.email 
      FROM doctors d 
      JOIN users u ON d.user_id = u.id 
      WHERE u.role = 'doctor'
    `);
    console.log('Current doctors:');
    if (doctors[0] && doctors[0].length > 0) {
      doctors[0].forEach(doctor => {
        console.log(`- ${doctor.name} (${doctor.email}) - Dept ID: ${doctor.department_id}`);
      });
    } else {
      console.log('No doctors found.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkDepartments();
