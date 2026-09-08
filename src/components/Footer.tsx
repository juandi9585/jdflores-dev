import { useI18n } from '../i18n/I18nProvider'
import { LINKS } from '../i18n/content'

export function Footer() {
  const { t } = useI18n()
  const c = t.contact
  return (
    <footer className="footer">
      <div className="container container--wide footer__inner">
        <span className="footer__name">Juan Diego Flores</span>

        <nav className="footer__links" aria-label={c.title}>
          <a className="footer__link" href={`mailto:${LINKS.email}`}>
            {c.emailLabel}
          </a>
          <a className="footer__link" href={LINKS.github} target="_blank" rel="noreferrer">
            {c.githubLabel}
          </a>
          <a className="footer__link" href={LINKS.linkedin} target="_blank" rel="noreferrer">
            {c.linkedinLabel}
          </a>
        </nav>

        <span className="footer__year mono tnum">© {new Date().getFullYear()} · {t.footer.rights}</span>
      </div>
    </footer>
  )
}
