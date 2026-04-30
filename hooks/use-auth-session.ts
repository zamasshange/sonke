'use client'

import { useEffect, useState } from 'react'
import { getSupabaseSession, type SupabaseSession } from '@/lib/supabase-auth'

type User = {
  email?: string
  full_name?: string
  user_metadata?: {
    full_name?: string
  }
}

export function useAuthSession() {
  const [session, setSession] = useState<SupabaseSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load session on mount
    const loadSession = () => {
      const stored = getSupabaseSession()
      setSession(stored)
      setIsLoading(false)
    }

    loadSession()

    // Listen for storage changes (sign out in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sonke.supabase.session') {
        if (e.newValue) {
          try {
            setSession(JSON.parse(e.newValue))
          } catch {
            setSession(null)
          }
        } else {
          setSession(null)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const user = session?.user as User | undefined
  const isAuthenticated = !!session?.access_token
  const fullName = user?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0]

  return {
    session,
    isAuthenticated,
    isLoading,
    user,
    email: user?.email,
    fullName,
  }
}
