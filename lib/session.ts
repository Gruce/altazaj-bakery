import 'server-only'
import { cookies } from 'next/headers'
import {
  COOKIE_NAME,
  SESSION_MAX_AGE,
  signSession,
  verifyToken,
  type Session,
} from '@/lib/auth'

export async function createSession(): Promise<void> {
  const token = await signSession()
  const jar = await cookies()
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function destroySession(): Promise<void> {
  const jar = await cookies()
  jar.delete(COOKIE_NAME)
}

export async function getSession(): Promise<Session | null> {
  const jar = await cookies()
  return verifyToken(jar.get(COOKIE_NAME)?.value)
}

/** Guard for server actions / route handlers — throws if not authenticated. */
export async function requireSession(): Promise<Session> {
  const session = await getSession()
  if (!session) throw new Error('Unauthorized')
  return session
}
