import Link from 'next/link'

const stations = [
  { label: 'Commit', state: 'ok' },
  { label: 'Build', state: 'ok' },
  { label: 'Test', state: 'ok' },
  { label: 'Scan', state: 'ok' },
  { label: 'Deploy', state: 'fault' },
  { label: 'Production', state: 'idle' },
] as const

/** The hero's one visual: the path the opening sentence talks about, with the point where it breaks. */
export function PathStrip() {
  return (
    <figure aria-labelledby="path-caption">
      <ol className="relative grid grid-cols-3 gap-y-6 sm:grid-cols-6">
        <span
          aria-hidden="true"
          className="absolute inset-x-[8%] top-[0.6rem] hidden h-px bg-ink sm:block"
        />
        {stations.map(({ label, state }) => (
          <li key={label} className="relative flex flex-col items-center gap-2 text-center">
            <span
              aria-hidden="true"
              className={
                state === 'fault'
                  ? 'relative z-10 flex h-[1.375rem] w-[1.375rem] items-center justify-center border-2 border-signal bg-signal font-mono text-xs leading-none text-paper'
                  : state === 'ok'
                    ? 'relative z-10 h-[1.375rem] w-[1.375rem] border-2 border-ink bg-ink'
                    : 'relative z-10 h-[1.375rem] w-[1.375rem] border-2 border-dashed border-ink bg-paper'
              }
            >
              {state === 'fault' ? '✕' : ''}
            </span>
            <span className="label">{label}</span>
            <span className="sr-only">
              {state === 'fault' ? ' failed' : state === 'ok' ? ' passed' : ' not reached'}
            </span>
          </li>
        ))}
      </ol>
      <figcaption id="path-caption" className="mt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="label text-muted">Where it breaks is where the work starts.</span>
        <Link href="/lab/release-path" className="label link">
          Fail a stage yourself →
        </Link>
      </figcaption>
    </figure>
  )
}
