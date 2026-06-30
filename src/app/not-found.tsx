'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Logo } from '@/components/Logo'

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hovered, setHovered] = useState(false)

  /* Particle animation on canvas */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let raf: number

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const accentRaw = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#A3E635'

    type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }
    const particles: Particle[] = []

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * W(), y: Math.random() * H(),
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        life: Math.random() * 200,
        maxLife: 150 + Math.random() * 100,
        size: 1 + Math.random() * 2,
      })
    }

    const tick = () => {
      ctx.clearRect(0, 0, W(), H())
      for (const p of particles) {
        p.x  += p.vx
        p.y  += p.vy
        p.life++
        if (p.life > p.maxLife) { p.life = 0; p.x = Math.random() * W(); p.y = Math.random() * H() }
        const alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.5
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(163,230,53,${alpha})`
        ctx.fill()
        // wrap
        if (p.x < 0) p.x = W()
        if (p.x > W()) p.x = 0
        if (p.y < 0) p.y = H()
        if (p.y > H()) p.y = 0
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div style={{
      minHeight: '100dvh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg)', position: 'relative', overflow: 'hidden',
      padding: '24px',
    }}>
      {/* Particle canvas */}
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />

      {/* Logo top-left */}
      <div style={{ position: 'absolute', top: 24, left: 28 }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Logo size={24} />
          <span style={{ fontFamily: 'var(--font-power)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>splash</span>
        </Link>
      </div>

      {/* Main content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 480 }}>

        {/* Animated 404 */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.05 }}
          style={{
            fontFamily: 'var(--font-power)', fontSize: 'clamp(80px, 22vw, 160px)',
            fontWeight: 900, letterSpacing: '-0.06em', lineHeight: 1,
            color: 'transparent',
            backgroundImage: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 60%, var(--text-tertiary) 100%)',
            WebkitBackgroundClip: 'text', backgroundClip: 'text',
            marginBottom: 8,
          }}
        >
          404
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: 'var(--font-power)', fontSize: 'clamp(20px,4vw,28px)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, letterSpacing: '-0.02em' }}
        >
          Page not found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{ fontFamily: 'var(--font-outfit)', fontSize: 15, color: 'var(--text-tertiary)', lineHeight: 1.7, marginBottom: 36 }}
        >
          This animation must have transitioned somewhere else.
          <br />Let&apos;s get you back on track.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <Link href="/" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              style={{
                padding: '12px 28px', borderRadius: 10,
                background: 'var(--accent)', color: '#fff',
                fontFamily: 'var(--font-outfit)', fontSize: 14, fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← Home
            </motion.div>
          </Link>
          <Link href="/learn" style={{ textDecoration: 'none' }}>
            <motion.div
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              style={{
                padding: '12px 28px', borderRadius: 10,
                border: '1.5px solid var(--border-strong)',
                background: hovered ? 'var(--bg-secondary)' : 'transparent',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-outfit)', fontSize: 14, fontWeight: 600,
                cursor: 'pointer', transition: 'background 0.15s',
              }}
            >
              Browse animations
            </motion.div>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
