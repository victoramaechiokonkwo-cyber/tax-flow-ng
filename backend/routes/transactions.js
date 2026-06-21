const express = require('express');
const router = express.Router();
const {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  getStats
} = require('../controllers/transactionController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getTransactions);
router.get('/stats', protect, getStats);
router.post('/', protect, createTransaction);
router.get('/:id', protect, getTransaction);
router.put('/:id', protect, updateTransaction);

module.exports = router;