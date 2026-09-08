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
  const { stagger = false, threshold = 0.18, once = true } = options
  const ref = useRef<T>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      el.classList.add('is-revealed')
      return
    }

    if (stagger) {
      const items = el.querySelectorAll<HTMLElement>('[data-reveal-item]')
      items.forEach((item, i) => item.style.setProperty('--reveal-i', String(i)))
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            if (once) io.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('is-revealed')
          }
        })
      },
      { threshold, rootMargin: '0px 0px -8% 0px' },
    )

    io.observe(el)
    return () => io.disconnect()
  }, [stagger, threshold, once])

  return ref
}
