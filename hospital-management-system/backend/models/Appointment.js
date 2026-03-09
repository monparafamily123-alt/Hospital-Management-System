const pool = require('../config/database');

class Appointment {
  static async create(appointmentData) {
    console.log('📅 Appointment Model: Creating appointment...');
    console.log('📝 Appointment data:', appointmentData);
    
    const { patientId, doctorId, appointmentDate, symptoms } = appointmentData;
    const [result] = await pool.execute(
      'INSERT INTO appointments (patient_id, doctor_id, appointment_date, symptoms) VALUES (?, ?, ?, ?)',
      [patientId, doctorId, appointmentDate, symptoms]
    );
    
    console.log('✅ Appointment created with ID:', result.insertId);
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.execute(`
      SELECT a.*, 
             DATE(a.appointment_date) as appointment_date,
             TIME_FORMAT(a.appointment_date, '%H:%i:%s') as appointment_time,
             p.user_id as patient_user_id, pu.name as patient_name, pu.email as patient_email,
             d.user_id as doctor_user_id, du.name as doctor_name, du.email as doctor_email,
             dep.name as department_name 
      FROM appointments a 
      JOIN patients p ON a.patient_id = p.id 
      JOIN users pu ON p.user_id = pu.id 
      JOIN doctors d ON a.doctor_id = d.id 
      JOIN users du ON d.user_id = du.id 
      JOIN departments dep ON d.department_id = dep.id 
      ORDER BY a.appointment_date DESC
    `);
    
    // Format date and time properly
    const formattedRows = rows.map(row => ({
      ...row,
      appointment_date: row.appointment_date,
      appointment_time: row.appointment_time || 'Not specified'
    }));
    
    return formattedRows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(`
      SELECT a.*, 
             DATE(a.appointment_date) as appointment_date,
             TIME_FORMAT(a.appointment_date, '%H:%i:%s') as appointment_time,
             p.user_id as patient_user_id, pu.name as patient_name, pu.email as patient_email,
             d.user_id as doctor_user_id, du.name as doctor_name, du.email as doctor_email,
             dep.name as department_name
      FROM appointments a 
      JOIN patients p ON a.patient_id = p.id 
      JOIN users pu ON p.user_id = pu.id 
      JOIN doctors d ON a.doctor_id = d.id 
      JOIN users du ON d.user_id = du.id 
      JOIN departments dep ON d.department_id = dep.id 
      WHERE a.id = ?
    `, [id]);
    return rows[0];
  }

  static async updateStatus(id, status) {
    const [result] = await pool.execute(
      'UPDATE appointments SET status = ? WHERE id = ?',
      [status, id]
    );
    return result.affectedRows > 0;
  }

  static async updatePrescription(id, prescription) {
    const [result] = await pool.execute(
      'UPDATE appointments SET prescription = ? WHERE id = ?',
      [prescription, id]
    );
    return result.affectedRows > 0;
  }

  static async getByDoctorId(doctorId) {
    console.log('📅 Getting appointments for doctor ID:', doctorId);
    
    const [rows] = await pool.execute(`
      SELECT a.*, 
             DATE(a.appointment_date) as appointment_date,
             TIME_FORMAT(a.appointment_date, '%H:%i:%s') as appointment_time,
             p.user_id as patient_user_id, 
             u.name as patient_name, 
             u.email as patient_email
      FROM appointments a 
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      WHERE a.doctor_id = ? 
      ORDER BY a.appointment_date DESC
    `, [doctorId]);
    
    console.log('📊 Raw appointments from DB:', rows);
    
    // Format date and time properly
    const formattedRows = rows.map(row => {
      console.log('🔍 Processing row:', row);
      return {
        ...row,
        appointment_date: row.appointment_date,
        appointment_time: row.appointment_time || 'Not specified'
      };
    });
    
    console.log('✅ Formatted appointments:', formattedRows);
    return formattedRows;
  }

  static async markCompleted(id) {
    const [result] = await pool.execute(
      'UPDATE appointments SET status = ? WHERE id = ?',
      ['completed', id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM appointments WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getByPatientId(patientId) {
    const [rows] = await pool.execute(`
      SELECT a.*, 
             DATE(a.appointment_date) as appointment_date,
             TIME_FORMAT(a.appointment_date, '%H:%i:%s') as appointment_time,
             d.user_id as doctor_user_id, u.name as doctor_name, dep.name as department_name
      FROM appointments a 
      JOIN doctors d ON a.doctor_id = d.id 
      JOIN users u ON d.user_id = u.id 
      JOIN departments dep ON d.department_id = dep.id 
      WHERE a.patient_id = ?
      ORDER BY a.appointment_date DESC
    `, [patientId]);
    
    // Format date and time properly
    const formattedRows = rows.map(row => ({
      ...row,
      appointment_date: row.appointment_date,
      appointment_time: row.appointment_time || 'Not specified'
    }));
    
    return formattedRows;
  }

  static async getByStatus(status) {
    const [rows] = await pool.execute(`
      SELECT a.*, 
             p.user_id as patient_user_id, pu.name as patient_name, pu.email as patient_email,
             d.user_id as doctor_user_id, du.name as doctor_name, du.email as doctor_email,
             dep.name as department_name
      FROM appointments a 
      JOIN patients p ON a.patient_id = p.id 
      JOIN users pu ON p.user_id = pu.id 
      JOIN doctors d ON a.doctor_id = d.id 
      JOIN users du ON d.user_id = du.id 
      JOIN departments dep ON d.department_id = dep.id 
      WHERE a.status = ? 
      ORDER BY a.appointment_date DESC
    `, [status]);
    return rows;
  }
}

module.exports = Appointment;
