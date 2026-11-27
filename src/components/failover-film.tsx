'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { SceneMotionToggle, useDataSaver, useSceneActivity } from '@/components/scene-motion'

const artwork = '/assets/phase-three/recovery-channel'
const film = '/assets/phase-four/recovery-channel'

export function FailoverFilm() {
  const { ref, active, reduced } = useSceneActivity<HTMLElement>()
  const saving = useDataSaver()
  const video = useRef<HTMLVideoElement>(null)
  const [optedIn, setOptedIn] = useState(false)
  const [requested, setRequested] = useState<'mobile' | 'desktop' | null>(null)
  const [playing, setPlaying] = useState(false)
  const shouldPlay = active && (!saving || optedIn)

  useEffect(() => {
    const media = video.current
    if (shouldPlay && !requested) {
      setRequested(window.matchMedia('(max-width: 720px)').matches ? 'mobile' : 'desktop')
    }
    if (!media) return

    if (shouldPlay && requested) {
      void media.play().catch(() => setPlaying(false))
    } else {
      media.pause()
    }

    return () => media.pause()
  }, [shouldPlay, requested])

  const source = requested === 'mobile' ? `${film}-mobile` : film

  return (
    <figure className="failover-film" ref={ref}>
      <div className="failover-viewport" aria-hidden="true">
        <picture>
          <source media="(max-width: 720px)" srcSet={`${artwork}-mobile.webp`} />
          <Image src={`${artwork}.webp`} fill sizes="100vw" alt="" />
        </picture>
        <video
          ref={video}
          aria-hidden="true"
          data-playing={playing && shouldPlay}
          muted
          playsInline
          loop
          preload="none"
          onPlaying={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => setPlaying(false)}
        >
          {requested && (
            <>
              <source src={`${source}.webm`} type="video/webm" />
              <source src={`${source}.mp4`} type="video/mp4" />
            </>
          )}
        </video>
      </div>
      <figcaption>
        <span>Illustrative failover sequence</span>
        {saving && !optedIn && !reduced ? (
          <button type="button" className="scene-motion-toggle" onClick={() => setOptedIn(true)}>
            Load recovery film
          </button>
        ) : (
          <SceneMotionToggle />
        )}
      </figcaption>
    </figure>
  )
}
