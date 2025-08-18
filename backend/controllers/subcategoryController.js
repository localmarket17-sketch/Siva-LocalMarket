const db = require('../models/db'); // keep as is

// Get subcategory by ID
exports.getSubcategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query('SELECT * FROM subcategories WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }
    res.json({ subcategory: rows[0] });
  } catch (error) {
    console.error('Error fetching subcategory:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get products by subcategory ID
exports.getProductsBySubcategory = async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `
      SELECT 
        p.id,
        p.title,
        p.description,
        p.price,
        p.image,
        p.category_id,
        p.subcategory_id,
        GROUP_CONCAT(pb.brand_id) AS brands
      FROM products p
      LEFT JOIN product_brands pb ON p.id = pb.product_id
      WHERE p.subcategory_id = ?
      GROUP BY p.id, p.title, p.description, p.price, p.image, p.category_id, p.subcategory_id
    `;

    const [products] = await db.promise().query(sql, [id]);

    const productsWithBrands = products.map(p => ({
      ...p,
      brands: p.brands ? p.brands.split(',').map(Number) : []
    }));

    res.json(productsWithBrands);
  } catch (error) {
    console.error('Error fetching products by subcategory:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getSubcategoriesByCategory = (req, res) => {
  const { categoryId } = req.query;
  if (!categoryId) {
    return res.status(400).json({ message: 'Category ID is required' });
  }

  const sql = 'SELECT * FROM subcategories WHERE category_id = ?';
  db.query(sql, [categoryId], (err, results) => {
    if (err) return res.status(500).json({ message: 'Error fetching subcategories' });
    res.json(results);
  });
};