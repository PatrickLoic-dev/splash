'use client'

import { useEffect, useState } from 'react'

const PHRASES = [
  'framer-motion variants.',
  'spring physics.',
  'magnetic buttons.',
  'elastic carousels.',
  'scroll-triggered reveals.',
  'custom cursors.',
]

interface TypewriterProps {
  speed?: number
  deleteSpeed?: number
  pauseMs?: number
}

export function TypewriterText({ speed = 55, deleteSpeed = 28, pauseMs = 1600 }: TypewriterProps) {
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [displayed, setDisplayed] = useState(PHRASES[0].slice(0, 0))
  const [phase, setPhase] = useState<'typing' | 'pause' | 'deleting'>('typing')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  if (!mounted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0 8px' }}>
        <span style={{ fontFamily: 'var(--font-power)', fontSize: 28, fontWeight: 300, color: 'var(--text-secondary)', letterSpacing: '-0.02em' }}>Built for</span>
        <span style={{ fontFamily: 'var(--font-power)', fontSize: 28, fontWeight: 400, color: 'var(--accent-light)', letterSpacing: '-0.02em' }}>motion.</span>
      </div>
    )
  }

  useEffect(() => {
    const target = PHRASES[phraseIndex]

    if (phase === 'typing') {
      if (displayed.length < target.length) {
        const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), speed)
        return () => clearTimeout(t)
      } else {
        const t = setTimeout(() => setPhase('pause'), pauseMs)
        return () => clearTimeout(t)
      }
    }

    if (phase === 'pause') {
      setPhase('deleting')
    }

    if (phase === 'deleting') {
      if (displayed.length > 0) {
        const t = setTimeout(() => setDisplayed(prev => prev.slice(0, -1)), deleteSpeed)
        return () => clearTimeout(t)
      } else {
        setPhraseIndex(i => (i + 1) % PHRASES.length)
        setPhase('typing')
      }
    }
  }, [displayed, phase, phraseIndex, speed, deleteSpeed, pauseMs])

  return (
    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0 8px' }}>
      <span style={{
        fontFamily: 'var(--font-power)',
        fontSize: 28,
        fontWeight: 300,
        color: 'var(--text-secondary)',
        letterSpacing: '-0.02em',
      }}>
        Built for
      </span>
      <span style={{
        fontFamily: 'var(--font-power)',
        fontSize: 28,
        fontWeight: 400,
        color: 'var(--accent-light)',
        letterSpacing: '-0.02em',
        minWidth: 2,
      }}>
        {displayed}
        <span
          style={{
            display: 'inline-block',
            width: 2,
            height: '0.9em',
            background: 'var(--accent)',
            marginLeft: 2,
            verticalAlign: 'middle',
            animation: 'blink 1s step-end infinite',
          }}
        />
      </span>
      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </div>
  )
}
