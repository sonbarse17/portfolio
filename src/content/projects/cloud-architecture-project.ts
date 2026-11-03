import type { Project } from './types'

/**
 * A separate project with its own architecture. The architecture is private, so only the fact that the
 * project exists is published and no diagram is drawn. Do not copy another project's architecture here.
 * A test enforces that boundary.
 */
export const cloudArchitectureProject: Project = {
  slug: 'cloud-architecture-project',
  title: 'Cloud architecture project',
  summary:
    'A private cloud architecture engagement for which I designed and deployed the complete solution. Technical details are intentionally not published.',
  classification: 'professional',
  category: 'Cloud architecture and engineering',
  context: 'Overview only',
  labels: ['Overview only'],
  tier: 'overview',
  glance: [
    { label: 'Category', value: 'Cloud architecture and engineering' },
    { label: 'My role', value: 'Designed and deployed every component myself' },
    { label: 'Architecture', value: 'Private, not published' },
  ],
  stackGroups: [],
  sections: [
    {
      id: 'intro',
      provenance: 'record',
      body: 'This engagement covered a cloud architecture solution that I designed and deployed in full. Its architecture is independent of the other projects on this site and is not presented as related to them.',
    },
    {
      id: 'architecture',
      provenance: 'record',
      body: 'The architecture is private; therefore, this page does not include a diagram or component inventory. It documents only the engagement and my role.',
    },
  ],
}
