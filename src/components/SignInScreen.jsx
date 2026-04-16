import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

export default function SignInScreen() {
  const { supabase, isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('signin')

  useEffect(() => {
    if (isLoaded && isSignedIn) navigate('/', { replace: true })
  }, [isLoaded, isSignedIn, navigate])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setInfo('Check your email for a confirmation link.')
      }
    } catch (err) {
      setError(err.message || 'Authentication failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-24)',
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: 400 }}>
        <h1 className="type-heading" style={{ marginBottom: 'var(--spacing-8)' }}>
          Asset Performance Management
        </h1>
        <p className="type-meta" style={{ marginBottom: 'var(--spacing-24)' }}>
          {mode === 'signin' ? 'Sign in to continue.' : 'Create an account.'}
        </p>

        <form onSubmit={handleSubmit}>
          <label className="type-label" htmlFor="email" style={{ display: 'block', marginBottom: 'var(--spacing-4)' }}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <label
            className="type-label"
            htmlFor="password"
            style={{ display: 'block', marginTop: 'var(--spacing-16)', marginBottom: 'var(--spacing-4)' }}
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          {error && (
            <p
              className="type-meta"
              style={{ color: 'var(--color-critical)', marginTop: 'var(--spacing-16)' }}
              role="alert"
            >
              {error}
            </p>
          )}
          {info && (
            <p
              className="type-meta"
              style={{ color: 'var(--color-accent)', marginTop: 'var(--spacing-16)' }}
              role="status"
            >
              {info}
            </p>
          )}

          <button type="submit" disabled={busy} style={primaryButtonStyle(busy)}>
            {busy ? 'Working…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setMode(mode === 'signin' ? 'signup' : 'signin')
            setError(null)
            setInfo(null)
          }}
          style={linkButtonStyle}
        >
          {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: 'var(--color-bg)',
  color: 'var(--color-text-primary)',
  border: '1px solid var(--color-border-subtle, #3e3e3e)',
  borderRadius: 6,
  fontSize: 14,
  fontFamily: 'inherit',
  outline: 'none',
}

function primaryButtonStyle(busy) {
  return {
    width: '100%',
    marginTop: 'var(--spacing-24)',
    padding: '10px 16px',
    background: busy ? 'var(--color-accent-bg)' : 'var(--color-accent)',
    color: 'var(--color-text-inverse)',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 600,
    cursor: busy ? 'default' : 'pointer',
    fontFamily: 'inherit',
  }
}

const linkButtonStyle = {
  width: '100%',
  marginTop: 'var(--spacing-16)',
  padding: 0,
  background: 'transparent',
  color: 'var(--color-accent)',
  border: 'none',
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'inherit',
}
