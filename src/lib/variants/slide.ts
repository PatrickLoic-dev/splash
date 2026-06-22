import type { Variants } from 'framer-motion'

const ease = [0.22, 1, 0.36, 1]

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: 'easeIn' } },
}

export const slideDown: Variants = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease } },
  exit: { opacity: 0, y: 20, transition: { duration: 0.3, ease: 'easeIn' } },
}

export const slideLeft: Variants = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.3, ease: 'easeIn' } },
}

export const slideRight: Variants = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.55, ease } },
  exit: { opacity: 0, x: 30, transition: { duration: 0.3, ease: 'easeIn' } },
}
