import { motion } from 'motion/react'
import { brand, featured, type MenuItem } from '../data/menu'
import { useApp } from '../context/AppContext'
import { formatPrice } from '../lib/utils'
import SmartImage from './SmartImage'

export default function FeaturedStrip({ onOpen }: { onOpen: (item: MenuItem) => void }) {
  const { lang, t } = useApp()
  if (!featured.length) return null

  return (
    <section className="relative py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mb-6 max-w-6xl px-4 sm:px-6"
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gold-500" />
          <span className="font-serif text-xs uppercase tracking-[0.3em] text-espresso-500">
            {t.signaturesSub}
          </span>
        </div>
        <h2 className="mt-1.5 font-display text-4xl text-espresso-900 sm:text-5xl">{t.signatures}</h2>
      </motion.div>

      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-12 bg-gradient-to-l from-cream-100 to-transparent rtl:bg-gradient-to-r" />
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:px-6">
          {/* leading spacer to align with max-w container on large screens */}
          <div className="hidden shrink-0 lg:block lg:w-[calc((100vw-72rem)/2)]" aria-hidden />
          {featured.map((item, i) => {
            const name = lang === 'ar' ? item.ar.n : item.en.n
            return (
              <motion.button
                key={item.id}
                onClick={() => onOpen(item)}
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: Math.min(i * 0.06, 0.5) }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.97 }}
                className="group relative w-60 shrink-0 snap-start overflow-hidden rounded-[1.75rem] text-start shadow-warm-lg sm:w-64"
              >
                <SmartImage
                  src={item.img}
                  alt={name}
                  width={420}
                  className="aspect-[3/4] w-full"
                  imgClassName="transition-transform duration-[800ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-espresso-950/85 via-espresso-950/15 to-transparent" />
                <span className="absolute start-4 top-4 rounded-full bg-gold-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-warm">
                  ★ {lang === 'ar' ? 'مميّز' : 'Signature'}
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4 text-cream-50">
                  <h3 className="line-clamp-1 text-lg font-bold drop-shadow">{name}</h3>
                  <p className="mt-1 inline-block rounded-full bg-cream-50/15 px-2.5 py-0.5 text-sm font-semibold backdrop-blur">
                    {formatPrice(item.price, lang, brand.currency)}
                  </p>
                </div>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
