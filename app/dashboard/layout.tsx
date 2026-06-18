import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import DashboardShell from '@/components/dashboard/dashboard-shell'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) redirect('/login?next=/dashboard')

  return (
    <div dir="ltr" lang="en">
      <DashboardShell>{children}</DashboardShell>
    </div>
  )
}
