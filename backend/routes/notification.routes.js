const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/order.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/create', OrderController.createOrder);
router.get('/user/:user_id', OrderController.getUserOrders);

module.exports = router;
