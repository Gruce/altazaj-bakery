import 'server-only'
import { asc, count } from 'drizzle-orm'
import { db } from '@/db'
import {
  acts,
  branches,
  brand as brandT,
  categories,
  items,
  uiStrings,
} from '@/db/schema'
import { DEFAULT_STRINGS, STRING_KEYS } from '@/lib/i18n'
import type { ActRow, BranchRow, CategoryRow, ItemRow } from '@/db/schema'

/** Map of category id -> global menu order index (act order, then category sort). */
function categoryOrderMap(): Map<string, number> {
  const actRows = db.select().from(acts).all()
  const actSort = new Map(actRows.map((a) => [a.id, a.sort]))
  const cats = db.select().from(categories).all()
  const ordered = [...cats].sort((a, b) => {
    const aa = a.actId != null ? (actSort.get(a.actId) ?? 999) : 999
    const ba = b.actId != null ? (actSort.get(b.actId) ?? 999) : 999
    return aa - ba || a.sort - b.sort || a.id.localeCompare(b.id)
  })
  return new Map(ordered.map((c, i) => [c.id, i]))
}

export interface CategoryListRow extends CategoryRow {
  actName: string | null
  itemCount: number
}

export function listCategories(): CategoryListRow[] {
  const actRows = db.select().from(acts).all()
  const actSort = new Map(actRows.map((a) => [a.id, a.sort]))
  const actName = new Map(actRows.map((a) => [a.id, a.nameEn || a.nameAr]))
  const counts = db
    .select({ cat: items.categoryId, c: count() })
    .from(items)
    .groupBy(items.categoryId)
    .all()
  const countMap = new Map(counts.map((r) => [r.cat, Number(r.c)]))

  return db
    .select()
    .from(categories)
    .all()
    .map((c) => ({
      ...c,
      actName: c.actId ? (actName.get(c.actId) ?? null) : null,
      itemCount: countMap.get(c.id) ?? 0,
    }))
    .sort((a, b) => {
      const aa = a.actId != null ? (actSort.get(a.actId) ?? 999) : 999
      const ba = b.actId != null ? (actSort.get(b.actId) ?? 999) : 999
      return aa - ba || a.sort - b.sort || a.id.localeCompare(b.id)
    })
}

export interface ActListRow extends ActRow {
  categoryCount: number
}

export function listActs(): ActListRow[] {
  const counts = db
    .select({ act: categories.actId, c: count() })
    .from(categories)
    .groupBy(categories.actId)
    .all()
  const map = new Map(counts.map((r) => [r.act, Number(r.c)]))
  return db
    .select()
    .from(acts)
    .orderBy(asc(acts.sort))
    .all()
    .map((a) => ({ ...a, categoryCount: map.get(a.id) ?? 0 }))
}

export function listBranches(): BranchRow[] {
  return db.select().from(branches).orderBy(asc(branches.sort)).all()
}

export function getBrandRow() {
  return (
    db.select().from(brandT).limit(1).get() ?? {
      id: 1,
      nameAr: '',
      nameEn: '',
      tagAr: '',
      tagEn: '',
      cityAr: '',
      cityEn: '',
      currencyAr: 'د.ع',
      currencyEn: 'IQD',
      facebook: '',
      instagram: '',
      phone: '',
    }
  )
}

export interface StringListRow {
  key: string
  label: string
  ar: string
  en: string
}

export function listStrings(): StringListRow[] {
  const rows = db.select().from(uiStrings).all()
  const map = new Map(rows.map((r) => [r.key, r]))
  return STRING_KEYS.map(({ key, label }) => {
    const row = map.get(key)
    return {
      key,
      label,
      ar: row?.ar ?? DEFAULT_STRINGS.ar[key],
      en: row?.en ?? DEFAULT_STRINGS.en[key],
    }
  })
}

export interface ItemListRow extends ItemRow {
  categoryName: string
  emoji: string
}

export function listItems(
  opts: { categoryId?: string; q?: string; filter?: 'featured' | 'hidden' | 'all' } = {},
): ItemListRow[] {
  const cats = db.select().from(categories).all()
  const catMap = new Map(cats.map((c) => [c.id, c]))
  const order = categoryOrderMap()

  let rows = db.select().from(items).all()
  if (opts.categoryId) rows = rows.filter((r) => r.categoryId === opts.categoryId)
  if (opts.filter === 'featured') rows = rows.filter((r) => r.featured)
  if (opts.filter === 'hidden') rows = rows.filter((r) => !r.available)
  if (opts.q) {
    const q = opts.q.toLowerCase()
    rows = rows.filter((r) => `${r.nameAr} ${r.nameEn}`.toLowerCase().includes(q))
  }

  return rows
    .map((r) => {
      const c = catMap.get(r.categoryId)
      return {
        ...r,
        categoryName: c ? c.nameEn || c.nameAr : r.categoryId,
        emoji: c?.emoji ?? '',
      }
    })
    .sort(
      (a, b) =>
        (order.get(a.categoryId) ?? 999) - (order.get(b.categoryId) ?? 999) ||
        a.sort - b.sort ||
        a.id.localeCompare(b.id),
    )
}

/** {id,label} options for category / act selects (menu order). */
export function categoryOptions(): { id: string; label: string }[] {
  return listCategories().map((c) => ({
    id: c.id,
    label: `${c.emoji ? c.emoji + ' ' : ''}${c.nameEn || c.nameAr}`,
  }))
}

export function actOptions(): { id: string; label: string }[] {
  return db
    .select()
    .from(acts)
    .orderBy(asc(acts.sort))
    .all()
    .map((a) => ({ id: a.id, label: a.nameEn || a.nameAr }))
}
