import { describe, it, expect } from 'vitest'
import {
  capabilitiesAffectedBy,
  dependents,
  describeChange,
  evaluate,
  nodes,
  nodesIn,
  scenarioFailures,
  scenarios,
} from '@/lib/lab/topology'

const none = new Set<string>()

describe('failure propagation', () => {
  it('a DNS failure takes the site and the API down even though every server is healthy', () => {
    const { nodeState, capabilityState } = evaluate('prod', new Set(['dns']))
    expect(nodeState.edge).toBe('down')
    expect(nodeState.lb).toBe('down')
    expect(nodeState['app-a']).toBe('down')
    expect(nodeState['db-a']).toBe('ok')
    expect(capabilityState.site).toBe('down')
    expect(capabilityState.read).toBe('down')
  })

  it('an identity outage stops compute but not the static site', () => {
    const { capabilityState } = evaluate('prod', new Set(['secrets']))
    expect(capabilityState.write).toBe('down')
    expect(capabilityState.async).toBe('down')
    expect(capabilityState.site).toBe('ok')
  })

  it('losing the production database primary degrades writes, and in dev it stops them', () => {
    expect(evaluate('prod', new Set(['db-a'])).capabilityState.write).toBe('degraded')
    expect(evaluate('dev', new Set(['db-a'])).capabilityState.write).toBe('down')
  })

  it('every applicable scenario changes something, and dev offers at least five', () => {
    ;(['prod', 'dev'] as const).forEach((env) => {
      const applicable = scenarios.filter((s) => scenarioFailures(env, s).size > 0)
      expect(applicable.length, env).toBeGreaterThanOrEqual(5)
      applicable.forEach((s) => {
        const states = Object.values(evaluate(env, scenarioFailures(env, s)).nodeState)
        expect(
          states.some((h) => h !== 'ok'),
          `${s.id}/${env}`
        ).toBe(true)
      })
    })
  })

  it('the cache scenario does not apply in dev, where there is no cache', () => {
    const cache = scenarios.find((s) => s.id === 'cache')!
    expect(scenarioFailures('dev', cache).size).toBe(0)
    expect(scenarioFailures('prod', cache).size).toBe(1)
  })

  it('recovery restores full health', () => {
    scenarios.forEach((s) => {
      const failed = scenarioFailures('prod', s)
      expect(Object.values(evaluate('prod', none).nodeState).every((h) => h === 'ok')).toBe(true)
      const recovered = new Set(failed)
      failed.forEach((id) => recovered.delete(id))
      expect(Object.values(evaluate('prod', recovered).nodeState).every((h) => h === 'ok')).toBe(
        true
      )
    })
  })
})

describe('dependency chain', () => {
  it('lists everything downstream of a component, transitively', () => {
    const down = dependents('prod', 'dns')
    expect(down).toEqual(expect.arrayContaining(['edge', 'lb', 'app-a', 'app-b']))
    expect(down).not.toContain('dns')
    expect(down).not.toContain('db-a')
  })

  it('names the user-facing capabilities that lose something', () => {
    expect(capabilitiesAffectedBy('prod', 'db-a').map((c) => c.id)).toEqual(
      expect.arrayContaining(['write', 'async'])
    )
    expect(capabilitiesAffectedBy('prod', 'static').map((c) => c.id)).toEqual(['site'])
  })

  it('every component has a recovery action and a failure explanation', () => {
    nodes.forEach((n) => {
      expect(n.recovery.length, n.id).toBeGreaterThan(10)
      expect(n.onFailure.length, n.id).toBeGreaterThan(10)
    })
  })
})

describe('event log', () => {
  it('records the failure, then each capability that changed', () => {
    const log = describeChange('prod', none, new Set(['db-a']))
    expect(log[0]).toEqual({ kind: 'fail', text: 'DB primary (zone A) failed' })
    expect(
      log.some((e) => e.kind === 'effect' && /Write data: Healthy to Degraded/.test(e.text))
    ).toBe(true)
  })

  it('records a recovery as a recovery', () => {
    const log = describeChange('prod', new Set(['db-a']), none)
    expect(log[0].kind).toBe('recover')
    expect(log.some((e) => /Write data: Degraded to Healthy/.test(e.text))).toBe(true)
  })

  it('records nothing when nothing changed', () => {
    expect(describeChange('prod', new Set(['cache']), new Set(['cache']))).toEqual([])
  })

  it('dev has no zone B components to fail', () => {
    expect(nodesIn('dev').every((n) => n.zone !== 'b')).toBe(true)
  })
})
