# v2 Website Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy hand-written site with a modern Next.js (static-export) personal engineering profile — facet-card single-page layout, swappable Plum Warm theme tokens, dark/light toggle, auto-deployed to GitHub Pages.

**Architecture:** Next.js App Router exported to static HTML (`output: 'export'`). Tailwind v4 with semantic color tokens defined once in `:root`/`.dark` and exposed via `@theme inline`. All copy lives in typed `content/` data files; components render from data. Theme logic is extracted into pure helpers (`lib/theme.ts`) so it is unit-testable; presentational components get light render-assertion tests; the full build is verified at the end. GitHub Actions builds and deploys the `out/` artifact.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS v4, `next/font`, Vitest + @testing-library/react (jsdom), GitHub Actions Pages deploy.

---

## File Structure

```
next.config.ts              # output: 'export', images.unoptimized
postcss.config.mjs          # @tailwindcss/postcss
tsconfig.json               # @/* path alias
vitest.config.ts            # jsdom + react plugin
vitest.setup.ts             # jest-dom matchers
package.json                # scripts: dev/build/test/lint

app/
  layout.tsx                # fonts, no-flash theme script, <body> shell
  page.tsx                  # composes all sections
  globals.css               # tailwind import + color/font tokens
  writing/page.tsx          # scaffolded, NOT linked at launch

lib/
  theme.ts                  # resolveInitialTheme(), applyTheme() — pure, tested

content/
  types.ts                  # shared TS types
  links.ts  facets.ts  experience.ts  projects.ts  stack.ts  personal.ts  about.ts

components/
  Nav.tsx        ThemeToggle.tsx   Reveal.tsx
  Hero.tsx       FacetCards.tsx    About.tsx     Experience.tsx
  Projects.tsx   TechStack.tsx     Personal.tsx  Footer.tsx
  ui/Chip.tsx    ui/Section.tsx    ui/Card.tsx

public/
  An-Ting-Hsu-Resume.pdf    # 2024.11 (asset dropped in by owner)
  favicon.svg               # initials + space-tech aesthetic
  og.svg                    # social preview
  .nojekyll

.github/workflows/deploy.yml

tests/
  theme.test.ts  content.test.ts  components.test.tsx
```

Old files removed in Task 1: `index.html`, `style.css`, `animation.js`, `background.jpg`, `profile.ico`. `2018mis/` is moved to `archive/2018mis/` (outside `public/`, so it is never exported/served).

---

## Task 1: Scaffold project & remove legacy root files

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `next-env.d.ts`, `.gitignore` (append)
- Delete: `index.html`, `style.css`, `animation.js`, `background.jpg`, `profile.ico`

- [ ] **Step 1: Pin Node + install deps (nvm + pnpm)**

Node is pinned to **v24.16.0** via `.nvmrc`; the package manager is **pnpm**.

```bash
node -v > /dev/null  # ensure `nvm use` has selected v24.16.0 (see .nvmrc)
pnpm init
pnpm add next@15 react@19 react-dom@19
pnpm add -D typescript @types/react @types/node @types/react-dom \
  tailwindcss @tailwindcss/postcss postcss \
  vitest @vitejs/plugin-react jsdom \
  @testing-library/react @testing-library/dom @testing-library/jest-dom \
  eslint eslint-config-next
```

A `.nvmrc` containing `v24.16.0` is committed at the repo root so `nvm use`
selects the right Node, and `packageManager` is pinned in `package.json`.

- [ ] **Step 2: Write `package.json` scripts**

Replace the `"scripts"` block in `package.json` with:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run"
  }
}
```

- [ ] **Step 3: Write `next.config.ts`**

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
```

- [ ] **Step 4: Write `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "archive"]
}
```

- [ ] **Step 5: Write `postcss.config.mjs`**

```js
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```

- [ ] **Step 6: Append Next.js ignores to `.gitignore`**

Append these lines to `.gitignore`:

```
# Next.js
/.next/
/out/
next-env.d.ts

# deps
/node_modules
npm-debug.log*
```

- [ ] **Step 7: Delete legacy root files**

```bash
git rm index.html style.css animation.js background.jpg profile.ico
```

- [ ] **Step 8: Archive the old 2018mis site (no longer served)**

```bash
mkdir -p archive
git mv 2018mis archive/2018mis
```

- [ ] **Step 9: Commit**

```bash
git add package.json pnpm-lock.yaml .nvmrc tsconfig.json next.config.ts postcss.config.mjs .gitignore archive
git commit -m "chore: scaffold Next.js + Tailwind project, remove legacy site, archive 2018mis"
```

---

## Task 2: Test harness (Vitest + Testing Library)

**Files:**
- Create: `vitest.config.ts`, `vitest.setup.ts`, `tests/smoke.test.ts`

