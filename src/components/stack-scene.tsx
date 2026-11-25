'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useSceneActivity } from '@/components/scene-motion'
import type { createInfrastructureRenderer } from '@/lib/visual/infrastructure'

type Renderer = NonNullable<ReturnType<typeof createInfrastructureRenderer>>

export function StackScene() {
  const { ref, active, reduced } = useSceneActivity<HTMLDivElement>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const engine = useRef<Renderer | null>(null)
  const failed = useRef(false)
  const time = useRef(0)
  const downgraded = useRef(false)
  const [eligible, setEligible] = useState(false)
  const [posterReady, setPosterReady] = useState(false)
  const [mode, setMode] = useState<'poster' | 'standard' | 'high'>('poster')

  useEffect(() => {
    const media = window.matchMedia('(min-width: 1000px) and (pointer: fine)')
    const update = () => setEligible(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const lost = () => {
      failed.current = true
      engine.current = null
      setMode('poster')
    }
    canvas.addEventListener('webglcontextlost', lost)
    return () => {
      canvas.removeEventListener('webglcontextlost', lost)
      engine.current?.dispose()
      engine.current = null
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const art = ref.current
    if (!eligible || reduced) setMode('poster')
    if (!canvas || !art || !active || !eligible || !posterReady || failed.current) return

    let frame = 0
    let previous = 0
    let sampled = 0
    let slow = 0
    let x = 0
    let y = 0
    let targetX = 0
    let targetY = 0
    let travel = 0
    let stopped = false
    let high = !downgraded.current && window.matchMedia('(min-width: 1440px)').matches
    let ready = false
    let artTop = 0
    let artHeight = 1
    const hero = art.closest('.scene-hero')
    const scale = () => {
      const width = art.clientWidth
      const height = art.clientHeight
      artTop = art.getBoundingClientRect().top + window.scrollY
      artHeight = Math.max(1, height)
      const ratio = Math.min(1, (high ? 760 : 475) / Math.max(width, height))
      engine.current?.resize(
        Math.max(1, Math.round(width * ratio)),
        Math.max(1, Math.round(height * ratio))
      )
    }

    const point = (event: Event) => {
      const position = event as PointerEvent
      targetX = (position.clientX / window.innerWidth - 0.5) * 2
      targetY = (0.5 - position.clientY / window.innerHeight) * 2
    }
    const clearPoint = () => {
      targetX = 0
      targetY = 0
    }

    const motion = (now: number) => {
      const renderer = engine.current
      if (!renderer || failed.current) return
      const delta = previous ? now - previous : 0
      const interval = high ? 16 : 32
      if (delta >= interval || !previous) {
        time.current += Math.min(delta, 110) * 0.001
        previous = now
        x += (targetX - x) * 0.095
        y += (targetY - y) * 0.095
        const nextTravel = Math.min(1, Math.max(0, (window.scrollY - artTop) / artHeight))
        travel += (nextTravel - travel) * 0.14
        renderer.draw(time.current, x, y, travel, high ? 1 : 0)

        if (!ready) {
          setMode(high ? 'high' : 'standard')
          ready = true
        }

        // Warm up before using frame intervals to choose a session-local quality tier.
        sampled += 1
        if (sampled > 9 && delta > (high ? 28 : 57)) slow += 1
        if (sampled > 20) {
          if (slow >= 8) {
            if (!high) {
              renderer.dispose()
              engine.current = null
              failed.current = true
              setMode('poster')
              return
            }
            high = false
            downgraded.current = true
            scale()
            setMode('standard')
          }
          sampled = 9
          slow = 0
        }
      }
      frame = requestAnimationFrame(motion)
    }

    const resize = new ResizeObserver(scale)
    const start = async () => {
      try {
        const { createInfrastructureRenderer } = await import('@/lib/visual/infrastructure')
        if (stopped) return
        engine.current ??= createInfrastructureRenderer(canvas)
        if (!engine.current) {
          failed.current = true
          return
        }
        scale()
        resize.observe(art)
        hero?.addEventListener('pointermove', point, { passive: true })
        hero?.addEventListener('pointerleave', clearPoint)
        frame = requestAnimationFrame(motion)
      } catch {
        failed.current = true
        setMode('poster')
      }
    }

    const defer = window.setTimeout(start, 380)
    return () => {
      stopped = true
      clearTimeout(defer)
      cancelAnimationFrame(frame)
      resize.disconnect()
      hero?.removeEventListener('pointermove', point)
      hero?.removeEventListener('pointerleave', clearPoint)
    }
  }, [active, eligible, posterReady, reduced, ref])

  return (
    <figure className="stack-scene">
      <div
        className="stack-art"
        ref={ref}
        data-renderer={mode}
        data-drawing={mode !== 'poster' && active}
      >
        <picture>
          <source
            media="(max-width: 650px)"
            srcSet="/assets/phase-three/infrastructure-mobile.webp"
          />
          <Image
            src="/assets/phase-three/infrastructure.webp"
            alt=""
            fill
            fetchPriority="high"
            loading="eager"
            onLoad={() => setPosterReady(true)}
            sizes="(max-width: 650px) 100vw, 62vw"
          />
        </picture>
        <canvas ref={canvasRef} aria-hidden="true" />
        <svg
          className="stack-annotations"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M7 24V8h18m47 0h21v16m0 54v14H73m-48 0H7V76" />
        </svg>
      </div>
      <figcaption>Procedural infrastructure model</figcaption>
    </figure>
  )
}
