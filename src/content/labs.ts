export type Lab = {
  slug: string
  title: string
  question: string
  summary: string
  model: string
  simplified: string[]
  covers: string[]
}

export const labs: Lab[] = [
  {
    slug: 'blast-radius',
    title: 'Blast radius',
    question: 'What actually stops working when this component dies?',
    summary:
      'A three-tier system you can break. Run a failure scenario or fail any component, follow the dependency chain to see who is affected, read the event log, then apply the recovery action. Compare production with dev, and switch the service names between AWS, Azure and GCP.',
    model:
      'Each component declares its dependencies as groups: every group needs at least one working member. Status is computed from that graph on every click, so the result is derived and not scripted. The event log is the difference between the states before and after each action.',
    simplified: [
      'Availability only. It does not model overload, though surviving replicas may saturate in a real failure.',
      'Failover and recovery are treated as instant. Real database promotion interrupts writes briefly, and real recovery takes time.',
      'Recovery actions are described, not executed. This lab is not connected to any real infrastructure.',
      'A single region. Multi-region adds data-consistency decisions this model leaves out.',
    ],
    covers: [
      'High availability',
      'Failure propagation',
      'DNS, identity and database failures',
      'Recovery workflows',
      'Multi-cloud mapping',
      'Environment comparison',
    ],
  },
  {
    slug: 'release-path',
    title: 'Release path',
    question: 'Where does each kind of bad change get caught, and who sees it?',
    summary:
      'Run a service, GitOps or model release through its gates. Inject a fault, choose a rollout strategy, and see how far it travels and how many users it reaches.',
    model:
      'The earliest active fault fails its stage, and later stages are skipped. Faults that only appear under production traffic roll back and report exposure for the chosen strategy.',
    simplified: [
      'Exposure uses fixed assumptions: a 5% canary step, a 25% rolling batch, and a full blue-green cutover.',
      'It does not model how long a fault runs before detection, which also determines the real impact.',
    ],
    covers: [
      'CI/CD',
      'GitOps',
      'MLOps',
      'Jenkins, GitHub Actions and GitLab',
      'Progressive delivery',
    ],
  },
  {
    slug: 'cluster',
    title: 'Scheduler',
    question: 'Why is this pod Pending?',
    summary:
      'Drive load into a small Kubernetes cluster. Watch the HPA calculation, the scheduler placing pods by resource requests, the Cluster Autoscaler adding nodes, and a StatefulSet that cannot simply move.',
    model:
      'Replicas come from the HPA formula. Pods are filtered by free CPU, memory and zone, then scored to spread across zones. Each StatefulSet ordinal is pinned to the zone of its volume.',
    simplified: [
      'It solves to the final state at once, so there are no stabilization windows or scale-up delays.',
      'It models requests and not actual usage, and leaves out taints, affinity and disruption budgets.',
    ],
    covers: ['Deployments', 'StatefulSets', 'DaemonSets', 'HPA', 'Cluster Autoscaler'],
  },
  {
    slug: 'plan',
    title: 'Plan reader',
    question: 'What does this one-line change really do?',
    summary:
      'Pick infrastructure changes and read the resulting plan. See how replacement cascades through a dependency graph, and when prevent_destroy stops a plan that would delete the database.',
    model:
      'Each dependency declares whether replacing its target forces a replacement or an update. Actions propagate through the graph, and apply levels show what can run in parallel.',
    simplified: [
      'The graph is hand-written and small. Terraform derives its own from your configuration and provider schemas.',
      'Output is styled after terraform plan, but no Terraform runs here.',
    ],
    covers: ['Terraform', 'Dependency graphs', 'Lifecycle rules', 'Change safety'],
  },
  {
    slug: 'error-budget',
    title: 'Error budget',
    question: 'Should this incident wake someone up?',
    summary:
      'Set an SLO, then describe an incident. See the budget burn down, and which multi-window burn-rate alerts fire and when.',
    model:
      'Uses the burn-rate thresholds from the Google SRE Workbook: 14.4x over 1h and 5m, 6x over 6h and 30m, and 1x over 3d and 6h. An alert fires when both of its windows exceed the threshold.',
    simplified: [
      'Assumes a constant error rate during one incident and a clean budget before it.',
      'Uses a 30-day window and treats every minute as equal, instead of counting requests.',
    ],
    covers: ['SLOs', 'Burn-rate alerting', 'Incident severity', 'Reliability engineering'],
  },
  {
    slug: 'access-trace',
    title: 'Access trace',
    question: 'Why was this request denied?',
    summary:
      'Follow one request from Entra ID sign-in through federation, IAM policy evaluation, network path and TLS. Change any condition to see which layer stops it and why.',
    model:
      'Checks run in order, and the first failure is the answer. The IAM section follows the documented order for a same-account request: explicit deny, SCP, resource policy, then boundary and identity policy.',
    simplified: [
      'Same-account only. Cross-account access needs an allow on both sides.',
      'Session policies, condition keys and resource control policies are left out.',
    ],
    covers: ['Entra ID', 'SSO', 'IAM evaluation', 'Network controls', 'TLS'],
  },
]
