import { useEffect, useRef, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import { LINKS } from '../i18n/content'
import { LangToggle } from './LangToggle'

export function Nav() {
  const { t, lang } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<string>('')
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { href: '#about', label: t.nav.about },
    { href: '#impact', label: t.nav.impact },
    { href: '#trajectory', label: t.nav.work },
    { href: '#stack', label: t.nav.stack },
    { href: '#ai-first', label: t.nav.method },
    { href: '#contact', label: t.nav.contact },
  ]

  // Scroll-spy: report where the reader actually is across a very long page.
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1))
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible) setActive(`#${visible.target.id}`)
      },
      { rootMargin: '-45% 0px -50% 0px', threshold: 0 },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang])

  // Drawer: escape to close, and lock the page behind it.
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  // Keep the closed drawer out of the tab order entirely.
  useEffect(() => {
    const el = drawerRef.current
    if (!el) return
    if (open) el.removeAttribute('inert')
    else el.setAttribute('inert', '')
  }, [open])

  const resumeHref = lang === 'es' ? LINKS.resumeEs : LINKS.resumeEn

  return (
    <header className="nav" data-scrolled={scrolled}>
      <div className="nav__inner container container--wide">
        <a href="#top" className="nav__brand" aria-label="Juan Diego Flores">
          <span className="nav__mark" aria-hidden="true" />
          <span className="nav__brand-text mono">JDF</span>
        </a>

        <nav className="nav__links" aria-label="Sections">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="nav__link mono"
              aria-current={active === l.href ? 'true' : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__actions">
          <LangToggle className="nav__lang" />
          <a href={resumeHref} className="btn nav__cta" download>
            {t.nav.resume}
          </a>
          <button
            type="button"
            className="nav__burger"
            aria-expanded={open}
            aria-controls="nav-drawer"
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span data-open={open} />
          </button>
        </div>
      </div>

      <div
        className="nav__scrim"
        data-open={open}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      <div className="nav__mobile" id="nav-drawer" data-open={open} ref={drawerRef}>
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="nav__mobile-link display"
            onClick={() => setOpen(false)}
          >
            {l.label}
          </a>
        ))}
        <a href={resumeHref} className="btn btn--primary" download onClick={() => setOpen(false)}>
          {t.nav.resume}
        </a>
      </div>
    </header>
  )
}
