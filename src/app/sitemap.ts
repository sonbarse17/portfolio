import type { MetadataRoute } from 'next'
import { projects } from '@/content/projects'
import { labs } from '@/content/labs'
import { services } from '@/content/services'
import { site } from '@/content/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '',
    '/work',
    '/lab',
    '/atlas',
    '/freelance',
    ...projects.map((p) => `/work/${p.slug}`),
    ...labs.map((l) => `/lab/${l.slug}`),
    ...services.map((s) => `/services/${s.id}`),
  ]
  return paths.map((path) => ({ url: `${site.url}${path}` }))
}
