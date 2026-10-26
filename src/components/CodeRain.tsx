import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../theme/ThemeProvider'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { createRain, type Rain } from './codeRainEngine'

/* The console's counterpart to the aquarium's bubbles (the drawing lives in
   codeRainEngine.ts). It never shares the screen with the hero sphere: two
   generative objects in one view fight. The hero counts as present a quarter
   of a screen before any of it is visible, so on the way back up the rain has
   already begun to fade when the hero's edge appears. Both directions are CSS
   fades, and the characters keep falling until the fade-out has finished.
   Only mounted in the dark theme, so the light world never pays for it. */
export function CodeRain() {
  const { theme } = useTheme()
  const reduced = useReducedMotion()
  const layerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rainRef = useRef<Rain | null>(null)
  const [heroGone, setHeroGone] = useState(false)
  const [ready, setReady] = useState(false)
  const dark = theme === 'dark'

  useEffect(() => {
    if (!dark) return
    const hero = document.getElementById('top')
    if (!hero) {
      setHeroGone(true)
      return
    }
    // the root reaches a quarter screen above the viewport
    const io = new IntersectionObserver(([entry]) => setHeroGone(!entry.isIntersecting), {
      rootMargin: '25% 0px 0px 0px',
    })
    io.observe(hero)
    return () => io.disconnect()
  }, [dark])

  // Created after the theme switch, not inside it: the font probe and the first
  // frames froze a phone for ~250 ms while the new world was opening. The hero
  // hides the rain on arrival anyway, so nobody sees it start late.
  useEffect(() => {
    const canvas = canvasRef.current
    if (!dark || !canvas) return
    let rain: Rain | null = null
    const t = window.setTimeout(() => {
      rain = createRain(canvas)
      rainRef.current = rain
      setReady(true)
    }, 800)
    return () => {
      window.clearTimeout(t)
      rain?.destroy()
      rainRef.current = null
      setReady(false)
    }
  }, [dark])

  useEffect(() => {
    const rain = rainRef.current
    const layer = layerRef.current
    if (!rain || !layer) return
    if (reduced) {
      rain.still()
      return
    }
    if (heroGone) {
      rain.start()
      return
    }
    // keep falling through the whole fade-out (its length comes from the CSS), then stop drawing
    const fade = parseFloat(getComputedStyle(layer).transitionDuration) * 1000 || 0
    const t = window.setTimeout(() => rain.stop(), fade + 100)
    return () => window.clearTimeout(t)
  }, [dark, reduced, heroGone, ready])

  if (!dark) return null

  return (
    <div className="rain" data-on={heroGone} aria-hidden="true" ref={layerRef}>
      <canvas ref={canvasRef} />
    </div>
  )
}
