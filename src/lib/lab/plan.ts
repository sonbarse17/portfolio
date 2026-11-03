export type Action = 'no-op' | 'update' | 'replace'

export type Resource = {
  id: string
  label: string
  x: number
  y: number
  /** Resources this one references. */
  dependsOn: { id: string; onReplace: 'replace' | 'update' }[]
  stateful?: boolean
}

export const resources: Resource[] = [
  { id: 'aws_kms_key.main', label: 'kms_key', x: 84, y: 10, dependsOn: [] },
  { id: 'aws_vpc.main', label: 'vpc', x: 34, y: 10, dependsOn: [] },
  {
    id: 'aws_subnet.private',
    label: 'subnet',
    x: 16,
    y: 32,
    dependsOn: [{ id: 'aws_vpc.main', onReplace: 'replace' }],
  },
  {
    id: 'aws_security_group.app',
    label: 'security_group',
    x: 52,
    y: 32,
    dependsOn: [{ id: 'aws_vpc.main', onReplace: 'replace' }],
  },
  {
    id: 'aws_iam_role.nodes',
    label: 'iam_role',
    x: 84,
    y: 32,
    dependsOn: [],
  },
  {
    id: 'aws_eks_cluster.main',
    label: 'eks_cluster',
    x: 16,
    y: 58,
    dependsOn: [
      { id: 'aws_subnet.private', onReplace: 'replace' },
      { id: 'aws_security_group.app', onReplace: 'update' },
    ],
  },
  {
    id: 'aws_db_instance.main',
    label: 'db_instance',
    x: 52,
    y: 58,
    stateful: true,
    dependsOn: [
      { id: 'aws_subnet.private', onReplace: 'replace' },
      { id: 'aws_security_group.app', onReplace: 'update' },
      { id: 'aws_kms_key.main', onReplace: 'replace' },
    ],
  },
  {
    id: 'aws_eks_node_group.main',
    label: 'eks_node_group',
    x: 16,
    y: 86,
    dependsOn: [
      { id: 'aws_eks_cluster.main', onReplace: 'replace' },
      { id: 'aws_iam_role.nodes', onReplace: 'replace' },
    ],
  },
  {
    id: 'helm_release.app',
    label: 'helm_release',
    x: 52,
    y: 86,
    dependsOn: [
      { id: 'aws_eks_node_group.main', onReplace: 'update' },
      { id: 'aws_db_instance.main', onReplace: 'update' },
    ],
  },
]

export type Change = {
  id: string
  label: string
  target: string
  action: Action
  attribute: string
}

export const changes: Change[] = [
  {
    id: 'tag',
    label: 'Add a cost-centre tag to the VPC',
    target: 'aws_vpc.main',
    action: 'update',
    attribute: 'tags',
  },
  {
    id: 'instance',
    label: 'Change node instance type',
    target: 'aws_eks_node_group.main',
    action: 'replace',
    attribute: 'instance_types',
  },
  {
    id: 'version',
    label: 'Upgrade the Kubernetes version',
    target: 'aws_eks_cluster.main',
    action: 'update',
    attribute: 'version',
  },
  {
    id: 'dbsize',
    label: 'Resize the database instance',
    target: 'aws_db_instance.main',
    action: 'update',
    attribute: 'instance_class',
  },
  {
    id: 'kms',
    label: 'Rotate to a new KMS key',
    target: 'aws_kms_key.main',
    action: 'replace',
    attribute: 'key_id',
  },
  {
    id: 'cidr',
    label: 'Change the VPC CIDR block',
    target: 'aws_vpc.main',
    action: 'replace',
    attribute: 'cidr_block',
  },
]

const rank: Record<Action, number> = { 'no-op': 0, update: 1, replace: 2 }

// `resources` is declared in dependency order, so one pass propagates fully. A test enforces this.
export function plan(selected: ReadonlySet<string>, preventDestroy: boolean) {
  const actions = new Map<string, Action>(resources.map((r) => [r.id, 'no-op']))
  const causes = new Map<string, string>()

  const raise = (id: string, action: Action, cause: string) => {
    if (rank[action] > rank[actions.get(id)!]) {
      actions.set(id, action)
      causes.set(id, cause)
    }
  }

  changes
    .filter((c) => selected.has(c.id))
    .forEach((c) => raise(c.target, c.action, `${c.attribute} changed`))

  for (const resource of resources) {
    for (const dep of resource.dependsOn) {
      if (actions.get(dep.id) === 'replace') {
        raise(resource.id, dep.onReplace, `${dep.id} is being replaced`)
      }
    }
  }

  const levels = applyLevels(actions)
  const entries = resources
    .filter((r) => actions.get(r.id) !== 'no-op')
    .map((r) => ({
      resource: r,
      action: actions.get(r.id)!,
      cause: causes.get(r.id)!,
    }))

  const replaced = entries.filter((e) => e.action === 'replace')
  const blockers = preventDestroy ? replaced.filter((e) => e.resource.stateful) : []

  return {
    actions,
    entries,
    levels,
    blockers,
    summary: {
      add: replaced.length,
      change: entries.filter((e) => e.action === 'update').length,
      destroy: replaced.length,
    },
  }
}

/** Resources in the same level have no ordering between them, so they apply in parallel. */
function applyLevels(actions: Map<string, Action>) {
  const depth = new Map<string, number>()
  const levelOf = (id: string): number => {
    if (depth.has(id)) return depth.get(id)!
    const resource = resources.find((r) => r.id === id)!
    const level = resource.dependsOn.reduce((max, d) => {
      const dependsLevel = levelOf(d.id)
      return actions.get(d.id) === 'no-op' ? max : Math.max(max, dependsLevel + 1)
    }, 0)
    depth.set(id, level)
    return level
  }

  const levels: string[][] = []
  resources
    .filter((r) => actions.get(r.id) !== 'no-op')
    .forEach((r) => {
      const level = levelOf(r.id)
      ;(levels[level] ??= []).push(r.id)
    })
  return levels.filter(Boolean)
}

export function renderPlan(result: ReturnType<typeof plan>) {
  if (result.blockers.length) {
    return result.blockers
      .map(
        (b) =>
          `Error: Instance cannot be destroyed\n\n  on ${b.resource.id}:\n  lifecycle.prevent_destroy is set, but the plan calls for\n  this resource to be destroyed (${b.cause}).`
      )
      .join('\n\n')
  }
  if (!result.entries.length) return 'No changes. Your infrastructure matches the configuration.'

  const symbols = { update: '  ~', replace: '-/+', 'no-op': '   ' }
  const body = result.entries
    .map((e) => `${symbols[e.action]} ${e.resource.id}\n      # ${e.cause}`)
    .join('\n')
  const { add, change, destroy } = result.summary
  return `${body}\n\nPlan: ${add} to add, ${change} to change, ${destroy} to destroy.`
}
