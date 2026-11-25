'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useId, useState } from 'react'

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

const trace = 'M0 74h70l14-16 14 16h68l17-56 19 104 19-48h62l18-23 14 23h70l12-10 10 10h65'

export function LabPreview() {
  const [open, setOpen] = useState(false)
  const id = useId()

  return (
    <>
      <div className="lab-preview">
        <div className="lab-copy">
          <p className="eyebrow">Infrastructure lab</p>
          <h2 id="break-it" className="h-section">
            What breaks first?
          </h2>
          <p>
            Take a component offline, follow the blast radius, and see what it takes to recover. The
            simulation runs in your browser.
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
        <svg aria-hidden="true" className="lab-trace" viewBox="0 0 470 144" fill="none">
          <path d="M0 26h470M0 50h470M0 74h470M0 98h470M0 122h470M47 0v144M94 0v144M141 0v144M188 0v144M235 0v144M282 0v144M329 0v144M376 0v144M423 0v144" />
          <path d={trace} className="lab-trace-signal" />
          <circle cx="183" cy="18" r="5" />
          <circle cx="202" cy="122" r="5" />
        </svg>
      </div>
      <div id={id} hidden={!open} className="lab-embed mt-4">
        {open && <BlastRadiusLab />}
      </div>
    </>
  )
}
