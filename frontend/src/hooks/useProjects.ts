import { useQuery } from '@tanstack/react-query'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Project } from '@/lib/types'
import { INITIAL_PROJECTS } from '@/data/initialData'

export function useProjects(category?: string) {
  return useQuery<Project[]>({
    queryKey: ['projects', category],
    queryFn: async () => {
      try {
        const ref = collection(db, 'projects')
        const snap = await getDocs(ref)
        if (!snap.empty) {
          let list = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Project))
          // Filter by status published
          list = list.filter((p) => p.status === 'published')
          if (category && category !== 'All') {
            list = list.filter((p) => p.category === category)
          }
          // Sort by createdAt desc or fallback
          list.sort((a, b) => {
            const timeA = a.createdAt?.toMillis?.() ?? 0
            const timeB = b.createdAt?.toMillis?.() ?? 0
            return timeB - timeA
          })
          if (list.length > 0) {
            return list
          }
        }
      } catch (err) {
        console.warn('Firestore fetch projects fell back to initial seed data:', err)
      }

      // Fallback to rich initial projects
      let fallback = INITIAL_PROJECTS as unknown as Project[]
      if (category && category !== 'All') {
        fallback = fallback.filter((p) => p.category === category)
      }
      return fallback
    },
    staleTime: 1000 * 60 * 5,
  })
}

export function useFeaturedProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects', 'featured'],
    queryFn: async () => {
      try {
        const ref = collection(db, 'projects')
        const snap = await getDocs(ref)
        if (!snap.empty) {
          const list = snap.docs
            .map((d) => ({ id: d.id, ...d.data() } as Project))
            .filter((p) => p.status === 'published' && p.featured)
          if (list.length > 0) {
            return list
          }
        }
      } catch (err) {
        console.warn('Firestore fetch featured projects fell back to initial seed data:', err)
      }

      return (INITIAL_PROJECTS as unknown as Project[]).filter((p) => p.featured)
    },
  })
}
