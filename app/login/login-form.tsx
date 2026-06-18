'use client'

import { useActionState } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import WheatMark from '@/components/menu/wheat-mark'
import { loginAction, type LoginState } from './actions'

export default function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  )

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-sm rounded-2xl border bg-card p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="grid h-14 w-14 place-items-center rounded-xl bg-gold-500 shadow-sm">
            <WheatMark className="h-8 w-auto text-white" />
          </span>
          <h1 className="mt-4 text-xl font-semibold">Altazaj Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to manage the menu
          </p>
        </div>

        <form action={action} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••"
              required
            />
          </div>

          {state.error && (
            <p className="text-sm font-medium text-destructive">{state.error}</p>
          )}

          <Button type="submit" disabled={pending} className="w-full">
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            Sign in
          </Button>
        </form>
      </div>
    </div>
  )
}
