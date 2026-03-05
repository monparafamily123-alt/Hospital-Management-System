const pool = require('../config/database');

class Doctor {
  static async create(doctorData) {
    console.log('🏥 Doctor Model: Creating doctor...');
    console.log('📝 Doctor data:', doctorData);
    
    const { userId, departmentId, experience, availableTime, qualification, consultationFee } = doctorData;
    const [result] = await pool.execute(
      'INSERT INTO doctors (user_id, department_id, experience, available_time, qualification, consultation_fee) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, departmentId, experience, availableTime, qualification, consultationFee]
    );
    
    console.log('✅ Doctor created with ID:', result.insertId);
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT d.*, u.name, u.email, dep.name as department_name 
      FROM doctors d 
      JOIN users u ON d.user_id = u.id 
      JOIN departments dep ON d.department_id = dep.id 
      ORDER BY u.name
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT d.*, u.name, u.email, dep.name as department_name 
      FROM doctors d 
      JOIN users u ON d.user_id = u.id 
      JOIN departments dep ON d.department_id = dep.id 
      WHERE d.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByUserId(userId) {
    const [rows] = await pool.execute(`
      SELECT d.*, u.name, u.email, dep.name as department_name 
      FROM doctors d 
      JOIN users u ON d.user_id = u.id 
      JOIN departments dep ON d.department_id = dep.id 
      WHERE d.user_id = ?
    `, [userId]);
    return rows[0];
  }

  static async update(id, doctorData) {
    const { departmentId, experience, available_time, qualification, consultation_fee, profile_image } = doctorData;
    const [result] = await pool.execute(
      'UPDATE doctors SET department_id = ?, experience = ?, available_time = ?, qualification = ?, consultation_fee = ?, profile_image = ? WHERE id = ?',
      [departmentId, experience, available_time, qualification, consultation_fee, profile_image, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM doctors WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getAppointments(doctorId) {
    const [rows] = await pool.execute(`
      SELECT a.*, p.user_id as patient_user_id, u.name as patient_name, u.email as patient_email
      FROM appointments a 
      JOIN patients p ON a.patient_id = p.id 
      JOIN users u ON p.user_id = u.id 
      WHERE a.doctor_id = ? 
      ORDER BY a.appointment_date DESC
    `, [doctorId]);
    return rows;
  }

  static async getAvailableDoctors(departmentId = null) {
    let query = `
      SELECT d.*, u.name, u.email, dep.name as department_name 
      FROM doctors d 
      JOIN users u ON d.user_id = u.id 
      JOIN departments dep ON d.department_id = dep.id 
    `;
    let params = [];
    
    if (departmentId) {
      query += ' WHERE d.department_id = ?';
      params.push(departmentId);
    }
    
    query += ' ORDER BY u.name';
    
    const [rows] = await pool.execute(query, params);
    return rows;
  }
}

module.exports = Doctor;
