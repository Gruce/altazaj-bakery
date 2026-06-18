import { getBrandRow } from '@/lib/dashboard-data'
import BrandForm from '@/components/dashboard/brand/brand-form'

export const dynamic = 'force-dynamic'

export default async function BrandPage() {
  return <BrandForm brand={getBrandRow()} />
}
