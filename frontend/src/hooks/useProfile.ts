import { useQuery } from '@tanstack/react-query'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Profile } from '@/lib/types'
import { INITIAL_PROFILE } from '@/data/initialData'

export function useProfile() {
  return useQuery<Profile>({
    queryKey: ['profile'],
    queryFn: async () => {
      try {
        const snap = await getDoc(doc(db, 'profile', 'main'))
        if (snap.exists()) {
          return { id: snap.id, ...snap.data() } as Profile
        }
      } catch (err) {
        console.warn('Firestore fetch profile fell back to initial profile data:', err)
      }
      return INITIAL_PROFILE as unknown as Profile
    },
    staleTime: 1000 * 60 * 5,
  })
}
