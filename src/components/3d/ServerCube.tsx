'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'

interface ServerCubeProps {
  position: [number, number, number]
  color?: string
  isActive?: boolean
}

export function ServerCube({ position, color = '#3b82f6', isActive = false }: ServerCubeProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.1
    }
    if (glowRef.current && isActive) {
      glowRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
    }
  })

  return (
    <group position={position}>
      <RoundedBox ref={meshRef} args={[1, 1, 1]} radius={0.05} smoothness={4}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </RoundedBox>
      {isActive && (
        <mesh ref={glowRef} scale={1.2}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color={color} transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  )
}
