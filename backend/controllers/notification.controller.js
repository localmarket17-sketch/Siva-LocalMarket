const db = require('../models/db');

const NotificationController = {
  sendNotification: (req, res) => {
    const { user_id, message, type } = req.body;
    const sql = `INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)`;

    db.query(sql, [user_id, message, type], (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to send notification' });
      res.status(201).json({ message: 'Notification sent' });
    });
  },

  getNotifications: (req, res) => {
    const userId = req.params.user_id;
    const sql = `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`;

    db.query(sql, [userId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Failed to get notifications' });
      res.json(results);
    });
  }
};

module.exports = NotificationController;
