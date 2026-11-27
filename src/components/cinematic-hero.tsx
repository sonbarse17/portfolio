import Link from 'next/link'
import { SceneMotionToggle } from '@/components/scene-motion'
import { StackScene } from '@/components/stack-scene'
import { site } from '@/content/site'

export function CinematicHero() {
  return (
    <section className="scene-hero" aria-labelledby="home-title">
      <div className="wrap scene-hero-inner">
        <div className="hero-copy">
          <p className="hero-role eyebrow">{site.role}</p>
          <h1 id="home-title" className="hero-name">
            <span>Sushant</span> <span>Sonbarse</span>
          </h1>
          <p className="hero-intro">
            I work on the path from a commit to production, and on what happens when part of it
            breaks.
          </p>
          <div className="hero-actions">
            <Link href="/work" className="btn">
              See the work
            </Link>
            <Link href="/resume" className="btn-quiet">
              View résumé
            </Link>
          </div>
        </div>
        <StackScene />
        <div className="scene-hero-footer">
          <p className="availability">
            <span aria-hidden="true" />
            Available for remote freelance work
          </p>
          <div className="scene-hero-controls">
            <a href="#pipeline" className="scene-pipeline-link">
              Explore the deployment path
            </a>
            <SceneMotionToggle />
          </div>
        </div>
      </div>
    </section>
  )
}
