import type { Project, Profile } from '@/lib/types'
import { Timestamp } from 'firebase/firestore'

export const INITIAL_PROFILE: Omit<Profile, 'updatedAt'> & { updatedAt?: Timestamp } = {
  id: 'main',
  name: 'Jyotirmoy Biswas',
  headline: 'Full-Stack Developer & BI Engineer',
  subheadline:
    'M.Sc. Business Intelligence & Data Science student at ISM Munich. Experienced in building enterprise SaaS architectures, cloud data pipelines, and AI systems.',
  bio: `Results-driven Software Engineer with hands-on experience building and scaling enterprise-level SaaS applications using React.js, TypeScript, Node.js, and Firebase. Strong background in both frontend interfaces and backend cloud integrations. Currently pursuing a Master's degree in Business Intelligence & Data Science at ISM Munich, uniquely positioning me to bridge technical execution, data-driven insights, and business management. Seeking a Werkstudent Software Engineering position in Munich.`,
  location: 'Munich, Germany',
  availabilityStatus: 'Open to Working Student Roles in Munich (§16b Residence Permit: 140 full / 280 half days/yr)',
  email: 'jyotirmoybiswas0407@gmail.com',
  linkedinUrl: 'https://linkedin.com/in/jyotirmoy-biswas-a92124256',
  githubUrl: 'https://github.com/JyotirmoyBiswas11',
  cvStoragePath: '',
  skills: [
    {
      category: 'Core Engineering',
      items: ['TypeScript', 'JavaScript', 'React.js', 'Next.js', 'Node.js', 'Python', 'HTML5', 'Tailwind CSS'],
    },
    {
      category: 'Backend, Cloud & DB',
      items: ['Firebase (Firestore, Auth, Storage)', 'Google Cloud Platform (GCP)', 'RESTful APIs', 'SQL', 'Cloud Functions', 'Cloud Tasks', 'Express.js', 'Docker'],
    },
    {
      category: 'Data & BI',
      items: ['Business Intelligence', 'Data Science', 'Data Pipelines', 'ETL', 'Machine Learning', 'CNNs', 'Recharts'],
    },
    {
      category: 'DevOps & Tools',
      items: ['Git / GitHub', 'Docker', 'GitLab', 'Postman', 'Figma', 'Linux'],
    },
    {
      category: 'Languages',
      items: ['English (C1)', 'German (Beginner / Learning)', 'Bengali (Native)', 'Hindi (Fluent)'],
    },
  ],
  experience: [
    {
      company: 'Pravaah Consulting',
      role: 'Full Stack Web Developer',
      period: 'Sep 2024 – Aug 2026',
      location: 'Kolkata, India',
      description: [
        'Core contributor to the full-stack architecture of Octopus SaaS, an enterprise medical waste and logistics compliance platform.',
        'Architected Fleet Management, Routing Optimization, and automated HIPAA-compliant billing modules serving 10,000+ daily active users.',
        'Engineered a multi-level organizational hierarchy (Region, Territory, Satellite, Generator) enabling enterprise clients to model complex operational structures.',
        'Engineered cloud data migration pipelines via Node.js, Firebase Cloud Functions, and Tasks, migrating 50,000+ legacy records with 100% data integrity.',
        'Built EasyRx, a fully integrated B2B healthcare e-commerce storefront embedded within Octopus SaaS to unlock new revenue streams.',
        'Built an automated meeting telemetry bot utilizing Node.js, Google Meet API, and GCP Pub/Sub for live transcript summaries.',
        'Developed Mediguide AI, a clinical consultation intelligence app transcribing doctor-patient audio into structured notes.',
      ],
      techStack: ['React.js', 'Node.js', 'TypeScript', 'Firebase', 'GCP', 'HTML5', 'HIPAA'],
    },
    {
      company: 'Pravaah Consulting',
      role: 'Full Stack Developer Intern',
      period: 'Feb 2024 – Aug 2024',
      location: 'Kolkata, India',
      description: [
        'Integrated Stannp API with Wix Velo for Postcard Patriots to automate print and physical dispatch upon customer checkout.',
        'Engineered an interactive event seat selector via iFrame with Wix Pay integration for real-time ticket booking.',
        'Built dynamic content feeds, donation workflows, and event management modules for the Sunray Center platform.',
        'Created an automated phonebook management tool with background cron jobs to dispatch automated notifications.',
      ],
      techStack: ['JavaScript', 'React.js', 'REST APIs', 'Wix Velo', 'Cron Jobs'],
    },
  ],
  education: [
    {
      institution: 'International School of Management (ISM), Munich',
      degree: 'Master of Science (M.Sc.)',
      field: 'Business Intelligence and Data Science',
      period: 'Sep 2026 – Expected Aug 2028',
      location: 'Munich, Germany',
      highlights: ['Data-driven decision making', 'Advanced Analytics', 'Big Data Architectures', 'Munich Tech Ecosystem'],
    },
    {
      institution: 'University of Calcutta',
      degree: 'Master of Science (M.Sc.)',
      field: 'Computer Science',
      period: 'Jun 2021 – Jun 2023',
      location: 'Kolkata, India',
      highlights: ['Thesis: Image Recognition using Convolutional Neural Networks (CNNs)', 'Deep Learning', 'Algorithms & Data Structures'],
    },
    {
      institution: 'University of Calcutta',
      degree: 'Bachelor of Science (B.Sc.)',
      field: 'Computer Science',
      period: 'Jun 2018 – May 2021',
      location: 'Kolkata, India',
      highlights: ['Final Project: Fitness Tracking Web Application', 'Database Systems', 'Object-Oriented Programming'],
    },
  ],
}

