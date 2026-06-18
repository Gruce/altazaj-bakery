'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import ConfirmDelete from '@/components/dashboard/confirm-delete'
import { deleteAct, moveAct, saveAct } from '@/app/dashboard/_actions/acts'
import type { ActListRow } from '@/lib/dashboard-data'

interface FormState {
  id?: string
  nameAr: string
  nameEn: string
  taglineAr: string
  taglineEn: string
}
const empty = (): FormState => ({ nameAr: '', nameEn: '', taglineAr: '', taglineEn: '' })

export default function ActsClient({ acts }: { acts: ActListRow[] }) {
  const router = useRouter()
  const [, start] = useTransition()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(empty())
  const [pending, startSave] = useTransition()

  const set = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }))

  function submit() {
    if (!form.nameAr.trim()) return toast.error('Arabic name is required')
    startSave(async () => {
      try {
        await saveAct(form)
        toast.success(form.id ? 'Chapter updated' : 'Chapter added')
        setOpen(false)
        router.refresh()
      } catch {
        toast.error('Could not save chapter')
      }
    })
  }

  function move(id: string, dir: 'up' | 'down') {
    start(async () => {
      try {
        await moveAct(id, dir)
        router.refresh()
      } catch {
        toast.error('Could not reorder')
      }
    })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Chapters</h1>
          <p className="text-sm text-muted-foreground">
            The acts that group the menu (Savory, Bakery, Sweets, Drinks). Order sets their
            sequence on the menu.
          </p>
        </div>
        <Button
          onClick={() => {
            setForm(empty())
            setOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Add chapter
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {acts.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold" dir="rtl">
                    {a.nameAr}
                  </span>
                  <span className="text-sm text-muted-foreground">{a.nameEn}</span>
                  <Badge variant="secondary">{a.categoryCount} categories</Badge>
                </div>
                <div className="mt-1 text-xs text-muted-foreground" dir="rtl">
                  {a.taglineAr || '—'}
                </div>
                <div className="text-xs text-muted-foreground">{a.taglineEn || '—'}</div>
              </div>
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(a.id, 'up')} aria-label="Move up">
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(a.id, 'down')} aria-label="Move down">
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setForm({ id: a.id, nameAr: a.nameAr, nameEn: a.nameEn, taglineAr: a.taglineAr, taglineEn: a.taglineEn })
                    setOpen(true)
                  }}
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmDelete
                  title={`Delete "${a.nameEn || a.nameAr}"?`}
                  description="Its categories become unassigned (not deleted)."
                  onConfirm={() => deleteAct(a.id)}
                  trigger={
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" aria-label="Delete">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{form.id ? 'Edit chapter' : 'New chapter'}</DialogTitle>
            <DialogDescription>A chapter groups categories on the menu.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="anameAr">Name (Arabic)</Label>
                <Input id="anameAr" dir="rtl" value={form.nameAr} onChange={(e) => set({ nameAr: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="anameEn">Name (English)</Label>
                <Input id="anameEn" value={form.nameEn} onChange={(e) => set({ nameEn: e.target.value })} />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ataglineAr">Tagline (Arabic)</Label>
              <Input id="ataglineAr" dir="rtl" value={form.taglineAr} onChange={(e) => set({ taglineAr: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="ataglineEn">Tagline (English)</Label>
              <Input id="ataglineEn" value={form.taglineEn} onChange={(e) => set({ taglineEn: e.target.value })} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {form.id ? 'Save' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
