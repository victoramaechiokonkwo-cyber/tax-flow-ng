const express = require('express');
const router = express.Router();
const { generateReport, getTemplates } = require('../controllers/reportController');
const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateReport);
router.get('/templates', protect, getTemplates);

module.exports = router;