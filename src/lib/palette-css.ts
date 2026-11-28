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
  throw new Error(`No colour reaches ${min}:1 toward ${rgbToHex(toward)}`)
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
    '--action-ink': rgbToHex(bg),
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
