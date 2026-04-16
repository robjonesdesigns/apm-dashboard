import { createServerClient } from '@supabase/ssr'

// Server-side Supabase client bound to the current request's cookies.
// Returns both the client and a Headers object. Any Set-Cookie from a
// session refresh ends up on `headers` -- callers MUST include it on
// their Response/redirect, otherwise the refreshed session is lost and
// the user appears logged out on the next request.
//
// Usage:
//   const { supabase, headers } = createSupabaseServerClient(request)
//   const { data: { user } } = await supabase.auth.getUser()
//   return data({ user }, { headers })
export function createSupabaseServerClient(request) {
  const url = process.env.VITE_SUPABASE_URL
  const key = process.env.VITE_SUPABASE_ANON_KEY
  if (!url || !key) throw new Error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY')

  const headers = new Headers()

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        const cookieHeader = request.headers.get('cookie') || ''
        return parseCookieHeader(cookieHeader)
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          headers.append('Set-Cookie', serializeCookie(name, value, options))
        }
      },
    },
  })

  return { supabase, headers }
}

function parseCookieHeader(header) {
  if (!header) return []
  return header.split(';').map((pair) => {
    const [name, ...rest] = pair.trim().split('=')
    return { name: name.trim(), value: decodeURIComponent(rest.join('=').trim()) }
  }).filter((c) => c.name)
}

function serializeCookie(name, value, options = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`]
  if (options.maxAge != null) parts.push(`Max-Age=${options.maxAge}`)
  if (options.domain) parts.push(`Domain=${options.domain}`)
  if (options.path) parts.push(`Path=${options.path}`)
  else parts.push('Path=/')
  if (options.expires) parts.push(`Expires=${options.expires.toUTCString()}`)
  if (options.httpOnly) parts.push('HttpOnly')
  if (options.secure) parts.push('Secure')
  if (options.sameSite) parts.push(`SameSite=${options.sameSite}`)
  return parts.join('; ')
}
