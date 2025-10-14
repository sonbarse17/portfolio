'use client'

import { useRef, useState, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { cities, connections } from './cityConnections'
import { latLongToVector3, createArcPath } from './utils'
import { Arrow } from './Arrow'
import { Ripple } from './Ripple'

const GLOBE_RADIUS = 2

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null)
  const [texture, setTexture] = useState<THREE.Texture | null>(null)
  const [hoveredCity, setHoveredCity] = useState<string | null>(null)
  const [rippleTriggers, setRippleTriggers] = useState<Record<string, number>>({})
  const prefersReducedMotion = useRef(false)

  useEffect(() => {
    prefersReducedMotion.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const canvas = document.createElement('canvas')
    canvas.width = 2048
    canvas.height = 1024
    const ctx = canvas.getContext('2d')!

    // Ocean gradient
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    oceanGradient.addColorStop(0, '#0a2f5f')
    oceanGradient.addColorStop(0.5, '#1a4d7a')
    oceanGradient.addColorStop(1, '#0a2f5f')
    ctx.fillStyle = oceanGradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Land gradient
    const landGradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      canvas.width / 2
    )
    landGradient.addColorStop(0, '#3d6b4a')
    landGradient.addColorStop(0.5, '#2d5a3d')
    landGradient.addColorStop(1, '#1e4029')

    // North America
    ctx.fillStyle = landGradient
    ctx.beginPath()
    ctx.moveTo(250, 250)
    ctx.bezierCurveTo(200, 300, 250, 400, 350, 450)
    ctx.bezierCurveTo(400, 400, 450, 350, 480, 280)
    ctx.bezierCurveTo(450, 220, 380, 200, 320, 220)
    ctx.bezierCurveTo(280, 230, 260, 240, 250, 250)
    ctx.fill()

    // South America
    ctx.beginPath()
    ctx.ellipse(420, 680, 110, 200, 0.15, 0, Math.PI * 2)
    ctx.fill()

    // Europe
    ctx.beginPath()
    ctx.ellipse(1020, 280, 140, 110, -0.2, 0, Math.PI * 2)
    ctx.fill()

    // Africa
    ctx.beginPath()
    ctx.moveTo(980, 400)
    ctx.bezierCurveTo(950, 450, 960, 550, 1000, 650)
    ctx.bezierCurveTo(1050, 720, 1120, 750, 1180, 720)
    ctx.bezierCurveTo(1200, 650, 1210, 550, 1200, 480)
    ctx.bezierCurveTo(1180, 420, 1140, 380, 1080, 370)
    ctx.bezierCurveTo(1030, 370, 990, 380, 980, 400)
    ctx.fill()

    // Asia
    ctx.beginPath()
    ctx.ellipse(1450, 320, 280, 200, 0.1, 0, Math.PI * 2)
    ctx.fill()

    // Australia
    ctx.beginPath()
    ctx.ellipse(1620, 760, 130, 110, 0.2, 0, Math.PI * 2)
    ctx.fill()

    // Add clouds/ice caps
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
    ctx.fillRect(0, 0, canvas.width, 80)
    ctx.fillRect(0, canvas.height - 80, canvas.width, 80)

    // Add stars/detail
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * 2
      ctx.fillRect(x, y, size, size)
    }

    const earthTexture = new THREE.CanvasTexture(canvas)
    earthTexture.wrapS = THREE.RepeatWrapping
    earthTexture.wrapT = THREE.ClampToEdgeWrapping
    earthTexture.minFilter = THREE.LinearMipmapLinearFilter
    earthTexture.magFilter = THREE.LinearFilter
    earthTexture.generateMipmaps = true
    earthTexture.needsUpdate = true

    setTexture(earthTexture)

    const loader = new THREE.TextureLoader()
    loader.load(
      '/assets/earthMap.webp',
      (tex) => {
        tex.wrapS = THREE.RepeatWrapping
        tex.wrapT = THREE.ClampToEdgeWrapping
        tex.minFilter = THREE.LinearMipmapLinearFilter
        tex.magFilter = THREE.LinearFilter
        tex.generateMipmaps = true
        setTexture(tex)
      },
      undefined,
      () => {}
    )
  }, [])

  useFrame(() => {
    if (meshRef.current && !prefersReducedMotion.current) {
      meshRef.current.rotation.y += hoveredCity ? 0.003 : 0.001
    }
  })

  const cityPositions = useMemo(
    () =>
      cities.map((city) => ({
        ...city,
        position: latLongToVector3(city.lat, city.lng, GLOBE_RADIUS),
      })),
    []
  )

  const arcs = useMemo(
    () =>
      connections
        .map((conn) => {
          const fromCity = cityPositions.find((c) => c.name === conn.from)
          const toCity = cityPositions.find((c) => c.name === conn.to)
          if (!fromCity || !toCity) return null

          return {
            ...conn,
            path: createArcPath(fromCity.position, toCity.position, 0.5),
            fromPos: fromCity.position,
            toPos: toCity.position,
          }
        })
        .filter(Boolean),
    [cityPositions]
  )

  useEffect(() => {
    const interval = setInterval(() => {
      connections.forEach((conn) => {
        setRippleTriggers((prev) => ({
          ...prev,
          [conn.to]: Date.now(),
        }))
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial
          map={texture}
          metalness={0.15}
          roughness={0.75}
          emissive="#0a1f3d"
          emissiveIntensity={0.1}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.01, 64, 64]} />
        <meshBasicMaterial color="#60a5fa" transparent opacity={0.15} side={THREE.BackSide} />
      </mesh>

      {cityPositions.map((city) => (
        <group key={city.name}>
          <mesh
            position={city.position}
            onPointerOver={() => setHoveredCity(city.name)}
            onPointerOut={() => setHoveredCity(null)}
          >
            <sphereGeometry args={[0.03, 16, 16]} />
            <meshBasicMaterial color="#fbbf24" />
          </mesh>

          {hoveredCity === city.name && (
            <Html position={city.position} center>
              <div className="bg-black/80 text-white px-3 py-1 rounded text-sm whitespace-nowrap pointer-events-none">
                {city.label}
              </div>
            </Html>
          )}

          <Ripple
            position={city.position}
            trigger={rippleTriggers[city.name] || 0}
            color="#3b82f6"
          />
        </group>
      ))}

      {arcs.map((arc, i) =>
        arc ? (
          <group key={i}>
            <Arrow path={arc.path} color={arc.color || '#3b82f6'} speed={1} delay={i * 0.3} />
            <Line
              points={arc.path}
              color={arc.color || '#3b82f6'}
              lineWidth={1}
              transparent
              opacity={0.3}
            />
          </group>
        ) : null
      )}
    </group>
  )
}

export function ContactGlobe() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) {
    return (
      <div className="w-full h-[500px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg animate-pulse" />
    )
  }

  return (
    <div
      className="w-full h-[500px] rounded-lg overflow-hidden"
      role="img"
      aria-label="Interactive 3D globe showing global connectivity"
    >
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 5]} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(2 * Math.PI) / 3}
          autoRotate={false}
        />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={1.2} />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#60a5fa" />
        <Globe />
      </Canvas>
    </div>
  )
}
