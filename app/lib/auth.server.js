import { redirect } from 'react-router'
import { createSupabaseServerClient } from './supabase.server'

// Guard for authenticated loaders. Returns the signed-in user's auth
// context (userId, email, orgId, role) or redirects to /signin.
// Also returns the Supabase response headers so callers can pass them
// through to their data() response and carry forward any refreshed
// session cookie.
export async function requireAuth(request) {
  const { supabase, headers } = createSupabaseServerClient(request)

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    const url = new URL(request.url)
    const from = url.pathname + url.search
    throw redirect(`/signin?redirect=${encodeURIComponent(from)}`, { headers })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('org_id, role')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!profile?.org_id) {
    throw new Response('Account has no org assigned. Contact admin.', { status: 403, headers })
  }

  return {
    userId: user.id,
    email: user.email,
    orgId: profile.org_id,
    role: profile.role,
    headers,
  }
}

// Lightweight variant for loaders that only need to know "is there a
// session?" without triggering a redirect. Used by root loader.
// Validates via getUser() first to avoid the "insecure session" warning
// Supabase prints when reading session data from cookies without
// contacting the Auth server.
export async function getSession(request) {
  const { supabase, headers } = createSupabaseServerClient(request)
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { session: null, headers }
  const { data: { session } } = await supabase.auth.getSession()
  return { session, headers }
}
