'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/db'
import { brand } from '@/db/schema'
import { brandSchema } from '@/lib/validators'
import { requireSession } from '@/lib/session'

export async function saveBrand(input: unknown) {
  await requireSession()
  const data = brandSchema.parse(input)
  const existing = db.select({ id: brand.id }).from(brand).limit(1).get()

  if (existing) {
    db.update(brand).set(data).where(eq(brand.id, existing.id)).run()
  } else {
    db.insert(brand).values({ id: 1, ...data }).run()
  }

  revalidatePath('/dashboard/brand')
  revalidatePath('/')
  return { ok: true }
}
