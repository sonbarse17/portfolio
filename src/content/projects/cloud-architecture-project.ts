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
    'A cloud architecture project where I designed and deployed every component myself. Its architecture is private, so no diagram or component list is published.',
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
      body: 'This is a cloud architecture project. I designed and deployed every component myself. It has its own dedicated architecture, which is separate from the other projects on this site and must not be read as related to them.',
    },
    {
      id: 'architecture',
      provenance: 'record',
      body: 'The architecture is private, so there is no diagram and no list of components here. Only the existence of the project and my role in it are published.',
    },
  ],
}
