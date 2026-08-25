import React from 'react';
import { ShieldAlert } from 'lucide-react';

const DisclaimerBanner = () => {
  return (
    <div className="bg-[#122b2e] dark:bg-[#071314] text-[#dcefe9] border-b border-[#1c4246] px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-[#83c4b8] shrink-0" />
          <span className="text-[11px] sm:text-xs">
            <strong className="text-[#83c4b8] font-bold">Clinical Notice:</strong>{' '}
            MediCare AI provides informational and educational guidance. It does not replace clinical diagnosis, treatment, or direct physician care.
          </span>
        </div>
        <span className="hidden md:inline-block text-[10px] font-semibold text-[#83c4b8] bg-[#173b3f] px-2.5 py-0.5 rounded-full border border-[#2c5f64]">
          Emergency: Dial 911 / 112 / 999
        </span>
      </div>
    </div>
  );
};

export default DisclaimerBanner;
