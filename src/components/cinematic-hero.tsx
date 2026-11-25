'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import { SceneMotionToggle, useSceneActivity } from '@/components/scene-motion'
import { site } from '@/content/site'

function HeroEnvironment() {
  const { ref, active } = useSceneActivity<HTMLDivElement>()

  useEffect(() => {
    const visual = ref.current
    const hero = visual?.closest('.scene-hero')
    if (!visual || !hero || !active || !window.matchMedia('(pointer: fine)').matches) return

    let frame = 0
    let x = 0
    let y = 0
    let targetX = 0
    let targetY = 0

    const settle = () => {
      frame = 0
      x += (targetX - x) * 0.11
      y += (targetY - y) * 0.11
      visual.style.setProperty('--drift-x', `${x.toFixed(2)}px`)
      visual.style.setProperty('--drift-y', `${y.toFixed(2)}px`)
      if (Math.abs(x - targetX) + Math.abs(y - targetY) > 0.1) {
        frame = requestAnimationFrame(settle)
      }
    }

    const move = (event: Event) => {
      const pointer = event as PointerEvent
      const bounds = hero.getBoundingClientRect()
      targetX = ((pointer.clientX - bounds.left) / bounds.width - 0.5) * 26
      targetY = ((pointer.clientY - bounds.top) / bounds.height - 0.5) * 18
      if (!frame) frame = requestAnimationFrame(settle)
    }

    const reset = () => {
      targetX = 0
      targetY = 0
      if (!frame) frame = requestAnimationFrame(settle)
    }

    hero.addEventListener('pointermove', move, { passive: true })
    hero.addEventListener('pointerleave', reset)

    return () => {
      hero.removeEventListener('pointermove', move)
      hero.removeEventListener('pointerleave', reset)
      cancelAnimationFrame(frame)
      visual.style.removeProperty('--drift-x')
      visual.style.removeProperty('--drift-y')
    }
  }, [active, ref])

  return (
    <div className="scene-environment" ref={ref} data-running={active} aria-hidden="true">
      <picture className="scene-image">
        <source media="(max-width: 600px)" srcSet="/assets/phase-two/aisle-mobile.webp" />
        <Image
          src="/assets/phase-two/aisle.webp"
          fill
          sizes="100vw"
          fetchPriority="high"
          loading="eager"
          alt=""
        />
      </picture>
      <div className="scene-shade" />
      <svg
        className="scene-routing"
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
      >
        <path
          className="scene-route-guide"
          d="M658 800 1095 430H1180L1396 800M789 800l325-370M1253 800l-103-370M1095 430V272l125-98h220M1180 430V320l144-107h116"
        />
        <path
          className="scene-route-base"
          d="M765 800 1095 430V272l125-98h220M1396 800 1180 430V320l144-107h116"
        />
        <path className="scene-route-flow" pathLength="1" d="M765 800 1095 430V272l125-98h220" />
        <path
          className="scene-route-flow scene-route-secondary"
          pathLength="1"
          d="M1396 800 1180 430V320l144-107h116"
        />
        <circle cx="1095" cy="430" r="5" />
        <circle cx="1180" cy="430" r="5" />
        <path
          className="scene-route-guide"
          d="M1071 430h-16v-16m48 16h16v16m37-16h-16v-16m48 16h16v16"
        />
      </svg>
    </div>
  )
}

export function CinematicHero() {
  return (
    <section className="scene-hero" aria-labelledby="home-title">
      <HeroEnvironment />
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
