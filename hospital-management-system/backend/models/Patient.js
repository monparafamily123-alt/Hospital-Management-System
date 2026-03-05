const pool = require('../config/database');

class Patient {
  static async create(patientData) {
    console.log('🏥 Patient Model: Creating patient...');
    console.log('📝 Patient data:', patientData);
    
    const { userId, age, phone, medical_history } = patientData;
    
    const [result] = await pool.execute(
      'INSERT INTO patients (user_id, age, phone, medical_history) VALUES (?, ?, ?, ?)',
      [userId, age, phone, medical_history]
    );
    
    console.log('✅ Patient created with ID:', result.insertId);
    return result.insertId;
  }

  static async getAll() {
    console.log('👥 Patient Model: Fetching all patients...');
    
    const [rows] = await pool.execute(`
      SELECT p.*, u.name, u.email 
      FROM patients p 
      JOIN users u ON p.user_id = u.id 
      ORDER BY u.name
    `);
    
    console.log('✅ Patients retrieved:', rows.length);
    return rows;
  }

  static async findById(id) {
    console.log('🔍 Patient Model: Finding patient by ID:', id);
    
    const [rows] = await pool.execute(`
      SELECT p.*, u.name, u.email 
      FROM patients p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.id = ?
    `, [id]);
    
    console.log('✅ Patient found:', rows[0] ? 'Yes' : 'No');
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute(`
      SELECT p.*, u.name, u.email 
      FROM patients p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.user_id = ?
    `, [userId]);
    return rows[0];
  }

  static async update(id, patientData) {
    const { age, phone, medical_history } = patientData;
    const [result] = await pool.execute(
      'UPDATE patients SET age = ?, phone = ?, medical_history = ? WHERE id = ?',
      [age, phone, medical_history, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM patients WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getAppointments(patientId) {
    const [rows] = await pool.execute(`
      SELECT a.*, d.user_id as doctor_user_id, u.name as doctor_name, dep.name as department_name
      FROM appointments a 
      JOIN doctors d ON a.doctor_id = d.id 
      JOIN users u ON d.user_id = u.id 
      JOIN departments dep ON d.department_id = dep.id 
      WHERE a.patient_id = ? 
      ORDER BY a.appointment_date DESC
    `, [patientId]);
    return rows;
  }

  static async getPrescriptionHistory(patientId) {
    const [rows] = await pool.execute(`
      SELECT a.*, d.user_id as doctor_user_id, u.name as doctor_name, dep.name as department_name
      FROM appointments a 
      JOIN doctors d ON a.doctor_id = d.id 
      JOIN users u ON d.user_id = u.id 
      JOIN departments dep ON d.department_id = dep.id 
      WHERE a.patient_id = ? AND a.status = 'completed' AND a.prescription IS NOT NULL
      ORDER BY a.appointment_date DESC
    `, [patientId]);
    return rows;
  }
}

module.exports = Patient;
