import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles } from 'lucide-react';

const HealthScoreCard = ({ score = 85, taskRate = 75, reportsCount = 2 }) => {
  const getScoreStatus = (val) => {
    if (val >= 80) return { label: 'Optimal / Stable', color: 'text-[#3d8b72]', rail: '' };
    if (val >= 60) return { label: 'Moderate / Attention', color: 'text-[#c9822b]', rail: 'status-rail--warning' };
    return { label: 'Elevated Risk', color: 'text-[#c4534a]', rail: 'status-rail--critical' };
  };

  const status = getScoreStatus(score);

  return (
    <div className={`glass-card status-rail ${status.rail} rounded-lg p-6 sm:p-7 relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0f6b68]" />
            AI Health Wellness Index
          </span>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white tracking-tight">
              {score}
            </span>
            <span className="text-sm font-semibold text-slate-500">/ 100</span>
          </div>
          <p className={`text-xs sm:text-sm font-bold mt-1 ${status.color}`}>
            Status: {status.label}
          </p>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#d7e2df] dark:text-[#294543]"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#0f6b68] transition-all duration-1000 ease-out"
              strokeDasharray={`${score}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-[#0f6b68]" />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-slate-500 dark:text-slate-400">Reports Analyzed</p>
          <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
            {reportsCount} Documents
          </p>
        </div>
        <div>
          <p className="text-slate-500 dark:text-slate-400">Task Completion</p>
          <p className="font-bold text-slate-900 dark:text-white text-sm mt-0.5">
            {taskRate}% Completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreCard;
