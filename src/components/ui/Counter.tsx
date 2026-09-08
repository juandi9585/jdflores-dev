import { useEffect, useRef, useState } from 'react'

type Props = {
  to: number
  suffix?: string
  duration?: number
}

/** Counts up to `to` when scrolled into view. Respects reduced motion. */
export function Counter({ to, suffix = '', duration = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const done = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(to)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || done.current) return
          done.current = true
          const start = performance.now()
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1)
            // easeOutCubic
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(Math.round(eased * to))
            if (p < 1) requestAnimationFrame(tick)
          }
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
