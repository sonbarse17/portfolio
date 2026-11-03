import { describe, it, expect } from 'vitest'
import { evaluate, zoneMembers, nodes, edges } from '@/lib/lab/topology'
import { simulate, presets } from '@/lib/lab/pipeline'
import {
  desiredReplicas,
  reconcile,
  MAX_REPLICAS,
  MIN_REPLICAS,
  MAX_NODES,
} from '@/lib/lab/cluster'
import { plan, renderPlan, resources } from '@/lib/lab/plan'
import { alertPolicies, budgetMinutes, burnRate, budgetUsed, timeToDetect } from '@/lib/lab/slo'
import { evaluateAccess, secureDefault } from '@/lib/lab/iam'

describe('topology', () => {
  it('is fully healthy with nothing failed', () => {
    const { capabilityState } = evaluate('prod', new Set())
    expect(Object.values(capabilityState)).toEqual(['ok', 'ok', 'ok', 'ok'])
  })

  it('production survives a zone loss, degraded', () => {
    const { capabilityState } = evaluate('prod', new Set(zoneMembers('prod', 'a')))
    expect(capabilityState.write).toBe('degraded')
    expect(capabilityState.read).toBe('degraded')
  })

  it('dev does not survive the same zone loss', () => {
    const { capabilityState } = evaluate('dev', new Set(zoneMembers('dev', 'a')))
    expect(capabilityState.write).toBe('down')
    expect(capabilityState.async).toBe('down')
    expect(capabilityState.site).toBe('ok')
  })

  it('losing the load balancer stops the API but not the static site', () => {
    const { capabilityState, nodeState } = evaluate('prod', new Set(['lb']))
    expect(capabilityState.read).toBe('down')
    expect(capabilityState.site).toBe('ok')
    expect(nodeState['app-a']).toBe('down')
  })

  it('reads fall through when the cache fails', () => {
    const { capabilityState } = evaluate('prod', new Set(['cache']))
    expect(capabilityState.read).toBe('degraded')
    expect(capabilityState.write).toBe('ok')
  })

  it('identity is a shared dependency of all compute', () => {
    const { capabilityState } = evaluate('prod', new Set(['secrets']))
    expect(capabilityState.read).toBe('down')
    expect(capabilityState.async).toBe('down')
    expect(capabilityState.site).toBe('ok')
  })

  it('only draws edges between known nodes', () => {
    const ids = new Set(nodes.map((n) => n.id))
    edges.flat().forEach((id) => expect(ids.has(id)).toBe(true))
  })
})

describe('pipeline', () => {
  it('ships when no fault is active', () => {
    const { outcome, steps } = simulate('service', 'canary', new Set())
    expect(outcome.shipped).toBe(true)
    expect(steps.every((s) => s.status === 'passed')).toBe(true)
  })

  it('stops at the earliest gate and skips the rest', () => {
    const { steps, outcome } = simulate('service', 'canary', new Set(['cve', 'contract']))
    expect(steps.map((s) => s.status)).toEqual([
      'passed',
      'passed',
      'failed',
      'skipped',
      'skipped',
      'skipped',
      'skipped',
    ])
    expect(outcome.exposure).toBe(0)
  })

  it('a bad release exposes users according to strategy and rolls production back', () => {
    const faults = new Set(['bad-release'])
    const canary = simulate('service', 'canary', faults)
    expect(canary.outcome.exposure).toBe(5)
    expect(simulate('service', 'rolling', faults).outcome.exposure).toBe(25)
    expect(simulate('service', 'blue-green', faults).outcome.exposure).toBe(100)
    expect(canary.steps.find((s) => s.stage.id === 'prod')?.status).toBe('rolled-back')
    expect(canary.steps.find((s) => s.stage.id === 'staging')?.status).toBe('passed')
  })

  it('every fault targets a real stage in its preset', () => {
    presets.forEach((p) =>
      p.faults.forEach((f) => expect(p.stages.map((s) => s.id)).toContain(f.stage))
    )
  })
})

describe('cluster', () => {
  const base = { demand: 1000, target: 60, autoscale: true, failedNodes: new Set<string>() }

  it('follows the HPA formula within bounds', () => {
    expect(desiredReplicas(1000, 50)).toBe(8)
    expect(desiredReplicas(1, 90)).toBe(MIN_REPLICAS)
    expect(desiredReplicas(100000, 50)).toBe(MAX_REPLICAS)
  })

  it('binds everything under light load', () => {
    expect(reconcile(base).pending).toEqual([])
  })

  it('never overcommits a node', () => {
    const { nodes } = reconcile({ ...base, demand: 6000 })
    nodes.forEach((n) => {
      expect(n.pods.reduce((s, p) => s + p.cpu, 0)).toBeLessThanOrEqual(n.cpu)
      expect(n.pods.reduce((s, p) => s + p.mem, 0)).toBeLessThanOrEqual(n.mem)
    })
  })

  it('leaves pods pending without the autoscaler, adds nodes with it', () => {
    const load = { ...base, demand: 5000 }
    expect(reconcile({ ...load, autoscale: false }).pending.length).toBeGreaterThan(0)
    const scaled = reconcile(load)
    expect(scaled.nodes.length).toBeGreaterThan(3)
    expect(scaled.nodes.length).toBeLessThanOrEqual(MAX_NODES)
    expect(scaled.pending).toEqual([])
  })

  it('a stateful pod stays pending when its zone has no node', () => {
    const { pending, nodes } = reconcile({
      ...base,
      autoscale: false,
      failedNodes: new Set(['node-1']),
    })
    expect(pending.map((p) => p.name)).toContain('db-0')
    expect(nodes.find((n) => n.name === 'node-1')?.pods).toEqual([])
  })

  it('gives up at the node limit rather than looping', () => {
    const { nodes } = reconcile({ ...base, demand: 100000, target: 10 })
    expect(nodes.length).toBeLessThanOrEqual(MAX_NODES)
  })
})

