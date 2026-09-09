import { useEffect, useRef, useState } from 'react'

type Props = {
  to: number
  suffix?: string
  duration?: number
}

/**
 * Counts up to `to` when scrolled into view. Respects reduced motion.
 *
 * The initial state is the real figure, never zero. Starting at zero meant the
 * headline metric sat in the served DOM as "0%" for anything that reads before
 * the observer fires — crawlers, screen readers, share-card scrapers and
 * full-page screenshots all saw a number the site does not claim. The count-up
 * now runs only once the element is actually seen, and only when it can
 * animate; nothing else ever observes the value mid-flight.
 */
export function Counter({ to, suffix = '', duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(to)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || done.current) return
          done.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
            setValue(Math.round(eased * to))
            if (p < 1) requestAnimationFrame(tick)
            else setValue(to)
          }
          setValue(0)
          requestAnimationFrame(tick)
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to, duration])

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  )
}
