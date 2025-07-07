const express = require('express');
const {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  updateEmployeeStatus,
  getEmployeeStats,
  uploadEmployeeDocuments
} = require('../controllers/employees');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected and require admin/manager access
router.use(protect);
router.use(authorize('admin', 'manager'));

router.get('/', getEmployees);
router.get('/stats', getEmployeeStats);
router.post('/', createEmployee);
router.get('/:id', getEmployee);
router.put('/:id', updateEmployee);
router.delete('/:id', deleteEmployee);
router.put('/:id/status', updateEmployeeStatus);
router.put('/:id/documents', uploadEmployeeDocuments);

module.exports = router;