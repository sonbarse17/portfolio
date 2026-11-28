import { labs } from '../src/content/labs'
import { projects } from '../src/content/projects'
import { services } from '../src/content/services'

export const routes = [
  '/',
  '/work',
  '/lab',
  '/lab/studio',
  '/atlas',
  '/freelance',
  '/resume',
  ...projects.map((p) => `/work/${p.slug}`),
  ...labs.map((l) => `/lab/${l.slug}`),
  ...services.map((s) => `/services/${s.id}`),
]
