const fs = require('fs');
const path = require('path');
const Report = require('../models/Report');
const HealthMetric = require('../models/HealthMetric');
const Recommendation = require('../models/Recommendation');
const { extractTextFromFile } = require('../services/ocrService');
const { analyzeReport, answerReportQuestion } = require('../services/aiService');

// Helper to auto-create HealthMetrics and Tasks from report parameters
const syncMetricsAndTasksFromReport = async (userId, reportId, aiAnalysis) => {
  try {
    const { extractedParameters, recommendations } = aiAnalysis;

    // 1. Sync parameters to HealthMetric collection
    if (Array.isArray(extractedParameters)) {
      for (const param of extractedParameters) {
        if (param.numericValue !== null && param.numericValue !== undefined) {
          let metricType = 'custom';
          const pLower = param.parameter.toLowerCase();

          if (pLower.includes('glucose') || pLower.includes('sugar')) metricType = 'blood_glucose';
          else if (pLower.includes('hba1c') || pLower.includes('a1c')) metricType = 'hba1c';
          else if (pLower.includes('total cholesterol')) metricType = 'total_cholesterol';
          else if (pLower.includes('ldl')) metricType = 'ldl_cholesterol';
          else if (pLower.includes('hdl')) metricType = 'hdl_cholesterol';
          else if (pLower.includes('triglyceride')) metricType = 'triglycerides';
          else if (pLower.includes('hemoglobin')) metricType = 'hemoglobin';
          else if (pLower.includes('wbc')) metricType = 'wbc_count';
          else if (pLower.includes('creatinine')) metricType = 'creatinine';
          else if (pLower.includes('vitamin d')) metricType = 'vitamin_d';

          await HealthMetric.create({
            user: userId,
            metricType,
            metricName: param.parameter,
            value: param.numericValue,
            unit: param.unit,
            referenceRange: param.referenceRange,
            status: param.status || 'normal',
            notes: param.interpretation,
            sourceReportId: reportId,
            date: new Date(),
          });
        }
      }
    }

    // 2. Auto-generate top Action Tasks in Recommendation collection
    if (recommendations) {
      const dietary = recommendations.dietary || [];
      const lifestyle = recommendations.lifestyle || [];
      const followUpTests = recommendations.followUpTests || [];

      if (dietary.length > 0) {
        await Recommendation.create({
          user: userId,
          title: `Diet Adjustment: ${dietary[0].slice(0, 60)}...`,
          description: dietary[0],
          category: 'diet',
          priority: 'medium',
          source: 'report_analyzer',
          sourceReportId: reportId,
        });
      }

      if (lifestyle.length > 0) {
        await Recommendation.create({
          user: userId,
          title: `Lifestyle Target: ${lifestyle[0].slice(0, 60)}...`,
          description: lifestyle[0],
          category: 'lifestyle',
          priority: 'medium',
          source: 'report_analyzer',
          sourceReportId: reportId,
        });
      }

      if (followUpTests.length > 0) {
        await Recommendation.create({
          user: userId,
          title: `Diagnostic Follow-up: ${followUpTests[0].slice(0, 60)}...`,
          description: followUpTests[0],
          category: 'diagnostic',
          priority: 'high',
          source: 'report_analyzer',
          sourceReportId: reportId,
        });
      }
    }
  } catch (err) {
    console.error('[Sync Metrics/Tasks Error]', err.message);
  }
};

