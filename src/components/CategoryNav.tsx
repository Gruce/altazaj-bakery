import { useEffect, useRef } from 'react'
import { motion } from 'motion/react'
import { orderedCategories as categories } from '../data/menu'
import { useApp } from '../context/AppContext'
import { cx } from '../lib/utils'

interface Props {
  active: string
  onSelect: (id: string) => void
}

export default function CategoryNav({ active, onSelect }: Props) {
  const { lang } = useApp()
  const scroller = useRef<HTMLDivElement>(null)

  // keep the active pill in view
  useEffect(() => {
    const el = scroller.current?.querySelector<HTMLButtonElement>(`[data-cat="${active}"]`)
    el?.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
  }, [active])

  return (
    <div className="relative">
      {/* edge fades */}
      <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-8 bg-gradient-to-r from-cream-50/90 to-transparent rtl:bg-gradient-to-l" />
      <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-8 bg-gradient-to-l from-cream-50/90 to-transparent rtl:bg-gradient-to-r" />

      <div
        ref={scroller}
        className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-2.5"
      >
        {categories.map((cat) => {
          const isActive = cat.id === active
          return (
            <button
              key={cat.id}
              data-cat={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cx(
                'relative shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300',
                isActive ? 'text-cream-50' : 'text-espresso-700 hover:bg-espresso-600/8',
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 -z-10 rounded-full bg-gold-500 shadow-warm"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="me-1.5 text-[0.95em]">{cat.emoji}</span>
              {lang === 'ar' ? cat.ar : cat.en}
            </button>
          )
        })}
      </div>
    </div>
  )
}
