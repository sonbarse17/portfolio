'use client'

import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'

const Motion = createContext({
  paused: false,
  reduced: false,
  toggle: () => {},
})

export function useSceneSettings() {
  return useContext(Motion)
}

export function SceneMotion({ children }: { children: ReactNode }) {
  const [paused, setPaused] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(preference.matches)
    update()
    preference.addEventListener('change', update)
    return () => preference.removeEventListener('change', update)
  }, [])

  return (
    <Motion.Provider value={{ paused, reduced, toggle: () => setPaused((current) => !current) }}>
      <div className="home-experience" data-motion={paused || reduced ? 'paused' : 'enabled'}>
        {children}
      </div>
    </Motion.Provider>
  )
}

export function SceneMotionToggle() {
  const { paused, reduced, toggle } = useContext(Motion)

  return (
    <button type="button" className="scene-motion-toggle" onClick={toggle} hidden={reduced}>
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" fill="currentColor">
        {paused ? <path d="M5 3.5 13 8l-8 4.5Z" /> : <path d="M5 3h2v10H5zm4 0h2v10H9z" />}
      </svg>
      {paused ? 'Play motion' : 'Pause motion'}
    </button>
  )
}

export function useSceneActivity<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const { paused, reduced } = useContext(Motion)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    let inView = false
    const update = () => setVisible(inView && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      update()
    })
    observer.observe(node)
    document.addEventListener('visibilitychange', update)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', update)
    }
  }, [])

  return { ref, active: visible && !paused && !reduced, reduced }
}
