const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cart.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
router.use(authMiddleware);  // Protect all /api/cart routes
router.use(roleMiddleware('customer'));


// Route: /api/cart/user/cart
router.get('/user/cart', CartController.getCart);
router.post('/user/cart', CartController.addToCart);
router.put('/user/cart/:itemId', CartController.updateCartItem);
router.delete('/user/cart/:itemId', CartController.removeCartItem);


module.exports = router;
