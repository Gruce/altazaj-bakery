import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import { cache } from 'react'
import { db } from '@/db'
import {
  acts as actsT,
  branches as branchesT,
  brand as brandT,
  categories as catsT,
  items as itemsT,
  uiStrings as stringsT,
} from '@/db/schema'
import { DEFAULT_STRINGS, type Strings } from '@/lib/i18n'
import { ACTS_DEFAULT, BRANCHES_DEFAULT } from '@/lib/defaults'
import type {
  Act,
  Brand,
  Category,
  Lang,
  MenuItem,
  MenuPayload,
} from '@/lib/types'

/** Normalized inputs the assembler works from (shared by the DB + seed paths). */
interface RawBrand {
  nameAr: string
  nameEn: string
  tagAr: string
  tagEn: string
  cityAr: string
  cityEn: string
  currencyAr: string
  currencyEn: string
  facebook: string
  instagram?: string
  phone?: string
}
interface RawAct {
  id: string
  nameAr: string
  nameEn: string
  taglineAr: string
  taglineEn: string
  sort: number
}
interface RawCat {
  id: string
  nameAr: string
  nameEn: string
  emoji: string
  actId: string | null
  sort: number
}
interface RawItem {
  id: string
  categoryId: string
  nameAr: string
  nameEn: string
  descAr: string
  descEn: string
  price: number
  img: string
  featured: boolean
  available: boolean
  sort: number
}
interface RawBranch {
  nameAr: string
  nameEn: string
  hoursAr: string
  hoursEn: string
  isNew: boolean
  sort: number
}
interface RawString {
  key: string
  ar: string
  en: string
}

export interface MenuData {
  menu: MenuPayload
  strings: Record<Lang, Strings>
}

function assemble(input: {
  brand: RawBrand
  acts: RawAct[]
  cats: RawCat[]
  items: RawItem[]
  branches: RawBranch[]
  strings: RawString[]
}): MenuData {
  const { acts, cats, items, branches, strings } = input

  const actSort = new Map(acts.map((a) => [a.id, a.sort]))
  const orderedCats = [...cats].sort((a, b) => {
    const aa = a.actId != null ? (actSort.get(a.actId) ?? 999) : 999
    const ba = b.actId != null ? (actSort.get(b.actId) ?? 999) : 999
    return aa - ba || a.sort - b.sort || a.id.localeCompare(b.id)
  })

  // available rows grouped + sorted within each category
  const rowsByCat = new Map<string, RawItem[]>()
  for (const r of items) {
    if (!r.available) continue
    const arr = rowsByCat.get(r.categoryId) ?? []
    arr.push(r)
    rowsByCat.set(r.categoryId, arr)
  }
  for (const arr of rowsByCat.values()) {
    arr.sort((x, y) => x.sort - y.sort || x.id.localeCompare(y.id))
  }

  const toItem = (r: RawItem): MenuItem => ({
    id: r.id,
    cat: r.categoryId,
    ar: { n: r.nameAr, d: r.descAr },
    en: { n: r.nameEn, d: r.descEn },
    price: r.price,
    img: r.img,
    feat: r.featured,
  })

  const itemsByCat: Record<string, MenuItem[]> = {}
  for (const c of orderedCats) {
    itemsByCat[c.id] = (rowsByCat.get(c.id) ?? []).map(toItem)
  }

  const flatItems: MenuItem[] = orderedCats.flatMap((c) => itemsByCat[c.id])

  const categories: Category[] = orderedCats.map((c) => ({
    id: c.id,
    ar: c.nameAr,
    en: c.nameEn,
    emoji: c.emoji,
    count: itemsByCat[c.id].length,
  }))

  const orderedCategories = categories.filter((c) => c.count > 0)

  // featured carousel: diverse, ≤2 per category, ≤14 total (ported logic)
  const featured: MenuItem[] = (() => {
    const perCat: Record<string, number> = {}
    const picks: MenuItem[] = []
    for (const it of flatItems) {
      if (!it.feat) continue
      perCat[it.cat] = (perCat[it.cat] || 0) + 1
      if (perCat[it.cat] <= 2) picks.push(it)
      if (picks.length >= 14) break
    }
    return picks
  })()

  const actsOut: Act[] = [...acts]
    .sort((a, b) => a.sort - b.sort)
    .map((a) => ({
      id: a.id,
      ar: a.nameAr,
      en: a.nameEn,
      taglineAr: a.taglineAr,
      taglineEn: a.taglineEn,
      categoryIds: orderedCats.filter((c) => c.actId === a.id).map((c) => c.id),
    }))

  const brand: Brand = {
    ar: { name: input.brand.nameAr, tag: input.brand.tagAr, city: input.brand.cityAr },
    en: { name: input.brand.nameEn, tag: input.brand.tagEn, city: input.brand.cityEn },
    currency: { ar: input.brand.currencyAr, en: input.brand.currencyEn },
    facebook: input.brand.facebook,
    instagram: input.brand.instagram || undefined,
    phone: input.brand.phone || undefined,
  }

  const branchesOut = [...branches]
    .sort((a, b) => a.sort - b.sort)
    .map((b) => ({
      ar: b.nameAr,
      en: b.nameEn,
      hoursAr: b.hoursAr,
      hoursEn: b.hoursEn,
      isNew: b.isNew,
    }))

  const strOut: Record<Lang, Strings> = {
    ar: { ...DEFAULT_STRINGS.ar },
    en: { ...DEFAULT_STRINGS.en },
  }
  for (const s of strings) {
    if (s.key in strOut.ar) {
      strOut.ar[s.key as keyof Strings] = s.ar
      strOut.en[s.key as keyof Strings] = s.en
    }
  }

  return {
    menu: {
      brand,
      categories,
      orderedCategories,
      items: flatItems,
      itemsByCat,
      featured,
      totalItems: flatItems.length,
      acts: actsOut,
      branches: branchesOut,
    },
    strings: strOut,
  }
}

