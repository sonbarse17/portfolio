# Phase 4 quality audit

## Reconstructed history

The baseline is the committed and deployed `db08800` build. Phase 1 (`12489f8`) established the Geist design system, structured projects, printable résumé, field guide and deterministic simulation engines. Phase 2 (`fb72f7b`) added conceptual photography, a responsive Canvas film and scroll-led release diagrams. Early Phase 3 (`776405f`) introduced the WebGL 2 hero, chapter navigation, command finder and compact release simulation. The deployed Phase 3 pass then added themed hero poses, the photographic recovery sequence and interactive, directional Azure and AWS traces. All of these are present in the source and export. There is no Three.js dependency or hosted simulation backend.

## Creative and production decisions

- The name, role and résumé take priority in the opening frame. The request trace has a stable label, a distinct pose and color for each layer, and a link to matching evidence. The rack now opens the selected drawer, and recovery visibly hands the pulse to the secondary fiber. The WebP variants come from that same renderer.
- The EKS internship is featured as an illustrated overview. Its wide format gives the case catalog a pause after the two directional case studies. The factual scope, recorded outcomes and limitations come from the existing project record. There is no speculative topology.
- The recovery film keeps the same room and camera. Its new grade attenuates the primary fiber independently of the ambient lighting. The image generation and film are conceptual. The original Azure and AWS covers remain in use.
- With reduced motion or unavailable WebGL, the same headings, layer information, links and simulation controls are available. Software renderers and data-saving connections start with posters. The film retains a still, chooses one rendition in view, falls through WebM and MP4, and suspends off-screen. Data-saving visitors can request the film. Keyboard users can reach the résumé directly from site navigation.
- The share image, canonical, Open Graph URL and Twitter image are present in generated HTML. The profile is described as a `ProfilePage` with a `Person` main entity. Route metadata reuses the same production origin as sitemap and robots.
- Next was patched within 15.5, and Next's PostCSS dependency was overridden to 8.5.34. The unmounted terminal sandbox and its two direct dependencies were removed. The existing Firebase static deployment, security headers and EmailJS setup remain applicable. The tracked deployment variables are public EmailJS identifiers compiled into the client. Origin restrictions and service-side rate limits require a separate dashboard review.

