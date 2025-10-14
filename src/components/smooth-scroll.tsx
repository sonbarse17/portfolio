'use client'

import { useEffect } from 'react'

interface Lenis {
  raf: (time: number) => void
  destroy: () => void
}

export function SmoothScroll() {
  useEffect(() => {
    let lenis: Lenis | null = null

    import('lenis')
      .then(({ default: Lenis }) => {
        lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        }) as Lenis

        function raf(time: number) {
          lenis?.raf(time)
          requestAnimationFrame(raf)
        }

        requestAnimationFrame(raf)
      })
      .catch(() => {})

    return () => {
      lenis?.destroy()
    }
  }, [])

  return null
}
