import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-8">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-500 mb-8">
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Button asChild size="lg">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
