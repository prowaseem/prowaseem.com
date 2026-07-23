import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`rounded-3xl border border-border-subtle bg-surface-elevated p-6 shadow-lg shadow-ink/5 ${className}`}
    >
      {children}
    </motion.div>
  );
}
