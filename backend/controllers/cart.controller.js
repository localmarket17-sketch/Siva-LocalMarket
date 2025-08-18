const db = require('../models/db');

const getCart = (req, res) => {
  const userId = req.user.id;
  const query = `
    SELECT c.id AS id, c.product_id, p.title, p.price, c.quantity, p.image
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
};

const addToCart = (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res.status(400).json({ message: 'Missing fields in request' });
  }

  const checkQuery = `SELECT * FROM cart WHERE user_id = ? AND product_id = ?`;
  db.query(checkQuery, [userId, productId], (err, results) => {
    if (err) return res.status(500).json({ message: 'DB error', error: err });

    if (results.length > 0) {
      const updateQuery = `UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?`;
      db.query(updateQuery, [quantity, userId, productId], (err) => {
        if (err) return res.status(500).json({ message: 'Update error', error: err });
        return res.status(200).json({ message: 'Cart updated' });
      });
    } else {
      const insertQuery = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`;
      db.query(insertQuery, [userId, productId, quantity], (err) => {
        if (err) return res.status(500).json({ message: 'Insert error', error: err });
        return res.status(200).json({ message: 'Product added to cart' });
      });
    }
  });
};

const updateCartItem = (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;
  const { quantity } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ message: 'Invalid quantity' });
  }

  const updateQuery = `UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?`;
  db.query(updateQuery, [quantity, itemId, userId], (err) => {
    if (err) return res.status(500).json({ message: 'Update error', error: err });
    return res.status(200).json({ message: 'Cart item updated' });
  });
};

const removeCartItem = (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.itemId;

  const deleteQuery = `DELETE FROM cart WHERE id = ? AND user_id = ?`;
  db.query(deleteQuery, [itemId, userId], (err) => {
    if (err) return res.status(500).json({ message: 'Delete error', error: err });
    return res.status(200).json({ message: 'Cart item removed' });
  });
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem
};
