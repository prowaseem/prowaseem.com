import { ArrowUp, Globe, Mail } from 'lucide-react';
import { profile } from '../../data/profile';
import { scrollToSection } from '../../lib/scrollTo';

function GithubIcon(props: { size?: number }) {
  const size = props.size ?? 18;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon(props: { size?: number }) {
  const size = props.size ?? 18;
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M20 0H4C1.791 0 0 1.791 0 4v16c0 2.209 1.791 4 4 4h16c2.209 0 4-1.791 4-4V4c0-2.209-1.791-4-4-4zm-11 19H5v-11h4v11zm-2-12.568c-1.286 0-2.333-1.052-2.333-2.333s1.047-2.333 2.333-2.333c1.286 0 2.333 1.052 2.333 2.333S7.286 6.432 6 6.432zm13 12.568h-4v-5.604c0-3.368-4-3.113-4 0v5.604h-4v-11h4v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

const ICONS = { mail: Mail, github: GithubIcon, linkedin: LinkedinIcon, globe: Globe } as const;

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle/60 bg-surface px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 text-center">
        <div className="flex gap-4">
          {profile.links.map((link) => {
            const Icon = ICONS[link.icon];
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
