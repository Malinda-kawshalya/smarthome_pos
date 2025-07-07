const express = require('express');
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getOrderStats,
  getMyOrders,
  cancelOrder,
  refundOrder
} = require('../controllers/orders');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getOrders);
router.get('/stats', getOrderStats);
router.get('/my-orders', getMyOrders);
router.post('/', createOrder);
router.get('/:id', getOrder);
router.put('/:id', authorize('admin', 'manager'), updateOrder);
router.delete('/:id', authorize('admin', 'manager'), deleteOrder);
router.put('/:id/status', authorize('admin', 'manager'), updateOrderStatus);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/refund', authorize('admin', 'manager'), refundOrder);

module.exports = router;