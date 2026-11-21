import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Layers, Sparkles } from 'lucide-react'
import { Badge, Card, CardHeader, CardContent, CardFooter, GithubIcon } from '@/components/ui'
import { useProjects } from '@/hooks/useProjects'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/types'

const CATEGORIES = ['All', 'Full-Stack', 'AI/Data', 'Cloud', 'IoT'] as const

export function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const { data: projects, isLoading, isError } = useProjects(activeCategory)

  return (
    <section id="projects" className="py-24 bg-[var(--color-background)] relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Featured Case Studies</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-['Sora'] text-[var(--color-text)] mb-4">
            Production Software &amp; Architectures
          </h2>
          <p className="text-[var(--color-muted)] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Scalable SaaS products, AI workflows, and cloud data pipelines engineered for enterprise scale,
            HIPAA compliance, and high data reliability.
          </p>
        </motion.div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer',
                activeCategory === cat
                  ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20 scale-105'
                  : 'bg-[var(--color-secondary)] text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-secondary)]/80'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 text-[var(--color-muted)]">
            Failed to load projects. Please try refreshing.
          </div>
        ) : !projects || projects.length === 0 ? (
          <div className="text-center py-16">
            <Layers className="h-12 w-12 text-[var(--color-muted)] mx-auto mb-4" />
            <p className="text-[var(--color-muted)]">No projects found in this category.</p>
          </div>
        ) : (
          <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="h-full"
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="flex flex-col h-full group hover:border-[var(--color-primary)]/50 hover:shadow-xl hover:shadow-[var(--color-primary)]/5 transition-all duration-300 overflow-hidden bg-[var(--color-card)]">
      {/* Cover Image Header */}
      <div className="relative h-48 overflow-hidden bg-[var(--color-secondary)]">
        {project.coverImageUrl ? (
          <img
            src={project.coverImageUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--color-primary)]/20 to-[var(--color-accent)]/20 flex items-center justify-center">
            <Layers className="h-12 w-12 text-[var(--color-primary)]/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-card)]/80 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge variant="primary" className="font-semibold shadow-sm backdrop-blur-sm bg-[var(--color-card)]/90">
            {project.category}
          </Badge>
          {project.featured && (
            <Badge variant="accent" className="font-semibold backdrop-blur-sm bg-[var(--color-card)]/90">
              Featured
            </Badge>
          )}
        </div>
      </div>

      <CardHeader className="pb-2">
        <h3 className="font-['Sora'] font-bold text-[var(--color-text)] text-lg leading-snug group-hover:text-[var(--color-primary)] transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-[var(--color-muted)] font-medium mt-1">
          {project.shortDescription}
        </p>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pt-1">
        {/* Business Problem Solved */}
        <div className="p-3 rounded-xl bg-[var(--color-secondary)]/50 border border-[var(--color-border)]/50 text-xs text-[var(--color-text)] leading-relaxed">
          <span className="font-bold text-[var(--color-accent)] block uppercase tracking-wider text-[10px] mb-1">
            Business Problem Solved
          </span>
          {project.businessProblem}
        </div>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="default" className="text-[11px] py-0.5 px-2 bg-[var(--color-secondary)]">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="gap-3 pt-3 border-t border-[var(--color-border)]/60">
        {project.liveUrl ? (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-primary)] hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Live Demo
          </a>
        ) : (
          <span className="text-xs text-[var(--color-muted)] flex items-center gap-1">
            Enterprise Internal
          </span>
        )}
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors ml-auto"
          >
            <GithubIcon className="h-3.5 w-3.5" /> Code Repo
          </a>
        ) : null}
      </CardFooter>
    </Card>
  )
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] overflow-hidden animate-pulse bg-[var(--color-card)]">
      <div className="h-48 bg-[var(--color-secondary)]" />
      <div className="p-6 space-y-3">
        <div className="h-4 bg-[var(--color-secondary)] rounded w-3/4" />
        <div className="h-3 bg-[var(--color-secondary)] rounded w-full" />
        <div className="h-16 bg-[var(--color-secondary)] rounded w-full" />
        <div className="flex gap-2 mt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-16 bg-[var(--color-secondary)] rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}
