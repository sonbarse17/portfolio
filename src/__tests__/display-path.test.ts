import { describe, expect, it } from 'vitest'
import { displayPath } from '@/lib/display-path'

describe('displayPath', () => {
  it('shows the root as a bare tilde', () => {
    expect(displayPath('/')).toBe('~')
  })

  it('prefixes routes with a tilde', () => {
    expect(displayPath('/work')).toBe('~/work')
  })

  it('drops a trailing slash', () => {
    expect(displayPath('/work/')).toBe('~/work')
  })
})
