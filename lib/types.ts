/**
 * Canonical public-menu types. These mirror the legacy `src/data/menu.ts`
 * shapes so the ported UI components and the public `/api/menu` payload stay
 * identical to the original static site. The dashboard uses richer row types
 * inferred from the Drizzle schema (`db/schema.ts`).
 */

export type Lang = 'ar' | 'en'

export interface Brand {
  ar: { name: string; tag: string; city: string }
  en: { name: string; tag: string; city: string }
  currency: { ar: string; en: string }
  facebook: string
  instagram?: string
  phone?: string
}

export interface Category {
  id: string
  ar: string
  en: string
  emoji: string
  count: number
}

export interface MenuItem {
  id: string
  cat: string
  ar: { n: string; d: string }
  en: { n: string; d: string }
  price: number
  img: string
  feat: boolean
}

export interface Act {
  id: string
  ar: string
  en: string
  taglineAr: string
  taglineEn: string
  categoryIds: string[]
}

export interface Branch {
  ar: string
  en: string
  hoursAr?: string
  hoursEn?: string
  isNew?: boolean
}

/** The full payload the public menu renders from (assembled in `lib/menu-data.ts`). */
export interface MenuPayload {
  brand: Brand
  categories: Category[]
  orderedCategories: Category[]
  items: MenuItem[]
  itemsByCat: Record<string, MenuItem[]>
  featured: MenuItem[]
  totalItems: number
  acts: Act[]
  branches: Branch[]
}
