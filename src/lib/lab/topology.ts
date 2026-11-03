export type Cloud = 'aws' | 'azure' | 'gcp'
export type Env = 'dev' | 'prod'
export type Health = 'ok' | 'degraded' | 'down'

export type TopologyNode = {
  id: string
  label: string
  zone: 'a' | 'b' | null
  envs: Env[]
  x: number
  y: number
  /** AND of OR-groups: every group needs at least one working member. */
  requires: string[][]
  services: Record<Cloud, string>
  role: string
  /** What an operator should expect when this component is lost. */
  onFailure: string
  /** The corrective action, shown as a recovery step in the lab. */
  recovery: string
}

const both: Env[] = ['dev', 'prod']
const prod: Env[] = ['prod']

const compute = { aws: 'EKS pods', azure: 'AKS pods', gcp: 'GKE pods' }
const database = {
  aws: 'RDS Multi-AZ',
  azure: 'Azure SQL zone-redundant',
  gcp: 'Cloud SQL HA',
}

export const nodes: TopologyNode[] = [
  {
    id: 'static',
    label: 'Static assets',
    zone: null,
    envs: both,
    x: 13,
    y: 8,
    requires: [],
    services: { aws: 'S3', azure: 'Blob Storage', gcp: 'Cloud Storage' },
    role: 'Object storage behind the edge. Regional and durable, with no servers to run.',
    onFailure: 'The frontend stops loading once edge caches expire; APIs keep working.',
    recovery: 'Restore the bucket, or repoint the edge origin to a replica.',
  },
  {
    id: 'edge',
    label: 'Edge',
    zone: null,
    envs: both,
    x: 50,
    y: 8,
    requires: [['dns']],
    services: {
      aws: 'CloudFront + WAF',
      azure: 'Front Door + WAF',
      gcp: 'Cloud CDN + Cloud Armor',
    },
    role: 'Terminates TLS, caches static content and filters hostile traffic before it reaches the VPC.',
    onFailure: 'Nothing is reachable. This is why DNS failover to a second edge is worth pricing.',
    recovery: 'Fail traffic over to a second edge configuration, or restore the distribution.',
  },
  {
    id: 'dns',
    label: 'DNS',
    zone: null,
    envs: both,
    x: 87,
    y: 8,
    requires: [],
    services: { aws: 'Route 53', azure: 'Azure DNS', gcp: 'Cloud DNS' },
    role: 'Resolves the hostname to the edge. Everything starts here, and it is easy to forget.',
    onFailure:
      'Names stop resolving, so every request fails at the first step even though every server is healthy. Resolver caches soften this for a while.',
    recovery:
      'Restore the records, or fail over to a secondary DNS provider. Clients recover as cached answers expire.',
  },
  {
    id: 'lb',
    label: 'Load balancer',
    zone: null,
    envs: both,
    x: 50,
    y: 27,
    requires: [['edge']],
    services: {
      aws: 'Application Load Balancer',
      azure: 'Application Gateway',
      gcp: 'Cloud Load Balancing',
    },
    role: 'Spans zones and routes only to targets that pass health checks.',
    onFailure: 'All API traffic stops, even though every workload behind it is healthy.',
    recovery: 'Replace or repair the load balancer. Health checks then restore the targets.',
  },
  {
    id: 'secrets',
    label: 'Identity + secrets',
    zone: null,
    envs: both,
    x: 87,
    y: 27,
    requires: [],
    services: {
      aws: 'IAM + Secrets Manager',
      azure: 'Entra ID + Key Vault',
      gcp: 'Cloud IAM + Secret Manager',
    },
    role: 'Workload identity and credentials, so nothing long-lived ships in an image.',
    onFailure:
      'Everything depending on it stops at once. Easy to forget, because it never appears in a request trace. In practice, cached credentials soften this for a while.',
    recovery: 'Restore the identity or secrets service. Workloads then re-fetch their credentials.',
  },
  {
    id: 'app-a',
    label: 'API',
    zone: 'a',
    envs: both,
    x: 27,
    y: 46,
    requires: [['lb'], ['secrets']],
    services: compute,
    role: 'Stateless replicas in zone A. Safe to kill, because no state lives here.',
    onFailure:
      'The load balancer drains the targets. Survivors take the traffic if they have headroom.',
    recovery:
      'Reschedule the replicas on healthy capacity. The balancer resumes routing once checks pass.',
  },
  {
    id: 'app-b',
    label: 'API',
    zone: 'b',
    envs: prod,
    x: 73,
    y: 46,
    requires: [['lb'], ['secrets']],
    services: compute,
    role: 'Stateless replicas in zone B, the reason a zone failure is survivable.',
    onFailure: 'Zone A carries the load. Keep N+1 capacity or this becomes an overload outage.',
    recovery: 'Reschedule the replicas in zone B to restore the second failure domain.',
  },
  {
    id: 'cache',
    label: 'Cache',
    zone: null,
    envs: prod,
    x: 50,
    y: 65,
    requires: [],
    services: { aws: 'ElastiCache', azure: 'Azure Cache for Redis', gcp: 'Memorystore' },
    role: 'Absorbs read load so the database is not sized for peak reads.',
    onFailure:
      'Reads fall through to the database. Availability survives here, but a cold cache can overload the database in real systems.',
    recovery: 'Restart the cache. Expect a cold start and extra database load while it refills.',
  },
  {
    id: 'db-a',
    label: 'DB primary',
    zone: 'a',
    envs: both,
    x: 27,
    y: 65,
    requires: [],
    services: database,
    role: 'The single writer. Synchronously replicated to the standby in production.',
    onFailure:
      'In production the standby is promoted, typically after a short write interruption. In dev, writes are gone.',
    recovery:
      'Production: promote the standby to primary. Dev has no standby, so restore from backup.',
  },
  {
    id: 'db-b',
    label: 'DB standby',
    zone: 'b',
    envs: prod,
    x: 73,
    y: 65,
    requires: [],
    services: database,
    role: 'Takes over as the writer if the primary or its zone fails.',
    onFailure: 'No customer impact, but the next primary failure is an outage. Treat it as urgent.',
    recovery: 'Rebuild the standby from the primary to regain redundancy.',
  },
  {
    id: 'queue',
    label: 'Queue',
    zone: null,
    envs: both,
    x: 50,
    y: 84,
    requires: [],
    services: { aws: 'SQS', azure: 'Service Bus', gcp: 'Pub/Sub' },
    role: 'Decouples slow work from the request path, so a backlog is not an outage.',
    onFailure: 'Background work stops being accepted. Synchronous requests are unaffected.',
    recovery: 'Restore the queue service. Accepted messages resume processing.',
  },
  {
    id: 'worker-a',
    label: 'Worker',
    zone: 'a',
    envs: both,
    x: 27,
    y: 84,
    requires: [['secrets'], ['queue']],
    services: compute,
    role: 'Consumes the queue. Scales on queue depth rather than CPU.',
    onFailure: 'The backlog grows but nothing is lost while the queue retains messages.',
    recovery: 'Reschedule the workers. They drain the backlog.',
  },
  {
    id: 'worker-b',
    label: 'Worker',
    zone: 'b',
    envs: prod,
    x: 73,
    y: 84,
    requires: [['secrets'], ['queue']],
    services: compute,
    role: 'Consumers in the second zone.',
    onFailure: 'Throughput drops; zone A keeps draining the queue.',
    recovery: 'Reschedule the workers in zone B to restore throughput.',
  },
]

