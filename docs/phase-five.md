# Phase 5 creative direction and audit

## Baseline and priorities

We reviewed the Phase 4 production site and the matching local export at commit `f5e4872`. The independent browser review covered eight representative pages at 1440 × 900 and 390 × 844, all 27 sitemap routes on desktop, and the request trace, release sequence, case diagrams, recovery playback and six standalone labs. The close review inspected the film in motion as well as its still. The production interaction run passed 41 checks, and desktop axe found zero WCAG 2 A/AA violations across the 27 routes.

Phase 4 already had specific project language, clear résumé access, strong concept covers, and unusually useful engineering exercises. The server rack and request controls occupied the opening alongside the name. The selected-work heading first appeared about 1,100 px down, the personal introduction at about 6,000 px and experience around 6,600–6,800 px. Azure’s mobile architecture section appeared at about 1,340 px, ahead of the contribution at about 4,110 px and results at about 6,780 px. Repeating the same graphite surfaces, lime controls, and interface-like frames across the portfolio gave the experience a dashboard rhythm.

We prioritized a recognizable person, early case evidence, and two reading depths. Recruiters and clients can scan for role, project, and outcome. Practitioners can follow the actual architecture or run an exercise.

## Creative directions

| Direction | Visual approach | Tradeoff |
| --- | --- | --- |
| Editorial portrait and architecture studio | Large Newsreader headlines, an authentic portrait, mineral paper, and project spreads | Makes the work and the person clear on first contact. Requires precise type, crop and spacing decisions because the composition uses few elements. |
| Cinematic engineering identity | Dark surfaces, procedural infrastructure, camera moves timed to chapters | Visually expressive for the Studio. Phase 4 showed how easily the machinery becomes the first thing a visitor remembers. |
| Contemporary personal monograph | Graphic monogram, expressive type and substantial navigation transitions | Strong personality at a glance, with additional visual competition for dates, project scope and hiring actions. |

