const pool = require('../config/db');
const xlsx = require('xlsx');

const registerUser = async (req, res) => {
  const { name, email, eventId } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO users (name, email, event_id) VALUES (?, ?, ?)',
      [name, email, eventId]
    );
    res.status(201).json({ message: 'User registered', userId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

const importUsers = async (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const users = xlsx.utils.sheet_to_json(sheet);
    for (const user of users) {
      await pool.query(
        'INSERT INTO users (name, email, event_id) VALUES (?, ?, ?)',
        [user.name, user.email, user.eventId]
      );
    }
    res.status(201).json({ message: 'Users imported successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error importing users', error: error.message });
  }
};

module.exports = { registerUser, importUsers };