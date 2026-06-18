'use client'

import { MotionConfig } from 'motion/react'
import { AppProvider } from '@/components/providers/app-provider'
import { MenuProvider } from '@/components/providers/menu-provider'
import type { Lang, MenuPayload } from '@/lib/types'
import type { Strings } from '@/lib/i18n'
import MenuApp from './menu-app'

export default function MenuRoot({
  menu,
  strings,
}: {
  menu: MenuPayload
  strings: Record<Lang, Strings>
}) {
  return (
    // reducedMotion="user" makes every motion component honor prefers-reduced-motion
    <MotionConfig reducedMotion="user">
      <AppProvider strings={strings}>
        <MenuProvider value={menu}>
          <MenuApp />
        </MenuProvider>
      </AppProvider>
    </MotionConfig>
  )
}
