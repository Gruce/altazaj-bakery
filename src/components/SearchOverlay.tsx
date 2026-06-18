import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Search, X } from 'lucide-react'
import { items as allItems, brand, categories, type MenuItem } from '../data/menu'
import { useApp } from '../context/AppContext'
import { useDialog } from '../lib/useDialog'
import { cx, formatNum, formatPrice, img, searchItems } from '../lib/utils'

interface Props {
  open: boolean
  onClose: () => void
  onPick: (item: MenuItem) => void
}

const catName = (lang: 'ar' | 'en', id: string) => {
  const c = categories.find((x) => x.id === id)
  return c ? (lang === 'ar' ? c.ar : c.en) : ''
}

export default function SearchOverlay({ open, onClose, onPick }: Props) {
  const { lang, dir, t } = useApp()
  const [q, setQ] = useState('')
  const dialogRef = useDialog<HTMLDivElement>(open, onClose)

  const results = useMemo(() => searchItems(q, allItems).slice(0, 40), [q])

  // clear the query when the overlay closes
  useEffect(() => {
    if (!open) setQ('')
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.search}
          className="fixed inset-0 z-[80] flex flex-col bg-cream-100/95 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="mx-auto flex h-full w-full max-w-3xl flex-col px-4 sm:px-6">
            {/* search bar */}
            <motion.div
              initial={{ y: -24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 pt-6"
            >
              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-espresso-600/15 bg-cream-50 px-4 py-3.5 shadow-warm">
                <Search className="h-5 w-5 shrink-0 text-espresso-500" />
                <input
                  value={q}
                  dir={dir}
                  type="search"
                  enterKeyHint="search"
                  aria-label={t.search}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-transparent text-base text-espresso-900 outline-none placeholder:text-espresso-500"
                />
                {q && (
                  <button
                    onClick={() => setQ('')}
                    aria-label={t.clear}
                    className="text-espresso-500 hover:text-espresso-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <button
                onClick={onClose}
                className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-espresso-800 text-cream-50 shadow-warm transition-colors hover:bg-espresso-900"
                aria-label={t.close}
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>

            {/* result meta */}
            <div className="px-1 pb-2 pt-4 text-sm text-espresso-500">
              {q
                ? `${formatNum(results.length, lang)} ${t.results}`
                : t.searchHint}
            </div>

            {/* results */}
            <div className="no-scrollbar -mx-1 flex-1 overflow-y-auto px-1 pb-10">
              {q && results.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
                  <span className="text-5xl">🥐</span>
                  <p className="text-lg font-semibold text-espresso-800">{t.noResults}</p>
                  <p className="text-sm text-espresso-500">{t.noResultsSub}</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {results.map((it, i) => (
                    <motion.li
                      key={it.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(i * 0.025, 0.4), duration: 0.3 }}
                    >
                      <button
                        onClick={() => onPick(it)}
                        className={cx(
                          'group flex w-full items-center gap-3 rounded-2xl border border-transparent bg-cream-50/70 p-2 text-start transition-all',
                          'hover:border-gold-500/30 hover:bg-cream-50 hover:shadow-warm',
                        )}
                      >
                        <img
                          src={img(it.img, 120)}
                          alt=""
                          loading="lazy"
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-espresso-900">
                            {lang === 'ar' ? it.ar.n : it.en.n}
                          </p>
                          <p className="truncate text-xs text-espresso-500">
                            {catName(lang, it.cat)}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-espresso-800/5 px-3 py-1 text-sm font-semibold text-espresso-800">
                          {formatPrice(it.price, lang, brand.currency)}
                        </span>
                      </button>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
