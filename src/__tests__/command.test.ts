import { describe, expect, it } from 'vitest'
import { parseCommand } from '@/lib/command'

describe('parseCommand', () => {
  it('treats text without a leading colon as a search', () => {
    expect(parseCommand('azure')).toEqual({ kind: 'search' })
    expect(parseCommand('')).toEqual({ kind: 'search' })
  })

  it('resolves :theme to a palette by prefix, ignoring case', () => {
    expect(parseCommand(':theme paper')).toMatchObject({
      kind: 'theme',
      palette: { slug: 'paper' },
    })
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
