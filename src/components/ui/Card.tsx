'use client';

import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  hover = false,
  padding = 'md',
  className = '',
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      whileHover={hover ? { y: -2, boxShadow: 'var(--shadow-lg)' } : undefined}
      className={`
        bg-bg-secondary
        border border-border-primary
        rounded-xl
        shadow-sm
        ${hover ? 'cursor-pointer transition-all duration-200' : ''}
        ${paddingStyles[padding]}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
}

