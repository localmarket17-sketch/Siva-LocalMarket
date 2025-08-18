const express = require('express');
const router = express.Router();
const db = require('../models/db');

// 1. Get all brands
router.get('/', (req, res) => {
  db.query('SELECT id, name, image FROM brands', (err, results) => {
    if (err) {
      console.error('Failed to fetch brands:', err);
      return res.status(500).json({ error: 'Failed to fetch brands' });
    }
    res.json(results);
  });
});

// 2. Get brand by ID
router.get('/:brandId', (req, res) => {
  const brandId = req.params.brandId;

  db.query('SELECT id, name FROM brands WHERE id = ?', [brandId], (err, results) => {
    if (err) {
      console.error('Failed to fetch brand:', err);
      return res.status(500).json({ error: 'Failed to fetch brand' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Brand not found' });
    }

    res.json(results[0]);
  });
});

// 3. Get all products for a brand
router.get('/:brandId/products', (req, res) => {
  const brandId = req.params.brandId;
  const { category, subcategory } = req.query;

  let sql = `
    SELECT 
      p.id, p.title, p.price, p.image, p.category_id, p.subcategory_id,
      GROUP_CONCAT(pb.brand_id) AS brands
    FROM products p
    JOIN product_brands pb ON p.id = pb.product_id
    LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
    WHERE pb.brand_id = ?
  `;
  const params = [brandId];

  if (category) {
    sql += ' AND sc.category_id = ?';
    params.push(category);
  }
  if (subcategory) {
    sql += ' AND p.subcategory_id = ?';
    params.push(subcategory);
  }

  sql += ' GROUP BY p.id, p.title, p.price, p.image, p.category_id, p.subcategory_id';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Failed to fetch products for brand:', err);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }

    // Convert brands string into array of numbers
    const productsWithBrands = results.map(p => ({
      ...p,
      brands: p.brands ? p.brands.split(',').map(Number) : []
    }));

    res.json(productsWithBrands);
  });
});



router.post('/', (req, res) => {
  const { name, image } = req.body;

  if (!name || !image) {
    return res.status(400).json({ error: 'Name and image are required' });
  }

  const sql = 'INSERT INTO brands (name, image) VALUES (?, ?)';
  db.query(sql, [name, image], (err, result) => {
    if (err) {
      console.error('[DB ERROR] Adding brand:', err);
      return res.status(500).json({ error: 'Failed to add brand' });
    }
    res.status(201).json({ message: 'Brand added successfully', id: result.insertId });
  });
});

module.exports = router;