/** Routes drawn in the schematic. Separate from `requires` because failover paths are not data flow. */
export const edges: [string, string][] = [
  ['static', 'edge'],
  ['dns', 'edge'],
  ['edge', 'lb'],
  ['lb', 'app-a'],
  ['lb', 'app-b'],
  ['secrets', 'app-a'],
  ['secrets', 'app-b'],
  ['app-a', 'cache'],
  ['app-b', 'cache'],
  ['app-a', 'db-a'],
  ['app-b', 'db-b'],
  ['db-a', 'db-b'],
  ['queue', 'worker-a'],
  ['queue', 'worker-b'],
  ['db-a', 'worker-a'],
  ['db-b', 'worker-b'],
]

export const capabilities: { id: string; label: string; requires: string[][] }[] = [
  { id: 'site', label: 'Load the site', requires: [['edge'], ['static']] },
  {
    id: 'read',
    label: 'Read data',
    requires: [
      ['app-a', 'app-b'],
      ['cache', 'db-a', 'db-b'],
    ],
  },
  {
    id: 'write',
    label: 'Write data',
    requires: [
      ['app-a', 'app-b'],
      ['db-a', 'db-b'],
    ],
  },
  {
    id: 'async',
    label: 'Background jobs',
    requires: [
      ['worker-a', 'worker-b'],
      ['db-a', 'db-b'],
    ],
  },
]

export type Scenario = { id: string; label: string; fails: string[] | 'zone-a' | 'zone-b' }

