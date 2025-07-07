const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { sendRegistrationEmail, sendAttendanceEmail } = require('../controllers/notificationController');

// Send registration email (Super Admin or Event Admin)
router.post('/registration', authMiddleware, roleMiddleware(['super_admin', 'event_admin']), sendRegistrationEmail);

// Send attendance email (Super Admin or Event Admin)
router.post('/attendance', authMiddleware, roleMiddleware(['super_admin', 'event_admin']), sendAttendanceEmail);

// backend/routes/notificationRoutes.js (add to existing)
router.get('/', authMiddleware, roleMiddleware(['super_admin', 'event_admin']), async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM notification_logs');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
});


module.exports = router;