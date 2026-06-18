'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, ChevronUp, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
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
import ItemDialog from './item-dialog'
import { deleteItem, moveItem, setItemFlag } from '@/app/dashboard/_actions/items'
import { formatNum, img } from '@/lib/utils'
import type { ItemListRow } from '@/lib/dashboard-data'

type StatusFilter = 'all' | 'featured' | 'hidden'

export default function ItemsClient({
  items,
  categories,
  initialFilter = 'all',
}: {
  items: ItemListRow[]
  categories: { id: string; label: string }[]
  initialFilter?: StatusFilter
}) {
  const router = useRouter()
  const [, start] = useTransition()
  const [rows, setRows] = useState(items)
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<string>('all')
  const [status, setStatus] = useState<StatusFilter>(initialFilter)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ItemListRow | null>(null)

  useEffect(() => setRows(items), [items])

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    return rows.filter((r) => {
      if (cat !== 'all' && r.categoryId !== cat) return false
      if (status === 'featured' && !r.featured) return false
      if (status === 'hidden' && r.available) return false
      if (query && !`${r.nameAr} ${r.nameEn} ${r.categoryName}`.toLowerCase().includes(query))
        return false
      return true
    })
  }, [rows, q, cat, status])

  function optimisticFlag(id: string, field: 'featured' | 'available', value: boolean) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: value } : r)))
    start(async () => {
      try {
        await setItemFlag(id, field, value)
        router.refresh()
      } catch {
        toast.error('Could not update')
        router.refresh()
      }
    })
  }

  function handleMove(id: string, dir: 'up' | 'down') {
    start(async () => {
      try {
        await moveItem(id, dir)
        router.refresh()
      } catch {
        toast.error('Could not reorder')
      }
    })
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Items</h1>
          <p className="text-sm text-muted-foreground">
            {formatNum(rows.length, 'en')} items · {formatNum(filtered.length, 'en')} shown
          </p>
        </div>
        <Button
          onClick={() => {
            setEditing(null)
            setDialogOpen(true)
          }}
        >
          <Plus className="h-4 w-4" />
          Add item
        </Button>
      </div>

      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or category…"
            className="pl-8"
          />
        </div>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="sm:w-56">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as StatusFilter)}>
          <SelectTrigger className="sm:w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="hidden">Hidden</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Featured</TableHead>
                <TableHead className="text-center">Available</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                    No items match.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((it) => (
                  <TableRow key={it.id} className={it.available ? '' : 'opacity-55'}>
                    <TableCell>
                      <div className="h-10 w-10 overflow-hidden rounded-md bg-muted">
                        {it.img && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={img(it.img, 80)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium" dir="rtl">
                        {it.nameAr}
                      </div>
                      <div className="text-xs text-muted-foreground">{it.nameEn || '—'}</div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {it.emoji} {it.categoryName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right tabular-nums">
                      {formatNum(it.price, 'en')}
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={it.featured}
                        onCheckedChange={(v) => optimisticFlag(it.id, 'featured', v)}
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Switch
                        checked={it.available}
                        onCheckedChange={(v) => optimisticFlag(it.id, 'available', v)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-0.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMove(it.id, 'up')}
                          aria-label="Move up"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMove(it.id, 'down')}
                          aria-label="Move down"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditing(it)
                            setDialogOpen(true)
                          }}
                          aria-label="Edit"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <ConfirmDelete
                          title={`Delete "${it.nameAr}"?`}
                          description="This permanently removes the item from the menu."
                          onConfirm={() => deleteItem(it.id)}
                          trigger={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              aria-label="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ItemDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        item={editing}
        categories={categories}
        defaultCategoryId={cat !== 'all' ? cat : ''}
      />
    </div>
  )
}
