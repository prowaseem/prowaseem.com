# Portfolio Revamp Design — prowaseem.com

**Date:** 2026-07-24
**Branch:** `version-2026` (created before implementation begins)

## Goal

Replace the current Create React App + Bootstrap portfolio with a modern, vibrant, "eye-soothing"
single-page site that showcases 11 years of experience, is fully responsive, has tasteful
interactive/animated elements, includes a filterable project showcase, and ends with a working
contact form. Ships as static files to the user's existing S3 bucket + custom domain
(`prowaseem.com`) — no server runtime available at hosting time.

## Non-goals

- No blog/CMS, no multi-page routing (single-page scroll site, per user decision).
- No fabricated project screenshots — the resume has no discrete personal/OSS projects, so the
  Portfolio Showcase is built from job-history highlights (see Data Model). Real screenshots can
  be swapped in later without a data-model change.
- No server-side contact form — delivery goes through a third-party static-form backend
  (Web3Forms/Formspree).
- Not touching the S3/DNS deployment pipeline itself — only produces a static `dist/` build.

## Tech Stack

- **Build tool:** Vite (replaces `react-scripts`, which is deprecated).
- **Language:** TypeScript, strict mode.
- **UI:** React 19.
- **Styling:** Tailwind CSS with a custom "Warm Sunset" theme (see Visual Design System).
  Replaces `bootstrap` / `react-bootstrap` / `sass`.
- **Animation:** Framer Motion for hover states, scroll-triggered reveals, layout animations
  (project filter grid), and page-load sequencing. No GSAP/Anime.js — Framer Motion covers all
  requested interactivity with less code in a React codebase.
- **Icons:** `lucide-react` — lighter weight and a cleaner outline style that matches the Tailwind
  aesthetic better than the existing `@fortawesome` packages, which are dropped as part of the
  full replacement.
- **Contact form backend:** Web3Forms or Formspree (client-side POST, no custom backend).
- **Testing:** `@testing-library/react` retained for smoke tests.
- **Lint/format:** ESLint + Prettier (flat config).

## Full Replacement Scope

Per explicit user confirmation, this is a full replacement, not an incremental addition:

**Deleted:**
- `src/components/App.scss`, `Header/index.scss`, `Employment/index.scss`, `Profile/index.scss`
- `src/components/data/profile.json`, `src/components/data/employment.json`
- `src/_variables.scss`, `src/index.scss`
- `bootstrap`, `react-bootstrap`, `sass` dependencies
- `react-scripts` and CRA-specific config (`react-app-env.d.ts` if Vite doesn't need it,
  `reportWebVitals.ts` unless reused, `setupTests.ts` reworked for Vite+Vitest if testing is kept)

**Replaced by:** the architecture below.

## Architecture / Project Structure

```
src/
  components/
    layout/         Header (nav + theme toggle), Footer
    sections/        Hero, About, Skills, Experience, Portfolio, Contact
    ui/              Reusable primitives: Button, Card, Badge, SectionHeading
  data/              profile.ts, employment.ts, projects.ts, skills.ts, education.ts (typed)
  hooks/             useTheme, useScrollSpy
  lib/               shared Framer Motion variants, form-submit helper
  styles/            globals.css (Tailwind directives + custom properties)
  App.tsx
  main.tsx
```

`npm run build` outputs static files to `dist/` for the user to sync to their S3 bucket.

## Data Model

Typed TypeScript modules populated from the user's July 2026 resume:

- **`profile.ts`** — name (Muhammad Waseem Irshad), title (Senior Frontend Engineer), bio,
  location (Karachi, Pakistan), contact links (email, GitHub `prowaseem`, LinkedIn `prowaseem`,
  prowaseem.com).
- **`skills.ts`** — grouped exactly as the resume's "Key Technologies" section: AI-Assisted
  Engineering, Frontend & Frameworks, State & Validation, UI & Styling, Backend & APIs,
  Databases & Caching, DevOps & Cloud, Testing & Tools.
- **`employment.ts`** — full history: Access Development (Jan 2026–Present), Beam AI
  (Mar 2025–Jan 2026), Venturedive (Jun 2017–Dec 2025, Lead Software Engineer), Invision Solutions
  (Senior Web Application Developer, Oct 2016–Jun 2017; Junior Software Engineer, Mar–Oct 2016),
  Nimble Web Solutions (PHP Developer, Jun 2015–Mar 2016).
