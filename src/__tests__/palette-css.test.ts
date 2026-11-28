import { describe, expect, it } from 'vitest'
import { DEFAULT_PALETTE, palettes } from '@/content/palettes'
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

  it('throws when no colour on the way to the target reaches the minimum', () => {
    expect(() => ensureContrast([100, 100, 100], [[120, 120, 120]], [110, 110, 110])).toThrow(
      'No colour reaches'
    )
  })
})

describe('paletteVars', () => {
  it('blackmoney: maps every palette colour to the expected variable', () => {
    const blackmoney = palettes.find((p) => p.slug === 'blackmoney')!
    expect(paletteVars(blackmoney)).toEqual({
      '--paper': '11 11 10',
      '--panel': '17 17 15',
      '--ink': '235 230 219',
      '--muted': '131 127 115',
      '--rule': '78 77 73',
      '--signal': '240 136 91',
      '--ok': '127 209 160',
      '--warn': '230 195 122',
      '--accent': '#e7c58a',
      '--action': '#e7c58a',
      '--action-ink': '#0b0b0a',
      '--action-hover': '#e8ca96',
      '--kw': '#7fd1a0',
      '--str': '#e6c37a',
      '--num': '#f0885b',
      '--fn': '#8fd0ee',
      '--ty': '#c9a0e8',
    })
  })

  for (const palette of palettes) {
    it(`${palette.slug}: text colours reach ${MIN_CONTRAST}:1 on paper and panel`, () => {
      const vars = paletteVars(palette)
      const { bg, fg, cursorline } = palette.colors
      const asTriplet = (hex: string) => hexToRgb(hex).join(' ')
      expect(vars['--paper']).toBe(asTriplet(bg))
      expect(vars['--panel']).toBe(asTriplet(cursorline))
      expect(vars['--ink']).toBe(asTriplet(fg))
      expect(vars['--accent']).toBe(vars['--action'])
      expect(vars['--rule']).toBe(mix(hexToRgb(bg), hexToRgb(fg), 0.3).join(' '))
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
    const fallback = palettes.find((p) => p.slug === DEFAULT_PALETTE)!
    expect(
      css.startsWith(
        `:root{color-scheme:${fallback.tone};--paper:${paletteVars(fallback)['--paper']};`
      )
    ).toBe(true)
  })

  it('emits one attribute block per palette with its tone', () => {
    for (const palette of palettes) {
      expect(css).toContain(`:root[data-theme="${palette.slug}"]{color-scheme:${palette.tone};`)
    }
  })
})
