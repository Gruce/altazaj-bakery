/**
 * Al-Tazaj Bakery wheat mark — recreated 1:1 from the brand logo vectors.
 * Inherits color via `currentColor`; size it with width/height utility classes.
 */
const WHEAT_PATH =
  'M0 0 L59.39 0 L109.9 47.97 L109.9 109.36 L58.99 109.36 L109.9 157.71 L109.9 219.14 ' +
  'L58.99 219.14 L109.9 267.49 L109.9 328.27 L120.21 328.27 L120.21 357.54 L109.9 357.54 ' +
  'L109.9 328.27 L58.06 328.27 L0 273.13 L0 217.81 L57.35 217.81 L0 163.35 L0 108.02 ' +
  'L56.4 108.02 L0 54.38 Z Z ' +
  'M120.23 47.97 L170.73 0 L230.12 0 L230.12 56.13 L175.48 108.02 L230.12 108.02 ' +
  'L230.12 164.45 L173.93 217.81 L230.12 217.81 L230.12 274.23 L173.22 328.27 L120.23 328.27 ' +
  'L120.23 267.49 L171.14 219.14 L120.23 219.14 L120.23 157.71 L171.14 109.36 L120.23 109.36 Z'

export default function WheatMark({
  className,
  title,
}: {
  className?: string
  title?: string
}) {
  return (
    <svg
      viewBox="0 0 230.12 357.54"
      className={className}
      fill="currentColor"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title && <title>{title}</title>}
      <path fillRule="evenodd" d={WHEAT_PATH} />
    </svg>
  )
}
