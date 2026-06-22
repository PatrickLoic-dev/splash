'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'

interface PageTransitionWrapperProps {
  children: React.ReactNode
  variants?: Variants
  motionKey: string
}

export function PageTransitionWrapper({
  children,
  variants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.25, ease: 'easeIn' } },
  },
  motionKey,
}: PageTransitionWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={motionKey}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        style={{ width: '100%' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/* Curtain overlay — wipes across the screen between routes */
export function CurtainTransition({ isVisible }: { isVisible: boolean }) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scaleX: 0, originX: '0%' }}
          animate={{ scaleX: 1, originX: '0%', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
          exit={{ scaleX: 0, originX: '100%', transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1], delay: 0.05 } }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--accent)',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      )}
    </AnimatePresence>
  )
}
