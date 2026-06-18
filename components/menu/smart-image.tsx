'use client'

import { useState } from 'react'
import { cx, img as variant } from '@/lib/utils'

interface SmartImageProps {
  src: string
  alt: string
  /** Base render width in CSS px; a 2x srcSet is generated automatically. */
  width: number
  className?: string
  imgClassName?: string
  eager?: boolean
  sizes?: string
}

/** Lazy, CDN-resized image with a warm shimmer placeholder and fade-in. */
export default function SmartImage({
  src,
  alt,
  width,
  className,
  imgClassName,
  eager,
  sizes,
}: SmartImageProps) {
  const [loaded, setLoaded] = useState(false)
  const x1 = variant(src, width)
  const x2 = variant(src, Math.round(width * 1.8))

  return (
    <div className={cx('relative overflow-hidden bg-cream-200', className)}>
      <div
        aria-hidden
        className={cx(
          'absolute inset-0 bg-gradient-to-br from-cream-200 via-cream-300/70 to-cream-200 transition-opacity duration-700',
          loaded ? 'opacity-0' : 'animate-pulse opacity-100',
        )}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={x1}
        srcSet={`${x1} 1x, ${x2} 2x`}
        sizes={sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        className={cx(
          'h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
          loaded ? 'opacity-100 blur-0 scale-100' : 'opacity-0 blur-md scale-105',
          imgClassName,
        )}
      />
    </div>
  )
}
