const express = require('express');
const {
  getDashboardStats,
  getSalesAnalytics,
  getProductAnalytics,
  getCustomerAnalytics,
  getRevenueAnalytics,
  getTopProducts,
  getTopCustomers,
  getSalesReport,
  getInventoryReport
} = require('../controllers/analytics');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/dashboard', getDashboardStats);
router.get('/sales', getSalesAnalytics);
router.get('/products', getProductAnalytics);
router.get('/customers', getCustomerAnalytics);
router.get('/revenue', getRevenueAnalytics);
router.get('/top-products', getTopProducts);
router.get('/top-customers', getTopCustomers);

// Admin/Manager only routes
router.get('/sales-report', authorize('admin', 'manager'), getSalesReport);
router.get('/inventory-report', authorize('admin', 'manager'), getInventoryReport);

module.exports = router;