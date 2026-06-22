'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

interface Ripple { id: number; x: number; y: number }

interface RippleButtonProps {
  label?: string
  variant?: 'filled' | 'outline'
}

export function RippleButton({ label = 'Click me', variant = 'filled' }: RippleButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples(r => [...r, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples(r => r.filter(rp => rp.id !== id)), 700)
  }

  const filled = variant === 'filled'

  return (
    <button
      onClick={addRipple}
      style={{
        position: 'relative',
        overflow: 'hidden',
        padding: '13px 32px',
        borderRadius: 10,
        border: filled ? 'none' : '1.5px solid var(--border-strong)',
        background: filled ? 'var(--accent)' : 'transparent',
        color: filled ? '#fff' : 'var(--text-primary)',
        fontSize: 14,
        fontFamily: 'var(--font-outfit)',
        fontWeight: 500,
        cursor: 'pointer',
        letterSpacing: '0.01em',
      }}
    >
      <AnimatePresence>
        {ripples.map(r => (
          <motion.span
            key={r.id}
            initial={{ width: 0, height: 0, opacity: 0.35, x: r.x, y: r.y, translateX: '-50%', translateY: '-50%' }}
            animate={{ width: 400, height: 400, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              borderRadius: '50%',
              background: filled ? 'rgba(255,255,255,0.3)' : 'var(--accent-faint)',
              pointerEvents: 'none',
            }}
          />
        ))}
      </AnimatePresence>
      <span style={{ position: 'relative', zIndex: 1 }}>{label}</span>
    </button>
  )
}

export function RippleButtonShowcase() {
  return (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
      <RippleButton label="Filled ripple" variant="filled" />
      <RippleButton label="Outline ripple" variant="outline" />
    </div>
  )
}
