import React, { useState, useEffect } from 'react';
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
  Upload,
  MessageSquare,
  CheckSquare,
  ShieldAlert,
  ChevronDown,
  Layers,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import HomeReportAnalyzer from '../components/home/HomeReportAnalyzer';
import HomeSymptomTriage from '../components/home/HomeSymptomTriage';
import HomeVitalsExplorer from '../components/home/HomeVitalsExplorer';
import HomeHabitsPreview from '../components/home/HomeHabitsPreview';
import HomeAiAssistantBot from '../components/home/HomeAiAssistantBot';

const LandingPage = ({ onEmergencyTrigger }) => {
  const { user, isAuthenticated, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Active tab in the Interactive Health Suite: 'analyzer' | 'symptoms' | 'vitals' | 'habits' | 'bot'
  const [activeTab, setActiveTab] = useState('analyzer');
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => {
    const sectionId = new URLSearchParams(location.search).get('section');
    if (!sectionId) return;

    const timer = setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [location.search, location.pathname]);

  const handleDemoAccess = async () => {
    const res = await demoLogin();
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const jumpTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleFeatureAction = async (featureKey, directPortalRoute) => {
    if (isAuthenticated) {
      navigate(directPortalRoute);
    } else {
      setActiveTab(featureKey);
      jumpTo('interactive-suite');
    }
  };

  const handleDirectPortalTour = async (directPortalRoute) => {
    if (isAuthenticated) {
      navigate(directPortalRoute);
    } else {
      const res = await demoLogin();
      if (res.success) {
        navigate(directPortalRoute);
      }
    }
  };

  const trustSignals = [
    {
      number: '01',
      title: 'Evidence-Informed Synthesis',
      description: 'Standard clinical reference ranges and verified medical literature guide every report interpretation.',
    },
    {
      number: '02',
      title: 'Zero Data Selling',
      description: 'Your health records and uploaded documents are private, encrypted, and never sold to third-party data brokers.',
    },
    {
      number: '03',
      title: 'Active Clinical Safeguards',
      description: 'Immediate red-flag triggers connect patients with emergency hotlines if acute symptoms arise.',
    },
  ];

  const services = [
    {
      key: 'analyzer',
      number: '01',
      title: 'Lab Report Vision & OCR',
      description: 'Upload PDF or scanned blood panels to extract numeric biomarkers, detect normal vs out-of-range thresholds, and export structured summaries.',
      icon: FileText,
      badge: 'Vision OCR',
      portalRoute: '/reports/analyze',
      toolTab: 'analyzer',
    },
    {
      key: 'symptoms',
      number: '02',
      title: 'Symptom Triage Engine',
      description: 'Describe sensations in your own words to receive structured condition overviews, general OTC medicine classes, and home-care protocols.',
      icon: Stethoscope,
      badge: 'Clinical Triage',
      portalRoute: '/symptoms/search',
      toolTab: 'symptoms',
    },
    {
      key: 'vitals',
      number: '03',
      title: 'Biometric Trend Tracker',
      description: 'Longitudinal tracking of fasting glucose, total cholesterol, blood pressure, and weight directly on your patient dashboard.',
      icon: Activity,
      badge: 'Vital Trends',
      portalRoute: '/metrics',
      toolTab: 'vitals',
    },
    {
      key: 'habits',
      number: '04',
      title: 'Daily Recovery Habits',
      description: 'Convert complex diagnostic findings and symptom assessments into an actionable daily recovery and lifestyle checklist.',
      icon: CheckSquare,
      badge: 'Habit Engine',
      portalRoute: '/recommendations',
      toolTab: 'habits',
    },
  ];

  const faqs = [
    {
      q: 'How does MediCare AI analyze medical reports?',
      a: 'MediCare AI uses optical character recognition (OCR) and structured clinical models to extract biomarker values, cross-reference standard laboratory ranges, flag abnormal metrics, and synthesize a plain-language summary with lifestyle follow-ups.',
    },
    {
      q: 'Can MediCare AI replace a medical doctor or provide official prescriptions?',
      a: 'No. MediCare AI is strictly an educational and diagnostic informational tool. It does not issue official medical diagnoses or prescribe exact drug dosages. It is designed to prepare you for productive conversations with licensed medical practitioners.',
    },
    {
      q: 'What happens if emergency or red-flag symptoms are detected?',
      a: 'Our clinical triage engine incorporates active safety filters. If symptoms indicate potential emergencies (such as acute chest pain, neurological deficits, or severe breathlessness), the platform immediately prompts emergency SOS hotlines (911 / 112 / 999).',
    },
    {
      q: 'Is my health data private and encrypted?',
      a: 'Yes. MediCare AI is built with privacy-first architecture. Your uploaded files and health records are encrypted, never sold to third-party data brokers, and can be permanently deleted or exported by you at any time.',
    },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 sm:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center min-h-[560px]">
          {/* Left Column: Editorial Statement & Primary CTAs */}
          <div className="space-y-7">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#dcefe9] text-[#084744] dark:bg-[#173b3f] dark:text-[#b8ded5] border border-[#b8ded5] dark:border-[#2c5f64] text-xs font-semibold"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0b5755] dark:text-[#4aa497]" />
              <span>Evidence-Informed Clinical AI</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="display-heading text-[#122b2e] dark:text-white"
            >
              Healthcare,<br />
              <em>made more intelligent.</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="editorial-lead max-w-xl text-[#425b59] dark:text-[#b4cbc6]"
            >
              AI-powered health guidance that helps you understand your symptoms, make sense of complex lab reports, and take the next step with confidence.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => jumpTo('interactive-suite')}
                icon={ArrowRight}
              >
                Try Free Health Suite
              </Button>

              <Button
                variant="secondary"
                size="lg"
                onClick={handleDemoAccess}
                icon={Sparkles}
              >
                1-Click Demo Tour
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.32 }}
              className="pt-2 flex items-center gap-2.5 text-xs text-[#6b8582] dark:text-[#7e9d97]"
            >
              <ShieldCheck className="w-4 h-4 text-[#3d8b72]" />
              <span>Designed to support better conversations with your medical care team.</span>
            </motion.div>
          </div>

          {/* Right Column: Three-Circle Artwork */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="hero-visual">
              {/* Organic Breathing Gradient Canvas (Circle 1) */}
              <div className="hero-art">
                {/* Concentric Orbit Rings (Circles 2 & 3) */}
                <div className="hero-orbit hero-orbit-one" />
                <div className="hero-orbit hero-orbit-two" />

                {/* Center Circle with Clinical Emerald Gradient */}
                <div className="hero-center">
                  <HeartPulse className="w-10 h-10 animate-pulse text-[#dcefe9] dark:text-[#83c4b8]" />
                  <span>care, clearly</span>
                </div>
              </div>

              {/* Floating Live Data Badge 1 */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="hero-data hero-data-top"
              >
                <span className="data-dot" />
                <span>Report clarity <strong>Good</strong></span>
              </motion.div>

              {/* Floating Live Data Badge 2 */}
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="hero-data hero-data-bottom"
              >
                <Activity className="w-4 h-4 text-[#0b5755] dark:text-[#4aa497]" />
                <span>Your health story, connected</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. TRUST & CREDIBILITY BAND */}
      <motion.section
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.45 }}
        className="border-y border-[#e2ebe7] dark:border-[#1c4246] bg-white dark:bg-[#0c1e20] py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustSignals.map((item) => (
              <div key={item.number} className="p-6 rounded-3xl bg-[#f8faf8] dark:bg-[#102629] border border-[#e2ebe7] dark:border-[#1c4246] space-y-2.5 shadow-subtle">
                <span className="text-xs font-black text-[#0b5755] dark:text-[#4aa497] tracking-widest">{item.number}</span>
                <h3 className="text-sm sm:text-base font-bold text-[#122b2e] dark:text-white">{item.title}</h3>
                <p className="text-xs text-[#425b59] dark:text-[#b4cbc6] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 3. INTERACTIVE FREE HEALTH SUITE (4 DEDICATED CLINICAL TOOLS) */}
      <motion.section
        id="interactive-suite"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <span className="eyebrow-badge">Interactive Health Suite</span>
          <h2 className="section-heading-editorial">
            Test our clinical intelligence tools.
          </h2>
          <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6]">
            Select any feature below to try immediate report OCR, symptom triage, vital tracking, or recovery habits.
          </p>
        </div>

        {/* 4-Tab Tool Switcher */}
        <div className="flex justify-center mb-8">
          <div className="p-1.5 rounded-2xl bg-white dark:bg-[#102629] border border-[#e2ebe7] dark:border-[#1c4246] flex flex-wrap justify-center gap-1.5 shadow-subtle">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'analyzer'
                  ? 'bg-[#0b5755] dark:bg-[#4aa497] text-white dark:text-[#091617] shadow-card'
                  : 'text-[#425b59] dark:text-[#b4cbc6] hover:text-[#0b5755]'
              }`}
            >
              <Upload className="w-4 h-4" />
              1. Report OCR
            </button>
            <button
              onClick={() => setActiveTab('symptoms')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'symptoms'
                  ? 'bg-[#0b5755] dark:bg-[#4aa497] text-white dark:text-[#091617] shadow-card'
                  : 'text-[#425b59] dark:text-[#b4cbc6] hover:text-[#0b5755]'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              2. Symptom Triage
            </button>
            <button
              onClick={() => setActiveTab('vitals')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'vitals'
                  ? 'bg-[#0b5755] dark:bg-[#4aa497] text-white dark:text-[#091617] shadow-card'
                  : 'text-[#425b59] dark:text-[#b4cbc6] hover:text-[#0b5755]'
              }`}
            >
              <Activity className="w-4 h-4" />
              3. Vitals Range
            </button>
            <button
              onClick={() => setActiveTab('habits')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'habits'
                  ? 'bg-[#0b5755] dark:bg-[#4aa497] text-white dark:text-[#091617] shadow-card'
                  : 'text-[#425b59] dark:text-[#b4cbc6] hover:text-[#0b5755]'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              4. Action Plan
            </button>
          </div>
        </div>

        {/* Dynamic Tool Stage */}
        <div className="transition-all duration-200">
          {activeTab === 'analyzer' && (
            <HomeReportAnalyzer onEmergencyTrigger={onEmergencyTrigger} />
          )}
          {activeTab === 'symptoms' && (
            <HomeSymptomTriage onEmergencyTrigger={onEmergencyTrigger} />
          )}
          {activeTab === 'vitals' && (
            <HomeVitalsExplorer />
          )}
          {activeTab === 'habits' && (
            <HomeHabitsPreview />
          )}
          {activeTab === 'bot' && (
            <HomeAiAssistantBot onEmergencyTrigger={onEmergencyTrigger} />
          )}
        </div>
      </motion.section>

      {/* 4. PLATFORM CORE CAPABILITIES WITH DUAL-ACTION ROUTING */}
      <section id="services" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.45 }}
          className="max-w-2xl mb-12"
        >
          <span className="eyebrow-badge">Platform Capabilities</span>
          <h2 className="section-heading-editorial mt-2">
            Care designed around your needs.
          </h2>
          <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6] mt-2">
            Each tool connects directly to your patient health record for longitudinal intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(({ key, number, title, description, badge, portalRoute, toolTab, icon: Icon }, index) => (
            <motion.div
              key={number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              whileHover={{ y: -4 }}
              className="glass-card rounded-3xl p-7 shadow-card border border-[#e2ebe7] dark:border-[#1c4246] flex flex-col justify-between space-y-5 hover:border-[#b8ded5] transition-all group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#dcefe9] dark:bg-[#173b3f] text-[#0b5755] dark:text-[#83c4b8] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#f3f7f5] dark:bg-[#143236] text-[#0b5755] dark:text-[#83c4b8] border border-[#d7e4e0] dark:border-[#1c4246]">
                    {badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold font-serif-heading text-[#122b2e] dark:text-white group-hover:text-[#0b5755] dark:group-hover:text-[#4aa497] transition-colors">
                  {title}
                </h3>
                <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6] leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Dual Action Buttons */}
              <div className="pt-3 border-t border-[#e2ebe7] dark:border-[#1c4246] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab(toolTab);
                    jumpTo('interactive-suite');
                  }}
                  className="text-xs font-bold text-[#0b5755] dark:text-[#4aa497] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Test Free Demo Tool</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDirectPortalTour(portalRoute)}
                  className="text-xs font-semibold text-[#6b8582] dark:text-[#7e9d97] hover:text-[#122b2e] dark:hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <span>Open in Portal</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5. HOW IT WORKS TIMELINE */}
      <motion.section
        id="how-it-works"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-[#122b2e] dark:bg-[#071314] text-white py-20 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-[#83c4b8]">
              Methodology
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-white mt-2">
              From uncertainty to a clear next step.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Bring your question',
                body: 'Upload a scanned lab report PDF, paste raw values, or describe a symptom in your own words.',
              },
              {
                step: '02',
                title: 'Make sense of it',
                body: 'Our engine extracts numeric biomarkers, explains findings in plain language, and highlights active safety boundaries.',
              },
              {
                step: '03',
                title: 'Keep moving forward',
                body: 'Track longitudinal biometric trends, check off recovery habits, and arrive at your next doctor consultation prepared.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="p-7 rounded-3xl bg-[#173b3f]/70 border border-[#2c5f64] space-y-3 relative"
              >
                <span className="text-xs font-bold text-[#83c4b8] tracking-widest">{item.step}</span>
                <h3 className="text-xl font-bold font-serif-heading text-white">{item.title}</h3>
                <p className="text-xs sm:text-sm text-[#dcefe9] leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 6. SAFETY, PRIVACY & CLINICAL BOUNDARIES */}
      <section id="safety" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45 }}
          className="rounded-3xl bg-[#eaf5f0]/80 dark:bg-[#102629] p-8 sm:p-12 border border-[#b8ded5] dark:border-[#1c4246] grid lg:grid-cols-[1fr_1.2fr] gap-10 items-center shadow-card"
        >
          <div className="space-y-3">
            <span className="eyebrow-badge">Designed with Boundaries</span>
            <h2 className="section-heading-editorial">
              Technology should make care more human.
            </h2>
            <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6]">
              Clinical safety rules, zero medical over-promising, and absolute patient privacy.
            </p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6] leading-relaxed border-l-2 border-[#0b5755] dark:border-[#4aa497] pl-6">
            <p>
              Our tools provide educational diagnostic synthesis and symptom triage—not definitive clinical diagnoses or drug prescriptions.
            </p>
            <p>
              Built-in red-flag filters actively prompt regional emergency evaluation (911 / 112 / 999) if acute indicators are detected.
            </p>
            <button
              type="button"
              onClick={() => jumpTo('faq')}
              className="editorial-link text-[#0b5755] dark:text-[#4aa497] font-bold cursor-pointer"
            >
              Read Clinical FAQ <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* 7. PATIENT TESTIMONIAL QUOTE */}
      <section id="testimonials" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="glass-card rounded-3xl p-8 sm:p-14 shadow-elevation border border-[#e2ebe7] dark:border-[#1c4246] border-l-4 border-l-[#0b5755] dark:border-l-[#4aa497] space-y-4"
        >
          <span className="eyebrow-badge">The Experience Matters</span>
          <blockquote className="text-2xl sm:text-4xl font-serif-heading font-medium text-[#122b2e] dark:text-white leading-tight">
            “Everything felt simpler from the moment I started. I could finally see what my lab numbers meant and what questions to ask my physician next.”
          </blockquote>
          <p className="text-xs text-[#6b8582] dark:text-[#7e9d97] pt-2">
            Patient health experience · Designed with clinical integrity
          </p>
        </motion.div>
      </section>

      {/* 8. FAQ SECTION */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
          className="text-center max-w-2xl mx-auto mb-10 space-y-2"
        >
          <span className="eyebrow-badge">Questions, Answered</span>
          <h2 className="section-heading-editorial">
            A more reassuring place to start.
          </h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="glass-card rounded-2xl border border-[#e2ebe7] dark:border-[#1c4246] overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-[#122b2e] dark:text-white cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="text-lg font-normal text-[#0b5755] dark:text-[#4aa497] ml-4">
                  {openFaq === idx ? '−' : '+'}
                </span>
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6] leading-relaxed border-t border-[#e2ebe7]/60 dark:border-[#1c4246]/60 pt-3">
                  {faq.a}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 9. HIGH-IMPACT CLOSING CTA */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl bg-[#0b5755] dark:bg-[#102629] text-white p-8 sm:p-14 shadow-elevation border border-[#3d8b72]/40 dark:border-[#1c4246] flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#dcefe9] dark:text-[#83c4b8]">
              A better health experience begins here
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif-heading text-white">
              Your health deserves<br /><em>a little more clarity.</em>
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="lg"
              onClick={handleDemoAccess}
              icon={ArrowRight}
              className="w-full sm:w-auto"
            >
              Enter Patient Portal
            </Button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default LandingPage;
