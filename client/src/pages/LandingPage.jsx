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

const LegacyLandingPage = ({ onEmergencyTrigger }) => {
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
    <div className="space-y-24 pb-20 bg-[#f6f8f7] dark:bg-[#0d2527]">
      {/* Hero Section */}
      <section className="relative pt-10 sm:pt-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dcefe9] text-[#0b5755] dark:bg-[#173b3f] dark:text-[#b8ded5] border border-[#b8ded5] text-xs sm:text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>100% Free AI Clinical Assistant & Report Analyzer</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-6xl font-semibold tracking-tight text-[#173b3f] dark:text-white leading-[1.15]"
          >
            Clinical Intelligence.{' '}
            <span className="text-[#0f6b68] dark:text-[#83c4b8]">
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
          <div className="glass-card p-1.5 rounded-lg flex gap-2 border border-[#b8ded5]">
            <button
              onClick={() => setActiveTab('analyzer')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'analyzer'
                  ? 'bg-[#0f6b68] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0f6b68]'
              }`}
            >
              <Upload className="w-4 h-4" />
              Upload & Analyze Report
            </button>
            <button
              onClick={() => setActiveTab('bot')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'bot'
                  ? 'bg-[#0f6b68] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-[#0f6b68]'
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
            <div key={item.step} className="glass-card rounded-lg p-7 space-y-3">
              <span className="text-xs font-black text-[#0f6b68]">{item.step}</span>
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

const LandingPage = ({ onEmergencyTrigger }) => {
  const { demoLogin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analyzer');
  const [openFaq, setOpenFaq] = useState(0);

  const handleDemoAccess = async () => {
    const res = await demoLogin();
    if (res.success) navigate('/dashboard');
  };

  const jumpTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

  const trustSignals = [
    ['01', 'Plain-language care', 'Understand reports and symptoms without the clinical fog.'],
    ['02', 'Built around you', 'Save context, track trends, and keep your next step close.'],
    ['03', 'Safety stays visible', 'Clear boundaries and red-flag guidance are part of every flow.'],
  ];

  const services = [
    { number: '01', title: 'Report intelligence', description: 'Turn lab reports into a calmer, clearer starting point.', icon: FileText },
    { number: '02', title: 'Symptom guidance', description: 'Explore what your symptoms may mean and when to seek help.', icon: Stethoscope },
    { number: '03', title: 'Health trends', description: 'See the story in your biometrics over time, not just one result.', icon: LineChart },
    { number: '04', title: 'Next-step planning', description: 'Move from information to practical, manageable health tasks.', icon: CheckCircle2 },
  ];

  const faqs = [
    ['How do I book an appointment?', 'MediCare AI is currently a digital health companion. Start with a report or symptom check, then use the guidance to prepare for a conversation with your clinician.'],
    ['Can I choose my doctor?', 'The patient portal is designed to keep your health context organized for the healthcare professional you choose.'],
    ['Do you offer online consultations?', 'The platform supports digital health tools and an AI assistant. It does not replace an online consultation with a licensed professional.'],
    ['How can I access my health information?', 'Create an account to save reports, recommendations, and biometric trends in your private patient portal.'],
  ];

  return (
    <div className="premium-home pb-20">
      <section className="premium-hero px-5 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.05fr_.95fr] gap-12 lg:gap-20 items-center min-h-[680px] py-16 lg:py-24">
          <div className="max-w-2xl">
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="eyebrow mb-7">A clearer way to care for your health</motion.p>
            <motion.h1 initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="display-heading">
              Your health,<br /><em>in better focus.</em>
            </motion.h1>
            <motion.p initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .16 }} className="hero-copy mt-7 max-w-xl">
              Thoughtful technology for understanding reports, exploring symptoms, and taking the next step with more confidence.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .24 }} className="flex flex-wrap gap-3 mt-9">
              <Button variant="primary" size="lg" onClick={handleDemoAccess} icon={ArrowRight}>Explore the patient portal</Button>
              <button type="button" onClick={() => jumpTo('interactive-suite')} className="premium-text-link">Try a health tool <ArrowRight className="w-4 h-4" /></button>
            </motion.div>
            <div className="hero-note mt-10 flex items-center gap-3 text-sm"><ShieldCheck className="w-5 h-5 text-[#3d8b72]" /><span>Information designed to support better conversations with your care team.</span></div>
          </div>
          <motion.div initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .7 }} className="relative">
            <div className="hero-visual"><div className="hero-art"><div className="hero-orbit hero-orbit-one" /><div className="hero-orbit hero-orbit-two" /><div className="hero-center"><HeartPulse className="w-11 h-11" /><span>care, clearly</span></div></div><div className="hero-data hero-data-top"><span className="data-dot" />Report clarity <strong>Good</strong></div><div className="hero-data hero-data-bottom"><Activity className="w-4 h-4" /> Your health story, connected</div></div>
          </motion.div>
        </div>
      </section>

      <section className="trust-band border-y border-[#d7e2df] px-5 sm:px-8 lg:px-12"><div className="max-w-7xl mx-auto py-7 grid md:grid-cols-[.7fr_1fr] gap-8 items-center"><p className="serif-lead text-xl">Trusted care starts with a clearer conversation.</p><div className="grid sm:grid-cols-3 gap-6">{trustSignals.map(([number, title, text]) => <div key={number} className="trust-item"><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

      <section id="features" className="premium-section px-5 sm:px-8 lg:px-12"><div className="max-w-7xl mx-auto grid lg:grid-cols-[.8fr_1.2fr] gap-14"><div><p className="eyebrow">One calm place to begin</p><h2 className="section-heading mt-4">Care designed around your needs.</h2><p className="section-copy mt-5">From the first question to the next appointment, MediCare AI helps make your health information more useful and less overwhelming.</p></div><div className="service-list">{services.map(({ number, title, description, icon: Icon }) => <button type="button" key={number} onClick={() => jumpTo('interactive-suite')} className="service-row"><span className="service-number">{number}</span><Icon className="w-5 h-5 text-[#3d8b72]" /><span className="text-left flex-1"><strong>{title}</strong><small>{description}</small></span><ArrowRight className="w-5 h-5 service-arrow" /></button>)}</div></div></section>

      <section id="how-it-works" className="journey-band px-5 sm:px-8 lg:px-12"><div className="max-w-7xl mx-auto"><p className="eyebrow">How it works</p><h2 className="section-heading mt-4 max-w-lg">From uncertainty to a useful next step.</h2><div className="journey-grid mt-14">{[['01', 'Bring your question', 'Upload a report, paste clinical text, or describe a symptom in your own words.'], ['02', 'Make sense of it', 'Our tools organize the detail and explain it in plain language, with safety boundaries in view.'], ['03', 'Keep moving forward', 'Save what matters, track changes, and arrive at your next care conversation prepared.']].map(([number, title, text]) => <div key={number} className="journey-step"><span>{number}</span><h3>{title}</h3><p>{text}</p></div>)}</div></div></section>

      <section id="interactive-suite" className="premium-section px-5 sm:px-8 lg:px-12"><div className="max-w-7xl mx-auto"><div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-9"><div><p className="eyebrow">Start here</p><h2 className="section-heading mt-4">A little clarity, right now.</h2></div><p className="section-copy max-w-md">Try the tools without creating an account. Your health information deserves a thoughtful first read.</p></div><div className="tool-switcher"><button type="button" className={activeTab === 'analyzer' ? 'active' : ''} onClick={() => setActiveTab('analyzer')}><Upload className="w-4 h-4" /> Analyze a report</button><button type="button" className={activeTab === 'bot' ? 'active' : ''} onClick={() => setActiveTab('bot')}><MessageSquare className="w-4 h-4" /> Ask the assistant</button></div><div className="tool-stage">{activeTab === 'analyzer' ? <HomeReportAnalyzer onEmergencyTrigger={onEmergencyTrigger} /> : <HomeAiAssistantBot onEmergencyTrigger={onEmergencyTrigger} />}</div></div></section>

      <section id="safety" className="safety-section px-5 sm:px-8 lg:px-12"><div className="max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-12 items-center"><div><p className="eyebrow">Designed with boundaries</p><h2 className="section-heading mt-4">Technology should make care more human.</h2></div><div className="safety-copy"><ShieldAlert className="w-7 h-7 text-[#3d8b72]" /><p>Our tools provide educational information, not diagnoses or prescriptions. Red-flag prompts encourage urgent care when symptoms may require immediate attention.</p><button type="button" onClick={() => jumpTo('faq')} className="premium-text-link mt-5">Read common questions <ArrowRight className="w-4 h-4" /></button></div></div></section>

      <section id="testimonials" className="premium-section px-5 sm:px-8 lg:px-12"><div className="max-w-5xl mx-auto quote-block"><p className="eyebrow">The experience matters</p><blockquote>“Everything felt simpler from the moment I started. I could finally see what to ask next.”</blockquote><p className="quote-meta">Placeholder patient story · For demonstration purposes</p></div></section>

      <section id="faq" className="faq-section px-5 sm:px-8 lg:px-12"><div className="max-w-3xl mx-auto"><p className="eyebrow">Questions, answered</p><h2 className="section-heading mt-4 mb-10">A more reassuring place to start.</h2>{faqs.map(([question, answer], index) => <div key={question} className="faq-row"><button type="button" onClick={() => setOpenFaq(openFaq === index ? -1 : index)} aria-expanded={openFaq === index}><span>{question}</span><span className="faq-plus">{openFaq === index ? '−' : '+'}</span></button>{openFaq === index && <p>{answer}</p>}</div>)}</div></section>

      <section className="closing-cta px-5 sm:px-8 lg:px-12"><div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8"><div><p className="eyebrow text-[#b7d8c9]">A better health experience begins here</p><h2 className="display-heading text-white mt-4">Your health deserves<br /><em>a little more clarity.</em></h2></div><Button variant="secondary" size="lg" onClick={handleDemoAccess} icon={ArrowRight}>Enter the patient portal</Button></div></section>
    </div>
  );
};

export default LandingPage;
