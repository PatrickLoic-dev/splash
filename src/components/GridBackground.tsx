'use client'

import { useEffect, useRef } from 'react'

export function GridBackground() {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!glowRef.current) return
      glowRef.current.style.setProperty('--cx', `${e.clientX}px`)
      glowRef.current.style.setProperty('--cy', `${e.clientY}px`)
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  return (
    <div
      aria-hidden
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Base dim dot layer */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(circle, var(--grid-dot) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />

      {/* Cursor-following bright dot layer */}
      <div
        ref={glowRef}
        className="grid-cursor-glow"
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(circle, var(--grid-dot-bright) 1.5px, transparent 1.5px)',
          backgroundSize: '32px 32px',
        }}
      />
    </div>
  )
}
