import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useScrollSpy } from '../../hooks/useScrollSpy';
import { scrollToSection } from '../../lib/scrollTo';
import { profile } from '../../data/profile';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'experience', label: 'Experience' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'contact', label: 'Contact' },
];

const SECTION_IDS = ['hero', ...NAV_ITEMS.map((item) => item.id)];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeId = useScrollSpy(SECTION_IDS);

  function handleNavClick(id: string) {
    scrollToSection(id);
    setIsMenuOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border-subtle/60 bg-surface/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button
          type="button"
          onClick={() => handleNavClick('hero')}
          className="font-display text-lg font-semibold text-ink"
        >
          {profile.fullName}
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNavClick(item.id)}
              className={`text-sm font-medium transition-colors ${
                activeId === item.id ? 'text-coral-500' : 'text-ink/70 hover:text-ink'
              }`}
            >
              {item.label}
            </button>
          ))}
          <ThemeToggle />
        </nav>

        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-1 border-t border-border-subtle/60 bg-surface px-6 py-4 md:hidden"
          >
            {NAV_ITEMS.map((item, index) => (
              <motion.button
                key={item.id}
                type="button"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0, transition: { delay: index * 0.05 } }}
                onClick={() => handleNavClick(item.id)}
                className="py-2 text-left text-sm font-medium text-ink/80"
              >
                {item.label}
              </motion.button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
