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
          className="fixed inset-0 bg-red-950/80 backdrop-blur-md"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          className="relative w-full max-w-xl bg-slate-900 border-2 border-red-500 rounded-3xl shadow-glow-red p-6 sm:p-8 z-10 text-white"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center text-red-400">
                <AlertOctagon className="w-7 h-7 animate-pulse" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-red-400">
                  Critical Emergency Protocol
                </span>
                <h3 className="text-xl font-bold text-white">
                  Potentially Life-Threatening Symptoms Detected
                </h3>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-red-950/50 border border-red-500/30 text-red-200 text-sm leading-relaxed">
            <p className="font-semibold text-red-300 mb-1">Trigger Condition:</p>
            <p>{triggerReason || 'Severe symptoms requiring immediate medical evaluation.'}</p>
          </div>

          <div className="mt-5 space-y-3">
            <h4 className="text-sm font-semibold text-slate-300">
              Immediate Life-Safety Instructions:
            </h4>
            <ul className="text-xs text-slate-300 space-y-2 list-disc list-inside">
              <li>Call your regional emergency hotline immediately (Do not wait).</li>
              <li>Do not drive yourself — have an ambulance or family member transport you.</li>
              <li>Sit or rest in a safe, comfortable position while awaiting responders.</li>
              <li>Keep front doors unlocked so paramedics can enter.</li>
            </ul>
          </div>

          {/* Quick Call Actions */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href="tel:911"
              className="flex items-center justify-center gap-2.5 py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all text-center"
            >
              <PhoneCall className="w-5 h-5" />
              Call 911 (US / Canada)
            </a>
            <a
              href="tel:112"
              className="flex items-center justify-center gap-2.5 py-3 px-4 bg-red-800 hover:bg-red-900 text-white font-bold rounded-xl shadow-lg transition-all text-center"
            >
              <PhoneCall className="w-5 h-5" />
              Call 112 (EU / India / UK 999)
            </a>
          </div>

          <div className="mt-5 text-center">
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 underline transition-colors"
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
