const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { exportReport } = require('../controllers/reportController');

// Export attendance report (PDF or Excel, Super Admin or Event Admin)
router.get('/export', authMiddleware, roleMiddleware(['super_admin', 'event_admin']), exportReport);

module.exports = router;