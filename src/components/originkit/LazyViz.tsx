import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useCoarsePointer } from '../../hooks/useMediaQuery'

type Props = {
  children: ReactNode
  className?: string
  /** mount immediately (above-the-fold) instead of waiting for scroll */
  eager?: boolean
  rootMargin?: string
  /** shown instead of the animation when the effect is skipped */
  reducedFallback?: ReactNode
}

/**
 * Mounts a heavy generative component only when it scrolls near the viewport,
 * and never when the user prefers reduced motion or is on a touch device.
 * Pairs with React.lazy so the component's WebGL / animation code is
 * code-split out of the main bundle.
 *
 * The coarse-pointer bail is the important one on mobile. All three of these
 * effects are cursor-driven: on a touch screen they paint one static frame and
 * then react to nothing, while still allocating their full canvas backing
 * store (the timeline grid alone sized to ~9.9 megapixels at DPR 3) and, for
 * the hero, fetching three.js over an expensive mobile connection. Phones get
 * the hand-built CSS analogue in `reducedFallback` instead, which is the same
 * picture for none of the cost.
 */
export function LazyViz({ children, className, eager = false, rootMargin = '300px', reducedFallback = null }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const coarse = useCoarsePointer()
  const [mount, setMount] = useState(false)

  useEffect(() => {
    if (reduced || coarse) {
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
  }, [reduced, coarse, eager, rootMargin])

  return (
    <div ref={ref} className={className} style={{ width: '100%', height: '100%' }} aria-hidden="true">
      {mount ? children : reducedFallback}
    </div>
  )
}
