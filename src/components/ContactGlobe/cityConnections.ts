export interface City {
  name: string
  lat: number
  lng: number
  label: string
}

export interface Connection {
  from: string
  to: string
  color?: string
}

export const cities: City[] = [
  { name: 'sanfrancisco', lat: 37.7749, lng: -122.4194, label: 'San Francisco' },
  { name: 'london', lat: 51.5074, lng: -0.1278, label: 'London' },
  { name: 'tokyo', lat: 35.6762, lng: 139.6503, label: 'Tokyo' },
  { name: 'sydney', lat: -33.8688, lng: 151.2093, label: 'Sydney' },
  { name: 'mumbai', lat: 19.076, lng: 72.8777, label: 'Mumbai' },
  { name: 'saopaulo', lat: -23.5505, lng: -46.6333, label: 'São Paulo' },
]

export const connections: Connection[] = [
  { from: 'sanfrancisco', to: 'tokyo', color: '#3b82f6' },
  { from: 'london', to: 'mumbai', color: '#8b5cf6' },
  { from: 'tokyo', to: 'sydney', color: '#ec4899' },
  { from: 'mumbai', to: 'london', color: '#10b981' },
  { from: 'saopaulo', to: 'sanfrancisco', color: '#f59e0b' },
  { from: 'sydney', to: 'saopaulo', color: '#06b6d4' },
]
