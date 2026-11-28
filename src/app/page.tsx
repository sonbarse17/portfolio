import Image from 'next/image'
import Link from 'next/link'
import { ContactForm } from '@/components/contact-form'
import { HomeKeys } from '@/components/home-keys'
import { ProjectArtwork } from '@/components/project-artwork'
import { TerminalHero, type HeroProject } from '@/components/terminal-hero'
import { roles, site } from '@/content/site'
import { pageMetadata } from '@/lib/metadata'
import './terminal-home.css'

export const metadata = pageMetadata('/')

const profileJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ProfilePage',
  url: `${site.url}/`,
  mainEntity: {
    '@type': 'Person',
    '@id': `${site.url}/#sushant-sonbarse`,
    name: site.name,
    jobTitle: site.role,
    url: `${site.url}/`,
    image: `${site.url}/assets/images/profile.jpg`,
    sameAs: [site.github, site.linkedin],
  },
}

const selectedWork: readonly HeroProject[] = [
  {
    slug: 'azure-internal-access',
    label: 'Azure · Private networking',
    title: 'Internal access on Azure',
    summary: 'A private route to internal applications with Microsoft Entra ID at the boundary.',
  },
  {
    slug: 'crm-on-eks',
    label: 'HisanLabs · Kubernetes',
    title: '35+ microservices on AWS EKS',
    summary: 'A Terraform-managed AWS deployment for an Angular and Spring Boot CRM.',
  },
  {
    slug: 'aws-hosting-and-sso',
    label: 'AWS · Hosting and identity',
    title: 'AWS hosting with enterprise SSO',
    summary:
      'Static hosting and enterprise sign-in, with delivery and identity handled separately.',
  },
]

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return <span aria-hidden="true">{diagonal ? '↗' : '→'}</span>
}

function BufferPath({ children }: { children: string }) {
  return (
    <p className="buffer-path" aria-hidden="true">
      {children}
    </p>
  )
}

export default function Home() {
  return (
    <main className="editorial-home">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd).replace(/</g, '\\u003c') }}
      />
      <HomeKeys />
      <TerminalHero work={selectedWork} />

      <section className="wrap editorial-section editorial-work" aria-labelledby="work">
        <BufferPath>~/sushant/work/</BufferPath>
        <div className="editorial-heading">
          <div>
            <p className="editorial-label">Case studies</p>
            <h2 id="work" className="editorial-title">
              Selected work
            </h2>
          </div>
          <Link href="/work" className="editorial-link" data-nav-stop="">
            All projects <Arrow />
          </Link>
        </div>
        <div className="editorial-projects">
          {selectedWork.map((project, i) => (
            <article className="editorial-project" key={project.slug}>
              <Link
                href={`/work/${project.slug}`}
                className="editorial-project-link"
                prefetch={false}
              >
                <ProjectArtwork slug={project.slug} />
                <div className="editorial-project-copy">
                  <p className="editorial-label">{project.label}</p>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <span className="editorial-project-arrow">
                    <Arrow diagonal />
                  </span>
                </div>
              </Link>
              {i === 0 && (
                <p className="editorial-image-note">Project covers are conceptual illustrations.</p>
              )}
            </article>
          ))}
        </div>
      </section>

      <section id="about" className="editorial-about" aria-labelledby="about-title">
        <div className="wrap editorial-about-inner">
          <BufferPath>~/sushant/about.md</BufferPath>
          <p className="editorial-label">About me</p>
          <h2 id="about-title" className="editorial-title">
            From computer science to production.
          </h2>
          <div className="editorial-about-copy">
            <p>
              I came to DevOps through computer science and hands-on cloud training. At HisanLabs, I
              put that into practice by deploying a CRM on EKS and automating its AWS infrastructure
              with Terraform.
            </p>
            <p>
              I now work with teams on CI/CD, cloud infrastructure, and Kubernetes. I start by
              asking what can fail, what the team will be able to see, and how they’ll recover.
            </p>
            <div id="capabilities" className="editorial-about-links">
              <Link href="/atlas" className="editorial-link" data-nav-stop="">
                Read the field guide <Arrow />
              </Link>
              <Link href="/lab/studio#capabilities" className="editorial-link">
                Explore the tools in context <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap editorial-section editorial-experience" aria-labelledby="record">
        <BufferPath>~/sushant/git log --career</BufferPath>
        <div className="editorial-heading">
          <h2 id="record" className="editorial-title">
            Experience
          </h2>
          <Link href="/resume" className="editorial-link" data-nav-stop="">
            Full résumé <Arrow diagonal />
          </Link>
        </div>
        <ol className="editorial-roles">
          {roles.map((role) => (
            <li key={role.title} className="editorial-role">
              <p className="editorial-role-date">{role.when}</p>
              <div>
                <h3>{role.title}</h3>
                <p className="editorial-org">
                  {role.org} · {role.where}
                </p>
              </div>
              <div className="editorial-role-detail">
                {role.current ? (
                  <p>
                    I set up and improve CI/CD pipelines, design cloud infrastructure, and help
                    teams run workloads on Kubernetes.
                  </p>
                ) : (
                  <>
                    <p>
                      I deployed a CRM with 35+ microservices and automated its AWS infrastructure
                      with Terraform. Deployment time went from two hours to 30 minutes and CI/CD
                      pipeline efficiency improved by 40% during the internship.
                    </p>
                    <Link href="/work/crm-on-eks" className="editorial-link">
                      Read the HisanLabs case study <Arrow />
                    </Link>
                  </>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="editorial-lab" aria-labelledby="lab-title">
        <div className="wrap editorial-lab-inner">
          <div className="editorial-lab-copy">
            <BufferPath>~/sushant/lab/</BufferPath>
            <p className="editorial-label">Interactive experiments</p>
            <h2 id="lab-title" className="editorial-title">
              The lab
            </h2>
            <p>
              Follow a release to production, take an availability zone offline, or see how an
              identity policy makes a decision.
            </p>
            <Link href="/lab" className="editorial-link" data-nav-stop="">
              Explore the lab <Arrow />
            </Link>
            <ul className="editorial-lab-links">
              <li id="pipeline">
                <Link href="/lab/studio#pipeline">Release pipeline</Link>
              </li>
              <li id="break-it">
                <Link href="/lab/studio#break-it">Recovery exercise</Link>
              </li>
            </ul>
          </div>
          <picture className="editorial-lab-image">
            <source media="(max-width: 620px)" srcSet="/assets/phase-five/joint-mobile.webp" />
            <Image
              src="/assets/phase-five/joint.webp"
              alt=""
              width={1280}
              height={720}
              sizes="(max-width: 620px) 90vw, (max-width: 1200px) 46vw, 690px"
            />
          </picture>
        </div>
      </section>

      <section
        className="wrap editorial-section contact-section editorial-contact"
        aria-labelledby="contact"
      >
        <div>
          <BufferPath>~/sushant/contact.sh</BufferPath>
          <p className="editorial-label">Contact</p>
          <h2 id="contact" className="editorial-title">
            Let’s talk infrastructure.
          </h2>
          <p className="editorial-contact-note">
            Tell me what you’re building or what’s slowing your team down.
          </p>
          <div className="editorial-contact-links">
            <Link href="/freelance" className="editorial-link" data-nav-stop="">
              Freelance services <Arrow />
            </Link>
            <a
              href={site.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="editorial-link"
            >
              LinkedIn <Arrow diagonal />
            </a>
          </div>
        </div>
        <ContactForm />
      </section>
    </main>
  )
}
