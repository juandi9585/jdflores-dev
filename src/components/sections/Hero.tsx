import { lazy, Suspense, useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { useI18n } from '../../i18n/I18nProvider'
import { LINKS } from '../../i18n/content'
import { LazyViz } from '../originkit/LazyViz'
import { ArrowRight } from '../ui/Icon'

const ParticleSphere = lazy(() => import('../originkit/ParticleSphere'))

export function Hero() {
  const { t, lang } = useI18n()
  const h = t.hero
  const resumeHref = lang === 'es' ? LINKS.resumeEs : LINKS.resumeEn
  const gridRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('[data-hero]', {
        y: 26,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        delay: 0.1,
      })
    }, gridRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="hero" id="top">
      <div className="hero__viz">
        <LazyViz eager reducedFallback={<div className="hero__sphere-fallback" />}>
          <Suspense fallback={null}>
            <ParticleSphere
              particlesCount={8000}
              particleScale={3.4}
              speed={13}
              smoothing={7}
              scale={10}
              stopOnHover={false}
              cursorOn
              cursorRadiusUI={70}
              cursorStrengthUI={9}
              clickForce={6}
              sphereColor="#57E0D8"
              style={{ width: '100%', height: '100%' }}
            />
          </Suspense>
        </LazyViz>
      </div>

      <div className="hero__grid container container--wide" ref={gridRef}>
        <p className="hero__role" data-hero="1">
          <span className="hero__dot" aria-hidden="true" />
          {h.role}
        </p>

        <h1 className="hero__name display" data-hero="2">
          {h.name}
        </h1>

        <p className="hero__thesis display" data-hero="3">
          {h.thesis.map((seg, i) => (
            <span key={i} className={seg.accent ? 'text-amber' : undefined}>
              {seg.t}
            </span>
          ))}
        </p>

        <p className="hero__tagline" data-hero="4">
          {h.tagline}
        </p>

        <div className="hero__cta" data-hero="5">
          <a href="#contact" className="btn btn--primary">
            {h.ctaPrimary}
            <ArrowRight className="btn__arrow" />
          </a>
          <a href={resumeHref} className="btn" download>
            {h.ctaSecondary}
          </a>
        </div>

        <div className="hero__meta mono" data-hero="6">
          <span>{h.location}</span>
          <span className="hero__meta-avail">
            <span className="pulse" aria-hidden="true" />
            {h.availability}
          </span>
        </div>
      </div>

      <a href="#about" className="hero__scroll mono" aria-label={h.scrollCue}>
        <span>{h.scrollCue}</span>
        <span className="hero__scroll-line" aria-hidden="true" />
      </a>
    </section>
  )
}
