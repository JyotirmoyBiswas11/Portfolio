import { type ReactNode, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Spinner } from '@/components/ui'

interface ProtectedRouteProps { children: ReactNode }

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u))
    return unsub
  }, [])

  if (user === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <Spinner size="lg" />
      </div>
    )
  }
  if (!user) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
