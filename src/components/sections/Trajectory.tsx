import { lazy, Suspense } from 'react'
import { useI18n } from '../../i18n/I18nProvider'
import { useReveal } from '../../hooks/useReveal'
import { LazyViz } from '../originkit/LazyViz'
import { Disclosure } from '../ui/Disclosure'
import { useTheme } from '../../theme/ThemeProvider'

const KineticGrid = lazy(() => import('../originkit/KineticGrid'))

/* Composition: the rail's own extremities carry the display type. The heading
   runs as a single tracked line against a hairline (a spine, not a stacked
   title) and the chronology is bracketed by "Now" and the earliest year in the
   data — numerals that carry real information rather than decorative indices. */
export function Trajectory() {
  const { t } = useI18n()
  const tr = t.trajectory
  const ref = useReveal<HTMLDivElement>({ stagger: true })
  const { theme } = useTheme()
  const light = theme === 'light'

  const years = tr.roles.flatMap((r) => (r.period.match(/\d{4}/g) ?? []).map(Number))
  const firstYear = years.length ? Math.min(...years) : null

  return (
    <section className="section trajectory" id="trajectory">
      <div className="trajectory__bg" aria-hidden="true">
        <LazyViz reducedFallback={<div className="dotgrid" style={{ position: 'absolute', inset: 0 }} />}>
          <Suspense fallback={null}>
            <KineticGrid
              key={theme}
              background="transparent"
              dotColor={light ? '#0079BF' : '#ECEEF3'}
              lineColor={light ? '#00B2FF' : '#57E0D8'}
              trailColor={light ? '#6BCB3C' : '#57E0D8'}
              spacing={48}
              radius={220}
              strength={4}
              trail
              style={{ pointerEvents: 'auto', cursor: 'default' }}
            />
          </Suspense>
        </LazyViz>
      </div>

      <div className="container" ref={ref}>
        <div className="tj__spine" data-reveal-item>
          <h2 className="tj__title">{tr.title}</h2>
          <span className="tj__rule" aria-hidden="true" />
        </div>

        <div className="tj__bracket" data-reveal-item>
          <span className="tj__year display" aria-hidden="true">
            {tr.nowLabel}
          </span>
          <p className="tj__note">{tr.lead}</p>
        </div>

        <ol className="timeline">
          {tr.roles.map((r, i) => (
            <li className="tl" key={i} data-reveal-item>
              <div className="tl__rail" aria-hidden="true">
                <span className="tl__node" />
              </div>
              <div className="tl__period mono tnum">
                {i === 0 && <span className="tl__now">{tr.nowLabel}</span>}
                {r.period}
              </div>
              <Disclosure
                className="tl__body"
                heading={r.title}
                headingClassName="tl__title"
                meta={
                  <p className="tl__company">
                    {r.company} <span className="tl__loc">{r.location}</span>
                  </p>
                }
              >
                <ul className="tl__points">
                  {r.points.map((p, j) => (
                    <li key={j}>{p}</li>
                  ))}
                </ul>
              </Disclosure>
            </li>
          ))}
        </ol>

        {firstYear !== null && (
          <div className="tj__bracket tj__bracket--end" data-reveal-item>
            <span className="tj__year tj__year--end display tnum" aria-hidden="true">
              {firstYear}
            </span>
          </div>
        )}
      </div>
    </section>
  )
}
