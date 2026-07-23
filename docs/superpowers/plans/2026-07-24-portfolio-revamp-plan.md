# Portfolio Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the CRA + Bootstrap portfolio at prowaseem.com with a single-page, static-exportable Vite + React 19 + TypeScript site using a "Warm Sunset" Tailwind CSS v4 theme, Framer Motion interactions, resume-derived content, a filterable project showcase, and a working contact form — deployable as-is to the user's S3 bucket.

**Architecture:** One React app (`src/App.tsx`) rendering six in-page sections (Hero, About, Skills, Experience, Portfolio, Contact) inside a sticky Header/Footer shell. Typed data modules under `src/data/` hold all resume content. Pure functions (`filterProjects`, `validateContactForm`) carry the only real branching logic and get real TDD; presentational components get render/interaction smoke tests. `npm run build` outputs a self-contained `dist/` folder.

**Tech Stack:** Vite 6, React 19, TypeScript (strict), Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first `@theme` config), Framer Motion, `lucide-react` icons, `@fontsource-variable/plus-jakarta-sans` + `@fontsource-variable/sora` (self-hosted fonts), Vitest + `@testing-library/react` + `@testing-library/user-event`, Web3Forms (contact form delivery).

## Global Constraints

- Static export only — the site is hosted on a plain S3 bucket, no server runtime exists at deploy time. Never introduce a feature that requires a Node server (SSR, API routes, ISR).
- Single-page scroll site — no client-side routing library; navigation is `scrollIntoView` between `id`-anchored `<section>`s.
- Full replacement — all Bootstrap/Sass/CRA files and dependencies are deleted, not kept alongside the new stack.
- TypeScript strict mode throughout (`"strict": true`).
- All animations must respect `prefers-reduced-motion` (handled globally in `src/index.css`, see Task 2).
- Contact form fields: name (required), email (optional), message (required, ≥10 characters) — delivered via Web3Forms, no custom backend.
- Node >= 20 (repo currently has v24.13.0 installed), npm as the package manager (repo already tracks `package-lock.json`).
- Portfolio Showcase content is derived entirely from resume bullets (no real project screenshots) — card visuals use gradient placeholders, not fabricated product images.

---

### Task 1: Vite + TypeScript + Vitest scaffold, full CRA/Bootstrap cleanup

**Files:**
- Delete: `src/components/App.tsx`, `src/components/App.scss`, `src/components/App.test.tsx`
- Delete: `src/components/Header/index.tsx`, `src/components/Header/index.scss`
- Delete: `src/components/Profile/index.tsx`, `src/components/Profile/index.scss`
- Delete: `src/components/Employment/index.tsx`, `src/components/Employment/index.scss`
- Delete: `src/components/data/profile.json`, `src/components/data/employment.json`
- Delete: `src/_variables.scss`, `src/index.scss`, `src/index.tsx`, `src/react-app-env.d.ts`, `src/reportWebVitals.ts`, `src/setupTests.ts`, `src/logo.svg`
- Delete: `public/index.html`, `public/profile.svg`, `yarn.lock`
- Create: `index.html` (new project root)
- Create: `vite.config.ts`
- Create: `tsconfig.json` (rewrite), `tsconfig.node.json`
- Create: `src/main.tsx`, `src/App.tsx`, `src/App.test.tsx`, `src/index.css`, `src/vite-env.d.ts`
- Create: `src/test/setup.ts`
- Modify: `package.json` (full rewrite), `public/manifest.json`

**Interfaces:**
- Produces: `App` default export (`src/App.tsx`) — a zero-prop React component, consumed by `src/main.tsx` and every later task's smoke tests.
- Produces: Vitest globals (`describe`, `it`, `expect`, `vi`) available without import in every `*.test.tsx`/`*.test.ts` file, via `test.globals: true` in `vite.config.ts`.
- Produces: `src/test/setup.ts` — loaded automatically before every test file, provides a `window.matchMedia` stub used by Task 5's `useTheme` tests.

- [ ] **Step 1: Delete all CRA/Bootstrap-era files**

```bash
git rm -r src/components/App.tsx src/components/App.scss src/components/App.test.tsx \
  src/components/Header src/components/Profile src/components/Employment \
  src/components/data/profile.json src/components/data/employment.json \
  src/_variables.scss src/index.scss src/index.tsx src/react-app-env.d.ts \
  src/reportWebVitals.ts src/setupTests.ts src/logo.svg \
  public/index.html public/profile.svg yarn.lock
```

Expected: all listed paths removed from the working tree and staged for deletion. `src/components/data/` should now be empty — remove the empty directory too:

```bash
rmdir src/components/data src/components 2>/dev/null || true
```

- [ ] **Step 2: Rewrite `package.json`**

```json
{
  "name": "prowaseem.com",
  "private": true,
  "version": "0.2.0",
  "type": "module",
  "engines": {
    "node": ">=20"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "jsdom": "^25.0.1",
    "typescript": "^5.7.2",
    "vite": "^6.0.0",
    "vitest": "^2.1.8"
  }
}
```

- [ ] **Step 3: Create `tsconfig.json` and `tsconfig.node.json`**

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "resolveJsonModule": true,
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

- [ ] **Step 5: Create `src/vite-env.d.ts`**

```ts
/// <reference types="vite/client" />
```

- [ ] **Step 6: Create `src/test/setup.ts`**

```ts
import '@testing-library/jest-dom/vitest';

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
```

- [ ] **Step 7: Create root `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/waseem.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#FF6B5D" />
    <meta
      name="description"
      content="Muhammad Waseem Irshad — Senior Frontend Engineer specializing in React, TypeScript, and AI-assisted engineering."
    />
    <link rel="apple-touch-icon" href="/waseem.png" />
    <link rel="manifest" href="/manifest.json" />
    <title>Muhammad Waseem Irshad | Senior Frontend Engineer</title>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: Update `public/manifest.json` theme colors**

```json
{
  "short_name": "M Waseem",
  "name": "Muhammad Waseem Irshad",
  "icons": [
    { "src": "waseem-64.png", "sizes": "64x64", "type": "image/png" },
    { "src": "waseem-192.png", "type": "image/png", "sizes": "192x192" },
    { "src": "waseem-512.png", "type": "image/png", "sizes": "512x512" }
  ],
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#FF6B5D",
  "background_color": "#FFF9F5"
}
```

- [ ] **Step 9: Create `src/index.css` (minimal reset — Task 2 replaces this with the full theme)**

```css
:root {
  color-scheme: light dark;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
}
```

- [ ] **Step 10: Create `src/App.tsx` placeholder**

```tsx
function App() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <p>Portfolio rebuild in progress.</p>
    </main>
  );
}

