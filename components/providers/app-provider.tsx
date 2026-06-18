'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Lang } from '@/lib/types'
import type { Strings } from '@/lib/i18n'

interface AppContextValue {
  lang: Lang
  dir: 'rtl' | 'ltr'
  t: Strings
  setLang: (l: Lang) => void
  toggleLang: () => void
}

const AppContext = createContext<AppContextValue | null>(null)

export function AppProvider({
  strings,
  children,
}: {
  strings: Record<Lang, Strings>
  children: ReactNode
}) {
  const [lang, setLangState] = useState<Lang>('ar')

  const setLang = useCallback((l: Lang) => setLangState(l), [])
  const toggleLang = useCallback(
    () => setLangState((prev) => (prev === 'ar' ? 'en' : 'ar')),
    [],
  )

  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.documentElement.dir = dir
  }, [lang])

  const value = useMemo<AppContextValue>(
    () => ({
      lang,
      dir: lang === 'ar' ? 'rtl' : 'ltr',
      t: strings[lang],
      setLang,
      toggleLang,
    }),
    [lang, strings, setLang, toggleLang],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
