import { useEffect } from 'react'
import { useRevalidator } from 'react-router'

// Re-runs the active route's loader on an interval. Skips the tick
// when the tab is backgrounded (document.hidden). Immediately
// revalidates when the tab becomes visible again so users returning
// after a coffee break see current data.
export default function useAutoRevalidate(intervalMs = 120_000) {
  const { revalidate } = useRevalidator()

  useEffect(() => {
    if (!intervalMs || intervalMs <= 0) return

    const tick = () => {
      if (!document.hidden) revalidate()
    }
    const onVisibility = () => {
      if (!document.hidden) revalidate()
    }

    const id = setInterval(tick, intervalMs)
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [revalidate, intervalMs])
}
