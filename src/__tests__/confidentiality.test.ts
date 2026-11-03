import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Client and internal system names must never be published. The list lives in this file, so this file
 * is the one place that is skipped. Add a name here when a new engagement should stay private.
 */
const PRIVATE =
  /shipiq|voycean|arcwood|ai approvals|ai-approvals|triggeraiworkflow|netsanchar|cargo|\bmms\b/i

const TEXT = /\.(ts|tsx|css|md|json|mjs|txt|xml)$/
const SKIP = new Set(['node_modules', '.next', 'out', '.git', 'test-results', 'package-lock.json'])

function walk(path: string): string[] {
  const name = path.split(/[\\/]/).at(-1)!
  if (SKIP.has(name)) return []
  if (statSync(path).isDirectory()) return readdirSync(path).flatMap((f) => walk(join(path, f)))
  return TEXT.test(path) ? [path] : []
}

describe('confidentiality', () => {
  const files = ['src', 'e2e', 'public', 'README.md', 'firebase.json', 'CONTRIBUTING.md']
    .flatMap(walk)
    .filter((f) => !f.endsWith('confidentiality.test.ts'))

  it('scans a meaningful number of files', () => {
    expect(files.length).toBeGreaterThan(40)
  })

  it('publishes no client or internal system names anywhere in the repository', () => {
    const hits = files.filter((f) => PRIVATE.test(readFileSync(f, 'utf8')))
    expect(hits).toEqual([])
  })

  it('does not name them in any URL either', () => {
    const slugs = files.filter((f) => /content[\\/]projects/.test(f)).map((f) => f)
    slugs.forEach((f) => expect(f).not.toMatch(PRIVATE))
  })
})
