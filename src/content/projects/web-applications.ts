import { edge, node, type Project } from './types'

const I = 'implemented' as const
const E = 'dependency' as const

export const webApplications: Project = {
  slug: 'web-applications',
  title: 'Personal web applications and hosting',
  summary:
    'Two personal web projects: a Next.js site with more than 50 client-side calculators, and this static Next.js portfolio hosted on Firebase Hosting with a custom domain.',
  classification: 'personal',
  category: 'Web applications, static hosting, DNS',
  context: 'Personal engineering projects',
  labels: [],
  tier: 'case',
  glance: [
    { label: 'SaveMoneyTools', value: '50+ client-side calculators on Next.js 15' },
    { label: 'This portfolio', value: 'Static Next.js export on Firebase Hosting' },
    { label: 'Also', value: 'Custom domains, DNS and TLS troubleshooting' },
  ],
  stackGroups: [
    {
      group: 'Calculators site',
      items: [
        'Next.js 15 (App Router)',
        'TypeScript',
        'Tailwind CSS',
        'shadcn/ui',
        'Recharts',
        'LocalStorage',
      ],
    },
    {
      group: 'Portfolio',
      items: [
        'Next.js',
        'Firebase Hosting',
        'Custom domain',
        'Three.js, React Three Fiber and ThreeGlobe (earlier version)',
      ],
    },
    { group: 'Also used', items: ['Astro'] },
  ],
  views: [
    {
      id: 'calculators',
      label: 'SaveMoneyTools',
      caption: 'A client-side architecture: calculations and saved data stay in the browser.',
      height: 'h-[18rem]',
      regions: [{ label: 'Runs in the browser', x: 24, y: 8, w: 74, h: 84 }],
      nodes: [
        node('visitor', 'Visitor', 11, 50, E, 'Opens a calculator page.'),
        node(
          'pages',
          'Next.js pages',
          37,
          50,
          I,
          'Pages built with the App Router, written in TypeScript with Tailwind CSS and shadcn/ui. Static export was a design consideration.',
          'App Router'
        ),
        node(
          'calc',
          'Calculators',
          63,
          50,
          I,
          'Over 50 calculators, with Recharts for charts. All calculation happens in the browser.',
          '50+'
        ),
        node(
          'ls',
          'LocalStorage',
          89,
          50,
          I,
          'Saved inputs and preferences are stored in the browser.',
          'saved data'
        ),
      ],
      edges: [edge('visitor', 'pages'), edge('pages', 'calc'), edge('calc', 'ls')],
      steps: [
        { text: 'A visitor opens a calculator page.', edges: [['visitor', 'pages']] },
        { text: 'The page runs a calculator entirely in the browser.', edges: [['pages', 'calc']] },
        {
          text: 'Saved data is kept in LocalStorage. No server stores it.',
          edges: [['calc', 'ls']],
        },
      ],
    },
    {
      id: 'portfolio',
      label: 'This portfolio',
      caption: 'How this site is built and served.',
      height: 'h-[18rem]',
      nodes: [
        node(
          'src',
          'Next.js source',
          12,
          50,
          I,
          'This repository. It builds as a static export.',
          'static export'
        ),
        node(
          'fh',
          'Firebase Hosting',
          38,
          50,
          I,
          'Serves the exported files, and sets the security headers.',
          'hosting'
        ),
        node(
          'dns',
          'Custom domain',
          64,
          50,
          I,
          'The sushantsonbarse.in domain, with DNS and domain verification configured.',
          'DNS'
        ),
        node(
          'ssl',
          'TLS',
          88,
          50,
          I,
          'Certificates for the custom domain. TLS and domain verification troubleshooting was part of the work.',
          'TLS'
        ),
      ],
      edges: [edge('src', 'fh', 'deploy'), edge('fh', 'dns'), edge('dns', 'ssl')],
      steps: [
        { text: 'The Next.js site is built as a static export.', edges: [['src', 'fh']] },
        { text: 'Firebase Hosting serves the files.', edges: [['fh', 'dns']] },
        {
          text: 'The custom domain points at the site and is served with TLS.',
          edges: [['dns', 'ssl']],
        },
      ],
    },
  ],
  sections: [
    {
      id: 'intro',
      provenance: 'personal',
      body: 'Two personal web projects. SaveMoneyTools is a set of more than 50 calculators built client-side. This portfolio is a static Next.js site on Firebase Hosting with a custom domain.',
    },
    {
      id: 'problem',
      provenance: 'personal',
      body: 'These personal projects explore client-side application design, static exports, search visibility, and custom-domain hosting.',
    },
    {
      id: 'contribution',
      provenance: 'personal',
      body: 'I built both sites, configured their hosting, and resolved domain, SEO, and Google Search Console issues.',
    },
    { id: 'architecture', provenance: 'personal', body: 'Switch tabs between the two projects.' },
    { id: 'stack', provenance: 'personal' },
    {
      id: 'implementation',
      provenance: 'personal',
      points: [
        'SaveMoneyTools: Next.js 15 App Router in TypeScript, with Tailwind CSS, shadcn/ui and Recharts.',
        'SaveMoneyTools: a client-side architecture with LocalStorage, and static export considerations.',
        'SaveMoneyTools: SEO and sitemap configuration, and AdSense readiness.',
        'Portfolio: Firebase Hosting with a custom domain and DNS management.',
        'Portfolio: an earlier version used Three.js, React Three Fiber and ThreeGlobe for a globe visualization.',
      ],
    },
    {
      id: 'challenges',
      provenance: 'personal',
      points: [
        'Google Search Console troubleshooting for SaveMoneyTools.',
        'TLS and domain verification troubleshooting for the custom domain on Firebase Hosting.',
      ],
    },
    {
      id: 'outcome',
      provenance: 'personal',
      body: 'Both sites were built and hosted. Traffic, ranking, and revenue figures are not reported.',
    },
    {
      id: 'lessons',
      provenance: 'reference',
      points: [
        'A static export has no server, so headers, redirects and caching belong in the host configuration.',
        'Domain verification and TLS depend on DNS being correct first. Check DNS before debugging certificates.',
      ],
    },
  ],
}