- **`projects.ts`** — Portfolio Showcase cards derived from resume bullets (no separate project
  list exists), each with a `category` for filtering:
  - "Agentic Chat Workflow" — Beam AI — category: AI/Agents — tags: AI Agents, React, Playwright MCP
  - "Third-Party Tool Integrations" — Beam AI — category: AI/Agents — tags: Gmail, Slack, AI Workflows
  - "White-Label Platform Features" — Access Development — category: Enterprise — tags: Spec-Driven Dev, AI-assisted tooling
  - "Multi-Platform Waste Management System" — Venturedive — category: Full-Stack — tags: React, Node, AWS Lambda, Cognito
  - "HR Survey Web Application" — Venturedive — category: Full-Stack — tags: React, Node, CI/CD
  - "Resource Allocation & Leave Management Portal" — Venturedive — category: Enterprise — tags: React, Redux, Node, MySQL
  - "Airline Itinerary Portal" — Venturedive — category: Enterprise — tags: React, Redux

  Filter categories: All / AI-Agents / Full-Stack / Enterprise. Each card uses a generated
  abstract gradient/pattern background in the Warm Sunset palette plus a tech-tag row, instead of
  a fabricated screenshot.
- **`education.ts`** — Government College University Faisalabad (BS Software Engineering),
  Government Postgraduate College of Science Samanabad (FSc Pre-Engineering), Minhaj-ul-Quran
  Model High Secondary School (Matric in Science).

## Visual Design System — "Warm Sunset"

- **Palette:** Light mode: warm off-white background (`#FFF9F5`), warm dark-brown text
  (`#2A211C`). Dark mode: deep warm charcoal background (`#1C1512`), warm cream text. Accents:
  coral (`#FF6B5D`), amber (`#FFB74D`), soft pink (`#FF9EC4`), used in gradients (CTA buttons,
  heading underlines) rather than as full backgrounds, to stay "eye-soothing" rather than loud.
  All accent/surface/border values defined as semantic Tailwind tokens, never hardcoded in
  components.
- **Typography:** Plus Jakarta Sans (variable) for body/UI, Sora (variable) for headings — a
  geometric-sans pairing that reads modern without clashing, both self-hosted via `@font-face`
  (no runtime CDN dependency).
- **Shape/spacing:** Generous whitespace, large rounded corners (`rounded-2xl`/`3xl`), soft
  warm-tinted multi-layer shadows instead of generic gray shadows.
- **Theme toggle:** Header icon button, sun/moon morph animation, respects
  `prefers-color-scheme` on first visit, then persists explicit user choice to `localStorage`.

## Sections & Interactions

- **Header/Nav:** Sticky, transparent-over-hero, solidifies on scroll; active-section highlight
  via `useScrollSpy` (IntersectionObserver). Mobile: slide-in menu, staggered link entrance.
- **Hero:** Name + rotating role/focus text, gradient-accented headline, CTA buttons ("View
  Work", "Get in Touch") with magnetic hover + gradient-border glow.
- **About:** Bio + animated count-up stats (years experience, roles, stack breadth) on scroll
  into view.
- **Skills:** Grouped badge/pill grid by resume category, hover lift + icon per pill.
- **Experience:** Vertical timeline (left-aligned mobile / alternating desktop), scroll fade+slide
  per entry, current role marked "Present" with a pulsing dot.
- **Portfolio Showcase:** Responsive CSS grid (not masonry — better reflow/accessibility for a
  small curated set). Filter pill bar (All / AI-Agents / Full-Stack / Enterprise) animates
  cards in/out via Framer Motion `layout` + `AnimatePresence`. Card hover = scale + shadow lift.
- **Contact:** Name (required), email (optional, per user spec), message textarea, submit via
  Web3Forms/Formspree, inline success/error state (no reload), honeypot spam field.
- **Footer:** Social links (GitHub, LinkedIn, email), back-to-top button.

## Responsive, Accessibility & Performance

- Mobile-first Tailwind breakpoints (`sm/md/lg/xl`); grids collapse 3→2→1 columns; timeline
  collapses to left-aligned; nav collapses to hamburger under `md`.
- All animations respect `prefers-reduced-motion`.
- Semantic landmarks, visible focus states preserved (not stripped without replacement), WCAG AA
  contrast in both themes, properly labeled form fields.
- Fonts self-hosted/subset; images (if added later) lazy-loaded with responsive `srcset`;
  target Lighthouse 90+ across categories.

## Testing

- Smoke tests via `@testing-library/react`: Hero renders, nav scroll-links work, contact form
  client-side validation (name required, message required, email format if provided).

## Success Criteria

- Single-page site with all six sections (Hero, About, Skills, Experience, Portfolio, Contact)
  live, responsive across mobile/tablet/desktop.
- Light/dark mode both fully styled and toggleable.
- Portfolio filter interactions work with animated transitions.
- Contact form successfully delivers a test submission via the chosen static-form backend.
- `npm run build` produces a `dist/` folder deployable as-is to the user's S3 bucket.
- Old Bootstrap/SCSS/CRA code and dependencies fully removed.
