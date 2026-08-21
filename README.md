# 🩺 MediCare AI — AI-Powered Medical Assistant Platform (MERN Stack)

**MediCare AI** is a full-stack clinical intelligence web application designed to simplify medical lab reports, perform evidence-informed symptom triage, provide actionable self-care tasks, and visualize longitudinal health trends over time.

---

## 🌟 Key Features

### 1. 📄 Medical Report Analyzer & OCR Extraction
- **Multi-Format Document Upload**: Upload scanned PDF documents or image files (PNG, JPG, WEBP), or paste clinical lab text directly.
- **OCR Text Parsing**: Uses `pdf-parse` and `tesseract.js` for automatic optical character recognition on scanned lab reports.
- **Structured AI Synthesis**:
  - Plain-language executive summary.
  - Interactive table of extracted biomarkers (e.g. Fasting Glucose, Lipid Panel, CBC) with color-coded risk flags (Normal, Low, High, Borderline, Critical).
  - Medical term glossary with biological mechanisms and clinical significance.
  - Actionable recommendations (Dietary modifications, Lifestyle habits, Follow-up tests, When to see a doctor).
  - **Interactive Follow-up Q&A**: Ask questions directly about the analyzed report.
  - **Downloadable Formatted PDF**: Client-side clinical PDF report generation with clean branding via `jsPDF`.

### 2. 🩺 Intelligent Symptom & Illness Triage
- Natural language symptom search with common presets (e.g. Acid reflux, Migraines, Respiratory symptoms).
- Clinically-structured overviews: Common causes, risk factors, specialist physician recommendations.
- **General OTC Medicine Categories**: Safe categorization of over-the-counter classes with strict safety warnings and no prescription dosing.
- **Recovery Checklist**: Check off self-care tasks or sync all tasks into your personal dashboard with one click.
- **Emergency Red-Flag Detector**: Active keyword detector that triggers a prominent emergency modal for life-threatening symptoms (chest pain, shortness of breath, etc.) with local hotline numbers (911 / 112 / 999).

### 3. 📊 Health Dashboard & Biometric Trend Tracking
- **Wellness Index Gauge**: Dynamic calculated health score (0-100) based on recent test parameters and task adherence.
- **Interactive Longitudinal Charts**: Recharts Area & Line visualizations for Blood Glucose, Total & LDL Cholesterol, Blood Pressure, and Body Weight.
- **Manual Measurement Logging**: Log manual blood pressure, glucose, weight, and vitals with immediate database persistence.
- **Daily Action Task Checklist**: Quick habit tracking with streak and completion rate progress rings.

### 4. 👤 Patient Profile, Demographics & Data Privacy
- Demographics: Age, Gender, Blood Type, Height, Weight with live BMI calculation and status badges.
- Clinical Profile: Drug/food allergies, chronic conditions, and ongoing medications.
- Emergency contacts (Name, Relation, Phone).
- **Data Export & Privacy**: 1-click JSON export of all personal health records and account deletion tools.
- **Theme Customization**: Sleek Dark Mode & Light Mode support.

### 5. ⚡ 1-Click Demo Patient Tour
- Test the complete application instantly without creating an account by clicking **"Demo Login"** or **"1-Click Demo Patient Tour"**. Preloaded with rich sample reports, biometric history, and action tasks.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide React, jsPDF, jspdf-autotable, React Hot Toast, Axios, React Router v6.
- **Backend**: Node.js, Express.js, JWT Authentication, bcryptjs, Multer, Helmet, Morgan, Express Rate Limit, Cookie-Parser.
- **Database**: MongoDB with Mongoose ODM (includes seamless zero-config fallback to `mongodb-memory-server` if local MongoDB is inactive).
- **AI Service Layer**: Unified engine supporting OpenAI GPT-4o, Google Gemini, and Anthropic Claude APIs, with an intelligent built-in clinical rule engine for zero-dependency local running.
- **OCR Engine**: Tesseract.js & pdf-parse.

---

## 📁 Project Structure

```
medicare-ai/
├── package.json               # Root scripts for running client & server
├── README.md
├── server/                    # Express + Node.js Backend
│   ├── config/                # Database connection (MongoDB + Memory Server)
│   ├── controllers/           # Auth, Reports, Search, Recommendations, Metrics
│   ├── middleware/            # Auth JWT, ErrorHandler, RateLimiter, Multer Upload
│   ├── models/                # User, Report, SearchHistory, Recommendation, HealthMetric
│   ├── routes/                # REST API endpoints
│   ├── scripts/               # Seed script (demo patient data)
│   ├── services/              # AI Service Layer & OCR Service
│   ├── uploads/               # Uploaded report documents
│   ├── .env.example
│   └── server.js              # Server entry point
└── client/                    # React + Vite Frontend
    ├── src/
    │   ├── components/
    │   │   ├── layout/        # Navbar, Sidebar, Footer, DisclaimerBanner, EmergencyModal
    │   │   ├── ui/            # Button, Card, Badge, Modal, Input, SkeletonLoader
    │   │   ├── reports/       # FileUploadZone, ReportResultView
    │   │   ├── symptoms/      # SymptomSearchBox, SymptomTriageResult
    │   │   └── dashboard/     # HealthScoreCard, MetricsChart, UpcomingTasksWidget, RecentReportsWidget
    │   ├── context/           # AuthContext, ThemeContext
    │   ├── pages/             # Landing, Login, Register, Dashboard, ReportAnalyzer, SymptomSearch, History, Recommendations, Metrics, Profile, 404
    │   ├── services/          # Axios API client
    │   └── utils/             # jsPDF medical summary generator
    └── tailwind.config.js
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18+ recommended)
- npm

### 1. Install Dependencies
From the **repository root**:
```bash
npm run install:all
```

This installs root tooling plus `server/` and `client/` packages.

### 2. Configure Environment Variables
Copy `server/.env.example` to `server/.env` (already present for local demo). Typical values:
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
JWT_SECRET=medicare_ai_super_secret_jwt_key_2026_clinical_platform
JWT_EXPIRES_IN=7d
MONGODB_URI=mongodb://localhost:27017/medicare_ai

# Optional — leave blank to use the built-in clinical engine
OPENAI_API_KEY=
GEMINI_API_KEY=
ANTHROPIC_API_KEY=
AI_PROVIDER=auto

# Optional Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

If MongoDB is not running, the API automatically falls back to an in-memory database.

### 3. Seed Sample Clinical Data (Optional but Recommended)
```bash
npm run seed
```
Demo account: `demo.patient@medicare.ai` (or use **Demo Login** in the UI).

### 4. Run frontend and backend together
From the repository root:
```bash
npm run dev
```

This starts **Express on port 5000** and **Vite on port 5173** at the same time. The client waits until `http://127.0.0.1:5000/api/health` is up, then opens the SPA.

- App: [http://localhost:5173](http://localhost:5173)
- API health: [http://localhost:5000/api/health](http://localhost:5000/api/health)

To run one side only:
```bash
npm run server
npm run client
```


---

## 🔐 Clinical Safety & Ethical AI Notice
- **Non-Prescription Principle**: MediCare AI does not issue medical diagnoses or prescriptive dosages.
- **Emergency Safeguards**: High-risk symptom triggers (e.g., chest pain, respiratory distress) instantly display emergency dispatch protocols (911 / 112).
- **HIPAA-Inspired Privacy**: Complete user control over personal records with one-click export and deletion options.
