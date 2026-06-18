import { AnimatePresence, motion } from 'motion/react'
import { X } from 'lucide-react'
import { brand, categories, type MenuItem } from '../data/menu'
import { useApp } from '../context/AppContext'
import { formatPrice, img } from '../lib/utils'
import { useDialog } from '../lib/useDialog'

interface Props {
  item: MenuItem | null
  onClose: () => void
}

export default function ItemDetail({ item, onClose }: Props) {
  const { lang, t } = useApp()
  const dialogRef = useDialog<HTMLDivElement>(!!item, onClose)

  const cat = item ? categories.find((c) => c.id === item.cat) : null
  const name = item ? (lang === 'ar' ? item.ar.n : item.en.n) : ''
  const desc = item ? (lang === 'ar' ? item.ar.d : item.en.d) : ''
  const ingredients = desc
    ? desc.split(/[,،]/).map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-[90] grid place-items-end overflow-y-auto bg-espresso-950/55 p-0 backdrop-blur-md sm:place-items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={name}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="relative w-full max-w-lg overflow-hidden rounded-t-[2rem] bg-cream-50 shadow-warm-lg sm:rounded-[2rem]"
          >
            {/* drag handle (mobile sheet) */}
            <div className="absolute inset-x-0 top-2.5 z-10 mx-auto h-1 w-10 rounded-full bg-cream-50/70 sm:hidden" />

            {/* image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden sm:aspect-[16/11]">
              <motion.img
                src={img(item.img, 800)}
                alt={name}
                className="h-full w-full object-cover"
                initial={{ scale: 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-espresso-950/55 to-transparent" />
              {item.feat && (
                <span className="absolute start-4 top-4 rounded-full bg-clay-500 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-cream-50 shadow-warm">
                  ★ {lang === 'ar' ? 'صنف مميّز' : 'Signature'}
                </span>
              )}
            </div>

            <button
              onClick={onClose}
              className="absolute end-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-cream-50/90 text-espresso-800 shadow-warm backdrop-blur transition-colors hover:bg-cream-50"
              aria-label={t.close}
            >
              <X className="h-5 w-5" />
            </button>

            {/* content */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="p-6"
            >
              {cat && (
                <div className="mb-2 flex items-center gap-2 font-serif text-xs uppercase tracking-[0.25em] text-espresso-500">
                  <span>{cat.emoji}</span>
                  <span>{lang === 'ar' ? cat.ar : cat.en}</span>
                </div>
              )}
              <h2 className="font-display text-3xl leading-tight text-espresso-900">{name}</h2>

              {ingredients.length > 0 && (
                <div className="mt-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-espresso-500">
                    {t.ingredients}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {ingredients.map((ing, i) => (
                      <span
                        key={i}
                        className="rounded-full border border-espresso-600/12 bg-cream-100 px-3 py-1 text-sm text-espresso-700"
                      >
                        {ing}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-end justify-between border-t border-espresso-600/10 pt-5">
                <div className="flex flex-col">
                  <span className="text-xs text-espresso-500">{t.startingAt}</span>
                  <span className="font-display text-3xl text-espresso-900">
                    {formatPrice(item.price, lang, brand.currency)}
                  </span>
                </div>
                <span className="text-xs text-espresso-500">{t.priceNote}</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