describe('plan', () => {
  it('is empty with no changes', () => {
    const result = plan(new Set(), false)
    expect(result.entries).toEqual([])
    expect(renderPlan(result)).toMatch(/No changes/)
  })

  it('a tag is an in-place update and does not propagate', () => {
    const result = plan(new Set(['tag']), false)
    expect(result.summary).toEqual({ add: 0, change: 1, destroy: 0 })
  })

  it('a CIDR change cascades to the database', () => {
    const result = plan(new Set(['cidr']), false)
    expect(result.actions.get('aws_subnet.private')).toBe('replace')
    expect(result.actions.get('aws_db_instance.main')).toBe('replace')
    expect(result.actions.get('helm_release.app')).toBe('update')
  })

  it('prevent_destroy blocks a plan that would replace the database', () => {
    const result = plan(new Set(['cidr']), true)
    expect(result.blockers.map((b) => b.resource.id)).toEqual(['aws_db_instance.main'])
    expect(renderPlan(result)).toMatch(/prevent_destroy/)
  })

  it('prevent_destroy does not block a stateless replace', () => {
    expect(plan(new Set(['instance']), true).blockers).toEqual([])
  })

  it('apply levels respect dependency order', () => {
    const { levels } = plan(new Set(['cidr']), false)
    const levelOf = (id: string) => levels.findIndex((l) => l.includes(id))
    expect(levelOf('aws_vpc.main')).toBeLessThan(levelOf('aws_subnet.private'))
    expect(levelOf('aws_subnet.private')).toBeLessThan(levelOf('aws_eks_cluster.main'))
  })

  it('declares resources after their dependencies, which propagation relies on', () => {
    const seen = new Set<string>()
    resources.forEach((r) => {
      r.dependsOn.forEach((d) => expect(seen.has(d.id)).toBe(true))
      seen.add(r.id)
    })
  })
})

describe('slo', () => {
  const slo = 0.999

  it('computes the error budget', () => {
    expect(budgetMinutes(slo)).toBeCloseTo(43.2)
  })

  it('computes burn rate', () => {
    expect(burnRate(0.01, slo)).toBeCloseTo(10)
  })

  it('a full outage uses the whole budget in its budget minutes', () => {
    expect(budgetUsed(1, 43.2, slo)).toBeCloseTo(1)
  })

  it('a total outage pages on the fast alert within minutes', () => {
    const fast = alertPolicies[0]
    // 14.4 * 0.1% = 1.44% of an hour, so a full outage crosses at about one minute.
    expect(timeToDetect(fast, 1, 120, slo)).toBe(1)
  })

  it('a burn below the threshold never fires', () => {
    expect(timeToDetect(alertPolicies[0], 0.005, 600, slo)).toBeNull()
  })

  it('a short blip does not fire the slow alert', () => {
    expect(timeToDetect(alertPolicies[2], 0.5, 5, slo)).toBeNull()
  })
})

describe('access trace', () => {
  it('allows the secure default', () => {
    expect(evaluateAccess(secureDefault).allowed).toBe(true)
  })

  it('an explicit deny overrides every allow', () => {
    const { allowed, failedAt, checks } = evaluateAccess({
      ...secureDefault,
      explicitDeny: true,
      resourcePolicyAllows: true,
    })
    expect(allowed).toBe(false)
    expect(checks[failedAt].name).toBe('Explicit deny')
  })

  it('a permissions boundary limits the identity policy', () => {
    const { checks, failedAt } = evaluateAccess({ ...secureDefault, boundaryAllows: false })
    expect(checks[failedAt].name).toBe('Allow decision')
    expect(checks[failedAt].why).toMatch(/intersection/)
  })

  it('a resource policy can grant without an identity policy', () => {
    expect(
      evaluateAccess({ ...secureDefault, identityAllows: false, resourcePolicyAllows: true })
        .allowed
    ).toBe(true)
  })

  it('an SCP caps even a resource policy grant', () => {
    expect(
      evaluateAccess({ ...secureDefault, scpAllows: false, resourcePolicyAllows: true }).allowed
    ).toBe(false)
  })

  it('valid credentials are not enough from the wrong network', () => {
    const { checks, failedAt } = evaluateAccess({ ...secureDefault, fromPrivateNetwork: false })
    expect(checks[failedAt].layer).toBe('Network')
  })

  it('reports the first failure in order', () => {
    const { checks, failedAt } = evaluateAccess({
      ...secureDefault,
      mfa: false,
      identityAllows: false,
    })
    expect(checks[failedAt].name).toBe('Conditional Access')
  })
})
