const express = require('express');
const router = express.Router();
const {
  getAllIPOs,
  getIPOById,
  createIPO,
  updateIPO,
  deleteIPO,
  getActiveIPOs,
  getUpcomingIPOs
} = require('../controllers/ipoController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getAllIPOs);
router.get('/active', getActiveIPOs);
router.get('/upcoming', getUpcomingIPOs);
router.get('/:id', getIPOById);

router.use(protect);
router.use(authorize('admin'));

router.post('/', createIPO);
router.put('/:id', updateIPO);
router.delete('/:id', deleteIPO);

module.exports = router;
