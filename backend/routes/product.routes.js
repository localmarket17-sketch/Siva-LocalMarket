const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/authMiddleware');

// Public Routes
router.get('/', ProductController.getAllProducts);

// ⚠️ Place this before '/:id' to avoid conflict
router.get('/filters', ProductController.getProductFilters); 

router.get('/:id', ProductController.getProductById);

// Protected Routes (Require Auth)
router.use(authMiddleware);

router.post('/add', ProductController.addProduct);
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;
