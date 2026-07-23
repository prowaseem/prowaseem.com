import { vi } from 'vitest';
import React from 'react';
import '@testing-library/jest-dom/vitest';

// Skip Framer Motion animations during tests while preserving component props
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => children,
    motion: new Proxy(
      {},
      {
        get: (_target, prop) => {
          return (props: any) => {
            const { children, ...rest } = props;
            const Component = prop as string;
            if (Component === 'button') return React.createElement('button', rest, children);
            if (Component === 'a') return React.createElement('a', rest, children);
            return React.createElement('div', rest, children);
          };
        },
      }
    ),
  };
});

if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

if (!window.IntersectionObserver) {
  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: class IntersectionObserver {
      constructor(public callback: IntersectionObserverCallback) {}
      observe() {
        return null;
      }
      unobserve() {
        return null;
      }
      disconnect() {
        return null;
      }
      takeRecords() {
        return [];
      }
      root = null;
      rootMargin = '';
      thresholds = [];
    },
  });
}
