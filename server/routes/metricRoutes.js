const express = require('express');
const router = express.Router();
const {
  getMetrics,
  logMetric,
  deleteMetric,
  getDashboardSummary,
} = require('../controllers/metricController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/dashboard-summary', getDashboardSummary);
router.get('/', getMetrics);
router.post('/', logMetric);
router.delete('/:id', deleteMetric);

module.exports = router;
