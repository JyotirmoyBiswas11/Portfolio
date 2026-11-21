import type { Variants } from 'framer-motion'
import { motion } from 'framer-motion'
import { Download, ArrowRight, MapPin, Sparkles } from 'lucide-react'
import { Badge, GithubIcon, LinkedinIcon } from '@/components/ui'
import { useProfile } from '@/hooks/useProfile'

const techStack = [
  'TypeScript',
  'React.js',
  'Node.js',
  'Firebase',
  'GCP',
  'Python',
  'Tailwind CSS',
  'SQL',
]

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
}
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export function HeroSection() {
  const { data: profile } = useProfile()

  const githubUrl = profile?.githubUrl || 'https://github.com/JyotirmoyBiswas11'
  const linkedinUrl = profile?.linkedinUrl || 'https://linkedin.com/in/jyotirmoy-biswas-a92124256'
  const cvPath = profile?.cvStoragePath || '#'

  return (
    <section
      id="hero"
      className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-24 pb-16"
    >
      {/* Background gradient lights */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-primary)]/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[var(--color-accent)]/15 rounded-full blur-3xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
          style={{
            backgroundImage: `linear-gradient(var(--color-text) 1px, transparent 1px), linear-gradient(90deg, var(--color-text) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: Content (7 cols) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6"
          >
            {/* Availability status badge */}
            <motion.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-card)]/90 backdrop-blur-sm px-4 py-2 text-xs sm:text-sm text-[var(--color-text)] shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <MapPin className="h-3.5 w-3.5 text-[var(--color-accent)]" />
                <span className="font-medium text-[var(--color-text)]">
                  Open to Working Student Roles · Munich
                </span>
                <span className="hidden sm:inline text-[var(--color-muted)] text-xs border-l border-[var(--color-border)] pl-2">
                  §16b Permit (140 full / 280 half days)
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.div variants={itemVariants} className="space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-['Sora'] text-[var(--color-text)] leading-[1.1] tracking-tight">
                Full-Stack Developer
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] via-indigo-400 to-[var(--color-accent)]">
                  &amp; BI Engineer
                </span>
              </h1>
            </motion.div>

            {/* Sub-headline positioning statement */}
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-[var(--color-muted)] leading-relaxed max-w-xl"
            >
              Bridging robust full-stack SaaS engineering (TypeScript, React, Node.js, Firebase, GCP)
              with Business Intelligence &amp; Data Science. Currently pursuing M.Sc. BI at ISM Munich.
            </motion.p>

            {/* Primary CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <button
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-2 h-11 px-6 text-sm font-semibold rounded-lg bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20 hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
              >
                View Projects <ArrowRight className="h-4 w-4" />
              </button>

              <a
                href={cvPath !== '#' ? cvPath : '#contact'}
                target={cvPath !== '#' ? '_blank' : undefined}
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (cvPath === '#') {
                    e.preventDefault()
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
                className="inline-flex items-center gap-2 h-11 px-5 text-sm font-semibold rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-text)] hover:bg-[var(--color-secondary)] active:scale-[0.98] transition-all cursor-pointer"
              >
                <Download className="h-4 w-4 text-[var(--color-accent)]" /> Download CV
              </a>

              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-11 px-4 text-sm font-medium rounded-lg text-[var(--color-text)] hover:bg-[var(--color-secondary)] transition-all"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="h-4 w-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>

              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-11 px-4 text-sm font-medium rounded-lg text-[var(--color-text)] hover:bg-[var(--color-secondary)] transition-all"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="h-4 w-4 text-[var(--color-accent)]" />
                <span className="hidden sm:inline">LinkedIn</span>
              </a>
            </motion.div>

            {/* Tech Stack Pills */}
            <motion.div variants={itemVariants} className="pt-4 border-t border-[var(--color-border)]/60">
              <p className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-2.5">
                Core Production Stack
              </p>
              <div className="flex flex-wrap gap-1.5">
                {techStack.map((tech) => (
                  <Badge key={tech} variant="default" className="text-xs py-1 px-2.5 bg-[var(--color-secondary)] font-medium">
                    {tech}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Terminal SaaS visual (5 cols) */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="lg:col-span-5"
          >
            <TerminalWidget />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TerminalWidget() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)]/90 backdrop-blur-md overflow-hidden shadow-2xl shadow-black/10 dark:shadow-black/40">
      {/* Chrome window titlebar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[var(--color-secondary)] border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="text-xs font-mono text-[var(--color-muted)] ml-2">
            developer-profile.ts
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[var(--color-accent)] font-mono font-medium">
          <Sparkles className="h-3 w-3" />
          <span>SaaS Grade</span>
        </div>
      </div>

      {/* Code contents */}
      <div className="p-5 font-mono text-xs sm:text-[13px] leading-relaxed space-y-2 text-[var(--color-text)]">
        <div>
          <span className="text-[var(--color-accent)] font-semibold">const</span>{' '}
          <span className="text-[var(--color-primary)] font-bold">engineer</span> = &#123;
        </div>
        <div className="pl-4 text-[var(--color-muted)]">
          name: <span className="text-emerald-500">&apos;Jyotirmoy Biswas&apos;</span>,
        </div>
        <div className="pl-4 text-[var(--color-muted)]">
          degree: <span className="text-emerald-500">&apos;M.Sc. Business Intelligence&apos;</span>,
        </div>
        <div className="pl-4 text-[var(--color-muted)]">
          campus: <span className="text-emerald-500">&apos;ISM Munich, Germany&apos;</span>,
        </div>
        <div className="pl-4 text-[var(--color-muted)]">
          experience: [
          <div className="pl-4 text-amber-500 dark:text-amber-300">
            &apos;DataLens AI (4-Stage Gemini Agent)&apos;,
          </div>
          <div className="pl-4 text-amber-500 dark:text-amber-300">
            &apos;Octopus SaaS (10k+ users, HIPAA)&apos;,
          </div>
          <div className="pl-4 text-amber-500 dark:text-amber-300">
            &apos;50k+ Cloud Record Migrations&apos;
          </div>
          ],
        </div>
        <div className="pl-4 text-[var(--color-muted)]">
          targetRole: <span className="text-emerald-500">&apos;Werkstudent Full-Stack / Data&apos;</span>,
        </div>
        <div className="pl-4 text-[var(--color-muted)]">
          status: <span className="text-emerald-400 font-bold">&apos;AVAILABLE_IN_MUNICH&apos;</span>,
        </div>
        <div>&#125;;</div>

        <div className="pt-2 border-t border-[var(--color-border)]/50 text-[var(--color-accent)] flex items-center gap-2">
          <span className="animate-pulse">▶</span>
          <span className="text-[var(--color-muted)]">console.log(engineer.status);</span>
        </div>
        <div className="bg-[var(--color-secondary)]/50 rounded-lg p-2 text-emerald-500 font-semibold flex items-center justify-between">
          <span>&gt; Ready to contribute in Munich</span>
          <span className="w-2 h-4 bg-emerald-500 animate-pulse" />
        </div>
      </div>
    </div>
  )
}
