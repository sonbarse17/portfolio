import * as THREE from 'three'

export function latLongToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const y = radius * Math.cos(phi)
  const z = radius * Math.sin(phi) * Math.sin(theta)

  return new THREE.Vector3(x, y, z)
}

export function createArcPath(
  start: THREE.Vector3,
  end: THREE.Vector3,
  height: number = 0.5
): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  const segments = 50

  const midPoint = new THREE.Vector3()
    .addVectors(start, end)
    .multiplyScalar(0.5)
    .normalize()
    .multiplyScalar(start.length() + height)

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const t2 = t * t
    const t3 = 1 - t
    const t4 = t3 * t3

    const point = new THREE.Vector3()
      .addScaledVector(start, t4)
      .addScaledVector(midPoint, 2 * t3 * t)
      .addScaledVector(end, t2)

    points.push(point)
  }

  return points
}
