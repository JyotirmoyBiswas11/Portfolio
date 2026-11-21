export interface Project {
  id: string
  title: string
  slug: string
  category: 'AI/Data' | 'Full-Stack' | 'IoT' | 'Cloud' | 'BI'
  status: 'published' | 'draft'
  featured: boolean
  coverImageUrl: string
  shortDescription: string
  businessProblem: string
  techStack: string[]
  liveUrl: string | null
  githubUrl: string | null
  createdAt: import('firebase/firestore').Timestamp
  updatedAt: import('firebase/firestore').Timestamp
}

export interface Profile {
  id: string
  name: string
  headline: string
  subheadline: string
  bio: string
  location: string
  availabilityStatus: string
  email: string
  linkedinUrl: string
  githubUrl: string
  cvStoragePath: string
  skills: SkillCategory[]
  experience: Experience[]
  education: Education[]
  updatedAt: import('firebase/firestore').Timestamp
}

export interface SkillCategory {
  category: string
  items: string[]
}

export interface Experience {
  company: string
  role: string
  period: string
  location: string
  description: string[]
  techStack: string[]
}

export interface Education {
  institution: string
  degree: string
  field: string
  period: string
  location: string
  highlights: string[]
}

export interface ContactMessage {
  id?: string
  name: string
  email: string
  company: string
  message: string
  createdAt: import('firebase/firestore').Timestamp
  read: boolean
}
