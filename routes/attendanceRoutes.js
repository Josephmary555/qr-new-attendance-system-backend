const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { recordAttendance, getAttendance } = require('../controllers/attendanceController');

// Record attendance (Super Admin or Event Admin)
router.post('/record', authMiddleware, roleMiddleware(['super_admin', 'event_admin']), recordAttendance);

// Get attendance records (Super Admin sees all, Event Admin sees own)
router.get('/', authMiddleware, roleMiddleware(['super_admin', 'event_admin']), getAttendance);

module.exports = router;