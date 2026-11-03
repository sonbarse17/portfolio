import { edge, node, type Project } from './types'

const I = 'implemented' as const
const E = 'dependency' as const

export const dockerMicroservices: Project = {
  slug: 'docker-microservices',
  title: 'Docker Compose microservices',
  summary:
    'A personal Docker Compose project comprising two containerized applications: a media gallery with file uploads and a scrum tool built as services behind an API gateway.',
  classification: 'personal',
  category: 'Containers, microservices, reverse proxying',
  context: 'Personal engineering project',
  labels: [],
  tier: 'case',
  glance: [
    { label: 'Media Gallery', value: 'React, Node.js and MongoDB' },
    { label: 'Scrum tool', value: 'Four services, an API gateway and Nginx' },
    { label: 'Tooling', value: 'Docker Compose' },
  ],
  stackGroups: [
    { group: 'Containers', items: ['Docker', 'Docker Compose'] },
    {
      group: 'Media Gallery',
      items: ['React (3000)', 'Node.js (5000)', 'MongoDB (27017)', 'Multer'],
    },
    {
      group: 'Scrum microservices',
      items: [
        'Authentication service',
        'Project service',
        'Task service',
        'User service',
        'API Gateway',
        'Nginx reverse proxy',
        'MongoDB',
      ],
    },
  ],
  views: [
    {
      id: 'gallery',
      label: 'Media Gallery',
      caption: 'A three-container stack. Ports are the ones the services listen on.',
      height: 'h-[20rem]',
      regions: [{ label: 'Docker Compose stack', x: 24, y: 6, w: 74, h: 88 }],
      nodes: [
        node('browser', 'Browser', 11, 50, E, 'Loads the React app and uploads files.'),
        node(
          'react',
          'React frontend',
          37,
          50,
          I,
          'The user interface, served on port 3000.',
          'port 3000'
        ),
        node(
          'node',
          'Node.js backend',
          63,
          50,
          I,
          'The API. File uploads are handled with Multer.',
          'port 5000, Multer'
        ),
        node('mongo', 'MongoDB', 89, 50, I, 'The database, on port 27017.', 'port 27017'),
      ],
      edges: [edge('browser', 'react'), edge('react', 'node'), edge('node', 'mongo')],
      steps: [
        {
          text: 'The browser loads the React frontend on port 3000.',
          edges: [['browser', 'react']],
        },
        {
          text: 'The frontend calls the Node.js backend on port 5000. Uploaded files are handled with Multer.',
          edges: [['react', 'node']],
        },
        {
          text: 'The backend stores and reads data in MongoDB on port 27017.',
          edges: [['node', 'mongo']],
        },
      ],
    },
    {
      id: 'scrum',
      label: 'Scrum microservices',
      caption: 'Requests enter through Nginx and the API gateway, then reach one of four services.',
      height: 'h-[30rem]',
      regions: [{ label: 'Docker Compose stack', x: 2, y: 3, w: 96, h: 94 }],
      nodes: [
        node('client', 'Client', 14, 14, E, 'The browser or API client.'),
        node(
          'nginx',
          'Nginx',
          40,
          14,
          I,
          'The reverse proxy at the edge of the stack.',
          'reverse proxy'
        ),
        node(
          'gateway',
          'API Gateway',
          74,
          14,
          I,
          'Routes each request to the service that owns it.',
          'routing'
        ),
        node('auth', 'Auth service', 14, 52, I, 'Authentication.'),
        node('project', 'Project service', 38, 52, I, 'Projects.'),
        node('task', 'Task service', 62, 52, I, 'Tasks.'),
        node('user', 'User service', 86, 52, I, 'Users.'),
        node(
          'mongo',
          'MongoDB',
          50,
          86,
          I,
          'The database in the stack. Which service uses which collections is not shown here.',
          'database'
        ),
      ],
      edges: [
        edge('client', 'nginx'),
        edge('nginx', 'gateway'),
        edge('gateway', 'auth'),
        edge('gateway', 'project'),
        edge('gateway', 'task'),
        edge('gateway', 'user'),
      ],
      steps: [
        {
          text: 'The client sends a request to the Nginx reverse proxy.',
          edges: [['client', 'nginx']],
        },
        { text: 'Nginx forwards it to the API gateway.', edges: [['nginx', 'gateway']] },
        {
          text: 'The gateway routes it to the authentication, project, task or user service.',
          edges: [
            ['gateway', 'auth'],
            ['gateway', 'project'],
            ['gateway', 'task'],
            ['gateway', 'user'],
          ],
        },
      ],
    },
  ],
  sections: [
    {
      id: 'intro',
      provenance: 'personal',
      body: 'Two containerized applications run with Docker Compose. The Media Gallery is a React frontend, a Node.js backend and MongoDB. The scrum tool is split into authentication, project, task and user services behind an API gateway and an Nginx reverse proxy.',
    },
    {
      id: 'problem',
      provenance: 'personal',
      body: 'This personal project explores containerized multi-service applications: service discovery by name and port, API gateway routing, and reverse-proxy configuration.',
    },
    {
      id: 'contribution',
      provenance: 'personal',
      body: 'I containerized both applications and authored the Docker Compose configuration used to run them.',
    },
    {
      id: 'architecture',
      provenance: 'personal',
      body: 'Switch between the two stacks. In the scrum stack, select a step to see which routes it uses.',
    },
    { id: 'stack', provenance: 'personal' },
    {
      id: 'implementation',
      provenance: 'personal',
      points: [
        'Media Gallery: React on 3000, Node.js on 5000 and MongoDB on 27017, with Multer handling file uploads.',
        'Scrum tool: MongoDB, authentication, project, task and user services, an API gateway and an Nginx reverse proxy.',
      ],
    },
    {
      id: 'outcome',
      provenance: 'personal',
      body: 'Both stacks were implemented and run with Docker Compose. This was practice and not production work.',
    },
    {
      id: 'lessons',
      provenance: 'reference',
      points: [
        'A gateway keeps clients from knowing where each service lives, so services can move without client changes.',
        'Fixed, documented ports and service names make a Compose stack easy to reason about.',
      ],
    },
  ],
}
