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
      whileHover={hover ? { y: -2, transition: { duration: 0.15, ease: [0.16, 1, 0.3, 1] } } : {}}
      onClick={onClick}
      className={`rounded-2xl transition-all duration-200 ${
        glass
          ? 'glass-card'
          : 'bg-white dark:bg-[#102629] border border-[#e2ebe7] dark:border-[#1c4246] shadow-card'
      } ${hover ? 'hover:shadow-card-hover hover:border-[#b8ded5] dark:hover:border-[#2c5f64]' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
