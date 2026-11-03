import { edge, node, type Project } from './types'

const I = 'implemented' as const
const E = 'dependency' as const

export const prometheusGrafana: Project = {
  slug: 'prometheus-grafana',
  title: 'Prometheus and Grafana on Kubernetes',
  summary:
    'A monitoring stack deployed with Helm: Prometheus collecting metrics, Grafana for dashboards, and the troubleshooting that came with ServiceMonitors and storage.',
  classification: 'personal',
  category: 'Observability, Kubernetes monitoring',
  context: 'Personal engineering project',
  labels: [],
  tier: 'case',
  lab: 'error-budget',
  glance: [
    { label: 'Deployed with', value: 'Helm, on Kubernetes' },
    {
      label: 'Collects',
      value: 'Application metrics through ServiceMonitors and scrape annotations',
    },
    { label: 'Troubleshot', value: 'ServiceMonitor CRDs and storage classes' },
  ],
  stackGroups: [
    { group: 'Platform', items: ['Kubernetes', 'Helm', 'metrics-server'] },
    { group: 'Monitoring', items: ['Prometheus', 'ServiceMonitor', 'Grafana'] },
  ],
  views: [
    {
      id: 'monitoring',
      label: 'Metrics collection',
      caption: 'How metrics get from an application to a dashboard.',
      height: 'h-[28rem]',
      regions: [
        { label: 'Kubernetes cluster, monitoring deployed with Helm', x: 2, y: 4, w: 96, h: 92 },
      ],
      nodes: [
        node(
          'pods',
          'Application pods',
          16,
          22,
          E,
          'Expose metrics for Prometheus to collect.',
          'expose metrics'
        ),
        node(
          'sm',
          'ServiceMonitor',
          16,
          56,
          I,
          'A custom resource that tells Prometheus which services to scrape. Troubleshooting the ServiceMonitor CRD was part of this project. Scrape annotations were configured as the other way of marking targets.',
          'target discovery'
        ),
        node(
          'prom',
          'Prometheus',
          50,
          38,
          I,
          'Collects and stores metrics, deployed with Helm.',
          'scrape and store'
        ),
        node(
          'pv',
          'Storage class',
          50,
          78,
          I,
          'Kubernetes storage-class troubleshooting was part of this work. How the monitoring components use storage is not shown here.',
          'troubleshooting'
        ),
        node('grafana', 'Grafana', 84, 38, I, 'Dashboards that query Prometheus.', 'dashboards'),
        node(
          'ms',
          'metrics-server',
          84,
          78,
          I,
          'Serves the Kubernetes resource metrics API (CPU and memory). It is separate from the Prometheus pipeline.',
          'resource metrics'
        ),
      ],
      edges: [edge('prom', 'pods', 'scrape'), edge('sm', 'prom'), edge('grafana', 'prom', 'query')],
      steps: [
        {
          text: 'Application pods expose metrics. Targets are marked with ServiceMonitors or scrape annotations.',
          edges: [['sm', 'prom']],
        },
        {
          text: 'Prometheus scrapes the targets and stores the metrics.',
          edges: [['prom', 'pods']],
        },
        { text: 'Grafana queries Prometheus to draw dashboards.', edges: [['grafana', 'prom']] },
      ],
    },
  ],
  sections: [
    {
      id: 'intro',
      provenance: 'personal',
      body: 'A monitoring stack on Kubernetes. Prometheus and Grafana were deployed with Helm, with ServiceMonitors and scrape annotations for target discovery, and metrics-server for resource metrics.',
    },
    {
      id: 'problem',
      provenance: 'personal',
      body: 'A personal project to learn how metrics move from an application to a dashboard on Kubernetes, and what breaks along the way.',
    },
    {
      id: 'contribution',
      provenance: 'personal',
      body: 'I deployed the stack with Helm, configured metrics collection and dashboards, and worked through the problems that came up.',
    },
    {
      id: 'architecture',
      provenance: 'personal',
      body: 'Select a step to follow one metric through the pipeline.',
    },
    { id: 'stack', provenance: 'personal' },
    {
      id: 'implementation',
      provenance: 'personal',
      points: [
        'Prometheus and Grafana deployed with Helm.',
        'Scrape annotation configuration.',
        'Metrics collection and dashboard setup.',
        'metrics-server for Kubernetes resource metrics.',
      ],
    },
    {
      id: 'challenges',
      provenance: 'personal',
      points: ['ServiceMonitor CRD troubleshooting.', 'Kubernetes storage-class troubleshooting.'],
    },
    {
      id: 'outcome',
      provenance: 'personal',
      body: 'Metrics collection and dashboards were set up and working. This was practice and not production monitoring, and no alerting or reliability figures are published.',
    },
    {
      id: 'lessons',
      provenance: 'reference',
      points: [
        'Missing targets are usually a label or selector mismatch between a ServiceMonitor and its Service. Check those first.',
        'Monitoring data needs storage that actually provisions. A pod stuck on a volume is often a storage-class problem.',
      ],
    },
  ],
}
