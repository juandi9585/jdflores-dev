import { useI18n } from '../../i18n/I18nProvider'
import { useReveal } from '../../hooks/useReveal'
import { Disclosure } from '../ui/Disclosure'

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
          <Disclosure
            className="cred__group"
            headingClassName="cred__k label"
            heading={c.eduLabel}
            revealItem
          >
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
                  <span className="cred__meta label tnum">{e.period}</span>
                </div>
              ))}
            </div>
          </Disclosure>

          <Disclosure
            className="cred__group"
            headingClassName="cred__k label"
            heading={c.certLabel}
            revealItem
          >
            <div className="cred__rows">
              {c.certs.map((cert, i) => (
                <div className="cred__row" key={i}>
                  <div className="cred__main">
                    <span className="cred__primary">{cert.name}</span>
                    <span className="cred__secondary">{cert.issuer}</span>
                  </div>
                  {cert.year && <span className="cred__meta label tnum">{cert.year}</span>}
                </div>
              ))}
            </div>
          </Disclosure>

          <Disclosure
            className="cred__group"
            headingClassName="cred__k label"
            heading={c.langLabel}
            revealItem
          >
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
          </Disclosure>

          <Disclosure
            className="cred__group"
            headingClassName="cred__k label"
            heading={c.beyondLabel}
            revealItem
          >
            <div className="cred__rows">
              {c.beyond.map((b, i) => (
                <div className="cred__row" key={i}>
                  <div className="cred__main">
                    <span className="cred__primary">{b}</span>
                  </div>
                </div>
              ))}
            </div>
          </Disclosure>
        </div>
      </div>
    </section>
  )
}
