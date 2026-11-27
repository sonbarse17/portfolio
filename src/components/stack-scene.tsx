'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { useSceneActivity, useSceneSettings } from '@/components/scene-motion'
import type { createInfrastructureRenderer } from '@/lib/visual/infrastructure'

type Renderer = NonNullable<ReturnType<typeof createInfrastructureRenderer>>

const layers = [
  { name: 'Ingress', detail: 'Authenticate the request before it reaches the workload.' },
  { name: 'Runtime', detail: 'Deliver traffic to a healthy, ready instance.' },
  { name: 'Recovery', detail: 'Isolate a failure and restore a healthy path.' },
]

const artwork = '/assets/phase-three/fabric'

export function StackScene() {
  const { ref, active, reduced } = useSceneActivity<HTMLDivElement>()
  const { paused } = useSceneSettings()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const posterRef = useRef<HTMLImageElement>(null)
  const engine = useRef<Renderer | null>(null)
  const failed = useRef(false)
  const time = useRef(0)
  const downgraded = useRef(false)
  const targetLayer = useRef(0)
  const layerPosition = useRef(0)
  const [eligible, setEligible] = useState(false)
  const [posterReady, setPosterReady] = useState(false)
  const [mode, setMode] = useState<'poster' | 'standard' | 'high'>('poster')
  const [selected, setSelected] = useState(0)
  const showStill = mode === 'poster' || paused || reduced
  const still =
    showStill && selected > 0 ? `${artwork}-${layers[selected].name.toLowerCase()}` : artwork

  useEffect(() => {
    if (posterRef.current?.complete && posterRef.current.naturalWidth) setPosterReady(true)
  }, [])

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
    const canUpgrade = !downgraded.current && window.matchMedia('(min-width: 1440px)').matches
    let high = false
    let triedHigh = false
    let renderCost = 0
    let ready = false
    let sceneTop = 0
    let sceneHeight = 1
    const hero = art.closest('.scene-hero')
    const scale = () => {
      const width = art.clientWidth
      const height = art.clientHeight
      const bounds = (hero ?? art).getBoundingClientRect()
      sceneTop = bounds.top + window.scrollY
      sceneHeight = Math.max(1, bounds.height * 0.72)
      const ratio = Math.min(1, (high ? 710 : 410) / Math.max(width, height))
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
        const nextTravel = Math.min(1, Math.max(0, (window.scrollY - sceneTop) / sceneHeight))
        travel += (nextTravel - travel) * 0.1
        const ease = 1 - Math.exp(-Math.min(delta || 16, 64) / 245)
        layerPosition.current += (targetLayer.current - layerPosition.current) * ease
        const before = performance.now()
        renderer.draw(time.current, x, y, travel, high ? 1 : 0, layerPosition.current)
        renderCost = renderCost * 0.8 + (performance.now() - before) * 0.2

        if (!ready) {
          setMode(high ? 'high' : 'standard')
          ready = true
        }

        // Warm up before using frame intervals to choose a session-local quality tier.
        sampled += 1
        if (sampled > 9 && delta > (high ? 28 : 57)) slow += 1
        if (sampled > 20) {
          if (slow >= 8 || renderCost > 10) {
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
          } else if (!high && canUpgrade && !triedHigh && slow <= 1 && renderCost < 3.5) {
            triedHigh = true
            high = true
            scale()
            setMode('high')
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
        data-still={showStill}
      >
        <picture>
          {still === artwork && (
            <source media="(max-width: 760px)" srcSet={`${artwork}-mobile.webp`} />
          )}
          <Image
            ref={posterRef}
            src={`${still}.webp`}
            alt=""
            fill
            fetchPriority="high"
            loading="eager"
            onLoad={() => setPosterReady(true)}
            sizes="(max-width: 760px) 100vw, 62vw"
          />
        </picture>
        <canvas ref={canvasRef} aria-hidden="true" />
      </div>
      <figcaption>
        <div className="stack-layers" role="group" aria-label="Infrastructure layers">
          {layers.map((layer, index) => (
            <button
              key={layer.name}
              type="button"
              aria-pressed={selected === index}
              onClick={() => {
                targetLayer.current = index
                setSelected(index)
              }}
            >
              {layer.name}
            </button>
          ))}
        </div>
        <p className="stack-layer-detail" aria-live="polite">
          {layers[selected].detail}
        </p>
      </figcaption>
    </figure>
  )
}
