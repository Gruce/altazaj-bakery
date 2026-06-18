import { listActs } from '@/lib/dashboard-data'
import ActsClient from '@/components/dashboard/acts/acts-client'

export const dynamic = 'force-dynamic'

export default async function ActsPage() {
  return <ActsClient acts={listActs()} />
}
