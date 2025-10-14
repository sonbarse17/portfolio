import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const rateLimitMap = new Map<string, number[]>()
const CLEANUP_INTERVAL = 300000 // 5 minutes
let lastCleanup = Date.now()

export function middleware(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? 'anonymous'
  const now = Date.now()
  const windowMs = 60000
  const maxRequests = 100

  // Periodic cleanup to prevent memory leak
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    for (const [key, timestamps] of rateLimitMap.entries()) {
      const filtered = timestamps.filter((time) => now - time < windowMs)
      if (filtered.length === 0) {
        rateLimitMap.delete(key)
      } else {
        rateLimitMap.set(key, filtered)
      }
    }
    lastCleanup = now
  }

  const requests = rateLimitMap.get(ip) ?? []
  const recentRequests = requests.filter((time) => now - time < windowMs)

  if (recentRequests.length >= maxRequests) {
    return new NextResponse('Too Many Requests', { status: 429 })
  }

  recentRequests.push(now)
  rateLimitMap.set(ip, recentRequests)

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}
