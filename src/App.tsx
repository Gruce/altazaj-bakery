import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { itemsByCat, orderedCategories, type MenuItem } from './data/menu'
import { useApp } from './context/AppContext'
import { useScrollSpy } from './lib/useScrollSpy'
import Loader from './components/Loader'
import TopBar from './components/TopBar'
import Hero from './components/Hero'
import FeaturedStrip from './components/FeaturedStrip'
import MenuSection from './components/MenuSection'
import ItemDetail from './components/ItemDetail'
import SearchOverlay from './components/SearchOverlay'
import Footer from './components/Footer'

const HEADER_OFFSET = 130

export default function App() {
  const { t } = useApp()
  const [loading, setLoading] = useState(() => {
    try {
      return !sessionStorage.getItem('altazaj_seen')
    } catch {
      return true
    }
  })
  const [selected, setSelected] = useState<MenuItem | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)

  const finishLoading = useCallback(() => {
    try {
      sessionStorage.setItem('altazaj_seen', '1')
    } catch {
      /* ignore */
    }
    setLoading(false)
  }, [])

  const ids = useMemo(() => orderedCategories.map((c) => c.id), [])
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
