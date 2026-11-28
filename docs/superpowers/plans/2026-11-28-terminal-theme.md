# Terminal Theme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-theme the whole Next.js portfolio in a Neovim/terminal visual language with 8 switchable palettes, and rebuild the homepage opening as a terminal hero followed by scrolling buffers.

**Architecture:**
- `src/content/palettes.ts` is the single source of palette colours.
- `src/lib/palette-css.ts` turns it into static CSS blocks keyed on `html[data-theme]`. The root layout renders that CSS inline.
- `next-themes` switches the attribute and stores the choice under the `palette` key.
- Existing stylesheets keep the variable names they already use (`--paper`, `--ink`, …), so most pages restyle with no edits.
- New UI pieces are small, focused components: palette picker, status line, path bar, terminal hero, homepage keys. Pure logic (`command.ts`, `keys.ts`) is unit-tested.

**Tech Stack:** Next.js 15 (static export), React 18, Tailwind 3, next-themes 0.4, Vitest, Playwright with axe.

**Spec:** [docs/superpowers/specs/2026-11-28-terminal-theme-design.md](../specs/2026-11-28-terminal-theme-design.md). **Glossary:** [CONTEXT.md](../../../CONTEXT.md).

## Assumptions (checked against the code on 2026-11-28)

- Nothing uses Tailwind `dark:` utilities. The only dark-mode hooks are the `.dark` block in `src/app/globals.css`, the `.dark` print selector in `src/app/catalog.css` and `ThemeToggle` in `src/components/site-header.tsx`. The Tailwind `darkMode` setting can therefore be deleted outright. The spec asked for a selector variant; this plan deletes the setting instead and Task 1 records that refinement.
- `src/app/editorial.css` is imported only by `src/app/page.tsx`.
- e2e tests that pin homepage behaviour:
  - `e2e/navigation.spec.ts` checks:
    - one `h1` containing `<span>` words
    - the text "Available for remote freelance work"
    - exactly one image named "Portrait of Sushant Sonbarse"
    - the links "See the work", "All projects" and "View résumé"
    - the "CI/CD pipeline efficiency improved by 40%" text
    - no `.stack-art`, `.pipeline` or `.failover-film` on the homepage
  - `e2e/phase-three.spec.ts:125-140` sets `localStorage.theme = 'light'`.
- The responsive test runs with `reducedMotion: 'reduce'`. The axe sweep waits for `networkidle` and does not emulate reduced motion.
- IBM Plex Mono woff2 files are available at `https://cdn.jsdelivr.net/npm/@ibm/plex-mono@1.1.0/fonts/split/woff2/IBMPlexMono-{Regular,SemiBold}-Latin1.woff2`. Both returned HTTP 200 when checked.
- Node 25 is installed and `vitest.config.ts` maps `@` to `./src`.

## File map

| File | Status | Responsibility |
|---|---|---|
| `src/content/palettes.ts` | create | Palette types, the 8 palettes, `DEFAULT_PALETTE`, `findPalette` |
| `src/lib/palette-css.ts` | create | Colour maths (`hexToRgb`, `mix`, `contrast`, `ensureContrast`), `paletteVars`, `paletteCss` |
| `src/lib/command.ts` | create | `parseCommand` for the `:` command line |
| `src/lib/keys.ts` | create | `isTypingTarget`, `hasModifier`, `nextIndex` |
| `src/components/palette-picker.tsx` | create | `:theme` button and radiogroup popover |
| `src/components/status-line.tsx` | create | Vim status line (`NORMAL │ path │ hint`) |
| `src/components/path-bar.tsx` | create | `~/route` line under the header on inner pages |
| `src/components/terminal-hero.tsx` | create | Homepage hero: prompt steps and fetch panel |
| `src/components/home-keys.tsx` | create | `j`/`k` navigation on the homepage |
| `src/app/terminal-home.css` | create | Homepage styles. Replaces `editorial.css`. |
| `src/app/editorial.css` | delete | |
| `src/app/layout.tsx` | modify | Fonts, inline palette CSS, ThemeProvider, PathBar |
| `src/app/globals.css` | modify | Non-colour tokens, mono type classes, chrome classes, print reset |
| `tailwind.config.ts` | modify | Remove `darkMode` |
| `src/app/catalog.css`, `finder.css`, `cinema.css`, `flagship.css`, `phase-three.css`, `work/case-study.css`, `lab/studio/studio.css` | modify | Palette variables in place of hex, mono titles |
| `src/app/site-chrome.css` | modify | Mono wordmark and nav, picker, footer status line |
| `src/components/site-header.tsx`, `site-wordmark.tsx`, `site-footer.tsx`, `finder-trigger.tsx`, `portfolio-finder.tsx`, `deployment-map.tsx` | modify | As described per task |
| `src/app/page.tsx` | modify | Hero, buffers, keys |
| `public/brand.svg` | modify | `▸_` mark |
| `src/app/fonts/ibm-plex-mono-{400,600}-latin.woff2`, `public/fonts/IBMPlexMono-OFL.txt` | create | Font and licence |
| `src/app/fonts/newsreader-latin.woff2`, `src/app/fonts/geist-mono-latin.woff2`, `public/fonts/Newsreader-OFL.txt` | delete | |
| `src/__tests__/palettes.test.ts`, `palette-css.test.ts`, `command.test.ts`, `keys.test.ts`, `hex-colours.test.ts` | create | Unit tests |
| `e2e/routes.ts` | create | Shared route list |
| `e2e/terminal-theme.spec.ts` | create | Picker, command line, homepage keys, typing, print, Paper sweep |
| `e2e/navigation.spec.ts`, `e2e/phase-three.spec.ts` | modify | Shared routes, theme tests |
| `docs/phase-six.md` | create | Design record |

## Commands used throughout

- Unit tests: `npm test`
- Types: `npm run type-check`
- Lint: `npm run lint`
- Build (static export to `out/`): `npm run build`
- One e2e file: `npx playwright test e2e/<file>.spec.ts --project=chromium`. This serves `out/`, so **build first**.

---

### Task 1: Record the spec refinements

Planning surfaced seven refinements. Write them into the spec so the spec and this plan agree.

**Files:**
- Modify: `docs/superpowers/specs/2026-11-28-terminal-theme-design.md`

- [ ] **Step 1: Append a refinements section to the end of the spec**

```markdown
## Refinements made during planning (2026-11-28)

1. **No Tailwind dark variant.** Nothing uses `dark:` utilities, so `darkMode` is deleted from `tailwind.config.ts` instead of being replaced.
2. **Prefixes use CSS alternative text.** The `// ` before labels, the `# ` and `## ` before titles, and the `$ ` before contact labels are written as `content: '// ' / ''`. The empty alternative text keeps them out of accessible names, so no markup changes are needed across pages. Buttons and links still get no pseudo-content.
3. **The j/k highlight uses `data-nav-current`.** `aria-current` would announce "current page", which is wrong here.
4. **Unknown `:` commands show a notice.** `:foo` says "Unknown command…" instead of searching for ":foo", which could never match.
5. **The portrait appears once.** It lives in the fetch panel. The About buffer is bio-only, because two images with the same name break `getByRole('img', { name: 'Portrait of Sushant Sonbarse' })`.
6. **One shared path bar.** A single `PathBar` in the root layout shows `~/<route>` under the header on every page except `/`, instead of per-page markup.
7. **Typing is CSS-only.** Commands type with `clip-path` and `steps()`, and outputs appear with a discrete `visibility` animation. No JavaScript is involved, content works without JS, and the reduced-motion rule turns both off. Hidden-until-revealed outputs use `visibility`, never `opacity`, so axe never samples half-faded text.

The contrast guarantee also covers `--panel`: text colours are adjusted to reach 4.5:1 against both `--paper` and `--panel`, because muted text often sits on panels.
```

- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-11-28-terminal-theme-design.md
git commit -m "docs: record terminal theme refinements from planning"
```

---

### Task 2: Palette data module

**Files:**
- Create: `src/content/palettes.ts`
- Test: `src/__tests__/palettes.test.ts`

- [ ] **Step 1: Write the failing test**

`src/__tests__/palettes.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { DEFAULT_PALETTE, findPalette, palettes } from '@/content/palettes'

const keys = [
  'bg',
  'fg',
  'accent',
  'cursorline',
  'comment',
  'keyword',
  'string',
  'number',
  'function',
  'type',
] as const

describe('palettes', () => {
  it('has the eight template palettes with unique slugs', () => {
    expect(palettes.map((p) => p.slug)).toEqual([
      'blackmoney',
      'paper',
      'sora',
      'circuit',
      'amber',
      'indigo',
      'crimson',
      'slate',
    ])
  })

  it('gives every palette a complete set of 6-digit hex colours', () => {
    for (const palette of palettes) {
      for (const key of keys) {
        expect(palette.colors[key], `${palette.slug}.${key}`).toMatch(/^#[0-9a-f]{6}$/)
      }
    }
  })

  it('defaults to blackmoney, and paper is the only light palette', () => {
    expect(DEFAULT_PALETTE).toBe('blackmoney')
    expect(palettes.filter((p) => p.tone === 'light').map((p) => p.slug)).toEqual(['paper'])
  })
})

describe('findPalette', () => {
  it('matches an exact slug, ignoring case and whitespace', () => {
    expect(findPalette('paper')?.slug).toBe('paper')
    expect(findPalette('  PAPER ')?.slug).toBe('paper')
  })

  it('matches the first palette whose slug starts with the query', () => {
    expect(findPalette('so')?.slug).toBe('sora')
    expect(findPalette('s')?.slug).toBe('sora')
    expect(findPalette('c')?.slug).toBe('circuit')
  })

  it('returns undefined for empty or unknown names', () => {
    expect(findPalette('')).toBeUndefined()
    expect(findPalette('nope')).toBeUndefined()
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/__tests__/palettes.test.ts`
Expected: FAIL with `Failed to resolve import "@/content/palettes"`.

- [ ] **Step 3: Write the module**

`src/content/palettes.ts`:

```ts
// Palette colours come from pavanjoshi914/dev-portfolio-template (site/content.json),
// MIT License, Copyright (c) 2026 Pavan Joshi.

export type Tone = 'light' | 'dark'

export type PaletteColors = {
  bg: string
  fg: string
  accent: string
  cursorline: string
  comment: string
  keyword: string
  string: string
  number: string
  function: string
  type: string
}

export type Palette = {
  slug: string
  name: string
  description: string
  tone: Tone
  colors: PaletteColors
}

export const DEFAULT_PALETTE = 'blackmoney'

export const palettes: readonly Palette[] = [
  {
    slug: 'blackmoney',
    name: 'Blackmoney',
    description: 'Warm paper on near-black',
    tone: 'dark',
    colors: {
      bg: '#0b0b0a',
      fg: '#ebe6db',
      accent: '#e7c58a',
      cursorline: '#11110f',
      comment: '#7a766a',
      keyword: '#7fd1a0',
      string: '#e6c37a',
      number: '#f0885b',
      function: '#8fd0ee',
      type: '#c9a0e8',
    },
  },
  {
    slug: 'paper',
    name: 'Paper',
    description: 'Light, ink on cream',
    tone: 'light',
    colors: {
      bg: '#f6f2e9',
      fg: '#1d1c1a',
      accent: '#b4532a',
      cursorline: '#ece8e0',
      comment: '#8c887c',
      keyword: '#2f6f4f',
      string: '#8a5a1a',
      number: '#b4532a',
      function: '#2c5d8a',
      type: '#5a4a8a',
    },
  },
  {
    slug: 'sora',
    name: 'Sora',
    description: 'Cool steel and teal',
    tone: 'dark',
    colors: {
      bg: '#0b1015',
      fg: '#d9e4ee',
      accent: '#4cc9f0',
      cursorline: '#111820',
      comment: '#56687a',
      keyword: '#4cc9f0',
      string: '#a9d6e5',
      number: '#ffa94d',
      function: '#9fb4ff',
      type: '#6ee7b7',
    },
  },
  {
    slug: 'circuit',
    name: 'Circuit',
    description: 'Board green, phosphor on black',
    tone: 'dark',
    colors: {
      bg: '#07110c',
      fg: '#d3f0dd',
      accent: '#3ddc84',
      cursorline: '#0b1a12',
      comment: '#4d6b5a',
      keyword: '#3ddc84',
      string: '#ffd166',
      number: '#ff8f70',
      function: '#59c3f0',
      type: '#c792ea',
    },
  },
  {
    slug: 'amber',
    name: 'Amber',
    description: 'Warm amber on ink',
    tone: 'dark',
    colors: {
      bg: '#0e0c08',
      fg: '#f1e6cc',
      accent: '#f7931a',
      cursorline: '#15120c',
      comment: '#7a6a4a',
      keyword: '#f7931a',
      string: '#e8d9a0',
      number: '#ff7a59',
      function: '#ffcf6b',
      type: '#9ad1d4',
    },
  },
  {
    slug: 'indigo',
    name: 'Indigo',
    description: 'Violet on deep indigo',
    tone: 'dark',
    colors: {
      bg: '#0d0b14',
      fg: '#e2dcf2',
      accent: '#a97bff',
      cursorline: '#14111e',
      comment: '#665f80',
      keyword: '#a97bff',
      string: '#c7b8f0',
      number: '#ff9ecb',
      function: '#8fb2ff',
      type: '#7ad9d0',
    },
  },
  {
    slug: 'crimson',
    name: 'Crimson',
    description: 'Warm terracotta and charcoal',
    tone: 'dark',
    colors: {
      bg: '#140a0a',
      fg: '#f4e3d0',
      accent: '#ff8f1f',
      cursorline: '#1e0f0f',
      comment: '#7a5a52',
      keyword: '#ff8f1f',
      string: '#e8c39e',
      number: '#ffd27a',
      function: '#7fd1c8',
      type: '#e08a96',
    },
  },
  {
    slug: 'slate',
    name: 'Slate',
    description: 'Neutral graphite',
    tone: 'dark',
    colors: {
      bg: '#111214',
      fg: '#d6d8dc',
      accent: '#9aa5b1',
      cursorline: '#1a1b1e',
      comment: '#666b73',
      keyword: '#9ab0c4',
      string: '#b9c4b0',
      number: '#d3a37a',
      function: '#c4b8d6',
      type: '#a3c4c0',
    },
  },
]

export function findPalette(query: string): Palette | undefined {
  const wanted = query.trim().toLowerCase()
  if (!wanted) return undefined
  return (
    palettes.find((palette) => palette.slug === wanted) ??
    palettes.find((palette) => palette.slug.startsWith(wanted))
  )
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/__tests__/palettes.test.ts`
Expected: PASS, 6 tests.

