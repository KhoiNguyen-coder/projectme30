import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { MOCK_USER } from '../lib/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (!isSupabaseConfigured()) return MOCK_USER
    return null
  })
  const [loading, setLoading] = useState(() => isSupabaseConfigured())
  const [demoMode] = useState(() => !isSupabaseConfigured())
  const initialized = useRef(false)

  useEffect(() => {
    if (!isSupabaseConfigured() || initialized.current) return
    initialized.current = true

    let subscription

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    subscription = data.subscription

    return () => subscription?.unsubscribe()
  }, [])

  const signInWithMagicLink = async (email) => {
    if (!isSupabaseConfigured()) {
      setUser(MOCK_USER)
      return { error: null }
    }
    const { error } = await supabase.auth.signInWithOtp({ email })
    return { error }
  }

  const signOut = async () => {
    if (demoMode) {
      setUser(null)
      return
    }
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut()
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, demoMode, signInWithMagicLink, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
