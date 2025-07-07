const pool = require('../config/db');

const createEvent = async (req, res) => {
  const { purpose } = req.body;
  const adminId = req.user.id;
  try {
    const [result] = await pool.query(
      'INSERT INTO events (purpose, admin_id) VALUES (?, ?)',
      [purpose, adminId]
    );
    res.status(201).json({ message: 'Event created', eventId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
};

const getEvents = async (req, res) => {
  const adminId = req.user.id;
  const role = req.user.role;
  try {
    let query = 'SELECT id, purpose, admin_id, created_at FROM events';
    let params = [];
    if (role === 'event_admin') {
      query += ' WHERE admin_id = ?';
      params.push(adminId);
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
};

module.exports = { createEvent, getEvents };