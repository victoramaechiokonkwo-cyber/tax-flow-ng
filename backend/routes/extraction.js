const express = require('express');
const router = express.Router();
const {
  getConnections,
  createConnection,
  testConnection,
  runExtraction,
  getLogs
} = require('../controllers/extractionController');
const { protect, restrictTo } = require('../middleware/auth');

router.get('/connections', protect, getConnections);
router.post('/connections', protect, restrictTo('admin'), createConnection);
router.post('/test/:id', protect, testConnection);
router.post('/run/:id', protect, runExtraction);
router.get('/logs', protect, getLogs);

module.exports = router;