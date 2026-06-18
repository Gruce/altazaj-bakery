'use server'

import { revalidatePath } from 'next/cache'
import { asc, eq, max } from 'drizzle-orm'
import { db } from '@/db'
import { items } from '@/db/schema'
import { itemSchema } from '@/lib/validators'
import { requireSession } from '@/lib/session'

function revalidate() {
  revalidatePath('/dashboard/items')
  revalidatePath('/dashboard')
  revalidatePath('/')
}

export async function saveItem(input: unknown) {
  await requireSession()
  const data = itemSchema.parse(input)

  if (data.id) {
    db.update(items)
      .set({
        categoryId: data.categoryId,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        descAr: data.descAr,
        descEn: data.descEn,
        price: data.price,
        img: data.img,
        featured: data.featured,
        available: data.available,
        updatedAt: new Date(),
      })
      .where(eq(items.id, data.id))
      .run()
  } else {
    const m = db
      .select({ m: max(items.sort) })
      .from(items)
      .where(eq(items.categoryId, data.categoryId))
      .get()
    const sort = (m?.m ?? -1) + 1
    const id = `it${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`
    db.insert(items)
      .values({
        id,
        categoryId: data.categoryId,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        descAr: data.descAr,
        descEn: data.descEn,
        price: data.price,
        img: data.img,
        featured: data.featured,
        available: data.available,
        sort,
      })
      .run()
  }

  revalidate()
  return { ok: true }
}

export async function deleteItem(id: string) {
  await requireSession()
  db.delete(items).where(eq(items.id, id)).run()
  revalidate()
  return { ok: true }
}

export async function setItemFlag(
  id: string,
  field: 'featured' | 'available',
  value: boolean,
) {
  await requireSession()
  if (field === 'featured') {
    db.update(items).set({ featured: value, updatedAt: new Date() }).where(eq(items.id, id)).run()
  } else {
    db.update(items).set({ available: value, updatedAt: new Date() }).where(eq(items.id, id)).run()
  }
  revalidate()
  return { ok: true }
}

export async function moveItem(id: string, dir: 'up' | 'down') {
  await requireSession()
  const row = db.select().from(items).where(eq(items.id, id)).get()
  if (!row) return { ok: false }
  const siblings = db
    .select()
    .from(items)
    .where(eq(items.categoryId, row.categoryId))
    .orderBy(asc(items.sort))
    .all()
  const idx = siblings.findIndex((s) => s.id === id)
  const swapIdx = dir === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= siblings.length) return { ok: true }
  const other = siblings[swapIdx]
  db.update(items).set({ sort: other.sort }).where(eq(items.id, row.id)).run()
  db.update(items).set({ sort: row.sort }).where(eq(items.id, other.id)).run()
  revalidate()
  return { ok: true }
}
