import { useEffect, useState } from 'react'
import { siWhatsapp } from 'simple-icons'
import { useI18n } from '../i18n/I18nProvider'
import { LINKS } from '../i18n/content'
import { BrandIcon } from './ui/BrandIcon'

/**
 * A persistent action bar, phone only.
 *
 * Without it the résumé exists on screen 1 and nowhere else (the nav CTA is
 * hidden below 900px), and the email address is a 20px-tall link on screen 11
 * of 12. Both of the things a visitor actually came to do were stranded
 * outside the thumb zone. This puts them in the one region a thumb owns.
 *
 * It stays out of the way until the hero is behind you, so the hero's own
 * status strip and CTAs are never competed with.
 */
export function MobileActionBar() {
  const { t, lang } = useI18n()
  const c = t.contact
  const [shown, setShown] = useState(false)
  const resumeHref = lang === 'es' ? LINKS.resumeEs : LINKS.resumeEn

  useEffect(() => {
    const hero = document.getElementById('top')
    if (!hero) return
    const io = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-120px 0px 0px 0px' },
    )
    io.observe(hero)
    return () => io.disconnect()
  }, [])

  return (
    <div className="actionbar" data-shown={shown} aria-hidden={!shown}>
      <a className="actionbar__item" href={resumeHref} download tabIndex={shown ? 0 : -1}>
        {t.nav.resume}
      </a>
      <a
        className="actionbar__item"
        href={LINKS.whatsapp}
        target="_blank"
        rel="noreferrer"
        tabIndex={shown ? 0 : -1}
      >
        <BrandIcon path={siWhatsapp.path} className="actionbar__icon" />
        {c.whatsappLabel}
      </a>
      <a
        className="actionbar__item actionbar__item--primary"
        href={`mailto:${LINKS.email}`}
        tabIndex={shown ? 0 : -1}
      >
        {c.cta}
      </a>
    </div>
  )
}
