import type { MouseEvent } from 'react'
import { flushSync } from 'react-dom'
import { useI18n } from '../i18n/I18nProvider'
import { useTheme } from '../theme/ThemeProvider'

/* Drawn, not glyphs: a sun that becomes a moon. The track itself carries the
   two worlds — ink on the left, sky on the right — so the control shows what
   it switches between rather than naming it. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const { t } = useI18n()
  const isLight = theme === 'light'

  // The next world grows out of the switch as a circle over the old one. Where
  // view transitions are missing, or motion is unwelcome, it simply changes.
  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce) {
      toggle()
      return
    }
    const r = e.currentTarget.getBoundingClientRect()
    const x = r.left + r.width / 2
    const y = r.top + r.height / 2
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const vt = document.startViewTransition(() => {
      flushSync(toggle)
      // the snapshot is taken right after this callback: commit the attribute
      // here rather than trust the provider's effect to have run by then
      document.documentElement.dataset.theme = isLight ? 'dark' : 'light'
    })
    vt.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    })
  }

  return (
    <button
      type="button"
      className={`themetoggle ${className}`}
      onClick={onClick}
      role="switch"
      aria-checked={isLight}
      aria-label={t.theme.label}
      title={isLight ? t.theme.toDark : t.theme.toLight}
    >
      <span className="themetoggle__track" aria-hidden="true">
        <span className="themetoggle__knob">
          <svg viewBox="0 0 16 16" className="themetoggle__icon" aria-hidden="true">
            {isLight ? (
              <>
                <circle cx="8" cy="8" r="3.4" fill="currentColor" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <line
                    key={deg}
                    x1="8"
                    y1="1.3"
                    x2="8"
                    y2="3.1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    transform={`rotate(${deg} 8 8)`}
                  />
                ))}
              </>
            ) : (
              <path
                d="M13.2 10.1A5.6 5.6 0 0 1 6 2.9a5.7 5.7 0 1 0 7.2 7.2Z"
                fill="currentColor"
              />
            )}
          </svg>
        </span>
      </span>
    </button>
  )
}
