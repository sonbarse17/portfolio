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

### Phase 3 rendering and interaction

The homepage renders an original infrastructure model with WebGL 2 when an eligible device supplies a usable context. Both WebP posters come from the same GLSL scene. The standard tier uses a smaller drawing buffer, lower frame cadence, and shorter ray marches. Mobile, reduced-motion, unavailable WebGL, and lost contexts use the poster.

The heading and poster are rendered in the static HTML. The browser loads the shader after the poster appears and suspends drawing when the scene leaves view. The browser also loads the finder and release simulation on request. The simulation shares the release lab's model and rollout assumptions.

Open the finder with Ctrl or Command + K. Search for `diagnostics` to view the renderer observed when the finder opened and the public build identifier.

Regenerate the two `public/assets/phase-three/infrastructure*.webp` posters with `node scripts/render-infrastructure.mjs` using Playwright Chromium.

### Phase 2 media

The homepage uses locally optimized ImageGen artwork and an original procedural failover loop rendered with Canvas in Chromium. The portfolio loads the film when it enters view. It pauses off-screen and has a poster for reduced-motion preferences.

| Scene                          | Files                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------- |
| Data-center opening            | `public/assets/phase-two/aisle.webp`, `aisle-mobile.webp`                       |
| Azure case study               | `public/assets/phase-two/private-ingress.webp`                                  |
| AWS case study                 | `public/assets/phase-two/hosting-layers.webp`                                   |
| Illustrative failover sequence | `public/assets/phase-two/failover` and `failover-mobile` in WebM, MP4, and WebP |

Regenerate the original failover assets with `node scripts/render-lab-film.mjs` after installing the Playwright Chromium browser.

<details>
<summary>Original ImageGen prompts</summary>

#### Data-center opening

```text
Use case: photorealistic-natural
Asset type: full-bleed wide homepage hero for a cloud infrastructure engineer's creative portfolio, approximately 16:9.
A striking cinematic photograph of a modern, physically plausible data center. View from inside the aisle, looking towards a brighter opening on the RIGHT THIRD, very dark quiet space across the LEFT HALF for overlaid white typography. Large matte graphite and smoked-glass server racks with subtle olive green and amber indicator lights, dense honest cable and vent details, metal grading, deep shadows, quiet photographic grain, precise sharp edges. Layers in strong perspective, graduated reflections on the cold floor, a clean vertical white light strip in the far right, dramatic backlight closer to muted pale moss than neon. The illuminated right half has beautiful clarity and scale. Restrained warm gray / charcoal / olive color grade. Architectural photography for a premium industrial design journal, editorial worldbuilding through realistic objects and carefully composed tonal contrast. No people, no text, no logos, no watermarks, no sci-fi neon, no overlaid graphics or target markers. Supply only the finished photographic visual.
```

#### Private ingress

```text
Use case: stylized-concept
Asset type: wide landscape case-study artwork for a professional portfolio, approximately 16:9.
An original editorial architectural model about private network ingress. Inside a dark museum-like concrete space, imagine one rectangular doorway glowing with cool soft blue-white light, nested inside three offset monumental graphite concrete passage walls. A slim, straight luminous route on the smooth stone floor leads into the innermost aperture. Strong architectural perspective with the gateway slightly off center. Deep charcoal and slate blue-gray tones, a little atmospheric depth, sharp utilitarian geometry, fine tactile surfaces. Quiet and precise, like a high-end architecture magazine photographed with a real camera, realistic material and light transport. Relate to an internal application gateway conceptually, no digital overlays. No people, logos, graphics, letters, numbers, or generic server illustration.
```

#### Hosting layers

```text
Use case: product-mockup
Asset type: wide landscape case-study artwork for a premium engineering portfolio, approximately 16:9.
An original tactile editorial close-up representing a layered hosting architecture. A stack of three wide brushed aluminum slabs, between them thin translucent oxide-green glass and a single warm amber edge light. Carefully engineered edges, small mounting details, a few indication channels machined into the metal surface, no superfluous electronics. Photographed from a low oblique three-quarter angle on a dark warm-gray studio floor. Warm tungsten kick light from one side, cold pale green reflection on the glass, directional shadow, sophisticated restrained contrast. Architectural model meets actual industrial material photography. Strong simple silhouette filling most of the frame with breathing room at the edges. No logos, no text, no floating HUD, no random neon, no stock server illustration.
```

</details>

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
