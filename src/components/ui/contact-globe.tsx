'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'
import * as THREE from 'three'

type City = {
  name: string
  lat: number
  lng: number
  color: string
}

type Connection = {
  from: City
  to: City
}

const cities: City[] = [
  { name: 'New York', lat: 40.7128, lng: -74.006, color: '#3b82f6' },
  { name: 'London', lat: 51.5074, lng: -0.1278, color: '#8b5cf6' },
  { name: 'Tokyo', lat: 35.6762, lng: 139.6503, color: '#ec4899' },
  { name: 'Sydney', lat: -33.8688, lng: 151.2093, color: '#10b981' },
  { name: 'Mumbai', lat: 19.076, lng: 72.8777, color: '#f59e0b' },
  { name: 'São Paulo', lat: -23.5505, lng: -46.6333, color: '#ef4444' },
]

const connections: Connection[] = [
  { from: cities[0], to: cities[1] },
  { from: cities[1], to: cities[2] },
  { from: cities[2], to: cities[3] },
  { from: cities[3], to: cities[4] },
  { from: cities[4], to: cities[5] },
  { from: cities[5], to: cities[0] },
]

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)
  return new THREE.Vector3(x, y, z)
}

function createArcCurve(start: THREE.Vector3, end: THREE.Vector3): THREE.QuadraticBezierCurve3 {
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
  const dist = start.distanceTo(end)
  mid.normalize().multiplyScalar(2.5 + dist * 0.15)
  return new THREE.QuadraticBezierCurve3(start, mid, end)
}

function Arc({ connection, index }: { connection: Connection; index: number }) {
  const lineRef = useRef<THREE.Line>(null)
  const radius = 2.5

  const { curve, color } = useMemo(() => {
    const start = latLngToVector3(connection.from.lat, connection.from.lng, radius)
    const end = latLngToVector3(connection.to.lat, connection.to.lng, radius)
    return {
      curve: createArcCurve(start, end),
      color: connection.from.color,
    }
  }, [connection, radius])

  const points = useMemo(() => curve.getPoints(50), [curve])

  useFrame(({ clock }) => {
    if (lineRef.current) {
      const material = lineRef.current.material as THREE.LineBasicMaterial
      const offset = (clock.getElapsedTime() * 0.3 + index * 0.5) % 1
      material.opacity = 0.4 + Math.sin(offset * Math.PI * 2) * 0.3
    }
  })

  return (
    <primitive
      object={
        new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(points),
          new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 })
        )
      }
      ref={lineRef}
    />
  )
}

function CityPoint({ city }: { city: City }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const position = useMemo(() => latLngToVector3(city.lat, city.lng, 2.52), [city])

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.2
      meshRef.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshBasicMaterial color={city.color} />
    </mesh>
  )
}

function Ripple({ city, delay }: { city: City; delay: number }) {
  const ringRef = useRef<THREE.Mesh>(null)
  const position = useMemo(() => latLngToVector3(city.lat, city.lng, 2.52), [city])

  useFrame(({ clock }) => {
    if (ringRef.current) {
      const t = (clock.getElapsedTime() + delay) % 3
      const scale = 1 + t * 0.5
      const opacity = Math.max(0, 1 - t / 3)
      ringRef.current.scale.setScalar(scale)
      ;(ringRef.current.material as THREE.MeshBasicMaterial).opacity = opacity
    }
  })

  return (
    <mesh ref={ringRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[0.03, 0.05, 32]} />
      <meshBasicMaterial color={city.color} transparent opacity={1} side={THREE.DoubleSide} />
    </mesh>
  )
}

function Earth() {
  const meshRef = useRef<THREE.Mesh>(null)
  const texture = useLoader(
    THREE.TextureLoader,
    'https://raw.githubusercontent.com/jeromeetienne/threex.planets/master/images/earthmap1k.jpg'
  )

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <Sphere ref={meshRef} args={[2.5, 64, 64]}>
      <meshStandardMaterial map={texture} metalness={0.1} roughness={0.8} />
    </Sphere>
  )
}

function Atmosphere() {
  return (
    <Sphere args={[2.55, 64, 64]}>
      <meshBasicMaterial
        color="#4a90e2"
        transparent
        opacity={0.15}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
      />
    </Sphere>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#4a90e2" />

      <Earth />
      <Atmosphere />

      {connections.map((conn, i) => (
        <Arc key={i} connection={conn} index={i} />
      ))}

      {cities.map((city, i) => (
        <CityPoint key={i} city={city} />
      ))}

      {cities.map((city, i) => (
        <Ripple key={i} city={city} delay={i * 0.5} />
      ))}

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </>
  )
}

export function ContactGlobe() {
  return (
    <div className="w-full h-[500px] lg:h-[600px] rounded-lg overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 dark:from-black dark:to-slate-950">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
