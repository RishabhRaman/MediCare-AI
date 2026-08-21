import React, { useState } from 'react';
import { Search, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import Button from '../ui/Button';

const quickSymptoms = [
  'Acid reflux & burning chest after dinner',
  'Throbbing migraine with light sensitivity',
  'Persistent dry cough with mild fever',
  'Lower back dull ache after exercise',
  'Sudden dizziness & fatigue upon standing',
  'Seasonal sneezing with itchy eyes',
];

const SymptomSearchBox = ({ onSearch, isSearching }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim() || isSearching) return;
    onSearch(query.trim());
  };

  const handleChipClick = (symptom) => {
    setQuery(symptom);
    onSearch(symptom);
  };

  return (
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          AI Symptom Triage & Condition Search
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Describe your symptoms in natural language to receive clinical insights, general OTC categories, and home-care recovery steps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Describe what you are experiencing (e.g. Sharp throat pain and fever for 2 days)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl text-sm sm:text-base border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 pl-12 pr-32 py-3.5 sm:py-4 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40 shadow-inner"
          />
          <div className="absolute right-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!query.trim() || isSearching}
              loading={isSearching}
              icon={Sparkles}
              className="shadow-md shadow-sky-500/20"
            >
              Analyze
            </Button>
          </div>
        </div>
      </form>

      {/* Common Symptom Chips */}
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2.5 uppercase tracking-wider">
          Quick Symptom Presets:
        </p>
        <div className="flex flex-wrap gap-2">
          {quickSymptoms.map((symptom, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(symptom)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800/80 hover:bg-sky-50 dark:hover:bg-sky-950/60 hover:text-sky-600 dark:hover:text-sky-400 hover:border-sky-500/40 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 transition-all text-left"
            >
              {symptom}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SymptomSearchBox;