- [ ] **Step 5: Commit**

```bash
git add src/content/palettes.ts src/__tests__/palettes.test.ts
git commit -m "feat: add the eight terminal palettes"
```

---

### Task 3: Palette CSS generator

**Files:**
- Create: `src/lib/palette-css.ts`
- Test: `src/__tests__/palette-css.test.ts`

- [ ] **Step 1: Write the failing test**

`src/__tests__/palette-css.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { palettes } from '@/content/palettes'
import {
  MIN_CONTRAST,
  contrast,
  ensureContrast,
  hexToRgb,
  mix,
  paletteCss,
  paletteVars,
  rgbToHex,
  type Rgb,
} from '@/lib/palette-css'

const fromTriplet = (value: string) => value.split(' ').map(Number) as unknown as Rgb

describe('colour helpers', () => {
  it('converts between hex and rgb', () => {
    expect(hexToRgb('#0b0b0a')).toEqual([11, 11, 10])
    expect(rgbToHex([11, 11, 10])).toBe('#0b0b0a')
    expect(() => hexToRgb('red')).toThrow('Bad hex colour: red')
  })

  it('mixes channels by weight', () => {
    expect(mix([0, 0, 0], [255, 255, 255], 0.5)).toEqual([128, 128, 128])
    expect(mix([10, 20, 30], [10, 20, 30], 0.7)).toEqual([10, 20, 30])
  })

  it('measures WCAG contrast', () => {
    expect(contrast([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 5)
    expect(contrast([255, 255, 255], [255, 255, 255])).toBeCloseTo(1, 5)
  })

  it('leaves a passing colour alone and moves a failing one toward the target', () => {
    const white: Rgb = [255, 255, 255]
    const black: Rgb = [0, 0, 0]
    expect(ensureContrast(white, [black], white)).toEqual(white)
    const lifted = ensureContrast([40, 40, 40], [black], white)
    expect(contrast(lifted, black)).toBeGreaterThanOrEqual(MIN_CONTRAST)
  })
})

describe('paletteVars', () => {
  for (const palette of palettes) {
    it(`${palette.slug}: text colours reach ${MIN_CONTRAST}:1 on paper and panel`, () => {
      const vars = paletteVars(palette)
      const surfaces = [fromTriplet(vars['--paper']), fromTriplet(vars['--panel'])]
      const text = {
        ink: fromTriplet(vars['--ink']),
        muted: fromTriplet(vars['--muted']),
        signal: fromTriplet(vars['--signal']),
        ok: fromTriplet(vars['--ok']),
        warn: fromTriplet(vars['--warn']),
        accent: hexToRgb(vars['--accent']),
        kw: hexToRgb(vars['--kw']),
        str: hexToRgb(vars['--str']),
        num: hexToRgb(vars['--num']),
        fn: hexToRgb(vars['--fn']),
        ty: hexToRgb(vars['--ty']),
      }
      for (const [name, colour] of Object.entries(text)) {
        for (const surface of surfaces) {
          expect(contrast(colour, surface), name).toBeGreaterThanOrEqual(MIN_CONTRAST)
        }
      }
      // Text on accent-filled blocks (buttons, mode blocks).
      expect(contrast(hexToRgb(vars['--action-ink']), hexToRgb(vars['--action']))).toBeGreaterThanOrEqual(
        MIN_CONTRAST
      )
      expect(
        contrast(hexToRgb(vars['--action-ink']), hexToRgb(vars['--action-hover']))
      ).toBeGreaterThanOrEqual(MIN_CONTRAST)
    })
  }
})

describe('paletteCss', () => {
  const css = paletteCss()

  it('starts with a no-attribute fallback set to the default palette', () => {
    expect(css.startsWith(':root{color-scheme:dark;--paper:11 11 10;')).toBe(true)
  })

  it('emits one attribute block per palette with its tone', () => {
    expect(css).toContain(':root[data-theme="paper"]{color-scheme:light;')
    for (const palette of palettes) expect(css).toContain(`[data-theme="${palette.slug}"]`)
  })
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/__tests__/palette-css.test.ts`
Expected: FAIL with `Failed to resolve import "@/lib/palette-css"`.

- [ ] **Step 3: Write the module**

`src/lib/palette-css.ts`:

```ts
import { DEFAULT_PALETTE, palettes, type Palette } from '@/content/palettes'

export type Rgb = readonly [number, number, number]

export const MIN_CONTRAST = 4.5
// Generated colours aim slightly above the minimum so rounding in other tools never dips below it.
const TARGET_CONTRAST = 4.6

export function hexToRgb(hex: string): Rgb {
  const match = /^#([0-9a-f]{6})$/i.exec(hex)
  if (!match) throw new Error(`Bad hex colour: ${hex}`)
  const n = parseInt(match[1], 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

export function rgbToHex(rgb: Rgb): string {
  return `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`
}

export function mix(a: Rgb, b: Rgb, weight: number): Rgb {
  const channel = (i: 0 | 1 | 2) => Math.round(a[i] + (b[i] - a[i]) * weight)
  return [channel(0), channel(1), channel(2)]
}

function luminance(rgb: Rgb) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

/** Moves `colour` toward `toward` in 2% steps until it reaches `min` against every surface. */
export function ensureContrast(
  colour: Rgb,
  surfaces: readonly Rgb[],
  toward: Rgb,
  min = MIN_CONTRAST
): Rgb {
  for (let step = 0; step <= 50; step++) {
    const candidate = mix(colour, toward, step / 50)
    if (surfaces.every((surface) => contrast(candidate, surface) >= min)) return candidate
  }
  return toward
}

const triplet = (rgb: Rgb) => rgb.join(' ')

export function paletteVars(palette: Palette): Record<string, string> {
  const c = palette.colors
  const bg = hexToRgb(c.bg)
  const fg = hexToRgb(c.fg)
  const panel = hexToRgb(c.cursorline)
  const text = (hex: string) => ensureContrast(hexToRgb(hex), [bg, panel], fg, TARGET_CONTRAST)
  const accent = text(c.accent)

  return {
    '--paper': triplet(bg),
    '--panel': triplet(panel),
    '--ink': triplet(fg),
    '--muted': triplet(text(c.comment)),
    '--rule': triplet(mix(bg, fg, 0.3)),
    '--signal': triplet(text(c.number)),
    '--ok': triplet(text(c.keyword)),
    '--warn': triplet(text(c.string)),
    '--accent': rgbToHex(accent),
    '--action': rgbToHex(accent),
    '--action-ink': c.bg,
    '--action-hover': rgbToHex(mix(accent, fg, 0.15)),
    '--kw': rgbToHex(text(c.keyword)),
    '--str': rgbToHex(text(c.string)),
    '--num': rgbToHex(text(c.number)),
    '--fn': rgbToHex(text(c.function)),
    '--ty': rgbToHex(text(c.type)),
  }
}

function block(selector: string, palette: Palette) {
  const body = Object.entries(paletteVars(palette))
    .map(([name, value]) => `${name}:${value}`)
    .join(';')
  return `${selector}{color-scheme:${palette.tone};${body}}`
}

/** One `:root` fallback (no JS yet) plus one `:root[data-theme="slug"]` block per palette. */
export function paletteCss(list: readonly Palette[] = palettes): string {
  const fallback = list.find((p) => p.slug === DEFAULT_PALETTE) ?? list[0]
  return [
    block(':root', fallback),
    ...list.map((p) => block(`:root[data-theme="${p.slug}"]`, p)),
  ].join('\n')
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run src/__tests__/palette-css.test.ts`
Expected: PASS, 14 tests: 4 helper tests, 8 palette tests and 2 CSS tests. The hover colour mixes the accent toward `fg`, which moves it away from `--action-ink` (the background colour) in both light and dark palettes, so its contrast can only go up.

- [ ] **Step 5: Commit**

```bash
git add src/lib/palette-css.ts src/__tests__/palette-css.test.ts
git commit -m "feat: generate palette CSS with guaranteed text contrast"
```

---

### Task 4: Wire palettes, fonts and base type into the layout

Plain-text checks are done by build plus e2e here. After this task the old sun/moon toggle is gone, and the next task adds the picker.

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css:5-41`, the `@layer components` type classes, and the print block
- Modify: `tailwind.config.ts`
- Modify: `src/app/catalog.css:139-147`
- Modify: `src/components/site-header.tsx`
- Modify: `e2e/navigation.spec.ts:309-319`, `e2e/phase-three.spec.ts:125-140`
- Create: `src/app/fonts/ibm-plex-mono-400-latin.woff2`, `src/app/fonts/ibm-plex-mono-600-latin.woff2`, `public/fonts/IBMPlexMono-OFL.txt`
- Delete: `src/app/fonts/newsreader-latin.woff2`, `src/app/fonts/geist-mono-latin.woff2`, `public/fonts/Newsreader-OFL.txt`

- [ ] **Step 1: Fetch IBM Plex Mono and its licence, and remove the old fonts**

```bash
curl -fsSL -o src/app/fonts/ibm-plex-mono-400-latin.woff2 https://cdn.jsdelivr.net/npm/@ibm/plex-mono@1.1.0/fonts/split/woff2/IBMPlexMono-Regular-Latin1.woff2
curl -fsSL -o src/app/fonts/ibm-plex-mono-600-latin.woff2 https://cdn.jsdelivr.net/npm/@ibm/plex-mono@1.1.0/fonts/split/woff2/IBMPlexMono-SemiBold-Latin1.woff2
curl -fsSL -o public/fonts/IBMPlexMono-OFL.txt https://cdn.jsdelivr.net/npm/@ibm/plex-mono@1.1.0/LICENSE.txt
file src/app/fonts/ibm-plex-mono-*.woff2
git rm -q src/app/fonts/newsreader-latin.woff2 src/app/fonts/geist-mono-latin.woff2 public/fonts/Newsreader-OFL.txt
```

Expected: `file` reports `Web Open Font Format (Version 2)` for both files.

- [ ] **Step 2: Update `src/app/layout.tsx`**

Replace the imports and font block (lines 1-30) with:

```tsx
import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { DEFAULT_PALETTE, palettes } from '@/content/palettes'
import { site } from '@/content/site'
import { homeTitle } from '@/lib/metadata'
import { paletteCss } from '@/lib/palette-css'
import './globals.css'
import './catalog.css'
import './finder.css'

