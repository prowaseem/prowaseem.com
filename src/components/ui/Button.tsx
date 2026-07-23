import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function Button({ children, href, onClick, variant = 'primary', className = '' }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-2xl px-6 py-3 font-medium transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coral-500';
  const styles =
    variant === 'primary'
      ? 'bg-gradient-to-r from-coral-500 to-amber-400 text-white shadow-lg shadow-coral-500/30 hover:shadow-xl hover:shadow-coral-500/40'
      : 'border border-coral-500/40 text-coral-600 hover:bg-coral-500/10';

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={`${base} ${styles} ${className}`}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </motion.button>
  );
}
