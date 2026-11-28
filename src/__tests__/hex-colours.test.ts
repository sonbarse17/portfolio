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
