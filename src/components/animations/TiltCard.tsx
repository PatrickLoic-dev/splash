'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface TiltCardProps {
  children?: React.ReactNode
  maxTilt?: number
  scale?: number
}

export function TiltCard({ children, maxTilt = 12, scale = 1.04 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const springConfig = { stiffness: 300, damping: 25 }
  const x = useSpring(rawX, springConfig)
  const y = useSpring(rawY, springConfig)

  const rotateX = useTransform(y, [-0.5, 0.5], [maxTilt, -maxTilt])
  const rotateY = useTransform(x, [-0.5, 0.5], [-maxTilt, maxTilt])

  const glareX = useTransform(x, [-0.5, 0.5], ['0%', '100%'])
  const glareY = useTransform(y, [-0.5, 0.5], ['0%', '100%'])

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    rawX.set((e.clientX - rect.left) / rect.width - 0.5)
    rawY.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const onLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 800,
      }}
      whileHover={{ scale }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div
        style={{
          position: 'relative',
          borderRadius: 16,
          border: '1px solid var(--border-strong)',
          background: 'var(--bg-secondary)',
          overflow: 'hidden',
          padding: 28,
        }}
      >
        {/* Glare overlay */}
        <motion.div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at var(--gx, 50%) var(--gy, 50%), rgba(255,255,255,0.08) 0%, transparent 65%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />

        {children ?? <DefaultCardContent />}
      </div>
    </motion.div>
  )
}

function DefaultCardContent() {
  return (
    <div style={{ position: 'relative', zIndex: 1 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: 'var(--accent-faint)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, marginBottom: 16,
      }}>
        ✦
      </div>
      <p style={{
        fontFamily: 'var(--font-power)', fontSize: 18, fontWeight: 500,
        letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 8,
      }}>
        Tilt Card
      </p>
      <p style={{
        fontFamily: 'var(--font-outfit)', fontSize: 13,
        color: 'var(--text-tertiary)', lineHeight: 1.5,
      }}>
        3D perspective transform with spring physics and glare effect.
      </p>
    </div>
  )
}

/* Grid of 3 tilt cards for the showcase */
export function TiltCardGrid() {
  const cards = [
    { icon: '⚡', title: 'Spring physics', desc: 'rotateX/Y driven by mouse position' },
    { icon: '✦', title: 'Glare effect', desc: 'radial gradient follows cursor' },
    { icon: '◈', title: 'Perspective', desc: 'preserve-3d with 800px depth' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14 }}>
      {cards.map((card) => (
        <TiltCard key={card.title}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--accent-faint)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, marginBottom: 14,
            }}>
              {card.icon}
            </div>
            <p style={{
              fontFamily: 'var(--font-power)', fontSize: 15, fontWeight: 500,
              letterSpacing: '-0.01em', color: 'var(--text-primary)', marginBottom: 6,
            }}>
              {card.title}
            </p>
            <p style={{
              fontFamily: 'var(--font-outfit)', fontSize: 12,
              color: 'var(--text-tertiary)', lineHeight: 1.5,
            }}>
              {card.desc}
            </p>
          </div>
        </TiltCard>
      ))}
    </div>
  )
}
