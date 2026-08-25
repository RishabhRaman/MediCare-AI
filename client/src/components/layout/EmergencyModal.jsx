import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, PhoneCall, X, ShieldAlert } from 'lucide-react';
import Button from '../ui/Button';

const EmergencyModal = ({ isOpen, onClose, triggerReason }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Dark Red Blurring Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#3b0d0c]/85 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.94, y: 16, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.94, y: 16, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl bg-[#091617] border-2 border-red-500 rounded-3xl shadow-glow-red p-6 sm:p-8 z-10 text-white"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">
                <AlertOctagon className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] uppercase font-bold tracking-widest text-red-400">
                  Critical Emergency Protocol
                </span>
                <h3 className="text-xl font-bold font-serif-heading text-white">
                  Potentially Life-Threatening Indicators
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#7e9d97] hover:text-white p-1 rounded-lg hover:bg-[#143236] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-100 text-sm leading-relaxed">
            <p className="font-bold text-red-300 mb-1 text-xs uppercase tracking-wider">Trigger Condition:</p>
            <p className="font-medium">{triggerReason || 'Severe symptoms or abnormal lab markers requiring immediate medical evaluation.'}</p>
          </div>

          <div className="mt-5 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#b4cbc6]">
              Immediate Life-Safety Protocol:
            </h4>
            <ul className="text-xs text-[#dcefe9] space-y-1.5 list-disc list-inside">
              <li>Call your regional emergency hotline immediately (Do not delay).</li>
              <li>Do not drive yourself — seek transport via emergency medical services.</li>
              <li>Rest in a comfortable, upright or relaxed position while awaiting responders.</li>
              <li>Keep exterior doors unlocked for emergency response access.</li>
            </ul>
          </div>

          {/* Quick Call Actions */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:911"
              className="flex items-center justify-center gap-2.5 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all text-center text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              Call 911 (US / Canada)
            </a>
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2.5 py-3 px-4 bg-red-800 hover:bg-red-900 text-white font-bold rounded-xl shadow-lg transition-all text-center text-sm"
            >
              <PhoneCall className="w-4 h-4" />
              Call 112 / 999 (EU / UK / Asia)
            </a>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={onClose}
              className="text-xs text-[#7e9d97] hover:text-[#edf7f3] underline transition-colors cursor-pointer"
            >
              I understand. Dismiss alert and return to application.
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default EmergencyModal;
