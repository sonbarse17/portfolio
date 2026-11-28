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
      expect(
        contrast(hexToRgb(vars['--action-ink']), hexToRgb(vars['--action']))
      ).toBeGreaterThanOrEqual(MIN_CONTRAST)
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
