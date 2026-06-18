'use client'

import { motion } from 'motion/react'
import { ArrowUp, Clock, Facebook, MapPin } from 'lucide-react'
import { useMenuData } from '@/components/providers/menu-provider'
import { useApp } from '@/components/providers/app-provider'
import { formatNum } from '@/lib/utils'
import WheatMark from './wheat-mark'

export default function Footer() {
  const { brand, branches, totalItems, categories } = useMenuData()
  const { lang, t } = useApp()

  return (
    <footer className="relative mt-12 overflow-hidden bg-espresso-950 text-cream-200">
      {/* glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[120%] -translate-x-1/2 rounded-full bg-gold-500/10 blur-[100px]" />

      <div className="relative mx-auto max-w-6xl px-6 py-16">
        <div className="flex flex-col items-center text-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid h-16 w-16 place-items-center rounded-2xl bg-gold-500 shadow-warm-lg ring-1 ring-white/15"
          >
            <WheatMark className="h-9 w-auto text-white" />
          </motion.span>
          <h2 className="mt-4 font-display text-4xl text-cream-100">{brand[lang].name}</h2>
          <p className="mt-2 font-serif text-sm uppercase tracking-[0.3em] text-gold-400">
            {brand[lang].tag}
          </p>

          <div className="my-9 h-px w-40 bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        </div>

        {/* both branches */}
        <div>
          <span className="mb-4 flex items-center justify-center gap-2 text-gold-400">
            <MapPin className="h-4 w-4" /> {t.visitUs}
          </span>
          <div className="grid gap-4 sm:grid-cols-2">
            {branches.map((b, i) => (
              <div
                key={i}
                className="rounded-2xl border border-cream-200/10 bg-cream-50/[0.03] p-5 text-center"
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="font-display text-lg font-bold text-cream-100">
                    {lang === 'ar' ? b.ar : b.en}
                  </span>
                  {b.isNew && (
                    <span className="rounded-full bg-gold-500 px-2 py-0.5 text-[10px] font-bold leading-none text-white">
                      {lang === 'ar' ? 'جديد' : 'New'}
                    </span>
                  )}
                </div>
                <p className="mt-2 flex items-center justify-center gap-1.5 text-sm text-cream-200/70">
                  <Clock className="h-3.5 w-3.5" /> {lang === 'ar' ? b.hoursAr : b.hoursEn}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-7 flex flex-col items-center gap-2">
            <span className="flex items-center gap-2 text-gold-400">
              <Facebook className="h-4 w-4" /> {t.followUs}
            </span>
            {brand.facebook && (
              <a
                href={brand.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cream-200/80 underline-offset-4 transition-colors hover:text-gold-300 hover:underline"
              >
                @altazajbakery
              </a>
            )}
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-5 border-t border-cream-200/10 pt-7 sm:flex-row sm:justify-between">
          <p className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs text-cream-200/65">
            <span>{formatNum(categories.length, lang)} {lang === 'ar' ? 'قسم' : 'categories'}</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-cream-200/30" />
            <span>{formatNum(totalItems, lang)} {lang === 'ar' ? 'صنف' : 'items'}</span>
            <span aria-hidden className="h-1 w-1 rounded-full bg-cream-200/30" />
            <span>{t.madeWith}</span>
          </p>
          <p className="text-xs text-cream-200/55">
            © 2026 {brand[lang].name} — {t.allRights}
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 rounded-full border border-cream-200/20 px-4 py-2 text-xs text-cream-200/80 transition-colors hover:border-gold-400/50 hover:text-gold-300"
          >
            {t.backToTop}
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </footer>
  )
}
