const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    console.log(' User Model: Creating user...');
    console.log(' User data:', { ...userData, password: '[HIDDEN]' });
    
    const { name, email, password, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log(' Password hashed successfully');
    
    const [result] = await pool.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );
    
    console.log(' User created with ID:', result.insertId);
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0];
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getAll() {
    const [rows] = await pool.execute(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    return rows;
  }

  static async update(id, userData) {
    const { name, email, profile_image } = userData;
    const [result] = await pool.execute(
      'UPDATE users SET name = ?, email = ?, profile_image = ? WHERE id = ?',
      [name, email, profile_image, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await pool.execute(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.affectedRows > 0;
  }
}

module.exports = User;
