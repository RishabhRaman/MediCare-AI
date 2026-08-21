import React from 'react';
import { ShieldAlert } from 'lucide-react';

const DisclaimerBanner = () => {
  return (
    <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-950 text-slate-300 border-b border-sky-500/20 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-sky-400 shrink-0" />
          <span>
            <strong className="text-sky-300 font-semibold">Clinical Notice:</strong>{' '}
            MediCare AI provides informational synthesis and is not a substitute for licensed clinical diagnosis or prescription dosing.
          </span>
        </div>
        <span className="hidden md:inline-block text-[11px] text-slate-400 bg-sky-900/40 px-2 py-0.5 rounded-full border border-sky-500/30">
          In emergency, dial 911 / 112
        </span>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
