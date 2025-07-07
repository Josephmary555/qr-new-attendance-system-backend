const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middleware/auth');
const { createEvent, getEvents } = require('../controllers/eventController');

// Create a new event (Super Admin or Event Admin)
router.post('/create', authMiddleware, roleMiddleware(['super_admin', 'event_admin']), createEvent);

// Get events (Super Admin sees all, Event Admin sees own)
router.get('/', authMiddleware, roleMiddleware(['super_admin', 'event_admin']), getEvents);

module.exports = router;