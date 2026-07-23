import { ArrowUp, Mail, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { profile } from '../../data/profile';
import { scrollToSection } from '../../lib/scrollTo';

const ICONS = { mail: Mail, github: ExternalLink, linkedin: LinkIcon };

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle/60 bg-surface px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <div className="flex gap-4">
          {profile.links.map((link) => {
            const Icon = ICONS[link.icon as keyof typeof ICONS];
            const isExternal = link.href.startsWith('http');
            return (
              <a
                key={link.label}
                href={link.href}
                target={isExternal ? '_blank' : undefined}
                rel={isExternal ? 'noreferrer' : undefined}
                aria-label={link.label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border-subtle text-ink/70 hover:text-coral-500"
              >
                <Icon size={18} />
              </a>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => scrollToSection('hero')}
          className="flex items-center gap-2 text-sm text-ink/60 hover:text-coral-500"
        >
          <ArrowUp size={16} />
          Back to top
        </button>

        <p className="text-xs text-ink/50">
          © {year} Muhammad Waseem Irshad. Built with React, TypeScript &amp; Tailwind CSS.
        </p>
      </div>
    </footer>
  );
}
