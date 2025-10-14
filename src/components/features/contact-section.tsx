'use client'

import { useState, useRef, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { sanitizeInput } from '@/lib/utils'

const ContactGlobe = lazy(() =>
  import('@/components/ui/contact-globe').then((mod) => ({ default: mod.ContactGlobe }))
)

export function ContactSection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const formRef = useRef(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const templateParams = {
        from_name: sanitizeInput(name),
        from_email: sanitizeInput(email),
        message: sanitizeInput(message),
        to_name: 'Sushant Sonbarse',
      }

      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        templateParams,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )

      setName('')
      setEmail('')
      setMessage('')
      setIsSubmitted(true)
      setTimeout(() => setIsSubmitted(false), 5000)
    } catch (error) {
      console.error('EmailJS Error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Failed to send message: ${errorMessage}. Please try again.`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-black dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4"
        >
          Get In Touch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-center text-gray-600 dark:text-gray-400 mb-12 text-lg"
        >
          Let&apos;s connect and build something amazing together
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-xl">
              <CardContent className="p-8">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Your message..."
                      required
                      className="min-h-[150px] resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full relative overflow-hidden group"
                    size="lg"
                  >
                    <span className="relative z-10">
                      {isSubmitting
                        ? 'Sending...'
                        : isSubmitted
                          ? 'Message Sent! ✓'
                          : 'Send Message'}
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="h-full"
          >
            <Suspense
              fallback={
                <div className="w-full h-[500px] lg:h-[600px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-lg animate-pulse" />
              }
            >
              <ContactGlobe />
            </Suspense>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
