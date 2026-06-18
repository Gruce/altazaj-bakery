'use client'

import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useMenuData } from '@/components/providers/menu-provider'
import { prefersReducedMotion } from '@/lib/utils'
import WheatMark from './wheat-mark'

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const { brand } = useMenuData()
  const [done, setDone] = useState(false)

  useEffect(() => {
    const ms = prefersReducedMotion() ? 200 : 900
    const timer = setTimeout(() => setDone(true), ms)
    return () => clearTimeout(timer)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-cream-100"
      initial={{ opacity: 1 }}
      animate={done ? { opacity: 0 } : {}}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      onAnimationComplete={() => done && onComplete()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <WheatMark className="h-16 w-auto text-gold-500" title={brand.ar.name} />
      </motion.div>
    </motion.div>
  )
}
