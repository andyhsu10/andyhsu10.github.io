# v2 Website Redesign — Design Spec

**Date:** 2026-06-09
**Repo:** `andyhsu10.github.io` (GitHub Pages **user site**, served from `master`)
**Branch:** `feat/v2-website`
**Owner:** An-Ting "Andy" Hsu

## Goal

Replace the hand-written university-era site (Bootstrap 3 + jQuery, personal-bio
oriented) with a modern, clean personal engineering profile for a senior-track
full-stack engineer. A visitor should understand within one glance: **who Andy
is, what facets he works across, and what each facet's specialties are.**

Positioning: *A Taipei-based software engineer who builds full-stack products,
developer tools, and distributed systems — backend & infrastructure leaning,
with a background spanning startups, Web3, homelab, and legal studies.*

Non-goals: not a resume clone, not a travel blog, not a Web3-heavy page, not a
junior portfolio.

## Tech & Deployment

- **Next.js (App Router) + TypeScript**, static export (`output: 'export'`).
- **Tailwind CSS v4** (CSS-first config in `globals.css`).
- **Dark/light mode:** `class` strategy via `@custom-variant dark`, toggle
  persisted in `localStorage`, defaults to system preference, no-flash inline
  script in `<head>`.
- **Fonts:** sans for body/headings (Inter or General Sans), mono accent
  (JetBrains Mono / IBM Plex Mono) for links, chips, labels. Loaded via
  `next/font` (self-hosted, no layout shift).
- **Deploy:** GitHub Actions → build → `actions/upload-pages-artifact` →
  `actions/deploy-pages`. `master` holds **source only**; no build branch.
  Repo Settings → Pages → Source = "GitHub Actions".
- `.nojekyll` emitted so `_next/` assets are served.

## Color System (single source of truth)

Raw hex lives in exactly two places — `:root` and `.dark` — and is exposed to
Tailwind as **semantic utilities**. Components MUST use semantic utilities only
(`bg-surface`, `text-accent`, `border-border`, …). **No hardcoded hex in
components.** Changing the theme = edit `:root`/`.dark`; swapping the whole
palette family = edit the same two blocks.

| Token (utility)        | Use                | Light       | Dark        |
| ---------------------- | ------------------ | ----------- | ----------- |
| `bg-from` / `bg-to`    | hero gradient      | `#fbf7f4` / `#f4eef6` | `#181420` / `#181420` |
| `dots`                 | dotted backdrop    | `#e6dcea`   | `#2c2533`   |
| `surface`              | card background    | `#ffffffc7` | `#211b2a`   |
| `border`               | card/divider       | `#ece0ee`   | `#332b3e`   |
| `text`                 | primary text       | `#272029`   | `#ece6ef`   |
| `text-muted`           | secondary text     | `#564e5c`   | `#b3a9bd`   |
| `text-subtle`          | links/labels       | `#9a8aa0`   | `#8c7d96`   |
| `accent`               | accent             | `#8a5a86`   | `#c79bc4`   |
| `accent-hover`         | accent hover       | `#744a70`   | `#d8b3d5`   |
| `chip` / `chip-text`   | skill tags         | `#f1eaf3` / `#7d5f80` | `#2a2233` / `#cda9ca` |

`globals.css` shape:

```css
@import "tailwindcss";
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
}
```

## Visual System

- **Family:** "Plum Warm" — warm→plum subtle gradient background, faint dotted
  grid overlay (`radial-gradient(var(--color-dots) 1px, transparent 1px)`,
  16px), misty-plum accent.
- Cards: semi-transparent `surface`, thin `border`, rounded ~10px.
- Mono font for links/labels/chips; uppercase tracked `label` style for section
  headers ("What I build", "Experience", …).
- **Motion (restrained):** scroll fade-in, subtle hover lift on cards/links.
  No flashy effects. Respect `prefers-reduced-motion`.

## Information Architecture (single long-scroll page)

Minimal sticky top nav (name/monogram left, section anchors + theme toggle
right). Sections top-to-bottom:

1. **Hero** — name, one-line positioning, links: `GitHub · LinkedIn · Resume`.
2. **What I Build** — 4 facet cards (the centerpiece).
3. **About** — 3–4 lines: Taipei engineer, backend/infra leaning, startups +
   international corp, legal studies as an interdisciplinary angle.
4. **Experience** — compact timeline.
5. **Selected Projects** — project cards.
6. **Tech Stack** — grouped by category.
7. **Personal** — a few lines + interest tags.
8. **Footer / Contact** — `GitHub · LinkedIn · Instagram`.

**Writing / Notes:** route + layout scaffolded under `/writing` (MDX-ready) but
**hidden / not linked** at launch. Adding a `.mdx` file later publishes a post
without structural changes.

## Content

### Hero
- Name: **An-Ting "Andy" Hsu**
- Tagline: *Software engineer building full-stack products, developer tools, and
  distributed systems.*
- Sub: *Taipei-based · backend & infrastructure leaning.*
- Links: GitHub `andyhsu10` · LinkedIn `antinghsu10` · Resume (PDF). **No email.**

### What I Build — 4 facet cards

| Facet | One-liner | Skill chips |
| --- | --- | --- |
| **Backend & Infrastructure** | APIs, service architecture, containers & cluster deployment | Django/DRF · PostgreSQL · Redis · Docker · K8s/EKS · CI/CD |
| **Developer Tools** | VS Code extensions, language servers, telemetry | VS Code API · LSP · Webview · Sentry |
| **Distributed Systems** | Multi-node, event-driven, edge integration | Go · gRPC · protobuf · Next.js |
| **Explorations** | Web3 smart contracts · Homelab / IoT | Solidity · Ethereum · Stacks · ESP32 · NAS |

