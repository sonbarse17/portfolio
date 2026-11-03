export type Domain = {
  id: string
  title: string
  position: string
  lab?: string
  topics: { name: string; note: string }[]
}

export const domains: Domain[] = [
  {
    id: 'cloud',
    title: 'Cloud architecture',
    position: 'Pick failure domains first. Services are the easy part of the diagram.',
    lab: 'blast-radius',
    topics: [
      {
        name: 'AWS',
        note: 'Accounts are the real isolation boundary. Separate production by account rather than by naming convention.',
      },
      {
        name: 'Microsoft Azure',
        note: 'Subscriptions and management groups play the same role. Availability zones are not automatic per service, so check each one.',
      },
      {
        name: 'Google Cloud',
        note: 'Projects and global VPCs change the network design: one VPC can span regions, which simplifies routing and widens mistakes.',
      },
      {
        name: 'Multi-cloud',
        note: 'Usually a cost, not a strategy. It is justified by regulation, acquisition or one specific capability, and rarely by avoiding lock-in.',
      },
      {
        name: 'Networking',
        note: 'Plan CIDR ranges early, because re-addressing later forces replacement. Private endpoints beat traffic through NAT on both security and cost.',
      },
      {
        name: 'High availability',
        note: 'Two zones only help if one can carry the full load. Capacity is part of the failover design.',
      },
      {
        name: 'Cost',
        note: 'Attribute before optimizing. Data transfer and idle non-production capacity are common and quiet sources of spend.',
      },
    ],
  },
  {
    id: 'delivery',
    title: 'DevOps and automation',
    position:
      'A pipeline is a series of arguments that a change is safe. Each stage should catch something the previous one could not.',
    lab: 'release-path',
    topics: [
      {
        name: 'GitHub Actions',
        note: 'Use OIDC federation so workflows hold no long-lived cloud keys. Pin third-party actions to a commit.',
      },
      {
        name: 'GitLab CI/CD',
        note: 'Protected environments and merge request pipelines give a strong default path with little configuration.',
      },
      {
        name: 'Jenkins',
        note: 'Keep the logic in versioned pipeline files and run ephemeral agents. A hand-configured controller is a liability.',
      },
      {
        name: 'Release management',
        note: 'Build once and promote the same digest. Rebuilding per environment means you never tested what you shipped.',
      },
      {
        name: 'GitOps',
        note: 'The cluster pulls desired state, so CI needs no cluster credentials and rollback is a revert.',
      },
      {
        name: 'Progressive delivery',
        note: 'A canary is only as good as its analysis. Without automated comparison it is just a slower rollout.',
      },
    ],
  },
  {
    id: 'containers',
    title: 'Containers and orchestration',
    position:
      'Most Kubernetes incidents are about requests, limits and probes. Understand those before adding more platform.',
    lab: 'cluster',
    topics: [
      {
        name: 'Docker and Compose',
        note: 'Multi-stage builds, minimal base images and a non-root user. Compose remains the right tool for local development.',
      },
      {
        name: 'Amazon EKS',
        note: 'The control plane is managed, but upgrades are still your work. Check add-on and API compatibility first.',
      },
      {
        name: 'Google GKE',
        note: 'Autopilot trades control for less node management. It is a good default unless you need node-level access.',
      },
      {
        name: 'Deployments and StatefulSets',
        note: 'StatefulSets give identity and stable storage, but zonal volumes tie pods to a zone. Prefer a managed database when you can.',
      },
      {
        name: 'Services and Ingress',
        note: 'Readiness probes decide who receives traffic. A liveness probe that checks dependencies can turn a small failure into a restart storm.',
      },
      {
        name: 'Helm and Kustomize',
        note: 'Helm for packaging and distributing. Kustomize for environment overlays on manifests you own.',
      },
      {
        name: 'Autoscaling',
        note: 'HPA reacts to pods, and node autoscaling reacts to Pending pods. Both depend on accurate requests.',
      },
    ],
  },
  {
    id: 'iac',
    title: 'Infrastructure as code',
    position:
      'The plan is the code review. If nobody reads the plan, the code is only documentation.',
    lab: 'plan',
    topics: [
      {
        name: 'Terraform',
        note: 'Declarative and graph-driven. Its value is the reviewable diff between desired and actual state.',
      },
      {
        name: 'State management',
        note: 'Use remote state with locking. Split state by blast radius, so a network change plan cannot touch the database.',
      },
      {
        name: 'Reusable modules',
        note: 'Create one when a pattern has repeated and stabilized. Modules that wrap one resource add indirection and nothing else.',
      },
      {
        name: 'Environments',
        note: 'Same modules, different inputs. Differences between environments should be visible in a short variables file.',
      },
      {
        name: 'Ansible',
        note: 'For configuring hosts that must exist. Baking images is usually better for anything in an autoscaling group.',
      },
      {
        name: 'Provisioning safety',
        note: 'Use prevent_destroy on stateful resources, and detect drift on a schedule so surprises appear before the next change.',
      },
    ],
  },
  {
    id: 'reliability',
    title: 'Observability and reliability',
    position:
      'Alert on what users experience. Causes belong on dashboards, and symptoms belong on pagers.',
    lab: 'error-budget',
    topics: [
      {
        name: 'Prometheus',
        note: 'Cardinality is the main operational risk. Never put user IDs or request IDs in labels.',
      },
      {
        name: 'Grafana',
        note: 'One overview per service, built around rate, errors and duration, beats many dashboards nobody opens.',
      },
      {
        name: 'CloudWatch',
        note: 'The natural home for managed AWS service signals. Watch custom metric and log ingestion costs.',
      },
      {
        name: 'Azure Monitor',
        note: 'Log Analytics and KQL give strong ad-hoc analysis. Set retention and table plans deliberately.',
      },
      {
        name: 'Logs and traces',
        note: 'Structured logs carrying a trace ID connect the signals. Sample traces, and keep the errors.',
      },
      {
        name: 'Incident management',
        note: 'Clear roles, a timeline and blameless reviews that produce changes rather than reminders to be careful.',
      },
      {
        name: 'SRE practice',
        note: 'An error budget turns "is it reliable enough?" into a number that product and engineering can both act on.',
      },
    ],
  },
  {
    id: 'security',
    title: 'Security and DevSecOps',
    position:
      'Prefer controls that make the unsafe path impossible over checks that report it afterwards.',
    lab: 'access-trace',
    topics: [
      {
        name: 'IAM',
        note: 'Short-lived roles rather than long-lived keys. An explicit deny beats every allow, and SCPs set the ceiling.',
      },
      {
        name: 'Microsoft Entra ID',
        note: 'Central identity with Conditional Access. Lifecycle matters as much as sign-in: leavers must lose access everywhere.',
      },
      {
        name: 'SSO',
        note: 'SAML or OIDC federation with group-based role mapping, so access follows the org chart and not individual tickets.',
      },
      {
        name: 'SSL/TLS',
        note: 'Automate issuance and renewal with ACM or cert-manager. Expired certificates are an outage you can entirely prevent.',
      },
      {
        name: 'Network security',
        note: 'Private by default, with explicit paths in. Network policy limits lateral movement inside the cluster.',
      },
      {
        name: 'Scanning',
        note: 'Block on fixable criticals and track the rest. A gate that fails on everything soon gets disabled.',
      },
      {
        name: 'Hardening',
        note: 'Non-root containers, read-only filesystems, no public buckets by policy, and secrets that never enter an image.',
      },
    ],
  },
  {
    id: 'ai',
    title: 'AI infrastructure and MLOps',
    position:
      'A model is a build artifact with a data dependency. Most delivery discipline carries over, and drift is what is new.',
    lab: 'release-path',
    topics: [
      {
        name: 'Model deployment',
        note: 'Version the model, code and data reference together, and promote the same artifact through environments.',
      },
      {
        name: 'Model serving',
        note: 'Batching and cold start dominate GPU serving. Measure latency at realistic concurrency.',
      },
      {
        name: 'Scalable workloads',
        note: 'Scale on queue depth or in-flight requests, because GPU utilization alone says little about user wait.',
      },
      {
        name: 'CI/CD for ML',
        note: 'Add data validation and evaluation against the current model. Shadow traffic is a cheap and safe final check.',
      },
      {
        name: 'Managed AI services',
        note: 'Bedrock, Azure AI and Vertex AI remove serving work. Compare cost per request at your volume before self-hosting.',
      },
      {
        name: 'AI in engineering workflows',
        note: 'Useful for drafting and triage. Keep humans and existing gates on anything that changes production.',
      },
    ],
  },
]
