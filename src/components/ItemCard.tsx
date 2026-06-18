import { motion } from 'motion/react'
import { brand, type MenuItem } from '../data/menu'
import { useApp } from '../context/AppContext'
import { formatPrice } from '../lib/utils'
import SmartImage from './SmartImage'

interface Props {
  item: MenuItem
  index: number
  onOpen: (item: MenuItem) => void
}

export default function ItemCard({ item, index, onOpen }: Props) {
  const { lang, t } = useApp()
  const name = lang === 'ar' ? item.ar.n : item.en.n
  const desc = lang === 'ar' ? item.ar.d : item.en.d

  return (
    <motion.article
      role="button"
      tabIndex={0}
      aria-label={`${name} — ${t.viewItem}`}
      onClick={() => onOpen(item)}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), onOpen(item))}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.55, delay: Math.min((index % 8) * 0.05, 0.4), ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border border-espresso-600/8 bg-cream-50 shadow-warm transition-shadow duration-300 hover:shadow-warm-lg"
    >
      <div className="relative">
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <SmartImage
            src={item.img}
            alt={name}
            width={340}
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 22vw"
            className="h-full w-full"
            imgClassName="transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.07]"
          />
        </div>

        {/* scrim */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-espresso-950/45 to-transparent" />

        {/* featured badge */}
        {item.feat && (
          <span className="absolute start-3 top-3 rounded-full bg-clay-500/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cream-50 shadow-warm backdrop-blur">
            ★ {lang === 'ar' ? 'مميّز' : 'Signature'}
          </span>
        )}

        {/* price chip */}
        <span className="absolute bottom-3 end-3 rounded-full border border-gold-400/50 bg-cream-50/95 px-3 py-1 text-sm font-bold text-espresso-900 shadow-warm backdrop-blur">
          {formatPrice(item.price, lang, brand.currency)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-3.5">
        <h3 className="line-clamp-1 font-semibold leading-snug text-espresso-900">{name}</h3>
        {desc && (
          <p className="line-clamp-2 text-[13px] leading-relaxed text-espresso-500">{desc}</p>
        )}
      </div>
    </motion.article>
  )
}
