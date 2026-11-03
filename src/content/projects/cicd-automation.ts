import { edge, node, type Project } from './types'

const I = 'implemented' as const

export const cicdAutomation: Project = {
  slug: 'cicd-automation',
  title: 'CI/CD and infrastructure automation',
  summary:
    'Node.js pipelines in GitHub Actions, a Jenkins master and agent, security scanning, and Terraform-based GKE infrastructure.',
  classification: 'personal',
  category: 'CI/CD, infrastructure as code',
  context: 'Personal engineering project',
  labels: [],
  tier: 'case',
  lab: 'release-path',
  glance: [
    { label: 'Pipelines', value: 'Lint, test and build for Node.js, plus Docker image builds' },
    { label: 'Scanning', value: 'SonarCloud and OWASP Dependency-Check' },
    { label: 'Infrastructure', value: 'GKE defined in Terraform' },
  ],
  stackGroups: [
    { group: 'CI/CD', items: ['GitHub Actions', 'Jenkins', 'Docker Buildx'] },
    { group: 'Code and dependency analysis', items: ['SonarCloud', 'OWASP Dependency-Check'] },
    { group: 'Infrastructure', items: ['Terraform', 'GKE', 'Kubernetes'] },
  ],
  views: [
    {
      id: 'pipeline',
      label: 'Node.js pipeline',
      caption:
        'The stages of the Node.js CI pipeline. The analysis tools are shown separately, because where they run is not drawn here.',
      height: 'h-[24rem]',
      regions: [{ label: 'Code and dependency analysis tools used', x: 14, y: 62, w: 72, h: 34 }],
      nodes: [
        node('lint', 'Lint', 14, 30, I, 'Static checks on the code.'),
        node('test', 'Test', 38, 30, I, 'Automated tests.'),
        node('build', 'Build', 62, 30, I, 'Builds the application.'),
        node(
          'image',
          'Docker image',
          86,
          30,
          I,
          'Container image built with Docker Buildx.',
          'Buildx'
        ),
        node('sonar', 'SonarCloud', 32, 80, I, 'Code quality analysis.'),
        node(
          'owasp',
          'Dependency-Check',
          68,
          80,
          I,
          'OWASP scanning of project dependencies for known vulnerabilities.',
          'OWASP'
        ),
      ],
      edges: [edge('lint', 'test'), edge('test', 'build'), edge('build', 'image')],
      steps: [
        { text: 'Lint checks the code.', edges: [['lint', 'test']] },
        { text: 'Tests run.', edges: [['test', 'build']] },
        {
          text: 'The application is built, then packaged as a Docker image with Buildx.',
          edges: [['build', 'image']],
        },
      ],
    },
    {
      id: 'jenkins',
      label: 'Jenkins',
      caption: 'A Jenkins master and agent configuration.',
      height: 'h-[16rem]',
      nodes: [
        node(
          'master',
          'Jenkins master',
          30,
          50,
          I,
          'Coordinates jobs and holds the configuration.',
          'controller'
        ),
        node(
          'agent',
          'Jenkins agent',
          70,
          50,
          I,
          'Runs the build work handed to it by the master.',
          'build worker'
        ),
      ],
      edges: [edge('master', 'agent', 'jobs')],
      steps: [
        { text: 'The master schedules work and the agent runs it.', edges: [['master', 'agent']] },
      ],
    },
    {
      id: 'infra',
      label: 'Terraform and GKE',
      caption:
        'Infrastructure automation. The workflow and Terraform are shown separately because how they connect is not drawn here.',
      height: 'h-[20rem]',
      regions: [{ label: 'Infrastructure automation', x: 4, y: 6, w: 92, h: 88 }],
      nodes: [
        node(
          'gha',
          'GitHub Actions',
          18,
          50,
          I,
          'GitHub Actions workflows used for infrastructure automation.',
          'automation'
        ),
        node(
          'tf',
          'Terraform',
          50,
          50,
          I,
          'Defines the GKE infrastructure as code.',
          'infrastructure as code'
        ),
        node(
          'gke',
          'GKE cluster',
          82,
          50,
          I,
          'The Google Kubernetes Engine cluster defined in Terraform.',
          'Kubernetes'
        ),
      ],
      edges: [edge('tf', 'gke', 'provisions')],
    },
  ],
  sections: [
    {
      id: 'intro',
      provenance: 'personal',
      body: 'Personal CI/CD and automation work: Node.js pipelines in GitHub Actions, a Jenkins master and agent, security scanning, and GKE infrastructure defined in Terraform.',
    },
    {
      id: 'problem',
      provenance: 'personal',
      body: 'A personal project for practice with the delivery pipeline end to end: checking code, building images, scanning for problems, and defining the infrastructure that runs it.',
    },
    {
      id: 'contribution',
      provenance: 'personal',
      body: 'I wrote the pipelines and the infrastructure code, and set up the Jenkins master and agent.',
    },
    {
      id: 'architecture',
      provenance: 'personal',
      body: 'Switch tabs for the pipeline, Jenkins and the infrastructure automation.',
    },
    { id: 'stack', provenance: 'personal' },
    {
      id: 'implementation',
      provenance: 'personal',
      points: [
        'Node.js CI pipelines with lint, test and build stages.',
        'Docker image builds with Docker Buildx.',
        'SonarCloud analysis and OWASP Dependency-Check scanning.',
        'Jenkins master and agent configuration.',
        'Terraform-based GKE infrastructure.',
        'GitHub Actions infrastructure automation.',
      ],
    },
    {
      id: 'outcome',
      provenance: 'personal',
      body: 'The pipelines and infrastructure code were implemented. This is hands-on practice and does not claim enterprise-scale delivery, so no deployment frequency or lead-time figures are published.',
    },
    {
      id: 'lessons',
      provenance: 'reference',
      points: [
        'Order stages from cheapest to most expensive, so most failures surface within minutes.',
        'A scanner that fails on everything gets disabled. Decide what blocks a build before turning it on.',
      ],
    },
  ],
}
