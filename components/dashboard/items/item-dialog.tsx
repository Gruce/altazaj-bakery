'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import ImagePicker from '@/components/dashboard/image-picker'
import { saveItem } from '@/app/dashboard/_actions/items'
import type { ItemListRow } from '@/lib/dashboard-data'

interface FormState {
  id?: string
  categoryId: string
  nameAr: string
  nameEn: string
  descAr: string
  descEn: string
  price: number
  img: string
  featured: boolean
  available: boolean
}

const empty = (categoryId = ''): FormState => ({
  categoryId,
  nameAr: '',
  nameEn: '',
  descAr: '',
  descEn: '',
  price: 0,
  img: '',
  featured: false,
  available: true,
})

export default function ItemDialog({
  open,
  onOpenChange,
  item,
  categories,
  defaultCategoryId = '',
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  item?: ItemListRow | null
  categories: { id: string; label: string }[]
  defaultCategoryId?: string
}) {
  const router = useRouter()
  const [pending, start] = useTransition()
  const [form, setForm] = useState<FormState>(empty(defaultCategoryId))

  useEffect(() => {
    if (!open) return
    if (item) {
      setForm({
        id: item.id,
        categoryId: item.categoryId,
        nameAr: item.nameAr,
        nameEn: item.nameEn,
        descAr: item.descAr,
        descEn: item.descEn,
        price: item.price,
        img: item.img,
        featured: item.featured,
        available: item.available,
      })
    } else {
      setForm(empty(defaultCategoryId))
    }
  }, [open, item, defaultCategoryId])

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }))

  function submit() {
    if (!form.categoryId) return toast.error('Please pick a category')
    if (!form.nameAr.trim()) return toast.error('Arabic name is required')
    start(async () => {
      try {
        await saveItem(form)
        toast.success(item ? 'Item updated' : 'Item added')
        onOpenChange(false)
        router.refresh()
      } catch {
        toast.error('Could not save the item')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit item' : 'New item'}</DialogTitle>
          <DialogDescription>
            Arabic fields show on the live menu; English fills the EN toggle.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Category</Label>
            <Select value={form.categoryId} onValueChange={(v) => set({ categoryId: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="nameAr">Name (Arabic)</Label>
              <Input
                id="nameAr"
                dir="rtl"
                value={form.nameAr}
                onChange={(e) => set({ nameAr: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="nameEn">Name (English)</Label>
              <Input
                id="nameEn"
                value={form.nameEn}
                onChange={(e) => set({ nameEn: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="descAr">Description (Arabic)</Label>
              <Textarea
                id="descAr"
                dir="rtl"
                rows={2}
                value={form.descAr}
                onChange={(e) => set({ descAr: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="descEn">Description (English)</Label>
              <Textarea
                id="descEn"
                rows={2}
                value={form.descEn}
                onChange={(e) => set({ descEn: e.target.value })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Price (IQD)</Label>
            <Input
              id="price"
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => set({ price: Number(e.target.value) })}
              className="w-40"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>Image</Label>
            <ImagePicker value={form.img} onChange={(url) => set({ img: url })} />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.featured} onCheckedChange={(v) => set({ featured: v })} />
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.available} onCheckedChange={(v) => set({ available: v })} />
              Available (shown on menu)
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={pending}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={pending}>
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {item ? 'Save changes' : 'Add item'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
