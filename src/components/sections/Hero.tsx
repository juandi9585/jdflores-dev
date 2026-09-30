import { lazy, Suspense, useEffect, useLayoutEffect, useRef } from 'react'
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

   The entrance is CSS (motion.css, under html.intro), not GSAP: the library
   was riding in the main bundle for this one stagger. The only script is the
   console's decode, which swaps stand-in glyphs over the name's letters. */
const DECODE_GLYPHS = '0123456789ABCDEFHKXZ'
const DECODE_START = 260 // ms before the first letter resolves
const DECODE_STEP = 55 // ms between letters
const INTRO_MS = 2800 // the whole first-screen sequence, both worlds

const pickGlyph = () => DECODE_GLYPHS[(Math.random() * DECODE_GLYPHS.length) | 0]

function useIntro(theme: string) {
  const nameRef = useRef<HTMLSpanElement>(null)
  const startTheme = useRef(theme)

  // Stand-ins go on before the first paint, so the real name never flashes
  // ahead of its own decode and nothing has to start invisible (an opacity-0
  // start pushed Largest Contentful Paint to the end of the sequence).
  useLayoutEffect(() => {
    if (!document.documentElement.classList.contains('intro') || theme !== 'dark') return
    nameRef.current?.querySelectorAll<HTMLElement>('.ch').forEach((c) => (c.dataset.g = pickGlyph()))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (!root.classList.contains('intro')) return
    // switching worlds mid-entrance ends it: never play the other world's
    if (theme !== startTheme.current) {
      root.classList.remove('intro')
      return
    }
    const end = window.setTimeout(() => root.classList.remove('intro'), INTRO_MS)
    const chars = Array.from(nameRef.current?.querySelectorAll<HTMLElement>('.ch') ?? [])
    let raf = 0
    if (root.dataset.theme === 'dark') {
      const t0 = performance.now()
      const tick = (now: number) => {
        const t = now - t0
        let pending = false
        chars.forEach((c, i) => {
          if (t >= DECODE_START + i * DECODE_STEP) {
            delete c.dataset.g
            return
          }
          pending = true
          // not every frame: a letter that changes 60 times a second reads as noise
          if (!c.dataset.g || Math.random() < 0.3) {
            c.dataset.g = pickGlyph()
          }
        })
        if (pending) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }
    return () => {
      window.clearTimeout(end)
      cancelAnimationFrame(raf)
      chars.forEach((c) => delete c.dataset.g)
    }
  }, [theme])

  return nameRef
}
export function Hero() {
  const { t, lang } = useI18n()
  const h = t.hero
  const resumeHref = lang === 'es' ? LINKS.resumeEs : LINKS.resumeEn
  // Same sphere, tuned for the device rather than withheld from it: fewer,
  // slightly larger particles keep the silhouette and the touch response while
  // cutting the per-frame work a phone GPU has to do.
  const coarse = useCoarsePointer()
  const { theme } = useTheme()
  const nameRef = useIntro(theme)
  let n = 0

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
          <h1 className="hero__name display" aria-label={h.name}>
            <span aria-hidden="true" ref={nameRef}>
              {h.name.split(' ').map((word, wi) => (
                <span key={wi}>
                  {wi > 0 && ' '}
                  <span className="w">
                    {Array.from(word).map((ch, ci) => (
                      <span key={ci} className="ch" style={{ '--i': n++ } as React.CSSProperties}>
                        {ch}
                      </span>
                    ))}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <p className="hero__thesis">
            {h.thesis.map((seg, i) => (
              <span key={i} className={seg.accent ? 'text-amber' : undefined}>
                {seg.t}
              </span>
            ))}
          </p>

          <div className="hero__cta">
            <a href="#contact" className="btn btn--primary">
              {h.ctaPrimary}
              <ArrowRight className="btn__arrow" />
            </a>
            <a href={resumeHref} className="btn" download>
              {h.ctaSecondary}
            </a>
          </div>
        </div>

        <div className="hero__status">
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
