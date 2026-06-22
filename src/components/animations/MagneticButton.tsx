'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticButtonProps {
  label?: string
  strength?: number
}

export function MagneticButton({ label = 'Magnetic', strength = 0.4 }: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 350, damping: 22 })
  const springY = useSpring(y, { stiffness: 350, damping: 22 })
  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    x.set((e.clientX - cx) * strength)
    y.set((e.clientY - cy) * strength)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
    setHovered(false)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
      {/* Filled variant */}
      <motion.button
        ref={ref}
        style={{
          x: springX,
          y: springY,
          padding: '14px 32px',
          borderRadius: 99,
          border: 'none',
          background: hovered ? 'var(--accent-light)' : 'var(--accent)',
          color: '#fff',
          fontSize: 14,
          fontFamily: 'var(--font-outfit)',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background 0.2s ease',
          letterSpacing: '0.01em',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
        whileTap={{ scale: 0.96 }}
      >
        {label}
      </motion.button>

      {/* Outline variant */}
      <MagneticOutline label="Outline" strength={strength} />

      {/* Icon variant */}
      <MagneticIcon strength={strength} />
    </div>
  )
}

function MagneticOutline({ label, strength }: { label: string; strength: number }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 350, damping: 22 })
  const springY = useSpring(y, { stiffness: 350, damping: 22 })

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * strength)
    y.set((e.clientY - rect.top - rect.height / 2) * strength)
  }

  return (
    <motion.button
      ref={ref}
      style={{
        x: springX, y: springY,
        padding: '13px 30px',
        borderRadius: 99,
        border: '1.5px solid var(--border-strong)',
        background: 'transparent',
        color: 'var(--text-primary)',
        fontSize: 14,
        fontFamily: 'var(--font-outfit)',
        fontWeight: 400,
        cursor: 'pointer',
        letterSpacing: '0.01em',
      }}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileHover={{ borderColor: 'var(--accent)' }}
      whileTap={{ scale: 0.96 }}
    >
      {label}
    </motion.button>
  )
}

function MagneticIcon({ strength }: { strength: number }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 350, damping: 22 })
  const springY = useSpring(y, { stiffness: 350, damping: 22 })

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * strength)
    y.set((e.clientY - rect.top - rect.height / 2) * strength)
  }

  return (
    <motion.button
      ref={ref}
      style={{
        x: springX, y: springY,
        width: 48, height: 48,
        borderRadius: '50%',
        border: '1.5px solid var(--border-strong)',
        background: 'var(--bg-secondary)',
        color: 'var(--text-primary)',
        fontSize: 18,
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      whileHover={{ background: 'var(--accent-faint)', borderColor: 'var(--accent)' }}
      whileTap={{ scale: 0.9 }}
    >
      ✦
    </motion.button>
  )
}
