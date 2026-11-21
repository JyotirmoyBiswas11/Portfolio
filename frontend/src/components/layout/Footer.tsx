import { Mail, ShieldCheck, MapPin, Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GithubIcon, LinkedinIcon } from '@/components/ui'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-background)] py-14 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[var(--color-border)]/60">
          {/* Brand info */}
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold font-['Sora']">
                JB
              </div>
              <span className="font-['Sora'] font-bold text-[var(--color-text)]">
                Jyotirmoy Biswas
              </span>
            </div>
            <p className="text-xs text-[var(--color-muted)] max-w-sm">
              Full-Stack Developer &amp; M.Sc. Business Intelligence student at ISM Munich.
              Available for Werkstudent roles.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-[11px] text-[var(--color-muted)]">
              <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" />
              <span>Rumfordstr. 32, 80469 Munich, Germany · §16b Residence Permit</span>
            </div>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/JyotirmoyBiswas11"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-secondary)] transition-all"
              aria-label="GitHub Profile"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
            <a
              href="https://linkedin.com/in/jyotirmoy-biswas-a92124256"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-accent)] hover:bg-[var(--color-secondary)] transition-all"
              aria-label="LinkedIn Profile"
            >
              <LinkedinIcon className="h-4 w-4" />
            </a>
            <a
              href="mailto:jyotirmoybiswas0407@gmail.com"
              className="p-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-secondary)] transition-all"
              aria-label="Direct Email"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Bottom copyright & admin access */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-xs text-[var(--color-muted)]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>© {year} Jyotirmoy Biswas. Built with React 19, TypeScript &amp; Firebase.</span>
          </div>

          <Link
            to="/admin"
            className="flex items-center gap-1.5 text-[11px] hover:text-[var(--color-text)] transition-colors p-1"
          >
            <Lock className="h-3 w-3" />
            <span>Admin CMS</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
