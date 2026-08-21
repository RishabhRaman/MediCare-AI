import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FileText,
  Stethoscope,
  Activity,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  HeartPulse,
  LineChart,
  BrainCircuit,
  Eye,
  ShieldAlert,
  Upload,
  MessageSquare,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import HomeReportAnalyzer from '../components/home/HomeReportAnalyzer';
import HomeAiAssistantBot from '../components/home/HomeAiAssistantBot';

const LandingPage = ({ onEmergencyTrigger }) => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('analyzer'); // 'analyzer' | 'bot'

  useEffect(() => {
    const sectionId = new URLSearchParams(location.search).get('section');
    if (!sectionId) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [location.search, location.pathname]);

  const handleDemoAccess = async () => {
    const res = await demoLogin();
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const features = [
    {
      icon: FileText,
      title: 'Free Medical Report Simplifier',
      description:
        'Upload scanned lab reports (PDF/Images) or paste clinical text. MediCare AI extracts key biomarkers, flags abnormal ranges, and explains terminology in simple language.',
      badge: 'OCR & AI Vision',
    },
    {
      icon: Stethoscope,
      title: 'Intelligent Symptom Triage',
      description:
        'Describe symptoms in plain words. Get clinically referenced overviews, home-care recovery steps, OTC categories, and immediate red-flag emergency alerts.',
      badge: 'Interactive Triage',
    },
    {
      icon: Activity,
      title: 'Biometric Trend Tracker',
      description:
        'Monitor vital health trends (Blood Glucose, Lipids, Blood Pressure, Weight) with interactive longitudinal charts automatically synced from your test reports.',
      badge: 'Health Analytics',
    },
    {
      icon: ShieldCheck,
      title: 'Actionable Health Tasks',
      description:
        'Turn complex lab findings and triage results into an actionable daily recovery checklist with personalized dietary, lifestyle, and diagnostic follow-up tasks.',
      badge: 'Habit Engine',
    },
  ];

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-500/15 dark:bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 text-xs sm:text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>100% Free AI Clinical Assistant & Report Analyzer</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15]"
          >
            Clinical Intelligence.{' '}
            <span className="bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
              Human Empathy.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto"
          >
            Upload your medical reports for free plain-language summaries or ask our AI assistant bot anything below.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2"
          >
            <Button
              variant="primary"
              size="lg"
              onClick={handleDemoAccess}
              icon={Sparkles}
              className="w-full sm:w-auto shadow-xl shadow-sky-500/25 px-8"
            >
              1-Click Demo Patient Tour
            </Button>
            <Link to="/register" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-6">
                Create free account
              </Button>
            </Link>
            <a href="#interactive-suite" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" icon={FileText} className="w-full sm:w-auto px-6">
                Try Free Report Analyzer Below
              </Button>
            </a>
          </motion.div>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Free PDF & Image OCR Extraction
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> 24/7 AI Medical Chatbot
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No Sign-Up Needed to Test
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Free Suite on Home Page (Report Analyzer + AI Assistant Bot) */}
      <section id="interactive-suite" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
            Free Online Health Tools
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Instant Medical Analysis & AI Bot
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Upload your lab report or chat directly with MediCare AI right here for instant insights.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="glass-card p-1.5 rounded-2xl flex gap-2 border border-sky-500/30">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload & Analyze Report
            </button>
            <button
              onClick={() => setActiveTab('bot')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'bot'
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              AI Assistant Bot (Free Chat)
            </button>
          </div>
        </div>

        {/* Tab 1: Home Report Analyzer */}
        {activeTab === 'analyzer' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomeReportAnalyzer onEmergencyTrigger={onEmergencyTrigger} />
          </motion.div>
        )}

        {/* Tab 2: Home AI Assistant Bot */}
        {activeTab === 'bot' && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <HomeAiAssistantBot onEmergencyTrigger={onEmergencyTrigger} />
          </motion.div>
        )}
      </section>

      {/* How it works */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">How it works</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            From report to next steps in minutes
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: '01',
              title: 'Upload or describe',
              body: 'Drop a PDF or image lab report, paste clinical text, or search a symptom in plain language.',
            },
            {
              step: '02',
              title: 'AI structures the story',
              body: 'OCR extracts values, flags abnormal ranges, and returns a plain-language summary with red-flag checks.',
            },
            {
              step: '03',
              title: 'Act and track',
              body: 'Save history, check off self-care tasks, and watch biometric trends on your dashboard over time.',
            },
          ].map((item) => (
            <div key={item.step} className="glass-card rounded-3xl p-7 space-y-3">
              <span className="text-xs font-black text-cyan-400">{item.step}</span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Patient stories</span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Built to feel clinical, not confusing
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote:
                'My lipid panel finally made sense. The color flags showed what was borderline without pretending to diagnose me.',
              name: 'Priya S.',
              role: 'Caregiver',
            },
            {
              quote:
                'Symptom search gave me a recovery checklist and a clear push to seek urgent care when chest tightness showed up.',
              name: 'Marcus T.',
              role: 'Patient',
            },
            {
              quote:
                'I track glucose from saved reports on the dashboard. The disclaimer is always visible — that is the point.',
              name: 'Elena R.',
              role: 'Demo patient tour',
            },
          ].map((item) => (
            <blockquote key={item.name} className="glass-card rounded-3xl p-7 flex flex-col justify-between">
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">“{item.quote}”</p>
              <footer className="mt-5">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                <p className="text-xs text-slate-500">{item.role}</p>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            Engineered for Clinical Precision
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Comprehensive medical assistant capabilities designed to empower patients without confusing medical jargon.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card rounded-3xl p-8 hover:shadow-2xl hover:border-sky-500/40 transition-all duration-200 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/15 text-sky-400 flex items-center justify-center border border-sky-500/30">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold text-cyan-400 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-800">
                    {feat.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {feat.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety & Compliance Trust Section */}
      <section id="safety" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-sky-500/20 text-center space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-sky-500 to-cyan-400 text-white mx-auto flex items-center justify-center shadow-lg shadow-sky-500/25">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Ethical AI & Clinical Safety Protocol
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            MediCare AI is programmed strictly as an informational assistant. It does not issue official medical diagnoses, does not prescribe exact medication dosages, and incorporates active red-flag triggers to prompt users toward emergency care when dangerous symptoms are detected.
          </p>
          <div className="pt-2 flex justify-center">
            <Button variant="primary" size="md" onClick={handleDemoAccess} icon={Sparkles}>
              Explore Full Patient Portal
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
