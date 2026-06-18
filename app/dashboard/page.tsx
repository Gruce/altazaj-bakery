import Link from 'next/link'
import { count, eq } from 'drizzle-orm'
import { Croissant, EyeOff, FolderTree, MapPin, Star } from 'lucide-react'
import { db } from '@/db'
import { acts, branches, categories, items } from '@/db/schema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

function n(v: number | undefined): number {
  return v ?? 0
}

export default async function DashboardOverview() {
  const totalItems = n(db.select({ v: count() }).from(items).get()?.v)
  const featured = n(
    db.select({ v: count() }).from(items).where(eq(items.featured, true)).get()?.v,
  )
  const hidden = n(
    db.select({ v: count() }).from(items).where(eq(items.available, false)).get()?.v,
  )
  const catCount = n(db.select({ v: count() }).from(categories).get()?.v)
  const branchCount = n(db.select({ v: count() }).from(branches).get()?.v)
  const actCount = n(db.select({ v: count() }).from(acts).get()?.v)

  const stats = [
    { label: 'Menu items', value: totalItems, icon: Croissant, href: '/dashboard/items' },
    { label: 'Featured', value: featured, icon: Star, href: '/dashboard/items?filter=featured' },
    { label: 'Hidden items', value: hidden, icon: EyeOff, href: '/dashboard/items?filter=hidden' },
    { label: 'Categories', value: catCount, icon: FolderTree, href: '/dashboard/categories' },
    { label: 'Branches', value: branchCount, icon: MapPin, href: '/dashboard/branches' },
  ]

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">
          {actCount} chapters · {catCount} categories · {totalItems} items. Edits go
          live on the menu instantly.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Link key={s.label} href={s.href}>
              <Card className="transition-colors hover:border-primary/40">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {s.label}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold tabular-nums">{s.value}</div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Quick start</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <Link className="text-primary hover:underline" href="/dashboard/items">
              → Add or edit menu items, prices & photos
            </Link>
            <Link className="text-primary hover:underline" href="/dashboard/categories">
              → Manage categories, emojis & ordering
            </Link>
            <Link className="text-primary hover:underline" href="/dashboard/brand">
              → Update brand name, currency, hours & socials
            </Link>
            <a className="text-primary hover:underline" href="/" target="_blank" rel="noreferrer">
              → Open the live menu
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
