'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useMenuData } from '@/components/providers/menu-provider'
import { useApp } from '@/components/providers/app-provider'
import { useScrollSpy } from '@/lib/use-scroll-spy'
import type { MenuItem } from '@/lib/types'
import Loader from './loader'
import TopBar from './top-bar'
import Hero from './hero'
import FeaturedStrip from './featured-strip'
import MenuSection from './menu-section'
import ItemDetail from './item-detail'
import SearchOverlay from './search-overlay'
import Footer from './footer'

const HEADER_OFFSET = 130

export default function MenuApp() {
  const { itemsByCat, orderedCategories } = useMenuData()
  const { t } = useApp()
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<MenuItem | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  // skip the intro loader if it has already played this session
  useEffect(() => {
    try {
      if (sessionStorage.getItem('altazaj_seen')) setLoading(false)
    } catch {
      /* ignore */
    }
  }, [])

  const finishLoading = useCallback(() => {
    try {
      sessionStorage.setItem('altazaj_seen', '1')
    } catch {
      /* ignore */
    }
    setLoading(false)
  }, [])

  const ids = useMemo(() => orderedCategories.map((c) => c.id), [orderedCategories])
  const active = useScrollSpy(ids, HEADER_OFFSET)

  const scrollToCategory = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    const target = () => el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
    window.scrollTo({ top: target(), behavior: 'smooth' })
    // re-measure after lazy images settle so far jumps land accurately
    window.setTimeout(() => {
      const want = target()
      if (Math.abs(window.scrollY - want) > 6) window.scrollTo({ top: want, behavior: 'smooth' })
    }, 480)
  }, [])

  const pickFromSearch = useCallback((item: MenuItem) => {
    setSearchOpen(false)
    setSelected(item)
  }, [])

  return (
    <>
      <AnimatePresence>{loading && <Loader onComplete={finishLoading} />}</AnimatePresence>

      <TopBar
        active={active}
        onSelectCategory={scrollToCategory}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <Hero ready={!loading} />

      <div id="menu">
        <FeaturedStrip onOpen={setSelected} />

        <main className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
          {orderedCategories.map((cat) => (
            <MenuSection
              key={cat.id}
              category={cat}
              items={itemsByCat[cat.id] ?? []}
              onOpen={setSelected}
            />
          ))}
          <p className="py-8 text-center text-xs text-espresso-500">{t.priceNote}</p>
        </main>
      </div>

      <Footer />

      <ItemDetail item={selected} onClose={() => setSelected(null)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onPick={pickFromSearch} />
    </>
  )
}
