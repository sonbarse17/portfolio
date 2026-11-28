# Phase 6 terminal theme

## Direction

Phase 5's editorial look (Newsreader on warm paper) gave way to a Neovim/terminal language adapted from [pavanjoshi914/dev-portfolio-template](https://github.com/pavanjoshi914/dev-portfolio-template) (MIT, © 2026 Pavan Joshi). The Next.js app, routes, case studies, labs and tests are unchanged. Only the visual system and the homepage opening changed. The full design is in `docs/superpowers/specs/2026-11-28-terminal-theme-design.md`.

## Palettes

- `src/content/palettes.ts` holds the template's 8 palettes: Blackmoney, Paper, Sora, Circuit, Amber, Indigo, Crimson and Slate.
- `src/lib/palette-css.ts` maps them onto the existing variables (`--paper`, `--ink`, `--muted`, `--rule`, `--accent`, …) plus syntax colours (`--kw`, `--str`, `--num`, `--fn`, `--ty`).
- Text colours are moved toward the foreground until they reach 4.5:1 against both the background and the panel colour. A unit test enforces this for every palette.
- Blackmoney is the default and Paper is the light palette. The choice is stored in `localStorage.palette`.
- To add a palette, add an entry to `palettes.ts`. Nothing else changes.

## Type and shape

- IBM Plex Mono 400 and 600 (OFL, `@ibm/plex-mono` 1.1.0) carries navigation, labels, headings, metadata and code.
- Geist carries body copy.
- Corners are square, borders are 1px lines blended from the palette, and there are no shadows. Selected states use a solid accent block.
- Prefixes such as `//`, `#`, `##` and `$` are CSS content with empty alternative text, so they never enter accessible names.
- Route paths in the path bar and the footer status line render after hydration, which avoids a prerender mismatch on the 404 page.
- Case-study facts stack to one column at 480px and below.

## Homepage

- The opening is a terminal that types in over about 2 seconds using CSS alone. Reduced motion shows everything at once.
  - `whoami` prints the name.
  - `cat statement.txt` prints the statement and the "See the work" and "View résumé" buttons.
  - `ls ~/work` prints the project links.
  - The buttons sit above the project links so they stay above the fold on 320 × 568 phones.
- A neofetch-style panel holds the portrait.
- The sections below are framed as buffers.
- `j`/`k` walk the main links. They do nothing inside the open palette picker, and focusing anything else clears the highlight.
- `:` opens the finder as a command line (`:theme <name>`, `:work`, `:lab`, `:resume`, `:about`, `:contact`).

## Known exception

The Studio's WebGL rack keeps its own dark colours because they are written into the shader. Under Paper it reads as a framed dark image. The rest of the Studio no longer pins its own colours and follows `:theme` with the other routes.

## Verification

- `npm test`: palettes, contrast, commands, keys, and no hard-coded hex outside the palettes, print blocks and masks.
- `npx playwright test`: every route is swept with axe in both Blackmoney and Paper. The suite also covers the picker, command line, homepage keys, typing and résumé print colours.
