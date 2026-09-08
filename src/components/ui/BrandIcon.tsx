export function BrandIcon({
  path,
  title,
  className,
}: {
  path: string
  title?: string
  className?: string
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} role="img" aria-label={title} fill="currentColor">
      <path d={path} />
    </svg>
  )
}
