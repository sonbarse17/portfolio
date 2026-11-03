'use client'

import { useState, type FormEvent } from 'react'
import { site } from '@/content/site'
import { sanitizeInput } from '@/lib/utils'

type Status = 'idle' | 'sending' | 'sent' | 'error'

export function ContactForm() {
  const [status, setStatus] = useState<Status>('idle')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)

    // Hidden from people. A filled value means a bot, which gets a success message and no email.
    if (data.get('website')) {
      setStatus('sent')
      return
    }

    setStatus('sending')
    try {
      const { default: emailjs } = await import('@emailjs/browser')
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? '',
        {
          from_name: sanitizeInput(data.get('name')),
          from_email: sanitizeInput(data.get('email')),
          message: sanitizeInput(data.get('message')),
          to_name: site.name,
        },
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? ''
      )
      form.reset()
      setStatus('sent')
    } catch (error) {
      console.error('EmailJS error:', error)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="label mb-1.5 block">Name</span>
          <input name="name" required maxLength={100} autoComplete="name" className="field" />
        </label>
        <label className="block">
          <span className="label mb-1.5 block">Email</span>
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className="field"
          />
        </label>
      </div>
      <label className="block">
        <span className="label mb-1.5 block">What are you working on?</span>
        <textarea name="message" required maxLength={5000} rows={6} className="field resize-y" />
      </label>
      <div className="hidden" aria-hidden="true">
        <input name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending' : 'Send message'}
        </button>
        <p role="status" aria-live="polite" className="leading-snug">
          {status === 'sent' && <span className="text-ok">● Message sent. Thank you.</span>}
          {status === 'error' && (
            <span className="text-signal">
              ✕ That did not send. Please try again, or reach me on{' '}
              <a className="link" href={site.linkedin} target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
              .
            </span>
          )}
        </p>
      </div>
    </form>
  )
}