function fromDb(): MenuData | null {
  const brandRow = db.select().from(brandT).limit(1).get()
  const catRows = db.select().from(catsT).all()
  if (!brandRow || catRows.length === 0) return null

  return assemble({
    brand: brandRow,
    acts: db.select().from(actsT).all(),
    cats: catRows,
    items: db.select().from(itemsT).all(),
    branches: db.select().from(branchesT).all(),
    strings: db.select().from(stringsT).all(),
  })
}

interface SeedJson {
  brand: {
    ar: { name: string; tag: string; city: string }
    en: { name: string; tag: string; city: string }
    currency: { ar: string; en: string }
    facebook: string
  }
  categories: { id: string; ar: string; en: string; emoji: string }[]
  items: {
    id: string
    cat: string
    ar: { n: string; d: string }
    en: { n: string; d: string }
    price: number
    img: string
    feat: boolean
  }[]
}

/** Offline / unseeded fallback — builds the payload straight from the bundled export. */
function fromSeed(): MenuData {
  const seed: SeedJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'db', 'seed', 'menu.json'), 'utf8'),
  )
  const placement = new Map<string, { actId: string; sort: number }>()
  ACTS_DEFAULT.forEach((a) =>
    a.categoryIds.forEach((cid, i) => placement.set(cid, { actId: a.id, sort: i })),
  )
  const perCat: Record<string, number> = {}

  return assemble({
    brand: {
      nameAr: seed.brand.ar.name,
      nameEn: seed.brand.en.name,
      tagAr: seed.brand.ar.tag,
      tagEn: seed.brand.en.tag,
      cityAr: seed.brand.ar.city,
      cityEn: seed.brand.en.city,
      currencyAr: seed.brand.currency.ar,
      currencyEn: seed.brand.currency.en,
      facebook: seed.brand.facebook,
    },
    acts: ACTS_DEFAULT.map((a, i) => ({
      id: a.id,
      nameAr: a.nameAr,
      nameEn: a.nameEn,
      taglineAr: a.taglineAr,
      taglineEn: a.taglineEn,
      sort: i,
    })),
    cats: seed.categories.map((c, i) => ({
      id: c.id,
      nameAr: c.ar,
      nameEn: c.en,
      emoji: c.emoji,
      actId: placement.get(c.id)?.actId ?? null,
      sort: placement.get(c.id)?.sort ?? i,
    })),
    items: seed.items.map((it) => ({
      id: it.id,
      categoryId: it.cat,
      nameAr: it.ar?.n ?? '',
      nameEn: it.en?.n ?? '',
      descAr: it.ar?.d ?? '',
      descEn: it.en?.d ?? '',
      price: Math.round(Number(it.price) || 0),
      img: it.img ?? '',
      featured: Boolean(it.feat),
      available: true,
      sort: (perCat[it.cat] = (perCat[it.cat] ?? -1) + 1),
    })),
    branches: BRANCHES_DEFAULT,
    strings: [],
  })
}

/** Assemble the full menu data (DB first, seed JSON as fallback). Per-request memoized. */
export const getMenuData = cache(async (): Promise<MenuData> => {
  try {
    return fromDb() ?? fromSeed()
  } catch {
    return fromSeed()
  }
})

export async function getMenu(): Promise<MenuPayload> {
  return (await getMenuData()).menu
}

export async function getStrings(): Promise<Record<Lang, Strings>> {
  return (await getMenuData()).strings
}