const display = localFont({
  src: './fonts/geist-latin.woff2',
  weight: '100 900',
  display: 'swap',
  variable: '--font-display',
})
const mono = localFont({
  src: [
    { path: './fonts/ibm-plex-mono-400-latin.woff2', weight: '400', style: 'normal' },
    { path: './fonts/ibm-plex-mono-600-latin.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-mono',
})
```

Replace the returned JSX (`<html …>` to `</html>`) with:

```tsx
    <html lang="en" suppressHydrationWarning className={`${display.variable} ${mono.variable}`}>
      <head>
        {process.env.NODE_ENV === 'production' && (
          <meta httpEquiv="Content-Security-Policy" content={csp} />
        )}
        <style dangerouslySetInnerHTML={{ __html: paletteCss() }} />
      </head>
      <body>
        <ThemeProvider
          attribute="data-theme"
          themes={palettes.map((palette) => palette.slug)}
          defaultTheme={DEFAULT_PALETTE}
          enableSystem={false}
          storageKey="palette"
        >
          <SiteHeader />
          <div id="content" tabIndex={-1}>
            {children}
          </div>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
```

- [ ] **Step 3: Replace the colour tokens in `src/app/globals.css`**

Replace lines 5-41 (the whole `:root { … }` and `.dark { … }` blocks) with:

```css
  /* Colours come from src/content/palettes.ts, rendered inline by the root layout. */
  :root {
    --gutter: clamp(1rem, 4.4vw, 4rem);
    --section-space: clamp(4.25rem, 8.5vw, 8.25rem);
    --radius: 0;
    --ease: cubic-bezier(0.2, 0.7, 0.2, 1);
    --fast: 180ms;
    --theme-ease: cubic-bezier(0.23, 1, 0.32, 1);
    --theme-duration: 420ms;
    --cell-w: 7.2px;
    --cell-h: 13px;
  }
```

In the `body` rule, add the palette transition after `line-height: 1.6;`:

```css
    transition:
      background-color var(--theme-duration) var(--theme-ease),
      color var(--theme-duration) var(--theme-ease);
```

- [ ] **Step 4: Replace the type classes in `src/app/globals.css`**

Replace the `.display`, `.h-section`, `.h-page`, `.label` and `.eyebrow` rules with:

```css
  .display {
    @apply font-mono font-semibold;
    letter-spacing: -0.035em;
    line-height: 1.06;
  }
  .h-section {
    @apply display;
    font-size: clamp(2rem, 4.4vw, 3.9rem);
  }
  .h-page {
    font-family: var(--font-mono), ui-monospace, monospace;
    font-weight: 600;
    font-size: clamp(2.4rem, 6vw, 4.5rem);
    letter-spacing: -0.04em;
    line-height: 1.02;
  }
  .h-page::before {
    content: '# ';
    content: '# ' / '';
    color: rgb(var(--muted));
    font-weight: 400;
  }
  .label {
    @apply font-mono font-medium;
    font-size: 0.8125rem;
    line-height: 1.5;
    letter-spacing: 0;
  }
  .eyebrow {
    @apply label;
    color: rgb(var(--muted));
  }
  .eyebrow::before {
    content: '// ';
    content: '// ' / '';
  }
  .btn,
  .btn-quiet {
    font-family: var(--font-mono), ui-monospace, monospace;
  }
```

Then add these chrome classes at the end of `@layer components`, before its closing `}`:

```css
  .status-line {
    display: flex;
    align-items: center;
    gap: 1.5ch;
    min-height: calc(var(--cell-h) + 0.6rem);
    overflow: hidden;
    background: rgb(var(--panel));
    color: rgb(var(--ink));
    font: 400 0.75rem / 1.6 var(--font-mono), ui-monospace, monospace;
    white-space: nowrap;
  }
  .mode-block {
    align-self: stretch;
    display: inline-flex;
    align-items: center;
    padding-inline: 1ch;
    background: var(--accent);
    color: var(--action-ink);
    font-weight: 600;
  }
  .status-path {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .status-hint {
    margin-inline-start: auto;
    padding-inline-end: 1ch;
    color: rgb(var(--muted));
  }
  .path-bar {
    padding-block-start: 1rem;
    color: rgb(var(--muted));
    font: 400 0.8125rem / 1.5 var(--font-mono), ui-monospace, monospace;
    overflow-wrap: anywhere;
  }
```

- [ ] **Step 5: Replace the print block at the end of `src/app/globals.css`**

```css
@media print {
  /* Specificity beats the inline palette blocks (0,2,0), whatever their source order. */
  :root:root:root,
  :root[data-theme][data-theme] {
    color-scheme: light;
    --paper: 255 255 255;
    --panel: 255 255 255;
    --ink: 0 0 0;
    --muted: 70 70 70;
    --rule: 0 0 0;
    --signal: 0 0 0;
    --ok: 0 0 0;
    --warn: 0 0 0;
    --accent: #000;
    --action: #000;
    --action-ink: #fff;
    --action-hover: #000;
    --kw: #000;
    --str: #000;
    --num: #000;
    --fn: #000;
    --ty: #000;
  }
  *,
  *::before,
  *::after {
    transition: none !important;
  }
  .site-header,
  .site-footer,
  .path-bar,
  .no-print {
    display: none !important;
  }
}
```

- [ ] **Step 6: Remove the old print variables from `src/app/catalog.css`**

Delete lines 139-147, the `:root, .dark { color-scheme: light; --paper: …; --accent: #274b29; }` block inside `@media print`. Leave the rest of that print block as it is.

- [ ] **Step 7: Drop Tailwind's dark mode**

In `tailwind.config.ts`, delete the line `darkMode: ['class'],`.

- [ ] **Step 8: Remove `ThemeToggle` from the header**

In `src/components/site-header.tsx`:
- delete the `useTheme`, `useEffect` and `useState` imports and the whole `ThemeToggle` function
- delete `<ThemeToggle />` from `header-actions`

The imports become:

```tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SiteWordmark } from '@/components/site-wordmark'
import { FinderTrigger } from '@/components/finder-trigger'
import { nav } from '@/content/site'
import '@/app/site-chrome.css'
```

- [ ] **Step 9: Point the existing theme tests at palettes**

In `e2e/navigation.spec.ts`, delete the whole `test('theme toggle switches and persists', …)` block (lines 309-319). Task 6 replaces it.

In `e2e/phase-three.spec.ts`, replace the test at lines 125-140 with:

```ts
test('both flagship case studies pass accessibility checks in the Paper palette', async ({
  page,
}) => {
  test.slow()
  await page.addInitScript(() => localStorage.setItem('palette', 'paper'))

  for (const slug of ['azure-internal-access', 'aws-hosting-and-sso']) {
    await page.goto(`/work/${slug}`)
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(
      axe.violations.map(({ id, nodes }) => `${id}: ${nodes[0].target}`),
      slug
    ).toEqual([])
  }
})
```

- [ ] **Step 10: Verify**

Run each and check the expected result:

| Command | Expected |
|---|---|
| `npm run type-check` | no errors |
| `npm test` | all pass |
| `npm run build` | succeeds |
| `grep -c 'data-theme="paper"' out/index.html` | at least `1`, from the inline palette CSS |
| `npx playwright test e2e/phase-three.spec.ts -g "Paper palette" --project=chromium` | PASS |

`grep -rn "font-editorial" src` will still list `case-study.css`, `site-chrome.css`, `studio.css` and `editorial.css`. Tasks 6, 9 and 10 fix those. They fall back to Georgia until then, which is acceptable mid-plan.

- [ ] **Step 11: Commit**

```bash
git add -A src/app/layout.tsx src/app/globals.css src/app/catalog.css tailwind.config.ts src/components/site-header.tsx src/app/fonts public/fonts e2e/navigation.spec.ts e2e/phase-three.spec.ts
git commit -m "feat: switch the site to inline palettes and IBM Plex Mono"
```

---

### Task 5: Command and key helpers

**Files:**
- Create: `src/lib/command.ts`, `src/lib/keys.ts`
- Test: `src/__tests__/command.test.ts`, `src/__tests__/keys.test.ts`

- [ ] **Step 1: Write the failing tests**

`src/__tests__/command.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { parseCommand } from '@/lib/command'

describe('parseCommand', () => {
  it('treats text without a leading colon as a search', () => {
    expect(parseCommand('azure')).toEqual({ kind: 'search' })
    expect(parseCommand('')).toEqual({ kind: 'search' })
  })

  it('resolves :theme to a palette by prefix, ignoring case', () => {
    expect(parseCommand(':theme paper')).toMatchObject({ kind: 'theme', palette: { slug: 'paper' } })
    expect(parseCommand('  :THEME so ')).toMatchObject({ kind: 'theme', palette: { slug: 'sora' } })
  })

  it('reports unknown or missing palette names', () => {
    expect(parseCommand(':theme nope')).toEqual({ kind: 'theme-unknown', query: 'nope' })
    expect(parseCommand(':theme')).toEqual({ kind: 'theme-unknown', query: '' })
  })

  it('maps navigation commands to routes', () => {
    expect(parseCommand(':work')).toEqual({ kind: 'go', href: '/work' })
    expect(parseCommand(':lab')).toEqual({ kind: 'go', href: '/lab' })
    expect(parseCommand(':resume')).toEqual({ kind: 'go', href: '/resume' })
    expect(parseCommand(':about')).toEqual({ kind: 'go', href: '/#about' })
    expect(parseCommand(':contact')).toEqual({ kind: 'go', href: '/#contact' })
  })

  it('reports anything else as unknown, including prototype keys', () => {
    expect(parseCommand(':deploy')).toEqual({ kind: 'unknown', name: 'deploy' })
    expect(parseCommand(':constructor')).toEqual({ kind: 'unknown', name: 'constructor' })
    expect(parseCommand(':')).toEqual({ kind: 'unknown', name: '' })
  })
})
```

`src/__tests__/keys.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { hasModifier, isTypingTarget, nextIndex } from '@/lib/keys'

describe('isTypingTarget', () => {
  it('is true for form fields and editable content', () => {
    expect(isTypingTarget({ tagName: 'INPUT' } as unknown as EventTarget)).toBe(true)
    expect(isTypingTarget({ tagName: 'TEXTAREA' } as unknown as EventTarget)).toBe(true)
    expect(isTypingTarget({ tagName: 'SELECT' } as unknown as EventTarget)).toBe(true)
    expect(
      isTypingTarget({ tagName: 'DIV', isContentEditable: true } as unknown as EventTarget)
    ).toBe(true)
  })

  it('is false for links, the page and nothing', () => {
    expect(isTypingTarget({ tagName: 'A' } as unknown as EventTarget)).toBe(false)
    expect(isTypingTarget({} as EventTarget)).toBe(false)
    expect(isTypingTarget(null)).toBe(false)
  })
})

describe('hasModifier', () => {
  it('ignores shift but not ctrl, meta or alt', () => {
    const none = { ctrlKey: false, metaKey: false, altKey: false }
    expect(hasModifier(none)).toBe(false)
    expect(hasModifier({ ...none, ctrlKey: true })).toBe(true)
    expect(hasModifier({ ...none, metaKey: true })).toBe(true)
    expect(hasModifier({ ...none, altKey: true })).toBe(true)
  })
})

describe('nextIndex', () => {
  it('enters the list at the start going down and at the end going up', () => {
    expect(nextIndex(-1, 1, 5)).toBe(0)
    expect(nextIndex(-1, -1, 5)).toBe(4)
  })

  it('moves by one and stops at either end', () => {
    expect(nextIndex(2, 1, 5)).toBe(3)
    expect(nextIndex(4, 1, 5)).toBe(4)
    expect(nextIndex(0, -1, 5)).toBe(0)
  })

  it('returns -1 for an empty list', () => {
    expect(nextIndex(0, 1, 0)).toBe(-1)
  })
})
```

- [ ] **Step 2: Run them to verify they fail**

Run: `npx vitest run src/__tests__/command.test.ts src/__tests__/keys.test.ts`
Expected: FAIL. Both imports fail to resolve.

- [ ] **Step 3: Write the modules**

`src/lib/command.ts`:

```ts
import { findPalette, type Palette } from '@/content/palettes'

export type Command =
  | { kind: 'search' }
  | { kind: 'theme'; palette: Palette }
  | { kind: 'theme-unknown'; query: string }
  | { kind: 'go'; href: string }
  | { kind: 'unknown'; name: string }

export const commandRoutes: Readonly<Record<string, string>> = {
  work: '/work',
  lab: '/lab',
  resume: '/resume',
  about: '/#about',
  contact: '/#contact',
}

export function parseCommand(input: string): Command {
  const text = input.trim()
  if (!text.startsWith(':')) return { kind: 'search' }

  const [first = '', ...rest] = text.slice(1).trim().split(/\s+/)
  const name = first.toLowerCase()

  if (name === 'theme') {
    const query = rest.join(' ')
    const palette = findPalette(query)
    return palette ? { kind: 'theme', palette } : { kind: 'theme-unknown', query }
  }
  if (Object.prototype.hasOwnProperty.call(commandRoutes, name)) {
    return { kind: 'go', href: commandRoutes[name] }
  }
  return { kind: 'unknown', name }
}
```

`src/lib/keys.ts`:

```ts
type Modifiers = { ctrlKey: boolean; metaKey: boolean; altKey: boolean }

/** True when a keypress should type into the target rather than drive page shortcuts. */
export function isTypingTarget(target: EventTarget | null): boolean {
  const element = target as { tagName?: unknown; isContentEditable?: boolean } | null
  if (!element || typeof element.tagName !== 'string') return false
  if (element.isContentEditable) return true
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)
}

/** Shift is allowed so `:` (Shift+;) still counts as a plain key. */
export function hasModifier(event: Modifiers): boolean {
  return event.ctrlKey || event.metaKey || event.altKey
}

export function nextIndex(current: number, step: 1 | -1, length: number): number {
  if (length === 0) return -1
  if (current < 0) return step === 1 ? 0 : length - 1
  return Math.min(length - 1, Math.max(0, current + step))
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `npx vitest run src/__tests__/command.test.ts src/__tests__/keys.test.ts`
Expected: PASS, 11 tests.

- [ ] **Step 5: Commit**

```bash
git add src/lib/command.ts src/lib/keys.ts src/__tests__/command.test.ts src/__tests__/keys.test.ts
git commit -m "feat: add command-line parsing and keyboard helpers"
```

---

### Task 6: Header, wordmark and palette picker

**Files:**
- Create: `src/components/palette-picker.tsx`, `e2e/terminal-theme.spec.ts`
- Modify: `src/components/site-header.tsx`, `src/components/site-wordmark.tsx`, `src/app/site-chrome.css`, `public/brand.svg`

- [ ] **Step 1: Write the failing e2e tests**

`e2e/terminal-theme.spec.ts`:

```ts
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('palette picker', () => {
  test('switches palettes and persists across reload', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'blackmoney')
    await page.getByRole('button', { name: 'Change palette' }).click()
    await page.getByRole('radio', { name: /^Paper/ }).click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')
    const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
    expect(axe.violations.map((violation) => violation.id)).toEqual([])
  })

  test('is a keyboard radio group', async ({ page }) => {
    await page.goto('/')
    const trigger = page.getByRole('button', { name: 'Change palette' })
    await trigger.click()
    const group = page.getByRole('radiogroup', { name: 'Palette' })
    await expect(group.getByRole('radio', { name: /^Blackmoney/ })).toBeFocused()
    await page.keyboard.press('ArrowDown')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')
    await expect(group.getByRole('radio', { name: /^Paper/ })).toBeFocused()
    await expect(group.getByRole('radio', { name: /^Paper/ })).toHaveAttribute('aria-checked', 'true')
    await page.keyboard.press('Escape')
    await expect(group).toBeHidden()
    await expect(trigger).toBeFocused()
  })
})
```

- [ ] **Step 2: Build and run to verify they fail**

Run: `npm run build && npx playwright test e2e/terminal-theme.spec.ts --project=chromium`
Expected: FAIL. No button is named "Change palette".

- [ ] **Step 3: Write the picker**

`src/components/palette-picker.tsx`:

```tsx
'use client'

import { useTheme } from 'next-themes'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { DEFAULT_PALETTE, palettes } from '@/content/palettes'

const swatches = ['accent', 'keyword', 'string', 'number', 'function', 'type'] as const
const steps: Record<string, 1 | -1> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }

