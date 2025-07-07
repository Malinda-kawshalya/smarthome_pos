const express = require('express');
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  updateStock,
  getFeaturedProducts,
  searchProducts,
  getProductsByCategory,
  getLowStockProducts
} = require('../controllers/products');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/low-stock', getLowStockProducts);
router.get('/:id', getProduct);

// Protected routes
router.use(protect);

// Admin/Manager only routes
router.post('/', authorize('admin', 'manager'), createProduct);
router.put('/:id', authorize('admin', 'manager'), updateProduct);
router.delete('/:id', authorize('admin', 'manager'), deleteProduct);
router.put('/:id/images', authorize('admin', 'manager'), uploadProductImages);
router.put('/:id/stock', authorize('admin', 'manager'), updateStock);

module.exports = router;