export const INITIAL_PROJECTS: Array<Omit<Project, 'createdAt' | 'updatedAt'>> = [
  {
    id: 'agentic-ai-data-extractor',
    title: 'Agentic AI Data Value Extractor (DataLens AI)',
    slug: 'agentic-ai-data-extractor-datalens',
    category: 'AI/Data',
    status: 'published',
    featured: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'Enterprise SaaS portal uploading unstructured CSV records & extracting decision intelligence via a 4-stage Gemini AI Agent pipeline.',
    businessProblem:
      'Raw business CSV exports from sales and analytics platforms are messy and time-consuming to synthesize. Engineered a 4-stage Gemini 1.5 Flash agent (Schema Classification, Anomaly/Cleanliness 0-100 Auditing, Quantitative KPI Extraction, and Dynamic Visualization Specs) deployed on GCP Cloud Run with App Check verification.',
    techStack: [
      'React 19',
      'TypeScript',
      'Express.js',
      'GCP Cloud Run',
      'Gemini 1.5 Flash',
      'Firebase App Check',
      'Recharts',
      'Firestore (pmtool)',
    ],
    liveUrl: 'https://my-projects-2562a.web.app/',
    githubUrl: 'https://github.com/JyotirmoyBiswas11/agentic-ai-data-extractor',
  },
  {
    id: 'octopus-saas',
    title: 'Octopus SaaS — Enterprise Logistics & Compliance Platform',
    slug: 'octopus-saas-enterprise-logistics',
    category: 'Full-Stack',
    status: 'published',
    featured: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'HIPAA-compliant medical waste logistics platform with fleet routing, multi-tier organizational hierarchy, and billing for 10,000+ daily users.',
    businessProblem:
      'Enterprise waste management clients struggled with fragmented compliance audits and manual billing. Architected automated dispatch routing, hierarchical location modeling (Region > Territory > Generator), and HIPAA compliance workflows.',
    techStack: ['React.js', 'Node.js', 'TypeScript', 'Firebase', 'GCP', 'REST APIs'],
    liveUrl: null,
    githubUrl: 'https://github.com/JyotirmoyBiswas11',
  },
  {
    id: 'cloud-data-migration-pipeline',
    title: 'Enterprise Data Migration & Cloud Task Pipeline',
    slug: 'enterprise-data-migration-pipeline',
    category: 'Cloud',
    status: 'published',
    featured: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'Resilient serverless data migration pipeline processing 50,000+ legacy customer records with 100% integrity using Firebase Cloud Tasks.',
    businessProblem:
      'Onboarding enterprise clients took days of error-prone manual spreadsheets. Engineered an asynchronous cloud pipeline with retry queues and batch validation, reducing onboarding time from days to minutes with zero data loss.',
    techStack: ['Node.js', 'Firebase Cloud Functions', 'Google Cloud Tasks', 'Firestore', 'GCP'],
    liveUrl: null,
    githubUrl: 'https://github.com/JyotirmoyBiswas11',
  },
  {
    id: 'google-meet-ai-bot',
    title: 'Google Meet AI Telemetry & Real-Time Event Bot',
    slug: 'google-meet-ai-telemetry-bot',
    category: 'IoT',
    status: 'published',
    featured: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'Automated meeting participant bot connecting Google Meet API with GCP Pub/Sub to track live telemetric events and deliver structured summaries.',
    businessProblem:
      'Distributed field operations required automated action item capture and incident logging from dispatch coordination calls. Designed an event-driven bot that ingests live streams and posts structured JSON summaries to internal webhooks.',
    techStack: ['Python', 'Google Meet API', 'GCP Pub/Sub', 'Webhooks', 'REST APIs'],
    liveUrl: null,
    githubUrl: 'https://github.com/JyotirmoyBiswas11/google-meet-bot',
  },
  {
    id: 'easyrx-ecommerce',
    title: 'EasyRx — Embedded B2B Medical E-Commerce Storefront',
    slug: 'easyrx-b2b-ecommerce-storefront',
    category: 'Full-Stack',
    status: 'published',
    featured: true,
    coverImageUrl: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'Custom B2B medical supply procurement portal integrated directly into the Octopus logistics ecosystem with automated order routing.',
    businessProblem:
      'Medical facilities required frictionless restocking for compliant packaging without leaving their operational portal. Built an embedded storefront with role-based requisition limits and automated fulfillment dispatch.',
    techStack: ['React.js', 'TypeScript', 'Tailwind CSS', 'Firestore', 'Stripe'],
    liveUrl: null,
    githubUrl: 'https://github.com/JyotirmoyBiswas11',
  },
  {
    id: 'task-up-workspace',
    title: 'Task-Up — Collaborative Task & Workspace Manager',
    slug: 'task-up-collaborative-workspace',
    category: 'Full-Stack',
    status: 'published',
    featured: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'Productivity and agile workflow dashboard featuring state persistence, task lifecycle management, and clean user interfaces.',
    businessProblem:
      'Agile engineering teams require lightweight, zero-bloat tracking for sprint velocity, issue assignments, and real-time board updates.',
    techStack: ['JavaScript', 'React', 'Node.js', 'Express.js', 'REST APIs'],
    liveUrl: null,
    githubUrl: 'https://github.com/JyotirmoyBiswas11/Task-Up',
  },
  {
    id: 'mediguide-ai-extractor',
    title: 'Mediguide AI — Clinical Intelligence & Consultation Extractor',
    slug: 'mediguide-ai-consultation-extractor',
    category: 'AI/Data',
    status: 'published',
    featured: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'Healthcare AI application that captures consultation audio, transcribes doctor-patient dialogues, and generates structured clinical summaries.',
    businessProblem:
      'Physicians spend excessive hours writing medical records, driving clinical burnout. Engineered a speech transcription and LLM extraction flow to automate structured EHR notes and diagnosis summaries.',
    techStack: ['React.js', 'Node.js', 'Firebase', 'Gemini AI API', 'Web Audio API'],
    liveUrl: null,
    githubUrl: 'https://github.com/JyotirmoyBiswas11',
  },
  {
    id: 'cnn-image-recognition',
    title: 'Deep Learning Image Recognition via CNNs',
    slug: 'deep-learning-image-recognition-cnn',
    category: 'AI/Data',
    status: 'published',
    featured: false,
    coverImageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    shortDescription:
      'Master’s thesis research implementing Convolutional Neural Networks for high-accuracy feature extraction and computer vision classification.',
    businessProblem:
      'Explored deep learning architectures to improve classification accuracy on noisy datasets using custom CNN layers, dropout regularizations, and transfer learning benchmarks.',
    techStack: ['Python', 'TensorFlow', 'Convolutional Neural Networks', 'NumPy', 'Computer Vision'],
    liveUrl: null,
    githubUrl: 'https://github.com/JyotirmoyBiswas11',
  },
]
