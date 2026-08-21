const express = require('express');
const router = express.Router();
const {
  publicUploadAndAnalyze,
  publicAnalyzeText,
  uploadAndAnalyze,
  analyzeText,
  getReports,
  getReportById,
  askReportQuestion,
  deleteReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { aiLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { analyzeTextSchema } = require('../validation/schemas');

// Public / Free endpoints (Home page & guest users)
router.post('/public-upload-analyze', upload.single('file'), aiLimiter, publicUploadAndAnalyze);
router.post('/public-analyze-text', aiLimiter, validate(analyzeTextSchema), publicAnalyzeText);

// Protected routes
router.use(protect);

router.post('/upload-analyze', upload.single('file'), aiLimiter, uploadAndAnalyze);
router.post('/analyze-text', aiLimiter, validate(analyzeTextSchema), analyzeText);
router.get('/', getReports);
router.get('/:id', getReportById);
router.post('/:id/qa', aiLimiter, askReportQuestion);
router.delete('/:id', deleteReport);

module.exports = router;