// @desc    Free / Public Upload & Analyze (For Home Page & Free Tier)
// @route   POST /api/reports/public-upload-analyze
// @access  Public
exports.publicUploadAndAnalyze = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF document or image of your medical report.',
      });
    }

    const { title, reportType } = req.body;
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const ext = path.extname(fileName).toLowerCase().replace('.', '');

    console.log(`[Public Report Analyzer] Extracting text from ${fileName}...`);
    const extractedText = await extractTextFromFile(filePath, mimeType);

    console.log('[Public Report Analyzer] Generating clinical AI synthesis...');
    const patientProfile = req.user ? (req.user.healthProfile || {}) : {};
    const aiAnalysis = await analyzeReport(extractedText, patientProfile);

    // If user is authenticated, also save to DB
    let savedReport = null;
    if (req.user) {
      savedReport = await Report.create({
        user: req.user.id,
        title: title || fileName.replace(/\.[^/.]+$/, ''),
        reportType: reportType || 'general_lab',
        fileName,
        fileType: ext === 'pdf' ? 'pdf' : 'image',
        fileSize,
        rawExtractedText: extractedText,
        aiAnalysis,
      });
      await syncMetricsAndTasksFromReport(req.user.id, savedReport._id, aiAnalysis);
    }

    res.status(200).json({
      success: true,
      message: 'Report analyzed successfully.',
      report: savedReport || {
        _id: 'guest-report-' + Date.now(),
        title: title || fileName.replace(/\.[^/.]+$/, ''),
        reportType: reportType || 'general_lab',
        fileName,
        fileType: ext === 'pdf' ? 'pdf' : 'image',
        fileSize,
        createdAt: new Date(),
        rawExtractedText: extractedText,
        aiAnalysis,
        isGuest: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Free / Public Paste Text & Analyze (For Home Page)
// @route   POST /api/reports/public-analyze-text
// @access  Public
exports.publicAnalyzeText = async (req, res, next) => {
  try {
    const { title, text, reportType } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid medical report text (at least 10 characters).',
      });
    }

    const patientProfile = req.user ? (req.user.healthProfile || {}) : {};
    const aiAnalysis = await analyzeReport(text, patientProfile);

    let savedReport = null;
    if (req.user) {
      savedReport = await Report.create({
        user: req.user.id,
        title: title || 'Pasted Medical Lab Summary',
        reportType: reportType || 'general_lab',
        fileType: 'text',
        rawExtractedText: text,
        aiAnalysis,
      });
      await syncMetricsAndTasksFromReport(req.user.id, savedReport._id, aiAnalysis);
    }

    res.status(200).json({
      success: true,
      message: 'Medical text analyzed successfully.',
      report: savedReport || {
        _id: 'guest-report-' + Date.now(),
        title: title || 'Pasted Medical Lab Summary',
        reportType: reportType || 'general_lab',
        fileType: 'text',
        createdAt: new Date(),
        rawExtractedText: text,
        aiAnalysis,
        isGuest: true,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload file and analyze report with OCR + AI
// @route   POST /api/reports/upload-analyze
// @access  Private
exports.uploadAndAnalyze = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF document or image of your medical report.',
      });
    }

    const { title, reportType } = req.body;
    const filePath = req.file.path;
    const mimeType = req.file.mimetype;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;
    const ext = path.extname(fileName).toLowerCase().replace('.', '');

    // Step 1: OCR / Text extraction
    console.log(`[Report Controller] Extracting text from ${fileName}...`);
    const extractedText = await extractTextFromFile(filePath, mimeType);

    // Step 2: AI Clinical Analysis
    console.log('[Report Controller] Generating AI analysis...');
    const patientProfile = req.user.healthProfile || {};
    const aiAnalysis = await analyzeReport(extractedText, patientProfile);

    // Step 3: Save Report to Database
    const report = await Report.create({
      user: req.user.id,
      title: title || fileName.replace(/\.[^/.]+$/, ''),
      reportType: reportType || 'general_lab',
      fileName,
      fileType: ext === 'pdf' ? 'pdf' : 'image',
      fileSize,
      rawExtractedText: extractedText,
      aiAnalysis,
    });

    // Step 4: Auto-sync metrics and health tasks
    await syncMetricsAndTasksFromReport(req.user.id, report._id, aiAnalysis);

    res.status(201).json({
      success: true,
      message: 'Report uploaded and analyzed successfully.',
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Analyze raw medical report text (Pasted text)
// @route   POST /api/reports/analyze-text
// @access  Private
exports.analyzeText = async (req, res, next) => {
  try {
    const { title, text, reportType } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid medical report text (at least 10 characters).',
      });
    }

    const patientProfile = req.user.healthProfile || {};
    const aiAnalysis = await analyzeReport(text, patientProfile);

    const report = await Report.create({
      user: req.user.id,
      title: title || 'Pasted Medical Lab Summary',
      reportType: reportType || 'general_lab',
      fileType: 'text',
      rawExtractedText: text,
      aiAnalysis,
    });

    await syncMetricsAndTasksFromReport(req.user.id, report._id, aiAnalysis);

    res.status(201).json({
      success: true,
      message: 'Medical text analyzed successfully.',
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reports for current user
// @route   GET /api/reports
// @access  Private
exports.getReports = async (req, res, next) => {
  try {
    const { search, type, risk } = req.query;
    const query = { user: req.user.id };

    if (type && type !== 'all') {
      query.reportType = type;
    }
    if (risk && risk !== 'all') {
      query['aiAnalysis.riskLevel'] = risk;
    }
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const reports = await Report.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reports.length,
      reports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single report by ID
// @route   GET /api/reports/:id
// @access  Private
exports.getReportById = async (req, res, next) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Medical report not found.',
      });
    }

    res.status(200).json({
      success: true,
      report,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Ask a follow-up Q&A question on a specific report
// @route   POST /api/reports/:id/qa
// @access  Private
exports.askReportQuestion = async (req, res, next) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a question about this report.',
      });
    }

    const report = await Report.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Medical report not found.',
      });
    }

    const patientProfile = req.user.healthProfile || {};
    const qaResult = await answerReportQuestion(report, question, patientProfile);

    report.qaHistory.push({
      question: qaResult.question,
      answer: qaResult.answer,
      askedAt: new Date(),
    });
    await report.save();

    res.status(200).json({
      success: true,
      qaResult,
      qaHistory: report.qaHistory,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a report
// @route   DELETE /api/reports/:id
// @access  Private
exports.deleteReport = async (req, res, next) => {
  try {
    const report = await Report.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Medical report not found.',
      });
    }

    // Clean up associated metrics & tasks
    await Promise.all([
      HealthMetric.deleteMany({ sourceReportId: req.params.id }),
      Recommendation.deleteMany({ sourceReportId: req.params.id }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Report and associated metrics removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};
