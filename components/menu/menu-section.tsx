'use client'

import { motion } from 'motion/react'
import { useApp } from '@/components/providers/app-provider'
import { formatNum } from '@/lib/utils'
import type { Category, MenuItem } from '@/lib/types'
import ItemCard from './item-card'

interface Props {
  category: Category
  items: MenuItem[]
  onOpen: (item: MenuItem) => void
}

export default function MenuSection({ category, items, onOpen }: Props) {
  const { lang, t } = useApp()
  const title = lang === 'ar' ? category.ar : category.en
  const sub = lang === 'ar' ? category.en : category.ar

  return (
    <section
      id={category.id}
      className="scroll-mt-32 py-10 [contain-intrinsic-size:auto_760px] [content-visibility:auto] first:pt-4"
    >
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -12% 0px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-6 flex items-end justify-between gap-4"
      >
        <div className="min-w-0">
          <div className="mb-1.5 flex items-center gap-2 font-serif text-xs uppercase tracking-[0.28em] text-espresso-500">
            <span className="text-base">{category.emoji}</span>
            <span className="truncate">{sub}</span>
            <span aria-hidden className="h-1 w-1 shrink-0 rounded-full bg-gold-500/70" />
            <span className="whitespace-nowrap text-gold-600">{formatNum(category.count, lang)} {t.items}</span>
          </div>
          <h2 className="font-display text-3xl text-espresso-900 sm:text-4xl">{title}</h2>
        </div>
        <div className="hidden h-px flex-1 translate-y-[-6px] bg-gradient-to-r from-gold-500/60 to-transparent sm:block rtl:bg-gradient-to-l" />
      </motion.header>

      <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
        {items.map((item, i) => (
          <ItemCard key={item.id} item={item} index={i} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}
