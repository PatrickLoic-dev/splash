import type { Variants } from 'framer-motion'

/* All page transition variants use initial/animate/exit  */

export const pageFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: 'easeIn' } },
}

export const pageSlideUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
}

export const pageSlideLeft: Variants = {
  initial: { opacity: 0, x: '100%' },
  animate: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, x: '-100%', transition: { duration: 0.35, ease: 'easeIn' } },
}

export const pageScale: Variants = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.25, ease: 'easeIn' } },
}

export const pageFlip: Variants = {
  initial: { opacity: 0, rotateY: 15, transformPerspective: 1000 },
  animate: {
    opacity: 1,
    rotateY: 0,
    transformPerspective: 1000,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    rotateY: -15,
    transformPerspective: 1000,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
}

export const pageDoor: Variants = {
  initial: { scaleX: 0, originX: 0 },
  animate: { scaleX: 1, originX: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  exit: { scaleX: 0, originX: 1, transition: { duration: 0.35, ease: 'easeIn' } },
}

export const pageReveal: Variants = {
  initial: { clipPath: 'inset(0 100% 0 0)' },
  animate: {
    clipPath: 'inset(0 0% 0 0)',
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    clipPath: 'inset(0 0% 0 100%)',
    transition: { duration: 0.35, ease: 'easeIn' },
  },
}
