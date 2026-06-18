'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react'
import { Search } from 'lucide-react'
import { useMenuData } from '@/components/providers/menu-provider'
import { useApp } from '@/components/providers/app-provider'
import { cx } from '@/lib/utils'
import LanguageToggle from './language-toggle'
import CategoryNav from './category-nav'
import WheatMark from './wheat-mark'

interface Props {
  active: string
  onSelectCategory: (id: string) => void
  onOpenSearch: () => void
}

export default function TopBar({ active, onSelectCategory, onOpenSearch }: Props) {
  const { brand } = useMenuData()
  const { lang, t } = useApp()
  const { scrollY, scrollYProgress } = useScroll()
  const [scrolled, setScrolled] = useState(false)
  const [inMenu, setInMenu] = useState(false)

  useMotionValueEvent(scrollY, 'change', (v) => {
    setScrolled(v > 24)
    const menu = document.getElementById('menu')
    setInMenu(menu ? menu.getBoundingClientRect().top <= 120 : false)
  })

  // over the red hero (top, not scrolled) → light content; over the menu → dark
  const onHero = false

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className={cx('transition-all duration-500', scrolled ? 'glass-strong shadow-warm' : 'bg-transparent')}>
        {/* row 1 — brand + actions */}
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5"
            aria-label={brand[lang].name}
          >
            <span
              className={cx(
                'grid h-9 w-9 place-items-center rounded-lg shadow-warm transition-colors',
                onHero ? 'bg-white/20 ring-1 ring-white/40 backdrop-blur' : 'bg-gold-500',
              )}
            >
              <WheatMark className="h-5 w-auto text-white" />
            </span>
            <span className="flex flex-col items-start leading-tight">
              <span
                className={cx(
                  'font-display text-lg font-bold transition-colors',
                  onHero ? 'text-white' : 'text-espresso-900',
                )}
              >
                {brand[lang].name}
              </span>
              <span
                className={cx(
                  'hidden text-[11px] font-medium transition-colors sm:block',
                  onHero ? 'text-white/80' : 'text-espresso-500',
                )}
              >
                {brand[lang].tag}
              </span>
            </span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenSearch}
              className={cx(
                'flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium shadow-warm backdrop-blur transition-colors',
                onHero
                  ? 'border border-white/30 bg-white/15 text-white hover:bg-white/25'
                  : 'border border-espresso-600/15 bg-cream-50/80 text-espresso-700 hover:bg-cream-50',
              )}
              aria-label={t.search}
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">{t.search}</span>
            </button>
            <LanguageToggle onHero={onHero} />
          </div>
        </div>

        {/* row 2 — category pills (revealed once inside the menu) */}
        <AnimatePresence initial={false}>
          {inMenu && (
            <motion.div
              key="catnav"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-espresso-600/10"
            >
              <div className="mx-auto max-w-6xl">
                <CategoryNav active={active} onSelect={onSelectCategory} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* scroll progress */}
      <motion.div
        className="h-0.5 origin-left bg-gradient-to-r from-gold-500 via-clay-500 to-gold-600"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  )
}
