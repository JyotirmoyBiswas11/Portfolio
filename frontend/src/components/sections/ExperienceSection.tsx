import { motion } from 'framer-motion'
import { Badge } from '@/components/ui'
import { Briefcase, GraduationCap, Code2, Award, Globe2, CheckCircle2 } from 'lucide-react'
import { useProfile } from '@/hooks/useProfile'

export function ExperienceSection() {
  const { data: profile } = useProfile()

  const experience = profile?.experience ?? []
  const education = profile?.education ?? []
  const skills = profile?.skills ?? []

  return (
    <section id="experience" className="py-24 bg-[var(--color-secondary)]/30 border-y border-[var(--color-border)]/50 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--color-accent)]/10 text-[var(--color-accent)] text-xs font-semibold uppercase tracking-wider mb-3">
            <Briefcase className="h-3.5 w-3.5" />
            <span>Track Record &amp; Education</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold font-['Sora'] text-[var(--color-text)] mb-4">
            Professional Experience &amp; Tech Stack
          </h2>
          <p className="text-[var(--color-muted)] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Hands-on enterprise SaaS development combined with rigorous academic training in
            Computer Science and Business Intelligence &amp; Data Science in Munich.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Work Experience & Education (7 cols) */}
          <div className="lg:col-span-7 space-y-12">
            {/* Experience List */}
            <div>
              <div className="flex items-center gap-2.5 mb-8">
                <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Briefcase className="h-5 w-5" />
                </div>
                <h3 className="font-['Sora'] text-xl font-bold text-[var(--color-text)]">
                  Work Experience
                </h3>
              </div>

              <div className="space-y-8">
                {experience.map((exp, i) => (
                  <motion.div
                    key={`${exp.company}-${exp.role}-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-6 border-l-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors group"
                  >
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[var(--color-primary)] ring-4 ring-[var(--color-background)] group-hover:scale-125 transition-transform" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                      <h4 className="font-bold text-[var(--color-text)] font-['Sora'] text-base">
                        {exp.role}
                      </h4>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--color-secondary)] text-[var(--color-muted)] w-fit">
                        {exp.period}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-primary)] mb-3">
                      <span>{exp.company}</span>
                      <span>•</span>
                      <span className="text-[var(--color-muted)]">{exp.location}</span>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {exp.description.map((item, j) => (
                        <li key={j} className="text-xs sm:text-sm text-[var(--color-muted)] flex items-start gap-2.5 leading-relaxed">
                          <CheckCircle2 className="h-4 w-4 text-[var(--color-accent)] flex-shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {exp.techStack.map((tech) => (
                        <Badge key={tech} variant="default" className="text-[11px] py-0.5 px-2 bg-[var(--color-card)] border border-[var(--color-border)]">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Education List */}
            <div>
              <div className="flex items-center gap-2.5 mb-8">
                <div className="p-2 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  <GraduationCap className="h-5 w-5" />
                </div>
                <h3 className="font-['Sora'] text-xl font-bold text-[var(--color-text)]">
                  Academic Background
                </h3>
              </div>

              <div className="space-y-6">
                {education.map((edu, i) => (
                  <motion.div
                    key={`${edu.institution}-${i}`}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="relative pl-6 border-l-2 border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors group"
                  >
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-[var(--color-accent)] ring-4 ring-[var(--color-background)] group-hover:scale-125 transition-transform" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-1">
                      <h4 className="font-bold text-[var(--color-text)] font-['Sora'] text-sm sm:text-base">
                        {edu.degree} in {edu.field}
                      </h4>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[var(--color-secondary)] text-[var(--color-muted)] w-fit">
                        {edu.period}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-[var(--color-accent)] mb-2">
                      <span>{edu.institution}</span>
                      <span>•</span>
                      <span className="text-[var(--color-muted)]">{edu.location}</span>
                    </div>

                    {edu.highlights && edu.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {edu.highlights.map((h) => (
                          <span key={h} className="text-[11px] px-2 py-0.5 rounded-md bg-[var(--color-secondary)]/80 text-[var(--color-text)] font-medium">
                            {h}
                          </span>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Skills, Languages & Certifications (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            {/* Skills Card */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6">
                <div className="p-2 rounded-lg bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Code2 className="h-5 w-5" />
                </div>
                <h3 className="font-['Sora'] text-lg font-bold text-[var(--color-text)]">
                  Technical Expertise
                </h3>
              </div>

              <div className="space-y-5">
                {skills.map((group) => (
                  <div key={group.category} className="space-y-2">
                    <p className="text-[11px] font-bold text-[var(--color-muted)] uppercase tracking-wider">
                      {group.category}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="text-xs px-2.5 py-1 rounded-lg bg-[var(--color-secondary)] text-[var(--color-text)] font-medium hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-primary)] transition-colors"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications Card */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Award className="h-5 w-5" />
                </div>
                <h3 className="font-['Sora'] text-lg font-bold text-[var(--color-text)]">
                  Certifications
                </h3>
              </div>

              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-[var(--color-secondary)]/40 border border-[var(--color-border)]/50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[var(--color-text)]">
                        Professional Certificate in General Management
                      </h4>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">
                        Institute of Management Technology (IMT), Ghaziabad
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Sep 2026
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--color-muted)] font-mono mt-1">
                    Credential ID: 194568296
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-[var(--color-secondary)]/40 border border-[var(--color-border)]/50">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-[var(--color-text)]">
                        AI Tools Workshop
                      </h4>
                      <p className="text-xs text-[var(--color-muted)] mt-0.5">
                        Issued by Be10x
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Apr 2026
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--color-muted)] font-mono mt-1">
                    Credential ID: 0270772f-3809-4400-b29b
                  </p>
                </div>
              </div>
            </div>

            {/* Languages Card */}
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="p-2 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  <Globe2 className="h-5 w-5" />
                </div>
                <h3 className="font-['Sora'] text-lg font-bold text-[var(--color-text)]">
                  Languages
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-xl bg-[var(--color-secondary)]/50">
                  <p className="text-xs font-bold text-[var(--color-text)]">English</p>
                  <p className="text-[11px] text-[var(--color-accent)] font-semibold">C1 Professional</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--color-secondary)]/50">
                  <p className="text-xs font-bold text-[var(--color-text)]">German</p>
                  <p className="text-[11px] text-amber-500 font-semibold">Beginner / Learning</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--color-secondary)]/50">
                  <p className="text-xs font-bold text-[var(--color-text)]">Bengali</p>
                  <p className="text-[11px] text-[var(--color-muted)]">Native Speaker</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--color-secondary)]/50">
                  <p className="text-xs font-bold text-[var(--color-text)]">Hindi</p>
                  <p className="text-[11px] text-[var(--color-muted)]">Fluent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
