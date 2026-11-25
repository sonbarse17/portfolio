import { domains } from '@/content/atlas'
import { chapters } from '@/content/chapters'
import { labs } from '@/content/labs'
import { projects } from '@/content/projects'
import { services } from '@/content/services'

type Entry = {
  title: string
  href: string
  group: string
  keywords?: string
}

export const destinations: Entry[] = [
  { title: 'Résumé', href: '/resume', group: 'Profile', keywords: 'resume CV printable PDF' },
  { title: 'Selected projects', href: '/work', group: 'Work', keywords: 'portfolio cases' },
  { title: 'Infrastructure labs', href: '/lab', group: 'Lab', keywords: 'interactive simulation' },
  { title: 'Engineering field guide', href: '/atlas', group: 'Atlas', keywords: 'technical notes' },
  { title: 'Freelance services', href: '/freelance', group: 'Services' },
  ...chapters.map(({ id, label, terms }) => ({
    title: label === 'Release' ? 'Interactive deployment' : label,
    href: `/#${id}`,
    group: 'Home',
    keywords: terms,
  })),
  ...projects.map((project) => ({
    title: project.title,
    href: `/work/${project.slug}`,
    group: project.classification === 'professional' ? 'Case study' : 'Project',
    keywords: project.category,
  })),
  ...labs.map((lab) => ({
    title: lab.title,
    href: `/lab/${lab.slug}`,
    group: 'Lab',
    keywords: lab.question,
  })),
  ...domains.map((domain) => ({
    title: domain.title,
    href: `/atlas#${domain.id}`,
    group: 'Atlas',
  })),
  ...services.map((service) => ({
    title: service.title,
    href: `/services/${service.id}`,
    group: 'Service',
  })),
]

export function searchable(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}
