import { useI18n } from '../../i18n/I18nProvider'
import { useReveal } from '../../hooks/useReveal'
import { BrandIcon } from '../ui/BrandIcon'
import { tools } from '../../data/tools'

/* Composition: specification sheet. The heading is not above the content — it
   occupies the first row of the same two-column grid, paired on its baseline
   with the section's one-line summary. Tools are set as prose rather than as
   pills, and the brand marks close the section as a quiet band instead of an
   infinite marquee that repeated the list verbatim. */
export function Stack() {
  const { t } = useI18n()
  const s = t.stack
  const ref = useReveal<HTMLDivElement>({ stagger: true })

  return (
    <section className="section stack" id="stack">
      <div className="container" ref={ref}>
        <div className="specsheet">
          <div className="specsheet__row specsheet__row--head" data-reveal-item>
            <h2 className="specsheet__title">{s.title}</h2>
            <p className="specsheet__summary">{s.lead}</p>
          </div>

          {s.groups.map((g, i) => (
            <div className="specsheet__row" key={i} data-reveal-item>
              <dl className="specsheet__pair">
                <dt className="specsheet__k mono">{g.label}</dt>
                <dd className="specsheet__v">{g.items.join(', ')}</dd>
              </dl>
            </div>
          ))}
        </div>

        <div className="stack__marks" data-reveal-item>
          {tools.map((tool) => (
            <BrandIcon
              key={tool.name}
              path={tool.path}
              title={tool.name}
              className="stack__mark"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
