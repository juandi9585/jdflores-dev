import { useEffect, useState } from 'react'

/** Tracks a media query reactively. Returns `false` until mounted. */
export function useMediaQuery(query: string): boolean {
  // Resolved synchronously on the first render, not in an effect. Reading it a
  // tick late let LazyViz mount its child once before the coarse-pointer answer
  // arrived, which was enough to fire the dynamic import and pull three.js down
  // on a phone even though nothing ever rendered.
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setMatches(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])

  return matches
}

/**
 * True on touch-driven devices. Used to keep the WebGL / canvas work off
 * phones entirely: those effects are cursor-driven, so on a touch screen they
 * render a single static frame that reacts to nothing while still allocating
 * their full backing store and pulling three.js over the network.
 */
export function useCoarsePointer(): boolean {
  return useMediaQuery('(pointer: coarse)')
}

/** True when the viewport is at least tablet-width. */
export function useWideViewport(): boolean {
  return useMediaQuery('(min-width: 901px)')
}
