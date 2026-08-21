const express = require('express');
const router = express.Router();
const {
  getMe,
  updateProfile,
  exportData,
  deleteAccount,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { profileUpdateSchema } = require('../validation/schemas');

router.use(protect);

router.get('/me', getMe);
router.put('/me', validate(profileUpdateSchema), updateProfile);
router.get('/export', exportData);
router.delete('/me', deleteAccount);

module.exports = router;
