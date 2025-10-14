'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { ServerCube } from './ServerCube'
import { NetworkLines } from './NetworkLines'
import { Suspense } from 'react'

export function CloudInfrastructure() {
  const servers = [
    { pos: [-2, 0, 0] as [number, number, number], color: '#3b82f6', active: true },
    { pos: [0, 0, 0] as [number, number, number], color: '#8b5cf6', active: false },
    { pos: [2, 0, 0] as [number, number, number], color: '#ec4899', active: true },
  ]

  const connections = [
    [
      [-2, 0, 0],
      [0, 0, 0],
    ],
    [
      [0, 0, 0],
      [2, 0, 0],
    ],
  ] as [number, number, number][][]

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <Canvas>
        <Suspense fallback={null}>
          <PerspectiveCamera makeDefault position={[0, 2, 6]} />
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#60a5fa" />

          {servers.map((server, i) => (
            <ServerCube
              key={i}
              position={server.pos}
              color={server.color}
              isActive={server.active}
            />
          ))}

          {connections.map((points, i) => (
            <NetworkLines key={i} points={points} />
          ))}
        </Suspense>
      </Canvas>
    </div>
  )
}
