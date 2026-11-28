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
