'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

const Context = createContext()

export default function SupabaseProvider({ children }) {
  const [supabase] = useState(() => createClientComponentClient())
  const router = useRouter()
  const [session, setSession] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession()
        setSession(initialSession)

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          setSession(newSession)
          
          if (event === 'SIGNED_IN') {
            router.push('/create-board')
            router.refresh()
          }
          if (event === 'SIGNED_OUT') {
            router.push('/login')
            router.refresh()
          }
        })

        return () => subscription.unsubscribe()
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [supabase, router])

  return (
    <Context.Provider value={{ supabase, session, isLoading }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = useContext(Context)
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
} 