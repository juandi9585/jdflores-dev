import { useMemo } from 'react'
import { useTheme } from '../theme/ThemeProvider'

/* The light world's one ornament: bubbles rising through the water behind
   everything. Fixed, inert, decorative — and only ever rendered in the theme
   that has water in it, so the dark world never pays for it. */
/* Plus a burst: every time the aquarium fills (the first visit in light, or a
   switch into it) a cluster rises fast from the bottom once and is gone. */
export function Bubbles({ count = 14, burst = 12 }: { count?: number; burst?: number }) {
  const { theme } = useTheme()

  const bubbles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        // deterministic per index: no re-randomising on every render
        const r = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1
        const size = 8 + r(1) * 46
        return {
          left: `${r(2) * 100}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${16 + r(3) * 22}s`,
          animationDelay: `${-r(4) * 30}s`,
          '--drift': `${(r(5) - 0.5) * 120}px`,
          '--rest': `${12 + r(6) * 70}%`,
        } as React.CSSProperties
      }),
    [count],
  )

  const burstBubbles = useMemo(
    () =>
      Array.from({ length: burst }, (_, i) => {
        const r = (n: number) => ((Math.sin((i + 40) * 12.9898 + n * 78.233) * 43758.5453) % 1 + 1) % 1
        const size = 10 + r(1) * 30
        return {
          // gathered toward the middle, where the eye already is
          left: `${18 + r(2) * 64}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${2.6 + r(3) * 1.8}s`,
          animationDelay: `${r(4) * 0.7}s`,
          '--drift': `${(r(5) - 0.5) * 160}px`,
        } as React.CSSProperties
      }),
    [burst],
  )

  if (theme !== 'light') return null

  return (
    <div className="bubbles" aria-hidden="true">
      {bubbles.map((style, i) => (
        <span className="bubble" key={i} style={style} />
      ))}
      {burstBubbles.map((style, i) => (
        <span className="bubble bubble--burst" key={`b${i}`} style={style} />
      ))}
    </div>
  )
}
