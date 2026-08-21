const express = require('express');
const router = express.Router();
const {
  getRecommendations,
  createRecommendation,
  batchCreateRecommendations,
  toggleTaskStatus,
  updateRecommendation,
  deleteRecommendation,
} = require('../controllers/recommendationController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getRecommendations);
router.post('/', createRecommendation);
router.post('/batch', batchCreateRecommendations);
router.patch('/:id/toggle', toggleTaskStatus);
router.put('/:id', updateRecommendation);
router.delete('/:id', deleteRecommendation);

module.exports = router;