We selected the first direction and used the second for the optional Studio. The portfolio line is “I build systems for the day things break.” [Pentagram’s work index](https://www.pentagram.com/) informed how names and short descriptions can sustain a long archive. [John Pawson’s photography-led site](https://www.johnpawson.com/) informed the use of directional light, a single strong image and breathing room. [PORTO ROCHA](https://www.portorocha.com/) informed the pairing of a project name with one plain-language line on its purpose.

## Identity and visual system

- Newsreader is local and carries the name, case titles, role titles and major editorial headings. Geist carries navigation, body copy and labels. Geist Mono is reserved for identifiers, diagram and simulation UI. Start with typography and spacing when adding a section.
- The paper color is `#f4f0e7`, ink is `#26251e`, and the light-theme accent is `#873e2b`. A short rust rule starts editorial captions. The wordmark and favicon use a rust period as a small signature. The optional dark theme uses a peach accent against warm charcoal.
- The name spans the masthead. On desktop, the portrait forms the center of a three-part spread with a short statement and work links at the edges. On mobile, the name and actions precede an independently cropped, smaller portrait. A short opening mask moves the lower image edge only. Text and controls render immediately.
- The first project has a wide spread and a separate caption column. The two following projects use staggered scale and alignment. A warm About spread, open two-row career history, dark Studio invitation and quiet contact form change the pace as the reader scrolls. Avoid decorative grid labels, uniform card proportions, generic icons and copy that repeats the visible headings.
- Professional projects lead with the declared scope and role. Azure and AWS retain specific verified implementation boundaries in the opening. The HisanLabs EKS case introduces its recorded outcomes early and retains the case material that supports them. Existing sections, technical diagrams and case fragments remain available for deeper reading. The résumé preserves education and training.

## Navigation and motion

The homepage covers selected projects, About, experience and contact. The Work index preserves every published project, with personal work visibly separate. The Lab index leads to six existing simulation routes and the new `/lab/studio`. The Studio contains the procedural rack, release path and simulator, technology domains, recovery film and fault exercise. The engineering field guide and service routes stay accessible through navigation or the footer. Studio topics also appear in the keyboard finder. Homepage fragments `#pipeline`, `#break-it` and `#capabilities` still land on visible routes into that material.

The only homepage motion is a brief portrait reveal and a small hover-scale on project imagery, both limited to sessions that accept motion. No animation gates reading or navigation. The Studio retains its motion toggle, reduced-motion stills, manual controls, data saving behavior and off-screen pause. Diagrams still communicate through selected state, textual readouts and keyboard focus.

## Assets and licensing

| Asset | Provenance and use |
| --- | --- |
| `public/assets/phase-five/sushant*.webp` | Resized, optimized copies of the portrait supplied with the original portfolio at `public/assets/images/profile.jpg`. Styling uses color and crop only. A separate photography license was not present in the repository. |
| `public/assets/phase-five/joint*.webp` | Original concept composition generated for the Lab invitation using the built-in ImageGen tool. Optimized copies measure about 61 KB desktop and 17 KB mobile. |
| `public/assets/phase-five/share.jpg` | Site-authored 1200 × 630 social preview composed from the existing portrait, paper palette and local Newsreader. |
| Existing Azure, AWS and EKS covers | Retained concept illustrations, identified as such on Work, individual illustrated case pages and the homepage. Earlier asset provenance is in the [Phase 4 audit](phase-four.md) and [README](../README.md). |
| Phase 4 recovery film | Original 7.5-second Canvas treatment of a concept still, reused at the recovery exercise. Mobile and desktop WebM and MP4 remain, with stills for reduced motion, data saving and playback failure. |
| Newsreader | Local Latin variable font, weights 400–600, SIL Open Font License 1.1. [Newsreader upstream](https://github.com/productiontype/Newsreader), local license `public/fonts/Newsreader-OFL.txt` (removed in Phase 6; see docs/phase-six.md). |

ImageGen prompt for the Lab image:

> Landscape 16:9 editorial photograph for a restrained architecture-studio personal portfolio. Subject: two massive flat matte charcoal and warm gray concrete slabs of different depths with a precise open joint between them. A single thin burnt vermilion insulated cable enters from the lower left, runs through exactly one carefully drilled aperture, then rests in a simple curve on a chalk limestone floor. Close-up physical architectural model, not a server or screen. Hard late-afternoon window light casts a strong diagonal shadow across the honeyed paper-gray floor. Warm whites, soot, mineral gray, one red accent. Shot on a medium format camera, restrained grain, editorial asymmetry, plausible realistic material textures, large uncluttered geometric spaces. Composition places the join and aperture near the right-center, with generous floor and shadow to the left. No text, no logos, no people, no cityscape, no neon, no sci-fi effects, no floating objects.

## Evaluation and remaining concerns

| Rubric | Weight | Evidence and judgment |
| --- | ---: | --- |
| Human art direction | 15% | A portrait-led opening and a different composition for each kind of proof. The brand and case art still draw from different photographic worlds. |
| Original personal brand | 15% | Real portrait, authored proposition, typographic signature and documented work. The existing portrait is a single studio headshot. |
| Typography and composition | 15% | A clear serif/sans hierarchy and distinct desktop and phone reading orders. The local Newsreader font adds one font request. |
| Premium image and video | 10% | Compact new concept art and a recovery clip used in the exercise where it carries meaning. Project imagery illustrates concepts and evidence remains primarily written or diagrammatic. |
| Motion | 10% | A narrow homepage motion palette and visible, persistent controls in the Studio. The procedural scene remains hardware-dependent. |
| UX and hierarchy | 10% | Visible primary actions, work and role proof before technical depth, and direct linked lab topics. |
| Professional credibility | 10% | Implementation and outcomes attributed to the relevant cases and role, with start-to-finish content available on demand. |
| Responsive experience | 5% | Separate masthead order, portrait crop, simpler role rows, and project sequence on phones. |
| Performance and accessibility | 5% | Client bundles for simulations are confined to the Studio and standalone routes. This audit measures the static export in browser emulation. |
| Engineering quality | 5% | Existing simulation models, architecture explorers, printable résumé, contact workflow, and static export preserved. |

The case summaries reflect the details currently available for public release. No new client photos, production telemetry, or outcome figures were added.

## Browser evidence

- [Desktop opening comparison](assets/phase-five/desktop-before-after.jpg) at 1440 × 900, with the Phase 4 live site on the left and the audited local production export on the right.
- [Mobile opening comparison](assets/phase-five/mobile-before-after.jpg) at 390 × 844. The new mobile opening keeps Work and résumé within reach even at 320 × 568.
- At 390 px, the selected-work heading moved from roughly 1,100 px to 755 px, About moved from 5,947 px to 2,311 px, and Experience moved from 6,545 px to 2,942 px. Total page height moved from roughly 8,707 px to 5,358 px. Work starts at 907 px on the 1440 px desktop capture.
- Independent checks rendered Home, Work, Azure, and Studio in desktop and mobile Chromium, emulated iOS WebKit, and ultrawide Firefox. The audited views had no horizontal overflow, unresolved same-origin requests, or page errors. Sampled light and dark views had no automated Axe WCAG A/AA violations.
- The link crawl resolved all 115 linked fragments across 28 public routes with unique IDs. Keyboard checks reached the Studio via the finder and returned to contact via the main navigation.
- The Studio recovered the original 960 × 540, 7.5-second film. Playback advanced in view, paused on request and offscreen, and used its 600 × 450 poster in reduced-motion mobile mode.
- Individually gzipping the homepage HTML and its linked JavaScript and CSS produced 204,155 bytes on Phase 4 and 182,134 bytes on Phase 5, down 10.8%. This measurement excludes fonts, imagery, and assets deferred until an interaction.

Lighthouse 13.6 compared the local exports with simulated mobile throttling. Largest Contentful Paint moved from 4.26 s to 1.96 s, Cumulative Layout Shift was 0 in both runs, and accessibility and SEO both scored 100 in each. The performance score moved from 46 to 67. Both runs flagged a slow host CPU and the revised run reported a cache reset timeout, so these individual timings are directional.

The browser review used emulation. Physical-phone testing and production field performance are outside these measurements.

## Build and test results

The production static export, TypeScript check, lint, and formatting check passed. Vitest passed all 76 tests. Desktop and mobile Playwright covered 150 test entries. The main run passed 146 and skipped the duplicate mobile entry for a test that creates its own desktop and touch contexts. Two multi-route layout checks exceeded their initial timeout, and an overview test queried every accessibility group, including the new mobile contents disclosure. The layout tests now wait for fonts and use reduced motion. The overview assertion now targets the Architecture section. All 16 layout checks and both overview checks passed their reruns, for 149 unique passing checks and one intentional skip.
