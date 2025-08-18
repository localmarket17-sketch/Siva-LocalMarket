const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Apply auth middleware to all order routes
router.use(authMiddleware);

// ✅ Customer places a new order (user ID comes from JWT)
router.post('/create', OrderController.createOrder);

// ✅ Get orders for the logged-in user only
router.get('/user/:user_id', OrderController.getUserOrders);

// ✅ Admin updates status of any order
router.put('/update-status', OrderController.updateOrderStatus);

module.exports = router;
