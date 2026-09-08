import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

type Props = {
  children: ReactNode
  className?: string
  /** mount immediately (above-the-fold) instead of waiting for scroll */
  eager?: boolean
  rootMargin?: string
  /** shown instead of the animation when the user prefers reduced motion */
  reducedFallback?: ReactNode
}

/**
 * Mounts a heavy generative component only when it scrolls near the viewport,
 * and never when the user prefers reduced motion. Pairs with React.lazy so the
 * component's WebGL / animation code is code-split out of the main bundle.
 */
export function LazyViz({ children, className, eager = false, rootMargin = '300px', reducedFallback = null }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const [mount, setMount] = useState(false)

  useEffect(() => {
    if (reduced) {
      setMount(false)
      return
    }
    if (eager) {
      setMount(true)
      return
    }
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setMount(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced, eager, rootMargin])

  return (
    <div ref={ref} className={className} style={{ width: '100%', height: '100%' }} aria-hidden="true">
      {mount ? children : reducedFallback}
    </div>
  )
}
