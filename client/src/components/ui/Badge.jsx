import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variants = {
    default: 'bg-[#f3f7f5] text-[#425b59] dark:bg-[#143236] dark:text-[#b4cbc6] border-[#d7e4e0] dark:border-[#1c4246]',
    primary: 'bg-[#dcefe9] text-[#084744] dark:bg-[#173b3f] dark:text-[#b8ded5] border-[#b8ded5] dark:border-[#2c5f64]',
    normal: 'bg-[#eaf5f0] text-[#1c644d] dark:bg-[#13382c] dark:text-[#86e2bf] border-[#c0e6d6] dark:border-[#1f5c49]',
    high: 'bg-[#fef2f2] text-[#991b1b] dark:bg-[#451010] dark:text-[#fca5a5] border-[#fecaca] dark:border-[#7f1d1d]',
    low: 'bg-[#fffbeb] text-[#92400e] dark:bg-[#45280b] dark:text-[#fcd34d] border-[#fde68a] dark:border-[#78350f]',
    borderline: 'bg-[#fff7ed] text-[#9a3412] dark:bg-[#431e0c] dark:text-[#fdba74] border-[#fed7aa] dark:border-[#7c2d12]',
    critical: 'bg-[#fef2f2] text-[#991b1b] dark:bg-[#4c0519] dark:text-[#fda4af] border-[#f87171] dark:border-[#be123c] animate-pulse-subtle font-bold',
    elevated: 'bg-[#fffbeb] text-[#92400e] dark:bg-[#45280b] dark:text-[#fde047] border-[#fcd34d] dark:border-[#854d0e]',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] font-medium leading-none',
    md: 'px-2.5 py-1 text-xs font-semibold leading-none',
    lg: 'px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider leading-none',
  };

  const dotColors = {
    normal: 'bg-[#10b981]',
    high: 'bg-[#ef4444]',
    low: 'bg-[#f59e0b]',
    borderline: 'bg-[#f97316]',
    critical: 'bg-[#dc2626]',
    default: 'bg-[#64748b]',
    primary: 'bg-[#0f6b68]',
    elevated: 'bg-[#f59e0b]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${variants[variant] || variants.default} ${sizes[size]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant] || dotColors.default}`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
