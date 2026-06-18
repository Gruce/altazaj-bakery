import { listStrings } from '@/lib/dashboard-data'
import StringsClient from '@/components/dashboard/strings/strings-client'

export const dynamic = 'force-dynamic'

export default async function StringsPage() {
  return <StringsClient rows={listStrings()} />
}
