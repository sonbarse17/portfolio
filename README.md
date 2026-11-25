# Sushant Sonbarse: Cloud & DevOps engineering site

A static Next.js portfolio built around infrastructure case studies, interactive simulations, and an engineering field guide.

## What is on it

| Route                            | Purpose                                                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/`                              | Interactive deployment path, selected work, technology ecosystem, failure simulator, experience, and contact            |
| `/lab`, `/lab/[slug]`            | Six simulations: blast radius, release path, scheduler, plan reader, error budget, access trace                         |
| `/work`, `/work/[slug]`          | Nine projects. Professional case studies have interactive architecture diagrams. Personal projects are labelled as such |
| `/atlas`                         | A position on each engineering domain                                                                                   |
| `/freelance`, `/services/[slug]` | Services                                                                                                                |
| `/resume`                        | Printable résumé with experience, engineering work, and education                                                       |

### The honesty rule

Case studies identify professional and personal work, and use **Reference** for explanatory material. Lab pages are marked **Simulation**. The published outcome figures come from the HisanLabs internship.
The labs run real logic in the browser, with no cloud behind them, and each lab page lists what its model leaves out.

When adding a project, keep a section as `reference` unless the detail actually happened, and mark diagram components `implemented`, `dependency` or `followup` honestly. The overview-only project has no diagram until its architecture is verified. Tests enforce that no project borrows another project's components.
`src/__tests__/content.test.ts` fails if a reference section states an outcome percentage.

## Stack

Next.js 15 (App Router, `output: 'export'`), React 18, TypeScript (strict), Tailwind CSS 3, `next-themes`, EmailJS.
The design uses local Geist fonts, graphite and light themes, and citron for interactive emphasis. Shared tokens live in `src/app/globals.css`, route surfaces in `src/app/catalog.css`, and the homepage compositions in `src/app/home.css`. Diagrams use HTML and SVG. Motion uses CSS and respects reduced-motion preferences.

## Structure

```
src/
  app/          routes (+ sitemap.ts, robots.ts)
  components/   shared UI; labs/ holds one component per lab, lazy-loaded
  content/      all copy and data; projects/ holds one file per project, with its diagrams
  lib/lab/      pure simulation engines: no React, unit tested
  __tests__/    vitest
e2e/            Playwright: every route, axe accessibility, eight widths, links, diagram and lab flows
```

The engines in `lib/lab/` are the part to read first. Each is a plain function from inputs to state, and the UI only renders it.

## Commands

```bash
npm install
npm run dev          # development
npm run build        # static export to out/
npm test             # unit tests
npm run test:e2e     # needs a build first: runs against out/ on :3000
npm run lint && npm run type-check
```

Browser tests need a Chromium download: `npx playwright install chromium`.
If your machine blocks it, CI runs the same suite.

## Environment

Copy `.env.example` to `.env.local`:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=
```

These are public by design, because they ship in the browser bundle.
Restrict the allowed origins in the EmailJS dashboard.

## Deployment and security

The site is a static export, so it has no server code, middleware or API routes.
A Content-Security-Policy is shipped as a `<meta>` tag in production builds.
A static export cannot set response headers, so set HSTS, `X-Content-Type-Options` and `frame-ancestors` at the host or CDN.

Each build shows its commit and date in the footer, the only live facts on the site.

## Known limits

- `npm audit` reports advisories in build and lint tooling (ESLint, and PostCSS inside Next 15). They need major-version upgrades and do not ship to visitors.
- The contact form has a honeypot field only. EmailJS enforces its own rate limits.