export const scenarios: Scenario[] = [
  { id: 'db', label: 'Database primary lost', fails: ['db-a'] },
  { id: 'zone', label: 'Zone A outage', fails: 'zone-a' },
  { id: 'identity', label: 'Identity outage', fails: ['secrets'] },
  { id: 'dns', label: 'DNS failure', fails: ['dns'] },
  { id: 'lb', label: 'Load balancer lost', fails: ['lb'] },
  { id: 'cache', label: 'Cache lost', fails: ['cache'] },
]

export function nodesIn(env: Env) {
  return nodes.filter((n) => n.envs.includes(env))
}

/** A component is unavailable if it failed or a dependency group has no working member. */
export function evaluate(env: Env, failed: ReadonlySet<string>) {
  const present = new Map(nodesIn(env).map((n) => [n.id, n]))

  const assess = (requires: string[][]): Health => {
    let health: Health = 'ok'
    for (const group of requires) {
      const members = group.filter((id) => present.has(id)).map(state)
      if (!members.includes('ok') && !members.includes('degraded')) return 'down'
      if (members.includes('down') || members.includes('degraded')) health = 'degraded'
    }
    return health
  }

  function state(id: string): Health {
    if (failed.has(id)) return 'down'
    return assess(present.get(id)!.requires)
  }

  const nodeState = Object.fromEntries([...present.keys()].map((id) => [id, state(id)])) as Record<
    string,
    Health
  >
  const capabilityState = Object.fromEntries(
    capabilities.map((c) => [c.id, assess(c.requires)])
  ) as Record<string, Health>

  return { nodeState, capabilityState }
}

export function zoneMembers(env: Env, zone: 'a' | 'b') {
  return nodesIn(env)
    .filter((n) => n.zone === zone)
    .map((n) => n.id)
}

/** The failed set a scenario produces in an environment. */
export function scenarioFailures(env: Env, scenario: Scenario) {
  const present = new Set(nodesIn(env).map((n) => n.id))
  const ids =
    scenario.fails === 'zone-a'
      ? zoneMembers(env, 'a')
      : scenario.fails === 'zone-b'
        ? zoneMembers(env, 'b')
        : scenario.fails
  return new Set(ids.filter((id) => present.has(id)))
}

/** Everything that, directly or through another component, depends on `id`. */
export function dependents(env: Env, id: string) {
  const present = nodesIn(env)
  const hit = new Set([id])
  let grew = true
  while (grew) {
    grew = false
    for (const n of present) {
      if (!hit.has(n.id) && n.requires.flat().some((r) => hit.has(r))) {
        hit.add(n.id)
        grew = true
      }
    }
  }
  hit.delete(id)
  return [...hit]
}

/** The user-facing capabilities that lose something when `id` is gone. */
export function capabilitiesAffectedBy(env: Env, id: string) {
  const reach = new Set([id, ...dependents(env, id)])
  return capabilities.filter((c) => c.requires.flat().some((r) => reach.has(r)))
}

export type LogEntry = { step: number; kind: 'fail' | 'recover' | 'effect' | 'reset'; text: string }

const word: Record<Health, string> = { ok: 'Healthy', degraded: 'Degraded', down: 'Down' }

/** Describes what changed between two failure sets, in the order an operator would see it. */
export function describeChange(
  env: Env,
  before: ReadonlySet<string>,
  after: ReadonlySet<string>
): Omit<LogEntry, 'step'>[] {
  const label = (id: string) => nodes.find((n) => n.id === id)!.label
  const zoneOf = (id: string) => nodes.find((n) => n.id === id)!.zone
  const name = (id: string) =>
    zoneOf(id) ? `${label(id)} (zone ${zoneOf(id)!.toUpperCase()})` : label(id)
  const out: Omit<LogEntry, 'step'>[] = []

  const failedNow = [...after].filter((id) => !before.has(id))
  const recovered = [...before].filter((id) => !after.has(id))
  failedNow.forEach((id) => out.push({ kind: 'fail', text: `${name(id)} failed` }))
  recovered.forEach((id) => out.push({ kind: 'recover', text: `${name(id)} recovered` }))

  const was = evaluate(env, before)
  const now = evaluate(env, after)
  capabilities.forEach((c) => {
    if (was.capabilityState[c.id] !== now.capabilityState[c.id]) {
      out.push({
        kind: 'effect',
        text: `${c.label}: ${word[was.capabilityState[c.id]]} to ${word[now.capabilityState[c.id]]}`,
      })
    }
  })
  return out
}
