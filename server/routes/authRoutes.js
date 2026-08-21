const express = require('express');
const router = express.Router();
const {
  register,
  login,
  demoLogin,
  getMe,
  updateProfile,
  exportData,
  deleteAccount,
  logout,
  getAuthProviders,
  forgotPassword,
  resetPassword,
  googleAuthStart,
  googleAuthCallback,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileUpdateSchema,
} = require('../validation/schemas');

router.get('/providers', getAuthProviders);
router.get('/google', googleAuthStart);
router.get('/google/callback', googleAuthCallback);

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/demo', demoLogin);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password/:token', authLimiter, validate(resetPasswordSchema), resetPassword);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, validate(profileUpdateSchema), updateProfile);
router.get('/export', protect, exportData);
router.delete('/account', protect, deleteAccount);

module.exports = router;
