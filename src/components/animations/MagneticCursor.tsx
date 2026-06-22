'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

interface MagneticCursorProps {
  color?: string
}

export function MagneticCursor({ color }: MagneticCursorProps) {
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const trailX = useMotionValue(-100)
  const trailY = useMotionValue(-100)

  const springConfig = { stiffness: 500, damping: 28, mass: 0.5 }
  const trailConfig = { stiffness: 120, damping: 20, mass: 1 }

  const springX = useSpring(cursorX, springConfig)
  const springY = useSpring(cursorY, springConfig)
  const trailSpringX = useSpring(trailX, trailConfig)
  const trailSpringY = useSpring(trailY, trailConfig)

  const [state, setState] = useState<'default' | 'hover' | 'click'>('default')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      cursorX.set(x)
      cursorY.set(y)
      trailX.set(x)
      trailY.set(y)
    }

    const onDown = () => setState('click')
    const onUp = () => setState('default')

    const links = el.querySelectorAll('[data-cursor="hover"]')
    links.forEach(l => {
      l.addEventListener('mouseenter', () => setState('hover'))
      l.addEventListener('mouseleave', () => setState('default'))
    })

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mousedown', onDown)
    el.addEventListener('mouseup', onUp)

    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mousedown', onDown)
      el.removeEventListener('mouseup', onUp)
    }
  }, [cursorX, cursorY, trailX, trailY])

  const accentColor = color || 'var(--accent)'

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: 220,
        background: 'var(--bg-tertiary)',
        borderRadius: 12,
        overflow: 'hidden',
        cursor: 'none',
      }}
    >
      {/* Trail dot */}
      <motion.div
        style={{
          position: 'absolute',
          x: trailSpringX,
          y: trailSpringY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      >
        <motion.div
          animate={{
            width: state === 'hover' ? 48 : state === 'click' ? 14 : 32,
            height: state === 'hover' ? 48 : state === 'click' ? 14 : 32,
            opacity: state === 'hover' ? 0.15 : 0.08,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          style={{
            borderRadius: '50%',
            background: accentColor,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </motion.div>

      {/* Main cursor */}
      <motion.div
        style={{
          position: 'absolute',
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{
            width: state === 'hover' ? 10 : state === 'click' ? 6 : 8,
            height: state === 'hover' ? 10 : state === 'click' ? 6 : 8,
            background: state === 'hover' ? accentColor : 'var(--text-primary)',
          }}
          transition={{ type: 'spring', stiffness: 600, damping: 30 }}
          style={{
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </motion.div>

      {/* Demo content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          flexWrap: 'wrap',
          padding: 24,
        }}
      >
        {['Hover me', 'Click', 'Interact'].map((label) => (
          <div
            key={label}
            data-cursor="hover"
            style={{
              padding: '10px 22px',
              borderRadius: 8,
              border: '1px solid var(--border-strong)',
              background: 'var(--bg-secondary)',
              fontSize: 13,
              fontFamily: 'var(--font-outfit)',
              color: 'var(--text-secondary)',
              userSelect: 'none',
            }}
          >
            {label}
          </div>
        ))}
      </div>

      <span style={{
        position: 'absolute', bottom: 10, left: 12,
        fontSize: 10, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)',
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        Move cursor inside
      </span>
    </div>
  )
}
