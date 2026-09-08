import { useI18n } from '../../i18n/I18nProvider'
import { useReveal } from '../../hooks/useReveal'

/* Composition: hanging indent. The heading sits in the left margin, baseline
   aligned beside the first row, never stacked above it. Every credential group
   shares one row grammar so "Beyond the screen" reads as a peer of the degrees
   and certifications rather than as an afterthought in a third column. */
export function Credentials() {
  const { t } = useI18n()
  const c = t.credentials
  const ref = useReveal<HTMLDivElement>({ stagger: true })

  return (
    <section className="section credentials" id="credentials">
      <div className="container cred" ref={ref}>
        <h2 className="cred__hang" data-reveal-item>
          {c.title}
        </h2>

        <div className="cred__table">
          <div className="cred__group" data-reveal-item>
            <h3 className="cred__k mono">{c.eduLabel}</h3>
            <div className="cred__rows">
              {c.education.map((e, i) => (
                <div className="cred__row" key={i}>
                  <div className="cred__main">
                    <span className="cred__primary">{e.degree}</span>
                    <span className="cred__secondary">
                      {e.school} · {e.place}
                    </span>
                    {e.note && <p className="cred__note">{e.note}</p>}
                  </div>
                  <span className="cred__meta mono tnum">{e.period}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cred__group" data-reveal-item>
            <h3 className="cred__k mono">{c.certLabel}</h3>
            <div className="cred__rows">
              {c.certs.map((cert, i) => (
                <div className="cred__row" key={i}>
                  <div className="cred__main">
                    <span className="cred__primary">{cert.name}</span>
                    <span className="cred__secondary">{cert.issuer}</span>
                  </div>
                  {cert.year && <span className="cred__meta mono tnum">{cert.year}</span>}
                </div>
              ))}
            </div>
          </div>

          <div className="cred__group" data-reveal-item>
            <h3 className="cred__k mono">{c.langLabel}</h3>
            <div className="cred__rows">
              {c.languages.map((l, i) => (
                <div className="cred__row" key={i}>
                  <div className="cred__main">
                    <span className="cred__primary">{l.lang}</span>
                  </div>
                  <span className="cred__meta">{l.level}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="cred__group" data-reveal-item>
            <h3 className="cred__k mono">{c.beyondLabel}</h3>
            <div className="cred__rows">
              {c.beyond.map((b, i) => (
                <div className="cred__row" key={i}>
                  <div className="cred__main">
                    <span className="cred__primary">{b}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
