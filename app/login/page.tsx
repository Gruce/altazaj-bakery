import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import LoginForm from './login-form'

export const dynamic = 'force-dynamic'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams
  const session = await getSession()
  if (session) redirect(next || '/dashboard')

  return (
    <div dir="ltr" lang="en">
      <LoginForm next={next ?? '/dashboard'} />
    </div>
  )
}
