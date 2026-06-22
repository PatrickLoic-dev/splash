'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/variants'

export function Hero() {
  return (
    <section
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent-faint) 0%, transparent 70%)',
          pointerEvents: 'none',
          opacity: 0.6,
        }}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: 720,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Badge */}
        <motion.div variants={staggerItem}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 99,
              border: '1px solid var(--border-strong)',
              fontSize: 12,
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              color: 'var(--accent-light)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 32,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
            v1.0 — Open Source
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={staggerItem}
          style={{
            fontFamily: 'var(--font-power)',
            fontWeight: 300,
            fontSize: 'clamp(52px, 8vw, 96px)',
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            marginBottom: 24,
          }}
        >
          Motion,{' '}
          <span style={{ color: 'var(--accent-light)' }}>ready</span>
          <br />
          to ship.
        </motion.h1>

        {/* Sub */}
        <motion.p
          variants={staggerItem}
          style={{
            fontFamily: 'var(--font-outfit)',
            fontWeight: 300,
            fontSize: 18,
            lineHeight: 1.7,
            color: 'var(--text-secondary)',
            maxWidth: 480,
            marginBottom: 48,
          }}
        >
          Reusable, composable Framer Motion variants for React.
          Fade, slide, stagger, spring, morphing — import in one line.
        </motion.p>

        {/* CTA group */}
        <motion.div variants={staggerItem} style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="#variants"
            style={{
              padding: '13px 28px',
              borderRadius: 10,
              background: 'var(--accent)',
              color: '#fff',
              fontSize: 15,
              fontWeight: 500,
              fontFamily: 'var(--font-outfit)',
              textDecoration: 'none',
              letterSpacing: '0.01em',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Explore variants
          </a>
          <a
            href="#install"
            style={{
              padding: '13px 28px',
              borderRadius: 10,
              background: 'transparent',
              border: '1px solid var(--border-strong)',
              color: 'var(--text-primary)',
              fontSize: 15,
              fontWeight: 400,
              fontFamily: 'var(--font-outfit)',
              textDecoration: 'none',
              transition: 'border-color 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--accent)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
          >
            npm install splash
          </a>
        </motion.div>

        {/* Install hint */}
        <motion.div
          variants={fadeInUp}
          style={{ marginTop: 56 }}
        >
          <code
            style={{
              display: 'inline-block',
              padding: '10px 20px',
              borderRadius: 8,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              fontFamily: 'ui-monospace, monospace',
              fontSize: 13,
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
            }}
          >
            <span style={{ color: 'var(--text-tertiary)', userSelect: 'none' }}>$ </span>
            npm install @splash/variants framer-motion
          </code>
        </motion.div>
      </motion.div>
    </section>
  )
}
