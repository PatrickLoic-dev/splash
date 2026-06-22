'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface SpotlightCardProps {
  children?: React.ReactNode
  spotlightColor?: string
}

export function SpotlightCard({ children, spotlightColor = 'rgba(127,119,221,0.15)' }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: 16,
        border: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        overflow: 'hidden',
        padding: 28,
        transition: 'border-color 0.2s ease',
        borderColor: hovered ? 'var(--border-strong)' : 'var(--border)',
      }}
    >
      {/* Spotlight */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(300px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />

      {/* Border glow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 16,
          pointerEvents: 'none',
          transition: 'opacity 0.3s ease',
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(200px circle at ${pos.x}px ${pos.y}px, rgba(127,119,221,0.25), transparent 70%)`,
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          padding: '1px',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {children ?? <DefaultSpotlightContent />}
      </div>
    </div>
  )
}

function DefaultSpotlightContent() {
  return (
    <>
      <p style={{
        fontFamily: 'var(--font-power)', fontSize: 20, fontWeight: 500,
        letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 10,
      }}>
        Spotlight Card
      </p>
      <p style={{
        fontFamily: 'var(--font-outfit)', fontSize: 14,
        color: 'var(--text-secondary)', lineHeight: 1.6,
      }}>
        Radial gradient light follows your cursor. The border glows where you look.
      </p>
    </>
  )
}

export function SpotlightGrid() {
  const cards = [
    { title: 'Cursor tracking', desc: 'Mouse position drives a radial gradient in real time.', color: 'rgba(127,119,221,0.18)' },
    { title: 'Border glow', desc: 'Masked gradient creates a luminous edge around the card.', color: 'rgba(29,158,117,0.15)' },
    { title: 'Composable', desc: 'Wrap any content — works with text, images, code blocks.', color: 'rgba(216,90,48,0.15)' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14 }}>
      {cards.map((card) => (
        <SpotlightCard key={card.title} spotlightColor={card.color}>
          <p style={{
            fontFamily: 'var(--font-power)', fontSize: 16, fontWeight: 500,
            letterSpacing: '-0.01em', color: 'var(--text-primary)', marginBottom: 8,
          }}>
            {card.title}
          </p>
          <p style={{
            fontFamily: 'var(--font-outfit)', fontSize: 13,
            color: 'var(--text-secondary)', lineHeight: 1.55,
          }}>
            {card.desc}
          </p>
        </SpotlightCard>
      ))}
    </div>
  )
}
