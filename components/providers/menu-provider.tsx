'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { MenuPayload } from '@/lib/types'

const MenuContext = createContext<MenuPayload | null>(null)

export function MenuProvider({
  value,
  children,
}: {
  value: MenuPayload
  children: ReactNode
}) {
  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
}

/** The full menu payload (brand, categories, items, featured, branches, …). */
export function useMenuData(): MenuPayload {
  const ctx = useContext(MenuContext)
  if (!ctx) throw new Error('useMenuData must be used within MenuProvider')
  return ctx
}
