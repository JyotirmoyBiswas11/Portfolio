import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import { Lock, AlertCircle, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import { auth } from '@/lib/firebase'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginData = z.infer<typeof loginSchema>

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginData) => {
    setLoading(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, data.email.trim(), data.password)
      navigate('/admin')
    } catch (err) {
      console.error('Login error:', err)
      setError('Invalid admin credentials. Please verify your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] flex flex-col justify-center items-center p-4 relative">
      {/* Back to site link */}
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Portfolio</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] text-white mb-4 shadow-lg shadow-[var(--color-primary)]/20">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-['Sora'] text-[var(--color-text)]">
            Portfolio CMS
          </h1>
          <p className="text-xs text-[var(--color-muted)] mt-1">
            Restricted Admin Console for Jyotirmoy Biswas
          </p>
        </div>

        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 sm:p-7 shadow-xl shadow-black/5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl bg-red-500/10 border border-red-500/20 p-3 text-xs text-red-500">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <Input
                {...register('email')}
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--color-text)] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <Input
                {...register('password')}
                type="password"
                placeholder="••••••••••••"
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
              />
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading}
              size="lg"
              className="w-full h-11 text-sm font-semibold cursor-pointer mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Verifying Credentials...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <KeyRound className="h-4 w-4" />
                  Sign In to CMS
                </span>
              )}
            </Button>
          </form>
        </div>

        <div className="text-center mt-6 flex items-center justify-center gap-1.5 text-xs text-[var(--color-muted)]">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <span>App Check Enforced · Database: <code className="font-mono text-[var(--color-accent)]">(default)</code></span>
        </div>
      </motion.div>
    </div>
  )
}
