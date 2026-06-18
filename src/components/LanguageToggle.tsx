import { motion } from 'motion/react'
import { useApp } from '../context/AppContext'
import { cx } from '../lib/utils'

export default function LanguageToggle({
  compact = false,
  onHero = false,
}: {
  compact?: boolean
  onHero?: boolean
}) {
  const { lang, setLang } = useApp()
  const options: { id: 'ar' | 'en'; label: string }[] = [
    { id: 'ar', label: 'ع' },
    { id: 'en', label: 'EN' },
  ]

  return (
    <div
      dir="ltr"
      className={cx(
        'relative flex items-center rounded-full border p-1 shadow-warm backdrop-blur',
        compact ? 'gap-0.5' : 'gap-1',
        onHero ? 'border-white/30 bg-white/15' : 'border-espresso-600/15 bg-cream-50/80',
      )}
    >
      {options.map((opt) => {
        const active = lang === opt.id
        return (
          <button
            key={opt.id}
            onClick={() => setLang(opt.id)}
            className={cx(
              'relative z-10 rounded-full px-3 py-1 text-sm font-semibold transition-colors duration-300',
              active
                ? onHero
                  ? 'text-gold-600'
                  : 'text-cream-50'
                : onHero
                  ? 'text-white/75 hover:text-white'
                  : 'text-espresso-600/70 hover:text-espresso-800',
            )}
            aria-pressed={active}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                className={cx('absolute inset-0 -z-10 rounded-full', onHero ? 'bg-white' : 'bg-espresso-700')}
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
