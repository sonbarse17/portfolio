import { edge, node, type Project } from './types'

const I = 'implemented' as const
const E = 'dependency' as const

export const prometheusGrafana: Project = {
  slug: 'prometheus-grafana',
  title: 'Prometheus and Grafana on Kubernetes',
  summary:
    'A personal Kubernetes observability project deploying Prometheus and Grafana with Helm, including metrics collection, dashboard configuration, and ServiceMonitor and storage troubleshooting.',
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
      body: 'This personal project explores how application metrics move through a Kubernetes monitoring stack, from collection to dashboarding, and how to diagnose common configuration failures.',
    },
    {
      id: 'contribution',
      provenance: 'personal',
      body: 'I deployed the stack with Helm, configured metrics collection and dashboards, and investigated the configuration issues encountered during implementation.',
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
      body: 'The monitoring stack collected metrics and supported dashboards. This personal project does not represent production monitoring; alerting and reliability figures are not reported.',
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
