const db = require('./db');

const Rating = {
  addRating: (userId, productId, rating, review, callback) => {
    const sql = `INSERT INTO ratings (user_id, product_id, rating, review) VALUES (?, ?, ?, ?)`;
    db.query(sql, [userId, productId, rating, review], callback);
  },

  getProductRatings: (productId, callback) => {
    const sql = `SELECT r.rating, r.review, u.name FROM ratings r JOIN users u ON r.user_id = u.id WHERE r.product_id = ?`;
    db.query(sql, [productId], callback);
  },

  getAverageRating: (productId, callback) => {
    const sql = `SELECT AVG(rating) AS avg_rating FROM ratings WHERE product_id = ?`;
    db.query(sql, [productId], callback);
  }
};

module.exports = Rating;
