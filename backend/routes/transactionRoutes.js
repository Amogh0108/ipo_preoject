const express = require('express');
const router = express.Router();
const {
  getMyTransactions,
  getTransactionById,
  getAllTransactions
} = require('../controllers/transactionController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/my-transactions', getMyTransactions);
router.get('/:id', getTransactionById);

router.use(authorize('admin'));
router.get('/', getAllTransactions);

module.exports = router;
