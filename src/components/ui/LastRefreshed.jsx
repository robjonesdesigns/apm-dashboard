import { useEffect, useState } from 'react'

// Muted relative timestamp. Re-renders every 30s to keep the label accurate.
// Pass an ISO string from loader data; we format it relative to now.
export default function LastRefreshed({ timestamp, prefix = 'Updated' }) {
  const [, tick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 30_000)
    return () => clearInterval(id)
  }, [])

  if (!timestamp) return null

  const absolute = new Date(timestamp)
  return (
    <span
      className="type-meta"
      style={{ color: 'var(--color-text-helper)' }}
      title={absolute.toLocaleString()}
    >
      {prefix} {formatRelative(timestamp)}
    </span>
  )
}

function formatRelative(iso) {
  const ms = Date.now() - new Date(iso).getTime()
  if (ms < 10_000) return 'just now'
  if (ms < 60_000) return `${Math.round(ms / 1000)}s ago`
  if (ms < 3_600_000) return `${Math.round(ms / 60_000)}m ago`
  if (ms < 86_400_000) return `${Math.round(ms / 3_600_000)}h ago`
  return `${Math.round(ms / 86_400_000)}d ago`
}