- [ ] **Step 1: Write `vitest.config.ts`**

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: { "@": fileURLToPath(new URL("./", import.meta.url)) },
  },
});
```

- [ ] **Step 2: Write `vitest.setup.ts`**

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Write a smoke test `tests/smoke.test.ts`**

```ts
import { describe, it, expect } from "vitest";

describe("test harness", () => {
  it("runs", () => {
    expect(1 + 1).toBe(2);
  });
});
```

- [ ] **Step 4: Run it**

Run: `pnpm test`
Expected: PASS, 1 test.

- [ ] **Step 5: Commit**

```bash
git add vitest.config.ts vitest.setup.ts tests/smoke.test.ts
git commit -m "test: add vitest + testing-library harness"
```

---

## Task 3: Color tokens, fonts, globals.css & root layout

**Files:**
- Create: `app/globals.css`, `app/layout.tsx`

- [ ] **Step 1: Write `app/globals.css`** (tokens are the single source of truth — components must use semantic utilities only)

```css
@import "tailwindcss";

/* class-based dark mode */
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --bg-from: #fbf7f4;   --bg-to: #f4eef6;   --dots: #e6dcea;
  --surface: #ffffffc7; --border: #ece0ee;
  --text: #272029;      --text-muted: #564e5c; --text-subtle: #9a8aa0;
  --accent: #8a5a86;    --accent-hover: #744a70;
  --chip: #f1eaf3;      --chip-text: #7d5f80;
}

.dark {
  --bg-from: #181420;   --bg-to: #181420;   --dots: #2c2533;
  --surface: #211b2a;   --border: #332b3e;
  --text: #ece6ef;      --text-muted: #b3a9bd; --text-subtle: #8c7d96;
  --accent: #c79bc4;    --accent-hover: #d8b3d5;
  --chip: #2a2233;      --chip-text: #cda9ca;
}

@theme inline {
  --color-bg-from: var(--bg-from);
  --color-bg-to: var(--bg-to);
  --color-dots: var(--dots);
  --color-surface: var(--surface);
  --color-border: var(--border);
  --color-text: var(--text);
  --color-text-muted: var(--text-muted);
  --color-text-subtle: var(--text-subtle);
  --color-accent: var(--accent);
  --color-accent-hover: var(--accent-hover);
  --color-chip: var(--chip);
  --color-chip-text: var(--chip-text);
  --font-sans: var(--font-inter);
  --font-mono: var(--font-jetbrains);
}

html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
}

body {
  color: var(--text);
  background-color: var(--bg-from);
  background-image:
    radial-gradient(var(--dots) 1px, transparent 1px),
    linear-gradient(160deg, var(--bg-from) 0%, var(--bg-to) 100%);
  background-size: 16px 16px, 100% 100%;
  background-attachment: fixed;
  min-height: 100vh;
}
```

- [ ] **Step 2: Write `app/layout.tsx`** (fonts + no-flash theme script)

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "An-Ting (Andy) Hsu — Software Engineer",
  description:
    "Taipei-based software engineer building full-stack products, developer tools, and distributed systems.",
};

const noFlash = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: noFlash }} />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

- [ ] **Step 3: Create a temporary `app/page.tsx` to verify the build**

```tsx
export default function Home() {
  return <main className="p-10 text-text">Placeholder — theme tokens load.</main>;
}
```

- [ ] **Step 4: Verify the dev build compiles**

Run: `pnpm build`
Expected: build succeeds, `out/` directory created with `index.html`.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css app/layout.tsx app/page.tsx
git commit -m "feat: color token system, fonts, root layout with no-flash theme"
```

---

## Task 4: Theme logic + ThemeToggle

**Files:**
- Create: `lib/theme.ts`, `components/ThemeToggle.tsx`
- Test: `tests/theme.test.ts`

- [ ] **Step 1: Write the failing test `tests/theme.test.ts`**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { resolveInitialTheme, applyTheme } from "@/lib/theme";

describe("resolveInitialTheme", () => {
  it("honors a stored 'dark' value", () => {
    expect(resolveInitialTheme("dark", false)).toBe("dark");
  });
  it("honors a stored 'light' value over system preference", () => {
    expect(resolveInitialTheme("light", true)).toBe("light");
  });
  it("falls back to system preference when nothing is stored", () => {
    expect(resolveInitialTheme(null, true)).toBe("dark");
    expect(resolveInitialTheme(null, false)).toBe("light");
  });
  it("ignores a junk stored value", () => {
    expect(resolveInitialTheme("purple", true)).toBe("dark");
  });
});

