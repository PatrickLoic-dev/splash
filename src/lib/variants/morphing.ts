import type { Variants } from 'framer-motion'

export const morphIn: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
  },
}

export const morphScale: Variants = {
  hidden: { scale: 0, opacity: 0, rotate: -45 },
  visible: {
    scale: 1,
    opacity: 1,
    rotate: 0,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
}

export const morphPulse: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 1.08, 0.96, 1.03, 1],
    transition: { duration: 0.8, ease: 'easeInOut', times: [0, 0.3, 0.6, 0.8, 1] },
  },
}

export const morphRotate: Variants = {
  hidden: { rotate: 0, opacity: 0 },
  visible: {
    rotate: 360,
    opacity: 1,
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}

export const clipReveal: Variants = {
  hidden: { clipPath: 'inset(0 100% 0 0)', opacity: 1 },
  visible: {
    clipPath: 'inset(0 0% 0 0)',
    opacity: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}
