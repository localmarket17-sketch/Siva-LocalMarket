const db = require('./db');

const Product = {
  create: (product, callback) => {
    const sql = `
      INSERT INTO products (title, description, price, category_id, subcategory_id, brand_id, image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(sql, [
      product.title,
      product.description,
      product.price,
      product.category_id,
      product.subcategory_id,
      product.brand_id,
      product.image
    ], callback);
  },

  getAll: (callback) => {
    const sql = `
      SELECT p.*, c.name AS category_name, sc.name AS subcategory_name, b.name AS brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN brands b ON p.brand_id = b.id
    `;
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = `
      SELECT p.*, c.name AS category_name, sc.name AS subcategory_name, b.name AS brand_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
      LEFT JOIN brands b ON p.brand_id = b.id
      WHERE p.id = ?
    `;
    db.query(sql, [id], callback);
  },

  delete: (id, callback) => {
    const sql = `DELETE FROM products WHERE id = ?`;
    db.query(sql, [id], callback);
  }
};

module.exports = Product;
