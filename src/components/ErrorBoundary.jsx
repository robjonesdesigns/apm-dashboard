// ── ErrorBoundary ─────────────────────────────────────────────────────────────
// React class component that catches render errors in its subtree.
// Displays a centered fallback with a reload button.

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            gap: 'var(--spacing-16)',
            padding: 'var(--spacing-24)',
          }}
        >
          <p className="type-body" style={{ color: 'var(--color-text-secondary)', textAlign: 'center' }}>
            Something went wrong. Reload the page to continue.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: 'var(--spacing-8) var(--spacing-16)',
              background: 'var(--color-accent)',
              color: 'var(--color-text-inverse)',
              border: 'none',
              borderRadius: 'var(--radius-4)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 'var(--text-14)',
              transition: `background var(--motion-fast) var(--ease-productive)`,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-accent-hover)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-accent)' }}
          >
            Reload
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
