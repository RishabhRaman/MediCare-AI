const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'diet',
        'exercise',
        'lifestyle',
        'diagnostic',
        'medication_check',
        'hydration',
        'symptom_care',
        'general',
      ],
      default: 'general',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'dismissed'],
      default: 'pending',
      index: true,
    },
    dueDate: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    },
    completedAt: {
      type: Date,
      default: null,
    },
    source: {
      type: String,
      enum: ['report_analyzer', 'symptom_search', 'manual', 'health_profile'],
      default: 'manual',
    },
    sourceReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Report',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

recommendationSchema.index({ user: 1, status: 1, dueDate: 1 });

module.exports = mongoose.model('Recommendation', recommendationSchema);
