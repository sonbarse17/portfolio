'use client'

import { useEffect } from 'react'

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="wrap py-16">
      <p className="label text-signal">✕ Unhandled error</p>
      <h1 className="h-page mt-4">This page failed</h1>
      <p className="lede mt-5 max-w-2xl">
        Something went wrong while rendering it. Retrying often works.
      </p>
      <button type="button" onClick={reset} className="btn mt-8">
        Try again
      </button>
    </main>
  )
}
