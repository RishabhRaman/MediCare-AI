const mongoose = require('mongoose');

const healthMetricSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    metricType: {
      type: String,
      required: true,
      enum: [
        'blood_glucose',
        'hba1c',
        'total_cholesterol',
        'ldl_cholesterol',
        'hdl_cholesterol',
        'triglycerides',
        'blood_pressure',
        'heart_rate',
        'weight',
        'vitamin_d',
        'hemoglobin',
        'wbc_count',
        'creatinine',
        'custom',
      ],
      index: true,
    },
    metricName: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    secondaryValue: {
      type: Number,
      default: null, // Used for diastolic BP or composite markers
    },
    unit: {
      type: String,
      required: true,
      default: '',
    },
    referenceRange: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['normal', 'low', 'high', 'critical', 'borderline'],
      default: 'normal',
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    notes: {
      type: String,
      default: '',
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

healthMetricSchema.index({ user: 1, metricType: 1, date: -1 });

module.exports = mongoose.model('HealthMetric', healthMetricSchema);
