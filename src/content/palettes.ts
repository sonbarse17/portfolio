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
