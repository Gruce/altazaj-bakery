'use client'

import { motion } from 'motion/react'
import { ArrowDown, MapPin } from 'lucide-react'
import { useMenuData } from '@/components/providers/menu-provider'
import { useApp } from '@/components/providers/app-provider'
import WheatMark from './wheat-mark'

const EASE = [0.22, 1, 0.36, 1] as const

export default function Hero({ ready = true }: { ready?: boolean }) {
  const { brand, branches } = useMenuData()
  const { lang, t } = useApp()
  const newTag = lang === 'ar' ? 'جديد' : 'New'

  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-6 py-28 text-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: EASE }}
        className="flex w-full max-w-md flex-col items-center"
      >
        <WheatMark className="h-20 w-auto text-gold-500 sm:h-24" title={brand[lang].name} />

        <h1 className="mt-8 font-display text-6xl font-bold leading-[1.05] text-espresso-900 sm:text-7xl">
          {brand[lang].name}
        </h1>

        <p className="mt-5 text-base text-espresso-500 sm:text-lg">{brand[lang].tag}</p>

        {/* both branches */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
          {branches.map((b, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 rounded-full border border-espresso-900/10 bg-cream-50 px-3.5 py-1.5 text-[13px] text-espresso-700 shadow-warm"
            >
              <MapPin className="h-3.5 w-3.5 text-gold-500" />
              {lang === 'ar' ? b.ar : b.en}
              {b.isNew && (
                <span className="rounded-full bg-gold-500 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                  {newTag}
                </span>
              )}
            </span>
          ))}
        </div>

        <button
          onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-9 inline-flex items-center gap-2.5 rounded-full bg-espresso-900 px-8 py-4 text-sm font-bold text-white transition-colors hover:bg-espresso-800"
        >
          {t.exploreMenu}
          <ArrowDown className="h-4 w-4" />
        </button>
      </motion.div>
    </section>
  )
}
