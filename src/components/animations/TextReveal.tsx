'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

interface TextRevealProps {
  text?: string
  mode?: 'words' | 'chars' | 'lines'
  fontSize?: number
}

const wordVariants = {
  hidden: { opacity: 0, y: '100%', skewY: 4 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    skewY: 0,
    transition: {
      delay: i * 0.055,
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

const charVariants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      delay: i * 0.025,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

export function TextReveal({ text = 'Motion-first design systems', mode = 'words', fontSize = 32 }: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  if (mode === 'chars') {
    const chars = text.split('')
    return (
      <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', gap: '0 2px' }}>
        {chars.map((char, i) => (
          <div key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
            <motion.span
              custom={i}
              variants={charVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              style={{
                display: 'inline-block',
                fontFamily: 'var(--font-power)',
                fontSize,
                fontWeight: 300,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                whiteSpace: 'pre',
              }}
            >
              {char}
            </motion.span>
          </div>
        ))}
      </div>
    )
  }

  const words = text.split(' ')
  return (
    <div ref={ref} style={{ display: 'flex', flexWrap: 'wrap', gap: '0 10px' }}>
      {words.map((word, i) => (
        <div key={i} style={{ overflow: 'hidden', display: 'inline-block' }}>
          <motion.span
            custom={i}
            variants={wordVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            style={{
              display: 'inline-block',
              fontFamily: 'var(--font-power)',
              fontSize,
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              lineHeight: 1.2,
            }}
          >
            {word}
          </motion.span>
        </div>
      ))}
    </div>
  )
}

/* Gradient sweep variant */
export function GradientTextReveal({ text = 'Splash.' }: { text?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true })

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span
          style={{
            fontFamily: 'var(--font-power)',
            fontSize: 56,
            fontWeight: 700,
            letterSpacing: '-0.04em',
            backgroundImage: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent-light) 60%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block',
          }}
          initial={{ backgroundPosition: '200% center' }}
          animate={inView ? { backgroundPosition: '0% center' } : {}}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          {text}
        </motion.span>
      </motion.div>
    </div>
  )
}
