import { useI18n } from '../../i18n/I18nProvider'
import { LINKS } from '../../i18n/content'
import { useReveal } from '../../hooks/useReveal'
import { ArrowRight, ArrowUpRight } from '../ui/Icon'

/* Composition: baseline-aligned pair. The invitation and the ledger sit side by
   side sharing a first baseline, rather than stacking heading over supporting
   text. The availability signal moves into the ledger so it is read with the
   contact details instead of floating under the headline. */
export function Contact() {
  const { t } = useI18n()
  const c = t.contact
  const ref = useReveal<HTMLDivElement>({ stagger: true })

  return (
    <section className="section contact" id="contact">
      <div className="container contact__pair" ref={ref}>
        <div className="contact__say">
          <h2 className="contact__title display" data-reveal-item>
            {c.title}
          </h2>
          <a
            href={`mailto:${LINKS.email}`}
            className="btn btn--primary btn--lg contact__cta"
            data-reveal-item
          >
            {c.cta}
            <ArrowRight className="btn__arrow" />
          </a>
        </div>

        <div className="contact__side" data-reveal-item>
          <p className="contact__status">
            <span className="pulse" aria-hidden="true" />
            {c.availability}
          </p>
          <p className="contact__lead">{c.lead}</p>

          <dl className="contact__ledger">
            <div className="contact__row">
              <dt className="mono">{c.emailLabel}</dt>
              <dd>
                <a href={`mailto:${LINKS.email}`} className="contact__link">
                  {LINKS.email}
                </a>
              </dd>
            </div>
            <div className="contact__row">
              <dt className="mono">{c.phoneLabel}</dt>
              <dd>
                <a href={`tel:${LINKS.phoneHref}`} className="contact__link tnum">
                  {LINKS.phone}
                </a>
              </dd>
            </div>
            <div className="contact__row">
              <dt className="mono">{c.githubLabel}</dt>
              <dd>
                <a
                  href={LINKS.github}
                  className="contact__link contact__link--ext"
                  target="_blank"
                  rel="noreferrer"
                >
                  {LINKS.githubHandle}
                  <ArrowUpRight className="contact__ext" />
                </a>
              </dd>
            </div>
            <div className="contact__row">
              <dt className="mono">{c.linkedinLabel}</dt>
              <dd>
                <a
                  href={LINKS.linkedin}
                  className="contact__link contact__link--ext"
                  target="_blank"
                  rel="noreferrer"
                >
                  {LINKS.linkedinHandle}
                  <ArrowUpRight className="contact__ext" />
                </a>
              </dd>
            </div>
            <div className="contact__row">
              <dt className="mono">{c.locationLabel}</dt>
              <dd>{c.location}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  )
}
