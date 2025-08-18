const db = require('./db');

const Category = {
  // Get all categories
  getAll: (callback) => {
    const sql = `SELECT * FROM categories`;
    db.query(sql, callback);
  },

  // Create a new category
  create: (name, callback) => {
    const sql = `INSERT INTO categories (name) VALUES (?)`;
    db.query(sql, [name], callback);
  },

  // Get all subcategories for a specific category
  getSubcategories: (categoryId, callback) => {
    const sql = `SELECT * FROM subcategories WHERE category_id = ?`;
    db.query(sql, [categoryId], callback);
  },

  // Create a subcategory under a category
  createSubcategory: (categoryId, name, callback) => {
    const sql = `INSERT INTO subcategories (category_id, name) VALUES (?, ?)`;
    db.query(sql, [categoryId, name], callback);
  },

  // ✅ Get all products under a category (via subcategories)
  getProductsByCategoryId: (categoryId, callback) => {
    const sql = `
      SELECT p.* FROM products p
      JOIN subcategories s ON p.subcategory_id = s.id
      WHERE s.category_id = ?
    `;
    db.query(sql, [categoryId], callback);
  }
};

module.exports = Category;
