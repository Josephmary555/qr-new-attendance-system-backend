const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { registerAdmin, loginAdmin, getAdmins } = require('../controllers/adminController');

// Register a new admin (Super Admin only for assigning roles)
router.post('/register', authMiddleware, roleMiddleware(['super_admin']), registerAdmin);

// Login admin
router.post('/login', loginAdmin);

// Get all admins (Super Admin only)
router.get('/', authMiddleware, roleMiddleware(['super_admin']), getAdmins);

// backend/routes/adminRoutes.js
router.post('/register', authMiddleware, roleMiddleware(['super_admin']), async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const [existing] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO admins (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, role]
    );
    res.status(201).json({ message: 'Admin registered successfully', adminId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering admin', error: error.message });
  }
});

module.exports = router;