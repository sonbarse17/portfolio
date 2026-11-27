import type { Metadata } from 'next'
import { FeaturedWork, featuredProjectSlugs } from '@/components/featured-work'
import { ProjectRow } from '@/components/project-parts'
import { RouteIntro } from '@/components/route-intro'
import { personal, professional } from '@/content/projects'

export const metadata: Metadata = {
  title: 'Work',
  description:
    'Professional case studies in Azure internal access and AWS hosting with SSO, plus personal projects in Kubernetes, Docker, monitoring and CI/CD.',
}

export default function WorkPage() {
  return (
    <main className="wrap">
      <RouteIntro label="Engineering portfolio" title="Work">
        <p className="lede">
          Selected cloud and DevOps work across AWS, Azure, Kubernetes, CI/CD, and infrastructure
          automation.
        </p>
      </RouteIntro>

      <section aria-labelledby="professional" className="catalog-section">
        <h2 id="professional" className="display text-3xl sm:text-4xl">
          Professional case studies
        </h2>
        <FeaturedWork fullTitles />
        <ul className="catalog-list mt-8">
          {professional
            .filter((project) => !featuredProjectSlugs.has(project.slug))
            .map((project) => (
              <ProjectRow key={project.slug} project={project} />
            ))}
        </ul>
      </section>

      <section aria-labelledby="personal" className="catalog-section">
        <h2 id="personal" className="display text-3xl sm:text-4xl">
          Personal projects
        </h2>
        <ul className="catalog-list">
          {personal.map((project) => (
            <ProjectRow key={project.slug} project={project} />
          ))}
        </ul>
      </section>
    </main>
  )
}
