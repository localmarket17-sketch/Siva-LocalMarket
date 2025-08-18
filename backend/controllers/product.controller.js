const db = require('../models/db');

const ProductController = {
  // Get All Products with joined info
  getAllProducts: (req, res) => {
    const sql = `
    SELECT 
      p.id,
      p.title,
      p.description,
      p.price,
      p.image,
      p.category_id,
      p.subcategory_id,
      c.name AS category,
      sc.name AS subcategory,
      MAX(i.quantity) AS quantity,
      GROUP_CONCAT(DISTINCT pb.brand_id) AS brands
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
    LEFT JOIN product_brands pb ON p.id = pb.product_id
    LEFT JOIN inventory i ON p.id = i.product_id
    GROUP BY 
      p.id, p.title, p.description, p.price, p.image,
      p.category_id, p.subcategory_id, c.name, sc.name
  `;

    db.query(sql, (err, results) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch products', error: err });

      // Convert brands string into array of numbers
      const productsWithBrands = results.map(p => ({
        ...p,
        brands: p.brands ? p.brands.split(',').map(Number) : []
      }));

      res.json(productsWithBrands);
    });
  },

  // Get Product by ID with joined info
  getProductById: async (req, res) => {
    const id = req.params.id;

    const sql = `
    SELECT 
      p.id,
      p.image,
      p.title,
      p.description,
      p.price,
      c.name AS category,
      sc.name AS subcategory,
      GROUP_CONCAT(DISTINCT pb.brand_id) AS brands,
      MAX(i.quantity) AS quantity
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN subcategories sc ON p.subcategory_id = sc.id
    LEFT JOIN product_brands pb ON p.id = pb.product_id
    LEFT JOIN inventory i ON p.id = i.product_id
    WHERE p.id = ?
    GROUP BY 
      p.id, p.title, p.description, p.price,
      c.name, sc.name, p.image
  `;

    try {
      const [result] = await db.promise().query(sql, [id]);
      if (result.length === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      // Convert brands string into array of numbers
      const product = {
        ...result[0],
        brands: result[0].brands ? result[0].brands.split(',').map(Number) : []
      };

      res.json(product);
    } catch (err) {
      console.error('Error fetching product:', err);
      res.status(500).json({ message: 'Error fetching product', error: err });
    }
  },



  // Add Product (with multiple brands, image, inventory, etc.)
  addProduct: (req, res) => {
    const { title, price, description, category_id, subcategory_id, brands, shopkeeper_id } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!title || !price || !category_id || !subcategory_id || !Array.isArray(brands) || brands.length === 0 || !shopkeeper_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const insertProductSql = `
    INSERT INTO products (title, price, description, image, category_id, subcategory_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    db.query(insertProductSql, [title, price, description, image, category_id, subcategory_id], (err, result) => {
      if (err) return res.status(500).json({ message: 'Error adding product', error: err });

      const productId = result.insertId;

      // Insert brands into product_brands
      const brandValues = brands.map(brandId => [productId, brandId]);
      const insertBrandsSql = `INSERT INTO product_brands (product_id, brand_id) VALUES ?`;

      db.query(insertBrandsSql, [brandValues], (brandErr) => {
        if (brandErr) return res.status(500).json({ message: 'Product added but brand linking error', error: brandErr });

        // Insert into inventory
        const insertInventorySql = `
        INSERT INTO inventory (product_id, shopkeeper_id, quantity)
        VALUES (?, ?, 0)
      `;
        db.query(insertInventorySql, [productId, shopkeeper_id], (invErr) => {
          if (invErr) return res.status(500).json({ message: 'Product added but inventory error', error: invErr });

          res.status(201).json({ message: 'Product, brands, and inventory added successfully', productId });
        });
      });
    });
  },


  // Delete a Product
  deleteProduct: (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM products WHERE id = ?';
    db.query(sql, [id], (err) => {
      if (err) return res.status(500).json({ error: 'Failed to delete product', details: err });
      res.status(200).json({ message: 'Product deleted successfully' });
    });
  },

  // Get Filters (brands, categories)
  getProductFilters: (req, res) => {
    const sql = `
      SELECT 
        (SELECT GROUP_CONCAT(DISTINCT name) FROM categories) AS categories,
        (SELECT GROUP_CONCAT(DISTINCT name) FROM brands) AS brands
    `;
    db.query(sql, (err, result) => {
      if (err) return res.status(500).json({ message: 'Failed to fetch filters', error: err });

      const filters = {
        categories: result[0].categories ? result[0].categories.split(',') : [],
        brands: result[0].brands ? result[0].brands.split(',') : []
      };
      res.json(filters);
    });
  }
};

module.exports = ProductController;
