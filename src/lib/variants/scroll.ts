import type { Variants } from 'framer-motion'

/* useInView-compatible variants — use with whileInView or animate={inView} */

export const scrollFadeUp: Variants = {
  offscreen: { opacity: 0, y: 48 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
}

export const scrollFadeLeft: Variants = {
  offscreen: { opacity: 0, x: -60 },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export const scrollFadeRight: Variants = {
  offscreen: { opacity: 0, x: 60 },
  onscreen: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export const scrollScale: Variants = {
  offscreen: { opacity: 0, scale: 0.85 },
  onscreen: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
}

export const scrollRotateIn: Variants = {
  offscreen: { opacity: 0, rotate: -8, y: 30 },
  onscreen: {
    opacity: 1,
    rotate: 0,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export const scrollStagger: Variants = {
  offscreen: {},
  onscreen: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

export const scrollStaggerItem: Variants = {
  offscreen: { opacity: 0, y: 24 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export const scrollFlipUp: Variants = {
  offscreen: { opacity: 0, rotateX: 60, y: 20 },
  onscreen: {
    opacity: 1,
    rotateX: 0,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}
