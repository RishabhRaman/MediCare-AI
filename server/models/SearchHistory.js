const mongoose = require('mongoose');

const otcCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  examples: [{ type: String }],
  purpose: { type: String, required: true },
  precautions: { type: String, default: 'Consult a pharmacist before taking.' },
});

const recoveryTaskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  category: { type: String, default: 'Home Care' },
  timeline: { type: String, default: 'Daily' },
  isCompleted: { type: Boolean, default: false },
});

const searchHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    query: {
      type: String,
      required: [true, 'Search query is required'],
      trim: true,
    },
    symptoms: [{ type: String }],
    aiResult: {
      conditionName: { type: String, default: 'Symptom Triage' },
      overview: { type: String, required: true },
      commonCauses: [{ type: String }],
      riskFactors: [{ type: String }],
      generalOtcCategories: [otcCategorySchema],
      homeCareProtocols: [{ type: String }],
      recoveryChecklist: [recoveryTaskSchema],
      redFlags: [{ type: String }],
      isEmergency: { type: Boolean, default: false },
      emergencyGuidance: { type: String, default: '' },
      doctorSpecialtyToConsult: { type: String, default: 'General Practitioner' },
      disclaimer: {
        type: String,
        default:
          'Informational triage only. Not a medical diagnosis or prescription. Seek immediate clinical care for severe symptoms.',
      },
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

searchHistorySchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('SearchHistory', searchHistorySchema);
