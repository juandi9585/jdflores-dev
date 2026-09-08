import { useI18n } from '../i18n/I18nProvider'

export function LangToggle({ className = '' }: { className?: string }) {
  const { lang, setLang } = useI18n()
  return (
    <div className={`lang ${className}`} role="group" aria-label="Language / Idioma">
      <button
        type="button"
        className="lang__btn"
        data-active={lang === 'en'}
        aria-pressed={lang === 'en'}
        onClick={() => setLang('en')}
      >
        EN
      </button>
      <span className="lang__sep" aria-hidden="true">/</span>
      <button
        type="button"
        className="lang__btn"
        data-active={lang === 'es'}
        aria-pressed={lang === 'es'}
        onClick={() => setLang('es')}
      >
        ES
      </button>
    </div>
  )
}
