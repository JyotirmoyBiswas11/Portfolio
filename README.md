# Jyotirmoy Biswas — Engineering & Business Intelligence Portfolio

A production-grade, SaaS-like personal developer portfolio designed with a Linear/Vercel aesthetic. Built for Munich tech recruiters and hiring managers, showcasing enterprise full-stack development, cloud pipelines, and Business Intelligence expertise.

---

## 🚀 Live Architecture & Tech Stack

- **Frontend Core**: React 19, TypeScript (strict, zero `any`), Vite 6, Tailwind CSS v4
- **State & Data**: Zustand (persistent dark/light theme), TanStack Query v5
- **Animations & UI**: Framer Motion, Class Variance Authority (`cva`), Lucide Icons, Custom SVG Brand Vectors
- **Firebase Services (Production Project `bigcommerce-widgets`)**:
  - **Firestore Database**: Dedicated database `pmtool`
  - **Firebase App Check**: ALWAYS enforced with standard reCAPTCHA v3 (`6LeSzZAqAAAAAOaGsXNfNwXvaOv15ZCcwc7jdeET`)
  - **Firebase Authentication**: Email & Password for private Admin CMS
  - **Firebase Cloud Storage**: For project cover screenshots & downloadable PDF CV
  - **Security Rules**: Production-grade `firestore.rules` enforcing public read, contact write validation, and authenticated admin writes
- **AI Recruiter Assistant**:
  - Powered by Google Gemini API
  - Grounded strictly on Jyotirmoy's verified profile and project data
  - Interactive chat drawer with quick suggestion chips and live API key management

---

## 🎨 Design System

### Color Tokens

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--color-text` | `#0F172A` | `#E6EDF3` | Primary typography & high-contrast labels |
| `--color-background` | `#F8FAFC` | `#0B0F1A` | Canvas background |
| `--color-primary` | `#4F46E5` | `#4F46E5` | Brand Indigo CTAs & active borders |
| `--color-secondary` | `#E2E8F0` | `#1E293B` | Card surfaces, chips & borders |
| `--color-accent` | `#06B6D4` | `#22D3EE` | Cyan highlights, badges & gradients |
| `--color-card` | `#FFFFFF` | `#0F172A` | Elevated containers |
| `--color-border` | `#CBD5E1` | `#1E293B` | Subtle separators |

### Typography

- **Sora (`font-['Sora']`)**: Headings, hero headlines, section titles, and branding.
- **Inter (`font-['Inter']`)**: Body text, project descriptions, skills chips, forms, and tables.

---

## 📂 Project Structure

```
Portfolio/
├── .firebaserc                     # Firebase default project: bigcommerce-widgets
├── firebase.json                   # Hosting & Firestore deploy configuration
├── firestore.rules                 # Strict security rules for pmtool database
├── firestore.indexes.json          # Composite indexes for querying & ordering
├── package.json                    # Monorepo root command orchestrator
└── frontend/
    ├── package.json
    ├── vite.config.ts              # Code splitting & path alias @ -> src
    ├── tsconfig.json
    ├── index.html                  # Sora & Inter Google Fonts, modern metadata
    └── src/
        ├── index.css               # Tailwind CSS v4 design tokens & base theme
        ├── main.tsx                # App entrypoint with QueryClientProvider
        ├── App.tsx                 # Client routing (Home, Login, Admin)
        ├── data/
        │   └── initialData.ts      # Ground truth profile, projects & CV facts
        ├── lib/
        │   ├── firebase.ts         # App Check, pmtool Firestore, Auth, Storage
        │   ├── types.ts            # Strict TypeScript data models
        │   └── utils.ts            # cn() class utility
        ├── stores/
        │   └── theme.store.ts      # Persistent dark/light toggle
        ├── hooks/
        │   ├── useProjects.ts      # Live Firestore fetch + seed fallback
        │   └── useProfile.ts       # Live profile query + seed fallback
        ├── components/
        │   ├── ui/                 # Button, Badge, Card, Input, Textarea, Spinner, SocialIcons
        │   ├── layout/             # Navbar (sticky blur, theme toggle) & Footer
        │   ├── sections/           # HeroSection, ProjectsSection, ExperienceSection, ContactSection
        │   ├── ai/                 # AIAssistant drawer (Gemini conversational agent)
        │   └── auth/               # ProtectedRoute wrapper
        └── pages/
            ├── HomePage.tsx        # Main single-page portfolio
            ├── AdminLoginPage.tsx  # Protected admin email/password login
            └── AdminPage.tsx       # SaaS CMS (Projects, Inquiries, Storage, 1-Click Seeder)
```

---

## 🛠️ Getting Started Locally

### 1. Start the Dev Server
From the root directory:
```bash
npm run dev
# or
pnpm --dir frontend dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Build for Production
```bash
pnpm --dir frontend build
```
This runs `tsc -b` for strict type checking followed by Vite production bundling into `frontend/dist`.

---

## 🔐 Admin CMS & First-Time Setup (`/admin`)

1. Navigate to `/admin` or click the lock icon in the footer.
2. Sign in with your Firebase Auth email & password for the `bigcommerce-widgets` project.
3. Once logged in:
   - **1-Click Seed `pmtool` DB**: Click the button in the top right to instantly write all 6 verified projects and your profile into your Firestore `pmtool` database.
   - **Projects Management**: Add, edit, or delete projects, toggle live status or featured flags.
   - **Recruiter Inquiries**: Review incoming contact messages, mark as read/unread, or delete.
   - **CV Upload**: Upload an updated PDF resume directly to Cloud Storage. The hero CTA will immediately link to the new file.
   - **Gemini Key**: Add your Google Gemini API key to activate arbitrary conversational queries in the AI drawer.

---

## 🚢 Deploying to Firebase

Deploy Hosting:
```bash
firebase deploy --only hosting
```

Deploy Firestore Security Rules & Indexes:
```bash
firebase deploy --only firestore
```
