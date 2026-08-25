import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import Button from '../ui/Button';

const quickSymptoms = [
  'Acid reflux & burning sensation after meals',
  'Throbbing tension headache with light sensitivity',
  'Persistent dry cough with low-grade fever',
  'Lower back muscle tightness after exercise',
  'Sudden lightheadedness upon standing up',
  'Seasonal sneezing and scratchy throat',
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
    <div className="glass-card rounded-3xl p-6 sm:p-8 shadow-elevation space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold font-serif-heading text-[#122b2e] dark:text-white">
          Symptom Triage & Clinical Assessment
        </h2>
        <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6] mt-1">
          Describe what you are experiencing in your own words to receive structured insights, safe OTC categories, and home-care recovery steps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-5 h-5 text-[#6b8582]" />
          <input
            type="text"
            placeholder="Describe what you are experiencing (e.g. Sharp throat pain and fever for 2 days)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-2xl text-xs sm:text-sm border border-[#d6e4df] dark:border-[#1c4246] bg-[#f8faf8] dark:bg-[#0c1e20] pl-12 pr-32 py-3.5 sm:py-4 text-[#122b2e] dark:text-[#edf7f3] placeholder-[#7e9d97] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0b5755]/30"
          />
          <div className="absolute right-2">
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={!query.trim() || isSearching}
              loading={isSearching}
              icon={Sparkles}
            >
              Triage
            </Button>
          </div>
        </div>
      </form>

      {/* Common Symptom Chips */}
      <div>
        <p className="text-[10px] font-bold text-[#6b8582] dark:text-[#7e9d97] mb-2.5 uppercase tracking-wider">
          Suggested Symptom Presets:
        </p>
        <div className="flex flex-wrap gap-2">
          {quickSymptoms.map((symptom, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleChipClick(symptom)}
              className="px-3 py-1.5 rounded-xl text-xs font-medium bg-[#f8faf8] dark:bg-[#0c1e20] hover:bg-[#dcefe9] dark:hover:bg-[#173b3f] hover:text-[#0b5755] dark:hover:text-[#83c4b8] border border-[#e2ebe7] dark:border-[#1c4246] text-[#425b59] dark:text-[#b4cbc6] transition-all text-left cursor-pointer"
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