export function PalettePicker() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const options = useRef<(HTMLButtonElement | null)[]>([])
  const id = useId()

  useEffect(() => setMounted(true), [])

  const active = mounted ? (theme ?? DEFAULT_PALETTE) : DEFAULT_PALETTE
  const activeIndex = Math.max(
    0,
    palettes.findIndex((palette) => palette.slug === active)
  )

  // Focus follows the checked option while open (roving tabindex).
  useEffect(() => {
    if (!open) return
    options.current[activeIndex]?.focus()
    const outside = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open, activeIndex])

  function close() {
    setOpen(false)
    trigger.current?.focus()
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const step = steps[event.key]
    if (step) {
      event.preventDefault()
      const next = (activeIndex + step + palettes.length) % palettes.length
      setTheme(palettes[next].slug)
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    }
  }

  return (
    <div className="palette-picker" ref={root}>
      <button
        ref={trigger}
        type="button"
        className="header-tool palette-trigger"
        aria-label="Change palette"
        aria-expanded={open}
        aria-controls={`${id}-palettes`}
        onClick={() => setOpen((value) => !value)}
      >
        <span aria-hidden="true">:theme</span>
      </button>
      <div
        id={`${id}-palettes`}
        className="palette-list"
        role="radiogroup"
        aria-label="Palette"
        hidden={!open}
        onKeyDown={onKeyDown}
      >
        {palettes.map((palette, index) => (
          <button
            key={palette.slug}
            ref={(node) => {
              options.current[index] = node
            }}
            type="button"
            role="radio"
            aria-checked={palette.slug === active}
            tabIndex={index === activeIndex ? 0 : -1}
            className="palette-option"
            onClick={() => {
              setTheme(palette.slug)
              close()
            }}
          >
            <span className="palette-name">{palette.name}</span>
            <span className="palette-description">{palette.description}</span>
            <span className="palette-swatches" aria-hidden="true">
              {swatches.map((key) => (
                <i key={key} style={{ background: palette.colors[key] }} />
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Add it to the header**

In `src/components/site-header.tsx`, add `import { PalettePicker } from '@/components/palette-picker'` and make `header-actions`:

```tsx
        <div className="header-actions">
          <FinderTrigger />
          <PalettePicker />
        </div>
```

- [ ] **Step 5: Make the wordmark a prompt**

`src/components/site-wordmark.tsx`:

```tsx
import Link from 'next/link'
import { site } from '@/content/site'

export function SiteWordmark() {
  return (
    <Link href="/" className="site-wordmark" prefetch={false}>
      <span aria-hidden="true">▸_</span>
      {site.name}
    </Link>
  )
}
```

The link's accessible name stays "Sushant Sonbarse". CSS lowercases how it looks.

- [ ] **Step 6: Restyle the chrome in `src/app/site-chrome.css`**

Replace the `.site-wordmark { … }` rule (lines 17-31) with:

```css
.site-wordmark {
  display: inline-flex;
  align-items: center;
  gap: 1ch;
  justify-self: start;
  min-height: 2.75rem;
  font: 600 0.9375rem / 1 var(--font-mono), ui-monospace, monospace;
  text-transform: lowercase;
  white-space: nowrap;
  transition: color var(--fast) var(--ease);
}
```

In the `.main-nav a, .footer-index a` rule, change `font-size: 0.875rem;` to the three lines below:

```css
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.8125rem;
  text-transform: lowercase;
```

In the `@media (max-width: 760px)` block, delete the `.site-wordmark { font-size: … }` rule.

Append the picker styles at the end of the file:

```css
.palette-picker {
  position: relative;
}

.palette-trigger {
  width: auto;
  padding-inline: 0.6rem;
  font: 500 0.8125rem / 1 var(--font-mono), ui-monospace, monospace;
}

.palette-trigger[aria-expanded='true'] {
  background: var(--action);
  color: var(--action-ink);
}

.palette-list {
  position: absolute;
  z-index: 50;
  inset-block-start: calc(100% + 0.4rem);
  inset-inline-end: 0;
  display: grid;
  width: min(22rem, calc(100vw - 2rem));
  padding: 0.35rem;
  border: 1px solid rgb(var(--rule) / 0.5);
  background: rgb(var(--paper));
}

/* Preflight's [hidden] rule loses to the display above, so restate it. */
.palette-list[hidden] {
  display: none;
}

.palette-option {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 0.1rem 1rem;
  padding: 0.55rem 0.65rem;
  border-inline-start: 2px solid transparent;
  font-family: var(--font-mono), ui-monospace, monospace;
  text-align: start;
}

.palette-option:hover,
.palette-option[aria-checked='true'] {
  border-inline-start-color: var(--accent);
  background: rgb(var(--panel));
}

.palette-name {
  font-size: 0.875rem;
  font-weight: 600;
}

.palette-description {
  grid-column: 1;
  color: rgb(var(--muted));
  font-size: 0.75rem;
}

.palette-swatches {
  grid-column: 2;
  grid-row: 1 / span 2;
  display: flex;
  align-self: center;
}

.palette-swatches i {
  width: 0.7rem;
  height: 1.4rem;
}
```

- [ ] **Step 7: Replace the favicon**

`public/brand.svg`:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect width="48" height="48" fill="#0b0b0a"/>
  <path d="M11 13l11 11-11 11" fill="none" stroke="#e7c58a" stroke-width="4.5" stroke-linecap="square"/>
  <path d="M25 35h13" stroke="#ebe6db" stroke-width="4.5" stroke-linecap="square"/>
</svg>
```

- [ ] **Step 8: Build and run the tests to verify they pass**

Run: `npm run type-check && npm run lint && npm run build && npx playwright test e2e/terminal-theme.spec.ts --project=chromium`
Expected: 2 passed.

Then open `out/index.html` through `npx --yes serve@14 out -l 3000` and check by eye:
- the header reads `▸_ sushant sonbarse`
- the nav is in lowercase mono
- `:theme` opens a list of 8 palettes with swatches

- [ ] **Step 9: Commit**

```bash
git add src/components/palette-picker.tsx src/components/site-header.tsx src/components/site-wordmark.tsx src/app/site-chrome.css public/brand.svg e2e/terminal-theme.spec.ts
git commit -m "feat: add the :theme palette picker and terminal wordmark"
```

---

### Task 7: `:` command line in the finder

**Files:**
- Modify: `src/components/finder-trigger.tsx`, `src/components/portfolio-finder.tsx`, `src/app/finder.css`
- Test: `e2e/terminal-theme.spec.ts`

- [ ] **Step 1: Write the failing e2e tests**

Append to `e2e/terminal-theme.spec.ts`:

```ts
test.describe('command line', () => {
  test(':theme switches the palette and closes', async ({ page }) => {
    await page.goto('/work')
    await page.keyboard.press(':')
    const input = page.getByRole('combobox', { name: 'Search the portfolio' })
    await expect(input).toHaveValue(':')
    await page.keyboard.type('theme sora')
    await page.keyboard.press('Enter')
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'sora')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })

  test('unknown palettes and commands explain themselves', async ({ page }) => {
    await page.goto('/work')
    await page.keyboard.press(':')
    await page.keyboard.type('theme nope')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('status')).toContainText("No palette 'nope'")
    await page.getByRole('combobox', { name: 'Search the portfolio' }).fill(':deploy')
    await page.keyboard.press('Enter')
    await expect(page.getByRole('status')).toContainText('Unknown command')
  })

  test(':resume navigates', async ({ page }) => {
    await page.goto('/work')
    await page.keyboard.press(':')
    await page.keyboard.type('resume')
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/\/resume$/)
  })

  test(': types normally inside form fields', async ({ page }) => {
    await page.goto('/')
    const name = page.getByLabel('Name', { exact: true })
    await name.fill('a')
    await name.press(':')
    await expect(name).toHaveValue('a:')
    await expect(page.getByRole('dialog')).toHaveCount(0)
  })
})
```

- [ ] **Step 2: Build and run to verify they fail**

Run: `npm run build && npx playwright test e2e/terminal-theme.spec.ts -g "command line" --project=chromium`
Expected: the first three FAIL because `:` opens nothing. The fourth passes.

- [ ] **Step 3: Open the finder on `:`**

In `src/components/finder-trigger.tsx`:
- add `import { hasModifier, isTypingTarget } from '@/lib/keys'`
- add the state `const [initial, setInitial] = useState('')`

Replace the shortcut effect with:

```tsx
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        setInitial('')
        setOpen(true)
        return
      }
      if (
        event.key === ':' &&
        !hasModifier(event) &&
        !isTypingTarget(event.target) &&
        !document.querySelector('dialog[open]')
      ) {
        event.preventDefault()
        setInitial(':')
        setOpen(true)
      }
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])
```

Change the button's `onClick` to:

```tsx
        onClick={() => {
          setInitial('')
          setOpen(true)
        }}
```

Change the dialog render to `{open && <PortfolioFinder onClose={close} initialQuery={initial} />}`.

- [ ] **Step 4: Run commands in the finder**

In `src/components/portfolio-finder.tsx`:

1. Add the imports:

```tsx
import { useTheme } from 'next-themes'
import { palettes } from '@/content/palettes'
import { parseCommand } from '@/lib/command'
```

2. Change the signature and the state at the top of the component:

```tsx
export function PortfolioFinder({
  onClose,
  initialQuery = '',
}: {
  onClose: () => void
  initialQuery?: string
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { setTheme } = useTheme()
  const id = useId()
  const [query, setQuery] = useState(initialQuery)
  const [notice, setNotice] = useState('')
  const [current, setCurrent] = useState(0)
```

3. Directly after `const normalized = searchable(query).trim()`, add `const isCommand = query.trimStart().startsWith(':')`. Prefix the `results` chain so commands never search, and update `expanded`:

```tsx
  const results = isCommand
    ? []
    : destinations
        .filter((item) =>
          terms.every((term) =>
            searchable(`${item.title} ${item.group} ${item.keywords ?? ''}`).includes(term)
          )
        )
        .sort(
          (a, b) =>
            Number(searchable(b.title).startsWith(normalized)) -
            Number(searchable(a.title).startsWith(normalized))
        )
        .slice(0, 10)
  const expanded = !diagnostics && !isCommand && results.length > 0
```

4. In the mount effect, put the caret after any initial text:

```tsx
  useEffect(() => {
    const node = dialog.current
    node?.showModal()
    const field = input.current
    field?.focus()
    field?.setSelectionRange(field.value.length, field.value.length)
    return () => {
      if (node?.open) node.close()
    }
  }, [])
```

5. Add `run()` after `choose()`, and handle Enter for commands at the top of `navigate()`:

```tsx
  const paletteNames = palettes.map((palette) => palette.slug).join(', ')

  function run() {
    const command = parseCommand(query)
    if (command.kind === 'theme') {
      setTheme(command.palette.slug)
      dialog.current?.close()
    } else if (command.kind === 'go') {
      choose(command.href)
    } else if (command.kind === 'theme-unknown') {
      setNotice(
        command.query
          ? `No palette '${command.query}'. Try ${paletteNames}.`
          : `Name a palette: ${paletteNames}.`
      )
    } else {
      setNotice('Unknown command. Try :theme, :work, :lab, :resume, :about or :contact.')
    }
  }

  function navigate(event: KeyboardEvent<HTMLInputElement>) {
    if (isCommand && event.key === 'Enter') {
      event.preventDefault()
      run()
      return
    }
    if (diagnostics || !results.length) return
    // …the existing ArrowDown/ArrowUp/Enter handling stays unchanged below this line
```

6. In the input's `onChange`, also clear the notice, and change the placeholder:

```tsx
          placeholder="Try résumé, Azure, or :theme paper"
          onChange={(event) => {
            setQuery(event.currentTarget.value)
            setNotice('')
            setCurrent(0)
          }}
```

7. Replace the "No matches" paragraph with:

```tsx
        {!diagnostics && !isCommand && results.length === 0 && (
          <p className="finder-empty" role="status">
            No matches.
          </p>
        )}
        {isCommand && (
          <p className="finder-empty" role="status">
            {notice || 'Press Enter to run the command.'}
          </p>
        )}
```

- [ ] **Step 5: Square off the finder in `src/app/finder.css`**

In `.portfolio-finder`:
- change `border-radius: 0.8rem;` to `border-radius: var(--radius);`
- delete the `box-shadow` line

Replace the `::backdrop` background with `background: color-mix(in srgb, rgb(var(--paper)) 82%, transparent);`. Add `font-family: var(--font-mono), ui-monospace, monospace;` to `.finder-results li`.

- [ ] **Step 6: Build and run the tests to verify they pass**

Run: `npm run type-check && npm run lint && npm run build && npx playwright test e2e/terminal-theme.spec.ts --project=chromium`
Expected: 6 passed.

- [ ] **Step 7: Commit**

```bash
git add src/components/finder-trigger.tsx src/components/portfolio-finder.tsx src/app/finder.css e2e/terminal-theme.spec.ts
git commit -m "feat: open the finder as a : command line"
```

---

### Task 8: Status line footer and path bar

**Files:**
- Create: `src/components/status-line.tsx`, `src/components/path-bar.tsx`
- Modify: `src/components/site-footer.tsx`, `src/app/layout.tsx`, `src/app/site-chrome.css`

- [ ] **Step 1: Write the failing e2e test**

Append to `e2e/terminal-theme.spec.ts`:

```ts
test('inner pages show a path bar and the footer shows a status line', async ({ page }) => {
  await page.goto('/work/crm-on-eks')
  await expect(page.locator('.path-bar')).toHaveText('~/work/crm-on-eks')
  await expect(page.locator('.site-footer .status-line')).toContainText('NORMAL')
  await expect(page.locator('.site-footer .status-line')).toContainText('~/work/crm-on-eks')
  await page.goto('/')
  await expect(page.locator('.path-bar')).toHaveCount(0)
})
```

- [ ] **Step 2: Build and run to verify it fails**

Run: `npm run build && npx playwright test e2e/terminal-theme.spec.ts -g "path bar" --project=chromium`
Expected: FAIL. `.path-bar` is not found.

- [ ] **Step 3: Write the components**

`src/components/status-line.tsx`:

```tsx
'use client'

import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function StatusLine({
  path,
  hint,
  className,
}: {
  path?: string
  hint?: string
  className?: string
}) {
  const pathname = usePathname()
  const shown = path ?? `~${pathname === '/' ? '' : pathname}`

  return (
    <p className={cn('status-line', className)} aria-hidden="true">
      <span className="mode-block">NORMAL</span>
      <span className="status-path">{shown}</span>
      <span className="status-hint">{hint ?? 'utf-8'}</span>
    </p>
  )
}
```

`src/components/path-bar.tsx`:

```tsx
'use client'

import { usePathname } from 'next/navigation'

/** The ~/route line under the header. The homepage has its own terminal instead. */
export function PathBar() {
  const pathname = usePathname()
  if (pathname === '/') return null
  return (
    <p className="wrap path-bar" aria-hidden="true">
      {`~${pathname.replace(/\/$/, '')}`}
    </p>
  )
}
```

- [ ] **Step 4: Use them**

In `src/app/layout.tsx`, add `import { PathBar } from '@/components/path-bar'` and render `<PathBar />` directly after `<SiteHeader />`.

In `src/components/site-footer.tsx`, add `import { StatusLine } from '@/components/status-line'`, and make the footer open with the status line before `.footer-inner`:

```tsx
    <footer className="site-footer">
      <StatusLine className="footer-status" />
      <div className="wrap footer-inner">
```

In `src/app/site-chrome.css`, change `.site-footer` to:

```css
.site-footer {
  border-top: 1px solid rgb(var(--rule) / 0.2);
  padding-block: 0 clamp(1.65rem, 4vw, 3.2rem);
}

.footer-status {
  margin-bottom: clamp(1.65rem, 4vw, 3.2rem);
}
```

- [ ] **Step 5: Build and run the tests to verify they pass**

Run: `npm run type-check && npm run build && npx playwright test e2e/terminal-theme.spec.ts --project=chromium`
Expected: 7 passed.

- [ ] **Step 6: Commit**

```bash
git add src/components/status-line.tsx src/components/path-bar.tsx src/components/site-footer.tsx src/app/layout.tsx src/app/site-chrome.css e2e/terminal-theme.spec.ts
git commit -m "feat: add the status line footer and path bar"
```

---

### Task 9: Homepage terminal hero, buffers and keys

**Files:**
- Create: `src/components/terminal-hero.tsx`, `src/components/home-keys.tsx`, `src/app/terminal-home.css`
- Modify: `src/app/page.tsx`
- Delete: `src/app/editorial.css`
- Test: `e2e/terminal-theme.spec.ts`

- [ ] **Step 1: Write the failing e2e tests**

Append to `e2e/terminal-theme.spec.ts`:

```ts
test.describe('homepage terminal', () => {
  test('renders every hero line at once with reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const hidden = await page
      .locator('.term-out')
      .evaluateAll((nodes) => nodes.filter((n) => getComputedStyle(n).visibility !== 'visible').length)
    expect(hidden).toBe(0)
    await expect(page.locator('.term-out')).toHaveCount(4)
  })

  test('types in and reveals every line with motion', async ({ page }) => {
    await page.goto('/')
    await expect
      .poll(
        () =>
          page
            .locator('.term-out')
            .evaluateAll((nodes) => nodes.filter((n) => getComputedStyle(n).visibility !== 'visible').length),
        { timeout: 5000 }
      )
      .toBe(0)
  })

  test('j and k move focus through the page; fields still type', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/')
    const stops = page.locator('[data-nav-stop]')
    await page.keyboard.press('j')
    await expect(stops.nth(0)).toBeFocused()
    await expect(stops.nth(0)).toHaveAttribute('data-nav-current', '')
    await page.keyboard.press('j')
    await expect(stops.nth(1)).toBeFocused()
    await page.keyboard.press('k')
    await expect(stops.nth(0)).toBeFocused()

    const name = page.getByLabel('Name', { exact: true })
    await name.fill('')
    await name.press('j')
    await expect(name).toHaveValue('j')
    await expect(name).toBeFocused()
  })
})
```

- [ ] **Step 2: Build and run to verify they fail**

Run: `npm run build && npx playwright test e2e/terminal-theme.spec.ts -g "homepage terminal" --project=chromium`
Expected: FAIL. `.term-out` has count 0 and there is no `[data-nav-stop]`.

- [ ] **Step 3: Write the hero**

`src/components/terminal-hero.tsx`:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { StatusLine } from '@/components/status-line'
import { roles, site } from '@/content/site'

export type HeroProject = { slug: string; label: string; title: string; summary: string }

// Keep in step with `* 35ms` in terminal-home.css.
const CHAR_MS = 35
const GAP_MS = 250

function schedule(commands: readonly string[]) {
  let at = 0
  return commands.map((command) => {
    const style = { '--delay': `${at}ms`, '--chars': command.length } as CSSProperties
    at += command.length * CHAR_MS + GAP_MS
    return style
  })
}

function Step({ command, style, children }: { command: string; style: CSSProperties; children: ReactNode }) {
  return (
    <div className="term-step" style={style}>
      <p className="term-cmd" aria-hidden="true">
        <span className="term-prompt">❯</span>
        <span className="term-typed">{command}</span>
      </p>
      <div className="term-out">{children}</div>
    </div>
  )
}

const swatchVars = ['--accent', '--kw', '--str', '--num', '--fn', '--ty']

export function TerminalHero({ work }: { work: readonly HeroProject[] }) {
  const commands = ['whoami', 'cat statement.txt', 'ls ~/work', '']
  const [who, statement, list, idle] = schedule(commands)
  const facts: [string, string][] = [
    ['role', site.role],
    ['clouds', roles[0].stack.join(' · ')],
    // Taken from the About copy and the current role; no new claims.
    ['focus', 'CI/CD · Kubernetes · Terraform'],
    ['works', roles[0].where],
  ]

  return (
    <section className="wrap terminal-hero" aria-labelledby="home-title">
      <div className="term-session">
        <Step command={commands[0]} style={who}>
          <h1 id="home-title" className="term-name">
            <span>Sushant</span> <span>Sonbarse</span>
          </h1>
          <p className="term-meta">
            {site.role} · <span>Available for remote freelance work</span>
          </p>
        </Step>
        <Step command={commands[1]} style={statement}>
          <p className="term-statement">I build systems for the day things break.</p>
        </Step>
        <Step command={commands[2]} style={list}>
          <ul className="term-ls">
            {work.map((project) => (
              <li key={project.slug}>
                <Link href={`/work/${project.slug}`} prefetch={false} data-nav-stop="">
                  <span className="term-slug">{project.slug}/</span>
                  <span className="term-note">{project.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="term-actions">
            <Link href="#work" className="term-action" data-nav-stop="">
              See the work <span aria-hidden="true">→</span>
            </Link>
            <Link href="/resume" className="term-action" data-nav-stop="">
              View résumé <span aria-hidden="true">↗</span>
            </Link>
          </p>
        </Step>
        <div className="term-step" style={idle}>
          <p className="term-out term-cmd" aria-hidden="true">
            <span className="term-prompt">❯</span>
            <span className="term-cursor" />
          </p>
        </div>
      </div>

      <div className="fetch-panel">
        <picture className="fetch-portrait">
          <source media="(max-width: 620px)" srcSet="/assets/phase-five/sushant-mobile.webp" />
          <Image
            src="/assets/phase-five/sushant.webp"
            alt="Portrait of Sushant Sonbarse"
            width={710}
            height={1024}
            sizes="(max-width: 620px) 40vw, 220px"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="fetch-facts">
          <p className="fetch-host" aria-hidden="true">
            sushant@sonbarse
          </p>
          <dl>
            {facts.map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="fetch-swatches" aria-hidden="true">
            {swatchVars.map((name) => (
              <i key={name} style={{ background: `var(${name})` }} />
            ))}
          </p>
        </div>
      </div>

      <StatusLine className="hero-status" path="~/sushant" hint="j/k move · enter open · : command" />
    </section>
  )
}
```

The `idle` step has 0 characters, so it only uses `.term-out`'s reveal and never the typing animation, which would have `steps(0)`. That gives 4 `.term-out` elements in total: who, statement, list and idle.

- [ ] **Step 4: Write the homepage keys**

`src/components/home-keys.tsx`:

```tsx
'use client'

import { useEffect } from 'react'
import { hasModifier, isTypingTarget, nextIndex } from '@/lib/keys'

/** j/k move focus through [data-nav-stop] links on the homepage. */
export function HomeKeys() {
  useEffect(() => {
    let current = -1
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'j' && event.key !== 'k') return
      if (hasModifier(event) || isTypingTarget(event.target)) return
      if (document.querySelector('dialog[open]')) return

      const stops = Array.from(document.querySelectorAll<HTMLElement>('[data-nav-stop]')).filter(
        (stop) => getComputedStyle(stop).visibility === 'visible'
      )
      const focused = stops.indexOf(document.activeElement as HTMLElement)
      current = nextIndex(focused >= 0 ? focused : current, event.key === 'j' ? 1 : -1, stops.length)
      if (current < 0) return

      event.preventDefault()
      stops.forEach((stop, index) => stop.toggleAttribute('data-nav-current', index === current))
      const target = stops[current]
      target.focus({ preventScroll: true })
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      target.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' })
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return null
}
```

- [ ] **Step 5: Rewrite `src/app/page.tsx`**

Replace the whole file with:

```tsx
import Image from 'next/image'
import Link from 'next/link'
import { ContactForm } from '@/components/contact-form'
import { HomeKeys } from '@/components/home-keys'
import { ProjectArtwork } from '@/components/project-artwork'
import { TerminalHero, type HeroProject } from '@/components/terminal-hero'
import { roles, site } from '@/content/site'
import { pageMetadata } from '@/lib/metadata'
import './terminal-home.css'

export const metadata = pageMetadata('/')

const profileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: `${site.url}/`,
  mainEntity: {
    '@type': 'Person',
    '@id': `${site.url}/#sushant-sonbarse`,
    name: site.name,
    jobTitle: site.role,
    url: `${site.url}/`,
    image: `${site.url}/assets/images/profile.jpg`,
    sameAs: [site.github, site.linkedin],
  },
}

