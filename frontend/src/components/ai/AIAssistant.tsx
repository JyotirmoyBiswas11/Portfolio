import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Send, Bot, User, Key, Check, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui'
import { cn } from '@/lib/utils'
import { useProfile } from '@/hooks/useProfile'
import { useProjects } from '@/hooks/useProjects'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const SUGGESTED_QUESTIONS = [
  'Tell me about DataLens AI (Agentic Extractor).',
  'What is Jyotirmoy’s availability in Munich?',
  'Tell me about his SaaS work on Octopus.',
  'What are his core backend & cloud skills?',
]

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: profile } = useProfile()
  const { data: projects } = useProjects()

  // API Key priority: env var -> localStorage
  const envKey = import.meta.env.VITE_GEMINI_API_KEY || ''
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('portfolio_gemini_api_key') || envKey
  })
  const [showKeyInput, setShowKeyInput] = useState(false)
  const [tempKey, setTempKey] = useState('')

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hi! I am Jyotirmoy’s AI Recruiter Assistant, powered by Gemini. Ask me anything about his technical stack, work on Octopus SaaS, or his M.Sc. Business Intelligence studies in Munich!',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isGenerating, isOpen])

  const saveCustomKey = () => {
    if (tempKey.trim()) {
      localStorage.setItem('portfolio_gemini_api_key', tempKey.trim())
      setApiKey(tempKey.trim())
      setShowKeyInput(false)
    }
  }

  // Construct grounded system instructions using real profile and projects data
  const buildSystemContext = () => {
    const profileSummary = profile
      ? `
Name: ${profile.name}
Headline: ${profile.headline}
Subheadline: ${profile.subheadline}
Location: ${profile.location}
Availability: ${profile.availabilityStatus}
Email: ${profile.email}
LinkedIn: ${profile.linkedinUrl}
GitHub: ${profile.githubUrl}
Bio: ${profile.bio}
Skills: ${profile.skills.map((s) => `${s.category}: ${s.items.join(', ')}`).join(' | ')}
Experience: ${profile.experience.map((e) => `${e.role} at ${e.company} (${e.period}, ${e.location}) - Duties: ${e.description.join('; ')}`).join(' || ')}
Education: ${profile.education.map((ed) => `${ed.degree} in ${ed.field} at ${ed.institution} (${ed.period})`).join(' || ')}
`
      : 'Jyotirmoy Biswas, Full Stack Developer & M.Sc. BI student in Munich.'

    const projectsSummary = projects
      ? projects
          .map(
            (p) =>
              `Title: ${p.title} (${p.category}) - Problem Solved: ${p.businessProblem} - Tech Stack: ${p.techStack.join(', ')} - Live Demo: ${p.liveUrl ?? 'Internal'}`
          )
          .join('\n')
      : ''

    return `You are the AI Recruiter Assistant on Jyotirmoy Biswas's personal engineering portfolio website.
Your objective is to help tech recruiters, engineering managers, and founders understand Jyotirmoy's suitability for software engineering and data roles in Munich.

GROUND TRUTH CONTEXT ABOUT JYOTIRMOY:
${profileSummary}

FEATURED PROJECTS:
${projectsSummary}

BEHAVIORAL RULES:
1. Always be concise, polite, professional, and confident.
2. Ground all answers strictly on the facts provided above. Do not hallucinate credentials or work experience.
3. Highlight that Jyotirmoy has a §16b German student residence permit allowing 140 full days or 280 half days per year, and is currently living in Munich (Rumfordstr. 32).
4. Emphasize his real enterprise experience at Pravaah Consulting working on Octopus SaaS (10k+ daily users, HIPAA compliance, 50k+ data migration).
5. If a question is unrelated to Jyotirmoy's career, portfolio, or technical skills, politely redirect back to his qualifications.`
  }

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt ?? input
    const trimmed = textToSend.trim()
    if (!trimmed || isGenerating) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    if (!userPrompt) setInput('')
    setIsGenerating(true)

    // Check if we have an API key for live Gemini
    if (apiKey) {
      try {
        const systemInstruction = buildSystemContext()
        const historyForGemini = messages
          .filter((m) => m.id !== 'welcome')
          .map((m) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          }))

        const payload = {
          contents: [
            ...historyForGemini,
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nUSER QUESTION: ${trimmed}` }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800,
          },
        }

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          }
        )

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData?.error?.message || `API error (${res.status})`)
        }

        const data = await res.json()
        const responseText =
          data?.candidates?.[0]?.content?.parts?.[0]?.text ||
          'I could not generate a response. Please try again.'

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: responseText,
            timestamp: new Date(),
          },
        ])
      } catch (err) {
        console.error('Gemini API call failed:', err)
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `The Gemini API request failed (${err instanceof Error ? err.message : 'Unknown error'}). You can update the Gemini API key via the settings button or contact Jyotirmoy directly at jyotirmoybiswas0407@gmail.com!`,
            timestamp: new Date(),
          },
        ])
      } finally {
        setIsGenerating(false)
      }
    } else {
      // Fallback knowledge engine when no Gemini API key is configured yet
      setTimeout(() => {
        let answer = ''
        const lower = trimmed.toLowerCase()

        if (lower.includes('datalens') || lower.includes('extractor') || lower.includes('agentic') || lower.includes('csv')) {
          answer = `**DataLens AI (Agentic AI Data Value Extractor)** is an enterprise SaaS platform architected by Jyotirmoy. It ingests unstructured CSV business records and executes a 4-Stage Gemini 1.5 Flash AI Agent pipeline:
1. Column Schema & Type Classification
2. Anomaly & Data Cleanliness Auditing (0-100 Score)
3. Quantitative KPI Extraction (totals, growth, trends)
4. Dynamic Visualization & Aggregation Specs rendered with Recharts.

• **Architecture**: React 19 Frontend + Express.js Backend on GCP Cloud Run
• **Storage & Security**: Firebase Cloud Storage with resumable uploads, App Check (reCAPTCHA v3), and Firestore
• **Live Demo**: https://my-projects-2562a.web.app/
• **GitHub Repo**: https://github.com/JyotirmoyBiswas11/agentic-ai-data-extractor`
        } else if (lower.includes('availab') || lower.includes('work') || lower.includes('visa') || lower.includes('permit') || lower.includes('student')) {
          answer = `Jyotirmoy is currently living in Munich (Rumfordstr. 32) and is actively open to **Werkstudent Software Engineering** positions. He holds a §16b German student residence permit, granting him legal work authorization for 140 full days or 280 half days per calendar year.`
        } else if (lower.includes('octopus') || lower.includes('saas') || lower.includes('pravaah')) {
          answer = `At Pravaah Consulting, Jyotirmoy was a core contributor to **Octopus SaaS**, an enterprise medical waste and logistics compliance platform used by 10,000+ daily active users. He architected Fleet Routing, HIPAA billing modules, multi-level organizational trees, and migrated 50,000+ records with zero data loss using Firebase Cloud Tasks.`
        } else if (lower.includes('skill') || lower.includes('stack') || lower.includes('tech') || lower.includes('react') || lower.includes('node')) {
          answer = `Jyotirmoy's primary stack includes:\n• **Frontend**: TypeScript, React.js, Tailwind CSS, Next.js, HTML5\n• **Backend & Cloud**: Node.js, Express, Firebase (Firestore, Auth, Storage, Functions), Google Cloud Platform (GCP), RESTful APIs, SQL\n• **Data & BI**: Python, Machine Learning, CNNs, ETL pipelines, Business Intelligence.`
        } else if (lower.includes('bi') || lower.includes('master') || lower.includes('ism') || lower.includes('study')) {
          answer = `Jyotirmoy is pursuing a Master of Science (M.Sc.) in **Business Intelligence and Data Science** at the International School of Management (ISM) in Munich. Previously, he earned both an M.Sc. and B.Sc. in Computer Science from the University of Calcutta, where his master's thesis focused on Convolutional Neural Networks (CNNs).`
        } else {
          answer = `Jyotirmoy is a Full-Stack Developer & M.Sc. Business Intelligence student in Munich with 2+ years of enterprise SaaS experience (Octopus SaaS, 10k+ users). He specializes in TypeScript, React, Node.js, Firebase, and GCP.\n\nTip: You can add a live Gemini API key via the key icon above to unlock arbitrary conversational Q&A!`
        }

        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: answer,
            timestamp: new Date(),
          },
        ])
        setIsGenerating(false)
      }, 500)
    }
  }

  return (
    <>
      {/* Floating Action Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.8, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-40 h-14 px-5 rounded-full shadow-xl cursor-pointer',
          'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] text-white',
          'flex items-center gap-2.5 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all',
          isOpen && 'hidden'
        )}
        aria-label="Open AI Recruiter Assistant"
      >
        <Sparkles className="h-5 w-5 animate-pulse text-white" />
        <span className="font-['Sora'] font-semibold text-xs tracking-wide">
          Ask AI Assistant
        </span>
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
        </span>
      </motion.button>

      {/* Slide-out Chat Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 cursor-pointer"
            />

            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:max-w-md bg-[var(--color-card)] border-l border-[var(--color-border)] shadow-2xl z-50 flex flex-col overflow-hidden"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-4 border-b border-[var(--color-border)] bg-[var(--color-secondary)]/40">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] text-white flex items-center justify-center shadow-md">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-['Sora'] font-bold text-sm text-[var(--color-text)] flex items-center gap-1.5">
                      Recruiter Assistant
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[var(--color-accent)]/15 text-[var(--color-accent)] font-semibold">
                        Gemini AI
                      </span>
                    </h3>
                    <p className="text-[11px] text-[var(--color-muted)]">
                      Grounded on Jyotirmoy&apos;s verified credentials
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowKeyInput(!showKeyInput)}
                    className="p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-secondary)] transition-colors cursor-pointer"
                    title="Configure Gemini API Key"
                  >
                    <Key className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-secondary)] transition-colors cursor-pointer"
                    aria-label="Close Assistant"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Optional Key Input Banner */}
              {showKeyInput && (
                <div className="p-3 bg-[var(--color-secondary)]/80 border-b border-[var(--color-border)] space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text)]">
                    <span>Custom Gemini API Key</span>
                    <span className="text-[10px] text-[var(--color-muted)]">Saved locally</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={tempKey}
                      onChange={(e) => setTempKey(e.target.value)}
                      placeholder={apiKey ? '••••••••••••••••' : 'Enter AIzaSy...'}
                      className="flex-1 h-8 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] px-2.5 text-xs text-[var(--color-text)] outline-none focus:border-[var(--color-primary)]"
                    />
                    <Button size="sm" onClick={saveCustomKey} className="h-8 px-3 text-xs">
                      <Check className="h-3.5 w-3.5" /> Save
                    </Button>
                  </div>
                </div>
              )}

              {/* Chat Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      'flex items-start gap-2.5',
                      msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                    )}
                  >
                    <div
                      className={cn(
                        'w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs shadow-xs',
                        msg.role === 'user'
                          ? 'bg-[var(--color-primary)] text-white'
                          : 'bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] text-white'
                      )}
                    >
                      {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap',
                        msg.role === 'user'
                          ? 'bg-[var(--color-primary)] text-white rounded-tr-xs'
                          : 'bg-[var(--color-secondary)]/80 text-[var(--color-text)] border border-[var(--color-border)]/50 rounded-tl-xs'
                      )}
                    >
                      {msg.content}
                    </div>
                  </motion.div>
                ))}

                {isGenerating && (
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-accent)] text-white flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="rounded-2xl rounded-tl-xs px-4 py-3 bg-[var(--color-secondary)]/80 border border-[var(--color-border)]/50">
                      <div className="flex items-center gap-1.5 py-1">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce" />
                        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:0.2s]" />
                        <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-bounce [animation-delay:0.4s]" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Suggested Questions Pills */}
              <div className="px-4 py-2 border-t border-[var(--color-border)]/40 bg-[var(--color-secondary)]/20">
                <p className="text-[10px] font-semibold text-[var(--color-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <HelpCircle className="h-3 w-3" /> Quick Prompts
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      onClick={() => void handleSend(q)}
                      disabled={isGenerating}
                      className="text-[11px] px-2.5 py-1 rounded-full bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] transition-all cursor-pointer truncate max-w-full"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chat Input Field */}
              <div className="p-3 border-t border-[var(--color-border)] bg-[var(--color-card)]">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    void handleSend()
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask about Octopus SaaS, Munich availability..."
                    disabled={isGenerating}
                    className="flex-1 h-10 rounded-xl bg-[var(--color-secondary)]/70 border border-[var(--color-border)] px-3 text-xs sm:text-sm text-[var(--color-text)] placeholder:text-[var(--color-muted)] outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                  <Button
                    type="submit"
                    disabled={isGenerating || !input.trim()}
                    size="icon"
                    className="h-10 w-10 rounded-xl flex-shrink-0 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
                <p className="text-[10px] text-center text-[var(--color-muted)] mt-2">
                  Strictly grounded on Firestore portfolio data · No fabricated claims
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
