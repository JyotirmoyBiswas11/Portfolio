import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import {
  Layers,
  Mail,
  Upload,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  Clock,
  Sparkles,
  Database,
  ExternalLink,
  ShieldCheck,
  FileText,
  Key,
} from 'lucide-react'
import { Button, Input, Textarea, Badge } from '@/components/ui'
import { auth, db, storage } from '@/lib/firebase'
import { INITIAL_PROJECTS, INITIAL_PROFILE } from '@/data/initialData'
import type { Project, ContactMessage, Profile } from '@/lib/types'

type AdminTab = 'projects' | 'messages' | 'profile' | 'settings'

export function AdminPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<AdminTab>('projects')

  // Projects state
  const [projects, setProjects] = useState<Project[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [isEditingProject, setIsEditingProject] = useState(false)
  const [currentProject, setCurrentProject] = useState<Partial<Project> | null>(null)
  const [techStackInput, setTechStackInput] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  // Messages state
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loadingMessages, setLoadingMessages] = useState(true)

  // Profile & CV state
  const [profile, setProfile] = useState<Profile | null>(null)
  const [uploadingCV, setUploadingCV] = useState(false)
  const [cvSuccessMessage, setCvSuccessMessage] = useState('')

  // Seed state
  const [seeding, setSeeding] = useState(false)
  const [seedSuccess, setSeedSuccess] = useState('')

  // Gemini Key state
  const [geminiKey, setGeminiKey] = useState(() => localStorage.getItem('portfolio_gemini_api_key') || '')
  const [keySaved, setKeySaved] = useState(false)

  // Load Projects
  const fetchProjects = async () => {
    setLoadingProjects(true)
    try {
      const snap = await getDocs(collection(db, 'projects'))
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project))
      setProjects(list)
    } catch (err) {
      console.error('Error loading projects:', err)
    } finally {
      setLoadingProjects(false)
    }
  }

  // Load Messages
  const fetchMessages = async () => {
    setLoadingMessages(true)
    try {
      const snap = await getDocs(collection(db, 'contact_messages'))
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ContactMessage))
      list.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0))
      setMessages(list)
    } catch (err) {
      console.error('Error loading messages:', err)
    } finally {
      setLoadingMessages(false)
    }
  }

  // Load Profile
  const fetchProfile = async () => {
    try {
      const snap = await getDocs(collection(db, 'profile'))
      const main = snap.docs.find((d) => d.id === 'main')
      if (main) {
        setProfile({ id: main.id, ...main.data() } as Profile)
      } else {
        setProfile(INITIAL_PROFILE as unknown as Profile)
      }
    } catch (err) {
      console.error('Error loading profile:', err)
    }
  }

  useEffect(() => {
    void fetchProjects()
    void fetchMessages()
    void fetchProfile()
  }, [])

  const handleSignOut = async () => {
    await signOut(auth)
    navigate('/admin/login')
  }

  // Seed Firestore pmtool with initial verified data
  const handleSeedDatabase = async () => {
    if (!window.confirm('This will seed the initial 6 projects and verified profile to Firestore "pmtool" database. Continue?')) {
      return
    }
    setSeeding(true)
    setSeedSuccess('')
    try {
      // 1. Seed Profile
      await setDoc(doc(db, 'profile', 'main'), {
        ...INITIAL_PROFILE,
        updatedAt: serverTimestamp(),
      })

      // 2. Seed Projects
      for (const p of INITIAL_PROJECTS) {
        await setDoc(doc(db, 'projects', p.id), {
          ...p,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        })
      }

      setSeedSuccess('Successfully seeded profile and all 6 projects into Firestore pmtool database!')
      await fetchProjects()
      await fetchProfile()
    } catch (err) {
      console.error('Seeding error:', err)
      alert(`Seeding failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSeeding(false)
    }
  }

  // Save Project (Create / Update)
  const handleSaveProject = async () => {
    if (!currentProject?.title) {
      alert('Please enter a project title')
      return
    }

    const techArray = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    const projectData = {
      title: currentProject.title,
      slug: currentProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: currentProject.category || 'Full-Stack',
      status: currentProject.status || 'published',
      featured: currentProject.featured ?? true,
      coverImageUrl: currentProject.coverImageUrl || '',
      shortDescription: currentProject.shortDescription || '',
      businessProblem: currentProject.businessProblem || '',
      techStack: techArray.length > 0 ? techArray : ['React', 'TypeScript', 'Node.js'],
      liveUrl: currentProject.liveUrl || null,
      githubUrl: currentProject.githubUrl || null,
      updatedAt: serverTimestamp(),
    }

    try {
      if (currentProject.id) {
        await updateDoc(doc(db, 'projects', currentProject.id), projectData)
      } else {
        await addDoc(collection(db, 'projects'), {
          ...projectData,
          createdAt: serverTimestamp(),
        })
      }
      setIsEditingProject(false)
      setCurrentProject(null)
      setTechStackInput('')
      await fetchProjects()
    } catch (err) {
      alert(`Failed to save project: ${err instanceof Error ? err.message : 'Error'}`)
    }
  }

  // Delete Project
  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return
    try {
      await deleteDoc(doc(db, 'projects', id))
      await fetchProjects()
    } catch (err) {
      alert(`Failed to delete: ${err instanceof Error ? err.message : 'Error'}`)
    }
  }

  // Upload Project Image to Storage
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    const storageRef = ref(storage, `portfolio/projects/${Date.now()}_${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      null,
      (err) => {
        alert(`Image upload failed: ${err.message}`)
        setUploadingImage(false)
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
        setCurrentProject((prev) => ({ ...prev, coverImageUrl: downloadUrl }))
        setUploadingImage(false)
      }
    )
  }

  // Upload CV PDF to Storage
  const handleCVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith('.pdf')) {
      alert('Please upload a PDF document')
      return
    }
    setUploadingCV(true)
    setCvSuccessMessage('')
    const storageRef = ref(storage, `portfolio/cv/Jyotirmoy_Biswas_CV_${Date.now()}.pdf`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      null,
      (err) => {
        alert(`CV upload failed: ${err.message}`)
        setUploadingCV(false)
      },
      async () => {
        const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref)
        // Update profile in Firestore
        await setDoc(
          doc(db, 'profile', 'main'),
          { cvStoragePath: downloadUrl, updatedAt: serverTimestamp() },
          { merge: true }
        )
        setCvSuccessMessage('CV uploaded successfully! The download button on the hero section now links to your new CV.')
        setUploadingCV(false)
        await fetchProfile()
      }
    )
  }

  // Mark Message Read
  const handleToggleMessageRead = async (msgId: string, currentRead: boolean) => {
    try {
      await updateDoc(doc(db, 'contact_messages', msgId), { read: !currentRead })
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, read: !currentRead } : m))
      )
    } catch (err) {
      console.error('Error updating message status:', err)
    }
  }

  // Delete Message
  const handleDeleteMessage = async (msgId: string) => {
    if (!window.confirm('Delete this message?')) return
    try {
      await deleteDoc(doc(db, 'contact_messages', msgId))
      setMessages((prev) => prev.filter((m) => m.id !== msgId))
    } catch (err) {
      console.error('Error deleting message:', err)
    }
  }

  const handleSaveGeminiKey = () => {
    localStorage.setItem('portfolio_gemini_api_key', geminiKey.trim())
    setKeySaved(true)
    setTimeout(() => setKeySaved(false), 2500)
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)] flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-card)]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-white flex items-center justify-center font-['Sora'] font-bold text-sm">
              JB
            </div>
            <div>
              <h1 className="font-['Sora'] font-bold text-sm text-[var(--color-text)]">
                Jyotirmoy Biswas · Portfolio CMS
              </h1>
              <p className="text-[10px] text-[var(--color-muted)] flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                Firebase App Check Active · Database: pmtool
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-secondary)] transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="h-3.5 w-3.5 text-[var(--color-accent)]" />
            </a>
            <Button variant="ghost" size="sm" onClick={handleSignOut} className="cursor-pointer text-xs">
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        {/* Navigation Tabs & Seeder Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'projects'
                  ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20'
                  : 'bg-[var(--color-secondary)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Projects ({projects.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer relative ${
                activeTab === 'messages'
                  ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20'
                  : 'bg-[var(--color-secondary)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Inquiries ({messages.length})</span>
              {messages.filter((m) => !m.read).length > 0 && (
                <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20'
                  : 'bg-[var(--color-secondary)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>CV &amp; Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[var(--color-primary)] text-white shadow-md shadow-[var(--color-primary)]/20'
                  : 'bg-[var(--color-secondary)] text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              <Key className="h-4 w-4" />
              <span>Gemini AI Key</span>
            </button>
          </div>

          {/* Seed Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSeedDatabase}
            disabled={seeding}
            className="cursor-pointer text-xs border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10"
          >
            <Database className="h-3.5 w-3.5" />
            <span>{seeding ? 'Seeding Firestore...' : '1-Click Seed pmtool DB'}</span>
          </Button>
        </div>

        {seedSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            <span>{seedSuccess}</span>
          </div>
        )}

        {/* ── TAB 1: PROJECTS ── */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-['Sora']">Portfolio Projects</h2>
                <p className="text-xs text-[var(--color-muted)]">
                  Manage cards, live URLs, categories, and business problem statements.
                </p>
              </div>
              <Button
                onClick={() => {
                  setCurrentProject({
                    title: '',
                    category: 'Full-Stack',
                    status: 'published',
                    featured: true,
                    coverImageUrl: '',
                    shortDescription: '',
                    businessProblem: '',
                    liveUrl: '',
                    githubUrl: '',
                  })
                  setTechStackInput('')
                  setIsEditingProject(true)
                }}
                className="cursor-pointer text-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add Project</span>
              </Button>
            </div>

            {/* Edit / Create Form Modal */}
            {isEditingProject && (
              <div className="p-6 rounded-2xl border border-[var(--color-primary)]/40 bg-[var(--color-card)] shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border)]">
                  <h3 className="font-bold text-base font-['Sora']">
                    {currentProject?.id ? 'Edit Project' : 'Create New Project'}
                  </h3>
                  <button
                    onClick={() => setIsEditingProject(false)}
                    className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Project Title</label>
                    <Input
                      value={currentProject?.title || ''}
                      onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                      placeholder="e.g. Agentic AI Extractor"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Category</label>
                    <select
                      value={currentProject?.category || 'Full-Stack'}
                      onChange={(e) =>
                        setCurrentProject({
                          ...currentProject,
                          category: e.target.value as Project['category'],
                        })
                      }
                      className="w-full h-10 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)] px-3 text-xs outline-none focus:border-[var(--color-primary)]"
                    >
                      <option value="Full-Stack">Full-Stack</option>
                      <option value="AI/Data">AI/Data</option>
                      <option value="Cloud">Cloud</option>
                      <option value="IoT">IoT</option>
                      <option value="BI">BI</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Short Description</label>
                  <Input
                    value={currentProject?.shortDescription || ''}
                    onChange={(e) =>
                      setCurrentProject({ ...currentProject, shortDescription: e.target.value })
                    }
                    placeholder="Concise 1-sentence summary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Business Problem Solved</label>
                  <Textarea
                    value={currentProject?.businessProblem || ''}
                    onChange={(e) =>
                      setCurrentProject({ ...currentProject, businessProblem: e.target.value })
                    }
                    rows={3}
                    placeholder="Describe client pain point, compliance challenge, or operational metric improved..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">
                      Tech Stack (comma separated)
                    </label>
                    <Input
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      placeholder="React.js, Node.js, Firebase, GCP"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Cover Image</label>
                    <div className="flex gap-2">
                      <Input
                        value={currentProject?.coverImageUrl || ''}
                        onChange={(e) =>
                          setCurrentProject({ ...currentProject, coverImageUrl: e.target.value })
                        }
                        placeholder="Image URL or upload below"
                        className="flex-1"
                      />
                      <label className="h-10 px-3 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-secondary)] flex items-center justify-center cursor-pointer text-xs">
                        <Upload className="h-4 w-4" />
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                      </label>
                    </div>
                    {uploadingImage && (
                      <p className="text-[10px] text-[var(--color-accent)] mt-1 animate-pulse">
                        Uploading screenshot to Cloud Storage...
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Live URL (optional)</label>
                    <Input
                      value={currentProject?.liveUrl || ''}
                      onChange={(e) =>
                        setCurrentProject({ ...currentProject, liveUrl: e.target.value })
                      }
                      placeholder="https://my-projects-2562a.web.app"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">GitHub URL (optional)</label>
                    <Input
                      value={currentProject?.githubUrl || ''}
                      onChange={(e) =>
                        setCurrentProject({ ...currentProject, githubUrl: e.target.value })
                      }
                      placeholder="https://github.com/JyotirmoyBiswas11"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentProject?.featured ?? true}
                      onChange={(e) =>
                        setCurrentProject({ ...currentProject, featured: e.target.checked })
                      }
                      className="rounded"
                    />
                    <span>Mark as Featured</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentProject?.status === 'published'}
                      onChange={(e) =>
                        setCurrentProject({
                          ...currentProject,
                          status: e.target.checked ? 'published' : 'draft',
                        })
                      }
                      className="rounded"
                    />
                    <span>Published Live</span>
                  </label>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-[var(--color-border)]">
                  <Button variant="ghost" onClick={() => setIsEditingProject(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProject}>Save Project</Button>
                </div>
              </div>
            )}

            {/* Projects Table */}
            {loadingProjects ? (
              <div className="p-12 text-center text-[var(--color-muted)] text-sm">
                Loading projects from Firestore pmtool...
              </div>
            ) : projects.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] space-y-3">
                <Database className="h-8 w-8 text-[var(--color-muted)] mx-auto opacity-50" />
                <p className="text-sm font-medium">No projects in Firestore yet.</p>
                <p className="text-xs text-[var(--color-muted)]">
                  Click the <strong>1-Click Seed pmtool DB</strong> button above to populate the verified initial projects!
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[var(--color-secondary)]/50 border-b border-[var(--color-border)] text-[var(--color-muted)] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">Project</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Featured</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-border)]">
                      {projects.map((p) => (
                        <tr key={p.id} className="hover:bg-[var(--color-secondary)]/30 transition-colors">
                          <td className="py-3.5 px-4">
                            <p className="font-bold text-[var(--color-text)]">{p.title}</p>
                            <p className="text-[11px] text-[var(--color-muted)] truncate max-w-sm">
                              {p.shortDescription}
                            </p>
                          </td>
                          <td className="py-3.5 px-4">
                            <Badge variant="primary" className="text-[10px]">
                              {p.category}
                            </Badge>
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                p.status === 'published'
                                  ? 'bg-emerald-500/10 text-emerald-500'
                                  : 'bg-amber-500/10 text-amber-500'
                              }`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {p.featured ? (
                              <span className="text-[10px] font-semibold text-[var(--color-accent)]">
                                Yes
                              </span>
                            ) : (
                              <span className="text-[10px] text-[var(--color-muted)]">No</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => {
                                  setCurrentProject(p)
                                  setTechStackInput(p.techStack?.join(', ') || '')
                                  setIsEditingProject(true)
                                }}
                                className="p-1.5 rounded-lg hover:bg-[var(--color-secondary)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
                                title="Edit"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProject(p.id)}
                                className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--color-muted)] hover:text-red-500"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: RECRUITER INQUIRIES ── */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold font-['Sora']">Recruiter Inquiries</h2>
              <p className="text-xs text-[var(--color-muted)]">
                Inquiries submitted via the portfolio contact form (stored in Firestore <code className="font-mono">contact_messages</code>).
              </p>
            </div>

            {loadingMessages ? (
              <div className="p-12 text-center text-[var(--color-muted)] text-sm">
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] space-y-2">
                <Mail className="h-8 w-8 text-[var(--color-muted)] mx-auto opacity-40" />
                <p className="text-sm font-medium">No recruiter inquiries yet.</p>
                <p className="text-xs text-[var(--color-muted)]">
                  Messages submitted by Munich recruiters will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      msg.read
                        ? 'border-[var(--color-border)] bg-[var(--color-card)] opacity-80'
                        : 'border-[var(--color-primary)]/50 bg-[var(--color-card)] shadow-md shadow-[var(--color-primary)]/5'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[var(--color-text)] font-['Sora']">
                            {msg.name}
                          </h4>
                          {msg.company && (
                            <Badge variant="accent" className="text-[10px]">
                              {msg.company}
                            </Badge>
                          )}
                          {!msg.read && (
                            <span className="px-2 py-0.5 rounded-full bg-[var(--color-primary)] text-white text-[9px] font-bold">
                              NEW
                            </span>
                          )}
                        </div>
                        <a
                          href={`mailto:${msg.email}`}
                          className="text-xs text-[var(--color-primary)] hover:underline"
                        >
                          {msg.email}
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-[var(--color-muted)] flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleString() : 'Recent'}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => msg.id && handleToggleMessageRead(msg.id, Boolean(msg.read))}
                          className="text-xs h-7"
                        >
                          {msg.read ? 'Mark Unread' : 'Mark Read'}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => msg.id && handleDeleteMessage(msg.id)}
                          className="text-xs h-7 px-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[var(--color-text)] whitespace-pre-wrap leading-relaxed bg-[var(--color-secondary)]/40 p-3 rounded-xl border border-[var(--color-border)]/50">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: CV & PROFILE ── */}
        {activeTab === 'profile' && (
          <div className="max-w-3xl space-y-8">
            <div>
              <h2 className="text-xl font-bold font-['Sora']">CV &amp; Storage Management</h2>
              <p className="text-xs text-[var(--color-muted)]">
                Upload your latest PDF CV to Firebase Cloud Storage. The download button on the site will automatically serve this file.
              </p>
            </div>

            {/* Upload CV Card */}
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Downloadable Resume (PDF)</h3>
                  <p className="text-xs text-[var(--color-muted)]">
                    Current path:{' '}
                    <span className="font-mono text-[var(--color-text)]">
                      {profile?.cvStoragePath || 'No CV uploaded yet'}
                    </span>
                  </p>
                </div>
              </div>

              {cvSuccessMessage && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>{cvSuccessMessage}</span>
                </div>
              )}

              <div className="border-2 border-dashed border-[var(--color-border)] rounded-xl p-6 text-center hover:border-[var(--color-primary)] transition-colors">
                <Upload className="h-8 w-8 text-[var(--color-muted)] mx-auto mb-2" />
                <p className="text-xs font-semibold mb-1">Click to select new CV PDF</p>
                <p className="text-[10px] text-[var(--color-muted)] mb-3">
                  Uploads directly to Cloud Storage bucket: <code className="font-mono">bigcommerce-widgets.appspot.com</code>
                </p>
                <label className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[var(--color-primary)] text-white text-xs font-semibold cursor-pointer hover:opacity-90 transition-opacity">
                  <span>{uploadingCV ? 'Uploading to Storage...' : 'Select PDF File'}</span>
                  <input type="file" accept=".pdf" onChange={handleCVUpload} disabled={uploadingCV} className="hidden" />
                </label>
              </div>
            </div>

            {/* Verified Profile Overview */}
            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] space-y-3">
              <h3 className="font-bold text-sm font-['Sora']">Profile Grounding Snapshot</h3>
              <div className="text-xs space-y-1.5 text-[var(--color-muted)]">
                <p><strong className="text-[var(--color-text)]">Name:</strong> {profile?.name || INITIAL_PROFILE.name}</p>
                <p><strong className="text-[var(--color-text)]">Degree:</strong> M.Sc. Business Intelligence &amp; Data Science (ISM Munich)</p>
                <p><strong className="text-[var(--color-text)]">Residence Permit:</strong> §16b German Student Permit (140 full / 280 half days)</p>
                <p><strong className="text-[var(--color-text)]">Location:</strong> Rumfordstr. 32, Apartment 411, 80469 Munich, Germany</p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 4: GEMINI SETTINGS ── */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-xl font-bold font-['Sora']">AI Recruiter Assistant (Gemini)</h2>
              <p className="text-xs text-[var(--color-muted)]">
                Configure your Gemini API key to power live conversational answers for recruiters.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[var(--color-primary)]/10 text-[var(--color-primary)]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm">Google Gemini API Key</h3>
                  <p className="text-xs text-[var(--color-muted)]">
                    Stored securely for your sessions to power the assistant chat drawer.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider">
                  API Key
                </label>
                <Input
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  placeholder="AIzaSy..."
                />
              </div>

              {keySaved && (
                <p className="text-xs text-emerald-500 flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4" />
                  Gemini API Key saved successfully!
                </p>
              )}

              <Button onClick={handleSaveGeminiKey} className="cursor-pointer text-xs">
                Save Gemini Key
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
