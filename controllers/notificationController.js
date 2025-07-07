const pool = require('../config/db');
const transporter = require('../config/email');

const sendRegistrationEmail = async (req, res) => {
  const { userId, eventId, qrData } = req.body;
  try {
    const [user] = await pool.query('SELECT name, email FROM users WHERE id = ?', [userId]);
    const [event] = await pool.query('SELECT purpose FROM events WHERE id = ?', [eventId]);
    if (!user.length || !event.length) {
      return res.status(400).json({ message: 'User or event not found' });
    }
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user[0].email,
      subject: `Registration Confirmation for ${event[0].purpose}`,
      text: `Dear ${user[0].name},\n\nYou have successfully registered for ${event[0].purpose}. Your QR code data is: ${qrData}\n\nPlease present this QR code at the event.`,
    };
    await transporter.sendMail(mailOptions);
    await pool.query(
      'INSERT INTO notification_logs (user_id, event_id, type, status) VALUES (?, ?, ?, ?)',
      [userId, eventId, 'registration', 'sent']
    );
    res.json({ message: 'Registration email sent' });
  } catch (error) {
    await pool.query(
      'INSERT INTO notification_logs (user_id, event_id, type, status) VALUES (?, ?, ?, ?)',
      [userId, eventId, 'registration', 'failed']
    );
    res.status(500).json({ message: 'Error (registration email)', error: error.message });
  }
};

const sendAttendanceEmail = async (req, res) => {
  const { userId, eventId } = req.body;
  try {
    const [user] = await pool.query('SELECT name, email FROM users WHERE id = ?', [userId]);
    const [event] = await pool.query('SELECT purpose FROM events WHERE id = ?', [eventId]);
    if (!user.length || !event.length) {
      return res.status(400).json({ message: 'User or event not found' });
    }
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user[0].email,
      subject: `Attendance Recorded for ${event[0].purpose}`,
      text: `Dear ${user[0].name},\n\nYour attendance for ${event[0].purpose} has been recorded on ${new Date().toLocaleString()}.`,
    };
    await transporter.sendMail(mailOptions);
    await pool.query(
      'INSERT INTO notification_logs (user_id, event_id, type, status) VALUES (?, ?, ?, ?)',
      [userId, eventId, 'attendance', 'sent']
    );
    res.json({ message: 'Attendance email sent' });
  } catch (error) {
    await pool.query(
      'INSERT INTO notification_logs (user_id, event_id, type, status) VALUES (?, ?, ?, ?)',
      [userId, eventId, 'attendance', 'failed']
    );
    res.status(500).json({ message: 'Error sending attendance email', error: error.message });
  }
};

module.exports = { sendRegistrationEmail, sendAttendanceEmail };