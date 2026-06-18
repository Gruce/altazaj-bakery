import raw from './menu.json'

export type Lang = 'ar' | 'en'

export interface Brand {
  ar: { name: string; tag: string; city: string }
  en: { name: string; tag: string; city: string }
  currency: { ar: string; en: string }
  facebook: string
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

interface MenuData {
  brand: Brand
  categories: Category[]
  items: MenuItem[]
}

const data = raw as unknown as MenuData

export const brand: Brand = data.brand
export const categories: Category[] = data.categories
export const items: MenuItem[] = data.items

export const itemsByCat: Record<string, MenuItem[]> = categories.reduce(
  (acc, c) => {
    acc[c.id] = items.filter((it) => it.cat === c.id)
    return acc
  },
  {} as Record<string, MenuItem[]>,
)

/** A diverse, de-duplicated set of signature items for the hero carousel. */
export const featured: MenuItem[] = (() => {
  const perCat: Record<string, number> = {}
  const picks: MenuItem[] = []
  for (const it of items.filter((i) => i.feat)) {
    perCat[it.cat] = (perCat[it.cat] || 0) + 1
    if (perCat[it.cat] <= 2) picks.push(it)
    if (picks.length >= 14) break
  }
  return picks
})()

export const totalItems = items.length

/** The menu told as four acts — chapters of the wheat-to-table journey. */
export interface Act {
  id: string
  ar: string
  en: string
  taglineAr: string
  taglineEn: string
  categoryIds: string[]
}

export const acts: Act[] = [
  {
    id: 'savory',
    ar: 'المالح',
    en: 'Savory',
    taglineAr: 'دافئٌ، خارجٌ للتوّ من الفرن',
    taglineEn: 'Warm, straight from the oven',
    categoryIds: ['manakish', 'manoushe-snacks', 'sandwiches', 'pastries', 'large-pastries', 'bida'],
  },
  {
    id: 'bakery',
    ar: 'المخبوزات',
    en: 'Bakery & Bread',
    taglineAr: 'يُخبز طازجاً كلّ فجر',
    taglineEn: 'Baked fresh at every dawn',
    categoryIds: ['croissants', 'mini-croissants', 'kaak', 'breads', 'healthy-bakes'],
  },
  {
    id: 'sweet',
    ar: 'الحلويات',
    en: 'Sweets',
    taglineAr: 'لكلّ لحظةٍ حلوة',
    taglineEn: 'For every sweet moment',
    categoryIds: [
      'donuts', 'cakes', 'whole-cakes', 'brownies', 'sponge-cake',
      'muffins', 'cream-muffins', 'cheesecake', 'arabic-sweets', 'petit-four',
    ],
  },
  {
    id: 'drinks',
    ar: 'المشروبات',
    en: 'Drinks',
    taglineAr: 'ساخنة، مثلّجة، ومنعشة',
    taglineEn: 'Hot, iced & refreshing',
    categoryIds: ['hot-drinks', 'mojito', 'iced-drinks', 'milkshakes', 'smoothies', 'frappuccino', 'fresh-juices'],
  },
]

const byId: Record<string, Category> = Object.fromEntries(categories.map((c) => [c.id, c]))

/** Categories in act order (used for layout, nav, and scroll-spy). */
export const orderedCategories: Category[] = acts.flatMap((a) =>
  a.categoryIds.map((id) => byId[id]).filter(Boolean),
)

export function actCategories(act: Act): Category[] {
  return act.categoryIds.map((id) => byId[id]).filter(Boolean)
}

/**
 * Branches — edit here to update locations everywhere (hero + footer).
 * NOTE: the 2nd branch address below is a placeholder — replace العشار / Al-Ashar
 * with the real location.
 */
export interface Branch {
  ar: string
  en: string
  hoursAr?: string
  hoursEn?: string
  isNew?: boolean
}

export const branches: Branch[] = [
  {
    ar: 'البصرة · شارع الجزائر',
    en: 'Basra · Algeria St.',
    hoursAr: 'يومياً ٧ ص – ١٢ منتصف الليل',
    hoursEn: 'Daily 7 AM – 12 AM',
  },
  {
    ar: 'البصرة · العشار',
    en: 'Basra · Al-Ashar',
    hoursAr: 'يومياً ٧ ص – ١٢ منتصف الليل',
    hoursEn: 'Daily 7 AM – 12 AM',
    isNew: true,
  },
]
