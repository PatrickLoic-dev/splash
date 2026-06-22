'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

const LAYERS = [
  { depth: 0.06, size: 80, shape: 'circle', color: 'var(--accent-faint)', x: 20, y: 25, opacity: 0.45 },
  { depth: 0.12, size: 48, shape: 'square', color: 'var(--accent-mid)', x: 70, y: 15, opacity: 0.35 },
  { depth: 0.18, size: 32, shape: 'circle', color: 'var(--accent)', x: 55, y: 65, opacity: 0.4 },
  { depth: 0.08, size: 60, shape: 'square', color: 'var(--accent-light)', x: 80, y: 70, opacity: 0.2 },
  { depth: 0.22, size: 20, shape: 'circle', color: 'var(--accent)', x: 35, y: 80, opacity: 0.5 },
  { depth: 0.14, size: 28, shape: 'circle', color: 'var(--accent-mid)', x: 10, y: 60, opacity: 0.3 },
]

function ParallaxLayer({ layer, springX, springY }: {
  layer: typeof LAYERS[0]
  springX: ReturnType<typeof useSpring>
  springY: ReturnType<typeof useSpring>
}) {
  const tx = useTransform(springX, (v: number) => v * layer.depth)
  const ty = useTransform(springY, (v: number) => v * layer.depth)

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${layer.x}%`,
        top: `${layer.y}%`,
        x: tx,
        y: ty,
        width: layer.size,
        height: layer.size,
        borderRadius: layer.shape === 'circle' ? '50%' : 8,
        background: layer.color,
        opacity: layer.opacity,
        translateX: '-50%',
        translateY: '-50%',
      }}
    />
  )
}

function ParallaxLabel({ springX, springY }: {
  springX: ReturnType<typeof useSpring>
  springY: ReturnType<typeof useSpring>
}) {
  const tx = useTransform(springX, (v: number) => v * -0.025)
  const ty = useTransform(springY, (v: number) => v * -0.025)

  return (
    <motion.div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        x: tx,
        y: ty,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily: 'var(--font-power)', fontSize: 22, fontWeight: 300,
          letterSpacing: '-0.03em', color: 'var(--text-primary)',
        }}>
          Parallax layers
        </p>
        <p style={{
          fontFamily: 'var(--font-outfit)', fontSize: 12,
          color: 'var(--text-tertiary)', marginTop: 4,
        }}>
          Move cursor to feel depth
        </p>
      </div>
    </motion.div>
  )
}

export function ParallaxSection() {
  const ref = useRef<HTMLDivElement>(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const springX = useSpring(rawX, { stiffness: 60, damping: 18 })
  const springY = useSpring(rawY, { stiffness: 60, damping: 18 })

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    rawX.set(e.clientX - rect.left - rect.width / 2)
    rawY.set(e.clientY - rect.top - rect.height / 2)
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { rawX.set(0); rawY.set(0) }}
      style={{
        position: 'relative',
        width: '100%',
        height: 220,
        borderRadius: 14,
        background: 'var(--bg-tertiary)',
        overflow: 'hidden',
        cursor: 'crosshair',
      }}
    >
      {LAYERS.map((layer, i) => (
        <ParallaxLayer key={i} layer={layer} springX={springX} springY={springY} />
      ))}
      <ParallaxLabel springX={springX} springY={springY} />
    </div>
  )
}
