/**
 * Edge-safe auth primitives (no `next/headers` import, so this module is safe
 * to use from middleware). Cookie read/write helpers live in `lib/session.ts`.
 */
import { SignJWT, jwtVerify } from 'jose'

export const COOKIE_NAME = 'altazaj_session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days (seconds)

function getSecret(): Uint8Array {
  const s = process.env.AUTH_SECRET || 'dev-insecure-secret-change-me'
  return new TextEncoder().encode(s)
}

export interface Session {
  role: 'admin'
}

export async function signSession(): Promise<string> {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject('admin')
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret())
}

export async function verifyToken(token: string | undefined): Promise<Session | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret())
    return { role: (payload.role as 'admin') ?? 'admin' }
  } catch {
    return null
  }
}

/** Constant-ish password check against the ADMIN_PASSWORD env var. */
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || 'altazaj'
  return typeof input === 'string' && input.length > 0 && input === expected
}
