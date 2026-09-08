import { useId, useState, type ReactNode } from 'react'
import { useWideViewport } from '../../hooks/useMediaQuery'
import { PlusMinus } from './Icon'

type Props = {
  /** goes inside the toggle on mobile; the heading text */
  heading: ReactNode
  headingClassName?: string
  /** always visible, above the panel — context that survives collapse */
  meta?: ReactNode
  children: ReactNode
  className?: string
  /** opt into the section's staggered scroll reveal */
  revealItem?: boolean
}

/**
 * Progressive disclosure that exists only on the phone.
 *
 * On a wide viewport this renders heading, meta and detail together with no
 * control at all, so the desktop composition is untouched. On a phone the
 * detail collapses behind a tap: the page ran 12.35 screens at 390px and over
 * 20 on a 320px device, and the two sections this wraps accounted for a third
 * of that while restating a résumé the site already offers in one tap.
 *
 * Uses the canonical heading > button accordion shape, so the control is a
 * real heading for assistive tech and the whole row is a comfortable target.
 */
export function Disclosure({ heading, headingClassName, meta, children, className, revealItem }: Props) {
  const wide = useWideViewport()
  const [open, setOpen] = useState(false)
  const id = useId()

  if (wide) {
    return (
      <div className={className} data-reveal-item={revealItem ? '' : undefined}>
        <h3 className={headingClassName}>{heading}</h3>
        {meta}
        {children}
      </div>
    )
  }

  return (
    <div className={className} data-open={open} data-reveal-item={revealItem ? '' : undefined}>
      <h3 className={headingClassName}>
        <button
          type="button"
          className="disclosure__toggle"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="disclosure__label">{heading}</span>
          <PlusMinus className="disclosure__icon" open={open} />
        </button>
      </h3>
      {meta}
      <div id={id} className="disclosure__panel" hidden={!open}>
        {children}
      </div>
    </div>
  )
}
