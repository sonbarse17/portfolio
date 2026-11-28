'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { destinations, searchable } from '@/content/discovery'
import { palettes } from '@/content/palettes'
import { parseCommand } from '@/lib/command'

export function PortfolioFinder({
  onClose,
  initialQuery = '',
}: {
  onClose: () => void
  initialQuery?: string
}) {
  const dialog = useRef<HTMLDialogElement>(null)
  const input = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { setTheme } = useTheme()
  const id = useId()
  const [query, setQuery] = useState(initialQuery)
  const [notice, setNotice] = useState('')
  const [current, setCurrent] = useState(0)
  const [renderer] = useState(() => {
    const tier = document.querySelector<HTMLElement>('.stack-art')?.dataset.renderer
    return tier ? (tier === 'poster' ? 'Static poster' : `WebGL · ${tier}`) : 'Home scene'
  })
  const normalized = searchable(query).trim()
  const diagnostics = normalized === 'diagnostics'
  const terms = normalized.split(/\s+/)
  const isCommand = query.trimStart().startsWith(':')
  const results = isCommand
    ? []
    : destinations
        .filter((item) =>
          terms.every((term) =>
            searchable(`${item.title} ${item.group} ${item.keywords ?? ''}`).includes(term)
          )
        )
        .sort(
          (a, b) =>
            Number(searchable(b.title).startsWith(normalized)) -
            Number(searchable(a.title).startsWith(normalized))
        )
        .slice(0, 10)
  const expanded = !diagnostics && !isCommand && results.length > 0

  useEffect(() => {
    const node = dialog.current
    node?.showModal()
    const field = input.current
    field?.focus()
    field?.setSelectionRange(field.value.length, field.value.length)
    return () => {
      if (node?.open) node.close()
    }
  }, [])

  function choose(href: string) {
    dialog.current?.close()
    router.push(href)
  }

  const paletteNames = palettes.map((palette) => palette.slug).join(', ')

  function run() {
    const command = parseCommand(query)
    if (command.kind === 'theme') {
      setTheme(command.palette.slug)
      dialog.current?.close()
    } else if (command.kind === 'go') {
      choose(command.href)
    } else if (command.kind === 'theme-unknown') {
      setNotice(
        command.query
          ? `No palette '${command.query}'. Try ${paletteNames}.`
          : `Name a palette: ${paletteNames}.`
      )
    } else {
      setNotice('Unknown command. Try :theme, :work, :lab, :resume, :about or :contact.')
    }
  }

  function navigate(event: KeyboardEvent<HTMLInputElement>) {
    if (isCommand && event.key === 'Enter') {
      event.preventDefault()
      run()
      return
    }
    if (diagnostics || !results.length) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const next =
        (current + (event.key === 'ArrowDown' ? 1 : -1) + results.length) % results.length
      setCurrent(next)
      document.getElementById(`${id}-result-${next}`)?.scrollIntoView({ block: 'nearest' })
    } else if (event.key === 'Enter') {
      event.preventDefault()
      choose(results[current].href)
    }
  }

  return (
    <dialog
      className="portfolio-finder"
      ref={dialog}
      aria-labelledby={`${id}-title`}
      onClose={() => {
        if (!dialog.current?.open) onClose()
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close()
      }}
    >
      <div className="finder-panel">
        <div className="finder-heading">
          <h2 id={`${id}-title`}>Find in the portfolio</h2>
          <button type="button" className="btn-quiet" onClick={() => dialog.current?.close()}>
            Close
          </button>
        </div>
        <label className="sr-only" htmlFor={`${id}-query`}>
          Search the portfolio
        </label>
        <input
          ref={input}
          id={`${id}-query`}
          className="field"
          type="search"
          value={query}
          placeholder="Try résumé, Azure, or :theme paper"
          role="combobox"
          aria-controls={`${id}-results`}
          aria-expanded={expanded}
          aria-autocomplete="list"
          aria-activedescendant={expanded ? `${id}-result-${current}` : undefined}
          onChange={(event) => {
            setQuery(event.currentTarget.value)
            setNotice('')
            setCurrent(0)
          }}
          onKeyDown={navigate}
        />
        <ul
          id={`${id}-results`}
          className="finder-results"
          aria-label="Destinations"
          role="listbox"
          hidden={!expanded}
        >
          {results.map((item, index) => (
            <li
              key={item.href}
              id={`${id}-result-${index}`}
              role="option"
              aria-selected={index === current}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => choose(item.href)}
            >
              <span>{item.title}</span>
              <small>{item.group}</small>
            </li>
          ))}
        </ul>
        {!diagnostics && !isCommand && results.length === 0 && (
          <p className="finder-empty" role="status">
            No matches.
          </p>
        )}
        {isCommand && (
          <p className="finder-empty" role="status">
            {notice || 'Press Enter to run the command.'}
          </p>
        )}
        {diagnostics && (
          <section className="finder-diagnostics" aria-label="Rendering diagnostics">
            <p className="eyebrow">Rendering diagnostics</p>
            <p>Scene at opening · {renderer}</p>
            <p>Static build · {process.env.NEXT_PUBLIC_BUILD_SHA}</p>
            <button className="btn-quiet" type="button" onClick={() => choose('/#pipeline')}>
              Open the deployment model
            </button>
          </section>
        )}
      </div>
    </dialog>
  )
}
