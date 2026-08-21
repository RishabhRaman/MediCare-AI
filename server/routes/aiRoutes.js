const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/aiChatController');
const { aiLimiter } = require('../middleware/rateLimiter');
const validate = require('../middleware/validate');
const { chatSchema } = require('../validation/schemas');

router.post('/chat', aiLimiter, validate(chatSchema), chat);

module.exports = router;
