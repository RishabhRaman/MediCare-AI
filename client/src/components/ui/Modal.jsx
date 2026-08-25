import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-2xl',
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#091617]/75 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`relative w-full ${maxWidth} bg-white dark:bg-[#102629] border border-[#d6e4df] dark:border-[#1c4246] rounded-3xl shadow-elevation p-6 sm:p-8 z-10 my-8 overflow-hidden`}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 mb-5 border-b border-[#e2ebe7] dark:border-[#1c4246]">
              <div>
                {title && (
                  <h3 className="text-xl font-bold font-serif-heading text-[#122b2e] dark:text-[#edf7f3]">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-xs sm:text-sm text-[#425b59] dark:text-[#b4cbc6] mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                className="text-[#6b8582] hover:text-[#122b2e] dark:text-[#7e9d97] dark:hover:text-white p-1.5 rounded-xl hover:bg-[#f3f7f5] dark:hover:bg-[#143236] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="max-h-[75vh] overflow-y-auto pr-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
