import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Theme = 'dark' | 'light'

type ThemeValue = {
  theme: Theme
  /** true while the visitor has made no explicit choice and the OS decides */
  followsSystem: boolean
  setTheme: (t: Theme) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeValue | null>(null)

export const THEME_KEY = 'jdf-theme'

/** Reads whatever the pre-paint script in index.html already resolved. */
function currentTheme(): Theme {
  if (typeof document === 'undefined') return 'dark'
  return document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'
}

function storedTheme(): Theme | null {
  try {
    const v = window.localStorage.getItem(THEME_KEY)
    return v === 'light' || v === 'dark' ? v : null
  } catch {
    return null
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Initialised from the DOM, not from a default, so React never disagrees
  // with the theme the pre-paint script already committed to.
  const [theme, setThemeState] = useState<Theme>(currentTheme)
  const [followsSystem, setFollowsSystem] = useState(() => storedTheme() === null)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    // the browser's own chrome should match the surface it sits above
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'light' ? '#CFE4F5' : '#0A0C10')
  }, [theme])

  // While no explicit choice exists, keep tracking the OS.
  useEffect(() => {
    if (!followsSystem) return
    const mq = window.matchMedia('(prefers-color-scheme: light)')
    const update = () => setThemeState(mq.matches ? 'light' : 'dark')
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [followsSystem])

  const setTheme = useCallback((t: Theme) => {
    setThemeState(t)
    setFollowsSystem(false)
    try {
      window.localStorage.setItem(THEME_KEY, t)
    } catch {
      /* private mode: the choice simply does not outlive the session */
    }
  }, [])

  const toggle = useCallback(() => {
    setThemeState((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      setFollowsSystem(false)
      try {
        window.localStorage.setItem(THEME_KEY, next)
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])

  const value = useMemo<ThemeValue>(
    () => ({ theme, followsSystem, setTheme, toggle }),
    [theme, followsSystem, setTheme, toggle],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme(): ThemeValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
