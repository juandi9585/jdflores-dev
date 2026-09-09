import { useI18n } from '../i18n/I18nProvider'
import { useTheme } from '../theme/ThemeProvider'

/* Drawn, not glyphs: a sun that becomes a moon. The track itself carries the
   two worlds — ink on the left, sky on the right — so the control shows what
   it switches between rather than naming it. */
export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const { t } = useI18n()
  const isLight = theme === 'light'

  return (
    <button
      type="button"
      className={`themetoggle ${className}`}
      onClick={toggle}
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
