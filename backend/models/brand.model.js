const db = require('./db');

const Brand = {
  getAll: (callback) => {
    const sql = 'SELECT * FROM brands';
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = 'SELECT * FROM brands WHERE id = ?';
    db.query(sql, [id], callback);
  },

  create: (name, callback) => {
    const sql = 'INSERT INTO brands (name) VALUES (?)';
    db.query(sql, [name], callback);
  },

  delete: (id, callback) => {
    const sql = 'DELETE FROM brands WHERE id = ?';
    db.query(sql, [id], callback);
  }
};

module.exports = Brand;
