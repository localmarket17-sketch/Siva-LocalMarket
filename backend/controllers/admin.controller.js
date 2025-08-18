const db = require('../models/db');
const bcrypt = require('bcrypt');

const AdminController = {

  //For Dashboard
  getDashboardStats: (req, res) => {
    const sql = `
    SELECT 
      (SELECT COUNT(*) FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = 'customer') AS userCount,
      (SELECT COUNT(*) FROM products) AS productCount,
      (SELECT COUNT(*) FROM orders) AS orderCount,
      (SELECT COUNT(*) FROM users u JOIN roles r ON u.role_id = r.id WHERE r.name = 'vendor') AS vendorCount
  `;
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Dashboard stats error:', err); // helpful for debugging
        return res.status(500).json({ message: 'Error fetching stats' });
      }
      res.json(results[0]);
    });
  },

  getRecentOrders: (req, res) => {
    const sql = `
    SELECT o.id, o.total_amount, o.status, o.created_at, u.name AS customer_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
    LIMIT 5
  `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching recent orders' });
      res.json(results);
    });
  },

  //For Users
  getAllUsers: (req, res) => {
    const sql = `
    SELECT u.id, u.name, u.email, r.name AS role 
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE r.name = 'customer'
  `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching users', error: err });
      res.json(results);
    });
  },

  deleteUser: (req, res) => {
    const userId = req.params.id;
    const sql = 'DELETE FROM users WHERE id = ?';
    db.query(sql, [userId], (err) => {
      if (err) return res.status(500).json({ message: 'Error deleting user' });
      res.json({ message: 'User deleted successfully' });
    });
  },

  //For vendors
  getAllVendors: (req, res) => {
    const sql = `
    SELECT u.id, u.name, u.email, u.mobile AS phone, r.name
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE r.name = 'vendor'
  `;
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching vendors:', err);
        return res.status(500).json({ error: 'Failed to fetch vendors' });
      }
      res.json(results);
    });
  },

  deleteVendor: (req, res) => {
    const vendorId = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [vendorId], (err, result) => {
      if (err) {
        console.error('Error deleting vendor:', err);
        return res.status(500).json({ error: 'Failed to delete vendor' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Vendor not found' });
      }
      res.json({ message: 'Vendor deleted successfully' });
    });
  },

  //For Delivery-Boys
  getAllDeliveryBoys: (req, res) => {
    const sql = `
    SELECT u.id, u.name, u.email, u.mobile AS phone
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE r.name = 'delivery'
  `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ error: 'Error fetching delivery boys' });
      res.json(results);
    });
  },

  deleteDeliveryBoy: (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error deleting delivery boy' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Delivery boy deleted successfully' });
    });
  },

  //For Products
