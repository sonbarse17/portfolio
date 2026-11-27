'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { SceneMotionToggle, useSceneActivity } from '@/components/scene-motion'

const artwork = '/assets/phase-three/recovery-channel'

export function FailoverFilm() {
  const { ref, active } = useSceneActivity<HTMLElement>()
  const video = useRef<HTMLVideoElement>(null)
  const [requested, setRequested] = useState(false)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    const media = video.current
    if (active && !requested) setRequested(true)
    if (!media) return

    if (active && requested) {
      void media.play().catch(() => setPlaying(false))
    } else {
      media.pause()
    }

    return () => media.pause()
  }, [active, requested])

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
          data-playing={playing && active}
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
              <source media="(max-width: 720px)" src={`${artwork}-mobile.webm`} type="video/webm" />
              <source media="(max-width: 720px)" src={`${artwork}-mobile.mp4`} type="video/mp4" />
              <source src={`${artwork}.webm`} type="video/webm" />
              <source src={`${artwork}.mp4`} type="video/mp4" />
            </>
          )}
        </video>
      </div>
      <figcaption>
        <span>Illustrative failover sequence</span>
        <SceneMotionToggle />
      </figcaption>
    </figure>
  )
}
