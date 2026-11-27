'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useId, useState } from 'react'
import { FailoverFilm } from '@/components/failover-film'

const BlastRadiusLab = dynamic(
  () => import('@/components/labs/blast-radius').then((module) => module.BlastRadiusLab),
  {
    loading: () => (
      <p role="status" className="p-6 text-muted">
        Loading simulator…
      </p>
    ),
  }
)

export function LabPreview() {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <>
      <div className="recovery-stage">
        <div className="wrap recovery-layout">
          <div className="recovery-copy">
            <p className="eyebrow">Reliability lab</p>
            <h2 id="break-it" className="h-section">
              What breaks first?
            </h2>
            <p>
              Take a component offline, follow the blast radius, and see what it takes to recover.
              The simulation runs in your browser.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="btn"
                aria-expanded={open}
                aria-controls={id}
                onClick={() => setOpen(!open)}
              >
                {open ? 'Close simulator' : 'Try the simulator'}
              </button>
              <Link href="/lab" className="btn-quiet">
                Explore all labs
              </Link>
            </div>
          </div>
        </div>
        <FailoverFilm />
      </div>
      <div id={id} hidden={!open} className="wrap recovery-embed">
        {open && (
          <div className="lab-embed">
            <BlastRadiusLab />
          </div>
        )}
      </div>
    </>
  )
}
