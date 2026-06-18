import { NextResponse, type NextRequest } from 'next/server'
import { COOKIE_NAME, verifyToken } from '@/lib/auth'

export async function proxy(req: NextRequest) {
  const session = await verifyToken(req.cookies.get(COOKIE_NAME)?.value)
  if (session) return NextResponse.next()

  // Upload API → 401 JSON; dashboard pages → redirect to login.
  if (req.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = req.nextUrl.clone()
  url.pathname = '/login'
  url.searchParams.set('next', req.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/api/upload/:path*'],
}
