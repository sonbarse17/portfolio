# Terminal theme: design spec

Date: 2026-11-28
Status: approved in brainstorming, pending spec review
Source theme: [pavanjoshi914/dev-portfolio-template](https://github.com/pavanjoshi914/dev-portfolio-template) (MIT)
Glossary: [CONTEXT.md](../../../CONTEXT.md)

## Goal

Replace the Phase 5 editorial look (Newsreader on warm paper) with the template's Neovim/terminal visual language across every route. Rebuild the homepage opening as a terminal hero followed by scrolling buffers. Keep the Next.js app, its routes, content, labs and test suite.

## Out of scope

- The template's code wall, face tracking, worm, eye and hand overlays, project wheel and GitHub contribution calendar.
- Recolouring the Studio's WebGL rack shader (`src/lib/visual/infrastructure.ts`). Its colours stay baked in.
- Content changes. Copy, projects, roles and labs stay as they are.
- Switching to the template's static HTML stack.

## Success criteria

1. Every route renders in all 8 palettes with no fixed hex colours outside `src/content/palettes.ts` and print styles.
2. Text (`--ink`), muted text (`--muted`) and accent (`--accent`) reach at least 4.5:1 contrast against `--paper` in all 8 palettes.
3. The existing Playwright suite passes. The only edits are to the two theme tests listed under Testing. This includes the route sweep, axe checks and overflow checks at 390px and 1440px.
4. The axe route sweep passes in both Blackmoney and Paper.
5. The homepage keeps exactly one `h1` (the name), a visible portrait, and the links "See the work" and "View résumé".
6. The printed résumé has a white background and dark text in every palette.
7. With `prefers-reduced-motion: reduce`, the terminal hero renders fully on first paint with no typing.

## 1. Visual system

### Palettes

`src/content/palettes.ts` is the only place palette colours live. Each palette has `slug`, `name`, `description`, `tone` (`'light' | 'dark'`), and these colours: `bg`, `fg`, `accent`, `cursorline`, `comment`, `keyword`, `string`, `number`, `function`, `type`.

There are 8 palettes, with values taken from the template's `site/content.json`: blackmoney, paper, sora, circuit, amber, indigo, crimson, slate. Blackmoney is the default and Paper is the only light palette.

Each palette maps onto the existing variable names. Stylesheets keep using `rgb(var(--paper))` and similar, so most of them need no edits.

| Variable | Source | Format |
|---|---|---|
| `--paper` | `bg` | RGB triplet |
| `--panel` | `cursorline` | RGB triplet |
| `--ink` | `fg` | RGB triplet |
| `--muted` | `comment`, lightened toward `fg` (or darkened for light palettes) until it reaches 4.5:1 against `bg` | RGB triplet |
| `--rule` | `fg` mixed 30% into `bg`. Usages keep their alpha (`/ 0.26` and so on). | RGB triplet |
| `--signal` | `number` | RGB triplet |
| `--ok` | `keyword` | RGB triplet |
| `--warn` | `string` | RGB triplet |
| `--accent`, `--action` | `accent` | hex |
| `--action-ink` | `bg` | hex |
| `--action-hover` | `accent` mixed 15% toward `fg` | hex |
| `--kw`, `--str`, `--num`, `--fn`, `--ty` | syntax colours (new) | hex |

The muted adjustment, the rule mix and the hover mix are computed in TypeScript when the CSS is generated, so the output is static CSS.

A server-side helper builds one block per palette, `:root[data-theme="<slug>"] { color-scheme: <tone>; ...vars }`, and `src/app/layout.tsx` renders it as an inline `<style>` in `<head>`. The CSP already allows inline styles.

`next-themes` settings:
- `attribute="data-theme"`
- `themes={palettes.map(p => p.slug)}`
- `defaultTheme="blackmoney"`
- `enableSystem={false}`
- `storageKey="palette"`

The new storage key means saved `light`/`dark` values from the old site are ignored.

Dark-only rules: Tailwind `darkMode` becomes a selector variant matching `[data-theme=<slug>]` for every palette whose tone is dark. The list is generated from `palettes.ts`. The 5 existing `.dark` and `dark:` usages in `globals.css`, `catalog.css` and `site-header.tsx` switch to it. The `.dark` block in `globals.css` is removed, and so are the `:root` light values, because the palette blocks replace them.

### Type

- **IBM Plex Mono** (OFL), weights 400 and 600 as woff2 in `src/app/fonts/`, from IBM's official Plex release, with its licence in `public/fonts/`. It replaces Geist Mono as `--font-mono`. It is used for navigation, labels, headings, metadata, path bars, the status line, code and the terminal hero.
- **Geist** stays as the body font for paragraphs and form text. Line length is capped near 68ch in long-form content.
- **Newsreader** is removed: the font file, the `--font-editorial` variable, its 10 usages and `public/fonts/Newsreader-OFL.txt`.
- `.display`, `.h-section` and `.h-page` switch to the mono family, weight 600, letter-spacing about −0.02em. `.h-page` scales with `clamp(2.4rem, 6vw, 4.5rem)`.

### Shape and motion

- `--radius: 0`. There are no shadows. Borders are 1px using `rgb(var(--rule) / α)`.
- Selected and active states use a solid accent block (`background: var(--accent); color: var(--action-ink)`), like the template's mode block.
- Palette changes animate `background-color` and `color` over 420ms with `cubic-bezier(0.23, 1, 0.32, 1)`. Hovers keep `--fast` (180ms). `disableTransitionOnChange` is removed from the ThemeProvider so the palette transition shows. The existing reduced-motion rule still cancels it.
- Character grid tokens `--cell-w: 7.2px` and `--cell-h: 13px` apply only to the header, status line and terminal hero.

## 2. Homepage

### Terminal hero

On desktop the hero has two columns inside `.wrap`, filling about `100svh` minus the header. On mobile the two columns stack.

The left column is a sequence of prompt lines. Each line is a `❯` prompt in `--kw` followed by a command in `--ink`, with output beneath it:

1. `whoami`: the `h1` "Sushant Sonbarse" (mono 600), then the role and "available for remote freelance work" in `--muted`.
2. `cat statement.txt`: "I build systems for the day things break." in Geist, larger.
3. `ls ~/work`: the three selected projects as links, each a slug in `--fn` followed by a short label in `--muted`.
4. The action links **See the work** (to `#work`) and **View résumé** (to `/resume`). Their accessible names stay exactly as written here.
5. A prompt with a blinking block cursor, marked `aria-hidden`.

The right column is the fetch panel, with a 1px frame. It holds:
- the portrait (`next/image`, existing alt text "Portrait of Sushant Sonbarse")
- `sushant@sonbarse` and a rule line
- key/value facts: role, clouds, ships, ci/cd, base
- a row of six swatches from the current palette, marked `aria-hidden`

A status line closes the hero. It shows a `NORMAL` mode block, `~/sushant` and the hint `j/k move · enter open · : command`.

The typing is an enhancement layered on top. All text is server-rendered and readable without JavaScript. On the client, a component hides each line and then reveals it character by character, line after line, finishing within about 2.5s. With reduced motion, or before hydration, everything is visible immediately. Hiding uses a class added at mount, so the server HTML never hides content.

### Buffers

The existing sections stay in their current order and keep their content and ids (`#work`, `#about`, `#capabilities`, `#contact` and so on). Each section gets a path bar and a mono `## ` heading:

| Buffer | Path bar | Treatment |
|---|---|---|
| Work | `~/sushant/work/` | Project rows with the cover image in a 1px frame, a `// label` in muted, a mono title and a Geist summary. The accent `→` stays. |
| About | `~/sushant/about.md` | Full portrait and bio. The existing links stay. |
| Experience | `~/sushant/git log --career` | One row per role. The date column is in `--str` and the title in `--fn`. Bullet points and links stay. |
| Lab | `~/sushant/lab/` | The existing Studio invitation, recoloured with palette variables. |
| Contact | `~/sushant/contact.sh` | The existing form. Labels look like prompts, and fields have no radius and a hairline border. |

`editorial.css` is rewritten for this layout. Its class names may change, but the ids and test-visible names may not.

### Keyboard

There is one client listener on the homepage. It ignores events when the focused element is editable, when a dialog is open, or when any of Ctrl, Meta or Alt is held.

- `j` and `k` move a highlight (`aria-current="true"` plus a left accent bar) through an ordered list: the hero links, then each buffer heading's primary link. They also move keyboard focus to that element and scroll it into view.
- `enter` follows the focused link. The browser already does this for native links.
- `:` opens the command line (see section 3).
- Tab order is unchanged.

## 3. Site chrome and inner pages

### Header

- The wordmark becomes `▸_ sushant sonbarse` in mono. `site-wordmark.tsx` is updated, and `/brand.svg` becomes a matching `▸_` mark.
- Navigation is lowercase mono from `nav` in `src/content/site.ts`. The labels in `site.ts` stay as they are, and the lowercase comes from CSS `text-transform`, so accessible names are unchanged. The current page gets an accent underline.
- The actions are the existing FinderTrigger and a new **`:theme`** button that replaces ThemeToggle. The `:theme` button's accessible name is "Change palette".
- The header stays sticky on `--paper` with a bottom hairline.

### Theme picker

- It is a popover anchored to the `:theme` button, with `role="radiogroup"` and the label "Palette".
- Each option is a `role="radio"` row with `aria-checked`. It shows the name, the description and six swatches from `palettes.ts`.
- Arrow keys move and select, Enter or Space selects, Esc closes and returns focus to the button, and clicking outside closes it.
- Selecting calls `setTheme(slug)`.

### Command line

The existing PortfolioFinder dialog is kept, and a `:` keypress anywhere on the site opens it too. Input that starts with `:` is read as a command:

| Command | Action |
|---|---|
| `:theme <name>` | Calls `setTheme` with the first palette whose slug starts with `<name>`. An unknown name shows "no palette '<name>'" inline. |
| `:work` | Opens `/work` |
| `:lab` | Opens `/lab` |
| `:resume` | Opens `/resume` |
| `:about` | Opens `/#about` |
| `:contact` | Opens `/#contact` |

Anything else falls through to the existing search.

### Footer

The footer opens with a status line: a `NORMAL` mode block, `~` plus the current pathname, and `utf-8` on the right. The existing link index and text stay below it.

### Inner pages

These apply to Work, case studies, Lab and lab detail, Atlas, Services, Freelance, Résumé, 404 and error pages:

| Element | Treatment |
|---|---|
| Page title | A path bar above the title, then a muted `# ` prefix before the mono title |
| `.eyebrow` / `.editorial-label` | Rendered as `// text` in `--muted`, replacing the rust rule. The `//` is added in markup with `aria-hidden`, not as CSS content. |
| `.btn` | A solid accent block |
| `.btn-quiet` | A hairline border. Its pressed or checked state is the accent block. |
| Button text | No CSS pseudo-content is added to buttons or links. |
| Images, project artwork, diagrams | 1px frames, no radius |
| `deployment-map.tsx` | Its 3 hex colours become palette variables |

### Résumé print

`@media print` sets the colour variables to black on white whatever the palette: `--paper` 255 255 255, `--ink` 0 0 0, `--muted` 70 70 70, accent `#000`.

### Studio and remaining stylesheets

All hex colours in `cinema.css`, `flagship.css`, `phase-three.css` and `studio.css` (the Studio), plus `catalog.css`, `finder.css` and `work/case-study.css`, move to palette variables. The hex colours in `globals.css` disappear with the old `:root` and `.dark` blocks, and those in `editorial.css` disappear in its homepage rewrite. Mapping:
- the lime family becomes `--kw` (or `--ok`)
- the graphite surfaces become `--paper` and `--panel`
- the warning reds and oranges become `--num` (or `--signal`)
- the soft greens and teals become `--str` or `--fn`, matched by role

Alpha variants use `color-mix(in srgb, var(--kw) N%, transparent)`.

The WebGL rack and its poster image keep their own colours.

## 4. Build order

Each step is a separate commit and leaves the site building and its tests passing.

| Step | Work |
|---|---|
| 1. Themes and fonts | `palettes.ts`, the CSS generator, layout injection, the `next-themes` config, the Tailwind dark variant, Plex Mono, Newsreader removal, `--radius: 0`, updated type classes |
| 2. Chrome | Header, wordmark, brand icon, theme picker, command-line commands, status-line footer |
| 3. Homepage | Terminal hero, fetch panel, typing, buffers, keyboard listener |
| 4. Inner pages | Titles, path bars, labels, buttons, frames, deployment map, résumé print |
| 5. Studio and remaining stylesheets | Hex-to-variable conversion in the Studio, catalog, finder and case-study stylesheets |
| 6. Tests and docs | New tests below and `docs/phase-six.md` |

## Testing

New Vitest tests in `src/__tests__/palettes.test.ts`:
- Every palette has all required colour keys, and every value is a valid 6-digit hex.
- `--ink`, `--muted` and `--accent` each reach at least 4.5:1 against `--paper`, using the computed values, in all 8 palettes.
- Exactly one palette is the default, and it is `blackmoney`.
- No `#rrggbb` or `#rgb` colours appear in `src/**/*.css` or `src/components/**/*.tsx`, except in print blocks and `src/content/palettes.ts`.

Playwright changes:
- `e2e/navigation.spec.ts`, "theme toggle switches and persists", is rewritten. The test opens `:theme`, picks Paper, checks `html[data-theme="paper"]`, reloads, and checks again.
- `e2e/phase-three.spec.ts` line 129 changes its storage key and value to `localStorage.setItem('palette', 'paper')`.

New Playwright tests:
- On the homepage, `j` moves focus to the first hero link and `k` returns. With focus in the contact form, `j` types a "j".
- With reduced motion emulated, all hero lines are visible on load.
- Typing `:theme sora` in the command line sets `html[data-theme="sora"]`.
- The résumé under print emulation, with the Blackmoney palette, has a white computed body background.
- The axe route sweep runs again with `palette=paper`.

## Risks

| Risk | Handling |
|---|---|
| The palette flashes on first load | `next-themes` sets `data-theme` before the page draws, and the palette CSS is inline in `<head>`. |
| Old saved `light`/`dark` values | The storage key changes to `palette`, so returning visitors get Blackmoney. |
| `j`/`k` conflicting with typing or assistive tech | The modifier, editable and dialog guards. Screen readers in browse mode capture these keys first. |
| Shader colours clashing with Paper | Accepted. The rack sits in a framed panel. |
| Plex Mono weight 600 is not in the template | It comes from IBM's official Plex release under OFL. |
