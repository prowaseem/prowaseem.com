import type { ReactNode } from 'react';

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border-subtle bg-surface-elevated px-3 py-1 text-sm text-ink/80 transition-transform hover:-translate-y-0.5 hover:text-coral-500">
      {children}
    </span>
  );
}
