import { useState, useRef, useEffect } from 'react'

export default function MobileCardCarousel({ children }) {
  const scrollRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const count = Array.isArray(children) ? children.length : 1

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    function handleScroll() {
      const idx = Math.round(el.scrollLeft / el.offsetWidth)
      setActiveIdx(idx)
    }
    el.addEventListener('scroll', handleScroll, { passive: true })
    return () => el.removeEventListener('scroll', handleScroll)
  }, [])

  function goTo(idx) {
    scrollRef.current?.scrollTo({ left: idx * scrollRef.current.offsetWidth, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Scrollable cards */}
      <div
        ref={scrollRef}
        className="hide-scrollbar"
        style={{
          display: 'flex',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          gap: 'var(--spacing-16)',
        }}
      >
        {(Array.isArray(children) ? children : [children]).map((child, i) => (
          <div
            key={i}
            className="carousel-slide"
            style={{
              flex: '0 0 100%',
              scrollSnapAlign: 'start',
              minWidth: 0,
            }}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Dot indicators */}
      {count > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 'var(--spacing-8)',
          paddingTop: 'var(--spacing-12)',
        }}>
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to card ${i + 1}`}
              style={{
                width: activeIdx === i ? 20 : 8,
                height: 8,
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: activeIdx === i ? 'var(--color-accent)' : 'var(--color-border-strong)',
                cursor: 'pointer',
                padding: 0,
                transition: 'all var(--motion-fast) var(--ease-productive)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  )
}
