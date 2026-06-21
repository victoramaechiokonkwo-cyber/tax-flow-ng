const express = require('express');
const router = express.Router();
const { calculateTax, getCalculations } = require('../controllers/taxController');
const { protect } = require('../middleware/auth');

router.post('/calculate', protect, calculateTax);
router.get('/calculations', protect, getCalculations);

module.exports = router;