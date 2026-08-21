require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Report = require('../models/Report');
const HealthMetric = require('../models/HealthMetric');
const Recommendation = require('../models/Recommendation');
const SearchHistory = require('../models/SearchHistory');

const seedData = async () => {
  try {
    console.log('[Seed] Connecting to database...');
    await connectDB();

    console.log('[Seed] Purging existing demo data...');
    const demoEmail = 'demo.patient@medicare.ai';
    const existingDemoUser = await User.findOne({ email: demoEmail });

    if (existingDemoUser) {
      await Promise.all([
        Report.deleteMany({ user: existingDemoUser._id }),
        HealthMetric.deleteMany({ user: existingDemoUser._id }),
        Recommendation.deleteMany({ user: existingDemoUser._id }),
        SearchHistory.deleteMany({ user: existingDemoUser._id }),
        User.deleteOne({ _id: existingDemoUser._id }),
      ]);
    }

    console.log('[Seed] Creating Demo Patient User...');
    const demoUser = await User.create({
      name: 'Alex Mercer',
      email: demoEmail,
      password: 'MedicareDemoPassword2026!',
      role: 'patient',
      isDemoUser: true,
      healthProfile: {
        age: 38,
        gender: 'Male',
        bloodType: 'O+',
        height: 178, // cm
        weight: 76,  // kg
        allergies: ['Penicillin', 'Peanuts (Mild)'],
        chronicConditions: ['Mild Hyperlipidemia', 'Seasonal Rhinitis'],
        currentMedications: ['Omega-3 Fish Oil 1000mg', 'Vitamin D3 2000IU'],
        emergencyContact: {
          name: 'Sarah Mercer',
          relation: 'Spouse',
          phone: '+1 (555) 234-5678',
        },
      },
      preferences: {
        theme: 'dark',
        emailNotifications: true,
        criticalAlerts: true,
        taskReminders: true,
      },
    });

    console.log('[Seed] Creating Sample Analyzed Medical Reports...');
    const report1 = await Report.create({
      user: demoUser._id,
      title: 'Comprehensive Lipid & Glycemic Panel',
      reportType: 'lipid_panel',
      dateOfReport: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
      fileName: 'Lipid_Panel_May2026.pdf',
      fileType: 'pdf',
      fileSize: 245000,
      rawExtractedText: `METABOLIC & CARDIOVASCULAR LAB REPORT
Patient Name: Alex Mercer | Age: 38 | Gender: Male | Date: May 2026
Test Name                 Result      Units       Reference Range   Flag
Total Cholesterol         228         mg/dL       < 200             HIGH
HDL Cholesterol           42          mg/dL       > 50              LOW
LDL Cholesterol           148         mg/dL       < 100             HIGH
Triglycerides             190         mg/dL       < 150             HIGH
Fasting Blood Glucose     108         mg/dL       70 - 99           HIGH
HbA1c                     5.8         %           < 5.7             HIGH
Serum Creatinine          0.92        mg/dL       0.7 - 1.3         NORMAL`,
      aiAnalysis: {
        executiveSummary:
          'This diagnostic panel reflects mild metabolic and cardiovascular risk markers. Total cholesterol (228 mg/dL), LDL (148 mg/dL), and Triglycerides (190 mg/dL) are elevated, while HDL is below target. Fasting glucose (108 mg/dL) and HbA1c (5.8%) indicate borderline prediabetes. Renal function is healthy.',
        riskLevel: 'elevated',
        riskScore: 62,
        keyFindings: [
          'Elevated circulating LDL and Triglycerides indicate need for dietary lipid optimization.',
          'HbA1c of 5.8% places glucose metabolism in the prediabetic range.',
          'Protective HDL is mildly depressed at 42 mg/dL.',
          'Kidney filtration (Creatinine 0.92 mg/dL) is within normal physiological limits.',
        ],
        extractedParameters: [
          {
            parameter: 'Total Cholesterol',
            value: '228 mg/dL',
            numericValue: 228,
            unit: 'mg/dL',
            referenceRange: '< 200 mg/dL',
            status: 'high',
            interpretation: 'Elevated total cholesterol. Potential risk factor for vascular plaque formation.',
            category: 'Lipid Profile',
          },
          {
            parameter: 'LDL ("Bad") Cholesterol',
            value: '148 mg/dL',
            numericValue: 148,
            unit: 'mg/dL',
            referenceRange: '< 100 mg/dL',
            status: 'high',
            interpretation: 'Low-Density Lipoprotein is elevated. Suggests reducing saturated fat and boosting soluble fiber.',
            category: 'Lipid Profile',
          },
          {
            parameter: 'HDL ("Good") Cholesterol',
            value: '42 mg/dL',
            numericValue: 42,
            unit: 'mg/dL',
            referenceRange: '> 50 mg/dL',
            status: 'low',
            interpretation: 'Below ideal cardiovascular protective threshold. Aerobic exercise will help elevate HDL.',
            category: 'Lipid Profile',
          },
          {
            parameter: 'Triglycerides',
            value: '190 mg/dL',
            numericValue: 190,
            unit: 'mg/dL',
            referenceRange: '< 150 mg/dL',
            status: 'high',
            interpretation: 'Elevated circulating blood fats, associated with carbohydrate intake and sedentary intervals.',
            category: 'Lipid Profile',
          },
          {
            parameter: 'Fasting Blood Glucose',
            value: '108 mg/dL',
            numericValue: 108,
            unit: 'mg/dL',
            referenceRange: '70 - 99 mg/dL',
            status: 'high',
            interpretation: 'Mild fasting hyperglycemia reflecting early insulin resistance.',
            category: 'Metabolic & Glycemic',
          },
          {
            parameter: 'HbA1c',
            value: '5.8 %',
            numericValue: 5.8,
            unit: '%',
            referenceRange: '< 5.7 %',
            status: 'high',
            interpretation: 'Prediabetic range 3-month glycemic average.',
            category: 'Metabolic & Glycemic',
          },
          {
            parameter: 'Serum Creatinine',
            value: '0.92 mg/dL',
            numericValue: 0.92,
            unit: 'mg/dL',
            referenceRange: '0.7 - 1.3 mg/dL',
            status: 'normal',
            interpretation: 'Optimal kidney filtration capacity.',
            category: 'Renal Function',
          },
        ],
        glossary: [
          {
            term: 'LDL Cholesterol',
            definition: 'Low-Density Lipoprotein carrying cholesterol particles into tissues and vascular walls.',
            clinicalSignificance: 'Primary target in reducing cardiovascular event risk.',
          },
          {
            term: 'HbA1c',
            definition: 'Percentage of hemoglobin molecules bound with glucose over a 90-day red blood cell cycle.',
            clinicalSignificance: 'Gold standard diagnostic marker for prediabetes and diabetes.',
          },
        ],
        recommendations: {
          dietary: [
            'Incorporate 10-15g of soluble fiber daily (oatmeal, chia seeds, black beans).',
            'Substitute saturated cooking oils with extra-virgin olive oil and avocado oil.',
            'Eliminate refined sugary snacks and replace with raw almonds or walnuts.',
          ],
          lifestyle: [
            'Maintain 30 minutes of moderate-intensity brisk walking 5 days per week.',
            'Target 7.5 hours of uninterrupted nightly sleep.',
          ],
          followUpTests: [
            'Repeat Fasting Lipid & Glycemic Panel in 12 weeks.',
          ],
          whenToSeeDoctor:
            'Discuss results with your primary care physician to review familial cardiovascular risks and evaluate medical therapy.',
        },
        redFlags: ['Sudden crushing chest tightness', 'Radiating left shoulder/arm discomfort'],
        isEmergencyDetected: false,
        disclaimer: 'Informational analysis only. Consult your licensed doctor.',
      },
      qaHistory: [
        {
          question: 'What is the most urgent change I should make for my high LDL?',
          answer:
            'The highest-impact lifestyle intervention is reducing dietary saturated and trans-fats while increasing daily soluble fiber (such as oats, psyllium husk, and legumes), combined with consistent aerobic cardio exercise.',
          askedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
        },
      ],
      isSample: true,
    });

    const report2 = await Report.create({
      user: demoUser._id,
      title: 'Complete Blood Count (CBC) with Differential',
      reportType: 'blood_test',
      dateOfReport: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      fileName: 'CBC_Screening_April2026.pdf',
      fileType: 'pdf',
      fileSize: 180000,
      rawExtractedText: `HEMATOLOGY LABORATORY REPORT
Test Name                 Result      Units         Reference Range   Flag
Hemoglobin (Hb)           14.6        g/dL          13.5 - 17.5       NORMAL
Hematocrit (HCT)          43.2        %             38.8 - 50.0       NORMAL
WBC Count                 6,800       /uL           4,500 - 11,000    NORMAL
Platelet Count            235,000     /uL           150,000 - 450,000 NORMAL
25-Hydroxy Vitamin D      21.4        ng/mL         30.0 - 100.0      LOW`,
      aiAnalysis: {
        executiveSummary:
          'Normal Complete Blood Count (CBC) with optimal oxygen transport capacity and strong immune markers. Serum Vitamin D (21.4 ng/mL) is insufficient.',
        riskLevel: 'borderline',
        riskScore: 28,
        keyFindings: [
          'Hemoglobin and hematocrit demonstrate healthy red blood cell volume.',
          'WBC and platelet counts are well-balanced.',
          'Vitamin D deficiency identified, recommended for supplementation consultation.',
        ],
        extractedParameters: [
          {
            parameter: 'Hemoglobin (Hb)',
            value: '14.6 g/dL',
            numericValue: 14.6,
            unit: 'g/dL',
            referenceRange: '13.5 - 17.5 g/dL',
            status: 'normal',
            interpretation: 'Healthy oxygen-carrying hemoglobin levels.',
            category: 'Hematology',
          },
          {
            parameter: '25-Hydroxy Vitamin D',
            value: '21.4 ng/mL',
            numericValue: 21.4,
            unit: 'ng/mL',
            referenceRange: '30.0 - 100.0 ng/mL',
            status: 'low',
            interpretation: 'Hypovitaminosis D. Can lead to bone demineralization and immune susceptibility.',
            category: 'Vitamins',
          },
        ],
        recommendations: {
          dietary: ['Include fatty fish (salmon/mackerel), fortified milk, and egg yolks.'],
          lifestyle: ['Get 15-20 minutes of safe midday sun exposure without sunscreen.'],
          followUpTests: ['Check Vitamin D level in 3 months.'],
          whenToSeeDoctor: 'Consult doctor regarding optimal Vitamin D3 oral supplementation dosage.',
        },
        disclaimer: 'Informational analysis only.',
      },
      isSample: true,
    });

    console.log('[Seed] Seeding Biometric Historical Trend Data...');
    const now = Date.now();
    const day = 24 * 60 * 60 * 1000;

    const sampleMetrics = [
      // Blood Glucose trend (6 readings)
      { metricType: 'blood_glucose', metricName: 'Fasting Blood Glucose', value: 122, unit: 'mg/dL', referenceRange: '70 - 99 mg/dL', status: 'high', date: new Date(now - 60 * day) },
      { metricType: 'blood_glucose', metricName: 'Fasting Blood Glucose', value: 118, unit: 'mg/dL', referenceRange: '70 - 99 mg/dL', status: 'high', date: new Date(now - 45 * day) },
      { metricType: 'blood_glucose', metricName: 'Fasting Blood Glucose', value: 114, unit: 'mg/dL', referenceRange: '70 - 99 mg/dL', status: 'high', date: new Date(now - 30 * day) },
      { metricType: 'blood_glucose', metricName: 'Fasting Blood Glucose', value: 108, unit: 'mg/dL', referenceRange: '70 - 99 mg/dL', status: 'high', date: new Date(now - 14 * day) },
      { metricType: 'blood_glucose', metricName: 'Fasting Blood Glucose', value: 102, unit: 'mg/dL', referenceRange: '70 - 99 mg/dL', status: 'borderline', date: new Date(now - 5 * day) },
      { metricType: 'blood_glucose', metricName: 'Fasting Blood Glucose', value: 98, unit: 'mg/dL', referenceRange: '70 - 99 mg/dL', status: 'normal', date: new Date(now - 1 * day) },

      // Total Cholesterol trend
      { metricType: 'total_cholesterol', metricName: 'Total Cholesterol', value: 245, unit: 'mg/dL', referenceRange: '< 200 mg/dL', status: 'critical', date: new Date(now - 90 * day) },
      { metricType: 'total_cholesterol', metricName: 'Total Cholesterol', value: 234, unit: 'mg/dL', referenceRange: '< 200 mg/dL', status: 'high', date: new Date(now - 50 * day) },
      { metricType: 'total_cholesterol', metricName: 'Total Cholesterol', value: 228, unit: 'mg/dL', referenceRange: '< 200 mg/dL', status: 'high', date: new Date(now - 14 * day) },

      // LDL Cholesterol trend
      { metricType: 'ldl_cholesterol', metricName: 'LDL Cholesterol', value: 162, unit: 'mg/dL', referenceRange: '< 100 mg/dL', status: 'critical', date: new Date(now - 90 * day) },
      { metricType: 'ldl_cholesterol', metricName: 'LDL Cholesterol', value: 154, unit: 'mg/dL', referenceRange: '< 100 mg/dL', status: 'high', date: new Date(now - 50 * day) },
      { metricType: 'ldl_cholesterol', metricName: 'LDL Cholesterol', value: 148, unit: 'mg/dL', referenceRange: '< 100 mg/dL', status: 'high', date: new Date(now - 14 * day) },

      // Blood Pressure trend (Systolic / Diastolic)
      { metricType: 'blood_pressure', metricName: 'Blood Pressure', value: 138, secondaryValue: 88, unit: 'mmHg', referenceRange: '< 120/80 mmHg', status: 'high', date: new Date(now - 30 * day) },
      { metricType: 'blood_pressure', metricName: 'Blood Pressure', value: 132, secondaryValue: 84, unit: 'mmHg', referenceRange: '< 120/80 mmHg', status: 'borderline', date: new Date(now - 15 * day) },
      { metricType: 'blood_pressure', metricName: 'Blood Pressure', value: 124, secondaryValue: 80, unit: 'mmHg', referenceRange: '< 120/80 mmHg', status: 'normal', date: new Date(now - 2 * day) },

      // Weight (kg)
      { metricType: 'weight', metricName: 'Body Weight', value: 80.5, unit: 'kg', referenceRange: '65 - 78 kg', status: 'high', date: new Date(now - 90 * day) },
      { metricType: 'weight', metricName: 'Body Weight', value: 78.2, unit: 'kg', referenceRange: '65 - 78 kg', status: 'high', date: new Date(now - 45 * day) },
      { metricType: 'weight', metricName: 'Body Weight', value: 76.0, unit: 'kg', referenceRange: '65 - 78 kg', status: 'normal', date: new Date(now - 2 * day) },
    ];

    await HealthMetric.insertMany(
      sampleMetrics.map((m) => ({ ...m, user: demoUser._id }))
    );

    console.log('[Seed] Seeding Health Action Tasks & Recommendations...');
    const sampleTasks = [
      {
        user: demoUser._id,
        title: 'Include 15g Soluble Fiber Daily (Oats / Chia)',
        description: 'Supports clearance of circulating LDL cholesterol and stabilizes post-meal glucose spikes.',
        category: 'diet',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(now + 2 * day),
        source: 'report_analyzer',
        sourceReportId: report1._id,
      },
      {
        user: demoUser._id,
        title: '30-Minute Brisk Walk / Zone 2 Cardio',
        description: 'Helps raise HDL ("good") cholesterol and improves cellular insulin sensitivity.',
        category: 'exercise',
        priority: 'medium',
        status: 'completed',
        dueDate: new Date(now - 1 * day),
        completedAt: new Date(now - 1 * day),
        source: 'report_analyzer',
      },
      {
        user: demoUser._id,
        title: 'Hydration Target: 2.5L Water Intake',
        description: 'Maintain optimal kidney filtration and blood volume circulation.',
        category: 'hydration',
        priority: 'low',
        status: 'pending',
        dueDate: new Date(now + 1 * day),
        source: 'manual',
      },
      {
        user: demoUser._id,
        title: 'Schedule Follow-up Lipid & HbA1c Lab Recheck',
        description: 'Assess 12-week response to dietary adjustments and cardiovascular routine.',
        category: 'diagnostic',
        priority: 'high',
        status: 'pending',
        dueDate: new Date(now + 45 * day),
        source: 'report_analyzer',
        sourceReportId: report1._id,
      },
      {
        user: demoUser._id,
        title: 'Evening Digital Wind-Down (8 Hours Sleep)',
        description: 'Lower cortisol and sympathetic nervous system tone before bed.',
        category: 'lifestyle',
        priority: 'medium',
        status: 'completed',
        dueDate: new Date(now - 2 * day),
        completedAt: new Date(now - 2 * day),
        source: 'health_profile',
      },
    ];

    await Recommendation.insertMany(sampleTasks);

    console.log('[Seed] Seeding Sample Symptom Search History...');
    await SearchHistory.create({
      user: demoUser._id,
      query: 'Mild throbbing headache in temples after working on screen',
      aiResult: {
        conditionName: 'Tension Headache / Digital Eye Strain',
        overview: 'Cranial discomfort commonly arising from sustained ciliary muscle strain and cervical posture fatigue.',
        commonCauses: ['Prolonged screen exposure without 20-20-20 breaks', 'Mild dehydration', 'Neck tension'],
        generalOtcCategories: [
          {
            categoryName: 'Analgesics / NSAIDs',
            examples: ['Acetaminophen', 'Ibuprofen'],
            purpose: 'Relieves acute tension discomfort.',
            precautions: 'Consult pharmacist for dosing.',
          },
        ],
        homeCareProtocols: [
          'Apply cool compress over forehead.',
          'Practice 20-20-20 rule (look 20 feet away every 20 minutes for 20 seconds).',
          'Sip 500ml of room temperature water.',
        ],
        recoveryChecklist: [
          { task: 'Take a 15-minute screen-free break in dim lighting', category: 'Rest', timeline: 'Now', isCompleted: true },
          { task: 'Perform gentle cervical neck stretches', category: 'Exercise', timeline: 'Afternoon', isCompleted: false },
        ],
        redFlags: ['Thunderclap sudden headache', 'Visual aura with speech difficulty'],
        isEmergency: false,
        doctorSpecialtyToConsult: 'Optometrist or General Physician',
      },
      isBookmarked: true,
    });

    console.log('\n====================================================');
    console.log('  Demo Seed Data Loaded Successfully!');
    console.log(`  Demo Account Email: ${demoEmail}`);
    console.log('  Demo Account Password: MedicareDemoPassword2026!');
    console.log('====================================================\n');

    await disconnectDB();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]', error);
    process.exit(1);
  }
};

seedData();
