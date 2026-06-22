'use client'

import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, PanInfo } from 'framer-motion'

const ITEMS = [
  { id: 1, label: 'Elastic drag', sub: 'Spring physics on release', color: '#534AB7' },
  { id: 2, label: 'Momentum', sub: 'Velocity-based inertia', color: '#1D9E75' },
  { id: 3, label: 'Snap', sub: 'Nearest item snapping', color: '#D85A30' },
  { id: 4, label: 'Infinite', sub: 'Loop-ready architecture', color: '#BA7517' },
  { id: 5, label: 'Touch', sub: 'Native gesture support', color: '#D4537E' },
]

const CARD_W = 200
const GAP = 16

export function ElasticCarousel() {
  const [active, setActive] = useState(0)
  const x = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })

  const snapTo = (index: number) => {
    const clamped = Math.max(0, Math.min(index, ITEMS.length - 1))
    setActive(clamped)
    x.set(-(clamped * (CARD_W + GAP)))
  }

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const velocity = info.velocity.x
    const offset = info.offset.x
    let next = active
    if (velocity < -300 || offset < -(CARD_W / 2)) next = active + 1
    if (velocity > 300 || offset > CARD_W / 2) next = active - 1
    snapTo(next)
  }

  return (
    <div style={{ width: '100%', overflow: 'hidden', position: 'relative' }}>
      <motion.div
        drag="x"
        dragConstraints={{ left: -((ITEMS.length - 1) * (CARD_W + GAP)), right: 0 }}
        dragElastic={0.12}
        onDragEnd={onDragEnd}
        style={{ x: springX, display: 'flex', gap: GAP, cursor: 'grab', width: 'max-content', padding: '4px 2px 12px' }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.id}
            animate={{
              scale: i === active ? 1 : 0.93,
              opacity: i === active ? 1 : 0.55,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              width: CARD_W,
              height: 130,
              flexShrink: 0,
              borderRadius: 14,
              background: i === active ? item.color : 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 18,
              userSelect: 'none',
            }}
          >
            <p style={{
              fontFamily: 'var(--font-power)',
              fontSize: 16,
              fontWeight: 500,
              color: i === active ? '#fff' : 'var(--text-primary)',
              letterSpacing: '-0.01em',
              marginBottom: 4,
            }}>{item.label}</p>
            <p style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: 12,
              color: i === active ? 'rgba(255,255,255,0.65)' : 'var(--text-tertiary)',
            }}>{item.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 4 }}>
        {ITEMS.map((_, i) => (
          <motion.button
            key={i}
            onClick={() => snapTo(i)}
            animate={{ width: i === active ? 20 : 6, background: i === active ? 'var(--accent)' : 'var(--border-strong)' }}
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            style={{ height: 6, borderRadius: 99, border: 'none', cursor: 'pointer', padding: 0 }}
          />
        ))}
      </div>
    </div>
  )
}
