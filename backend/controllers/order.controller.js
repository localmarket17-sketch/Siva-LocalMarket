const db = require('../models/db');
const sendEmail = require('../utils/sendEmail');

const OrderController = {
  createOrder: (req, res) => {
    const { items, total_amount, payment_mode } = req.body;
    const user_id = req.user.id; // ✅ Get user_id from JWT

    if (!items || !total_amount || !payment_mode) {
      return res.status(400).json({ message: 'Missing order details' });
    }

    const orderSql = `
      INSERT INTO orders (user_id, total_amount, payment_mode, status)
      VALUES (?, ?, ?, 'pending')`;

    db.query(orderSql, [user_id, total_amount, payment_mode], (err, result) => {
      if (err) {
        console.error("Order creation failed:", err);
        return res.status(500).json({ message: 'Error creating order' });
      }

      const orderId = result.insertId;
      const values = items.map(item => [
        orderId,
        item.product_id,
        item.quantity,
        item.price
      ]);

      const itemSql = `
        INSERT INTO order_items (order_id, product_id, quantity, price)
        VALUES ?`;

      db.query(itemSql, [values], (itemErr) => {
        if (itemErr) {
          console.error("Item insert failed:", itemErr);
          return res.status(500).json({ message: 'Order placed but item error' });
        }

        const userSql = `SELECT name, email FROM users WHERE id = ?`;
        db.query(userSql, [user_id], async (userErr, userResult) => {
          if (userErr || userResult.length === 0) {
            console.error("Failed to fetch user for email:", userErr);
            return res.status(201).json({ message: 'Order placed, but email not sent', orderId });
          }

          const { name, email } = userResult[0];

          try {
            await sendEmail(
              email,
              `Order Confirmation - Order #${orderId}`,
              `<p>Hi ${name},</p>
              <p>Your order <strong>#${orderId}</strong> has been successfully placed.</p>
              <p>We’ll notify you once it is shipped.</p>`
            );
            console.log("✅ Email sent to", email);
          } catch (emailErr) {
            console.error("❌ Failed to send confirmation email:", emailErr);
          }

          res.status(201).json({ message: 'Order placed successfully', orderId });
        });
      });
    });
  },

  getUserOrders: (req, res) => {
    const userId = req.params.user_id;

    // ✅ Security check
    if (req.user.role !== 'admin' && req.user.id != userId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const sql = `
    SELECT 
      o.id AS order_id, 
      o.total_amount, 
      o.payment_mode,
      o.status, 
      o.created_at,
      oi.product_id, 
      oi.quantity, 
      p.title, 
      p.price, 
      p.image
    FROM orders o
    LEFT JOIN order_items oi ON o.id = oi.order_id
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE o.user_id = ?
    ORDER BY o.created_at DESC
  `;

    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to fetch orders" });
      }

      // ✅ Group results by order_id
      const ordersMap = {};
      results.forEach(row => {
        if (!ordersMap[row.order_id]) {
          ordersMap[row.order_id] = {
            id: row.order_id,
            total_amount: row.total_amount,
            payment_mode: row.payment_mode,
            status: row.status,
            created_at: row.created_at,
            items: []
          };
        }
        if (row.product_id) { // if order has items
          ordersMap[row.order_id].items.push({
            product_id: row.product_id,
            title: row.title,
            price: row.price,
            quantity: row.quantity,
            image: row.image   // ✅ fixed here
          });
        }
      });

      const orders = Object.values(ordersMap);
      res.json(orders);
    });
  },



  updateOrderStatus: (req, res) => {
    const { order_id, status } = req.body;

    const updateSql = `UPDATE orders SET status = ? WHERE id = ?`;
    db.query(updateSql, [status, order_id], (err) => {
      if (err) {
        console.error("Failed to update status:", err);
        return res.status(500).json({ message: 'Failed to update order status' });
      }

      const userSql = `
        SELECT u.name, u.email FROM users u
        JOIN orders o ON u.id = o.user_id
        WHERE o.id = ?`;

      db.query(userSql, [order_id], async (userErr, userResult) => {
        if (userErr || userResult.length === 0) {
          console.error("Failed to fetch user for status email:", userErr);
          return res.status(200).json({ message: 'Status updated, but email not sent' });
        }

        const { name, email } = userResult[0];

        try {
          await sendEmail(
            email,
            `Order #${order_id} Status Update`,
            `<p>Hi ${name},</p>
             <p>Your order <strong>#${order_id}</strong> status has been updated to: <strong>${status.toUpperCase()}</strong>.</p>`
          );
          console.log(`✅ Status email sent to ${email}`);
        } catch (emailErr) {
          console.error("❌ Failed to send status email:", emailErr);
        }

        res.status(200).json({ message: 'Order status updated and email sent' });
      });
    });
  }
};

module.exports = OrderController;
