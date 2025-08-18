const db = require('../models/db');

const UserController = {
  getProfile: (req, res) => {
    const userId = req.user.id;
    const sql = `
    SELECT u.id, u.name, u.email, u.mobile, r.name AS role, u.address
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `;
    db.query(sql, [userId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching profile' });
      res.json(results[0]);
    });
  },

  updateProfile: (req, res) => {
    const userId = req.user.id;
    const { name, email } = req.body;
    const sql = 'UPDATE users SET name = ?, email = ? WHERE id = ?';
    db.query(sql, [name, email, userId], (err) => {
      if (err) return res.status(500).json({ message: 'Profile update failed' });
      res.json({ message: 'Profile updated successfully' });
    });
  },

  deleteProfile: (req, res) => {
    const userId = req.user.id;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [userId], (err) => {
      if (err) return res.status(500).json({ message: 'Failed to delete account' });
      res.json({ message: 'Account deleted successfully' });
    });
  },

  getCart: (req, res) => {
    const userId = req.user.id;
    const query = `
    SELECT c.id AS id, c.product_id, p.title, p.price, c.quantity
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
    db.query(query, [userId], (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'DB error', error: err });
      }
      return res.status(200).json(results);
    });
  },

  getAddresses: (req, res) => {
    const userId = req.user.id;
    const sql = 'SELECT id, name AS full_name, mobile AS phone, address FROM users WHERE id = ?';
    db.query(sql, [userId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching address' });
      if (results.length === 0) return res.status(404).json({ message: 'User not found' });

      res.json({
        id: results[0].id,
        full_name: results[0].full_name,
        phone: results[0].phone,
        address: results[0].address,
      });
    });
  }

};

module.exports = UserController;
