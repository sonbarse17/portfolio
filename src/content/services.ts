export type Service = {
  id: string
  title: string
  description: string
  covers: string[]
  deliverables: string[]
  lab: string
}

export const services: Service[] = [
  {
    id: 'cicd-pipeline',
    title: 'CI/CD Pipeline Setup & Optimization',
    description:
      'Automate your build, test, and deployment processes for faster, more reliable releases.',
    covers: [
      'Jenkins, GitHub Actions or GitLab CI/CD, whichever you already run',
      'Build caching and parallelism to shorten feedback time',
      'Image and dependency scanning as release gates',
      'Progressive rollout and automated rollback',
    ],
    deliverables: [
      'Pipeline definitions in your repository',
      'A runbook for failed releases',
      'Before-and-after timings measured on your pipeline',
    ],
    lab: 'release-path',
  },
  {
    id: 'cloud-infrastructure',
    title: 'Cloud Infrastructure Design & Management',
    description:
      'Architect and manage scalable, secure, and cost-effective cloud infrastructure on AWS, GCP, or Azure.',
    covers: [
      'Network layout, zones and failure domains',
      'Identity, secrets and least-privilege access',
      'Managed versus self-run service decisions',
      'Backup and restore that has actually been tested',
    ],
    deliverables: [
      'Architecture diagrams and decision records',
      'Infrastructure defined as code',
      'A documented failure analysis of the design',
    ],
    lab: 'blast-radius',
  },
  {
    id: 'kubernetes-consulting',
    title: 'Kubernetes Consulting & Implementation',
    description: 'Deploy, manage, and scale containerized applications with Kubernetes.',
    covers: [
      'EKS or GKE cluster design and upgrades',
      'Helm or Kustomize packaging',
      'Requests, limits, autoscaling and disruption budgets',
      'Ingress, service networking and network policy',
    ],
    deliverables: [
      'Working manifests or charts for your services',
      'An upgrade procedure',
      'Dashboards for the signals that matter to the cluster',
    ],
    lab: 'cluster',
  },
  {
    id: 'iac-services',
    title: 'Infrastructure as Code (IaC) Services',
    description:
      'Manage your infrastructure with code using Terraform for consistency and reliability.',
    covers: [
      'Terraform modules with clear boundaries',
      'Remote state, locking and state layout',
      'Importing existing resources safely',
      'Ansible for host configuration where it is needed',
    ],
    deliverables: [
      'A module structure with per-environment configuration',
      'Plan review in CI',
      'Drift detection',
    ],
    lab: 'plan',
  },
  {
    id: 'cloud-cost-optimization',
    title: 'Cloud Cost Optimization',
    description:
      'Analyze and optimize your cloud spending to reduce costs without sacrificing performance.',
    covers: [
      'Cost attribution through tagging',
      'Rightsizing from real utilization data',
      'Commitments, spot capacity and storage tiers',
      'Data transfer and NAT costs, which are often missed',
    ],
    deliverables: [
      'A ranked list of savings with the risk of each',
      'Applied changes, as code',
      'Budgets and anomaly alerts',
    ],
    lab: 'blast-radius',
  },
  {
    id: 'devops-strategy',
    title: 'DevOps Strategy & Consulting',
    description:
      "Get expert guidance on your DevOps strategy to improve your team's efficiency and productivity.",
    covers: [
      'A review of how change reaches production today',
      'SLOs and on-call practice',
      'Security controls built into delivery',
      'A prioritized roadmap',
    ],
    deliverables: [
      'A written assessment',
      'A sequenced plan your team can run',
      'Baseline delivery and reliability measurements',
    ],
    lab: 'error-budget',
  },
]

export const engagement = [
  {
    step: 'Read',
    detail:
      'I start with the system as it is: repositories, pipelines, bills and recent incidents.',
  },
  {
    step: 'Agree',
    detail: 'We agree what success means and how it will be measured before work starts.',
  },
  {
    step: 'Build',
    detail: 'Small, reviewable changes in your repositories, with your team involved.',
  },
  { step: 'Hand over', detail: 'Runbooks and documentation, so nothing depends on me staying.' },
]
