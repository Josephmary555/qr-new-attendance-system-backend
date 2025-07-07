const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const uploadMiddleware = require('../middleware/upload');
const { registerUser, importUsers } = require('../controllers/userController');

// Register a user (via link, no authentication required)
router.post('/register', registerUser);

// Import users from CSV/Excel (Super Admin or Event Admin)
router.post('/import', authMiddleware, roleMiddleware(['super_admin', 'event_admin']), uploadMiddleware, importUsers);

module.exports = router;