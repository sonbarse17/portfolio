'use client'

import { useMemo, useState } from 'react'
import { evaluateAccess, secureDefault, type AccessRequest } from '@/lib/lab/iam'
import { cn } from '@/lib/utils'
import { Check } from './controls'

const groups: { title: string; fields: { key: keyof AccessRequest; label: string }[] }[] = [
  {
    title: 'Sign-in',
    fields: [
      { key: 'ssoAuthenticated', label: 'Signed in with SSO' },
      { key: 'mfa', label: 'MFA completed' },
      { key: 'compliantDevice', label: 'Managed, compliant device' },
      { key: 'roleMapped', label: 'Group maps to an AWS role' },
    ],
  },
  {
    title: 'AWS policies',
    fields: [
      { key: 'explicitDeny', label: 'A policy has a matching Deny' },
      { key: 'scpAllows', label: 'SCP allows the action' },
      { key: 'boundaryAllows', label: 'Permissions boundary allows it' },
      { key: 'identityAllows', label: 'Identity policy allows it' },
      { key: 'resourcePolicyAllows', label: 'Resource policy names this role' },
    ],
  },
  {
    title: 'Path',
    fields: [
      { key: 'fromPrivateNetwork', label: 'Coming through the VPC endpoint' },
      { key: 'tls12', label: 'Using TLS 1.2 or newer' },
    ],
  },
]

export function AccessTraceLab() {
  const [request, setRequest] = useState(secureDefault)
  const { checks, failedAt, allowed } = useMemo(() => evaluateAccess(request), [request])

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-5 lg:col-span-4">
        <p className="leading-snug text-muted">
          The request: a member of the platform team reads an object from a private S3 bucket.
        </p>
        {groups.map((group) => (
          <fieldset key={group.title}>
            <legend className="label mb-1 text-muted">{group.title}</legend>
            {group.fields.map((field) => (
              <Check
                key={field.key}
                label={field.label}
                checked={request[field.key]}
                onChange={(on) => setRequest((r) => ({ ...r, [field.key]: on }))}
              />
            ))}
          </fieldset>
        ))}
        <button
          type="button"
          className="btn-quiet"
          onClick={() => setRequest(secureDefault)}
          disabled={allowed && request === secureDefault}
        >
          Reset request
        </button>
      </div>

      <div className="lg:col-span-8">
        <div role="status" aria-live="polite">
          <p className={cn('display text-[clamp(4rem,12vw,8rem)]', !allowed && 'text-signal')}>
            {allowed ? 'Allow' : 'Deny'}
          </p>
          {!allowed && (
            <p className="lede mt-2">
              Stopped at {checks[failedAt].name}. {checks[failedAt].why}
            </p>
          )}
        </div>

        <ol className="hairline mt-6 divide-y border-y">
          {checks.map((check, i) => {
            const evaluated = failedAt === -1 || i <= failedAt
            return (
              <li
                key={check.name}
                className={cn(
                  'hairline grid grid-cols-[1.25rem_1fr] gap-x-2 py-2.5 sm:grid-cols-[1.25rem_6.5rem_1fr]',
                  !evaluated && 'opacity-60'
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    evaluated ? (check.pass ? 'text-ok' : 'text-signal') : 'text-muted'
                  )}
                >
                  {evaluated ? (check.pass ? '●' : '✕') : '○'}
                </span>
                <span className="label self-center text-muted">{check.layer}</span>
                <div className="col-start-2 sm:col-start-3">
                  <span className="font-medium">{check.name}</span>
                  <p className="text-base leading-snug text-muted">
                    {evaluated ? check.why : 'Not evaluated: an earlier check stopped the request.'}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </div>
  )
}
