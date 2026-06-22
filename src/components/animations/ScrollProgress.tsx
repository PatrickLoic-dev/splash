'use client'

import { useScroll, useSpring, motion } from 'framer-motion'

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 56,
        left: 0,
        right: 0,
        height: 2,
        background: 'var(--accent)',
        transformOrigin: '0%',
        scaleX,
        zIndex: 100,
      }}
    />
  )
}
