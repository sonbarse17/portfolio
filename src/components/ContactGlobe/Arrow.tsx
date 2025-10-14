'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface ArrowProps {
  path: THREE.Vector3[]
  color: string
  speed?: number
  delay?: number
}

export function Arrow({ path, color, speed = 1, delay = 0 }: ArrowProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const curve = useMemo(() => new THREE.CatmullRomCurve3(path), [path])
  const progress = useRef(delay)

  useFrame((_, delta) => {
    if (!meshRef.current) return

    progress.current += delta * speed * 0.2
    if (progress.current > 1 + delay) progress.current = delay

    const t = Math.max(0, Math.min(1, progress.current - delay))
    if (t > 0 && t < 1) {
      const point = curve.getPoint(t)
      const tangent = curve.getTangent(t)

      meshRef.current.position.copy(point)
      meshRef.current.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent.normalize())
      meshRef.current.visible = true
    } else {
      meshRef.current.visible = false
    }
  })

  return (
    <mesh ref={meshRef} visible={false}>
      <coneGeometry args={[0.02, 0.08, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.8} />
    </mesh>
  )
}
