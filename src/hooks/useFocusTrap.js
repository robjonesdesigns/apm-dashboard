import { useEffect } from 'react'

const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export default function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active || !ref.current) return

    function handleKeyDown(e) {
      if (e.key !== 'Tab') return
      const els = ref.current.querySelectorAll(FOCUSABLE)
      if (els.length === 0) return

      const first = els[0]
      const last = els[els.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    ref.current.addEventListener('keydown', handleKeyDown)
    const el = ref.current
    return () => el.removeEventListener('keydown', handleKeyDown)
  }, [ref, active])
}
