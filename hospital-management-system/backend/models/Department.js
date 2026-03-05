const pool = require('../config/database');

class Department {
  static async create(departmentData) {
    const { name, description } = departmentData;
    const [result] = await pool.execute(
      'INSERT INTO departments (name, description) VALUES (?, ?)',
      [name, description]
    );
    return result.insertId;
  }

  static async getAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM departments ORDER BY name'
    );
    return rows;
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM departments WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async update(id, departmentData) {
    const { name, description } = departmentData;
    const [result] = await pool.execute(
      'UPDATE departments SET name = ?, description = ? WHERE id = ?',
      [name, description, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM departments WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }

  static async getDoctorsCount(departmentId) {
    const [rows] = await pool.execute(
      'SELECT COUNT(*) as count FROM doctors WHERE department_id = ?',
      [departmentId]
    );
    return rows[0].count;
  }
}

module.exports = Department;
