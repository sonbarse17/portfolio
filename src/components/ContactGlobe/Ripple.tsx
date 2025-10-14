'use client'

import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface RippleProps {
  position: THREE.Vector3
  trigger: number
  color?: string
}

export function Ripple({ position, trigger, color = '#3b82f6' }: RippleProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const startTime = useRef(0)
  const isAnimating = useRef(false)

  useEffect(() => {
    if (trigger > 0) {
      startTime.current = Date.now()
      isAnimating.current = true
    }
  }, [trigger])

  useFrame(() => {
    if (!meshRef.current || !isAnimating.current) return

    const elapsed = (Date.now() - startTime.current) / 1000
    const duration = 1.5

    if (elapsed < duration) {
      const progress = elapsed / duration
      const scale = 0.1 + progress * 0.4
      const opacity = 1 - progress

      meshRef.current.scale.set(scale, scale, 1)
      ;(meshRef.current.material as THREE.MeshBasicMaterial).opacity = opacity * 0.6
      meshRef.current.visible = true
    } else {
      meshRef.current.visible = false
      isAnimating.current = false
    }
  })

  return (
    <mesh ref={meshRef} position={position} visible={false}>
      <ringGeometry args={[0.8, 1, 32]} />
      <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
    </mesh>
  )
}
