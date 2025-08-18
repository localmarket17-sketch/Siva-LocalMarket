const db = require('../models/db');

const DeliveryController = {
  //For Dashboard
  getDashboardStats: (req, res) => {
    const deliveryBoyId = req.params.id;

    const sql = `
      SELECT 
        SUM(CASE WHEN status IN ('Pending', 'Shipped') THEN 1 ELSE 0 END) AS totalAssigned,
        SUM(CASE WHEN status = 'Shipped' THEN 1 ELSE 0 END) AS outForDelivery,
        SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) AS delivered
      FROM orders
      WHERE delivery_boy_id = ?
    `;

    db.query(sql, [deliveryBoyId], (err, results) => {
      if (err) {
        console.error('Dashboard fetch error:', err);
        return res.status(500).json({ message: 'Error fetching dashboard stats' });
      }
      res.json(results[0] || { totalAssigned: 0, outForDelivery: 0, delivered: 0 });
    });
  },

  //For Assigned-Orders
  getAssignedOrders: (req, res) => {
    const deliveryId = req.params.id;
    const sql = `
      SELECT o.id, o.status, o.total_amount, u.name AS customer_name, u.address AS customer_address, u.mobile AS customer_phone
      FROM orders o
      JOIN users u ON o.user_id = u.id
      WHERE o.delivery_boy_id = ?
      ORDER BY o.id DESC
    `;
    db.query(sql, [deliveryId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching orders' });
      res.json(results);
    });
  },

  updateOrderStatus: (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;
    const sql = `UPDATE orders SET status = ? WHERE id = ?`;
    db.query(sql, [status, orderId], (err) => {
      if (err) return res.status(500).json({ message: 'Error updating status' });
      res.json({ message: 'Status updated successfully' });
    });
  },

  //For Sales-Reports
  getSalesReports: (req, res) => {
    const deliveryBoyId = req.user.id;

    const sql = `
    SELECT 
      DATE(created_at) AS date,
      COUNT(*) AS total_deliveries
    FROM orders
    WHERE delivery_boy_id = ? AND status = 'Delivered'
    GROUP BY DATE(created_at)
    ORDER BY DATE(created_at) DESC
  `;

    db.query(sql, [deliveryBoyId], (err, results) => {
      if (err) {
        console.error("Sales Report SQL Error:", err); // Helpful for debugging
        return res.status(500).json({ message: 'Error fetching sales reports' });
      }
      res.json(results);
    });
  },

  //For Notifications
  getNotifications: (req, res) => {
    const deliveryBoyId = req.user.id;

    const sql = `
    SELECT id, title, message, is_read, created_at
    FROM notifications
    WHERE role = 'deliveryboy' AND user_id = ?
    ORDER BY created_at DESC
  `;

    db.query(sql, [deliveryBoyId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching notifications' });
      res.json(results);
    });
  },

  //For Profile
  getProfile: (req, res) => {
    const deliveryBoyId = req.user.id;

    const sql = `
    SELECT id, name, email, mobile
    FROM users
    WHERE id = ? AND role_id = (SELECT id FROM roles WHERE name = 'delivery')
  `;

    db.query(sql, [deliveryBoyId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching profile' });
      if (results.length === 0) return res.status(404).json({ message: 'Profile not found' });

      res.json(results[0]);
    });
  },

  updateProfile: (req, res) => {
    const deliveryBoyId = req.user.id;
    const { name, email, phone } = req.body;

    const sql = `
    UPDATE users
    SET name = ?, email = ?, mobile = ?
    WHERE id = ? AND role_id = (SELECT id FROM roles WHERE name = 'delivery')
  `;

    db.query(sql, [name, email, phone, deliveryBoyId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error updating profile' });

      res.json({ message: 'Profile updated successfully' });
    });
  }

};

module.exports = DeliveryController;
