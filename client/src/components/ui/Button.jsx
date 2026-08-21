import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  icon: Icon,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary:
      'bg-[#0f6b68] hover:bg-[#0b5755] text-white shadow-sm focus:ring-[#0f6b68] border border-[#0f6b68]',
    secondary:
      'bg-white hover:bg-[#f1f8f6] text-[#173b3f] dark:bg-[#173b3f] dark:hover:bg-[#21494a] dark:text-white border border-[#c7d8d4] dark:border-[#416360] focus:ring-[#0f6b68]',
    emerald:
      'bg-[#3d8b72] hover:bg-[#32755f] text-white shadow-sm focus:ring-[#3d8b72] border border-[#3d8b72]',
    danger:
      'bg-[#c4534a] hover:bg-[#a9423b] text-white shadow-sm focus:ring-[#c4534a] border border-[#c4534a]',
    outline:
      'border border-[#0f6b68] hover:bg-[#dcefe9] text-[#0b5755] dark:text-[#83c4b8] dark:hover:bg-[#173b3f] focus:ring-[#0f6b68]',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/60',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
    xl: 'px-8 py-3.5 text-lg gap-3',
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.015 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      ) : Icon ? (
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
