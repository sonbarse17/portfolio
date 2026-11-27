import Image from 'next/image'
import Link from 'next/link'
import { Capabilities } from '@/components/capabilities'
import { CinematicHero } from '@/components/cinematic-hero'
import { ContactForm } from '@/components/contact-form'
import { DeploymentMap } from '@/components/deployment-map'
import { FeaturedWork } from '@/components/featured-work'
import { JourneyRail } from '@/components/journey-rail'
import { LabPreview } from '@/components/lab-preview'
import { SceneMotion } from '@/components/scene-motion'
import { capabilities } from '@/content/capabilities'
import { projects } from '@/content/projects'
import { background, figures, roles, site } from '@/content/site'
import { pageMetadata } from '@/lib/metadata'
import './home.css'
import './cinema.css'
import './phase-three.css'
import './flagship.css'

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

const ecosystem = capabilities.map(({ domain, applied, also }) => {
  const slugs = new Set(applied.map((item) => item.project))

  return {
    domain,
    also,
    projects: [...slugs].map((slug) => ({
      slug,
      title: projects.find((project) => project.slug === slug)!.title,
      tools: applied.filter((item) => item.project === slug),
    })),
  }
})

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileJsonLd).replace(/</g, '\\u003c') }}
      />
      <SceneMotion>
        <CinematicHero />
        <JourneyRail />
        <section className="home-section home-work" aria-labelledby="work">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Selected work</p>
                <h2 id="work" className="h-section">
                  Infrastructure in practice.
                </h2>
              </div>
              <Link href="/work" className="btn-quiet">
                All projects
              </Link>
            </div>
            <FeaturedWork />
          </div>
        </section>

        <DeploymentMap />

        <section className="home-section home-capabilities" aria-labelledby="capabilities">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Technology ecosystem</p>
                <h2 id="capabilities" className="h-section">
                  Where the tools fit.
                </h2>
              </div>
              <p className="section-note">
                Select a domain to see the tools in context and the projects where I used them.
              </p>
            </div>
            <Capabilities domains={ecosystem} />
          </div>
        </section>

        <section className="recovery-section" aria-labelledby="break-it">
          <LabPreview />
        </section>

        <section id="about" className="home-section home-about" aria-labelledby="about-title">
          <div className="wrap about-layout">
            <figure className="about-portrait">
              <Image
                src="/assets/images/profile.jpg"
                alt="Sushant Sonbarse"
                fill
                sizes="(max-width: 639px) 85vw, (max-width: 900px) 35vw, 460px"
                className="object-cover"
              />
            </figure>
            <div className="about-copy">
              <p className="eyebrow">About me</p>
              <h2 id="about-title" className="h-section">
                Design for the day something fails.
              </h2>
              <p className="lede">
                I came to DevOps through computer science and hands-on cloud training. At HisanLabs,
                I put that into practice by deploying a CRM on EKS and automating AWS infrastructure
                with Terraform.
              </p>
              <p className="text-muted">
                As a freelance consultant, I work on CI/CD, cloud infrastructure, and Kubernetes. I
                start with the failure domains, then work through what the pipeline can catch, what
                telemetry can tell us, and how the team can recover.
              </p>
              <Link href="/atlas" className="text-link">
                Read my engineering field guide
              </Link>
            </div>
          </div>
        </section>

        <section className="home-section career-section" aria-labelledby="record">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Career</p>
                <h2 id="record" className="h-section">
                  Experience.
                </h2>
              </div>
              <Link href="/resume" className="btn-quiet">
                Full résumé
              </Link>
            </div>
            <dl className="career-figures" aria-label="Outcomes from the HisanLabs internship">
              {figures.map((figure) => (
                <div key={figure.label}>
                  <dt>{figure.label}</dt>
                  <dd>{figure.value}</dd>
                </div>
              ))}
            </dl>
            <p className="career-source label">Recorded during the HisanLabs internship</p>

            <div className="career-timeline">
              {roles.map((role) => (
                <details key={role.title} open={role.current || undefined}>
                  <summary>
                    <span className="career-date">{role.when}</span>
                    <span>
                      <strong>{role.title}</strong>
                      <small>
                        {role.org} · {role.where}
                      </small>
                    </span>
                    <span className="disclosure-mark" aria-hidden="true" />
                  </summary>
                  <div className="career-detail">
                    <ul>
                      {role.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                    <p>{role.stack.join(' · ')}</p>
                  </div>
                </details>
              ))}
              {background.map((item) => (
                <div className="career-background" key={item.title}>
                  <span className="career-date">{item.when}</span>
                  <span>
                    <strong>{item.title}</strong>
                    <small>{item.org}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section contact-section" aria-labelledby="contact">
          <div className="wrap contact-layout">
            <div>
              <p className="eyebrow">Contact</p>
              <h2 id="contact" className="h-section">
                Let’s talk infrastructure.
              </h2>
              <p className="lede">Tell me what you’re building or what’s slowing your team down.</p>
              <div className="contact-links">
                <Link href="/freelance">Freelance services</Link>
                <Link href="/resume">Résumé</Link>
                <a href={site.linkedin} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                <a href={site.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </SceneMotion>
    </main>
  )
}