getAllProducts: (req, res) => {
  const sql = `
    SELECT 
      p.id,
      p.title,
      p.description,
      p.price,
      p.category_id,
      p.subcategory_id,
      p.image,
      c.name AS category, 
      sc.name AS subcategory, 
      i.quantity,
      GROUP_CONCAT(b.name) AS brands
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
    LEFT JOIN inventory i ON p.id = i.product_id
    LEFT JOIN product_brands pb ON p.id = pb.product_id
    LEFT JOIN brands b ON pb.brand_id = b.id
    GROUP BY 
      p.id,
      p.title,
      p.description,
      p.price,
      p.category_id,
      p.subcategory_id,
      p.image,
      c.name,
      sc.name,
      i.quantity
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return res.status(500).json({ message: 'Failed to fetch products', error: err });
    }
    res.json(results);
  });
},



  deleteProduct: (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to delete product', details: err });
      res.status(200).json({ message: 'Product deleted successfully' });
    });
  },

  //For Orders
  getAllOrders: (req, res) => {
    const sql = `
    SELECT 
      o.id, 
      o.user_id, 
      u.name AS customer_name, 
      o.total_amount, 
      o.payment_mode, 
      o.status, 
      o.created_at, 
      o.delivery_boy_id, 
      db.name AS delivery_boy_name
    FROM orders o
    JOIN users u ON o.user_id = u.id
    LEFT JOIN users db ON o.delivery_boy_id = db.id
    ORDER BY o.created_at DESC
  `;

    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching orders' });
      res.json(results);
    });
  },

  assignDeliveryBoy: (req, res) => {
    const { orderId, deliveryBoyId } = req.body;
    if (!orderId || !deliveryBoyId) {
      return res.status(400).json({ message: 'Missing orderId or deliveryBoyId' });
    }

    const sql = `UPDATE orders SET delivery_boy_id = ?, status = 'Assigned' WHERE id = ?`;
    db.query(sql, [deliveryBoyId, orderId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error assigning delivery boy' });
      res.json({ message: 'Delivery boy assigned successfully' });
    });
  },

  //For Inventory
  getInventory: (req, res) => {
    const query = `
    SELECT 
      i.id,
      i.product_id, 
      p.title AS product_name, 
      i.quantity,
      CASE 
        WHEN i.quantity > 0 THEN 'In Stock' 
        ELSE 'Out of Stock' 
      END AS status
    FROM inventory i 
    JOIN products p ON i.product_id = p.id
  `;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching inventory:', err);
        return res.status(500).json({ message: 'Server error while fetching inventory' });
      }
      res.status(200).json(results);
    });
  },

  addInventory: (req, res) => {
    const { product_id, quantity } = req.body;
    const query = `INSERT INTO inventory (product_id, quantity) VALUES (?, ?)`;

    db.query(query, [product_id, quantity], (err, result) => {
      if (err) {
        console.error('Error adding inventory:', err);
        return res.status(500).json({ message: 'Server error while adding inventory' });
      }
      res.status(201).json({ message: 'Inventory added successfully' });
    });
  },

  updateInventory: (req, res) => {
    const inventoryId = req.params.id;
    const { product_id, quantity } = req.body;
    const query = `UPDATE inventory SET product_id = ?, quantity = ? WHERE id = ?`;

    db.query(query, [product_id, quantity, inventoryId], (err, result) => {
      if (err) {
        console.error('Error updating inventory:', err);
        return res.status(500).json({ message: 'Server error while updating inventory' });
      }
      res.status(200).json({ message: 'Inventory updated successfully' });
    });
  },

  deleteInventory: (req, res) => {
    const inventoryId = req.params.id;
    const query = `DELETE FROM inventory WHERE id = ?`;

    db.query(query, [inventoryId], (err, result) => {
      if (err) {
        console.error('Error deleting inventory:', err);
        return res.status(500).json({ message: 'Server error while deleting inventory' });
      }
      res.status(200).json({ message: 'Inventory deleted successfully' });
    });
  },

  //For Sales-Report
  getSalesReport: (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { customer, startDate, endDate } = req.query;

    let conditions = [];
    let params = [];

    if (customer) {
      conditions.push("u.name LIKE ?");
      params.push(`%${customer}%`);
    }

    if (startDate && endDate) {
      conditions.push("DATE(o.created_at) BETWEEN ? AND ?");
      params.push(startDate, endDate);
    }

    let whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : '';

    const dataQuery = `
    SELECT o.id AS order_id, u.name AS customer_name, o.created_at AS order_date,
           GROUP_CONCAT(p.title SEPARATOR ', ') AS items, o.total_amount
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    ${whereClause}
    GROUP BY o.id
    ORDER BY o.created_at DESC
    LIMIT ? OFFSET ?
  `;

    const summaryQuery = `
    SELECT COUNT(DISTINCT o.id) AS totalOrders, 
           IFNULL(SUM(o.total_amount), 0) AS totalRevenue
    FROM orders o
    JOIN users u ON o.user_id = u.id
    ${whereClause}
  `;

    db.query(dataQuery, [...params, limit, offset], (err, results) => {
      if (err) {
        console.error("Error fetching sales data:", err);
        return res.status(500).json({ message: "Error fetching sales data" });
      }

      db.query(summaryQuery, params, (sumErr, summary) => {
        if (sumErr) {
          console.error("Error fetching sales summary:", sumErr);
          return res.status(500).json({ message: "Error fetching summary" });
        }

        res.json({
          data: results,
          summary: summary[0],
          page,
          limit,
        });
      });
    });
  },

  exportSalesReport: (req, res) => {
    const { customer, startDate, endDate } = req.query;

    let conditions = [];
    let params = [];

    if (customer) {
      conditions.push("u.name LIKE ?");
      params.push(`%${customer}%`);
    }

    if (startDate && endDate) {
      conditions.push("DATE(o.created_at) BETWEEN ? AND ?");
      params.push(startDate, endDate);
    }

    let whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : '';

    const sql = `
    SELECT o.id AS order_id, u.name AS customer_name, o.created_at AS order_date,
           GROUP_CONCAT(p.title SEPARATOR ', ') AS items, o.total_amount
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    ${whereClause}
    GROUP BY o.id
    ORDER BY o.created_at DESC
  `;

    db.query(sql, params, (err, results) => {
      if (err) {
        console.error('Error exporting sales report:', err);
        return res.status(500).json({ message: 'Failed to export sales report' });
      }

      try {
        const { Parser } = require('json2csv');
        const fields = ['order_id', 'customer_name', 'order_date', 'items', 'total_amount'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(results);

        res.header('Content-Type', 'text/csv');
        res.attachment('sales_report.csv');
        return res.send(csv);
      } catch (csvErr) {
        console.error('Error generating CSV:', csvErr);
        return res.status(500).json({ message: 'Error generating CSV' });
      }
    });
  },

  //For Notifications
  getNotifications: (req, res) => {
    const sql = `SELECT * FROM notifications ORDER BY created_at DESC`;
    db.query(sql, (err, results) => {
      if (err) {
        console.error('Error fetching notifications:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      res.status(200).json(results);
    });
  },

  markNotificationAsRead: (req, res) => {
    const notificationId = req.params.id;

    const sql = `UPDATE notifications SET is_read = 1 WHERE id = ?`;

    db.query(sql, [notificationId], (err, result) => {
      if (err) {
        console.error('Error marking notification as read:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      res.status(200).json({ message: 'Notification marked as read' });
    });
  },

  //For Profile
  getProfile: (req, res) => {
    const userId = req.user.id;

    const sql = `
    SELECT u.id, u.name, u.email, u.mobile, u.address, r.name AS role
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `;

    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Error fetching profile:', err);
        return res.status(500).json({ message: 'Server error' });
      }
      if (results.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(results[0]);
    });
  },

  updateProfile: async (req, res) => {
    const userId = req.user.id;
    const { name, email, mobile, password, newPassword } = req.body;

    try {
      const getUserSql = 'SELECT password FROM users WHERE id = ?';
      db.query(getUserSql, [userId], async (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });

        if (password) {
          const isMatch = await bcrypt.compare(password, results[0].password);
          if (!isMatch) return res.status(401).json({ error: 'Current password incorrect' });
        }

        const updates = [name, email, mobile];
        let query = 'UPDATE users SET name = ?, email = ?, mobile = ?';

        if (newPassword && newPassword.trim() !== '') {
          const hashed = await bcrypt.hash(newPassword, 10);
          query += ', password = ?';
          updates.push(hashed);
        }

        query += ' WHERE id = ?';
        updates.push(userId);

        db.query(query, updates, (err) => {
          if (err) return res.status(500).json({ error: 'Update failed' });
          res.json({ message: 'Profile updated successfully' });
        });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Server error' });
    }
  }

};

module.exports = AdminController;
