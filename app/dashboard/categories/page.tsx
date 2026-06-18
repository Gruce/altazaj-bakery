import { actOptions, listCategories } from '@/lib/dashboard-data'
import CategoriesClient from '@/components/dashboard/categories/categories-client'

export const dynamic = 'force-dynamic'

export default async function CategoriesPage() {
  return <CategoriesClient categories={listCategories()} acts={actOptions()} />
}
