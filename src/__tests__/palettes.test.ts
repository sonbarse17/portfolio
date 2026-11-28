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