export default App;
```

- [ ] **Step 11: Create `src/main.tsx`**

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 12: Write the placeholder smoke test — `src/App.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Portfolio rebuild in progress.')).toBeInTheDocument();
  });
});
```

- [ ] **Step 13: Install dependencies and verify everything runs**

```bash
rm -rf node_modules package-lock.json
npm install
```

Expected: install completes cleanly with no `react-scripts`/`bootstrap`/`sass`/`@fortawesome` packages present.

```bash
npm run test
```

Expected: `App > renders without crashing` passes (1 test, 1 file).

```bash
npm run build
```

Expected: builds successfully, emits `dist/index.html` and hashed JS/CSS assets.

- [ ] **Step 14: Commit**

```bash
git add -A
git commit -m "chore: migrate from CRA/Bootstrap to Vite + React 19 + TypeScript scaffold"
```

---

### Task 2: Tailwind CSS v4 "Warm Sunset" theme, fonts, dark mode

**Files:**
- Modify: `vite.config.ts`
- Modify: `src/index.css` (full rewrite)
- Modify: `package.json` (adds Tailwind + font dependencies — via `npm install`)

**Interfaces:**
- Produces: Tailwind utility classes backed by semantic tokens — `bg-surface`, `bg-surface-elevated`, `text-ink`, `border-border-subtle`, `bg-coral-{400,500,600}`, `bg-amber-{400,500}`, `bg-pink-400`, `font-sans` (Plus Jakarta Sans), `font-display` (Sora). Every later component-styling task uses only these tokens — no raw hex values in `className`.
- Produces: a `.dark` class on `<html>` that flips all semantic tokens to their dark-mode values — consumed by Task 5's `useTheme` hook.
- Produces: a global `prefers-reduced-motion` override in `src/index.css` that satisfies the spec's accessibility requirement for every animation in the app, without per-component logic.

- [ ] **Step 1: Install Tailwind and the font packages**

```bash
npm install tailwindcss @tailwindcss/vite @fontsource-variable/plus-jakarta-sans @fontsource-variable/sora
```

- [ ] **Step 2: Add the Tailwind Vite plugin to `vite.config.ts`**

```ts
/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

- [ ] **Step 3: Replace `src/index.css` with the full Warm Sunset theme**

```css
@import "tailwindcss";
@import "@fontsource-variable/plus-jakarta-sans";
@import "@fontsource-variable/sora";

@custom-variant dark (&:where(.dark, .dark *));

:root {
  --surface: #FFF9F5;
  --surface-elevated: #FFFFFF;
  --ink: #2A211C;
  --border-subtle: #EAD9CD;
}

.dark {
  --surface: #1C1512;
  --surface-elevated: #241B16;
  --ink: #FDF3EC;
  --border-subtle: #3A2C24;
}

@theme {
  --color-surface: var(--surface);
  --color-surface-elevated: var(--surface-elevated);
  --color-ink: var(--ink);
  --color-border-subtle: var(--border-subtle);

  --color-coral-400: #FF8A7A;
  --color-coral-500: #FF6B5D;
  --color-coral-600: #E55346;
  --color-amber-400: #FFB74D;
  --color-amber-500: #FFA726;
  --color-pink-400: #FF9EC4;

  --font-sans: "Plus Jakarta Sans Variable", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Sora Variable", ui-sans-serif, system-ui, sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: var(--color-surface);
  color: var(--color-ink);
  font-family: var(--font-sans);
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.001ms !important;
  }
}
```

- [ ] **Step 4: Update `src/App.tsx` placeholder to prove the theme tokens resolve**

```tsx
function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-surface font-display text-ink">
      <p className="text-coral-500">Portfolio rebuild in progress.</p>
    </main>
  );
}

export default App;
```

- [ ] **Step 5: Run dev server and visually confirm the theme**

```bash
npm run dev
```

Expected: open the printed local URL — background is warm cream (`#FFF9F5`), text uses the Sora display font, and the paragraph renders in coral. Stop the dev server (Ctrl+C) once confirmed.

- [ ] **Step 6: Run the existing test and build to confirm nothing broke**

```bash
npm run test && npm run build
```

Expected: `App > renders without crashing` still passes; build succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Tailwind CSS v4 Warm Sunset theme with dark mode tokens"
```

---

### Task 3: Typed resume data layer

**Files:**
- Create: `src/data/types.ts`
- Create: `src/data/profile.ts`, `src/data/skills.ts`, `src/data/employment.ts`, `src/data/projects.ts`, `src/data/education.ts`
- Test: `src/data/data.test.ts`

**Interfaces:**
- Produces: `Profile`, `SkillGroup`, `EmploymentEntry`, `EmploymentDetail`, `Project`, `ProjectCategory`, `EducationEntry` types (all from `src/data/types.ts`) — consumed by every section component from Task 9 onward.
- Produces: `profile: Profile`, `skillGroups: SkillGroup[]`, `employmentHistory: EmploymentEntry[]`, `projects: Project[]`, `education: EducationEntry[]` — the exact import names later tasks use.

- [ ] **Step 1: Write the failing data test — `src/data/data.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { profile } from './profile';
import { skillGroups } from './skills';
import { employmentHistory } from './employment';
import { projects } from './projects';
import { education } from './education';

