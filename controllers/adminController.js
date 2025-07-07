const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const registerAdmin = async (req, res) => {
  const { name, email, password, institution, role } = req.body;
  try {
    // Only super_admin can assign roles
    if (req.user && req.user.role !== 'super_admin' && role === 'super_admin') {
      return res.status(403).json({ message: 'Only Super Admins can assign Super Admin role' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admins (name, email, password, institution, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, institution, role || 'event_admin']
    );
    res.status(201).json({ message: 'Admin registered', adminId: result.insertId });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ message: 'Email already exists' });
    }
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [rows] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Admin not found' });
    }
    const admin = rows[0];
    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid password' });
    }
    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: admin.role });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

const getAdmins = async (req, res) => {
  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ message: 'Only Super Admins can view admins' });
  }
  try {
    const [rows] = await pool.query('SELECT id, name, email, institution, role FROM admins');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admins', error: error.message });
  }
};

module.exports = { registerAdmin, loginAdmin, getAdmins };