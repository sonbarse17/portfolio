import Link from 'next/link'
import { Capabilities } from '@/components/capabilities'
import { DeploymentMap } from '@/components/deployment-map'
import { LabPreview } from '@/components/lab-preview'
import { SceneMotion, SceneMotionToggle } from '@/components/scene-motion'
import { StackScene } from '@/components/stack-scene'
import { capabilities } from '@/content/capabilities'
import { projects } from '@/content/projects'
import { pageMetadata } from '@/lib/metadata'
import '../../home.css'
import '../../cinema.css'
import '../../phase-three.css'
import '../../flagship.css'
import './studio.css'

export const metadata = pageMetadata(
  '/lab/studio',
  'Engineering studio',
  'Trace a request, run a deployment, and test recovery in Sushant Sonbarse’s interactive engineering studio.'
)

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

export default function StudioPage() {
  return (
    <main className="engineering-studio">
      <SceneMotion>
        <section className="scene-hero" aria-labelledby="studio-title">
          <div className="wrap scene-hero-inner">
            <div className="hero-copy">
              <p className="hero-role eyebrow">The lab</p>
              <h1 id="studio-title" className="hero-name">
                Engineering studio
              </h1>
              <p className="hero-intro">
                Follow a request to the application, ship a change, or trace what happens when a
                service fails.
              </p>
              <div className="hero-actions">
                <a href="#pipeline" className="btn">
                  Follow a deployment
                </a>
                <a href="#break-it" className="btn-quiet">
                  Explore recovery
                </a>
              </div>
            </div>
            <StackScene />
            <div className="scene-hero-footer">
              <Link href="/lab" className="scene-pipeline-link">
                All simulations
              </Link>
              <SceneMotionToggle />
            </div>
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
      </SceneMotion>
    </main>
  )
}
