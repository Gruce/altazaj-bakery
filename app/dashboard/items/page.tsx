import { categoryOptions, listItems } from '@/lib/dashboard-data'
import ItemsClient from '@/components/dashboard/items/items-client'

export const dynamic = 'force-dynamic'

export default async function ItemsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>
}) {
  const { filter } = await searchParams
  const initialFilter =
    filter === 'featured' || filter === 'hidden' ? filter : 'all'

  return (
    <ItemsClient
      items={listItems()}
      categories={categoryOptions()}
      initialFilter={initialFilter}
    />
  )
}
