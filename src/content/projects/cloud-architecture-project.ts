import type { Project } from './types'

/**
 * This is a separate project with its own architecture. No architecture source material exists in
 * this repository, so only verified facts are published and no diagram is drawn. Do not copy another
 * project's architecture here. A test enforces that boundary.
 */
export const cloudArchitectureProject: Project = {
  slug: 'cloud-architecture-project',
  title: 'Cloud architecture project',
  summary:
    'A cloud architecture and engineering project. Its architecture write-up is not published yet, and none is shown until it can be verified.',
  classification: 'professional',
  category: 'Cloud architecture and engineering',
  context: 'Professional project, overview only',
  labels: ['Overview only'],
  tier: 'overview',
  glance: [
    { label: 'Category', value: 'Cloud architecture and engineering' },
    { label: 'Architecture', value: 'Its own, separate from every other project here' },
    { label: 'Status of this page', value: 'Overview. Architecture not yet published' },
  ],
  stackGroups: [],
  sections: [
    {
      id: 'intro',
      provenance: 'record',
      body: 'This is a cloud architecture and engineering project. It has its own dedicated architecture, which is separate from the other projects on this site and must not be read as related to them.',
    },
    {
      id: 'architecture',
      provenance: 'record',
      body: 'There is no architecture diagram here on purpose. The details needed to draw one accurately, such as components, connections, deployment boundaries and responsibilities, are not published yet, and a guessed diagram would present assumptions as fact. A diagram and full write-up will be added when verified source material is available.',
    },
  ],
}
