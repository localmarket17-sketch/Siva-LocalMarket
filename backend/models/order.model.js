const db = require('./db');

const Order = {
  create: (order, callback) => {
    const sql = `
      INSERT INTO orders (user_id, shopkeeper_id, total_amount, payment_method, status, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      order.user_id,
      order.shopkeeper_id,
      order.total_amount,
      order.payment_method,
      order.status,
      order.address
    ], callback);
  },

  addOrderItems: (orderId, items, callback) => {
    const values = items.map(item => [orderId, item.product_id, item.quantity]);
    const sql = `
      INSERT INTO order_items (order_id, product_id, quantity)
      VALUES ?
    `;
    db.query(sql, [values], callback);
  },

  getByUser: (userId, callback) => {
    const sql = `
      SELECT o.*, GROUP_CONCAT(p.title SEPARATOR ', ') AS items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.user_id = ?
      GROUP BY o.id
    `;
    db.query(sql, [userId], callback);
  }
};

module.exports = Order;
