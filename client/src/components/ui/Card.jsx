import React from 'react';
import { motion } from 'framer-motion';

const Card = ({
  children,
  className = '',
  glass = true,
  hover = false,
  onClick,
  ...props
}) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, transition: { duration: 0.15 } } : {}}
      onClick={onClick}
      className={`rounded-2xl transition-all duration-200 ${
        glass
          ? 'glass-card'
          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
      } ${hover ? 'hover:shadow-lg hover:border-sky-500/30' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
