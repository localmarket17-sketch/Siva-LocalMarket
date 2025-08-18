const express = require('express');
const router = express.Router();
const subcategoryController = require('../controllers/subcategoryController');

router.get('/:id', subcategoryController.getSubcategoryById);
router.get('/:id/products', subcategoryController.getProductsBySubcategory);
router.get('/', subcategoryController.getSubcategoriesByCategory);

module.exports = router;
