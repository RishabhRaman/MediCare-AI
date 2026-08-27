const SearchHistory = require('../models/SearchHistory');
const { triageSymptoms } = require('../services/aiService');

// @desc    Public Triage symptoms for homepage visitors (unauthenticated)
// @route   POST /api/search/public-symptoms
// @access  Public
exports.publicSearchSymptoms = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a symptom description or condition to search.',
      });
    }

    const aiResult = await triageSymptoms(query, {});

    res.status(200).json({
      success: true,
      aiResult,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Triage symptoms and search medical knowledge
// @route   POST /api/search/symptoms
// @access  Private
exports.searchSymptoms = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query || query.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a symptom description or condition to search.',
      });
    }

    const patientProfile = req.user.healthProfile || {};
    const aiResult = await triageSymptoms(query, patientProfile);

    // Save to user search history
    const searchRecord = await SearchHistory.create({
      user: req.user.id,
      query,
      aiResult,
    });

    res.status(200).json({
      success: true,
      searchRecord,
      aiResult,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user symptom search history
// @route   GET /api/search/history
// @access  Private
exports.getSearchHistory = async (req, res, next) => {
  try {
    const history = await SearchHistory.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle bookmark on a search record
// @route   PATCH /api/search/history/:id/bookmark
// @access  Private
exports.toggleBookmark = async (req, res, next) => {
  try {
    const item = await SearchHistory.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Search history item not found.',
      });
    }

    item.isBookmarked = !item.isBookmarked;
    await item.save();

    res.status(200).json({
      success: true,
      item,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a search history entry
// @route   DELETE /api/search/history/:id
// @access  Private
exports.deleteSearchItem = async (req, res, next) => {
  try {
    const item = await SearchHistory.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Search record not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Search record removed.',
    });
  } catch (error) {
    next(error);
  }
};
