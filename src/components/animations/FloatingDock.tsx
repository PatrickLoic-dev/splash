'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const ITEMS = [
  { icon: '⌘', label: 'Command' },
  { icon: '◈', label: 'Variants' },
  { icon: '✦', label: 'Splash' },
  { icon: '⚡', label: 'Spring' },
  { icon: '◎', label: 'Motion' },
  { icon: '⟐', label: 'Physics' },
]

function DockItem({ icon, label, mouseX }: { icon: string; label: string; mouseX: ReturnType<typeof useMotionValue> }) {
  const ref = useRef<HTMLDivElement>(null)

  const distance = useTransform(mouseX, (val: number) => {
    if (!ref.current) return 200
    const rect = ref.current.getBoundingClientRect()
    const center = rect.left + rect.width / 2
    return Math.abs(val - center)
  })

  const size = useTransform(distance, [0, 80, 160], [68, 48, 38])
  const springSize = useSpring(size, { stiffness: 350, damping: 22 })

  const y = useTransform(distance, [0, 80, 160], [-12, -4, 0])
  const springY = useSpring(y, { stiffness: 350, damping: 22 })

  return (
    <motion.div
      ref={ref}
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
      whileTap={{ scale: 0.9 }}
    >
      <motion.div
        style={{
          width: springSize,
          height: springSize,
          y: springY,
          borderRadius: 14,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-strong)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          cursor: 'pointer',
          flexShrink: 0,
        }}
        whileHover={{ background: 'var(--accent-faint)', borderColor: 'var(--accent)' }}
      >
        {icon}
      </motion.div>
      <span style={{
        fontSize: 10, fontFamily: 'var(--font-outfit)',
        color: 'var(--text-tertiary)', letterSpacing: '0.04em',
      }}>
        {label}
      </span>
    </motion.div>
  )
}

export function FloatingDock() {
  const mouseX = useMotionValue(Infinity)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <p style={{
        fontSize: 11, fontFamily: 'var(--font-outfit)', fontWeight: 500,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--text-tertiary)',
      }}>
        Move cursor over dock
      </p>
      <motion.div
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 10,
          padding: '12px 18px',
          borderRadius: 20,
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-strong)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {ITEMS.map((item) => (
          <DockItem key={item.label} {...item} mouseX={mouseX} />
        ))}
      </motion.div>
    </div>
  )
}
