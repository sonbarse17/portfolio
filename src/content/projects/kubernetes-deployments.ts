import { edge, node, type Project } from './types'

const I = 'implemented' as const
const E = 'dependency' as const

export const kubernetesDeployments: Project = {
  slug: 'kubernetes-deployments',
  title: 'Kubernetes application deployments',
  summary:
    'Two applications moved onto Kubernetes with persistent databases: a Rails and PostgreSQL app on GKE, and a Java and Tomcat app with MariaDB.',
  classification: 'personal',
  category: 'Kubernetes, stateful workloads, ingress',
  context: 'Personal engineering project',
  labels: [],
  tier: 'case',
  lab: 'cluster',
  glance: [
    { label: 'Rails app', value: 'Rails 7 and a PostgreSQL StatefulSet on GKE' },
    { label: 'Java app', value: 'Tomcat 9 with a MariaDB StatefulSet' },
    { label: 'Focus', value: 'Persistent storage, ingress routing, health checks' },
  ],
  stackGroups: [
    { group: 'Platform', items: ['Kubernetes', 'GKE', 'Amazon EKS', 'Docker'] },
    { group: 'Networking', items: ['Kubernetes Ingress', 'Nginx Ingress'] },
    { group: 'Rails app', items: ['Ruby on Rails 7', 'Puma (port 3000)', 'PostgreSQL'] },
    { group: 'Java app', items: ['Tomcat 9', 'Amazon Linux', 'JDBC', 'MariaDB'] },
    { group: 'Storage and packaging', items: ['Persistent Volumes', 'Helm'] },
  ],
  views: [
    {
      id: 'rails',
      label: 'Student Management (Rails)',
      caption: 'Rails 7 with a PostgreSQL StatefulSet on GKE.',
      height: 'h-[26rem]',
      regions: [{ label: 'GKE cluster', x: 27, y: 4, w: 70, h: 92 }],
      nodes: [
        node('client', 'Browser', 12, 22, E, 'Sends HTTP requests to the application.'),
        node(
          'ingress',
          'Kubernetes Ingress',
          38,
          22,
          I,
          'Routes external traffic into the cluster. Ingress rewrite configuration was set up for the application.',
          'rewrite rules'
        ),
        node(
          'rails',
          'Rails 7 app',
          64,
          22,
          I,
          'The Rails 7 application, served by the Puma application server on port 3000. Database migrations run against PostgreSQL.',
          'Puma :3000'
        ),
        node(
          'db',
          'PostgreSQL',
          64,
          54,
          I,
          'Runs as a StatefulSet so the database keeps a stable identity and its storage.',
          'StatefulSet'
        ),
        node(
          'pv',
          'Persistent storage',
          64,
          84,
          I,
          'Persistent storage holding the PostgreSQL data, so it outlives the pod.',
          'volume'
        ),
      ],
      edges: [
        edge('client', 'ingress'),
        edge('ingress', 'rails'),
        edge('rails', 'db'),
        edge('db', 'pv'),
      ],
      steps: [
        {
          text: 'A request enters the cluster through the Kubernetes Ingress, with the rewrite configuration applied.',
          edges: [['client', 'ingress']],
        },
        {
          text: 'The Ingress routes it to the Rails 7 application, served by Puma on port 3000.',
          edges: [['ingress', 'rails']],
        },
        {
          text: 'The application connects to PostgreSQL. Migrations are run against this database.',
          edges: [['rails', 'db']],
        },
        {
          text: 'PostgreSQL stores its data on persistent storage, so a restarted pod keeps its data.',
          edges: [['db', 'pv']],
        },
      ],
    },
    {
      id: 'tomcat',
      label: 'Student Application (Java)',
      caption: 'Tomcat 9 with a MariaDB StatefulSet, migrated to Kubernetes.',
      height: 'h-[26rem]',
      regions: [{ label: 'Kubernetes cluster', x: 27, y: 4, w: 70, h: 92 }],
      nodes: [
        node('client', 'Browser', 12, 22, E, 'Sends HTTP requests to the application.'),
        node(
          'ingress',
          'Kubernetes Ingress',
          38,
          22,
          I,
          'Routes external traffic to the application.',
          'routing'
        ),
        node(
          'tomcat',
          'Tomcat 9 app',
          64,
          22,
          I,
          'The Java application running on Tomcat 9, on an Amazon Linux base.',
          'Tomcat 9'
        ),
        node(
          'db',
          'MariaDB',
          64,
          54,
          I,
          'The application database, run as a StatefulSet. MariaDB is MySQL-compatible.',
          'StatefulSet'
        ),
        node(
          'pvc',
          'Persistent Volume Claim',
          64,
          84,
          I,
          'Claims persistent storage for the database.',
          'storage'
        ),
      ],
      edges: [
        edge('client', 'ingress'),
        edge('ingress', 'tomcat'),
        edge('tomcat', 'db', 'JDBC'),
        edge('db', 'pvc'),
      ],
      steps: [
        {
          text: 'A request enters through the Kubernetes Ingress routing.',
          edges: [['client', 'ingress']],
        },
        {
          text: 'The Ingress routes it to the Tomcat 9 application.',
          edges: [['ingress', 'tomcat']],
        },
        {
          text: 'The application reaches the database through its JDBC configuration.',
          edges: [['tomcat', 'db']],
        },
        {
          text: 'MariaDB stores its data through a Persistent Volume Claim.',
          edges: [['db', 'pvc']],
        },
      ],
    },
  ],
  sections: [
    {
      id: 'intro',
      provenance: 'personal',
      body: 'Two applications deployed to Kubernetes with their databases running as StatefulSets on persistent storage: a Ruby on Rails app with PostgreSQL on GKE, and a Java and Tomcat app with MariaDB.',
    },
    {
      id: 'problem',
      provenance: 'personal',
      body: 'A personal project for hands-on practice running stateful applications on Kubernetes: databases that must keep their data, traffic that must reach the right pods, and health checks that must agree with the platform.',
    },
    {
      id: 'contribution',
      provenance: 'personal',
      body: 'I implemented both applications on Kubernetes: the database StatefulSets with persistent storage, the ingress routing, and the Kubernetes migration of the Tomcat application.',
    },
    {
      id: 'architecture',
      provenance: 'personal',
      body: 'Switch between the two applications to see how each connects to its database.',
    },
    { id: 'stack', provenance: 'personal' },
    {
      id: 'implementation',
      provenance: 'personal',
      points: [
        'Rails 7 application with a PostgreSQL StatefulSet and persistent storage.',
        'Kubernetes Ingress with rewrite configuration.',
        'Puma application server on port 3000, with database migrations.',
        'Java and Tomcat 9 application on an Amazon Linux base, migrated to Kubernetes.',
        'MariaDB as a MySQL-compatible StatefulSet with a Persistent Volume Claim.',
        'JDBC configuration connecting the application to the database.',
      ],
    },
    {
      id: 'challenges',
      provenance: 'personal',
      points: [
        'NEG health-check troubleshooting on GKE.',
        'Ingress rewrite configuration.',
        'Database migrations for the Rails application.',
        'JDBC configuration for the migrated Tomcat application.',
      ],
    },
    {
      id: 'outcome',
      provenance: 'personal',
      body: 'Both applications were implemented on Kubernetes, with their data on persistent storage. This was practice and not production work, and no performance figures are published.',
    },
    {
      id: 'lessons',
      provenance: 'reference',
      points: [
        'A StatefulSet with persistent storage gives a database a stable identity, and the data survives pod restarts.',
        'A health check that fails is often a routing or path problem, not an application bug. Check what the probe really requests.',
      ],
    },
  ],
}
