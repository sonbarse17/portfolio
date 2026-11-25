import Link from 'next/link'
import { ArchitecturePreview } from '@/components/architecture-preview'
import { ProjectArtwork } from '@/components/project-artwork'
import { ClassificationTag } from '@/components/project-parts'
import { professional } from '@/content/projects'

const featured = [
  {
    slug: 'azure-internal-access',
    view: 'traffic',
    title: 'Internal access on Azure',
    stack: 'Azure · Networking · Entra ID',
    tone: 'lilac',
  },
  {
    slug: 'aws-hosting-and-sso',
    view: 'static',
    title: 'AWS hosting with enterprise SSO',
    stack: 'AWS · CloudFront · Cognito',
    tone: 'mint',
  },
] as const

export const featuredProjectSlugs = new Set<string>(featured.map((item) => item.slug))

export function FeaturedWork({ fullTitles = false }: { fullTitles?: boolean }) {
  return (
    <div className="featured-grid">
      {featured.map((item) => {
        const project = professional.find((project) => project.slug === item.slug)!
        const view = project.views?.find((view) => view.id === item.view)

        return (
          <article key={project.slug}>
            <Link href={`/work/${project.slug}`} className="featured-case">
              <ProjectArtwork slug={project.slug}>
                {view && <ArchitecturePreview view={view} tone={item.tone} />}
              </ProjectArtwork>
              <div className="featured-body">
                <p className="featured-meta">
                  <ClassificationTag project={project} />
                  <span>{item.stack}</span>
                </p>
                <h3 className="display">{fullTitles ? project.title : item.title}</h3>
                <p className="featured-summary">{project.summary}</p>
                <span className="featured-action">Read case study</span>
              </div>
            </Link>
          </article>
        )
      })}
    </div>
  )
}
