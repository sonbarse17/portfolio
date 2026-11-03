import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="wrap py-16">
      <p className="label text-signal">✕ 404, route not found</p>
      <h1 className="h-page mt-4">No such route</h1>
      <p className="lede mt-5 max-w-2xl">This page does not exist, or it has moved.</p>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/" className="btn">
          Back to the start
        </Link>
        <Link href="/lab" className="btn-quiet">
          Open the lab
        </Link>
      </div>
    </main>
  )
}
