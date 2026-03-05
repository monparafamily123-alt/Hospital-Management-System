const mysql = require('mysql2/promise');

async function seed20Patients() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hospital_management',
  });

  try {
    console.log('Connecting to database...');
    
    // 20 sample patients with diverse data
    const patients = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@patient.com',
        password: 'patient123',
        age: 28,
        gender: 'male',
        phone: '9876543210',
        medical_history: 'No major medical history. Occasional headaches.'
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@patient.com',
        password: 'patient123',
        age: 32,
        gender: 'female',
        phone: '9876543211',
        medical_history: 'Asthma since childhood. Uses inhaler occasionally.'
      },
      {
        name: 'Amit Kumar',
        email: 'amit.kumar@patient.com',
        password: 'patient123',
        age: 45,
        gender: 'male',
        phone: '9876543212',
        medical_history: 'Hypertension for 5 years. On regular medication.'
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha.reddy@patient.com',
        password: 'patient123',
        age: 25,
        gender: 'female',
        phone: '9876543213',
        medical_history: 'No significant medical history. Regular checkups.'
      },
      {
        name: 'Vikram Singh',
        email: 'vikram.singh@patient.com',
        password: 'patient123',
        age: 38,
        gender: 'male',
        phone: '9876543214',
        medical_history: 'Type 2 Diabetes diagnosed 3 years ago. Controlled with diet and medication.'
      },
      {
        name: 'Anjali Gupta',
        email: 'anjali.gupta@patient.com',
        password: 'patient123',
        age: 29,
        gender: 'female',
        phone: '9876543215',
        medical_history: 'Migraines since teenage years. Triggered by stress.'
      },
      {
        name: 'Rohit Verma',
        email: 'rohit.verma@patient.com',
        password: 'patient123',
        age: 52,
        gender: 'male',
        phone: '9876543216',
        medical_history: 'Heart condition - previous bypass surgery 2 years ago.'
      },
      {
        name: 'Kavita Nair',
        email: 'kavita.nair@patient.com',
        password: 'patient123',
        age: 35,
        gender: 'female',
        phone: '9876543217',
        medical_history: 'Thyroid issues. On medication for hypothyroidism.'
      },
      {
        name: 'Arjun Mehta',
        email: 'arjun.mehta@patient.com',
        password: 'patient123',
        age: 41,
        gender: 'male',
        phone: '9876543218',
        medical_history: 'Back pain due to sedentary lifestyle. Physical therapy recommended.'
      },
      {
        name: 'Divya Joshi',
        email: 'divya.joshi@patient.com',
        password: 'patient123',
        age: 27,
        gender: 'female',
        phone: '9876543219',
        medical_history: 'Allergies to pollen and dust. Takes antihistamines seasonally.'
      },
      {
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar4@patient.com',
        password: 'patient123',
        age: 33,
        gender: 'male',
        phone: '9876543220',
        medical_history: 'High cholesterol levels. Diet and exercise management.'
      },
      {
        name: 'Meera Singh',
        email: 'meera.singh@patient.com',
        password: 'patient123',
        age: 30,
        gender: 'female',
        phone: '9876543221',
        medical_history: 'Anxiety and mild depression. Under counseling and medication.'
      },
      {
        name: 'Sanjay Patel',
        email: 'sanjay.patel@patient.com',
        password: 'patient123',
        age: 48,
        gender: 'male',
        phone: '9876543222',
        medical_history: 'Arthritis in knees. Pain management with physiotherapy.'
      },
      {
        name: 'Pooja Sharma',
        email: 'pooja.sharma@patient.com',
        password: 'patient123',
        age: 26,
        gender: 'female',
        phone: '9876543223',
        medical_history: 'Irregular menstrual cycles. Under gynecological care.'
      },
      {
        name: 'Amit Reddy',
        email: 'amit.reddy@patient.com',
        password: 'patient123',
        age: 36,
        gender: 'male',
        phone: '9876543224',
        medical_history: 'Kidney stones. History of recurrent episodes.'
      },
      {
        name: 'Neha Gupta',
        email: 'neha.gupta@patient.com',
        password: 'patient123',
        age: 31,
        gender: 'female',
        phone: '9876543225',
        medical_history: 'PCOS (Polycystic Ovary Syndrome). Managed with lifestyle changes.'
      },
      {
        name: 'Vivek Kumar',
        email: 'vivek.kumar@patient.com',
        password: 'patient123',
        age: 43,
        gender: 'male',
        phone: '9876543226',
        medical_history: 'Sleep apnea. Uses CPAP machine at night.'
      },
      {
        name: 'Anita Singh',
        email: 'anita.singh@patient.com',
        password: 'patient123',
        age: 37,
        gender: 'female',
        phone: '9876543227',
        medical_history: 'Osteoporosis. Calcium and vitamin D supplements.'
      },
      {
        name: 'Rohit Sharma',
        email: 'rohit.sharma2@patient.com',
        password: 'patient123',
        age: 29,
        gender: 'male',
        phone: '9876543228',
        medical_history: 'Acid reflux disease. Dietary modifications and medication.'
      },
      {
        name: 'Kavita Reddy',
        email: 'kavita.reddy@patient.com',
        password: 'patient123',
        age: 34,
        gender: 'female',
        phone: '9876543229',
        medical_history: 'Mild anemia. Iron supplements and dietary changes.'
      }
    ];

    console.log('Adding 20 patients to database...');
    
    for (const patient of patients) {
      try {
        // First insert into users table
        const [userResult] = await connection.execute(
          'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
          [patient.name, patient.email, patient.password, 'patient']
        );
        
        // Then insert into patients table
        await connection.execute(
          `INSERT INTO patients (
            user_id, age, gender, phone, medical_history
          ) VALUES (?, ?, ?, ?, ?)`,
          [
            userResult.insertId,
            patient.age,
            patient.gender,
            patient.phone,
            patient.medical_history
          ]
        );
        
        console.log(`✅ Added: ${patient.name} (${patient.age}, ${patient.gender})`);
      } catch (error) {
        console.error(`❌ Error adding ${patient.name}:`, error.message);
      }
    }
    
    console.log('✅ 20 patients added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding patients:', error);
  } finally {
    await connection.end();
    console.log('Database connection closed.');
  }
}

seed20Patients();