const selectedWork: readonly HeroProject[] = [
  {
    slug: 'azure-internal-access',
    label: 'Azure · Private networking',
    title: 'Internal access on Azure',
    summary: 'A private route to internal applications with Microsoft Entra ID at the boundary.',
  },
  {
    slug: 'crm-on-eks',
    label: 'HisanLabs · Kubernetes',
    title: '35+ microservices on AWS EKS',
    summary: 'A Terraform-managed AWS deployment for an Angular and Spring Boot CRM.',
  },
  {
    slug: 'aws-hosting-and-sso',
    label: 'AWS · Hosting and identity',
    title: 'AWS hosting with enterprise SSO',
    summary:
      'Static hosting and enterprise sign-in, with delivery and identity handled separately.',
  },
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>
}

function BufferPath({ children }: { children: string }) {
  return (
    <p className="buffer-path" aria-hidden="true">
      {children}
    </p>
  )
}

export default function Home() {
  return (
    <main className="editorial-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd).replace(/</g, '\\u003c') }}
      />
      <HomeKeys />
      <TerminalHero work={selectedWork} />

      <section className="wrap editorial-section editorial-work" aria-labelledby="work">
        <BufferPath>~/sushant/work/</BufferPath>
        <div className="editorial-heading">
          <div>
            <p className="editorial-label">Case studies</p>
            <h2 id="work" className="editorial-title">
              Selected work
            </h2>
          </div>
          <Link href="/work" className="editorial-link" data-nav-stop="">
            All projects <Arrow />
          </Link>
        </div>
        <div className="editorial-projects">
          {selectedWork.map((project, i) => (
            <article className="editorial-project" key={project.slug}>
              <Link
                href={`/work/${project.slug}`}
                className="editorial-project-link"
                prefetch={false}
              >
                <ProjectArtwork slug={project.slug} />
                <div className="editorial-project-copy">
                  <p className="editorial-label">{project.label}</p>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <span className="editorial-project-arrow">
                    <Arrow diagonal />
                  </span>
                </div>
              </Link>
              {i === 0 && (
                <p className="editorial-image-note">Project covers are conceptual illustrations.</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="editorial-about" aria-labelledby="about-title">
        <div className="wrap editorial-about-inner">
          <BufferPath>~/sushant/about.md</BufferPath>
          <p className="editorial-label">About me</p>
          <h2 id="about-title" className="editorial-title">
            From computer science to production.
          </h2>
          <div className="editorial-about-copy">
            <p>
              I came to DevOps through computer science and hands-on cloud training. At HisanLabs, I
              put that into practice by deploying a CRM on EKS and automating its AWS infrastructure
              with Terraform.
            </p>
            <p>
              I now work with teams on CI/CD, cloud infrastructure, and Kubernetes. I start by
              asking what can fail, what the team will be able to see, and how they’ll recover.
            </p>
            <div id="capabilities" className="editorial-about-links">
              <Link href="/atlas" className="editorial-link" data-nav-stop="">
                Read the field guide <Arrow />
              </Link>
              <Link href="/lab/studio#capabilities" className="editorial-link">
                Explore the tools in context <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap editorial-section editorial-experience" aria-labelledby="record">
        <BufferPath>~/sushant/git log --career</BufferPath>
        <div className="editorial-heading">
          <h2 id="record" className="editorial-title">
            Experience
          </h2>
          <Link href="/resume" className="editorial-link" data-nav-stop="">
            Full résumé <Arrow diagonal />
          </Link>
        </div>
        <ol className="editorial-roles">
          {roles.map((role) => (
            <li key={role.title} className="editorial-role">
              <p className="editorial-role-date">{role.when}</p>
              <div>
                <h3>{role.title}</h3>
                <p className="editorial-org">
                  {role.org} · {role.where}
                </p>
              </div>
              <div className="editorial-role-detail">
                {role.current ? (
                  <p>
                    I set up and improve CI/CD pipelines, design cloud infrastructure, and help
                    teams run workloads on Kubernetes.
                  </p>
                ) : (
                  <>
                    <p>
                      I deployed a CRM with 35+ microservices and automated its AWS infrastructure
                      with Terraform. Deployment time went from two hours to 30 minutes and CI/CD
                      pipeline efficiency improved by 40% during the internship.
                    </p>
                    <Link href="/work/crm-on-eks" className="editorial-link">
                      Read the HisanLabs case study <Arrow />
                    </Link>
                  </>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="editorial-lab" aria-labelledby="lab-title">
        <div className="wrap editorial-lab-inner">
          <div className="editorial-lab-copy">
            <BufferPath>~/sushant/lab/</BufferPath>
            <p className="editorial-label">Interactive experiments</p>
            <h2 id="lab-title" className="editorial-title">
              The lab
            </h2>
            <p>
              Follow a release to production, take an availability zone offline, or see how an
              identity policy makes a decision.
            </p>
            <Link href="/lab" className="editorial-link" data-nav-stop="">
              Explore the lab <Arrow />
            </Link>
            <ul className="editorial-lab-links">
              <li id="pipeline">
                <Link href="/lab/studio#pipeline">Release pipeline</Link>
              </li>
              <li id="break-it">
                <Link href="/lab/studio#break-it">Recovery exercise</Link>
              </li>
            </ul>
          </div>
          <picture className="editorial-lab-image">
            <source media="(max-width: 620px)" srcSet="/assets/phase-five/joint-mobile.webp" />
            <Image
              src="/assets/phase-five/joint.webp"
              alt=""
              width={1280}
              height={720}
              sizes="(max-width: 620px) 90vw, (max-width: 1200px) 46vw, 690px"
            />
          </picture>
        </div>
      </section>

      <section
        className="wrap editorial-section contact-section editorial-contact"
        aria-labelledby="contact"
      >
        <div>
          <BufferPath>~/sushant/contact.sh</BufferPath>
          <p className="editorial-label">Contact</p>
          <h2 id="contact" className="editorial-title">
            Let’s talk infrastructure.
          </h2>
          <p className="editorial-contact-note">
            Tell me what you’re building or what’s slowing your team down.
          </p>
          <div className="editorial-contact-links">
            <Link href="/freelance" className="editorial-link" data-nav-stop="">
              Freelance services <Arrow />
            </Link>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link"
            >
              LinkedIn <Arrow diagonal />
            </a>
          </div>
        </div>
        <ContactForm />
      </section>
    </main>
  )
}
```

- [ ] **Step 6: Write `src/app/terminal-home.css` and delete `editorial.css`**

`src/app/terminal-home.css`:

```css
/* Homepage: terminal hero, then buffers. */
.editorial-home {
  --buffer-rule: rgb(var(--rule) / 0.3);
}

/* ---- Terminal hero ---- */
.terminal-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) minmax(15rem, 1fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: start;
  min-height: calc(100svh - 4.25rem);
  padding-block-start: clamp(2rem, 6vh, 4.5rem);
  font-family: var(--font-mono), ui-monospace, monospace;
}

.term-session {
  display: grid;
  gap: 1.35rem;
  min-width: 0;
}

.term-cmd {
  font-size: 0.875rem;
}

.term-prompt {
  margin-inline-end: 1ch;
  color: var(--kw);
}

/* 35ms per character: keep in step with CHAR_MS in terminal-hero.tsx. */
.term-typed {
  display: inline-block;
  vertical-align: bottom;
  white-space: pre;
  clip-path: inset(0 100% 0 0);
  animation: term-type calc(var(--chars) * 35ms) steps(var(--chars), end) var(--delay) forwards;
}

.term-out {
  margin-top: 0.4rem;
  visibility: hidden;
  animation: term-reveal 1ms linear calc(var(--delay) + var(--chars) * 35ms + 120ms) forwards;
}

@keyframes term-type {
  to {
    clip-path: inset(0 0 0 0);
  }
}

@keyframes term-reveal {
  to {
    visibility: visible;
  }
}

.term-name {
  font: 600 clamp(2.1rem, 6.2vw, 4.6rem) / 1.02 var(--font-mono), ui-monospace, monospace;
  letter-spacing: -0.04em;
}

.term-name span {
  display: inline-block;
}

.term-meta {
  margin-top: 0.5rem;
  color: rgb(var(--muted));
  font-size: 0.875rem;
}

.term-statement {
  max-width: 34ch;
  font-family: var(--font-display), system-ui, sans-serif;
  font-size: clamp(1.15rem, 1.8vw, 1.5rem);
  line-height: 1.4;
}

.term-ls {
  display: grid;
  gap: 0.15rem;
  font-size: 0.875rem;
}

.term-ls a {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0 2ch;
  min-height: 2.75rem;
  padding-inline: 0.6rem;
}

.term-ls a:hover,
[data-nav-current] {
  box-shadow: inset 3px 0 0 var(--accent);
  background: rgb(var(--panel));
}

.term-slug {
  color: var(--fn);
}

.term-note {
  color: rgb(var(--muted));
}

.term-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-top: 1rem;
}

.term-action {
  display: inline-flex;
  align-items: center;
  gap: 0.75ch;
  min-height: 2.75rem;
  padding-inline: 0.9rem;
  border: 1px solid rgb(var(--rule) / 0.5);
  font-size: 0.875rem;
  transition:
    border-color var(--fast) var(--ease),
    color var(--fast) var(--ease);
}

.term-action:first-child {
  border-color: var(--action);
  background: var(--action);
  color: var(--action-ink);
}

.term-action:hover {
  border-color: var(--accent);
}

.term-action:first-child:hover {
  background: var(--action-hover);
}

.term-cursor {
  display: inline-block;
  width: 1ch;
  height: 1.15em;
  vertical-align: text-bottom;
  background: var(--accent);
  animation: term-blink 1.06s steps(1) infinite;
}

@keyframes term-blink {
  50% {
    opacity: 0;
  }
}

.fetch-panel {
  display: grid;
  grid-template-columns: minmax(6rem, 42%) minmax(0, 1fr);
  gap: 1rem;
  padding: 1rem;
  border: 1px solid rgb(var(--rule) / 0.4);
  font-size: 0.8125rem;
}

.fetch-portrait img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 710 / 1024;
  object-fit: cover;
  filter: grayscale(1) contrast(1.05);
}

.fetch-host {
  color: var(--accent);
}

.fetch-host::after {
  content: '';
  display: block;
  margin-block: 0.4rem;
  border-bottom: 1px solid rgb(var(--rule) / 0.5);
}

.fetch-facts dl {
  display: grid;
  gap: 0.25rem;
}

.fetch-facts dl div {
  display: grid;
  grid-template-columns: 7ch minmax(0, 1fr);
  gap: 1ch;
}

.fetch-facts dt {
  color: var(--kw);
}

.fetch-swatches {
  display: flex;
  margin-top: 0.75rem;
}

.fetch-swatches i {
  width: 1.5rem;
  height: 0.9rem;
}

.hero-status {
  grid-column: 1 / -1;
  align-self: end;
  margin-top: clamp(1.5rem, 5vh, 3rem);
}

@media (prefers-reduced-motion: reduce) {
  .term-typed {
    clip-path: none;
    animation: none;
  }
  .term-out {
    visibility: visible;
    animation: none;
  }
}

/* ---- Buffers ---- */
.editorial-section {
  padding-block: var(--section-space);
}

.buffer-path {
  margin-bottom: clamp(1.25rem, 3vw, 2.25rem);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--buffer-rule);
  color: rgb(var(--muted));
  font: 400 0.8125rem / 1.5 var(--font-mono), ui-monospace, monospace;
}

.editorial-heading {
  display: flex;
  flex-wrap: wrap;
  align-items: end;
  justify-content: space-between;
  gap: 1rem 2rem;
  margin-bottom: clamp(1.5rem, 3.5vw, 2.75rem);
}

.editorial-label {
  color: rgb(var(--muted));
  font: 500 0.8125rem / 1.5 var(--font-mono), ui-monospace, monospace;
}

.editorial-label::before {
  content: '// ';
  content: '// ' / '';
}

.editorial-title {
  font: 600 clamp(1.9rem, 4vw, 3.4rem) / 1.05 var(--font-mono), ui-monospace, monospace;
  letter-spacing: -0.03em;
}

.editorial-title::before {
  content: '## ';
  content: '## ' / '';
  color: rgb(var(--muted));
  font-weight: 400;
}

.editorial-label + .editorial-title {
  margin-top: 0.4rem;
}

.editorial-link {
  display: inline-flex;
  align-items: center;
  gap: 0.6ch;
  width: fit-content;
  min-height: 2.75rem;
  font: 500 0.875rem / 1.3 var(--font-mono), ui-monospace, monospace;
  text-decoration: underline;
  text-underline-offset: 0.3em;
}

.editorial-link span {
  color: var(--accent);
}

.editorial-link:hover {
  color: var(--accent);
}

.editorial-projects {
  display: grid;
  border-top: 1px solid var(--buffer-rule);
}

.editorial-project {
  border-bottom: 1px solid var(--buffer-rule);
}

.editorial-project-link {
  display: grid;
  grid-template-columns: minmax(10rem, 22rem) minmax(0, 1fr);
  gap: clamp(1rem, 3vw, 2.5rem);
  align-items: center;
  padding-block: clamp(1rem, 2.5vw, 1.75rem);
}

.editorial-project-copy {
  position: relative;
  display: grid;
  gap: 0.45rem;
  padding-inline-end: 2.5rem;
}

.editorial-project-copy h3 {
  font: 600 clamp(1.25rem, 2.3vw, 1.9rem) / 1.15 var(--font-mono), ui-monospace, monospace;
  letter-spacing: -0.02em;
  transition: color var(--fast) var(--ease);
}

.editorial-project-copy > p:not(.editorial-label) {
  max-width: 60ch;
  color: rgb(var(--muted));
}

.editorial-project-arrow {
  position: absolute;
  inset-block-start: 0;
  inset-inline-end: 0;
  color: var(--accent);
  font-size: 1.25rem;
}

.editorial-project-link:hover h3 {
  color: var(--accent);
}

.editorial-image-note {
  margin-block: 0.5rem 0;
  color: rgb(var(--muted));
  font: 400 0.75rem / 1.4 var(--font-mono), ui-monospace, monospace;
}

.editorial-about {
  padding-block: var(--section-space);
  border-block: 1px solid var(--buffer-rule);
  background: rgb(var(--panel));
}

.editorial-about-copy {
  display: grid;
  gap: 1rem;
  max-width: 64ch;
  margin-top: 1.5rem;
  font-size: 1.0625rem;
}

.editorial-about-links,
.editorial-contact-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 2rem;
}

.editorial-roles {
  display: grid;
  border-top: 1px solid var(--buffer-rule);
}

.editorial-role {
  display: grid;
  grid-template-columns: 14ch minmax(0, 1fr) minmax(0, 1.3fr);
  gap: 1rem clamp(1rem, 3vw, 3rem);
  padding-block: 1.5rem;
  border-bottom: 1px solid var(--buffer-rule);
}

.editorial-role-date {
  color: var(--str);
  font: 400 0.8125rem / 1.5 var(--font-mono), ui-monospace, monospace;
}

.editorial-role h3 {
  color: var(--fn);
  font: 600 1.125rem / 1.3 var(--font-mono), ui-monospace, monospace;
}

.editorial-org {
  color: rgb(var(--muted));
  font-size: 0.9375rem;
}

.editorial-role-detail {
  display: grid;
  gap: 0.5rem;
}

.editorial-lab {
  padding-block: var(--section-space);
  border-top: 1px solid var(--buffer-rule);
}

.editorial-lab-inner {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: center;
}

.editorial-lab-copy {
  display: grid;
  gap: 1rem;
  justify-items: start;
}

.editorial-lab-copy > .buffer-path {
  justify-self: stretch;
  margin-bottom: 0;
}

.editorial-lab-copy > p:not(.editorial-label, .buffer-path) {
  max-width: 46ch;
  color: rgb(var(--muted));
}

.editorial-lab-links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 1.5rem;
  font: 400 0.875rem / 1.3 var(--font-mono), ui-monospace, monospace;
}

.editorial-lab-links a {
  display: inline-flex;
  align-items: center;
  min-height: 2.75rem;
  text-decoration: underline;
  text-underline-offset: 0.3em;
}

.editorial-lab-image img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--buffer-rule);
}

.editorial-contact {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: clamp(1.5rem, 5vw, 5rem);
  align-items: start;
}

.editorial-contact-note {
  max-width: 40ch;
  margin-block: 1rem;
  color: rgb(var(--muted));
}

.editorial-contact form label > span:first-child {
  font-family: var(--font-mono), ui-monospace, monospace;
}

.editorial-contact form label > span:first-child::before {
  content: '$ ';
  content: '$ ' / '';
  color: var(--kw);
}

@media (max-width: 760px) {
  .terminal-hero,
  .editorial-project-link,
  .editorial-role,
  .editorial-lab-inner,
  .editorial-contact {
    grid-template-columns: minmax(0, 1fr);
  }

  .terminal-hero {
    min-height: 0;
  }
}
```

Then delete the old stylesheet: `git rm -q src/app/editorial.css`

- [ ] **Step 7: Build and run the tests to verify they pass**

Run: `npm run type-check && npm run lint && npm run build && npx playwright test e2e/terminal-theme.spec.ts e2e/navigation.spec.ts --project=chromium`
Expected: all pass. This includes the existing homepage, "every route" and responsive-width tests. If the 320px "name fits" check fails, lower the `.term-name` minimum from `2.1rem` to `1.9rem` and re-run.

- [ ] **Step 8: Check it by eye**

Run `npx --yes serve@14 out -l 3000`, open `http://localhost:3000`, and check:
- the commands type in over about 2 seconds
- the portrait panel is on the right
- the status line closes the hero
- `j`/`k` walk the links
- at 390px wide, the hero stacks with the session above the panel

- [ ] **Step 9: Commit**

```bash
git add -A src/components/terminal-hero.tsx src/components/home-keys.tsx src/app/page.tsx src/app/terminal-home.css src/app/editorial.css e2e/terminal-theme.spec.ts
git commit -m "feat: rebuild the homepage as a terminal hero and buffers"
```

---

### Task 10: Inner pages and the Studio type

**Files:**
- Modify: `src/app/work/case-study.css`, `src/app/lab/studio/studio.css`, `src/components/deployment-map.tsx`

- [ ] **Step 1: Swap the case-study serif for mono**

```bash
sed -i '' 's/--reading-serif/--reading-display/g' src/app/work/case-study.css
```

Then, in `src/app/work/case-study.css`:
- change line 3 to `--reading-display: var(--font-mono), ui-monospace, monospace;`
- in the `.work-index h1, .case-masthead h1` rule, change `font-weight: 400;` to `font-weight: 600;` and `letter-spacing: -0.045em;` to `letter-spacing: -0.04em;`
- change `.work-index h1 { font-size: clamp(5rem, 13.8vw, 13rem); }` to `font-size: clamp(3.2rem, 9vw, 8rem);`

Mono glyphs are about 30% wider than Newsreader. The responsive test in Step 4 shows whether other headings need smaller sizes.

- [ ] **Step 2: Rewrite `src/app/lab/studio/studio.css`**

The Studio now follows the palette, so remove the local accent overrides.

```css
.engineering-studio .scene-hero {
  color: rgb(var(--ink));
  background: radial-gradient(ellipse at 73% 38%, rgb(var(--panel)), rgb(var(--paper)) 70%);
}

.engineering-studio .hero-name {
  max-width: 10ch;
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: clamp(2.8rem, 6vw, 6.5rem);
  line-height: 0.98;
  letter-spacing: -0.05em;
  font-weight: 600;
}

.engineering-studio .scene-hero-footer {
  align-items: center;
}
```

- [ ] **Step 3: Recolour the deployment map with palette variables**

SVG presentation attributes cannot take `var()`, so use `style`. In `src/components/deployment-map.tsx`:
- line 82: replace `stroke="#a8bf9d"` with `style={{ stroke: 'rgb(var(--rule))' }}`
- lines 85-86: replace each `stopColor="#9cec78"` with `style={{ stopColor: 'var(--kw)' }}`, keeping the `stopOpacity` and `offset` attributes

- [ ] **Step 4: Verify**

Run: `npm run type-check && npm run build && npx playwright test e2e/navigation.spec.ts e2e/architecture-trace.spec.ts --project=chromium --project=mobile`
Expected: all pass. If a responsive overflow names a heading, reduce that heading's `clamp()` maximum and minimum by 20% in `case-study.css` and re-run. Use the same check to confirm nothing still references the old font:

```bash
grep -rn "font-editorial\|editorial-serif\|reading-serif" src
```

Expected: no output.

- [ ] **Step 5: Commit**

```bash
git add src/app/work/case-study.css src/app/lab/studio/studio.css src/components/deployment-map.tsx
git commit -m "feat: set case-study and Studio titles in mono"
```

---

### Task 11: Replace hard-coded colours with palette variables

**Files:**
- Create: `src/__tests__/hex-colours.test.ts`
- Modify: `src/app/cinema.css`, `src/app/flagship.css`, `src/app/phase-three.css`, `src/app/catalog.css`, `src/app/work/case-study.css`
- Temporary (not committed): `scripts/tokenize-hex.mjs`

- [ ] **Step 1: Write the failing test**

`src/__tests__/hex-colours.test.ts`:

```ts
import { readdirSync, readFileSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g
const root = path.resolve(__dirname, '..')

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = path.join(dir, name)
    return statSync(full).isDirectory() ? walk(full) : [full]
  })
}

/** Hex colours in CSS declarations, skipping @media print blocks and mask declarations. */
export function cssOffenders(css: string): string[] {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const found: string[] = []
  let depth = 0
  let printDepth = -1
  let buffer = ''
  const check = (declaration: string) => {
    if (printDepth >= 0 || /^\s*(-webkit-)?mask/.test(declaration)) return
    found.push(...(declaration.match(HEX) ?? []))
  }
  for (const char of text) {
    if (char === '{') {
      if (printDepth < 0 && /@media\s+print/.test(buffer)) printDepth = depth
      depth++
      buffer = ''
    } else if (char === '}') {
      check(buffer)
      depth--
      if (depth === printDepth) printDepth = -1
      buffer = ''
    } else if (char === ';') {
      check(buffer)
      buffer = ''
    } else {
      buffer += char
    }
  }
  return found
}

describe('cssOffenders', () => {
  it('finds hex in declarations but not selectors, print blocks or masks', () => {
    const css = `#content:focus{color:#fff}
      .a{mask-image:linear-gradient(#000, transparent)}
      @media print{.b{color:#000}}
      .c{background:#12345678}`
    expect(cssOffenders(css)).toEqual(['#fff', '#12345678'])
  })
})

describe('no hard-coded colours', () => {
  const files = walk(root).filter((file) => /\.(css|tsx)$/.test(file))

  for (const file of files) {
    const relative = path.relative(root, file)
    it(relative, () => {
      const source = readFileSync(file, 'utf8')
      const offenders = file.endsWith('.css')
        ? cssOffenders(source)
        : (source.match(/(["'`])#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\1/g) ?? [])
      expect(offenders).toEqual([])
    })
  }
})
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npx vitest run src/__tests__/hex-colours.test.ts`
Expected: the `cssOffenders` unit test PASSES. The files `app/cinema.css`, `app/flagship.css`, `app/phase-three.css`, `app/catalog.css`, `app/finder.css` and `app/work/case-study.css` FAIL with their hex lists. `app/finder.css` may already pass after Task 7.

- [ ] **Step 3: Write the one-off codemod**

`scripts/tokenize-hex.mjs`. Don't commit this file.

```js
// One-off: map hard-coded Studio colours onto palette variables by lightness and hue.
// Usage: node scripts/tokenize-hex.mjs <file.css>...
import { readFileSync, writeFileSync } from 'node:fs'

const HEX = /#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3,4})\b/g

function parse(hex) {
  let s = hex.slice(1)
  if (s.length <= 4) s = [...s].map((c) => c + c).join('')
  const rgb = [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16))
  const alpha = s.length === 8 ? parseInt(s.slice(6, 8), 16) / 255 : 1
  return { rgb, alpha }
}

function hsl([r, g, b]) {
  ;[r, g, b] = [r / 255, g / 255, b / 255]
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  const d = max - min
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1))
  let h = 0
  if (d) {
    if (max === r) h = ((g - b) / d) % 6
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h *= 60
    if (h < 0) h += 360
  }
  return { h, s, l }
}

function token(rgb) {
  const { h, s, l } = hsl(rgb)
  if (l < 0.09) return 'rgb(var(--paper))'
  if (l < 0.2) return 'rgb(var(--panel))'
  if (s > 0.45 && l > 0.45 && h >= 60 && h < 140) return 'var(--kw)'
  if (s > 0.45 && l > 0.45 && (h < 50 || h >= 330)) return 'var(--num)'
  if (l > 0.78) return 'rgb(var(--ink))'
  if (l > 0.5) return 'rgb(var(--muted))'
  return 'rgb(var(--rule))'
}

function convert(hex) {
  const { rgb, alpha } = parse(hex)
  const t = token(rgb)
  return alpha >= 0.999 ? t : `color-mix(in srgb, ${t} ${Math.round(alpha * 100)}%, transparent)`
}

for (const file of process.argv.slice(2)) {
  let inMask = false
  const out = readFileSync(file, 'utf8')
    .split('\n')
    .map((line) => {
      if (/^\s*(-webkit-)?mask[\w-]*\s*:/.test(line)) inMask = true
      const next = inMask ? line : line.replace(HEX, convert)
      if (inMask && line.includes(';')) inMask = false
      return next
    })
    .join('\n')
  writeFileSync(file, out)
  console.log(`tokenized ${file}`)
}
```

- [ ] **Step 4: Run it, then review the diff**

```bash
node scripts/tokenize-hex.mjs src/app/cinema.css src/app/flagship.css src/app/phase-three.css src/app/catalog.css src/app/finder.css src/app/work/case-study.css
rm scripts/tokenize-hex.mjs
npx prettier --check "src/app/**/*.css" || npx prettier --write "src/app/**/*.css"
git diff --stat
npx vitest run src/__tests__/hex-colours.test.ts
```

Expected:
- `git diff --stat` lists only those 6 CSS files.
- The vitest run passes for every file.
- `grep -n "#000" src/app/flagship.css src/app/phase-three.css` still shows the 4 mask lines, unchanged.

- [ ] **Step 5: Check the Studio by eye in two palettes**

```bash
npm run build
npx --yes serve@14 out -l 3000
```

Open `http://localhost:3000/lab/studio` and check it in Blackmoney, then switch with `:theme paper` and check again. In both:
- controls stay legible
- highlights use the palette's keyword colour instead of lime
- the 3D rack is intentionally unchanged and sits in its frame

Fix any rule that reads wrongly by hand, using palette variables only.

- [ ] **Step 6: Run the full suites**

Run: `npm test && npx playwright test --project=chromium`
Expected: all pass.

- [ ] **Step 7: Commit**

```bash
git add src/app/cinema.css src/app/flagship.css src/app/phase-three.css src/app/catalog.css src/app/finder.css src/app/work/case-study.css src/__tests__/hex-colours.test.ts
git commit -m "feat: drive Studio and catalog colours from the palette"
```

---

### Task 12: Paper accessibility sweep and print check

**Files:**
- Create: `e2e/routes.ts`
- Modify: `e2e/navigation.spec.ts:1-18`, `e2e/terminal-theme.spec.ts`

- [ ] **Step 1: Share the route list**

`e2e/routes.ts`:

```ts
import { labs } from '../src/content/labs'
import { projects } from '../src/content/projects'
import { services } from '../src/content/services'

export const routes = [
  '/',
  '/work',
  '/lab',
  '/lab/studio',
  '/atlas',
  '/freelance',
  '/resume',
  ...projects.map((p) => `/work/${p.slug}`),
  ...labs.map((l) => `/lab/${l.slug}`),
  ...services.map((s) => `/services/${s.id}`),
]
```

In `e2e/navigation.spec.ts`, replace lines 3-18 (the three content imports and the `const routes = [...]` block) with:

```ts
import { routes } from './routes'
```

- [ ] **Step 2: Add the Paper sweep and the print check**

Append to `e2e/terminal-theme.spec.ts`:

```ts
import { routes } from './routes'

test.describe('every route in the Paper palette', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('palette', 'paper'))
  })

  for (const route of routes) {
    test(`${route} has no a11y violations in Paper`, async ({ page }) => {
      await page.goto(route, { waitUntil: 'networkidle' })
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'paper')
      const axe = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze()
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes[0].target}`)).toEqual([])
    })
  }
})

