import { useMemo } from 'react'
import { useTheme } from '../theme/ThemeProvider'

/* The light world's one ornament: bubbles rising through the water behind
   everything. Fixed, inert, decorative — and only ever rendered in the theme
   that has water in it, so the dark world never pays for it. */
export function Bubbles({ count = 14 }: { count?: number }) {
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

  if (theme !== 'light') return null

  return (
    <div className="bubbles" aria-hidden="true">
      {bubbles.map((style, i) => (
        <span className="bubble" key={i} style={style} />
      ))}
    </div>
  )
}
