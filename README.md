# Sushant Sonbarse: Cloud & DevOps engineering site

A static Next.js site built around interactive infrastructure labs, case files and a field guide, not a list of logos.

## What is on it

| Route                            | Purpose                                                                                                                 |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| `/`                              | Opening message, case studies, capabilities by domain, a live failure lab, work history, and the contact form           |
| `/lab`, `/lab/[slug]`            | Six simulations: blast radius, release path, scheduler, plan reader, error budget, access trace                         |
| `/work`, `/work/[slug]`          | Nine projects. Professional case studies have interactive architecture diagrams. Personal projects are labelled as such |
| `/atlas`                         | A position on each engineering domain                                                                                   |
| `/freelance`, `/services/[slug]` | Services                                                                                                                |

### The honesty rule

Every section carries one of five tags: **Professional**, **Personal project**, **Reference**, **Simulation** or **Live**.
Only **Professional** content is a claim about what I did at work. The only outcome figures are the HisanLabs ones.
The labs run real logic in the browser, with no cloud behind them, and each lab page lists what its model leaves out.

When adding a project, keep a section as `reference` unless the detail actually happened, and mark diagram components `implemented`, `dependency` or `followup` honestly. The overview-only project has no diagram until its architecture is verified. Tests enforce that no project borrows another project's components.
`src/__tests__/content.test.ts` fails if a reference section states an outcome percentage.

## Stack

Next.js 15 (App Router, `output: 'export'`), React 18, TypeScript (strict), Tailwind CSS 3, `next-themes`, EmailJS.
There is no animation or 3D library. Diagrams are HTML over SVG, so they stay accessible and reflow.

## Structure

```
src/
  app/          routes (+ sitemap.ts, robots.ts)
  components/   shared UI; labs/ holds one component per lab, lazy-loaded
  content/      all copy and data; projects/ holds one file per project, with its diagrams
  lib/lab/      pure simulation engines: no React, unit tested
  __tests__/    vitest
e2e/            Playwright: every route, axe accessibility, five widths, links, diagram and lab flows
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
