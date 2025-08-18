const express = require('express');
const router = express.Router();
const VendorController = require('../controllers/vendor.controller');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.use(authMiddleware);
router.use(roleMiddleware('vendor'));

//For Dashboard
router.get('/dashboard-stats', VendorController.getDashboardStats);

//For Products
router.get('/products', VendorController.getProductsForLoggedInVendor);
router.put('/products/:id', VendorController.updateProduct);
router.post('/add-product', VendorController.addProduct);
router.delete('/products/:id', VendorController.deleteProduct);
router.put('/update-inventory/:id', VendorController.updateInventory);

//For Orders
router.get('/orders', VendorController.getOrdersForVendor);
router.put('/orders/update-status/:id', VendorController.updateOrderStatus);

//For Sales-Report
router.get('/sales-report', VendorController.getSalesReportForVendor);

//For Notifications
router.get('/notifications', VendorController.getNotifications);

//For Profile
router.get('/profile', VendorController.getVendorProfile);
router.put('/profile', VendorController.updateVendorProfile);

module.exports = router;
