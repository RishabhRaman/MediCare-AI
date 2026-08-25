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
    'inline-flex items-center justify-center font-semibold tracking-tight transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none';

  const variants = {
    primary:
      'bg-[#0b5755] hover:bg-[#084744] text-white shadow-subtle hover:shadow-card focus-visible:ring-[#0b5755] border border-[#084744] dark:bg-[#4aa497] dark:hover:bg-[#83c4b8] dark:text-[#091617] dark:border-[#4aa497]',
    secondary:
      'bg-white hover:bg-[#f3f7f5] text-[#122b2e] dark:bg-[#102629] dark:hover:bg-[#153438] dark:text-[#edf7f3] border border-[#d6e4df] dark:border-[#1c4246] shadow-subtle focus-visible:ring-[#0b5755]',
    emerald:
      'bg-[#3d8b72] hover:bg-[#2e6d59] text-white shadow-subtle focus-visible:ring-[#3d8b72] border border-[#32755f]',
    danger:
      'bg-[#b91c1c] hover:bg-[#991b1b] text-white shadow-subtle focus-visible:ring-[#dc2626] border border-[#991b1b]',
    outline:
      'border border-[#0b5755] hover:bg-[#dcefe9]/60 text-[#0b5755] dark:border-[#4aa497] dark:text-[#83c4b8] dark:hover:bg-[#173b3f]/70 focus-visible:ring-[#0b5755]',
    ghost:
      'text-[#425b59] hover:text-[#122b2e] hover:bg-[#f3f7f5] dark:text-[#b4cbc6] dark:hover:text-white dark:hover:bg-[#143236]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 min-h-[34px]',
    md: 'px-4 py-2 text-sm rounded-xl gap-2 min-h-[42px]',
    lg: 'px-6 py-3 text-base rounded-xl gap-2.5 min-h-[48px]',
    xl: 'px-8 py-3.5 text-base rounded-2xl gap-3 min-h-[54px] font-bold',
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.012, y: -1 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.985, y: 0 } : {}}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-4 w-4 text-current"
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
        <Icon className={size === 'sm' ? 'w-3.5 h-3.5' : size === 'lg' || size === 'xl' ? 'w-5 h-5' : 'w-4 h-4'} />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
