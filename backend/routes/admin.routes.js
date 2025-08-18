const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Protect and authorize admin routes
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

//For Dashboard
router.get('/dashboard-stats', AdminController.getDashboardStats);
router.get('/recent-orders', AdminController.getRecentOrders);

//For Users
router.get('/users', AdminController.getAllUsers);
router.delete('/users/:id', AdminController.deleteUser);

//For Vendors
router.get('/vendors', AdminController.getAllVendors);
router.delete('/vendors/:id', AdminController.deleteVendor);

//For Deliver-Boys
router.get('/delivery-boys', AdminController.getAllDeliveryBoys);
router.delete('/delivery-boys/:id', AdminController.deleteDeliveryBoy);

//For Products
router.get('/products', AdminController.getAllProducts);
router.delete('/products/:id', AdminController.deleteProduct);

//For Orders
router.get('/orders', AdminController.getAllOrders);
router.post('/orders/assign-delivery', AdminController.assignDeliveryBoy);

//For Inventory
router.get('/inventory', AdminController.getInventory);
router.post('/inventory', AdminController.addInventory);
router.put('/inventory/:id', AdminController.updateInventory);
router.delete('/inventory/:id', AdminController.deleteInventory);

//For Sales-Report
router.get('/sales-report', AdminController.getSalesReport);
router.get('/sales-report/export', AdminController.exportSalesReport);

//For Notifications
router.get('/notifications', AdminController.getNotifications);
router.put('/notifications/:id/read', AdminController.markNotificationAsRead);

//For Profile
router.get('/profile', AdminController.getProfile);
router.put('/profile', AdminController.updateProfile);

module.exports = router;