### About
3–4 sentences covering: Taipei-based full-stack engineer, backend/infra leaning;
experience across SiFive, startups, Web3, and distributed systems; interested in
developer tools, infrastructure, and real-world system integration; NTU law
credit program as a unique interdisciplinary angle.

### Experience (compact, 1–2 lines each)
- **SiFive** — Full Stack Engineer (2024–now)
- **Freelancer** — prediction-market backend, LINE-bot dating MVP (2023–2024)
- **Biznius.AI (SeFo Finance)** — Co-founder / SWE; leverage yield farming, 3
  web3 hackathons (2022–2023)
- **Poseidon Network** — SWE; 15k+ user APIs, ERC20, IPFS distributed storage
  (2019–2022)
- *Blockore (2018–2019) — optional single "earlier" line.*

### Selected Projects (cards)
1. **VS Code Extension** (SiFive): a developer tool to download, edit, validate,
   and submit product-specification files.
2. **Internal Engineering Platform** (SiFive): Django + React; API, validation,
   CI/CD, infra.
3. **Distributed Camera System**: multi-node — Go, Python, Next.js, gRPC,
   Windows IPC.
4. **2024 Solar Eclipse Environment Monitor** (public, GitHub link).
5. **Homelab / Network Infrastructure**: UniFi, Synology NAS, 2.5GbE, VLAN.
6. **Web3 / Prediction Market**: Ethereum, Solidity, Stacks.
- Optional highlight badge: **🏆 Mars Mail — OpenAI Stack Hack #1**.
- **Confidentiality:** the SiFive projects and the distributed camera system are
  under NDA / internal. Copy stays abstract — capabilities and tech only, no
  project codenames, no proprietary detail, no internal identifiers.

### Tech Stack (grouped)
- **Backend:** Python, Django, DRF, Go, Node.js, REST, gRPC, PostgreSQL, Redis, Celery
- **Frontend:** React, TypeScript, Next.js, VS Code Webview
- **Developer Tools:** VS Code Extension API, LSP, JSON/JSON5 validation, Sentry, telemetry
- **Infrastructure:** Docker, Docker Compose, Kubernetes, EKS, GitHub Actions, Concourse, RabbitMQ, CloudWatch, Nginx
- **Web3:** Solidity, Ethereum, Stacks, smart contracts
- **IoT / Homelab:** ESP32, ESPHome, UniFi, Synology NAS, 2.5GbE

### Personal
One line + interest tags: self-driving travel, astronomy / solar eclipses,
photography, homelab, law. May mention NZ self-driving trip and eclipse
photography. Kept short — not a travel blog.

### Footer / Contact
Links: GitHub `andyhsu10` · LinkedIn `antinghsu10` · Instagram `andyhsuanting`.

## Content / Code Separation

All copy and lists (facets, experience, projects, stack, personal, links) live
in typed data files under `content/` (TS objects or MD/MDX). Components render
from data so the site is editable without touching JSX. This keeps each
component small and single-purpose.

## Project Structure (target)

```
app/
  layout.tsx          # fonts, theme provider, no-flash script
  page.tsx            # composes sections
  writing/            # scaffolded, hidden at launch (MDX-ready)
  globals.css         # Tailwind import + color tokens (@theme inline)
components/
  Nav.tsx  ThemeToggle.tsx
  Hero.tsx  FacetCards.tsx  About.tsx  Experience.tsx
  Projects.tsx  TechStack.tsx  Personal.tsx  Footer.tsx
  ui/ (Card, Chip, SectionLabel, …)
content/
  facets.ts  experience.ts  projects.ts  stack.ts  personal.ts  links.ts
public/
  An-Ting-Hsu-Resume.pdf   # 2024.11
  favicon.svg / icons      # initials + simple space-tech aesthetic
  og-image                 # social preview
.github/workflows/deploy.yml
next.config.ts  (output: 'export', images.unoptimized: true)
.nojekyll
```

## Assets

- **Resume:** use the **2024.11** version → `public/An-Ting-Hsu-Resume.pdf`.
  Andy will update the file later; the link path stays stable.
- **favicon:** generated from initials (e.g. "A" / "AH") with a **simple
  space + tech aesthetic** — provided as SVG, light/dark compatible. Replaces
  old `profile.ico`. An `og-image` in the same family for social sharing.
- Socials confirmed: GitHub `andyhsu10`, LinkedIn `antinghsu10`,
  Instagram `andyhsuanting`. **Email intentionally omitted.**

## Old Files

- **Remove:** root `index.html`, `style.css`, `animation.js`, `background.jpg`,
  `profile.ico`.
- **Archive (no longer served):** move `2018mis/` to `archive/2018mis/`. It stays
  in the repo for history but lives outside `public/`, so Next's static export
  never ships it and `/2018mis` is no longer reachable.

## Language

English-primary copy throughout, culturally natural for a Taiwan-based engineer
in an international environment. No i18n / multi-language framework.

## Out of Scope (YAGNI)

Multi-language, CMS, comments, heavy analytics, complex animations, exhaustive
technology listing, custom domain.

## Success Criteria

1. One-glance comprehension of identity + 4 facets + their specialties.
2. Clean, modern, dark/light, restrained motion — not a generic resume/SaaS page.
3. Theme fully swappable from two CSS blocks; zero hardcoded hex in components.
4. `master` source-only; CI builds and deploys to Pages automatically.
5. Lighthouse: strong performance/accessibility; respects reduced-motion.
6. Adding a writing post later requires only a new MDX file.