test('the résumé prints black on white in a dark palette', async ({ page }) => {
  await page.goto('/resume')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'blackmoney')
  await page.emulateMedia({ media: 'print' })
  const colours = await page.evaluate(() => {
    const style = getComputedStyle(document.body)
    return [style.backgroundColor, style.color]
  })
  expect(colours).toEqual(['rgb(255, 255, 255)', 'rgb(0, 0, 0)'])
})
```

Move the `import { routes } from './routes'` line to the top of the file with the other imports.

- [ ] **Step 3: Run the tests**

Run: `npm run build && npx playwright test e2e/terminal-theme.spec.ts e2e/navigation.spec.ts --project=chromium`
Expected: all pass.

- If a Paper route reports `color-contrast`, the failing node's colour is a hard-coded alpha mix from Task 11. Raise that `color-mix` percentage, or switch it to `rgb(var(--ink))` / `rgb(var(--muted))`, then re-run.
- Every axe failure should include its selector. Fix only that rule.

- [ ] **Step 4: Commit**

```bash
git add e2e/routes.ts e2e/navigation.spec.ts e2e/terminal-theme.spec.ts src/app
git commit -m "test: sweep every route in Paper and check résumé print colours"
```

---

### Task 13: Design record and final verification

**Files:**
- Create: `docs/phase-six.md`

- [ ] **Step 1: Write `docs/phase-six.md`**

```markdown
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

