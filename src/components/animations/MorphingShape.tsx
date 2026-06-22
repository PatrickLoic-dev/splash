'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

/* ─── SVG path sets ─── */

const SHAPES = {
  circle: 'M 100 50 A 50 50 0 1 1 99.999 50 Z',
  square: 'M 25 25 L 175 25 L 175 175 L 25 175 Z',
  triangle: 'M 100 15 L 185 170 L 15 170 Z',
  star: 'M 100 10 L 122 70 L 190 70 L 134 108 L 155 170 L 100 132 L 45 170 L 66 108 L 10 70 L 78 70 Z',
  blob: 'M 140 30 C 175 45 185 80 175 115 C 165 150 135 175 100 175 C 65 175 35 155 25 120 C 15 85 30 45 60 28 C 85 12 110 16 140 30 Z',
  diamond: 'M 100 10 L 190 100 L 100 190 L 10 100 Z',
  hexagon: 'M 100 10 L 175 52.5 L 175 147.5 L 100 190 L 25 147.5 L 25 52.5 Z',
  cross: 'M 65 25 L 135 25 L 135 65 L 175 65 L 175 135 L 135 135 L 135 175 L 65 175 L 65 135 L 25 135 L 25 65 L 65 65 Z',
}

type ShapeKey = keyof typeof SHAPES

const SHAPE_KEYS = Object.keys(SHAPES) as ShapeKey[]
const COLORS = ['#534AB7', '#1D9E75', '#D85A30', '#BA7517', '#D4537E', '#378ADD', '#639922', '#533A89']

interface MorphingShapeProps {
  autoplay?: boolean
  interval?: number
}

export function MorphingShape({ autoplay = true, interval = 1800 }: MorphingShapeProps) {
  const [index, setIndex] = useState(0)
  const [colorIndex, setColorIndex] = useState(0)

  useEffect(() => {
    if (!autoplay) return
    const t = setInterval(() => {
      setIndex(i => (i + 1) % SHAPE_KEYS.length)
      setColorIndex(c => (c + 1) % COLORS.length)
    }, interval)
    return () => clearInterval(t)
  }, [autoplay, interval])

  const currentShape = SHAPES[SHAPE_KEYS[index]]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
      <svg viewBox="0 0 200 200" width={160} height={160}>
        <motion.path
          d={currentShape}
          fill={COLORS[colorIndex]}
          animate={{ d: currentShape, fill: COLORS[colorIndex] }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>

      {/* Shape selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {SHAPE_KEYS.map((key, i) => (
          <button
            key={key}
            onClick={() => { setIndex(i); setColorIndex(i % COLORS.length) }}
            style={{
              padding: '4px 10px',
              borderRadius: 6,
              border: '1px solid',
              borderColor: index === i ? 'var(--accent)' : 'var(--border-strong)',
              background: index === i ? 'var(--accent-faint)' : 'transparent',
              color: index === i ? 'var(--accent)' : 'var(--text-tertiary)',
              fontSize: 11,
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              letterSpacing: '0.03em',
            }}
          >
            {key}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Logo morph ─── */

const LOGO_PATHS = [
  // S-curve
  'M 160 55 C 160 38 145 24 120 24 C 88 24 65 42 65 68 C 65 94 90 102 115 108 C 145 115 168 127 168 155 C 168 178 149 190 118 190 C 90 190 72 175 72 160',
  // Spiral-ish
  'M 150 40 C 165 55 168 80 155 100 C 142 120 118 128 100 125 C 78 122 58 110 55 88 C 52 66 65 44 85 34 C 105 24 138 28 150 40',
  // Lightning
  'M 145 24 L 85 108 L 125 108 L 65 190 L 165 90 L 118 90 Z',
  // Wave
  'M 40 100 C 65 60 95 140 120 100 C 145 60 160 130 185 100',
]

export function LogoMorph() {
  const [i, setI] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setI(v => (v + 1) % LOGO_PATHS.length), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <svg viewBox="0 0 220 220" width={140} height={140}>
      <motion.path
        d={LOGO_PATHS[i]}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ d: LOGO_PATHS[i] }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  )
}

/* ─── Fluid blob that follows cursor ─── */

type Point = { x: number; y: number }

function blobPath(points: Point[]): string {
  if (points.length < 3) return ''
  const n = points.length
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n]
    const p1 = points[i]
    const p2 = points[(i + 1) % n]
    const p3 = points[(i + 2) % n]
    const cp1x = p1.x + (p2.x - p0.x) / 6
    const cp1y = p1.y + (p2.y - p0.y) / 6
    const cp2x = p2.x - (p3.x - p1.x) / 6
    const cp2y = p2.y - (p3.y - p1.y) / 6
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
  }
  return d + ' Z'
}

function generateBlob(seed: number, cx: number, cy: number, r: number, points: number): Point[] {
  return Array.from({ length: points }, (_, i) => {
    const angle = (i / points) * Math.PI * 2
    const noise = Math.sin(angle * 3 + seed) * 0.25 + Math.cos(angle * 2 - seed * 0.7) * 0.2
    const radius = r * (1 + noise)
    return { x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius }
  })
}

export function FluidBlob() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTick(v => v + 0.04), 40)
    return () => clearInterval(t)
  }, [])

  const points = generateBlob(tick, 100, 100, 70, 10)
  const path = blobPath(points)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg viewBox="0 0 200 200" width={160} height={160}>
        <defs>
          <linearGradient id="blobGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.9} />
            <stop offset="100%" stopColor="var(--accent-light)" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <path d={path} fill="url(#blobGrad)" />
      </svg>
      <span style={{
        fontSize: 11, fontFamily: 'var(--font-outfit)', fontWeight: 500,
        color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        Fluid blob — continuous morph
      </span>
    </div>
  )
}

/* ─── Path drawing animation ─── */

export function PathDraw() {
  const [playing, setPlaying] = useState(true)

  const restart = () => { setPlaying(false); setTimeout(() => setPlaying(true), 80) }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <svg viewBox="0 0 200 120" width={200} height={120}>
        {playing && (
          <motion.path
            d="M 10 60 C 40 20, 80 100, 110 60 C 140 20, 165 90, 190 60"
            fill="none"
            stroke="var(--accent)"
            strokeWidth={3}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
        {playing && (
          <motion.path
            d="M 10 80 C 50 50, 90 110, 120 80 C 150 50, 170 100, 190 80"
            fill="none"
            stroke="var(--accent-light)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="4 6"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          />
        )}
      </svg>
      <button
        onClick={restart}
        style={{
          padding: '5px 14px', borderRadius: 7,
          border: '1px solid var(--border-strong)', background: 'transparent',
          color: 'var(--text-tertiary)', fontSize: 12, fontFamily: 'var(--font-outfit)',
          cursor: 'pointer',
        }}
      >
        ↺ replay
      </button>
    </div>
  )
}
