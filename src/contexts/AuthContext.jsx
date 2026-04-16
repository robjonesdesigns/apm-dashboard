import { createContext, useContext, useEffect, useState } from 'react'
import { getSupabase } from '../lib/supabase'

// AuthProvider holds session state that's readable anywhere in the tree
// via useAuth(). Session is seeded server-side via `initialSession` so
// the first render already knows if the user is signed in (no auth flash).
// The browser Supabase client takes over post-hydration for sign-in,
// sign-out, and background session refresh.

const AuthContext = createContext({
  user: null,
  session: null,
  isSignedIn: false,
  isLoaded: false,
  orgId: null,
  role: null,
  supabase: null,
})

export function AuthProvider({ children, initialSession }) {
  const [supabase] = useState(() =>
    typeof window === 'undefined' ? null : getSupabase()
  )
  const [session, setSession] = useState(initialSession ?? null)
  const [profile, setProfile] = useState(null)
  const [isLoaded, setIsLoaded] = useState(!!initialSession)

  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setIsLoaded(true)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setIsLoaded(true)
    })
    return () => subscription.unsubscribe()
  }, [supabase])

  useEffect(() => {
    if (!supabase || !session?.user) {
      setProfile(null)
      return
    }
    let cancelled = false
    supabase
      .from('profiles')
      .select('org_id, role')
      .eq('user_id', session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setProfile(data)
      })
    return () => { cancelled = true }
  }, [session, supabase])

  const user = session?.user ? { id: session.user.id, email: session.user.email } : null

  const value = {
    user,
    session,
    isSignedIn: !!session?.user,
    isLoaded,
    orgId: profile?.org_id ?? null,
    role: profile?.role ?? null,
    supabase,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
