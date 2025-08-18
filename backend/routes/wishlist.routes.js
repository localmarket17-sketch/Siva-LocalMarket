const express = require('express');
const router = express.Router();
const db = require('../models/db'); // Your database connection

// ✅ Get wishlist items for a specific user by userId
router.get('/:userId', (req, res) => {
  const userId = req.params.userId;
  db.query(
    'SELECT p.id, p.title AS title, p.price, p.image AS image_url FROM wishlist w JOIN products p ON w.product_id = p.id WHERE w.user_id = ?',
    [userId],
    (err, results) => {
      if (err) {
        console.error('Error fetching wishlist:', err);
        return res.status(500).json({ error: 'Failed to fetch wishlist' });
      }
      res.json(results);
    }
  );
});

// ✅ Add to wishlist (use body: { userId, productId })
router.post('/', (req, res) => {
  const { userId, productId } = req.body;
  db.query(
    'INSERT IGNORE INTO wishlist (user_id, product_id) VALUES (?, ?)',
    [userId, productId],
    (err) => {
      if (err) {
        console.error('Error adding to wishlist:', err);
        return res.status(500).json({ error: 'Failed to add to wishlist' });
      }
      res.json({ success: true });
    }
  );
});

// ✅ Remove from wishlist
router.delete('/:userId/:productId', (req, res) => {
  const { userId, productId } = req.params;
  db.query(
    'DELETE FROM wishlist WHERE user_id = ? AND product_id = ?',
    [userId, productId],
    (err) => {
      if (err) {
        console.error('Error removing from wishlist:', err);
        return res.status(500).json({ error: 'Failed to remove from wishlist' });
      }
      res.json({ success: true });
    }
  );
});

module.exports = router;
