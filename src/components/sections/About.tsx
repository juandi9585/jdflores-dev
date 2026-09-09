import { lazy, Suspense } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import { useReveal } from '../../hooks/useReveal'
import { LazyViz } from '../originkit/LazyViz'
import { useTheme } from '../../theme/ThemeProvider'

const ReactiveLines = lazy(() => import('../originkit/ReactiveLines'))

/* Composition: run-in head. The h2 is set inline at display size and the
   opening paragraph continues on the same line flow, so the section has no
   stacked title at all — it simply starts talking. */
export function About() {
  const { t } = useI18n()
  const a = t.about
  const ref = useReveal<HTMLDivElement>({ stagger: true })
  const { theme } = useTheme()
  const light = theme === 'light'
  const [first, ...rest] = a.body

  return (
    <section className="section about" id="about">
      <div className="about__bg" aria-hidden="true">
        <LazyViz reducedFallback={<div className="lineflow" style={{ position: 'absolute', inset: 0 }} />}>
          <Suspense fallback={null}>
            <ReactiveLines
              key={theme}
              backgroundColor={light ? 'transparent' : '#0A0C10'}
              lineColor={light ? 'rgba(0, 121, 191, 0.42)' : 'rgba(87, 224, 216, 0.6)'}
              lineWidth={1}
              minLines={6}
              maxLines={30}
              fade
              fadeIntensity={12}
            />
          </Suspense>
        </LazyViz>
      </div>

      <div className="container about__grid" ref={ref}>
        <div className="about__runin" data-reveal-item>
          <h2 className="about__lead-in display">{a.title}</h2>{' '}
          <span className="about__first">{first}</span>
        </div>

        {rest.map((p, i) => (
          <p key={i} className="about__p" data-reveal-item>
            {p}
          </p>
        ))}

        <p className="about__signature" data-reveal-item>
          {a.signature}
        </p>
      </div>
    </section>
  )
}