describe("applyTheme", () => {
  beforeEach(() => document.documentElement.classList.remove("dark"));
  it("adds .dark for dark theme", () => {
    applyTheme("dark");
    expect(document.documentElement).toHaveClass("dark");
  });
  it("removes .dark for light theme", () => {
    document.documentElement.classList.add("dark");
    applyTheme("light");
    expect(document.documentElement).not.toHaveClass("dark");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/theme.test.ts`
Expected: FAIL — cannot resolve `@/lib/theme`.

- [ ] **Step 3: Write `lib/theme.ts`**

```ts
export type Theme = "light" | "dark";

export function resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === "dark" || stored === "light") return stored;
  return prefersDark ? "dark" : "light";
}

export function applyTheme(theme: Theme, root: HTMLElement = document.documentElement): void {
  root.classList.toggle("dark", theme === "dark");
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- tests/theme.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Write `components/ThemeToggle.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { applyTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="rounded-md border border-border px-2 py-1 font-mono text-xs text-text-subtle transition-colors hover:text-accent-hover"
    >
      {theme === "dark" ? "☾ dark" : "☀ light"}
    </button>
  );
}
```

- [ ] **Step 6: Commit**

```bash
git add lib/theme.ts components/ThemeToggle.tsx tests/theme.test.ts
git commit -m "feat: tested theme logic + ThemeToggle"
```

---

## Task 5: Content types + data files

**Files:**
- Create: `content/types.ts`, `content/links.ts`, `content/about.ts`, `content/facets.ts`, `content/experience.ts`, `content/projects.ts`, `content/stack.ts`, `content/personal.ts`
- Test: `tests/content.test.ts`

- [ ] **Step 1: Write `content/types.ts`**

```ts
export type Facet = { title: string; blurb: string; chips: string[] };
export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  blurb: string;
  earlier?: boolean;
};
export type Project = {
  name: string;
  context?: string;
  blurb: string;
  tags: string[];
  href?: string;
};
export type StackGroup = { label: string; items: string[] };
export type SocialLinks = {
  github: string;
  linkedin: string;
  instagram: string;
  resume: string;
};
```

- [ ] **Step 2: Write the failing test `tests/content.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { facets } from "@/content/facets";
import { experience } from "@/content/experience";
import { projects } from "@/content/projects";
import { stack } from "@/content/stack";
import { links } from "@/content/links";

describe("content data", () => {
  it("has exactly 4 facets, each with a title, blurb, and chips", () => {
    expect(facets).toHaveLength(4);
    for (const f of facets) {
      expect(f.title).toBeTruthy();
      expect(f.blurb).toBeTruthy();
      expect(f.chips.length).toBeGreaterThan(0);
    }
  });
  it("lists experience newest-first with required fields", () => {
    expect(experience.length).toBeGreaterThanOrEqual(4);
    expect(experience[0].company).toBe("SiFive");
    for (const e of experience) {
      expect(e.role && e.period && e.blurb).toBeTruthy();
    }
  });
  it("has projects with non-empty tags", () => {
    expect(projects.length).toBeGreaterThanOrEqual(6);
    for (const p of projects) expect(p.tags.length).toBeGreaterThan(0);
  });
  it("groups the tech stack", () => {
    const labels = stack.map((g) => g.label);
    expect(labels).toContain("Backend");
    expect(labels).toContain("Infrastructure");
  });
  it("omits email and keeps the three social links", () => {
    expect(links.github).toMatch(/github\.com\/andyhsu10/);
    expect(links.linkedin).toMatch(/antinghsu10/);
    expect(links.instagram).toMatch(/andyhsuanting/);
    expect(JSON.stringify(links)).not.toMatch(/mailto|@gmail/);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `pnpm test -- tests/content.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 4: Write `content/links.ts`**

```ts
import type { SocialLinks } from "./types";

export const links: SocialLinks = {
  github: "https://github.com/andyhsu10",
  linkedin: "https://www.linkedin.com/in/antinghsu10/",
  instagram: "https://www.instagram.com/andyhsuanting/",
  resume: "/An-Ting-Hsu-Resume.pdf",
};
```

- [ ] **Step 5: Write `content/about.ts`**

```ts
export const about =
  "I'm Andy, a Taipei-based software engineer. I work full-stack but lean toward " +
  "backend, infrastructure, and developer tooling — designing APIs and services, " +
  "building VS Code extensions, and integrating distributed systems. My path runs " +
  "through startups, an international engineering org at SiFive, Web3, and homelab " +
  "infrastructure. I also completed NTU's law credit program, which gives me an " +
  "unusual interdisciplinary lens on contracts, governance, and how software meets " +
  "the real world.";
```

- [ ] **Step 6: Write `content/facets.ts`**

```ts
import type { Facet } from "./types";

export const facets: Facet[] = [
  {
    title: "Backend & Infrastructure",
    blurb: "APIs, service architecture, and container-to-cluster deployment.",
    chips: ["Django/DRF", "PostgreSQL", "Redis", "Docker", "K8s/EKS", "CI/CD"],
  },
  {
    title: "Developer Tools",
    blurb: "VS Code extensions, language servers, and telemetry.",
    chips: ["VS Code API", "LSP", "Webview", "Sentry"],
  },
  {
    title: "Distributed Systems",
    blurb: "Multi-node, event-driven systems and edge integration.",
    chips: ["Go", "gRPC", "protobuf", "Next.js"],
  },
  {
    title: "Explorations",
    blurb: "Web3 smart contracts, homelab, and IoT.",
    chips: ["Solidity", "Ethereum", "Stacks", "ESP32", "NAS"],
  },
];
```

- [ ] **Step 7: Write `content/experience.ts`**

```ts
import type { ExperienceEntry } from "./types";

export const experience: ExperienceEntry[] = [
  {
    company: "SiFive",
    role: "Full Stack Engineer",
    period: "2024 — Present",
    blurb:
      "Full-stack work on internal engineering platforms and a VS Code extension " +
      "for product specs — Django/DRF APIs, React/TypeScript UIs, LSP integration, " +
      "and Kubernetes-based CI/CD.",
  },
  {
    company: "Freelancer",
    role: "Software Engineer",
    period: "2023 — 2024",
    blurb:
      "Built a prediction-market backend with on-chain deposits/withdrawals and a " +
      "CMS, plus a LINE-bot dating MVP (50+ DAU) later rebuilt with Django REST.",
  },
  {
    company: "Biznius.AI (SeFo Finance)",
    role: "Co-founder / Software Engineer",
    period: "2022 — 2023",
    blurb:
      "Shipped a leverage yield-farming product on Stacks, company web properties, " +
      "and a ChatGPT chrome extension; led smart-contract integration across two " +
      "chains over three hackathons.",
  },
  {
    company: "Poseidon Network",
    role: "Software Engineer",
    period: "2019 — 2022",
    blurb:
      "Built Django APIs for 15k+ users and ~2,000 distributed edge devices, ERC20 " +
      "token products, and IPFS-based distributed storage.",
  },
  {
    company: "Blockore",
    role: "Co-founder / Software Engineer",
    period: "2018 — 2019",
    blurb: "Led four engineers building member, blog, and mailing services on AWS.",
    earlier: true,
  },
];
```

- [ ] **Step 8: Write `content/projects.ts`**

```ts
import type { Project } from "./types";

export const projects: Project[] = [
  {
    name: "VS Code Extension",
    context: "SiFive",
    blurb:
      "A developer tool to download, edit, validate, and submit product-specification " +
      "files, with a custom version-control mechanism and Sentry across host, language " +
      "server, and webview.",
    tags: ["VS Code API", "LSP", "TypeScript", "Sentry"],
  },
  {
    name: "Internal Engineering Platform",
    context: "SiFive",
    blurb:
      "Django + React internal system for engineering workflows — API design, spec " +
      "validation, and Kubernetes/EKS CI/CD.",
    tags: ["Django", "React", "EKS", "CI/CD"],
  },
  {
    name: "Distributed Camera System",
    blurb:
      "Architecture and module design for a multi-node distributed camera system with " +
      "event-driven communication and REST fallbacks.",
    tags: ["Go", "gRPC", "protobuf", "Next.js"],
  },
  {
    name: "2024 Solar Eclipse Environment Monitor",
    blurb:
      "A monitor built to capture environmental changes during the 2024 total solar eclipse.",
    tags: ["Python", "IoT"],
    href: "https://github.com/andyhsu10/2024-solar-eclipse-orange-monitor",
  },
  {
    name: "Homelab / Network Infrastructure",
    blurb:
      "A segmented home network and NAS setup — UniFi gear, Synology RAID storage with " +
      "SSD cache, 2.5GbE, and VLAN isolation.",
    tags: ["UniFi", "Synology", "2.5GbE", "VLAN"],
  },
  {
    name: "Web3 / Prediction Market",
    blurb:
      "Early-stage Web3 products — Ethereum/Solidity contracts, a Stacks yield product, " +
      "and prediction-market backends.",
    tags: ["Solidity", "Ethereum", "Stacks"],
  },
];

export const awardBadge = "🏆 Mars Mail — #1, OpenAI Stack Hack";
```

- [ ] **Step 9: Write `content/stack.ts`**

```ts
import type { StackGroup } from "./types";

export const stack: StackGroup[] = [
  { label: "Backend", items: ["Python", "Django", "DRF", "Go", "Node.js", "REST", "gRPC", "PostgreSQL", "Redis", "Celery"] },
  { label: "Frontend", items: ["React", "TypeScript", "Next.js", "VS Code Webview"] },
  { label: "Developer Tools", items: ["VS Code Extension API", "LSP", "JSON/JSON5", "Sentry", "Telemetry"] },
  { label: "Infrastructure", items: ["Docker", "Docker Compose", "Kubernetes", "EKS", "GitHub Actions", "Concourse", "RabbitMQ", "CloudWatch", "Nginx"] },
  { label: "Web3", items: ["Solidity", "Ethereum", "Stacks", "Smart Contracts"] },
  { label: "IoT / Homelab", items: ["ESP32", "ESPHome", "UniFi", "Synology NAS", "2.5GbE"] },
];
```

- [ ] **Step 10: Write `content/personal.ts`**

```ts
export const personal = {
  text:
    "Outside engineering: self-driving road trips, chasing and photographing solar " +
    "eclipses, homelab tinkering, and a side interest in law. Highlights include a solo " +
    "self-driving trip across New Zealand and photographing total solar eclipses.",
  tags: ["Travel", "Astronomy", "Photography", "Homelab", "Law"],
};
```

- [ ] **Step 11: Run test to verify it passes**

Run: `pnpm test -- tests/content.test.ts`
Expected: PASS, 5 tests.

- [ ] **Step 12: Commit**

```bash
git add content/ tests/content.test.ts
git commit -m "feat: typed content data files with integrity tests"
```

---

## Task 6: UI primitives (Chip, Section, Card)

**Files:**
- Create: `components/ui/Chip.tsx`, `components/ui/Section.tsx`, `components/ui/Card.tsx`

- [ ] **Step 1: Write `components/ui/Chip.tsx`**

```tsx
export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-md bg-chip px-2 py-0.5 font-mono text-[11px] text-chip-text">
      {children}
    </span>
  );
}
```

- [ ] **Step 2: Write `components/ui/Section.tsx`** (section wrapper + uppercase label + anchor id)

```tsx
export function Section({
  id,
  label,
  children,
}: {
  id?: string;
  label?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mx-auto w-full max-w-3xl scroll-mt-20 px-6 py-12">
      {label && (
        <h2 className="mb-6 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-text-subtle">
          {label}
        </h2>
      )}
      {children}
    </section>
  );
}
```

- [ ] **Step 3: Write `components/ui/Card.tsx`**

```tsx
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface p-5 backdrop-blur-sm transition-transform duration-200 hover:-translate-y-0.5 ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/
git commit -m "feat: UI primitives — Chip, Section, Card"
```

---

## Task 7: Reveal (scroll fade-in, reduced-motion safe)

**Files:**
- Create: `components/Reveal.tsx`

- [ ] **Step 1: Write `components/Reveal.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";

export function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        shown ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Reveal.tsx
git commit -m "feat: Reveal scroll fade-in with reduced-motion guard"
```

---

## Task 8: Hero

**Files:**
- Create: `components/Hero.tsx`
- Test: `tests/components.test.tsx`

- [ ] **Step 1: Write the failing test `tests/components.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Hero } from "@/components/Hero";

describe("Hero", () => {
  it("shows the name, tagline, and three links (no email)", () => {
    render(<Hero />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/Andy/);
    expect(screen.getByText(/full-stack products, developer tools/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /resume/i })).toBeInTheDocument();
    expect(screen.queryByText(/@gmail/i)).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/components.test.tsx`
Expected: FAIL — cannot resolve `@/components/Hero`.

- [ ] **Step 3: Write `components/Hero.tsx`**

```tsx
import { links } from "@/content/links";

export function Hero() {
  return (
    <header className="mx-auto w-full max-w-3xl px-6 pb-4 pt-24">
      <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
        An-Ting <span className="text-accent">&ldquo;Andy&rdquo;</span> Hsu
      </h1>
      <p className="mt-4 max-w-xl text-lg leading-relaxed text-text-muted">
        Software engineer building{" "}
        <span className="font-medium text-text">
          full-stack products, developer tools, and distributed systems.
        </span>
        <br />
        Taipei-based · backend &amp; infrastructure leaning.
      </p>
      <nav className="mt-6 flex gap-4 font-mono text-sm text-text-subtle">
        <a className="transition-colors hover:text-accent-hover" href={links.github}>GitHub</a>
        <a className="transition-colors hover:text-accent-hover" href={links.linkedin}>LinkedIn</a>
        <a className="transition-colors hover:text-accent-hover" href={links.resume}>Resume</a>
      </nav>
    </header>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- tests/components.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx tests/components.test.tsx
git commit -m "feat: Hero section"
```

---

## Task 9: FacetCards (What I Build)

**Files:**
- Create: `components/FacetCards.tsx`
- Test: extend `tests/components.test.tsx`

- [ ] **Step 1: Add a failing test to `tests/components.test.tsx`**

Append:

```tsx
import { FacetCards } from "@/components/FacetCards";

describe("FacetCards", () => {
  it("renders all four facet titles", () => {
    render(<FacetCards />);
    expect(screen.getByText("Backend & Infrastructure")).toBeInTheDocument();
    expect(screen.getByText("Developer Tools")).toBeInTheDocument();
    expect(screen.getByText("Distributed Systems")).toBeInTheDocument();
    expect(screen.getByText("Explorations")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test -- tests/components.test.tsx`
Expected: FAIL — cannot resolve `@/components/FacetCards`.

- [ ] **Step 3: Write `components/FacetCards.tsx`**

```tsx
import { facets } from "@/content/facets";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

export function FacetCards() {
  return (
    <Section id="build" label="What I build">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {facets.map((f) => (
          <Card key={f.title}>
            <h3 className="text-base font-semibold tracking-tight">{f.title}</h3>
            <p className="mt-1.5 text-sm text-text-muted">{f.blurb}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {f.chips.map((c) => (
                <Chip key={c}>{c}</Chip>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test -- tests/components.test.tsx`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/FacetCards.tsx tests/components.test.tsx
git commit -m "feat: FacetCards (What I build)"
```

---

## Task 10: About

**Files:**
- Create: `components/About.tsx`

- [ ] **Step 1: Write `components/About.tsx`**

```tsx
import { about } from "@/content/about";
import { Section } from "@/components/ui/Section";

export function About() {
  return (
    <Section id="about" label="About">
      <p className="text-base leading-relaxed text-text-muted">{about}</p>
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/About.tsx
git commit -m "feat: About section"
```

---

## Task 11: Experience

**Files:**
- Create: `components/Experience.tsx`

- [ ] **Step 1: Write `components/Experience.tsx`**

```tsx
import { experience } from "@/content/experience";
import { Section } from "@/components/ui/Section";

export function Experience() {
  return (
    <Section id="work" label="Experience">
      <div className="flex flex-col">
        {experience.map((e) => (
          <div
            key={e.company}
            className="grid grid-cols-1 gap-1 border-t border-border py-4 sm:grid-cols-[120px_1fr] sm:gap-4"
          >
            <div className="font-mono text-xs text-text-subtle">{e.period}</div>
            <div>
              <div className="text-sm font-semibold">{e.company}</div>
              <div className="text-sm text-accent">{e.role}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{e.blurb}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Experience.tsx
git commit -m "feat: Experience timeline"
```

---

## Task 12: Projects

**Files:**
- Create: `components/Projects.tsx`

- [ ] **Step 1: Write `components/Projects.tsx`**

```tsx
import { projects, awardBadge } from "@/content/projects";
import { Section } from "@/components/ui/Section";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";

export function Projects() {
  return (
    <Section id="projects" label="Selected projects">
      <p className="mb-4 font-mono text-xs text-text-subtle">{awardBadge}</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {projects.map((p) => {
          const inner = (
            <>
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold tracking-tight">{p.name}</h3>
                {p.context && (
                  <span className="font-mono text-[11px] text-text-subtle">{p.context}</span>
                )}
              </div>
              <p className="mt-1.5 text-sm text-text-muted">{p.blurb}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </>
          );
          return p.href ? (
            <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer">
              <Card className="h-full">{inner}</Card>
            </a>
          ) : (
            <Card key={p.name} className="h-full">
              {inner}
            </Card>
          );
        })}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Projects.tsx
git commit -m "feat: Selected projects"
```

---

## Task 13: TechStack

**Files:**
- Create: `components/TechStack.tsx`

- [ ] **Step 1: Write `components/TechStack.tsx`**

```tsx
import { stack } from "@/content/stack";
import { Section } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Chip";

export function TechStack() {
  return (
    <Section id="stack" label="Tech stack">
      <div className="flex flex-col gap-5">
        {stack.map((g) => (
          <div key={g.label} className="grid grid-cols-1 gap-2 sm:grid-cols-[140px_1fr]">
            <div className="text-sm font-semibold text-text">{g.label}</div>
            <div className="flex flex-wrap gap-1.5">
              {g.items.map((i) => (
                <Chip key={i}>{i}</Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/TechStack.tsx
git commit -m "feat: Tech stack section"
```

---

## Task 14: Personal

**Files:**
- Create: `components/Personal.tsx`

- [ ] **Step 1: Write `components/Personal.tsx`**

```tsx
import { personal } from "@/content/personal";
import { Section } from "@/components/ui/Section";
import { Chip } from "@/components/ui/Chip";

export function Personal() {
  return (
    <Section id="personal" label="Personal">
      <p className="text-base leading-relaxed text-text-muted">{personal.text}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {personal.tags.map((t) => (
          <Chip key={t}>{t}</Chip>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Personal.tsx
git commit -m "feat: Personal section"
```

---

## Task 15: Footer

**Files:**
- Create: `components/Footer.tsx`

- [ ] **Step 1: Write `components/Footer.tsx`**

```tsx
import { links } from "@/content/links";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-3xl px-6 py-12">
      <div className="border-t border-border pt-6 font-mono text-sm text-text-subtle">
        <div className="flex flex-wrap gap-4">
          <a className="transition-colors hover:text-accent-hover" href={links.github}>GitHub</a>
          <a className="transition-colors hover:text-accent-hover" href={links.linkedin}>LinkedIn</a>
          <a className="transition-colors hover:text-accent-hover" href={links.instagram}>Instagram</a>
        </div>
        <p className="mt-4 text-xs text-text-subtle">
          © {new Date().getFullYear()} An-Ting Hsu · Built with Next.js &amp; Tailwind.
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: Footer with social links"
```

---

## Task 16: Nav (sticky, anchors + theme toggle)

**Files:**
- Create: `components/Nav.tsx`

- [ ] **Step 1: Write `components/Nav.tsx`**

```tsx
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";

const anchors = [
  { href: "#build", label: "Build" },
  { href: "#work", label: "Work" },
  { href: "#projects", label: "Projects" },
  { href: "#stack", label: "Stack" },
];

export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg-from/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-3">
        <Link href="/" className="font-mono text-sm font-semibold text-text">
          AH
        </Link>
        <div className="flex items-center gap-4">
          <div className="hidden gap-4 font-mono text-xs text-text-subtle sm:flex">
            {anchors.map((a) => (
              <a key={a.href} href={a.href} className="transition-colors hover:text-accent-hover">
                {a.label}
              </a>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/Nav.tsx
git commit -m "feat: sticky nav with anchors and theme toggle"
```

---

## Task 17: Compose the page

**Files:**
- Modify: `app/page.tsx` (replace the Task 3 placeholder)

- [ ] **Step 1: Write `app/page.tsx`**

```tsx
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { FacetCards } from "@/components/FacetCards";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Projects } from "@/components/Projects";
import { TechStack } from "@/components/TechStack";
import { Personal } from "@/components/Personal";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Reveal><FacetCards /></Reveal>
        <Reveal><About /></Reveal>
        <Reveal><Experience /></Reveal>
        <Reveal><Projects /></Reveal>
        <Reveal><TechStack /></Reveal>
        <Reveal><Personal /></Reveal>
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Run the full test suite**

Run: `pnpm test`
Expected: PASS — all suites (theme, content, components, smoke).

- [ ] **Step 3: Build and verify static export**

Run: `pnpm build`
Expected: build succeeds; `out/index.html` exists and contains "Andy".

Run: `grep -c "Andy" out/index.html`
Expected: ≥ 1.

- [ ] **Step 4: Visual check in dev server**

Run: `pnpm dev`, open http://localhost:3000
Expected: Hero, 4 facet cards, all sections render; theme toggle flips dark/light; no console errors. Stop with Ctrl-C.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx
git commit -m "feat: compose full single-page layout"
```

---

## Task 18: Writing route scaffold (hidden at launch)

**Files:**
- Create: `app/writing/page.tsx`

- [ ] **Step 1: Write `app/writing/page.tsx`** (route exists, not linked from nav/footer)

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Writing — An-Ting Hsu" };

// Scaffolded for future MDX posts. Intentionally not linked from the site yet.
export default function Writing() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-24">
      <h1 className="text-2xl font-semibold tracking-tight">Writing</h1>
      <p className="mt-3 text-text-muted">Notes and technical reflections — coming soon.</p>
    </main>
  );
}
```

- [ ] **Step 2: Verify it builds**

Run: `pnpm build`
Expected: `out/writing/index.html` exists.

- [ ] **Step 3: Commit**

```bash
git add app/writing/page.tsx
git commit -m "feat: scaffold hidden /writing route for future posts"
```

---

## Task 19: Assets — favicon, OG image, resume, .nojekyll

**Files:**
- Create: `public/favicon.svg`, `public/og.svg`, `public/.nojekyll`
- Modify: `app/layout.tsx` (icon metadata)
- Asset (owner-provided): `public/An-Ting-Hsu-Resume.pdf`

- [ ] **Step 1: Write `public/favicon.svg`** (initials + simple space-tech aesthetic: monogram "A" with an orbit ring and a star, on a deep disc)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#2a2233"/>
      <stop offset="1" stop-color="#181420"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <ellipse cx="32" cy="32" rx="22" ry="9" fill="none" stroke="#c79bc4" stroke-width="2"
           transform="rotate(-25 32 32)" opacity="0.85"/>
  <path d="M22 44 L32 20 L42 44 M26 36 H38" fill="none" stroke="#f1eaf3"
        stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="48" cy="18" r="2" fill="#f1eaf3"/>
  <circle cx="15" cy="22" r="1.3" fill="#c79bc4"/>
</svg>
```

- [ ] **Step 2: Write `public/og.svg`** (1200×630 social card in the same family)

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#fbf7f4"/>
      <stop offset="1" stop-color="#f4eef6"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <ellipse cx="980" cy="150" rx="220" ry="80" fill="none" stroke="#8a5a86" stroke-width="4"
           transform="rotate(-25 980 150)" opacity="0.6"/>
  <text x="90" y="300" font-family="Inter, sans-serif" font-size="64" font-weight="700" fill="#272029">
    An-Ting &#8220;Andy&#8221; Hsu
  </text>
  <text x="90" y="370" font-family="Inter, sans-serif" font-size="32" fill="#564e5c">
    Full-stack products, developer tools, and distributed systems.
  </text>
  <text x="90" y="430" font-family="monospace" font-size="24" fill="#8a5a86">
    Taipei · backend &amp; infrastructure leaning
  </text>
</svg>
```

- [ ] **Step 3: Create `public/.nojekyll`**

```bash
touch public/.nojekyll
```

- [ ] **Step 4: Add icon + OG metadata to `app/layout.tsx`**

In `app/layout.tsx`, extend the `metadata` export:

```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://andyhsu10.github.io"),
  title: "An-Ting (Andy) Hsu — Software Engineer",
  description:
    "Taipei-based software engineer building full-stack products, developer tools, and distributed systems.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "An-Ting (Andy) Hsu — Software Engineer",
    description:
      "Full-stack products, developer tools, and distributed systems. Taipei-based.",
    images: ["/og.svg"],
    type: "website",
  },
};
```

- [ ] **Step 5: Add the resume PDF (owner action)**

Copy the 2024.11 resume into place as `public/An-Ting-Hsu-Resume.pdf`. If the file is not yet available, create a placeholder so the link resolves, and replace later:

```bash
# When the real PDF is ready:
#   cp "/path/to/2024.11 Resume (Simp.).pdf" public/An-Ting-Hsu-Resume.pdf
ls public/An-Ting-Hsu-Resume.pdf 2>/dev/null || echo "TODO: drop the 2024.11 resume PDF at public/An-Ting-Hsu-Resume.pdf"
```

- [ ] **Step 6: Build & verify assets land in `out/`**

Run: `pnpm build`
Expected: `out/favicon.svg`, `out/og.svg`, and `out/.nojekyll` exist.

- [ ] **Step 7: Commit**

```bash
git add public/ app/layout.tsx
git commit -m "feat: space-tech favicon, OG image, .nojekyll, resume link"
```

---

## Task 20: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [master]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Set the Pages source to GitHub Actions (one-time, owner action)**

```bash
gh api -X POST repos/andyhsu10/andyhsu10.github.io/pages \
  -f "build_type=workflow" 2>/dev/null \
  || gh api -X PUT repos/andyhsu10/andyhsu10.github.io/pages -f "build_type=workflow"
```

If the CLI call is not possible, set it manually: GitHub repo → Settings → Pages → Build and deployment → Source → **GitHub Actions**.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: GitHub Actions build + deploy to Pages"
```

---

## Task 21: Final verification

**Files:** none (verification only)

- [ ] **Step 1: Clean build from scratch**

```bash
rm -rf .next out
pnpm build
```
Expected: build succeeds with no errors.

- [ ] **Step 2: Full test suite + lint**

Run: `pnpm test && pnpm lint`
Expected: all tests PASS; lint reports no errors.

- [ ] **Step 3: Serve the static export and smoke-check**

```bash
pnpm dlx serve out -l 4000
```
Open http://localhost:4000 — confirm: all sections render, dark/light toggle works and persists across reload, links point to GitHub/LinkedIn/Resume (hero) and GitHub/LinkedIn/Instagram (footer), no email anywhere, favicon shows. Stop with Ctrl-C.

- [ ] **Step 4: Confirm legacy site is NOT served**

Run: `ls out/2018mis 2>/dev/null && echo "ERROR: 2018mis leaked into export" || echo "OK: 2018mis not exported"`
Expected: `OK: 2018mis not exported`. The folder now lives at `archive/2018mis/` (moved in Task 1), outside `public/`, so the static export never ships it.

- [ ] **Step 5: Push the branch and open a PR**

```bash
git push -u origin feat/v2-website
gh pr create --title "v2 website redesign" --body "Rewrite the personal site with Next.js + Tailwind, Plum Warm theme, facet-card layout, dark/light toggle, and GitHub Actions deploy. Spec: docs/superpowers/specs/2026-06-09-v2-website-redesign-design.md"
```

- [ ] **Step 6: After merge to master, verify the deploy**

Watch the Actions run; once green, confirm https://andyhsu10.github.io serves the new site (hard-refresh to bypass cache).

---

## Notes on the 2018mis archive

The legacy `2018mis/` folder currently sits at repo root and was previously served
by GitHub Pages. It is no longer wanted on the live site. In Task 1 it is moved to
`archive/2018mis/` (`git mv 2018mis archive/2018mis`). Because Next's static export
only ships files under `public/`, anything in `archive/` is excluded from `out/`
and therefore unreachable — while still preserved in the repo for history.
