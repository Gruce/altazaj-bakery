/**
 * Seed the SQLite database from the bundled menu export + default
 * acts / branches / UI strings. Idempotent: clears and re-inserts.
 *
 *   npm run db:push   # create tables first
 *   npm run db:seed
 */
import fs from 'node:fs'
import path from 'node:path'
import { db } from './index'
import { acts, branches, brand, categories, items, uiStrings } from './schema'
import { DEFAULT_STRINGS, STRING_KEYS } from '../lib/i18n'
import { ACTS_DEFAULT, BRANCHES_DEFAULT } from '../lib/defaults'

interface SeedJson {
  brand: {
    ar: { name: string; tag: string; city: string }
    en: { name: string; tag: string; city: string }
    currency: { ar: string; en: string }
    facebook: string
  }
  categories: { id: string; ar: string; en: string; emoji: string; count: number }[]
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

const seed: SeedJson = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), 'db', 'seed', 'menu.json'), 'utf8'),
)

// Acts (chapters) + branches come from the shared defaults.
const ACTS = ACTS_DEFAULT
const BRANCHES = BRANCHES_DEFAULT

// category id -> { actId, sort within act }
const catPlacement = new Map<string, { actId: string; sort: number }>()
ACTS.forEach((a) => {
  a.categoryIds.forEach((cid, i) => catPlacement.set(cid, { actId: a.id, sort: i }))
})

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size))
  return out
}

function run() {
  console.log('Seeding database…')

  // Clear (child -> parent) for an idempotent reseed.
  db.delete(items).run()
  db.delete(categories).run()
  db.delete(acts).run()
  db.delete(branches).run()
  db.delete(brand).run()
  db.delete(uiStrings).run()

  // Acts
  db.insert(acts)
    .values(
      ACTS.map((a, i) => ({
        id: a.id,
        nameAr: a.nameAr,
        nameEn: a.nameEn,
        taglineAr: a.taglineAr,
        taglineEn: a.taglineEn,
        sort: i,
      })),
    )
    .run()

  // Categories (attached to acts, ordered within each act)
  db.insert(categories)
    .values(
      seed.categories.map((c, i) => {
        const place = catPlacement.get(c.id)
        return {
          id: c.id,
          nameAr: c.ar,
          nameEn: c.en,
          emoji: c.emoji,
          actId: place?.actId ?? null,
          sort: place?.sort ?? i,
        }
      }),
    )
    .run()

  // Items (preserve per-category order via running sort index)
  const perCat: Record<string, number> = {}
  const itemRows = seed.items.map((it) => {
    const s = (perCat[it.cat] = (perCat[it.cat] ?? -1) + 1)
    return {
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
      sort: s,
    }
  })
  for (const batch of chunk(itemRows, 100)) {
    db.insert(items).values(batch).run()
  }

  // Brand (single row)
  db.insert(brand)
    .values({
      id: 1,
      nameAr: seed.brand.ar.name,
      nameEn: seed.brand.en.name,
      tagAr: seed.brand.ar.tag,
      tagEn: seed.brand.en.tag,
      cityAr: seed.brand.ar.city,
      cityEn: seed.brand.en.city,
      currencyAr: seed.brand.currency.ar,
      currencyEn: seed.brand.currency.en,
      facebook: seed.brand.facebook,
    })
    .run()

  // Branches
  db.insert(branches).values(BRANCHES).run()

  // UI strings
  db.insert(uiStrings)
    .values(
      STRING_KEYS.map(({ key }) => ({
        key,
        ar: DEFAULT_STRINGS.ar[key],
        en: DEFAULT_STRINGS.en[key],
      })),
    )
    .run()

  const counts = {
    acts: ACTS.length,
    categories: seed.categories.length,
    items: itemRows.length,
    branches: BRANCHES.length,
    strings: STRING_KEYS.length,
  }
  console.log('✓ Seeded:', counts)
}

run()
