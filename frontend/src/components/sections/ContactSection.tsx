import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { CheckCircle2, Send, AlertCircle, Mail, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react'
import { Button, Input, Textarea } from '@/components/ui'
import { db } from '@/lib/firebase'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email address'),
  company: z.string().max(100).optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
})

type ContactFormData = z.infer<typeof contactSchema>

export function ContactSection() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    setStatus('submitting')
    setErrorMessage('')
    try {
      await addDoc(collection(db, 'contact_messages'), {
        name: data.name.trim(),
        email: data.email.trim(),
        company: data.company?.trim() ?? '',
        message: data.message.trim(),
        createdAt: serverTimestamp(),
        read: false,
      })
      setStatus('success')
      reset()
    } catch (err) {
      console.error('Contact submission error:', err)
      setStatus('error')
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to deliver message right now. Please email directly at jyotirmoybiswas0407@gmail.com.'
      )
    }
  }

  return (
    <section id="contact" className="py-24 bg-[var(--color-background)] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wider">
              <Mail className="h-3.5 w-3.5" />
              <span>Direct Recruitment Channel</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-['Sora'] text-[var(--color-text)]">
              Let&apos;s Connect in Munich
            </h2>

            <p className="text-[var(--color-muted)] text-sm sm:text-base leading-relaxed">
              I am actively interviewing for <strong>Werkstudent Software Engineering</strong> roles in Munich.
              Whether you have an open position or want to discuss a technical case study, feel free to reach out.
            </p>

            {/* Direct contact points */}
            <div className="space-y-4 pt-4 border-t border-[var(--color-border)]/60">
              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[var(--color-secondary)]/50 border border-[var(--color-border)]/50">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)] flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-muted)]">Direct Email</p>
                  <a
                    href="mailto:jyotirmoybiswas0407@gmail.com"
                    className="text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    jyotirmoybiswas0407@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[var(--color-secondary)]/50 border border-[var(--color-border)]/50">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-muted)]">Phone / WhatsApp</p>
                  <a
                    href="tel:+491728582829"
                    className="text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    (+49) 1728582829
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[var(--color-secondary)]/50 border border-[var(--color-border)]/50">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-medium text-[var(--color-muted)]">Location</p>
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    Rumfordstr. 32, 80469 Munich, Germany
                  </p>
                </div>
              </div>
            </div>

            {/* App Check badge notice */}
            <div className="flex items-center gap-2 text-xs text-[var(--color-muted)] pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
              <span>Protected by Firebase App Check &amp; reCAPTCHA v3</span>
            </div>
          </motion.div>

          {/* Right Column: Interactive Form (7 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-8 shadow-xl shadow-black/5">
              <AnimatePresence mode="wait">
                {status === 'success' ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto ring-8 ring-emerald-500/5">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="font-['Sora'] font-bold text-2xl text-[var(--color-text)]">
                      Inquiry Received!
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] max-w-md mx-auto leading-relaxed">
                      Thank you for contacting me. Your message has been safely logged in Firestore.
                      I typically respond within a few hours.
                    </p>
                    <div className="pt-4">
                      <Button
                        variant="secondary"
                        onClick={() => setStatus('idle')}
                        className="cursor-pointer"
                      >
                        Send Another Inquiry
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="border-b border-[var(--color-border)]/60 pb-4 mb-2">
                      <h3 className="font-['Sora'] font-bold text-lg text-[var(--color-text)]">
                        Send a Message
                      </h3>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">
                        Messages are routed directly to Jyotirmoy&apos;s admin dashboard.
                      </p>
                    </div>

                    {status === 'error' && (
                      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-500">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
                          Your Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                          {...register('name')}
                          placeholder="Jane Doe"
                          aria-invalid={Boolean(errors.name)}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
                          Work Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                          {...register('email')}
                          type="email"
                          placeholder="jane@company.com"
                          aria-invalid={Boolean(errors.email)}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
                        Company or Team <span className="text-[var(--color-muted)] text-[10px] lowercase">(optional)</span>
                      </label>
                      <Input
                        {...register('company')}
                        placeholder="e.g. BMW Tech, Celonis, Personio..."
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
                        Message / Role Description <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        {...register('message')}
                        rows={4}
                        placeholder="Hi Jyotirmoy, we came across your SaaS & BI portfolio and would love to discuss a Werkstudent role..."
                        aria-invalid={Boolean(errors.message)}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={status === 'submitting'}
                      size="lg"
                      className="w-full h-12 text-sm font-semibold shadow-lg shadow-[var(--color-primary)]/20 cursor-pointer"
                    >
                      {status === 'submitting' ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                          Submitting securely...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Send Inquiry
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
