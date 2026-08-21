const HealthMetric = require('../models/HealthMetric');
const Report = require('../models/Report');
const Recommendation = require('../models/Recommendation');
const SearchHistory = require('../models/SearchHistory');

// @desc    Get metrics for current user (grouped and timeline)
// @route   GET /api/metrics
// @access  Private
exports.getMetrics = async (req, res, next) => {
  try {
    const { type, limit } = req.query;
    const filter = { user: req.user.id };

    if (type && type !== 'all') {
      filter.metricType = type;
    }

    const metrics = await HealthMetric.find(filter)
      .sort({ date: 1 })
      .limit(limit ? parseInt(limit) : 100);

    // Group metrics by type for easy charting
    const grouped = {};
    for (const m of metrics) {
      if (!grouped[m.metricType]) {
        grouped[m.metricType] = [];
      }
      grouped[m.metricType].push(m);
    }

    res.status(200).json({
      success: true,
      count: metrics.length,
      grouped,
      metrics,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log a new health metric/vital sign manually
// @route   POST /api/metrics
// @access  Private
exports.logMetric = async (req, res, next) => {
  try {
    const { metricType, metricName, value, secondaryValue, unit, referenceRange, notes, date } = req.body;

    if (!metricType || value === undefined || value === null) {
      return res.status(400).json({
        success: false,
        message: 'Metric type and primary value are required.',
      });
    }

    // Determine status automatically if possible
    let status = 'normal';
    const numVal = parseFloat(value);

    if (metricType === 'blood_glucose') {
      if (numVal > 125) status = 'critical';
      else if (numVal > 99) status = 'high';
      else if (numVal < 70) status = 'low';
    } else if (metricType === 'total_cholesterol') {
      if (numVal > 240) status = 'critical';
      else if (numVal > 200) status = 'high';
    } else if (metricType === 'ldl_cholesterol') {
      if (numVal > 160) status = 'critical';
      else if (numVal > 100) status = 'high';
    } else if (metricType === 'blood_pressure') {
      if (numVal >= 140 || (secondaryValue && secondaryValue >= 90)) status = 'high';
      else if (numVal >= 130 || (secondaryValue && secondaryValue >= 80)) status = 'borderline';
    }

    const metric = await HealthMetric.create({
      user: req.user.id,
      metricType,
      metricName: metricName || metricType.replace('_', ' ').toUpperCase(),
      value: numVal,
      secondaryValue: secondaryValue ? parseFloat(secondaryValue) : null,
      unit: unit || '',
      referenceRange: referenceRange || '',
      status: req.body.status || status,
      notes: notes || '',
      date: date ? new Date(date) : new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Health metric logged successfully.',
      metric,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a metric record
// @route   DELETE /api/metrics/:id
// @access  Private
exports.deleteMetric = async (req, res, next) => {
  try {
    const metric = await HealthMetric.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: 'Metric not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Metric record deleted.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get aggregated dashboard summary
// @route   GET /api/metrics/dashboard-summary
// @access  Private
exports.getDashboardSummary = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Parallel fetch
    const [reportsCount, recentReports, pendingTasks, completedTasks, recentSearches, latestMetrics] =
      await Promise.all([
        Report.countDocuments({ user: userId }),
        Report.find({ user: userId }).sort({ createdAt: -1 }).limit(3),
        Recommendation.find({ user: userId, status: 'pending' }).sort({ priority: -1, dueDate: 1 }).limit(5),
        Recommendation.countDocuments({ user: userId, status: 'completed' }),
        SearchHistory.find({ user: userId }).sort({ createdAt: -1 }).limit(3),
        HealthMetric.find({ user: userId }).sort({ date: -1 }).limit(10),
      ]);

    const totalTasks = pendingTasks.length + completedTasks;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 100;

    // Calculate dynamic health score
    let healthScore = 84;
    if (recentReports.length > 0) {
      const latestReport = recentReports[0];
      const riskScore = latestReport.aiAnalysis?.riskScore || 20;
      healthScore = Math.max(20, Math.min(98, 100 - Math.round(riskScore * 0.6) + Math.round(taskCompletionRate * 0.1)));
    }

    res.status(200).json({
      success: true,
      summary: {
        healthScore,
        reportsCount,
        recentReports,
        pendingTasksCount: pendingTasks.length,
        completedTasksCount: completedTasks,
        pendingTasks,
        taskCompletionRate,
        recentSearches,
        latestMetrics,
      },
    });
  } catch (error) {
    next(error);
  }
};
