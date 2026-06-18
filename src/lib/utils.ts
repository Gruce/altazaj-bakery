import type { Lang, MenuItem } from '../data/menu'

/** Tiny classnames helper. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

/**
 * Return a CDN-resized variant of an item image.
 * Cloudflare Images (imagedelivery.net) supports flexible variants; the
 * legacy blob.dudes.studio URLs accept w/h query params.
 */
export function img(url: string, w: number, q = 80): string {
  if (!url) return url
  const h = Math.round(w * 1.25)
  if (url.includes('imagedelivery.net')) {
    return url.replace(/\/(public|w=[^/]+)$/, `/w=${w},h=${h},q=${q},fit=cover`)
  }
  if (url.includes('blob.dudes.studio')) {
    return url
      .replace(/([?&])w=\d+/, `$1w=${w}`)
      .replace(/([?&])h=\d+/, `$1h=${h}`)
      .replace(/([?&])q=\d+/, `$1q=${q}`)
  }
  return url
}

const fmt: Record<Lang, Intl.NumberFormat> = {
  ar: new Intl.NumberFormat('ar-EG'),
  en: new Intl.NumberFormat('en-US'),
}

/** Locale-aware number (Eastern-Arabic digits in AR, Western in EN). */
export function formatNum(n: number, lang: Lang): string {
  return fmt[lang].format(n)
}

/** Format an IQD price, e.g. 3000 -> "٣٬٠٠٠ د.ع" / "3,000 IQD". */
export function formatPrice(price: number, lang: Lang, currency: { ar: string; en: string }): string {
  const n = formatNum(price, lang)
  return lang === 'ar' ? `${n} ${currency.ar}` : `${n} ${currency.en}`
}

/** Normalize Arabic text for forgiving search (strip harakat, unify letters). */
function normalizeAr(s: string): string {
  return s
    .replace(/[ً-ْٰ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/ـ/g, '')
    .toLowerCase()
    .trim()
}

export function searchItems(query: string, list: MenuItem[]): MenuItem[] {
  const q = normalizeAr(query)
  if (!q) return []
  const terms = q.split(/\s+/).filter(Boolean)
  return list.filter((it) => {
    const hay = normalizeAr(`${it.ar.n} ${it.ar.d} ${it.en.n} ${it.en.d}`)
    return terms.every((t) => hay.includes(t))
  })
}

export const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
