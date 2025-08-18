const express = require('express');
const router = express.Router();
const DeliveryController = require('../controllers/delivery.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// ✅ Middleware to protect all routes and ensure only delivery boys access
router.use(authMiddleware);
router.use(roleMiddleware('delivery'));

//For Dashboard
router.get('/dashboard/:id', DeliveryController.getDashboardStats);

//For Assigned-orders
router.get('/:id/assigned-orders', DeliveryController.getAssignedOrders);
router.put('/update-status/:id', DeliveryController.updateOrderStatus);

//For Sales-Reports
router.get('/sales-reports', DeliveryController.getSalesReports);

//For Notifications
router.get('/notifications', DeliveryController.getNotifications);

//For Profile
router.get('/profile', DeliveryController.getProfile);
router.put('/profile', DeliveryController.updateProfile);

module.exports = router;
