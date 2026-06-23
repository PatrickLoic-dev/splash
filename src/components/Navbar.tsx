'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from './ThemeProvider'
import { useI18n } from '@/lib/i18n'
import { Logo } from './Logo'

function useScrollDirection() {
  const [visible, setVisible] = useState(true)
  const lastY    = useRef(0)
  const ticking  = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y     = window.scrollY
        const delta = y - lastY.current
        if (Math.abs(delta) > 4) {
          setVisible(delta < 0 || y < 60)
          lastY.current = y
        }
        ticking.current = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return visible
}

export function Navbar() {
  const { theme, toggle } = useTheme()
  const { lang, setLang, t } = useI18n()
  const visible = useScrollDirection()

  return (
    <motion.header
      animate={{ y: visible ? 0 : -80, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-nav)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      <nav style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '0 28px',
        height: 58,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}>

        {/* ── Left: logo ── */}
        <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <Logo size={28} showWordmark={false} />
          <span style={{
            fontFamily: 'var(--font-power)', fontWeight: 700, fontSize: 17,
            letterSpacing: '-0.025em', color: 'var(--text-primary)', lineHeight: 1,
          }}>
            splash
          </span>
          <span style={{
            fontSize: 9, fontFamily: 'var(--font-outfit)', fontWeight: 700,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            color: 'var(--accent)', background: 'var(--accent-faint)',
            border: '1px solid var(--accent-mid)',
            padding: '2px 6px', borderRadius: 4, lineHeight: 1.4,
          }}>
            {t('nav_beta')}
          </span>
        </a>

        {/* ── Center: nav link ── */}
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <NavLink href="/learn">{t('nav_learn')}</NavLink>
        </div>

        {/* ── Right: lang + theme + CTA ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>

          {/* GitHub icon */}
          <a
            href="https://github.com/PatrickLoic-dev/splash"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            style={{
              width: 34, height: 34, borderRadius: 8,
              border: '1px solid var(--border-strong)',
              background: 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)', textDecoration: 'none',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--text-secondary)'
              e.currentTarget.style.color = 'var(--text-primary)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border-strong)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <GitHubIcon size={15} />
          </a>

          {/* Language toggle — EN / FR */}
          <button
            onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
            aria-label="Toggle language"
            style={{
              display: 'flex', alignItems: 'center', gap: 0,
              height: 34, borderRadius: 8,
              border: '1px solid var(--border-strong)',
              background: 'transparent',
              cursor: 'pointer', overflow: 'hidden', padding: 0,
            }}
          >
            {(['en', 'fr'] as const).map((l, i) => (
              <span key={l} style={{
                padding: '0 10px', height: '100%',
                display: 'flex', alignItems: 'center',
                fontSize: 11, fontFamily: 'var(--font-outfit)', fontWeight: 700,
                letterSpacing: '0.06em',
                background: lang === l ? 'var(--text-primary)' : 'transparent',
                color: lang === l ? 'var(--bg)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                borderRight: i === 0 ? '1px solid var(--border-strong)' : 'none',
              }}>
                {l.toUpperCase()}
              </span>
            ))}
          </button>

          {/* Theme toggle — ☀ / ☾ */}
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            style={{
              display: 'flex', alignItems: 'center', gap: 0,
              height: 34, borderRadius: 8,
              border: '1px solid var(--border-strong)',
              background: 'transparent',
              cursor: 'pointer', overflow: 'hidden', padding: 0,
            }}
          >
            {(['light', 'dark'] as const).map((th, i) => (
              <span key={th} style={{
                padding: '0 11px', height: '100%',
                display: 'flex', alignItems: 'center',
                fontSize: 12,
                background: theme === th ? 'var(--text-primary)' : 'transparent',
                color: theme === th ? 'var(--bg)' : 'var(--text-secondary)',
                transition: 'all 0.2s ease',
                borderRight: i === 0 ? '1px solid var(--border-strong)' : 'none',
              }}>
                {th === 'light' ? '☀' : '☾'}
              </span>
            ))}
          </button>

          {/* CTA */}
          <a
            href="/learn"
            className="btn-border-anim"
            style={{
              padding: '0 20px', height: 34, borderRadius: 20,
              background: 'var(--accent)', color: '#fff',
              fontSize: 13, fontWeight: 600,
              textDecoration: 'none', fontFamily: 'var(--font-outfit)',
              letterSpacing: '0.01em',
              display: 'inline-flex', alignItems: 'center', whiteSpace: 'nowrap',
            }}
          >
            {t('nav_start')}
          </a>
        </div>
      </nav>
    </motion.header>
  )
}

function NavLink({ href, children, external }: {
  href: string; children: React.ReactNode; external?: boolean
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
        padding: '6px 14px', borderRadius: 8,
        fontSize: 14, fontWeight: 400,
        color: 'var(--text-secondary)', textDecoration: 'none',
        fontFamily: 'var(--font-outfit)', transition: 'all 0.15s ease',
        letterSpacing: '-0.01em',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.color = 'var(--text-primary)'
        e.currentTarget.style.background = 'var(--bg-secondary)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.color = 'var(--text-secondary)'
        e.currentTarget.style.background = 'transparent'
      }}
    >
      {children}
    </a>
  )
}

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}
