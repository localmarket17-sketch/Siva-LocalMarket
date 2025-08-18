const db = require('../models/db');

const VendorController = {
  //For Dashboard
  getDashboardStats: (req, res) => {
    const vendorId = req.user.id;

    const stats = {
      products: 0,
      orders: 0,
      revenue: 0,
      sales: 0,
      name: req.user.name
    };

    const queries = [
      {
        sql: `SELECT COUNT(*) AS count FROM products p 
            JOIN inventory i ON p.id = i.product_id 
            WHERE i.shopkeeper_id = ?`,
        field: 'products'
      },
      {
        sql: `SELECT COUNT(DISTINCT o.id) AS count 
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            JOIN inventory i ON p.id = i.product_id
            WHERE i.shopkeeper_id = ?`,
        field: 'orders'
      },
      {
        sql: `SELECT COUNT(oi.id) AS count, 
                   SUM(oi.quantity * oi.price) AS revenue 
            FROM orders o
            JOIN order_items oi ON o.id = oi.order_id
            JOIN products p ON oi.product_id = p.id
            JOIN inventory i ON p.id = i.product_id
            WHERE i.shopkeeper_id = ?`,
        field: 'sales'
      }
    ];

    let completed = 0;

    queries.forEach((q) => {
      db.query(q.sql, [vendorId], (err, result) => {
        if (!err && result.length > 0) {
          if (q.field === 'sales') {
            stats.sales = result[0].count || 0;
            stats.revenue = result[0].revenue || 0;
          } else {
            stats[q.field] = result[0].count || 0;
          }
        }

        completed++;
        if (completed === queries.length) {
          res.json(stats);
        }
      });
    });
  },

  //For Products
  getProductsForLoggedInVendor: (req, res) => {
    const vendorId = req.user.id;
    const sql = `
    SELECT p.*, i.quantity AS stock 
    FROM products p 
    JOIN inventory i ON p.id = i.product_id 
    WHERE i.shopkeeper_id = ?
  `;
    db.query(sql, [vendorId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching products' });
      res.json(results);
    });
  },

  updateProduct: (req, res) => {
    const productId = req.params.id;
    const {
      title,
      description,
      price,
      category_id,
      subcategory_id,
      brand_ids,
      stock,
      image
    } = req.body;

    const vendorId = req.user.id; // assuming vendor id from auth

    if (
      !title ||
      !description ||
      !price ||
      !category_id ||
      !subcategory_id ||
      !brand_ids ||
      brand_ids.length === 0 ||
      !stock
    ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Step 1: Update products table (including image if provided)
    const updateProductSql = `
    UPDATE products
    SET title = ?, description = ?, price = ?, category_id = ?, subcategory_id = ?, image = ?
    WHERE id = ?
  `;

    db.query(
      updateProductSql,
      [title, description, price, category_id, subcategory_id, image || null, productId],
      (err) => {
        if (err) {
          console.error('Error updating product:', err);
          return res.status(500).json({ message: 'Error updating product' });
        }

        // Step 2: Update product_brands (many-to-many)
        // Delete old brand links
        const deleteProductBrandsSql = `DELETE FROM product_brands WHERE product_id = ?`;
        db.query(deleteProductBrandsSql, [productId], (err2) => {
          if (err2) {
            console.error('Error deleting old product brands:', err2);
            return res.status(500).json({ message: 'Error updating product brands' });
          }

          // Insert new brand links
          const productBrandValues = brand_ids.map(brandId => [productId, brandId]);
          const insertProductBrandsSql = `
          INSERT INTO product_brands (product_id, brand_id) VALUES ?
        `;

          db.query(insertProductBrandsSql, [productBrandValues], (err3) => {
            if (err3) {
              console.error('Error inserting product brands:', err3);
              return res.status(500).json({ message: 'Error updating product brands' });
            }

            // Step 3: Update inventory quantity for this vendor
            const updateInventorySql = `
            UPDATE inventory
            SET quantity = ?
            WHERE product_id = ? AND shopkeeper_id = ?
          `;

            db.query(updateInventorySql, [stock, productId, vendorId], (err4) => {
              if (err4) {
                console.error('Error updating inventory:', err4);
                return res.status(500).json({ message: 'Error updating inventory' });
              }

              res.json({ message: 'Product updated successfully' });
            });
          });
        });
      }
    );
  },

  addProduct: (req, res) => {
    const {
      title, description, price,
      category_id, subcategory_id, brand_ids, stock, image
    } = req.body;

    const vendorId = req.user.id;

    // Validation
    if (!title || !description || !price || !category_id || !subcategory_id || !brand_ids || brand_ids.length === 0 || !stock || !image) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Step 1: Insert into products table (without brand_id)
    const insertProductSql = `
    INSERT INTO products (title, description, price, category_id, subcategory_id, image)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    db.query(insertProductSql, [title, description, price, category_id, subcategory_id, image], (err, result) => {
      if (err) {
        console.error('Error inserting product:', err);
        return res.status(500).json({ message: 'Error adding product' });
      }

      const productId = result.insertId;

      // Step 2: Insert multiple brands into product_brands
      const productBrandValues = brand_ids.map(brandId => [productId, brandId]);
      const insertProductBrandsSql = `
      INSERT INTO product_brands (product_id, brand_id) VALUES ?
    `;

      db.query(insertProductBrandsSql, [productBrandValues], (err2) => {
        if (err2) {
          console.error('Error inserting product brands:', err2);
          return res.status(500).json({ message: 'Error adding product brands' });
        }

        // Step 3: Insert into inventory
        const insertInventorySql = `
        INSERT INTO inventory (product_id, shopkeeper_id, quantity)
        VALUES (?, ?, ?)
      `;

        db.query(insertInventorySql, [productId, vendorId, stock], (err3) => {
          if (err3) {
            console.error('Error inserting inventory:', err3);
            return res.status(500).json({ message: 'Error updating inventory' });
          }

          res.json({ message: 'Product added successfully' });
        });
      });
    });
  },



  deleteProduct: (req, res) => {
    const productId = req.params.id;

    const sql = 'DELETE FROM products WHERE id = ?';

    db.query(sql, [productId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error deleting product' });
      res.json({ message: 'Product deleted successfully' });
    });
  },

  updateInventory: (req, res) => {
    const { stock } = req.body;
    const productId = req.params.id;
    const sql = 'UPDATE inventory SET quantity = ? WHERE product_id = ?';
    db.query(sql, [stock, productId], (err) => {
      if (err) return res.status(500).json({ message: 'Error updating stock' });
      res.json({ message: 'Stock updated' });
    });
  },

  //For Orders
  getOrdersForVendor: (req, res) => {
    const vendorId = req.user.id;
    const sql = `
    SELECT o.id AS order_id, u.name AS customer_name, p.title AS product_name,
           oi.quantity, oi.price AS total_price, o.status
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN order_items oi ON o.id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    JOIN inventory i ON p.id = i.product_id
    WHERE i.shopkeeper_id = ?
    ORDER BY o.created_at DESC
  `;

    db.query(sql, [vendorId], (err, results) => {
      if (err) {
        console.error('Error fetching vendor orders:', err);
        return res.status(500).json({ message: 'Error fetching orders' });
      }
      res.json(results);
    });
  },

  updateOrderStatus: (req, res) => {
    const orderId = req.params.id;
    const { status } = req.body;

    const sql = 'UPDATE orders SET status = ? WHERE id = ?';

    db.query(sql, [status, orderId], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error updating order status' });
      res.json({ message: 'Order status updated successfully' });
    });
  },

  //For Reports
  getSalesReportForVendor: (req, res) => {
    const vendorId = req.user.id;
    const sql = `
    SELECT 
      p.id AS product_id,
      p.title AS productName,
      SUM(oi.quantity) AS totalQuantity,
      SUM(oi.quantity * oi.price) AS totalSales
    FROM products p
    JOIN order_items oi ON p.id = oi.product_id
    JOIN orders o ON oi.order_id = o.id
    JOIN inventory i ON p.id = i.product_id
    WHERE i.shopkeeper_id = ?
    GROUP BY p.id, p.title
    ORDER BY totalSales DESC
  `;

    db.query(sql, [vendorId], (err, results) => {
      if (err) {
        console.error('Error fetching sales report:', err);
        return res.status(500).json({ message: 'Error fetching sales report' });
      }
      res.json(results);
    });
  },

  // For Notifications
  getNotifications: (req, res) => {
    const userId = req.user.id;
    const role = req.user.role; // Ensure this is populated by your authMiddleware

    const sql = `
    SELECT * FROM notifications
    WHERE user_id = ? AND role = ?
    ORDER BY created_at DESC
  `;

    db.query(sql, [userId, role], (err, results) => {
      if (err) {
        console.error('Error fetching notifications:', err);
        return res.status(500).json({ message: 'Error fetching notifications' });
      }
      res.json(results);
    });
  },

  //For Profile
  getVendorProfile: (req, res) => {
    const vendorId = req.user.id;
    const sql = 'SELECT id, name, email, mobile FROM users WHERE id = ?';

    db.query(sql, [vendorId], (err, results) => {
      if (err) return res.status(500).json({ message: 'Error fetching profile' });
      res.json(results[0]);
    });
  },

  updateVendorProfile: (req, res) => {
    const vendorId = req.user.id;
    const { name, email, mobile } = req.body;

    const sql = `
    UPDATE users 
    SET name = ?, email = ?, mobile = ? 
    WHERE id = ?
  `;

    db.query(sql, [name, email, mobile, vendorId], (err) => {
      if (err) return res.status(500).json({ message: 'Error updating profile' });
      res.json({ message: 'Profile updated successfully' });
    });
  }

};

module.exports = VendorController;
