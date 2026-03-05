const mysql = require('mysql2/promise');

async function addSampleDepartments() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management'
  });

  try {
    console.log('Adding sample departments...');

    const departments = [
      { name: 'Cardiology', description: 'Heart and cardiovascular system diseases and treatments' },
      { name: 'Neurology', description: 'Brain, spinal cord, and nervous system disorders' },
      { name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents' },
      { name: 'Orthopedics', description: 'Bone, joint, and musculoskeletal system treatment' },
      { name: 'General Medicine', description: 'Primary care and general health services' },
      { name: 'Emergency', description: 'Emergency medical services and urgent care' },
      { name: 'Radiology', description: 'Medical imaging and diagnostic services' },
      { name: 'Pharmacy', description: 'Medication dispensing and pharmaceutical services' }
    ];

    for (const dept of departments) {
      // Check if department already exists
      const [existingDept] = await connection.execute(
        'SELECT id FROM departments WHERE name = ?',
        [dept.name]
      );

      if (existingDept.length === 0) {
        const [result] = await connection.execute(
          'INSERT INTO departments (name, description) VALUES (?, ?)',
          [dept.name, dept.description]
        );
        console.log(`✅ Added department: ${dept.name}`);
      } else {
        console.log(`⚠️ Department ${dept.name} already exists`);
      }
    }

    console.log('🎉 Sample departments added successfully!');

  } catch (error) {
    console.error('❌ Error adding sample departments:', error);
  } finally {
    await connection.end();
  }
}

addSampleDepartments();
