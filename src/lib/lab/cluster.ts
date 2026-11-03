export type Kind = 'daemon' | 'stateful' | 'web'
export type Pod = { name: string; kind: Kind; cpu: number; mem: number; zone?: string }
export type Node = {
  name: string
  zone: string
  cpu: number
  mem: number
  pods: Pod[]
  down: boolean
}

export type ClusterInput = {
  /** Total CPU the web tier needs, in millicores. */
  demand: number
  /** HPA target CPU utilisation, 1 to 100. */
  target: number
  autoscale: boolean
  failedNodes: ReadonlySet<string>
}

export const WEB_CPU = 250
export const MIN_REPLICAS = 2
export const MAX_REPLICAS = 40
export const MAX_NODES = 9
const NODE_CPU = 2000
const NODE_MEM = 4096
const ZONES = ['a', 'b', 'c']
const STARTING_NODES = 3

/** The real HPA calculation, reduced to one metric and no stabilisation window. */
export function desiredReplicas(demand: number, target: number) {
  const utilisationAtOne = (demand / WEB_CPU) * 100
  return Math.min(MAX_REPLICAS, Math.max(MIN_REPLICAS, Math.ceil(utilisationAtOne / target)))
}

function free(node: Node) {
  return {
    cpu: node.cpu - node.pods.reduce((sum, p) => sum + p.cpu, 0),
    mem: node.mem - node.pods.reduce((sum, p) => sum + p.mem, 0),
  }
}

function fits(node: Node, pod: Pod) {
  const room = free(node)
  return (
    !node.down &&
    room.cpu >= pod.cpu &&
    room.mem >= pod.mem &&
    (!pod.zone || pod.zone === node.zone)
  )
}

/** Filter, then score: fewest pods of this workload in the zone (spread), then most free CPU. */
function place(nodes: Node[], pod: Pod) {
  const samePods = (zone: string) =>
    nodes
      .filter((n) => n.zone === zone)
      .flatMap((n) => n.pods)
      .filter((p) => p.kind === pod.kind).length

  const chosen = nodes
    .filter((n) => fits(n, pod))
    .sort((a, b) => samePods(a.zone) - samePods(b.zone) || free(b).cpu - free(a).cpu)[0]

  chosen?.pods.push(pod)
  return Boolean(chosen)
}

function createNode(index: number): Node {
  return {
    name: `node-${index + 1}`,
    zone: ZONES[index % ZONES.length],
    cpu: NODE_CPU,
    mem: NODE_MEM,
    pods: [],
    down: false,
  }
}

function schedule(nodeCount: number, replicas: number, failed: ReadonlySet<string>) {
  const nodes = Array.from({ length: nodeCount }, (_, i) => createNode(i))
  nodes.forEach((n) => (n.down = failed.has(n.name)))

  // DaemonSet pods are bound per node, so they never go Pending for lack of a home.
  nodes
    .filter((n) => !n.down)
    .forEach((n) =>
      n.pods.push({ name: `log-agent-${n.name}`, kind: 'daemon', cpu: 100, mem: 128 })
    )

  // Volumes are zonal, so each StatefulSet ordinal is pinned to its zone and cannot simply move.
  const stateful: Pod[] = ZONES.map((zone, i) => ({
    name: `db-${i}`,
    kind: 'stateful',
    cpu: 500,
    mem: 1024,
    zone,
  }))
  const web: Pod[] = Array.from({ length: replicas }, (_, i) => ({
    name: `web-${i}`,
    kind: 'web',
    cpu: WEB_CPU,
    mem: 256,
  }))

  const pending = [...stateful, ...web].filter((pod) => !place(nodes, pod))
  return { nodes, pending }
}

export function reconcile({ demand, target, autoscale, failedNodes }: ClusterInput) {
  const replicas = desiredReplicas(demand, target)
  const log = [
    `HPA: ceil(${demand}m / ${WEB_CPU}m / ${target}%) gives ${replicas} replicas (bounds ${MIN_REPLICAS} to ${MAX_REPLICAS})`,
  ]

  let nodeCount = STARTING_NODES
  let result = schedule(nodeCount, replicas, failedNodes)

  while (autoscale && result.pending.length > 0 && nodeCount < MAX_NODES) {
    nodeCount += 1
    log.push(
      `Cluster Autoscaler: ${result.pending.length} pending, added node-${nodeCount} in zone ${ZONES[(nodeCount - 1) % ZONES.length]}`
    )
    result = schedule(nodeCount, replicas, failedNodes)
  }

  const pendingNames = result.pending.map((p) => p.name)
  if (pendingNames.length) {
    log.push(
      `Scheduler: ${pendingNames.length} unschedulable (${pendingNames.slice(0, 4).join(', ')}${pendingNames.length > 4 ? ', ...' : ''})`
    )
  } else {
    log.push('Scheduler: every pod is bound')
  }

  return { replicas, ...result, log }
}
