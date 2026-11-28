import Link from 'next/link'
import { hasProjectArtwork, ProjectArtwork } from '@/components/project-artwork'
import { personal, professional, type Project } from '@/content/projects'
import { pageMetadata } from '@/lib/metadata'
import './case-study.css'

export const metadata = pageMetadata(
  '/work',
  'Work',
  'Professional case studies in Azure internal access and AWS hosting with SSO, plus personal projects in Kubernetes, Docker, monitoring and CI/CD.'
)

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="work-list">
      {projects.map((project) => (
        <li key={project.slug}>
          <Link href={`/work/${project.slug}`} className="work-list-link">
            <h3>{project.title}</h3>
            <p>{project.summary}</p>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function WorkPage() {
  const illustrated = professional.filter(({ slug }) => hasProjectArtwork(slug))
  const other = professional.filter(({ slug }) => !hasProjectArtwork(slug))

  return (
    <main className="wrap work-index">
      <header className="work-intro">
        <h1>Work</h1>
        <div>
          <p className="work-standfirst">
            How I build, secure, and run cloud infrastructure, from enterprise access to container
            deployments.
          </p>
          <nav className="work-index-links" aria-label="Project categories">
            <a href="#professional" className="text-link">
              Professional case studies
            </a>
            <a href="#personal" className="text-link">
              Personal projects
            </a>
          </nav>
        </div>
      </header>

      <section className="work-group" aria-labelledby="professional">
        <h2 id="professional">Professional case studies</h2>
        <div className="work-profiles">
          {illustrated.map((project, index) => (
            <article key={project.slug} className="work-profile">
              <Link href={`/work/${project.slug}`} className="work-profile-link" prefetch={false}>
                <figure>
                  <ProjectArtwork slug={project.slug} cover={index === 0} />
                  <figcaption>Concept illustration</figcaption>
                </figure>
                <div className="work-profile-description">
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
        <ProjectList projects={other} />
      </section>

      <section className="work-group" aria-labelledby="personal">
        <h2 id="personal">Personal projects</h2>
        <ProjectList projects={personal} />
      </section>
    </main>
  )
}
