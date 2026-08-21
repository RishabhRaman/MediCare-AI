const Recommendation = require('../models/Recommendation');

// @desc    Get all user health tasks & recommendations
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res, next) => {
  try {
    const { status, category, priority } = req.query;
    const filter = { user: req.user.id };

    if (status && status !== 'all') {
      filter.status = status;
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    const tasks = await Recommendation.find(filter).sort({
      status: 1, // pending first
      priority: -1,
      dueDate: 1,
    });

    const totalCount = await Recommendation.countDocuments({ user: req.user.id });
    const completedCount = await Recommendation.countDocuments({
      user: req.user.id,
      status: 'completed',
    });
    const pendingCount = totalCount - completedCount;

    res.status(200).json({
      success: true,
      stats: {
        total: totalCount,
        completed: completedCount,
        pending: pendingCount,
        completionRate: totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
      },
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new health task
// @route   POST /api/recommendations
// @access  Private
exports.createRecommendation = async (req, res, next) => {
  try {
    const { title, description, category, priority, dueDate, source } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required.',
      });
    }

    const task = await Recommendation.create({
      user: req.user.id,
      title,
      description: description || '',
      category: category || 'general',
      priority: priority || 'medium',
      dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      source: source || 'manual',
    });

    res.status(201).json({
      success: true,
      message: 'Health task created.',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create tasks (e.g. from symptom recovery checklist)
// @route   POST /api/recommendations/batch
// @access  Private
exports.batchCreateRecommendations = async (req, res, next) => {
  try {
    const { tasks, source } = req.body;

    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of tasks to add.',
      });
    }

    const tasksToInsert = tasks.map((t) => ({
      user: req.user.id,
      title: t.task || t.title,
      description: t.description || `Generated from ${source || 'symptom checklist'}`,
      category: t.category?.toLowerCase() || 'symptom_care',
      priority: t.priority || 'medium',
      source: source || 'symptom_search',
    }));

    const createdTasks = await Recommendation.insertMany(tasksToInsert);

    res.status(201).json({
      success: true,
      count: createdTasks.length,
      tasks: createdTasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task status (pending <-> completed)
// @route   PATCH /api/recommendations/:id/toggle
// @access  Private
exports.toggleTaskStatus = async (req, res, next) => {
  try {
    const task = await Recommendation.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Health task not found.',
      });
    }

    if (task.status === 'completed') {
      task.status = 'pending';
      task.completedAt = null;
    } else {
      task.status = 'completed';
      task.completedAt = new Date();
    }

    await task.save();

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a health task
// @route   PUT /api/recommendations/:id
// @access  Private
exports.updateRecommendation = async (req, res, next) => {
  try {
    const task = await Recommendation.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Health task not found.',
      });
    }

    res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a health task
// @route   DELETE /api/recommendations/:id
// @access  Private
exports.deleteRecommendation = async (req, res, next) => {
  try {
    const task = await Recommendation.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Health task not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Health task deleted.',
    });
  } catch (error) {
    next(error);
  }
};
