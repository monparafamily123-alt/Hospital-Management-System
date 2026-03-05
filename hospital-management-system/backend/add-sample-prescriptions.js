const mysql = require('mysql2/promise');

async function addSamplePrescriptions() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management'
  });

  try {
    console.log('Adding sample prescriptions...');

    // First, let's check if we have any completed appointments
    const [appointments] = await connection.execute(`
      SELECT a.*, p.user_id as patient_user_id, u.name as patient_name, u.email as patient_email
      FROM appointments a 
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      ORDER BY a.id DESC
      LIMIT 5
    `);

    if (appointments.length === 0) {
      console.log('No appointments found. Creating sample appointments first...');
      
      // Get first doctor and patient
      const [doctors] = await connection.execute('SELECT * FROM doctors LIMIT 1');
      const [patients] = await connection.execute('SELECT * FROM patients LIMIT 1');
      
      if (doctors.length > 0 && patients.length > 0) {
        // Create sample appointments
        const sampleAppointments = [
          {
            patientId: patients[0].id,
            doctorId: doctors[0].id,
            appointmentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
            symptoms: 'Headache and fever for 3 days',
            prescription: '1. Paracetamol 500mg - 2 times daily after meals\n2. Rest and hydration\n3. Follow up after 3 days if symptoms persist'
          },
          {
            patientId: patients[0].id,
            doctorId: doctors[0].id,
            appointmentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            symptoms: 'Cough and cold',
            prescription: '1. Antihistamine - 1 tablet at night\n2. Warm salt water gargle\n3. Avoid cold drinks\n4. Steam inhalation 2 times daily'
          }
        ];

        for (const apt of sampleAppointments) {
          const [result] = await connection.execute(`
            INSERT INTO appointments (patient_id, doctor_id, appointment_date, symptoms, prescription, status) 
            VALUES (?, ?, ?, ?, ?, 'completed')
          `, [apt.patientId, apt.doctorId, apt.appointmentDate, apt.symptoms, apt.prescription]);
          
          console.log(`✅ Created sample appointment with prescription ID: ${result.insertId}`);
        }
      }
    } else {
      // Add prescriptions to existing appointments
      const prescriptions = [
        '1. Amoxicillin 500mg - 3 times daily for 7 days\n2. Ibuprofen 400mg - as needed for pain\n3. Warm compress on affected area\n4. Follow up in 1 week',
        '1. Multivitamin supplement - once daily\n2. Increase fluid intake\n3. Light exercise\n4. Regular sleep schedule\n5. Stress management techniques'
      ];

      for (let i = 0; i < Math.min(appointments.length, prescriptions.length); i++) {
        await connection.execute(`
          UPDATE appointments 
          SET prescription = ?, status = 'completed' 
          WHERE id = ?
        `, [prescriptions[i], appointments[i].id]);
        
        console.log(`✅ Added prescription to appointment ID: ${appointments[i].id}`);
      }
    }

    console.log('🎉 Sample prescriptions added successfully!');

  } catch (error) {
    console.error('❌ Error adding sample prescriptions:', error);
  } finally {
    await connection.end();
  }
}

addSamplePrescriptions();
