import { useI18n } from '../../i18n/I18nProvider'
import { useReveal } from '../../hooks/useReveal'
import { BrandIcon } from '../ui/BrandIcon'
import { orbitTools, claudeMark } from '../../data/tools'

/* Composition: corner marginalia. The section's name is set small and flush
   right, the way a running head sits on a printed page — the claims themselves
   carry the size. The orbit goes full-bleed behind the text instead of sitting
   in a column beside it, which also closes the 120px void that used to open
   between the heading and its own first sentence. */
export function AIFirst() {
  const { t } = useI18n()
  const ai = t.aiFirst
  const ref = useReveal<HTMLDivElement>({ stagger: true })

  return (
    <section className="section aifirst" id="ai-first">
      <div className="aifirst__viz" aria-hidden="true">
        <div className="orbit">
          <div className="orbit__core">
            <BrandIcon path={claudeMark.path} title="Claude Code" className="orbit__core-icon" />
          </div>
          <div className="orbit__ring">
            {orbitTools.map((tool, i) => (
              <div
                className="orbit__item"
                key={tool.name}
                style={{ '--i': i, '--n': orbitTools.length } as React.CSSProperties}
              >
                <div className="orbit__chip">
                  <BrandIcon path={tool.path} title={tool.name} className="orbit__icon" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container aifirst__inner" ref={ref}>
        <h2 className="aifirst__runhead" data-reveal-item>
          {ai.title}
        </h2>

        <div className="aifirst__claims">
          {ai.body.map((p, i) => (
            <p className="aifirst__claim" key={i} data-reveal-item>
              {p}
            </p>
          ))}
        </div>

        <dl className="aifirst__strip" data-reveal-item>
          {ai.points.map((pt, i) => (
            <div className="strip__item" key={i}>
              <dt className="strip__k">{pt.k}</dt>
              <dd className="strip__v">{pt.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
