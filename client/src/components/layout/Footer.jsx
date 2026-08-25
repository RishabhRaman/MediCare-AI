import React from 'react';
import { Link } from 'react-router-dom';
import { HeartPulse, ShieldCheck, Lock, Activity } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-[#e2ebe7] dark:border-[#1c4246] bg-white dark:bg-[#091617] py-14 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#0b5755] dark:bg-[#4aa497] flex items-center justify-center text-white dark:text-[#091617]">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold font-serif-heading tracking-tight text-[#122b2e] dark:text-white">
                MediCare AI
              </span>
            </div>
            <p className="text-xs text-[#425b59] dark:text-[#b4cbc6] max-w-sm leading-relaxed">
              Thoughtful clinical intelligence designed to help patients understand complex diagnostic reports, evaluate symptoms safely, and prepare for productive conversations with their care team.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-[#6b8582] dark:text-[#7e9d97] pt-1">
              <span className="flex items-center gap-1.5 text-[#0b5755] dark:text-[#4aa497] font-medium">
                <ShieldCheck className="w-4 h-4" /> HIPAA-Inspired Architecture
              </span>
              <span className="flex items-center gap-1.5 text-[#3d8b72] font-medium">
                <Lock className="w-3.5 h-3.5" /> End-to-End Encrypted
              </span>
            </div>
          </div>

          {/* Platform Features */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#122b2e] dark:text-white">
              Health Suite
            </h4>
            <ul className="space-y-2.5 text-xs text-[#425b59] dark:text-[#b4cbc6]">
              <li><Link to="/reports/analyze" className="hover:text-[#0b5755] dark:hover:text-[#4aa497] transition-colors">Lab Report Analyzer</Link></li>
              <li><Link to="/symptoms/search" className="hover:text-[#0b5755] dark:hover:text-[#4aa497] transition-colors">Symptom Triage Engine</Link></li>
              <li><Link to="/metrics" className="hover:text-[#0b5755] dark:hover:text-[#4aa497] transition-colors">Biometric Trend Tracker</Link></li>
              <li><Link to="/recommendations" className="hover:text-[#0b5755] dark:hover:text-[#4aa497] transition-colors">Recovery & Habit Engine</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#122b2e] dark:text-white">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-xs text-[#425b59] dark:text-[#b4cbc6]">
              <li><a href="/?section=interactive-suite" className="hover:text-[#0b5755] dark:hover:text-[#4aa497] transition-colors">Free AI Assistant</a></li>
              <li><a href="/?section=how-it-works" className="hover:text-[#0b5755] dark:hover:text-[#4aa497] transition-colors">How It Works</a></li>
              <li><a href="/?section=insights" className="hover:text-[#0b5755] dark:hover:text-[#4aa497] transition-colors">Health Insights</a></li>
              <li><a href="/?section=doctors" className="hover:text-[#0b5755] dark:hover:text-[#4aa497] transition-colors">Clinical Advisors</a></li>
              <li><a href="/?section=safety" className="hover:text-[#0b5755] dark:hover:text-[#4aa497] transition-colors">Safety Protocol</a></li>
            </ul>
          </div>

          {/* Compliance & Safety Notice */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#122b2e] dark:text-white">
              Clinical Disclaimer
            </h4>
            <p className="text-[11px] text-[#6b8582] dark:text-[#7e9d97] leading-relaxed">
              MediCare AI provides informational and diagnostic educational synthesis. It does not provide definitive medical diagnoses, prescriptions, or replace direct clinical consultation with a licensed healthcare practitioner.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-[#e2ebe7] dark:border-[#1c4246] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6b8582] dark:text-[#7e9d97]">
          <p>© {new Date().getFullYear()} MediCare AI Health Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Evidence-Informed</span>
            <span>Zero Data Selling</span>
            <span>v1.0.0 Stable</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
