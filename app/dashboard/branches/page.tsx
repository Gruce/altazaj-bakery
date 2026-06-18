import { listBranches } from '@/lib/dashboard-data'
import BranchesClient from '@/components/dashboard/branches/branches-client'

export const dynamic = 'force-dynamic'

export default async function BranchesPage() {
  return <BranchesClient branches={listBranches()} />
}
