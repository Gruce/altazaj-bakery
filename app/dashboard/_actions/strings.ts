'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/db'
import { uiStrings } from '@/db/schema'
import { stringsSchema } from '@/lib/validators'
import { requireSession } from '@/lib/session'

export async function saveStrings(input: unknown) {
  await requireSession()
  const { strings } = stringsSchema.parse(input)

  for (const s of strings) {
    db.insert(uiStrings)
      .values({ key: s.key, ar: s.ar, en: s.en })
      .onConflictDoUpdate({ target: uiStrings.key, set: { ar: s.ar, en: s.en } })
      .run()
  }

  revalidatePath('/dashboard/strings')
  revalidatePath('/')
  return { ok: true }
}
