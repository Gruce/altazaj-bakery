'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import ConfirmDelete from '@/components/dashboard/confirm-delete'
import {
  deleteCategory,
  moveCategory,
  saveCategory,
} from '@/app/dashboard/_actions/categories'
import type { CategoryListRow } from '@/lib/dashboard-data'

const NONE = '__none__'

interface FormState {
  id?: string
  nameAr: string
  nameEn: string
  emoji: string
  actId: string | null
}
const empty = (): FormState => ({ nameAr: '', nameEn: '', emoji: '', actId: null })

export default function CategoriesClient({
  categories,
  acts,
}: {
  categories: CategoryListRow[]
  acts: { id: string; label: string }[]
}) {
  const router = useRouter()
  const [, start] = useTransition()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<FormState>(empty())
  const [pending, startSave] = useTransition()

  function openNew() {
    setForm(empty())
    setOpen(true)
  }
  function openEdit(c: CategoryListRow) {
    setForm({ id: c.id, nameAr: c.nameAr, nameEn: c.nameEn, emoji: c.emoji, actId: c.actId })
    setOpen(true)
  }
  const set = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }))

  function submit() {
    if (!form.nameAr.trim()) return toast.error('Arabic name is required')
    startSave(async () => {
      try {
        await saveCategory(form)
        toast.success(form.id ? 'Category updated' : 'Category added')
        setOpen(false)
        router.refresh()
      } catch {
        toast.error('Could not save category')
      }
    })
  }

  function move(id: string, dir: 'up' | 'down') {
    start(async () => {
      try {
        await moveCategory(id, dir)
        router.refresh()
      } catch {
        toast.error('Could not reorder')
      }
    })
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
          <p className="text-sm text-muted-foreground">
            {categories.length} categories. Order within each chapter sets the menu layout.
          </p>
        </div>
        <Button onClick={openNew}>
          <Plus className="h-4 w-4" />
          Add category
        </Button>
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">Emoji</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Chapter</TableHead>
                <TableHead className="text-right">Items</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-xl">{c.emoji}</TableCell>
                  <TableCell>
                    <div className="font-medium" dir="rtl">
                      {c.nameAr}
                    </div>
                    <div className="text-xs text-muted-foreground">{c.nameEn || '—'}</div>
                  </TableCell>
                  <TableCell>
                    {c.actName ? (
                      <Badge variant="secondary">{c.actName}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">{c.itemCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-0.5">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(c.id, 'up')} aria-label="Move up">
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => move(c.id, 'down')} aria-label="Move down">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(c)} aria-label="Edit">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <ConfirmDelete
                        title={`Delete "${c.nameAr}"?`}
                        description={`This also deletes its ${c.itemCount} item(s). This cannot be undone.`}
                        onConfirm={() => deleteCategory(c.id)}
                        trigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" aria-label="Delete">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        }
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{form.id ? 'Edit category' : 'New category'}</DialogTitle>
            <DialogDescription>Categories group items within a chapter.</DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-[1fr_80px] gap-3">
              <div className="flex flex-col gap-2">
                <Label htmlFor="cnameAr">Name (Arabic)</Label>
                <Input id="cnameAr" dir="rtl" value={form.nameAr} onChange={(e) => set({ nameAr: e.target.value })} />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="cemoji">Emoji</Label>
                <Input id="cemoji" value={form.emoji} onChange={(e) => set({ emoji: e.target.value })} className="text-center" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cnameEn">Name (English)</Label>
              <Input id="cnameEn" value={form.nameEn} onChange={(e) => set({ nameEn: e.target.value })} />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Chapter</Label>
              <Select
                value={form.actId ?? NONE}
                onValueChange={(v) => set({ actId: v === NONE ? null : v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Unassigned</SelectItem>
                  {acts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
