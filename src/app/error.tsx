'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-white mb-4">Error</h1>
        <h2 className="text-2xl font-semibold text-gray-600 dark:text-gray-400 mb-8">
          Something went wrong
        </h2>
        <p className="text-gray-500 dark:text-gray-500 mb-8">
          We&apos;re sorry for the inconvenience. Please try again.
        </p>
        <Button onClick={reset} size="lg">
          Try Again
        </Button>
      </div>
    </div>
  )
}
