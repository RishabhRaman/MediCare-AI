const express = require('express');
const router = express.Router();
const {
  publicSearchSymptoms,
  searchSymptoms,
  getSearchHistory,
  toggleBookmark,
  deleteSearchItem,
} = require('../controllers/searchController');
const { protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { symptomSearchSchema } = require('../validation/schemas');

// Public route for landing page visitors
router.post('/public-symptoms', aiLimiter, validate(symptomSearchSchema), publicSearchSymptoms);

// Protected routes for patient portal
router.use(protect);

router.post('/symptoms', aiLimiter, validate(symptomSearchSchema), searchSymptoms);
router.get('/history', getSearchHistory);
router.patch('/history/:id/bookmark', toggleBookmark);
router.delete('/history/:id', deleteSearchItem);

module.exports = router;
