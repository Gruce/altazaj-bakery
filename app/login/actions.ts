'use server'

import { redirect } from 'next/navigation'
import { verifyPassword } from '@/lib/auth'
import { createSession, destroySession } from '@/lib/session'

export interface LoginState {
  error?: string
}

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '/dashboard')

  if (!verifyPassword(password)) {
    return { error: 'Incorrect password. Please try again.' }
  }

  await createSession()
  redirect(next.startsWith('/') ? next : '/dashboard')
}

export async function logoutAction(): Promise<void> {
  await destroySession()
  redirect('/login')
}
