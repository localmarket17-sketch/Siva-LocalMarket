const db = require('./db');

const Inventory = {
  getAllByVendor: (vendorId, callback) => {
    const sql = `
      SELECT i.id, c.name AS category, s.name AS subcategory, p.title, p.brand, i.quantity, i.price
      FROM inventory i
      JOIN products p ON i.product_id = p.id
      JOIN subcategories s ON p.subcategory_id = s.id
      JOIN categories c ON s.category_id = c.id
      WHERE i.vendor_id = ?`;
    db.query(sql, [vendorId], callback);
  },

  addStock: (vendorId, productId, quantity, price, callback) => {
    const sql = `INSERT INTO inventory (vendor_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`;
    db.query(sql, [vendorId, productId, quantity, price], callback);
  },

  updateStock: (inventoryId, quantity, price, callback) => {
    const sql = `UPDATE inventory SET quantity = ?, price = ? WHERE id = ?`;
    db.query(sql, [quantity, price, inventoryId], callback);
  }
};

module.exports = Inventory;
