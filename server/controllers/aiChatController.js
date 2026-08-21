const { chatWithAssistant } = require('../services/aiService');

// @desc    Free AI Medical Assistant Bot Chat
// @route   POST /api/ai/chat
// @access  Public (Available on Home page & throughout app)
exports.chat = async (req, res, next) => {
  try {
    const { messages, userContext } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one conversation message.',
      });
    }

    const response = await chatWithAssistant(messages, userContext || {});

    res.status(200).json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