For visual benchmarks, see [Lusion’s project collection](https://lusion.co/), [OFF+BRAND’s Lando Norris case study](https://www.itsoffbrand.com/our-work/lando-norris), and [Apple’s MacBook Pro product page](https://www.apple.com/macbook-pro/). The relevant approaches were a single visual motif across different scales, product-led motion, and immediate access to substantive information.

## Asset provenance

| Asset | Source and reproduction |
| --- | --- |
| `phase-four/fabric*.webp` | Original repository GLSL. `node scripts/render-infrastructure.mjs` in Playwright Chromium. |
| `phase-four/workload-field*.webp` | Original built-in ImageGen concept, encoded as a desktop WebP and a closer mobile crop. |
| `phase-four/share.jpg` | 1200 × 630 composition using the same concept and locally licensed Geist typography. |
| `phase-four/recovery-channel*` | Original Canvas animation derived from the existing Phase 3 ImageGen still, encoded with FFmpeg. `node scripts/render-recovery-film.mjs`. |
| Geist and Geist Mono | Locally served under the SIL Open Font License shipped in `public/fonts/OFL.txt`. |

ImageGen prompt for the workload field:

> Photorealistic industrial editorial still, landscape 16:9, a conceptual illustration about orchestrating many small workloads for a Cloud and DevOps portfolio. Photograph a precision-engineered architectural scale model about the size of a desk: an exploded, modular field of small rectangular graphite and smoked glass compute cartridges seated within exactly defined machined aluminum channels, with a single restrained chartreuse fiber running low through one row. Escalating rows of modules recede diagonally to the far right. Strong tangible materials, carefully spaced cavities, soft tungsten kick from the upper left, cool brushed titanium highlights, deep olive graphite shadows, subtle analog grain. Look like a high-end architecture or industrial design journal photograph. Near frontal low three-quarter elevation, asymmetrical composition, forms span the CENTER RIGHT two-thirds. LEFT THIRD is a continuous quiet charcoal field with a little grazing light, suitable for editorial typography added later. Crisp object silhouette and restrained chartreuse accents, slight atmospheric perspective. Minimal and plausible, no logos, no text, no diagrams, no people, no labels, no giant floating HUD, no vaporwave, no neon blue. Original concept image, do not depict an actual company infrastructure.

## Release requirements

Use the repository's Node 22 CI, `npm ci`, unit tests, static export and Playwright suite. Build from the approved commit so the footer identifies the release. Firebase Hosting serves `out/`. Verify the canonical domain, both architecture traces, the résumé, and byte ranges on the active recovery film when releasing. Phase 4 is a local change. Production release requires explicit authorization for this version.

## Validation and limits

- Next.js 15.5.29 produced the static export and passed its lint and type checks. All 76 unit tests passed. The first 142-case Playwright run passed 136 cases and skipped one duplicate viewport test by design. The four homepage and theme failures caused by the missing document title passed on the rebuilt export. The fifth failure, a keyboard action racing a lazy lab chunk, passed in targeted desktop and mobile reruns with an explicit check that the selected node became current. Both new missing-film fallback tests passed on the final export.
- Chromium 156, system Chrome 158, Firefox 157 and Playwright WebKit 27.2 passed the hero, keyboard still selection, recovery film and off-screen pause, Azure route stepping, and résumé smoke checks. Mobile Chromium and WebKit emulation selected the 576 px film. The before and after browser recordings capture actual navigation and interaction. Edge, native Safari on physical devices and sustained hardware GPU performance were not measured.
- Zero horizontal overflow and zero measured CLS across all 11 final Chromium viewport captures, including 320 × 568 and 3440 × 1440. Both primary hero links were visible in the first viewport. Axe found zero tagged WCAG 2.x A/AA violations on the home, work, Azure case, EKS overview and résumé pages at desktop and mobile widths. This is automated coverage alongside keyboard checks; a dedicated assistive-technology audit remains outstanding.
- All 27 sitemap pages publish matching canonical and Open Graph URLs. The production-dependency audit reported zero advisories. The full lockfile audit still reports eight moderate entries in build and lint tooling. The static site has no runtime Next.js server, and the existing Firebase header management is in scope for a separate hosting review.

### Lab performance

The final reduced-motion, unthrottled Chromium viewport captures measured LCP from 0.18 to 1.47 seconds. At 1440 × 900, the baseline and final samples were 0.74 and 1.47 seconds. At 390 × 844, they were 0.36 and 0.34 seconds. These are individual runs, influenced by host load.

In the sequential, lower-contention Lighthouse 13.6 mobile runs, Performance stayed at **80**, FCP went from 1.51 to 1.67 seconds, LCP from 5.29 to 4.37 seconds, TBT from 79 to 223 ms, and CLS stayed at zero. Accessibility and SEO scored 100 in both runs. An earlier pair captured alongside browser tests scored 52 and 53 for Performance and showed the opposite TBT direction, so neither pair establishes a repeatable blocking-time improvement. The Lighthouse Performance 90 and LCP 2.5-second targets remain unmet under this throttling profile.

Five unsolicited route payloads totaling 86,827 transferred bytes in the baseline mobile trace were absent from the final trace. The Next.js build reports 128 kB of first-load JavaScript, matching the baseline at the reported precision. Film bytes are deferred until the scene enters view. There is no comparable field INP or production Web Vitals sample.

### Weighted editorial assessment

This is a subjective editorial assessment with technical evidence where available, separate from Lighthouse and accessibility measurements. The weighted result is **89.9/100**. The 95 target remains a stretch goal, particularly for throttled performance and independent physical-device validation.

| Category | Weight | Score | Evidence and remaining gap |
| --- | ---: | ---: | --- |
| Creative originality | 10 | 85 | A coherent request and failover metaphor. The rack silhouette still builds visibly on Phase 3. |
| Artistic direction | 10 | 91 | Chassis signal, case imagery and recovery grade share a consistent material palette. |
| Animation and motion | 12 | 88 | Selected-drawer motion and visible primary-to-secondary transfer. Sustained hardware motion is unmeasured. |
| Interactive experiences | 10 | 93 | Evidence links, documented route hops and tested failure scenarios. |
| Image and video quality | 10 | 91 | Original editorial artwork, mobile crop and responsive 225-frame film. |
| Typography and composition | 8 | 90 | Immediate name and role, compact mobile spacing and a distinct EKS overview composition. |
| Professional branding | 8 | 94 | Immediate résumé access, documented outcomes and labelled concept art. |
| Responsive design | 7 | 94 | Eleven actual viewport captures and two emulated mobile engines. |
| Performance | 8 | 78 | Startup route prefetch bytes fell. Lighthouse LCP improved in the lower-contention pair, but the throttled targets remain unmet. |
| Accessibility | 5 | 91 | Keyboard, reduced motion, and axe coverage. Manual assistive-technology coverage remains incomplete. |
| SEO | 4 | 96 | Sitemap consistency, profile schema, branded preview and per-route metadata. |
| Security | 3 | 93 | Clean production audit. Tooling advisories and service dashboard settings require follow-up. |
| Engineering quality | 5 | 92 | Reproducible rendering, existing static architecture, scoped dependency updates and regression tests. |
