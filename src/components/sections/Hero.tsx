import { lazy, Suspense } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import { LINKS } from '../../i18n/content'
import { LazyViz } from '../originkit/LazyViz'
import { useCoarsePointer } from '../../hooks/useMediaQuery'
import { useTheme } from '../../theme/ThemeProvider'
import { ArrowRight, ArrowDown } from '../ui/Icon'

const ParticleSphere = lazy(() => import('../originkit/ParticleSphere'))

/* Composition: masthead + status bar. There is no label above the name and no
   small descriptor beneath it — the name and the thesis are set as one
   typographic mass, and every piece of metadata (role, location, availability,
   the scroll cue) lives in a single instrument strip pinned to the bottom of
   the viewport. That strip is the "Deployed Systems Console" idea taken
   literally, and it is the one mechanic no other section on the page uses.

   The entrance is CSS, not GSAP: the library was riding in the main bundle for
   this one stagger, which is real weight on a mobile connection. */
export function Hero() {
  const { t, lang } = useI18n()
  const h = t.hero
  const resumeHref = lang === 'es' ? LINKS.resumeEs : LINKS.resumeEn
  // Same sphere, tuned for the device rather than withheld from it: fewer,
  // slightly larger particles keep the silhouette and the touch response while
  // cutting the per-frame work a phone GPU has to do.
  const coarse = useCoarsePointer()
  const { theme } = useTheme()

  return (
    <section className="hero" id="top">
      <div className="hero__viz">
        <LazyViz eager reducedFallback={<div className="hero__sphere-fallback" />}>
          <Suspense fallback={null}>
            <ParticleSphere
              key={theme}
              particlesCount={coarse ? 4200 : 8000}
              particleScale={coarse ? 4.1 : 3.4}
              speed={13}
              smoothing={7}
              scale={10}
              stopOnHover={false}
              cursorOn
              cursorRadiusUI={coarse ? 92 : 70}
              cursorStrengthUI={9}
              clickForce={6}
              sphereColor={theme === 'light' ? '#00B2FF' : '#57E0D8'}
              style={{ width: '100%', height: '100%' }}
            />
          </Suspense>
        </LazyViz>
      </div>

      <div className="hero__inner">
        <div className="hero__grid container container--wide">
          <h1 className="hero__name display" data-hero="1">
            {h.name}
          </h1>

          <p className="hero__thesis" data-hero="2">
            {h.thesis.map((seg, i) => (
              <span key={i} className={seg.accent ? 'text-amber' : undefined}>
                {seg.t}
              </span>
            ))}
          </p>

          <div className="hero__cta" data-hero="3">
            <a href="#contact" className="btn btn--primary">
              {h.ctaPrimary}
              <ArrowRight className="btn__arrow" />
            </a>
            <a href={resumeHref} className="btn" download>
              {h.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="hero__status" data-hero="4">
          <div className="container container--wide hero__status-row label">
            <span className="hero__stat">{h.role}</span>
            <span className="hero__stat">{h.location}</span>
            <span className="hero__stat hero__stat--live">
              <span className="pulse" aria-hidden="true" />
              {h.availability}
            </span>
            <a href="#about" className="hero__stat hero__stat--cue">
              {h.scrollCue}
              <ArrowDown className="hero__cue-icon" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
