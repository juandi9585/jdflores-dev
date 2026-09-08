import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { dict, type Content, type Lang } from './content'

type I18nValue = {
  lang: Lang
  t: Content
  setLang: (l: Lang) => void
  toggle: () => void
}

const I18nContext = createContext<I18nValue | null>(null)

const STORAGE_KEY = 'jdf-lang'

function getInitialLang(): Lang {
  if (typeof window === 'undefined') return 'en'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'en' || stored === 'es') return stored
  // Default to English, but respect a Spanish-first browser.
  const nav = window.navigator.language?.toLowerCase() ?? ''
  return nav.startsWith('es') ? 'es' : 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  // Resolve preferred language after mount (avoids SSR/hydration mismatch).
  useEffect(() => {
    setLangState(getInitialLang())
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    window.localStorage.setItem(STORAGE_KEY, lang)

    // The share card is a real screen of this design: the site travels as a
    // link pasted into WhatsApp. Without this a Spanish reader gets an English
    // preview, because the title and description were baked into index.html.
    const { title, description } = dict[lang].meta
    document.title = title
    for (const sel of ['meta[name="description"]', 'meta[property="og:description"]']) {
      document.querySelector(sel)?.setAttribute('content', description)
    }
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:locale"]')?.setAttribute(
      'content',
      lang === 'es' ? 'es_VE' : 'en_US',
    )
  }, [lang])

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const toggle = useCallback(() => setLangState((p) => (p === 'en' ? 'es' : 'en')), [])

  const value = useMemo<I18nValue>(() => ({ lang, t: dict[lang], setLang, toggle }), [lang, setLang, toggle])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
