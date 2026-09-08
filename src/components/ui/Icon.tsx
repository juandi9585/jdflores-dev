/* Drawn icons, one consistent stroke and weight.
   Unicode glyphs (→ ↗) are not an icon system; these are. */

type IconProps = {
  className?: string
}

const base = {
  viewBox: '0 0 16 16',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M2.5 8h11" />
      <path d="M9 3.5 13.5 8 9 12.5" />
    </svg>
  )
}

export function ArrowDown({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8 2.5v11" />
      <path d="M3.5 9 8 13.5 12.5 9" />
    </svg>
  )
}

/** Disclosure marker: a plus whose upright stroke retracts into a minus.
    Both strokes always render so the change can be eased rather than swapped. */
export function PlusMinus({ className, open }: IconProps & { open?: boolean }) {
  return (
    <svg {...base} className={className} data-open={open || undefined}>
      <path d="M3 8h10" />
      <path d="M8 3v10" className="plusminus__bar" />
    </svg>
  )
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M4.5 11.5 11.5 4.5" />
      <path d="M5.5 4.5h6v6" />
    </svg>
  )
}
