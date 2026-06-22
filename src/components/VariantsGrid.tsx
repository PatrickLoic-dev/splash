'use client'

import { VariantCard } from './VariantCard'
import { fadeIn, fadeInUp, fadeInDown, fadeCascade } from '@/lib/variants/fade'
import { slideUp, slideDown, slideLeft, slideRight } from '@/lib/variants/slide'
import { springElastic, springBouncy, springSnappy } from '@/lib/variants/spring'
import { staggerContainer, staggerItem } from '@/lib/variants/stagger'
import { motion } from 'framer-motion'

const CARDS = [
  {
    name: 'fadeIn',
    category: 'Fade',
    description: 'Simple opacity fade. The baseline of every animation.',
    variants: fadeIn,
    code: `import { fadeIn } from '@splash/variants'

<motion.div
  variants={fadeIn}
  initial="hidden"
  animate="visible"
/>`,
  },
  {
    name: 'fadeInUp',
    category: 'Fade',
    description: 'Fades in while rising 20px with a custom ease.',
    variants: fadeInUp,
    code: `import { fadeInUp } from '@splash/variants'

<motion.div
  variants={fadeInUp}
  initial="hidden"
  animate="visible"
/>`,
  },
  {
    name: 'slideUp',
    category: 'Slide',
    description: 'Slides up from 40px below with a snappy cubic ease.',
    variants: slideUp,
    code: `import { slideUp } from '@splash/variants'

<motion.div
  variants={slideUp}
  initial="hidden"
  animate="visible"
/>`,
  },
  {
    name: 'slideLeft',
    category: 'Slide',
    description: 'Enters from the right, lands in place.',
    variants: slideLeft,
    code: `import { slideLeft } from '@splash/variants'

<motion.div
  variants={slideLeft}
  initial="hidden"
  animate="visible"
/>`,
  },
  {
    name: 'springElastic',
    category: 'Spring',
    description: 'Scales in with an elastic spring — stiffness 400, damping 17.',
    variants: springElastic,
    code: `import { springElastic } from '@splash/variants'

<motion.div
  variants={springElastic}
  initial="hidden"
  animate="visible"
/>`,
  },
  {
    name: 'springBouncy',
    category: 'Spring',
    description: 'Rises with a satisfying bounce. Great for modals.',
    variants: springBouncy,
    code: `import { springBouncy } from '@splash/variants'

<motion.div
  variants={springBouncy}
  initial="hidden"
  animate="visible"
/>`,
  },
  {
    name: 'springSnappy',
    category: 'Spring',
    description: 'Ultra-fast spring — barely perceptible, yet precise.',
    variants: springSnappy,
    code: `import { springSnappy } from '@splash/variants'

<motion.div
  variants={springSnappy}
  initial="hidden"
  animate="visible"
/>`,
  },
  {
    name: 'fadeInDown',
    category: 'Fade',
    description: 'Drops in from above — ideal for dropdowns and menus.',
    variants: fadeInDown,
    code: `import { fadeInDown } from '@splash/variants'

<motion.div
  variants={fadeInDown}
  initial="hidden"
  animate="visible"
/>`,
  },
  {
    name: 'slideRight',
    category: 'Slide',
    description: 'Enters from the left — good for side panels.',
    variants: slideRight,
    code: `import { slideRight } from '@splash/variants'

<motion.div
  variants={slideRight}
  initial="hidden"
  animate="visible"
/>`,
  },
]

export function VariantsGrid() {
  return (
    <section
      id="variants"
      style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 24px 120px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 56, maxWidth: 520 }}
      >
        <p
          style={{
            fontSize: 12,
            fontFamily: 'var(--font-outfit)',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--accent-light)',
            marginBottom: 12,
          }}
        >
          Variants
        </p>
        <h2
          style={{
            fontFamily: 'var(--font-power)',
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 300,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Every variant, live.
        </h2>
        <p
          style={{
            fontFamily: 'var(--font-outfit)',
            fontSize: 16,
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
          }}
        >
          Click any card to see the code. Hit ↺ to replay.
          All variants support <code style={{ fontSize: 13, background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 4 }}>AnimatePresence</code>.
        </p>
      </motion.div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {CARDS.map((card, i) => (
          <motion.div
            key={card.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: (i % 3) * 0.06 }}
          >
            <VariantCard {...card} />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
