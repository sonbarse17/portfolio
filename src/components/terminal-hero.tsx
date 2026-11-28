import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { StatusLine } from '@/components/status-line'
import { roles, site } from '@/content/site'

export type HeroProject = { slug: string; label: string; title: string; summary: string }

// Keep in step with `* 35ms` in terminal-home.css.
const CHAR_MS = 35
const GAP_MS = 250

function schedule(commands: readonly string[]) {
  let at = 0
  return commands.map((command) => {
    const style = { '--delay': `${at}ms`, '--chars': command.length } as CSSProperties
    at += command.length * CHAR_MS + GAP_MS
    return style
  })
}

function Step({
  command,
  style,
  children,
}: {
  command: string
  style: CSSProperties
  children: ReactNode
}) {
  return (
    <div className="term-step" style={style}>
      <p className="term-cmd" aria-hidden="true">
        <span className="term-prompt">❯</span>
        <span className="term-typed">{command}</span>
      </p>
      <div className="term-out">{children}</div>
    </div>
  )
}

const swatchVars = ['--accent', '--kw', '--str', '--num', '--fn', '--ty']

export function TerminalHero({ work }: { work: readonly HeroProject[] }) {
  const commands = ['whoami', 'cat statement.txt', 'ls ~/work', '']
  const [who, statement, list, idle] = schedule(commands)
  const facts: [string, string][] = [
    ['role', site.role],
    ['clouds', roles[0].stack.join(' · ')],
    // Taken from the About copy and the current role; no new claims.
    ['focus', 'CI/CD · Kubernetes · Terraform'],
    ['works', roles[0].where],
  ]

  return (
    <section className="wrap terminal-hero" aria-labelledby="home-title">
      <div className="term-session">
        <Step command={commands[0]} style={who}>
          <h1 id="home-title" className="term-name">
            <span>Sushant</span> <span>Sonbarse</span>
          </h1>
          <p className="term-meta">
            {site.role} · <span>Available for remote freelance work</span>
          </p>
        </Step>
        <Step command={commands[1]} style={statement}>
          <p className="term-statement">I build systems for the day things break.</p>
        </Step>
        <Step command={commands[2]} style={list}>
          <ul className="term-ls">
            {work.map((project) => (
              <li key={project.slug}>
                <Link href={`/work/${project.slug}`} prefetch={false} data-nav-stop="">
                  <span className="term-slug">{project.slug}/</span>
                  <span className="term-note">{project.label}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="term-actions">
            <Link href="#work" className="term-action" data-nav-stop="">
              See the work <span aria-hidden="true">→</span>
            </Link>
            <Link href="/resume" className="term-action" data-nav-stop="">
              View résumé <span aria-hidden="true">↗</span>
            </Link>
          </p>
        </Step>
        <div className="term-step" style={idle}>
          <p className="term-out term-cmd" aria-hidden="true">
            <span className="term-prompt">❯</span>
            <span className="term-cursor" />
          </p>
        </div>
      </div>

      <div className="fetch-panel">
        <picture className="fetch-portrait">
          <source media="(max-width: 620px)" srcSet="/assets/phase-five/sushant-mobile.webp" />
          <Image
            src="/assets/phase-five/sushant.webp"
            alt="Portrait of Sushant Sonbarse"
            width={710}
            height={1024}
            sizes="(max-width: 620px) 40vw, 220px"
            loading="eager"
            fetchPriority="high"
          />
        </picture>
        <div className="fetch-facts">
          <p className="fetch-host" aria-hidden="true">
            sushant@sonbarse
          </p>
          <dl>
            {facts.map(([key, value]) => (
              <div key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <p className="fetch-swatches" aria-hidden="true">
            {swatchVars.map((name) => (
              <i key={name} style={{ background: `var(${name})` }} />
            ))}
          </p>
        </div>
      </div>

      <StatusLine
        className="hero-status"
        path="~/sushant"
        hint="j/k move · enter open · : command"
      />
    </section>
  )
}