describe('portfolio data', () => {
  it('has a complete profile', () => {
    expect(profile.fullName).toBe('Muhammad Waseem Irshad');
    expect(profile.links.length).toBeGreaterThan(0);
  });

  it('has skill groups that each contain skills', () => {
    expect(skillGroups.length).toBeGreaterThan(0);
    skillGroups.forEach((group) => expect(group.skills.length).toBeGreaterThan(0));
  });

  it('marks exactly one current employment entry', () => {
    const currentRoles = employmentHistory.filter((entry) => entry.current);
    expect(currentRoles).toHaveLength(1);
    expect(currentRoles[0].company).toBe('Access Development');
  });

  it('has projects in every filter category', () => {
    const categories = new Set(projects.map((project) => project.category));
    expect(categories).toEqual(new Set(['AI/Agents', 'Full-Stack', 'Enterprise']));
  });

  it('has education entries', () => {
    expect(education.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/data/data.test.ts
```

Expected: FAIL — `Cannot find module './profile'` (and siblings; none of the data files exist yet).

- [ ] **Step 3: Create `src/data/types.ts`**

```ts
export interface ContactLink {
  label: string;
  value: string;
  href: string;
  icon: 'mail' | 'github' | 'linkedin';
}

export interface Profile {
  fullName: string;
  title: string;
  bio: string;
  location: string;
  links: ContactLink[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface EmploymentDetail {
  description: string;
  skills: string[];
}

export interface EmploymentEntry {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  details: EmploymentDetail[];
}

export type ProjectCategory = 'AI/Agents' | 'Full-Stack' | 'Enterprise';

export interface Project {
  title: string;
  company: string;
  category: ProjectCategory;
  tags: string[];
  description: string;
}

export interface EducationEntry {
  institution: string;
  credential: string;
}
```

- [ ] **Step 4: Create `src/data/profile.ts`**

```ts
import type { Profile } from './types';

export const profile: Profile = {
  fullName: 'Muhammad Waseem Irshad',
  title: 'Senior Frontend Engineer',
  bio: 'Experienced software engineer with 11 years in web application development, specializing in building high-performance, dynamic user interfaces with React, TypeScript, and modern frontend architectures. A pioneer in adopting next-generation engineering workflows, highly skilled in leveraging AI-assisted development tools to accelerate feature velocity, optimize complex codebases, and maintain rigorous code quality.',
  location: 'Karachi, Pakistan',
  links: [
    { label: 'Email', value: 'theprowaseem@gmail.com', href: 'mailto:theprowaseem@gmail.com', icon: 'mail' },
    { label: 'GitHub', value: 'github.com/prowaseem', href: 'https://github.com/prowaseem', icon: 'github' },
    { label: 'LinkedIn', value: 'linkedin.com/in/prowaseem', href: 'https://linkedin.com/in/prowaseem', icon: 'linkedin' },
  ],
};
```

- [ ] **Step 5: Create `src/data/skills.ts`**

```ts
import type { SkillGroup } from './types';

export const skillGroups: SkillGroup[] = [
  { category: 'AI-Assisted Engineering', skills: ['Cursor', 'Claude Code', 'MCP', 'Prompting'] },
  { category: 'Frontend & Frameworks', skills: ['React', 'Next.js', 'TypeScript', 'JavaScript'] },
  { category: 'State & Validation', skills: ['Redux', 'Zustand', 'React Hook Form', 'Zod'] },
  { category: 'UI & Styling', skills: ['Tailwind CSS', 'Shadcn', 'Ant Design', 'Bootstrap'] },
  { category: 'Backend & APIs', skills: ['Node.js', 'NestJS', 'Python', 'GraphQL'] },
  { category: 'Databases & Caching', skills: ['MySQL', 'MongoDB', 'Redis'] },
  { category: 'DevOps & Cloud', skills: ['Docker', 'Kubernetes', 'CI/CD', 'AWS'] },
  { category: 'Testing & Tools', skills: ['Unit Testing', 'Git', 'Linux', 'macOS'] },
];
```

- [ ] **Step 6: Create `src/data/employment.ts`**

```ts
import type { EmploymentEntry } from './types';

export const employmentHistory: EmploymentEntry[] = [
  {
    company: 'Access Development',
    role: 'Senior Frontend Engineer',
    location: 'Salt Lake City, Utah, United States',
    startDate: 'January 2026',
    endDate: 'Present',
    current: true,
    details: [
      {
        description:
          'Adding new features to a US-based white-labeling platform using Spec-Driven Development with AI-assisted tools.',
        skills: ['MCP', 'Skills', 'Subagents'],
      },
    ],
  },
  {
    company: 'Beam AI',
    role: 'Senior Frontend Engineer',
    location: 'Berlin, Germany',
    startDate: 'March 2025',
    endDate: 'January 2026',
    details: [
      { description: 'Built an Agentic Chat workflow for automatic AI workflow creation.', skills: ['React', 'TypeScript'] },
      { description: 'Integrated third-party tools such as Gmail and Slack into AI workflows.', skills: ['APIs', 'OAuth'] },
      { description: 'Built an automated end-to-end feature evaluation suite.', skills: ['Playwright', 'MCP'] },
      { description: 'Optimized platform performance and reduced tech debt and backlog.', skills: ['Performance', 'Refactoring'] },
    ],
  },
  {
    company: 'Venturedive',
    role: 'Lead Software Engineer',
    location: 'Karachi, Pakistan',
    startDate: 'June 2017',
    endDate: 'December 2025',
    details: [
      {
        description:
          'Contributed to a multi-user, multi-platform waste management and collection system on a serverless architecture.',
        skills: ['React', 'Node.js', 'AWS Lambda', 'AWS Cognito', 'AWS Amplify'],
      },
      { description: 'Developed and maintained web portals for a mobile financial application.', skills: ['Angular', 'HTML', 'CSS'] },
      { description: 'Resolved bugs and integrated new features in a renowned airline itinerary front-end portal.', skills: ['React', 'Redux'] },
      { description: 'Led a team building an HR survey web application with automated deployments and unit testing.', skills: ['Node.js', 'React', 'CI/CD'] },
    ],
  },
  {
    company: 'Invision Solutions',
    role: 'Senior Web Application Developer',
    location: 'Karachi, Pakistan',
    startDate: 'October 2016',
    endDate: 'June 2017',
    details: [
      { description: 'Built and maintained RESTful APIs on Laravel for web portals and mobile applications.', skills: ['Laravel', 'REST APIs'] },
      { description: 'Designed an enterprise web application using AngularJS and Laravel.', skills: ['AngularJS', 'Laravel'] },
      { description: 'Managed EC2 instances and coordinated backend activities across multiple projects.', skills: ['AWS EC2'] },
    ],
  },
  {
    company: 'Invision Solutions',
    role: 'Junior Software Engineer',
    location: 'Lahore, Pakistan',
    startDate: 'March 2016',
    endDate: 'October 2016',
    details: [
      {
        description:
          'Developed plugins for PrestaShop and WordPress, plus a Laravel API for ecommerce and blog integrations.',
        skills: ['PrestaShop', 'WordPress', 'Laravel'],
      },
    ],
  },
  {
    company: 'Nimble Web Solutions',
    role: 'PHP Developer',
    location: 'Faisalabad, Pakistan',
    startDate: 'June 2015',
    endDate: 'March 2016',
    details: [
      { description: 'Contributed to open-source tools, web portals, and plugins for WordPress.', skills: ['WordPress', 'PHP'] },
    ],
  },
];
```

- [ ] **Step 7: Create `src/data/projects.ts`**

```ts
import type { Project } from './types';

export const projects: Project[] = [
  {
    title: 'Agentic Chat Workflow',
    company: 'Beam AI',
    category: 'AI/Agents',
    tags: ['AI Agents', 'React', 'Playwright MCP'],
    description: 'A chat-driven workflow builder that lets users create AI agent workflows conversationally.',
  },
  {
    title: 'Third-Party Tool Integrations',
    company: 'Beam AI',
    category: 'AI/Agents',
    tags: ['Gmail', 'Slack', 'AI Workflows'],
    description: 'Connected Gmail, Slack, and other third-party tools into AI-driven automation workflows.',
  },
  {
    title: 'White-Label Platform Features',
    company: 'Access Development',
    category: 'Enterprise',
    tags: ['Spec-Driven Dev', 'AI-assisted tooling'],
    description: 'Ships new features on a US-based white-labeling platform using spec-driven, AI-assisted development.',
  },
  {
    title: 'Multi-Platform Waste Management System',
    company: 'Venturedive',
    category: 'Full-Stack',
    tags: ['React', 'Node.js', 'AWS Lambda', 'Cognito'],
    description: 'A serverless, multi-user waste collection and tracking system spanning web and mobile.',
  },
  {
    title: 'HR Survey Web Application',
    company: 'Venturedive',
    category: 'Full-Stack',
    tags: ['React', 'Node.js', 'CI/CD'],
    description: 'Led development of an HR survey platform with automated deployments and testing.',
  },
  {
    title: 'Resource Allocation & Leave Management Portal',
    company: 'Venturedive',
    category: 'Enterprise',
    tags: ['React', 'Redux', 'Node.js', 'MySQL'],
    description: 'An in-house portal streamlining resource allocation and leave management processes.',
  },
  {
    title: 'Airline Itinerary Portal',
    company: 'Venturedive',
    category: 'Enterprise',
    tags: ['React', 'Redux'],
    description: "Enhanced functionality and performance of a major airline's itinerary front-end portal.",
  },
];
```

- [ ] **Step 8: Create `src/data/education.ts`**

```ts
import type { EducationEntry } from './types';

export const education: EducationEntry[] = [
  { institution: 'Government College University, Faisalabad', credential: 'BS in Software Engineering' },
  { institution: 'Government Postgraduate College of Science, Samanabad, Faisalabad', credential: 'FSc Pre-Engineering' },
  { institution: 'Minhaj-ul-Quran Model High Secondary School, Faisalabad', credential: 'Matric in Science' },
];
```

- [ ] **Step 9: Run the test to verify it passes**

```bash
npx vitest run src/data/data.test.ts
```

Expected: PASS (5 tests).

- [ ] **Step 10: Commit**

```bash
git add src/data
git commit -m "feat: add typed resume data layer (profile, skills, employment, projects, education)"
```

---

### Task 4: Motion variants and shared UI primitives

**Files:**
- Create: `src/lib/motion.ts`
- Create: `src/components/ui/Button.tsx`, `src/components/ui/Card.tsx`, `src/components/ui/Badge.tsx`, `src/components/ui/SectionHeading.tsx`
- Test: `src/components/ui/ui.test.tsx`

**Interfaces:**
- Consumes: Tailwind tokens from Task 2 (`bg-coral-500`, `bg-amber-400`, `text-ink`, `bg-surface-elevated`, `border-border-subtle`, `font-display`).
- Produces: `fadeInUp: Variants`, `staggerContainer: Variants` (from `src/lib/motion.ts`) — used by every section from Task 9 onward.
- Produces: `Button({ children, href?, onClick?, variant?, className? })`, `Card({ children, className? })`, `Badge({ children })`, `SectionHeading({ eyebrow?, title, description? })` — the exact prop names later tasks use.

- [ ] **Step 1: Install Framer Motion and lucide-react**

```bash
npm install framer-motion lucide-react
```

- [ ] **Step 2: Write the failing UI test — `src/components/ui/ui.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import { Badge } from './Badge';
import { SectionHeading } from './SectionHeading';

describe('UI primitives', () => {
  it('Button renders its children and fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Click me' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('Button renders as a link when href is provided', () => {
    render(<Button href="https://example.com">Visit</Button>);
    expect(screen.getByRole('link', { name: 'Visit' })).toHaveAttribute('href', 'https://example.com');
  });

  it('Badge renders its label', () => {
    render(<Badge>React</Badge>);
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  it('SectionHeading renders eyebrow, title, and description', () => {
    render(<SectionHeading eyebrow="About" title="Who I am" description="A short bio" />);
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Who I am' })).toBeInTheDocument();
    expect(screen.getByText('A short bio')).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
npx vitest run src/components/ui/ui.test.tsx
```

Expected: FAIL — `Cannot find module './Button'` (and siblings).

- [ ] **Step 4: Create `src/lib/motion.ts`**

```ts
import type { Variants } from 'framer-motion';

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};
```

- [ ] **Step 5: Create `src/components/ui/Button.tsx`**

```tsx
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
```

- [ ] **Step 6: Create `src/components/ui/Card.tsx`**

```tsx
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
```

- [ ] **Step 7: Create `src/components/ui/Badge.tsx`**

```tsx
import type { ReactNode } from 'react';

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-border-subtle bg-surface-elevated px-3 py-1 text-sm text-ink/80 transition-transform hover:-translate-y-0.5 hover:text-coral-500">
      {children}
    </span>
  );
}
```

- [ ] **Step 8: Create `src/components/ui/SectionHeading.tsx`**

```tsx
export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="text-sm font-semibold uppercase tracking-wide text-coral-500">{eyebrow}</p>}
      <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-ink/70">{description}</p>}
      <span className="mt-4 block h-1 w-16 rounded-full bg-gradient-to-r from-coral-500 to-amber-400" />
    </div>
  );
}
```

- [ ] **Step 9: Run the test to verify it passes**

```bash
npx vitest run src/components/ui/ui.test.tsx
```

Expected: PASS (4 tests).

- [ ] **Step 10: Commit**

```bash
git add src/lib/motion.ts src/components/ui package.json package-lock.json
git commit -m "feat: add Framer Motion variants and shared UI primitives"
```

---

### Task 5: `useTheme` hook and `ThemeToggle` component

**Files:**
- Create: `src/hooks/useTheme.ts`, `src/hooks/useTheme.test.ts`
- Create: `src/components/layout/ThemeToggle.tsx`

**Interfaces:**
- Consumes: `window.matchMedia` stub from `src/test/setup.ts` (Task 1).
- Produces: `useTheme(): { theme: 'light' | 'dark'; toggleTheme: () => void }` — consumed by `ThemeToggle` here and nothing else directly (Header in Task 7 renders `<ThemeToggle />`, it does not call the hook itself).

- [ ] **Step 1: Write the failing hook test — `src/hooks/useTheme.test.ts`**

```ts
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { useTheme } from './useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  afterEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
  });

  it('defaults to light when no preference is stored', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('toggles to dark and applies the dark class', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('persists the chosen theme to localStorage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.toggleTheme();
    });

    expect(localStorage.getItem('portfolio-theme')).toBe('dark');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/hooks/useTheme.test.ts
```

Expected: FAIL — `Cannot find module './useTheme'`.

- [ ] **Step 3: Create `src/hooks/useTheme.ts`**

```ts
import { useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'portfolio-theme';

function getInitialTheme(): Theme {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  return { theme, toggleTheme };
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/hooks/useTheme.test.ts
```

Expected: PASS (3 tests).

- [ ] **Step 5: Create `src/components/layout/ThemeToggle.tsx`**

```tsx
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={toggleTheme}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-border-subtle text-ink/80 hover:text-coral-500"
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
      </motion.span>
    </button>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useTheme.ts src/hooks/useTheme.test.ts src/components/layout/ThemeToggle.tsx
git commit -m "feat: add useTheme hook and ThemeToggle with persisted dark mode"
```

---

### Task 6: `useScrollSpy` hook and `scrollToSection` helper

**Files:**
- Create: `src/hooks/useScrollSpy.ts`, `src/hooks/useScrollSpy.test.ts`
- Create: `src/lib/scrollTo.ts`

**Interfaces:**
- Produces: `useScrollSpy(sectionIds: string[]): string` (returns the currently active section id) — consumed by `Header` in Task 7.
- Produces: `scrollToSection(id: string): void` — consumed by `Header` (Task 7), `Footer` (Task 8), `Hero` (Task 9).

- [ ] **Step 1: Write the failing hook test — `src/hooks/useScrollSpy.test.ts`**

```ts
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useScrollSpy } from './useScrollSpy';

type ObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  callback: ObserverCallback;
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];

  constructor(callback: ObserverCallback) {
    this.callback = callback;
    MockIntersectionObserver.instances.push(this);
  }
}

describe('useScrollSpy', () => {
  beforeEach(() => {
    MockIntersectionObserver.instances = [];
    vi.stubGlobal('IntersectionObserver', MockIntersectionObserver);
    document.body.innerHTML = '<section id="hero"></section><section id="about"></section>';
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns the first section id before anything intersects', () => {
    const { result } = renderHook(() => useScrollSpy(['hero', 'about']));
    expect(result.current).toBe('hero');
  });

  it('updates to the section reported as intersecting', () => {
    const { result } = renderHook(() => useScrollSpy(['hero', 'about']));
    const observer = MockIntersectionObserver.instances[0];

    act(() => {
      observer.callback([
        { isIntersecting: true, intersectionRatio: 0.8, target: document.getElementById('about') as Element },
      ]);
    });

    expect(result.current).toBe('about');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/hooks/useScrollSpy.test.ts
```

Expected: FAIL — `Cannot find module './useScrollSpy'`.

- [ ] **Step 3: Create `src/hooks/useScrollSpy.ts`**

```ts
import { useEffect, useState } from 'react';

export function useScrollSpy(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? '');

  useEffect(() => {
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds]);

  return activeId;
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/hooks/useScrollSpy.test.ts
```

Expected: PASS (2 tests).

- [ ] **Step 5: Create `src/lib/scrollTo.ts`**

```ts
export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}
```

- [ ] **Step 6: Commit**

```bash
git add src/hooks/useScrollSpy.ts src/hooks/useScrollSpy.test.ts src/lib/scrollTo.ts
git commit -m "feat: add useScrollSpy hook and scrollToSection helper"
```

---

### Task 7: Header / navigation

**Files:**
- Create: `src/components/layout/Header.tsx`, `src/components/layout/Header.test.tsx`

**Interfaces:**
- Consumes: `useScrollSpy` (Task 6), `scrollToSection` (Task 6), `ThemeToggle` (Task 5), `profile` (Task 3).
- Produces: `Header` default-less named export `Header()` — a zero-prop component consumed by `App.tsx` in Task 15. Renders `<section>`-anchor nav buttons for ids `about`, `skills`, `experience`, `portfolio`, `contact` (matching the `id`s later sections use).

- [ ] **Step 1: Write the failing component test — `src/components/layout/Header.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

describe('Header', () => {
  beforeEach(() => {
    Element.prototype.scrollIntoView = vi.fn();
    document.body.innerHTML =
      '<div id="hero"></div><div id="about"></div><div id="skills"></div>' +
      '<div id="experience"></div><div id="portfolio"></div><div id="contact"></div>';
  });

  it('renders all navigation links', () => {
    render(<Header />);
    ['About', 'Skills', 'Experience', 'Portfolio', 'Contact'].forEach((label) => {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    });
  });

  it('scrolls to the target section when a nav link is clicked', async () => {
    render(<Header />);
    await userEvent.click(screen.getByRole('button', { name: 'Skills' }));
    expect(document.getElementById('skills')?.scrollIntoView).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/layout/Header.test.tsx
```

Expected: FAIL — `Cannot find module './Header'`.

- [ ] **Step 3: Create `src/components/layout/Header.tsx`**

```tsx
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

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const activeId = useScrollSpy(['hero', ...NAV_ITEMS.map((item) => item.id)]);

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
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/components/layout/Header.test.tsx
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/Header.test.tsx
git commit -m "feat: add Header with scroll-spy nav, mobile menu, and theme toggle"
```

---

### Task 8: Footer

**Files:**
- Create: `src/components/layout/Footer.tsx`, `src/components/layout/Footer.test.tsx`

**Interfaces:**
- Consumes: `profile` (Task 3), `scrollToSection` (Task 6).
- Produces: `Footer()` — zero-prop component consumed by `App.tsx` in Task 15.

- [ ] **Step 1: Write the failing component test — `src/components/layout/Footer.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';

describe('Footer', () => {
  it('renders a link for every profile contact link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Email' })).toHaveAttribute('href', 'mailto:theprowaseem@gmail.com');
    expect(screen.getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/prowaseem');
    expect(screen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://linkedin.com/in/prowaseem');
  });

  it('renders a back-to-top button', () => {
    render(<Footer />);
    expect(screen.getByRole('button', { name: /back to top/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/layout/Footer.test.tsx
```

Expected: FAIL — `Cannot find module './Footer'`.

- [ ] **Step 3: Create `src/components/layout/Footer.tsx`**

```tsx
import { Github, Linkedin, Mail, ArrowUp } from 'lucide-react';
import { profile } from '../../data/profile';
import { scrollToSection } from '../../lib/scrollTo';

const ICONS = { mail: Mail, github: Github, linkedin: Linkedin } as const;

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
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/components/layout/Footer.test.tsx
```

Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/Footer.tsx src/components/layout/Footer.test.tsx
git commit -m "feat: add Footer with social links and back-to-top"
```

---

### Task 9: Hero section

**Files:**
- Create: `src/components/sections/Hero.tsx`, `src/components/sections/Hero.test.tsx`

**Interfaces:**
- Consumes: `profile` (Task 3), `Button` (Task 4), `fadeInUp`/`staggerContainer` (Task 4), `scrollToSection` (Task 6).
- Produces: `Hero()` rendering `<section id="hero">` — consumed by `App.tsx` in Task 15.

- [ ] **Step 1: Write the failing component test — `src/components/sections/Hero.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the name, title, and both CTAs', () => {
    render(<Hero />);
    expect(screen.getByText('Muhammad Waseem Irshad')).toBeInTheDocument();
    expect(screen.getByText('Senior Frontend Engineer')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View Work' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Get in Touch' })).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/sections/Hero.test.tsx
```

Expected: FAIL — `Cannot find module './Hero'`.

- [ ] **Step 3: Create `src/components/sections/Hero.tsx`**

```tsx
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { profile } from '../../data/profile';
import { fadeInUp, staggerContainer } from '../../lib/motion';
import { scrollToSection } from '../../lib/scrollTo';

export function Hero() {
  return (
    <section id="hero" className="flex min-h-screen items-center justify-center px-6 pt-24">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="mx-auto max-w-3xl text-center"
      >
        <motion.p variants={fadeInUp} className="font-medium text-coral-500">
          {profile.title}
        </motion.p>
        <motion.h1
          variants={fadeInUp}
          className="mt-4 font-display text-4xl font-bold leading-tight text-ink sm:text-5xl md:text-6xl"
        >
          Hi, I&apos;m{' '}
          <span className="bg-gradient-to-r from-coral-500 to-amber-400 bg-clip-text text-transparent">
            {profile.fullName}
          </span>
        </motion.h1>
        <motion.p variants={fadeInUp} className="mx-auto mt-6 max-w-xl text-lg text-ink/70">
          {profile.bio}
        </motion.p>
        <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={() => scrollToSection('portfolio')}>View Work</Button>
          <Button variant="secondary" onClick={() => scrollToSection('contact')}>
            Get in Touch
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/components/sections/Hero.test.tsx
```

Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Hero.tsx src/components/sections/Hero.test.tsx
git commit -m "feat: add Hero section"
```

---

### Task 10: About section

**Files:**
- Create: `src/components/sections/About.tsx`, `src/components/sections/About.test.tsx`

**Interfaces:**
- Consumes: `profile`, `employmentHistory` (Task 3), `SectionHeading` (Task 4), `src/assets/m-waseem.jpg` (existing asset, kept from the old site).
- Produces: `About()` rendering `<section id="about">` — consumed by `App.tsx` in Task 15.

- [ ] **Step 1: Write the failing component test — `src/components/sections/About.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from './About';

describe('About', () => {
  it('renders the section heading, bio, and stat labels', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: /a decade of shipping frontend products/i })).toBeInTheDocument();
    expect(screen.getByText(/experienced software engineer with 11 years/i)).toBeInTheDocument();
    expect(screen.getByText('Years of experience')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/sections/About.test.tsx
```

Expected: FAIL — `Cannot find module './About'`.

- [ ] **Step 3: Create `src/components/sections/About.tsx`**

```tsx
import { motion } from 'framer-motion';
import { useState } from 'react';
import { profile } from '../../data/profile';
import { employmentHistory } from '../../data/employment';
import { SectionHeading } from '../ui/SectionHeading';
import myPhoto from '../../assets/m-waseem.jpg';

const STATS = [
  { label: 'Years of experience', value: 11 },
  { label: 'Companies', value: employmentHistory.length },
  { label: 'Countries worked with', value: 3 },
];

function StatCounter({ value, label }: { value: number; label: string }) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  function animate() {
    if (hasAnimated) return;
    setHasAnimated(true);
    const durationMs = 1000;
    const startTime = performance.now();

    function tick(now: number) {
      const progress = Math.min((now - startTime) / durationMs, 1);
      setCount(Math.round(progress * value));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  return (
    <motion.div onViewportEnter={animate} viewport={{ once: true }} className="text-center">
      <p className="font-display text-4xl font-bold text-coral-500">{count}</p>
      <p className="mt-1 text-sm text-ink/60">{label}</p>
    </motion.div>
  );
}

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="About" title="A decade of shipping frontend products" />
      <div className="mt-12 grid gap-12 md:grid-cols-2 md:items-center">
        <motion.img
          src={myPhoto}
          alt="Muhammad Waseem Irshad"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto h-64 w-64 rounded-3xl object-cover shadow-xl shadow-coral-500/20"
        />
        <div>
          <p className="text-lg text-ink/70">{profile.bio}</p>
          <div className="mt-8 grid grid-cols-3 gap-6">
            {STATS.map((stat) => (
              <StatCounter key={stat.label} value={stat.value} label={stat.label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/components/sections/About.test.tsx
```

Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/About.tsx src/components/sections/About.test.tsx
git commit -m "feat: add About section with animated stat counters"
```

---

### Task 11: Skills section

**Files:**
- Create: `src/components/sections/Skills.tsx`, `src/components/sections/Skills.test.tsx`

**Interfaces:**
- Consumes: `skillGroups` (Task 3), `SectionHeading`, `Badge` (Task 4), `fadeInUp`/`staggerContainer` (Task 4).
- Produces: `Skills()` rendering `<section id="skills">` — consumed by `App.tsx` in Task 15.

- [ ] **Step 1: Write the failing component test — `src/components/sections/Skills.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skills } from './Skills';

describe('Skills', () => {
  it('renders every skill category and a sample skill from each', () => {
    render(<Skills />);
    expect(screen.getByText('AI-Assisted Engineering')).toBeInTheDocument();
    expect(screen.getByText('Claude Code')).toBeInTheDocument();
    expect(screen.getByText('Frontend & Frameworks')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/sections/Skills.test.tsx
```

Expected: FAIL — `Cannot find module './Skills'`.

- [ ] **Step 3: Create `src/components/sections/Skills.tsx`**

```tsx
import { motion } from 'framer-motion';
import { skillGroups } from '../../data/skills';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';
import { staggerContainer, fadeInUp } from '../../lib/motion';

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Skills" title="Technologies I work with" />
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="mt-12 grid gap-8 sm:grid-cols-2"
      >
        {skillGroups.map((group) => (
          <motion.div key={group.category} variants={fadeInUp}>
            <h3 className="font-display text-sm font-semibold uppercase tracking-wide text-ink/50">
              {group.category}
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {group.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/components/sections/Skills.test.tsx
```

Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Skills.tsx src/components/sections/Skills.test.tsx
git commit -m "feat: add Skills section"
```

---

### Task 12: Experience section (timeline)

**Files:**
- Create: `src/components/sections/Experience.tsx`, `src/components/sections/Experience.test.tsx`

**Interfaces:**
- Consumes: `employmentHistory` (Task 3), `SectionHeading`, `Badge` (Task 4).
- Produces: `Experience()` rendering `<section id="experience">` — consumed by `App.tsx` in Task 15.

- [ ] **Step 1: Write the failing component test — `src/components/sections/Experience.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Experience } from './Experience';

describe('Experience', () => {
  it('renders every employer with role and date range', () => {
    render(<Experience />);
    expect(screen.getByText(/Senior Frontend Engineer · Access Development/)).toBeInTheDocument();
    expect(screen.getByText(/Senior Frontend Engineer · Beam AI/)).toBeInTheDocument();
    expect(screen.getByText(/Lead Software Engineer · Venturedive/)).toBeInTheDocument();
    expect(screen.getByText('January 2026 — Present')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/components/sections/Experience.test.tsx
```

Expected: FAIL — `Cannot find module './Experience'`.

- [ ] **Step 3: Create `src/components/sections/Experience.tsx`**

```tsx
import { motion } from 'framer-motion';
import { employmentHistory } from '../../data/employment';
import { SectionHeading } from '../ui/SectionHeading';
import { Badge } from '../ui/Badge';

export function Experience() {
  return (
    <section id="experience" className="mx-auto max-w-4xl px-6 py-24">
      <SectionHeading eyebrow="Experience" title="Where I've worked" />
      <div className="relative mt-12 border-l border-border-subtle pl-8">
        {employmentHistory.map((entry, index) => (
          <motion.div
            key={`${entry.company}-${entry.role}`}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            className="relative pb-12 last:pb-0"
          >
            <span
              className={`absolute -left-[2.31rem] top-1.5 h-3 w-3 rounded-full ${
                entry.current ? 'animate-pulse bg-coral-500' : 'bg-border-subtle'
              }`}
            />
            <p className="text-sm text-ink/50">
              {entry.startDate} — {entry.endDate}
            </p>
            <h3 className="mt-1 font-display text-xl font-semibold text-ink">
              {entry.role} · {entry.company}
            </h3>
            <p className="text-sm text-ink/60">{entry.location}</p>
            <ul className="mt-4 space-y-2">
              {entry.details.map((detail) => (
                <li key={detail.description} className="text-ink/70">
                  <span>{detail.description}</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {detail.skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/components/sections/Experience.test.tsx
```

Expected: PASS (1 test).

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/Experience.tsx src/components/sections/Experience.test.tsx
git commit -m "feat: add Experience timeline section"
```

---

### Task 13: Portfolio Showcase with filters

**Files:**
- Create: `src/lib/filterProjects.ts`, `src/lib/filterProjects.test.ts`
- Create: `src/components/sections/Portfolio.tsx`, `src/components/sections/Portfolio.test.tsx`

**Interfaces:**
- Consumes: `projects`, `ProjectCategory` (Task 3), `SectionHeading`, `Card`, `Badge` (Task 4).
- Produces: `FilterOption = 'All' | ProjectCategory`, `filterProjects(projects: Project[], filter: FilterOption): Project[]` — pure function, unit tested in isolation.
- Produces: `Portfolio()` rendering `<section id="portfolio">` — consumed by `App.tsx` in Task 15.

- [ ] **Step 1: Write the failing pure-function test — `src/lib/filterProjects.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { filterProjects } from './filterProjects';
import type { Project } from '../data/types';

const sample: Project[] = [
  { title: 'A', company: 'X', category: 'AI/Agents', tags: [], description: '' },
  { title: 'B', company: 'Y', category: 'Full-Stack', tags: [], description: '' },
];

describe('filterProjects', () => {
  it('returns all projects when filter is "All"', () => {
    expect(filterProjects(sample, 'All')).toHaveLength(2);
  });

  it('returns only projects matching the category', () => {
    expect(filterProjects(sample, 'AI/Agents')).toEqual([sample[0]]);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/lib/filterProjects.test.ts
```

Expected: FAIL — `Cannot find module './filterProjects'`.

- [ ] **Step 3: Create `src/lib/filterProjects.ts`**

```ts
import type { Project, ProjectCategory } from '../data/types';

export type FilterOption = 'All' | ProjectCategory;

export function filterProjects(projects: Project[], filter: FilterOption): Project[] {
  if (filter === 'All') return projects;
  return projects.filter((project) => project.category === filter);
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/lib/filterProjects.test.ts
```

Expected: PASS (2 tests).

- [ ] **Step 5: Write the failing component test — `src/components/sections/Portfolio.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Portfolio } from './Portfolio';

describe('Portfolio', () => {
  it('shows all projects by default', () => {
    render(<Portfolio />);
    expect(screen.getByText('Agentic Chat Workflow')).toBeInTheDocument();
    expect(screen.getByText('Airline Itinerary Portal')).toBeInTheDocument();
  });

  it('filters projects when a category is selected', async () => {
    render(<Portfolio />);
    await userEvent.click(screen.getByRole('button', { name: 'AI/Agents' }));

    expect(screen.getByText('Agentic Chat Workflow')).toBeInTheDocument();
    expect(screen.queryByText('Airline Itinerary Portal')).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run the test to verify it fails**

```bash
npx vitest run src/components/sections/Portfolio.test.tsx
```

Expected: FAIL — `Cannot find module './Portfolio'`.

- [ ] **Step 7: Create `src/components/sections/Portfolio.tsx`**

```tsx
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects } from '../../data/projects';
import { filterProjects, type FilterOption } from '../../lib/filterProjects';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const FILTERS: FilterOption[] = ['All', 'AI/Agents', 'Full-Stack', 'Enterprise'];

const GRADIENTS = ['from-coral-500 to-amber-400', 'from-amber-400 to-pink-400', 'from-pink-400 to-coral-500'];

export function Portfolio() {
  const [filter, setFilter] = useState<FilterOption>('All');
  const visibleProjects = filterProjects(projects, filter);

  return (
    <section id="portfolio" className="mx-auto max-w-6xl px-6 py-24">
      <SectionHeading eyebrow="Portfolio" title="Selected work" />

      <div className="mt-8 flex flex-wrap gap-3">
        {FILTERS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              filter === option
                ? 'border-coral-500 bg-coral-500 text-white'
                : 'border-border-subtle text-ink/70 hover:border-coral-500 hover:text-coral-500'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.title}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <div className={`h-24 w-full rounded-2xl bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]}`} />
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{project.title}</h3>
                <p className="text-sm text-ink/50">{project.company}</p>
                <p className="mt-2 text-sm text-ink/70">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 8: Run the test to verify it passes**

```bash
npx vitest run src/components/sections/Portfolio.test.tsx
```

Expected: PASS (2 tests).

- [ ] **Step 9: Commit**

```bash
git add src/lib/filterProjects.ts src/lib/filterProjects.test.ts src/components/sections/Portfolio.tsx src/components/sections/Portfolio.test.tsx
git commit -m "feat: add Portfolio showcase with animated category filters"
```

---

### Task 14: Contact section with Web3Forms

**Files:**
- Create: `src/lib/validateContactForm.ts`, `src/lib/validateContactForm.test.ts`
- Create: `src/lib/submitContactForm.ts`
- Create: `src/components/sections/Contact.tsx`, `src/components/sections/Contact.test.tsx`
- Create: `.env.example`

**Interfaces:**
- Produces: `ContactFormValues { name, email, message }`, `ContactFormErrors { name?, email?, message? }`, `validateContactForm(values): ContactFormErrors` — pure function, unit tested in isolation.
- Produces: `submitContactForm(values: ContactFormValues): Promise<void>` — thin fetch wrapper around Web3Forms, mocked in the component test.
- Produces: `Contact()` rendering `<section id="contact">` — consumed by `App.tsx` in Task 15.

- [ ] **Step 1: Write the failing validation test — `src/lib/validateContactForm.test.ts`**

```ts
import { describe, expect, it } from 'vitest';
import { validateContactForm } from './validateContactForm';

describe('validateContactForm', () => {
  it('requires a name', () => {
    const errors = validateContactForm({ name: '', email: '', message: 'Hello there, testing.' });
    expect(errors.name).toBe('Name is required.');
  });

  it('requires a message of at least 10 characters', () => {
    const errors = validateContactForm({ name: 'Jane', email: '', message: 'short' });
    expect(errors.message).toBe('Message should be at least 10 characters.');
  });

  it('allows a blank email since it is optional', () => {
    const errors = validateContactForm({ name: 'Jane', email: '', message: 'Hello there, testing.' });
    expect(errors.email).toBeUndefined();
  });

  it('flags an invalid email format when provided', () => {
    const errors = validateContactForm({ name: 'Jane', email: 'not-an-email', message: 'Hello there, testing.' });
    expect(errors.email).toBe('Enter a valid email address.');
  });

  it('passes with valid values', () => {
    const errors = validateContactForm({ name: 'Jane', email: 'jane@example.com', message: 'Hello there, testing.' });
    expect(errors).toEqual({});
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
npx vitest run src/lib/validateContactForm.test.ts
```

Expected: FAIL — `Cannot find module './validateContactForm'`.

- [ ] **Step 3: Create `src/lib/validateContactForm.ts`**

```ts
export interface ContactFormValues {
  name: string;
  email: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.name.trim()) {
    errors.name = 'Name is required.';
  }

  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Enter a valid email address.';
  }

  if (!values.message.trim()) {
    errors.message = 'Message is required.';
  } else if (values.message.trim().length < 10) {
    errors.message = 'Message should be at least 10 characters.';
  }

  return errors;
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
npx vitest run src/lib/validateContactForm.test.ts
```

Expected: PASS (5 tests).

- [ ] **Step 5: Create `src/lib/submitContactForm.ts`**

```ts
import type { ContactFormValues } from './validateContactForm';

const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

export async function submitContactForm(values: ContactFormValues): Promise<void> {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY as string | undefined;
  if (!accessKey) {
    throw new Error('Missing VITE_WEB3FORMS_ACCESS_KEY environment variable.');
  }

  const response = await fetch(WEB3FORMS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      name: values.name,
      email: values.email || 'not-provided@prowaseem.com',
      message: values.message,
      subject: `New portfolio message from ${values.name}`,
    }),
  });

  const result = (await response.json()) as { success: boolean; message?: string };
  if (!result.success) {
    throw new Error(result.message ?? 'Submission failed.');
  }
}
```

- [ ] **Step 6: Create `.env.example`**

```bash
# Get a free access key at https://web3forms.com and put it in .env.local (not committed)
VITE_WEB3FORMS_ACCESS_KEY=your-access-key-here
```

- [ ] **Step 7: Write the failing component test — `src/components/sections/Contact.test.tsx`**

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Contact } from './Contact';
import { submitContactForm } from '../../lib/submitContactForm';

vi.mock('../../lib/submitContactForm', () => ({
  submitContactForm: vi.fn(),
}));

describe('Contact', () => {
  beforeEach(() => {
    vi.mocked(submitContactForm).mockReset();
  });

  it('shows a validation error when required fields are empty', async () => {
    render(<Contact />);
    await userEvent.click(screen.getByRole('button', { name: /send message/i }));
    expect(await screen.findByText('Name is required.')).toBeInTheDocument();
  });

  it('submits successfully with valid input', async () => {
    vi.mocked(submitContactForm).mockResolvedValue(undefined);

    render(<Contact />);
    await userEvent.type(screen.getByLabelText('Name'), 'Jane Doe');
    await userEvent.type(screen.getByLabelText('Message'), 'Hello, I would love to collaborate.');
    await userEvent.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/thanks for reaching out/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 8: Run the test to verify it fails**

```bash
npx vitest run src/components/sections/Contact.test.tsx
```

Expected: FAIL — `Cannot find module './Contact'`.

- [ ] **Step 9: Create `src/components/sections/Contact.tsx`**

```tsx
import { useState, type FormEvent } from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { validateContactForm, type ContactFormErrors, type ContactFormValues } from '../../lib/validateContactForm';
import { submitContactForm } from '../../lib/submitContactForm';

const INITIAL_VALUES: ContactFormValues = { name: '', email: '', message: '' };

export function Contact() {
  const [values, setValues] = useState<ContactFormValues>(INITIAL_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const honeypot = (event.currentTarget.elements.namedItem('company') as HTMLInputElement | null)?.value;
    if (honeypot) return;

    const validationErrors = validateContactForm(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setStatus('submitting');
    try {
      await submitContactForm(values);
      setStatus('success');
      setValues(INITIAL_VALUES);
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-2xl px-6 py-24">
      <SectionHeading eyebrow="Contact" title="Let's build something together" />
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-10 space-y-5"
        noValidate
      >
        <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div>
          <label htmlFor="name" className="text-sm font-medium text-ink/80">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={(e) => setValues((prev) => ({ ...prev, name: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3 text-ink focus:border-coral-500 focus:outline-none"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="text-sm font-medium text-ink/80">
            Email (optional)
          </label>
          <input
            id="email"
            name="email"
            value={values.email}
            onChange={(e) => setValues((prev) => ({ ...prev, email: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3 text-ink focus:border-coral-500 focus:outline-none"
          />
          {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="message" className="text-sm font-medium text-ink/80">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={(e) => setValues((prev) => ({ ...prev, message: e.target.value }))}
            className="mt-1 w-full rounded-xl border border-border-subtle bg-surface-elevated px-4 py-3 text-ink focus:border-coral-500 focus:outline-none"
          />
          {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
        </div>

        <Button className="w-full">{status === 'submitting' ? 'Sending…' : 'Send message'}</Button>

        {status === 'success' && (
          <p className="text-sm text-emerald-600">Thanks for reaching out — I&apos;ll reply soon.</p>
        )}
        {status === 'error' && (
          <p className="text-sm text-red-500">Something went wrong. Please email me directly instead.</p>
        )}
      </motion.form>
    </section>
  );
}
```

- [ ] **Step 10: Run the test to verify it passes**

```bash
npx vitest run src/components/sections/Contact.test.tsx
```

Expected: PASS (2 tests).

- [ ] **Step 11: Commit**

```bash
git add src/lib/validateContactForm.ts src/lib/validateContactForm.test.ts src/lib/submitContactForm.ts \
  src/components/sections/Contact.tsx src/components/sections/Contact.test.tsx .env.example
git commit -m "feat: add Contact section with validation and Web3Forms submission"
```

---

### Task 15: Wire up `App.tsx` and finalize

**Files:**
- Modify: `src/App.tsx`, `src/App.test.tsx`

**Interfaces:**
- Consumes: `Header`, `Footer` (Tasks 7–8), `Hero`, `About`, `Skills`, `Experience`, `Portfolio`, `Contact` (Tasks 9–14).
- Produces: the final `App` — no further consumers within the app; this is the render root passed to `main.tsx` (already wired in Task 1).

- [ ] **Step 1: Replace `src/App.tsx`**

```tsx
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Experience } from './components/sections/Experience';
import { Portfolio } from './components/sections/Portfolio';
import { Contact } from './components/sections/Contact';

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default App;
```

- [ ] **Step 2: Replace `src/App.test.tsx` with a full-page smoke test**

```tsx
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

beforeEach(() => {
  Element.prototype.scrollIntoView = () => {};
});

describe('App', () => {
  it('renders every top-level section', () => {
    render(<App />);
    expect(screen.getAllByText('Muhammad Waseem Irshad').length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /technologies i work with/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /where i've worked/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /selected work/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /let's build something together/i })).toBeInTheDocument();
  });
});
```

- [ ] **Step 3: Run the full test suite**

```bash
npm run test
```

Expected: every test file created so far passes (App, data, ui, useTheme, useScrollSpy, Header, Footer, Hero, About, Skills, Experience, filterProjects, Portfolio, Contact — 14 files, 0 failures).

- [ ] **Step 4: Run the build and preview it locally**

```bash
npm run build
npm run preview
```

Expected: build succeeds; open the printed preview URL and manually scroll through Hero → About → Skills → Experience → Portfolio → Contact, toggle dark mode, resize the window to confirm mobile/tablet/desktop layouts, and click each Portfolio filter pill. Stop the preview server (Ctrl+C) once confirmed.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/App.test.tsx
git commit -m "feat: wire up all sections into the final single-page App"
```

---

### Task 16: Final verification and documentation

**Files:**
- Modify: `README.md`

**Interfaces:**
- None — this task only verifies and documents; it introduces no new code consumed elsewhere.

- [ ] **Step 1: Run the full test suite and build one more time**

```bash
npm run test && npm run build
```

Expected: all tests pass, build succeeds, `dist/` contains `index.html` plus hashed asset files.

- [ ] **Step 2: Confirm no CRA/Bootstrap remnants remain**

```bash
grep -RIl "react-bootstrap\|bootstrap\|react-scripts\|@fortawesome" package.json src 2>/dev/null || echo "clean"
```

Expected: prints `clean` (no matches).

- [ ] **Step 3: Rewrite `README.md`**

```markdown
# prowaseem.com

Personal portfolio for Muhammad Waseem Irshad — Senior Frontend Engineer.

## Stack

Vite + React 19 + TypeScript, Tailwind CSS v4 ("Warm Sunset" theme), Framer Motion,
Vitest + React Testing Library. Contact form delivery via [Web3Forms](https://web3forms.com).

## Development

```bash
npm install
npm run dev       # local dev server
npm run test      # run the test suite once
npm run test:watch
npm run build     # outputs static files to dist/
npm run preview   # preview the production build locally
```

## Contact form setup

Get a free access key at https://web3forms.com, then create `.env.local`:

```
VITE_WEB3FORMS_ACCESS_KEY=your-access-key-here
```

## Deployment

`npm run build` produces a self-contained `dist/` folder. Sync its contents to the
S3 bucket backing prowaseem.com (outside the scope of this repo).
```

- [ ] **Step 4: Commit**

```bash
git add README.md
git commit -m "docs: update README for the Vite/React/Tailwind stack"
```

## Self-Review Notes

- **Spec coverage:** every spec section has a task — architecture (Task 1), Tailwind theme (Task 2), data model (Task 3), UI primitives/motion (Task 4), dark mode (Task 5), header/scroll-spy (Tasks 6–7), footer (Task 8), all six sections (Tasks 9–14), wiring (Task 15), cleanup verification + docs (Task 16).
- **Placeholder scan:** no TBD/TODO markers; every code block is complete, runnable code.
- **Type consistency:** `Project`/`ProjectCategory` (Task 3) match `filterProjects`/`Portfolio` (Task 13) exactly; `ContactFormValues`/`ContactFormErrors` (Task 14) are defined once in `validateContactForm.ts` and imported by `submitContactForm.ts` and `Contact.tsx` rather than redeclared; `EmploymentEntry`/`EmploymentDetail` (Task 3) match the fields `Experience.tsx` (Task 12) renders.
