'use server'

import { revalidatePath } from 'next/cache'
import { eq, max } from 'drizzle-orm'
import { db } from '@/db'
import { categories } from '@/db/schema'
import { categorySchema } from '@/lib/validators'
import { requireSession } from '@/lib/session'
import { slugify } from '@/lib/utils'

function revalidate() {
  revalidatePath('/dashboard/categories')
  revalidatePath('/dashboard')
  revalidatePath('/')
}

function uniqueId(base: string): string {
  const root = base || 'category'
  let id = root
  let i = 2
  while (db.select({ id: categories.id }).from(categories).where(eq(categories.id, id)).get()) {
    id = `${root}-${i++}`
  }
  return id
}

export async function saveCategory(input: unknown) {
  await requireSession()
  const data = categorySchema.parse(input)

  if (data.id) {
    db.update(categories)
      .set({
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        emoji: data.emoji,
        actId: data.actId,
      })
      .where(eq(categories.id, data.id))
      .run()
  } else {
    const id = uniqueId(slugify(data.nameEn || data.nameAr))
    const m = db.select({ m: max(categories.sort) }).from(categories).get()
    db.insert(categories)
      .values({
        id,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        emoji: data.emoji,
        actId: data.actId,
        sort: (m?.m ?? -1) + 1,
      })
      .run()
  }

  revalidate()
  return { ok: true }
}

export async function deleteCategory(id: string) {
  await requireSession()
  // FK cascade removes the category's items.
  db.delete(categories).where(eq(categories.id, id)).run()
  revalidate()
  return { ok: true }
}

export async function moveCategory(id: string, dir: 'up' | 'down') {
  await requireSession()
  const row = db.select().from(categories).where(eq(categories.id, id)).get()
  if (!row) return { ok: false }
  const sibs = db
    .select()
    .from(categories)
    .all()
    .filter((c) => c.actId === row.actId)
    .sort((a, b) => a.sort - b.sort || a.id.localeCompare(b.id))
  const idx = sibs.findIndex((s) => s.id === id)
  const swapIdx = dir === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= sibs.length) return { ok: true }
  const other = sibs[swapIdx]
  db.update(categories).set({ sort: other.sort }).where(eq(categories.id, row.id)).run()
  db.update(categories).set({ sort: row.sort }).where(eq(categories.id, other.id)).run()
  revalidate()
  return { ok: true }
}
