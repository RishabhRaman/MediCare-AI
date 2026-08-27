import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Search,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import SymptomTriageResult from '../symptoms/SymptomTriageResult';
import toast from 'react-hot-toast';

const PRESET_SYMPTOMS = [
  'Throbbing right-sided headache with nausea and light sensitivity',
  'Post-meal extreme fatigue, dry mouth, and frequent urination',
  'Mild persistent dry cough with low-grade evening chills',
  'Sharp left-sided chest pain radiating to shoulder with shortness of breath',
];

const HomeSymptomTriage = ({ onEmergencyTrigger }) => {
  const { isAuthenticated } = useAuth();
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleTriage = async (searchQuery) => {
    const textToSearch = searchQuery || query;
    if (!textToSearch || textToSearch.trim().length < 3) {
      toast.error('Please enter a symptom description (min. 3 characters).');
      return;
    }

    setLoading(true);
    try {
      const endpoint = isAuthenticated ? '/search/symptoms' : '/search/public-symptoms';
      const res = await api.post(endpoint, { query: textToSearch });

      if (res.data.success) {
        setResult(res.data.aiResult);
        toast.success('Clinical symptom triage synthesized!');

        if (res.data.aiResult?.isEmergency && onEmergencyTrigger) {
          onEmergencyTrigger(res.data.aiResult?.emergencyWarning || 'High-risk red-flag symptoms detected.');
        }
      }
    } catch (err) {
      toast.error(err.message || 'Symptom triage failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePresetClick = (preset) => {
    setQuery(preset);
    handleTriage(preset);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-10 shadow-elevation border border-[#e2ebe7] dark:border-[#1c4246] space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e2ebe7] dark:border-[#1c4246]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#dcefe9] dark:bg-[#173b3f] text-[#0b5755] dark:text-[#83c4b8] flex items-center justify-center shrink-0 shadow-subtle">
            <Stethoscope className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif-heading text-[#122b2e] dark:text-white">
              AI Symptom Triage Engine
            </h3>
            <p className="text-xs text-[#425b59] dark:text-[#b4cbc6]">
              Instant natural language evaluation with red-flag emergency detection.
            </p>
          </div>
        </div>

        {result && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setResult(null);
              setQuery('');
            }}
            icon={RotateCcw}
          >
            New Symptom Search
          </Button>
        )}
      </div>

      {!result ? (
        <div className="space-y-6 max-w-3xl mx-auto">
          {/* Search Input Box */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#425b59] dark:text-[#b4cbc6]">
              Describe your symptoms in your own words
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., I have had a sharp lower back pain for 2 days that radiates down my left leg, worse when sitting..."
                className="w-full rounded-2xl border border-[#d6e4df] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#0c1e20] p-4 text-xs sm:text-sm text-[#122b2e] dark:text-[#edf7f3] placeholder-[#7e9d97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30 resize-none"
              />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs text-[#6b8582] dark:text-[#7e9d97]">
                <ShieldCheck className="w-4 h-4 text-[#3d8b72]" />
                <span>Evaluated against verified clinical triage guidelines.</span>
              </div>
              <Button
                variant="primary"
                size="md"
                onClick={() => handleTriage(query)}
                loading={loading}
                icon={Search}
                className="px-6"
              >
                Analyze Symptoms
              </Button>
            </div>
          </div>

          {/* Quick Presets for Instant Testing */}
          <div className="space-y-2.5 pt-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b8582] dark:text-[#7e9d97]">
              Or test with sample symptom queries:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_SYMPTOMS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className="text-left p-3 rounded-xl bg-[#f3f7f5] dark:bg-[#143236] border border-[#e2ebe7] dark:border-[#1c4246] hover:border-[#b8ded5] dark:hover:border-[#2c5f64] text-xs text-[#122b2e] dark:text-[#edf7f3] transition-all cursor-pointer group flex items-center justify-between"
                >
                  <span className="line-clamp-1 pr-2">{preset}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#6b8582] group-hover:text-[#0b5755] dark:group-hover:text-[#4aa497] group-hover:translate-x-0.5 transition-transform shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <SymptomTriageResult result={result} query={query} />
        </motion.div>
      )}
    </div>
  );
};

export default HomeSymptomTriage;
