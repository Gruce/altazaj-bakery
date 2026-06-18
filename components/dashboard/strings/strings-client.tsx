'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { saveStrings } from '@/app/dashboard/_actions/strings'
import type { StringListRow } from '@/lib/dashboard-data'

export default function StringsClient({ rows }: { rows: StringListRow[] }) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [data, setData] = useState(rows)
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return data
    return data.filter(
      (r) =>
        r.label.toLowerCase().includes(query) ||
        r.key.toLowerCase().includes(query) ||
        r.ar.includes(q) ||
        r.en.toLowerCase().includes(query),
    )
  }, [data, q])

  function update(key: string, lang: 'ar' | 'en', value: string) {
    setData((d) => d.map((r) => (r.key === key ? { ...r, [lang]: value } : r)))
  }

  function save() {
    start(async () => {
      try {
        await saveStrings({ strings: data.map(({ key, ar, en }) => ({ key, ar, en })) })
        toast.success('UI strings saved')
        router.refresh()
      } catch {
        toast.error('Could not save')
      }
    })
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">UI Strings</h1>
          <p className="text-sm text-muted-foreground">
            Every label and button text on the menu, in both languages.
          </p>
        </div>
        <Button onClick={save} disabled={pending}>
          {pending && <Loader2 className="h-4 w-4 animate-spin" />}
          Save all
        </Button>
      </div>

      <div className="relative mb-4 max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter strings…"
          className="pl-8"
        />
      </div>

      <div className="overflow-hidden rounded-lg border">
        <div className="grid grid-cols-[minmax(140px,1fr)_1.4fr_1.4fr] gap-px bg-border text-sm">
          <div className="bg-muted px-3 py-2 font-medium">Label</div>
          <div className="bg-muted px-3 py-2 font-medium">Arabic</div>
          <div className="bg-muted px-3 py-2 font-medium">English</div>
          {filtered.map((r) => (
            <div key={r.key} className="contents">
              <div className="flex items-center bg-background px-3 py-2 text-xs text-muted-foreground">
                {r.label}
              </div>
              <div className="bg-background p-1.5">
                <Input
                  dir="rtl"
                  value={r.ar}
                  onChange={(e) => update(r.key, 'ar', e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="bg-background p-1.5">
                <Input
                  value={r.en}
                  onChange={(e) => update(r.key, 'en', e.target.value)}
                  className="h-9"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
