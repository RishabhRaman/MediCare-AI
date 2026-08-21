import React from 'react';
import { HeartPulse, Shield, Lock, FileText } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/60 backdrop-blur-md py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-white shadow-sm">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 bg-clip-text text-transparent">
                MediCare AI
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Empowering patients with plain-language diagnostic summaries, intelligent symptom triage, and proactive biometric tracking. Built with clinical integrity and human empathy.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-sky-400" /> HIPAA-Inspired Architecture
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> End-to-End Encrypted
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Platform Features
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><a href="/reports/analyze" className="hover:text-sky-500 transition-colors">Lab Report Analyzer</a></li>
              <li><a href="/symptoms/search" className="hover:text-sky-500 transition-colors">Symptom Triage Engine</a></li>
              <li><a href="/metrics" className="hover:text-sky-500 transition-colors">Biometric Trend Tracker</a></li>
              <li><a href="/recommendations" className="hover:text-sky-500 transition-colors">Personal Action Tasks</a></li>
            </ul>
          </div>

          {/* Compliance & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Medical Disclaimer
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              MediCare AI is an educational and diagnostic informational tool. It does not provide medical diagnoses or prescriptions. Always consult a licensed medical physician for health concerns.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} MediCare AI Health Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Clinical Precision</span>
            <span>Zero Data Selling</span>
            <span>v1.0.0 Stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
