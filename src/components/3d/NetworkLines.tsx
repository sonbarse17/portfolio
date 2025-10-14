'use client'

import { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

interface NetworkLinesProps {
  points: [number, number, number][]
  color?: string
}

export function NetworkLines({ points, color = '#60a5fa' }: NetworkLinesProps) {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)))
  }, [points])

  const linePoints = useMemo(() => curve.getPoints(50), [curve])

  return <Line points={linePoints} color={color} lineWidth={2} transparent opacity={0.5} />
}
