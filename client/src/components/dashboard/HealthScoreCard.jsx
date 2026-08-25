import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Sparkles } from 'lucide-react';

const HealthScoreCard = ({ score = 85, taskRate = 75, reportsCount = 2 }) => {
  const getScoreStatus = (val) => {
    if (val >= 80) return { label: 'Optimal / Stable', color: 'text-[#1c644d] dark:text-[#86e2bf]', rail: '' };
    if (val >= 60) return { label: 'Moderate / Attention', color: 'text-[#d97706]', rail: 'status-rail--warning' };
    return { label: 'Elevated Risk', color: 'text-[#dc2626]', rail: 'status-rail--critical' };
  };

  const status = getScoreStatus(score);

  return (
    <div className={`glass-card status-rail ${status.rail} rounded-3xl p-6 sm:p-7 shadow-card relative overflow-hidden`}>
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#6b8582] dark:text-[#7e9d97] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#0b5755] dark:text-[#4aa497]" />
            AI Health Wellness Index
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl sm:text-5xl font-bold font-serif-heading text-[#122b2e] dark:text-white tracking-tight">
              {score}
            </span>
            <span className="text-sm font-semibold text-[#6b8582]">/ 100</span>
          </div>
          <p className={`text-xs sm:text-sm font-bold mt-1 ${status.color}`}>
            Status: {status.label}
          </p>
        </div>

        {/* Circular Progress Ring */}
        <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#e2ebe7] dark:text-[#1c4246]"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#0b5755] dark:text-[#4aa497] transition-all duration-1000 ease-out"
              strokeDasharray={`${score}, 100`}
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <ShieldCheck className="w-6 h-6 text-[#0b5755] dark:text-[#4aa497]" />
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[#e2ebe7] dark:border-[#1c4246] grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="text-[#6b8582] dark:text-[#7e9d97]">Reports Analyzed</p>
          <p className="font-bold text-[#122b2e] dark:text-white text-sm mt-0.5">
            {reportsCount} Documents
          </p>
        </div>
        <div>
          <p className="text-[#6b8582] dark:text-[#7e9d97]">Task Completion</p>
          <p className="font-bold text-[#122b2e] dark:text-white text-sm mt-0.5">
            {taskRate}% Completed
          </p>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreCard;