## Homepage

- The opening is a terminal: `whoami`, `cat statement.txt` and `ls ~/work` type in over about 2 seconds using CSS alone. Reduced motion shows everything at once.
- A neofetch-style panel holds the portrait.
- The sections below are framed as buffers.
- `j`/`k` walk the main links.
- `:` opens the finder as a command line (`:theme <name>`, `:work`, `:lab`, `:resume`, `:about`, `:contact`).

## Known exception

The Studio's WebGL rack keeps its own dark colours because they are written into the shader. Under Paper it reads as a framed dark image.

## Verification

- `npm test`: palettes, contrast, commands, keys, and no hard-coded hex outside the palettes, print blocks and masks.
- `npx playwright test`: the full route sweep and axe checks in Blackmoney and Paper, plus the picker, command line, homepage keys, typing and résumé print.
```

- [ ] **Step 2: Run the full verification**

```bash
npm run format:check && npm run lint && npm run type-check && npm test && npm run build && npx playwright test
```

Expected: every command exits 0, and Playwright reports all tests passed on both the `chromium` and `mobile` projects.

- [ ] **Step 3: Commit**

```bash
git add docs/phase-six.md
git commit -m "docs: record the phase six terminal theme"
```

---

## Self-review notes

- **Spec coverage:**

| Spec section | Task |
|---|---|
| §1 palettes, tokens, `next-themes` | 2, 3, 4 |
| §1 type | 4, 6, 9, 10 |
| §1 shape and motion | 4, 7 (finder), 9 |
| §2 hero, fetch panel, typing | 9 |
| §2 buffers | 9 |
| §2 keyboard | 5, 9 |
| §2 `:` command line | 5, 7 |
| §3 header and picker | 6 |
| §3 footer and path bar | 8 |
| §3 inner pages | 4 (type classes), 10 |
| §3 résumé print | 4, 12 |
| §3 Studio and remaining stylesheets | 10, 11 |
| Success criteria 1-7 | 3 (contrast), 11 (no hex), 12 (Paper sweep), 9 (h1/portrait/links, reduced motion), 12 (print) |

- **Refinements** (no Tailwind dark variant, CSS alternative-text prefixes, `data-nav-current`, unknown-command notice, single portrait, shared path bar, CSS-only typing) are recorded in the spec by Task 1.
- **Type consistency:** these names are used consistently across tasks:
  - `Palette`, `palettes`, `DEFAULT_PALETTE`, `findPalette`
  - `paletteVars`, `paletteCss`, `MIN_CONTRAST`
  - `parseCommand`, `Command`, `commandRoutes`
  - `isTypingTarget`, `hasModifier`, `nextIndex`
  - `HeroProject`, `TerminalHero`, `HomeKeys`, `StatusLine`, `PathBar`, `PalettePicker`
