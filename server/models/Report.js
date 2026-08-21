const mongoose = require('mongoose');

const parameterSchema = new mongoose.Schema({
  parameter: { type: String, required: true },
  value: { type: String, required: true },
  numericValue: { type: Number, default: null },
  unit: { type: String, default: '' },
  referenceRange: { type: String, default: '' },
  status: {
    type: String,
    enum: ['normal', 'low', 'high', 'critical', 'borderline', 'inconclusive'],
    default: 'normal',
  },
  interpretation: { type: String, default: '' },
  category: { type: String, default: 'General' },
});

const glossaryItemSchema = new mongoose.Schema({
  term: { type: String, required: true },
  definition: { type: String, required: true },
  clinicalSignificance: { type: String, default: '' },
});

const qaItemSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  askedAt: { type: Date, default: Date.now },
});

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Report title is required'],
      trim: true,
      default: 'Medical Lab Report',
    },
    reportType: {
      type: String,
      enum: [
        'blood_test',
        'lipid_panel',
        'metabolic_panel',
        'urinalysis',
        'prescription',
        'xray_scan_summary',
        'pathology',
        'cardiac_report',
        'general_lab',
      ],
      default: 'general_lab',
    },
    dateOfReport: {
      type: Date,
      default: Date.now,
    },
    fileName: {
      type: String,
      default: '',
    },
    fileType: {
      type: String,
      enum: ['pdf', 'image', 'text', 'manual'],
      default: 'text',
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    rawExtractedText: {
      type: String,
      default: '',
    },
    aiAnalysis: {
      executiveSummary: {
        type: String,
        default: 'No summary generated.',
      },
      riskLevel: {
        type: String,
        enum: ['normal', 'borderline', 'elevated', 'critical'],
        default: 'normal',
      },
      riskScore: {
        type: Number,
        min: 0,
        max: 100,
        default: 15,
      },
      keyFindings: [{ type: String }],
      extractedParameters: [parameterSchema],
      glossary: [glossaryItemSchema],
      recommendations: {
        dietary: [{ type: String }],
        lifestyle: [{ type: String }],
        followUpTests: [{ type: String }],
        whenToSeeDoctor: {
          type: String,
          default: 'Consult a licensed physician if symptoms persist or values remain abnormal.',
        },
      },
      redFlags: [{ type: String }],
      isEmergencyDetected: {
        type: Boolean,
        default: false,
      },
      emergencyNotes: {
        type: String,
        default: '',
      },
      disclaimer: {
        type: String,
        default:
          'Informational analysis only. Not a medical diagnosis. Consult a licensed doctor for clinical decisions.',
      },
    },
    qaHistory: [qaItemSchema],
    tags: [{ type: String }],
    isSample: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
reportSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
