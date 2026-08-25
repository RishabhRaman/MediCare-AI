import React from 'react';

const Input = ({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-bold uppercase tracking-wider text-[#425b59] dark:text-[#b4cbc6] mb-1.5"
        >
          {label}
        </label>
      )}
      <div className="relative rounded-xl">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6b8582]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`block w-full rounded-xl text-sm transition-all duration-150 border ${
            Icon ? 'pl-10' : 'pl-3.5'
          } pr-3.5 py-2.5 bg-white dark:bg-[#0d2123] text-[#122b2e] dark:text-[#edf7f3] placeholder-[#7e9d97] dark:placeholder-[#5b7a74] focus:outline-none focus-visible:ring-2 focus-visible:border-transparent ${
            error
              ? 'border-red-500 focus-visible:ring-red-500/30'
              : 'border-[#d6e4df] dark:border-[#1c4246] focus-visible:ring-[#0b5755]/30 dark:focus-visible:ring-[#4aa497]/40 focus:border-[#0b5755] dark:focus:border-[#4aa497]'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600 dark:text-red-400 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="mt-1.5 text-xs text-[#6b8582] dark:text-[#7e9d97]">{helperText}</p>
      )}
    </div>
  );
};

export default Input;
