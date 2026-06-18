'use server'

import { revalidatePath } from 'next/cache'
import { eq, max } from 'drizzle-orm'
import { db } from '@/db'
import { branches } from '@/db/schema'
import { branchSchema } from '@/lib/validators'
import { requireSession } from '@/lib/session'

function revalidate() {
  revalidatePath('/dashboard/branches')
  revalidatePath('/')
}

export async function saveBranch(input: unknown) {
  await requireSession()
  const data = branchSchema.parse(input)

  if (data.id != null) {
    db.update(branches)
      .set({
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        hoursAr: data.hoursAr,
        hoursEn: data.hoursEn,
        isNew: data.isNew,
      })
      .where(eq(branches.id, data.id))
      .run()
  } else {
    const m = db.select({ m: max(branches.sort) }).from(branches).get()
    db.insert(branches)
      .values({
        nameAr: data.nameAr,
        nameEn: data.nameEn,
        hoursAr: data.hoursAr,
        hoursEn: data.hoursEn,
        isNew: data.isNew,
        sort: (m?.m ?? -1) + 1,
      })
      .run()
  }

  revalidate()
  return { ok: true }
}

export async function deleteBranch(id: number) {
  await requireSession()
  db.delete(branches).where(eq(branches.id, id)).run()
  revalidate()
  return { ok: true }
}

export async function moveBranch(id: number, dir: 'up' | 'down') {
  await requireSession()
  const rows = db.select().from(branches).all().sort((a, b) => a.sort - b.sort)
  const idx = rows.findIndex((r) => r.id === id)
  if (idx < 0) return { ok: false }
  const swapIdx = dir === 'up' ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= rows.length) return { ok: true }
  const a = rows[idx]
  const b = rows[swapIdx]
  db.update(branches).set({ sort: b.sort }).where(eq(branches.id, a.id)).run()
  db.update(branches).set({ sort: a.sort }).where(eq(branches.id, b.id)).run()
  revalidate()
  return { ok: true }
}
