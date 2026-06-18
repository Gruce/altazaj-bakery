'use server'

import { revalidatePath } from 'next/cache'
import { eq, max } from 'drizzle-orm'
import { db } from '@/db'
import { acts } from '@/db/schema'
import { actSchema } from '@/lib/validators'
import { requireSession } from '@/lib/session'
import { slugify } from '@/lib/utils'

function revalidate() {
  revalidatePath('/dashboard/acts')
  revalidatePath('/dashboard/categories')
  revalidatePath('/dashboard')
  revalidatePath('/')
}

function uniqueId(base: string): string {
  const root = base || 'chapter'
  let id = root
  let i = 2
  while (db.select({ id: acts.id }).from(acts).where(eq(acts.id, id)).get()) {
    id = `${root}-${i++}`
  }
  return id
}

export async function saveAct(input: unknown) {
  await requireSession()
  const data = actSchema.parse(input)

  if (data.id) {
    db.update(acts)
      .set({
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        taglineAr: data.taglineAr,
        taglineEn: data.taglineEn,
      })
      .where(eq(acts.id, data.id))
      .run()
  } else {
    const id = uniqueId(slugify(data.nameEn || data.nameAr))
    const m = db.select({ m: max(acts.sort) }).from(acts).get()
    db.insert(acts)
      .values({
        id,
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        taglineAr: data.taglineAr,
        taglineEn: data.taglineEn,
        sort: (m?.m ?? -1) + 1,
      })
      .run()
  }

  revalidate()
  return { ok: true }
}

export async function deleteAct(id: string) {
  await requireSession()
  // categories.act_id is ON DELETE SET NULL, so categories become unassigned.
  db.delete(acts).where(eq(acts.id, id)).run()
  revalidate()
  return { ok: true }
}

export async function moveAct(id: string, dir: 'up' | 'down') {
  await requireSession()
  const rows = db.select().from(acts).all().sort((a, b) => a.sort - b.sort)
  const idx = rows.findIndex((r) => r.id === id)
  if (idx < 0) return { ok: false }
  const swapIdx = dir === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= rows.length) return { ok: true }
  const a = rows[idx]
  const b = rows[swapIdx]
  db.update(acts).set({ sort: b.sort }).where(eq(acts.id, a.id)).run()
  db.update(acts).set({ sort: a.sort }).where(eq(acts.id, b.id)).run()
  revalidate()
  return { ok: true }
}
