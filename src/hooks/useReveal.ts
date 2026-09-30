import { useEffect, useRef } from 'react'

type Options = {
  /** stagger children marked with [data-reveal-item] */
  stagger?: boolean
  threshold?: number
  once?: boolean
}

/**
 * Lightweight scroll-reveal via IntersectionObserver.
 * Adds `is-revealed` to the element (and staggers children) when in view.
 * Respects prefers-reduced-motion by revealing immediately.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options: Options = {}) {
  const { stagger = false, threshold = 0.02, once = true } = options
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      el.classList.add('is-revealed')
      return
    }

    const items = el.querySelectorAll<HTMLElement>('[data-reveal-item]')
    if (stagger) items.forEach((item, i) => item.style.setProperty('--reveal-i', String(i)))
    // when the last item has arrived, drop the reveal's clip and filter (motion.css)
    const settleMs = 1000 + (stagger ? items.length * 80 : 0)
    let settle = 0

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            window.clearTimeout(settle)
            settle = window.setTimeout(() => entry.target.classList.add('is-settled'), settleMs)
            if (once) io.unobserve(entry.target)
          } else if (!once) {
            window.clearTimeout(settle)
            entry.target.classList.remove('is-revealed', 'is-settled')
          }
        })
      },
      // A momentum flick on a phone outruns a late reveal: content used to stay
      // invisible until roughly half a screen past its own top, so you landed in
      // blank regions and waited. Fire early instead.
      { threshold, rootMargin: '0px 0px 12% 0px' },
    )

    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(settle)
    }
  }, [stagger, threshold, once])

  return ref
}
