import { useI18n } from '../../i18n/I18nProvider'
import { useReveal } from '../../hooks/useReveal'
import { Counter } from '../ui/Counter'

/* Composition: ruled ledger. The section's name demotes to the table caption
   and the measurements carry the display type — the hierarchy is inverted, so
   the reader meets the evidence before the claim. Adjacent row labels also
   disambiguate the two 90%+ figures, which read as one number when they sat
   side by side as identical cards. */
export function Impact() {
  const { t } = useI18n()
  const im = t.impact
  const ref = useReveal<HTMLDivElement>({ stagger: true })

  return (
    <section className="section impact" id="impact">
      <div className="container" ref={ref}>
        <table className="ledger">
          <caption className="ledger__caption">
            <h2 className="ledger__title">{im.title}</h2>
          </caption>
          <tbody>
            {im.metrics.map((m, i) => (
              <tr className="ledger__row" key={i} data-reveal-item>
                <td className={`ledger__figure ${m.kind === 'text' ? 'ledger__figure--text' : 'tnum'}`}>
                  {m.kind === 'count' ? <Counter to={m.value ?? 0} suffix={m.suffix} /> : m.text}
                </td>
                <th scope="row" className="ledger__what">
                  {m.label}
                </th>
                <td className="ledger__where">{m.note}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="impact__colophon" data-reveal-item>
          {im.lead}
        </p>
      </div>
    </section>
  )
}
