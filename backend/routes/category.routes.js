const express = require('express');
const router = express.Router();
const db = require('../models/db');

// ✅ Get all categories
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM categories';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('[DB ERROR] Fetching categories:', err);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
    res.json(results);
  });
});

// ✅ Add a new category
router.post('/', (req, res) => {
  const { name, image } = req.body;
  if (!name || !image) {
    return res.status(400).json({ error: 'Name and image required' });
  }

  const sql = 'INSERT INTO categories (name, image) VALUES (?, ?)';
  db.query(sql, [name, image], (err, result) => {
    if (err) {
      console.error('[DB ERROR] Adding category:', err);
      return res.status(500).json({ error: 'Failed to add category' });
    }
    res.status(201).json({ message: 'Category added', id: result.insertId });
  });
});

// ✅ Get single category by ID
router.get('/:id', (req, res) => {
  const sql = 'SELECT * FROM categories WHERE id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch category' });
    if (results.length === 0) return res.status(404).json({ error: 'Category not found' });
    res.json(results[0]);
  });
});

// ✅ Get subcategories by category ID
router.get('/:id/subcategories', (req, res) => {
  const sql = 'SELECT * FROM subcategories WHERE category_id = ?';
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch subcategories' });
    res.json(results);
  });
});

// ✅ Add a subcategory
router.post('/:id/subcategories', (req, res) => {
  const category_id = req.params.id;
  const { name, image } = req.body;

  if (!name || !image) {
    return res.status(400).json({ error: 'Name and image required' });
  }

  const sql = 'INSERT INTO subcategories (name, image, category_id) VALUES (?, ?, ?)';
  db.query(sql, [name, image, category_id], (err, result) => {
    if (err) {
      console.error('[DB ERROR] Adding subcategory:', err);
      return res.status(500).json({ error: 'Failed to add subcategory' });
    }
    res.status(201).json({ message: 'Subcategory added', id: result.insertId });
  });
});

// ✅ Get products by category ID with filters
router.get('/:id/products', (req, res) => {
  const categoryId = req.params.id;
  const { brand, subcategory } = req.query;

  let sql = `
    SELECT 
      p.id, p.title, p.description, p.price, p.image, 
      p.category_id, p.subcategory_id,
      GROUP_CONCAT(pb.brand_id) AS brands
    FROM products p
    JOIN subcategories s ON p.subcategory_id = s.id
    LEFT JOIN product_brands pb ON p.id = pb.product_id
    WHERE s.category_id = ?
  `;
  const params = [categoryId];

  if (subcategory) {
    sql += ' AND p.subcategory_id = ?';
    params.push(subcategory);
  }

  if (brand) {
    sql += ' AND FIND_IN_SET(?, GROUP_CONCAT(pb.brand_id))';
    params.push(brand);
  }

  sql += `
    GROUP BY p.id, p.title, p.description, p.price, p.image, p.category_id, p.subcategory_id
  `;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('[DB ERROR] Fetching products by category:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    const productsWithBrands = results.map(p => ({
      ...p,
      brands: p.brands ? p.brands.split(',').map(Number) : []
    }));

    res.json(productsWithBrands);
  });
});

// ✅ Get brands by category ID
router.get('/:id/brands', (req, res) => {
  const sql = `
    SELECT DISTINCT b.id, b.name
    FROM brands b
    JOIN product_brands pb ON b.id = pb.brand_id
    JOIN products p ON pb.product_id = p.id
    JOIN subcategories s ON s.id = p.subcategory_id
    WHERE s.category_id = ?
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch brands' });
    res.json(results);
  });
});

module.exports = router;
