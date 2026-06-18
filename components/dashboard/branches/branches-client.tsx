'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, Clock, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
import { deleteBranch, moveBranch, saveBranch } from '@/app/dashboard/_actions/branches'
import type { BranchRow } from '@/db/schema'

interface FormState {
  id?: number
  nameAr: string
  nameEn: string
  hoursAr: string
  hoursEn: string
  isNew: boolean
}
const empty = (): FormState => ({ nameAr: '', nameEn: '', hoursAr: '', hoursEn: '', isNew: false })

export default function BranchesClient({ branches }: { branches: BranchRow[] }) {
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
        await saveBranch(form)
        toast.success(form.id != null ? 'Branch updated' : 'Branch added')
        setOpen(false)
        router.refresh()
      } catch {
        toast.error('Could not save branch')
      }
    })
  }

  function move(id: number, dir: 'up' | 'down') {
    start(async () => {
      try {
        await moveBranch(id, dir)
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
          <h1 className="text-2xl font-semibold tracking-tight">Branches</h1>
          <p className="text-sm text-muted-foreground">
            Locations shown in the hero and footer.
          </p>
        </div>
        <Button
          onClick={() => {
            setForm(empty())
            setOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Add branch
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {branches.map((b) => (
          <Card key={b.id}>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold" dir="rtl">
                    {b.nameAr}
                  </span>
                  <span className="text-sm text-muted-foreground">{b.nameEn}</span>
                  {b.isNew && <Badge>New</Badge>}
                </div>
                <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground" dir="rtl">
                  <Clock className="h-3 w-3" /> {b.hoursAr || '—'}
                </div>
              </div>
              <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(b.id, 'up')} aria-label="Move up">
                  <ChevronUp className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(b.id, 'down')} aria-label="Move down">
                  <ChevronDown className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => {
                    setForm({ id: b.id, nameAr: b.nameAr, nameEn: b.nameEn, hoursAr: b.hoursAr, hoursEn: b.hoursEn, isNew: b.isNew })
                    setOpen(true)
                  }}
                  aria-label="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <ConfirmDelete
                  title={`Delete "${b.nameEn || b.nameAr}"?`}
                  onConfirm={() => deleteBranch(b.id)}
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
            <DialogTitle>{form.id != null ? 'Edit branch' : 'New branch'}</DialogTitle>
            <DialogDescription>Name and opening hours, in both languages.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="bnameAr">Name (Arabic)</Label>
                <Input id="bnameAr" dir="rtl" value={form.nameAr} onChange={(e) => set({ nameAr: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="bnameEn">Name (English)</Label>
                <Input id="bnameEn" value={form.nameEn} onChange={(e) => set({ nameEn: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="bhoursAr">Hours (Arabic)</Label>
                <Input id="bhoursAr" dir="rtl" value={form.hoursAr} onChange={(e) => set({ hoursAr: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="bhoursEn">Hours (English)</Label>
                <Input id="bhoursEn" value={form.hoursEn} onChange={(e) => set({ hoursEn: e.target.value })} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.isNew} onCheckedChange={(v) => set({ isNew: v })} />
              Show a “New” badge
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={pending}>
              Cancel
            </Button>
            <Button onClick={submit} disabled={pending}>
              {pending && <Loader2 className="h-4 w-4 animate-spin" />}
              {form.id != null ? 'Save' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
