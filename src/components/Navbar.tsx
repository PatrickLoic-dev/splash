'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useTheme } from './ThemeProvider'
import { useI18n } from '@/lib/i18n'
import { useBreakpoint } from '@/lib/useBreakpoint'
import { Logo } from './Logo'

function useScrollDirection() {
  const [visible, setVisible] = useState(true)
  const lastY   = useRef(0)
  const ticking = useRef(false)

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
  const visible  = useScrollDirection()
  const pathname = usePathname()
  const { isMobile } = useBreakpoint()
  const [menuOpen, setMenuOpen] = useState(false)
  const isLearnPage = pathname?.startsWith('/learn') ?? false

  /* close menu on resize to desktop */
  useEffect(() => {
    if (!isMobile) setMenuOpen(false)
  }, [isMobile])

  /* lock body scroll while menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
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
          padding: isMobile ? '0 16px' : '0 28px',
          height: 58,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
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

          {/* ── Center: nav link — desktop only ── */}
          {!isMobile && (
            <div style={{
              position: 'absolute', left: '50%', transform: 'translateX(-50%)',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <NavLink href="/learn">{t('nav_learn')}</NavLink>
            </div>
          )}

          {/* ── Right: controls ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>

            {/* GitHub icon — desktop only */}
            {!isMobile && (
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
            )}

            {/* Language toggle */}
            {!isMobile && (
              <button
                onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
                aria-label="Toggle language"
                style={{
                  display: 'flex', alignItems: 'center',
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
            )}

            {/* Theme toggle */}
            {!isMobile && (
              <button
                onClick={toggle}
                aria-label="Toggle theme"
                style={{
                  display: 'flex', alignItems: 'center',
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
            )}


            {/* Hamburger — mobile only */}
            {isMobile && (
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                style={{
                  width: 36, height: 36, borderRadius: 8,
                  border: '1px solid var(--border-strong)',
                  background: 'transparent',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  gap: 5, cursor: 'pointer', padding: 0, flexShrink: 0,
                }}
              >
                <motion.span
                  animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'block', width: 16, height: 1.5, background: 'var(--text-primary)', borderRadius: 2 }}
                />
                <motion.span
                  animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.15 }}
                  style={{ display: 'block', width: 16, height: 1.5, background: 'var(--text-primary)', borderRadius: 2 }}
                />
                <motion.span
                  animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'block', width: 16, height: 1.5, background: 'var(--text-primary)', borderRadius: 2 }}
                />
              </button>
            )}
          </div>
        </nav>
      </motion.header>

      {/* ── Fullscreen mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 49,
              background: 'var(--bg)',
              display: 'flex',
              flexDirection: 'column',
              paddingTop: 58,
            }}
          >
            {/* Nav links */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '48px 28px 32px' }}>
              {[
                { href: '/', label: t('nav_home') },
                { href: '/learn', label: t('nav_learn') },
              ].map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.06, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    fontFamily: 'var(--font-power)', fontSize: 36, fontWeight: 700,
                    letterSpacing: '-0.03em', color: 'var(--text-primary)',
                    textDecoration: 'none', lineHeight: 1.15,
                    paddingBottom: 20,
                    borderBottom: '1px solid var(--border)',
                    marginBottom: 20,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                >
                  {item.label}
                </motion.a>
              ))}

            </div>

            {/* Bottom controls */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22, duration: 0.3 }}
              style={{
                padding: '24px 28px',
                borderTop: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}
            >
              {/* Lang + theme toggles */}
              <div style={{ display: 'flex', gap: 8 }}>
                {/* Language */}
                <button
                  onClick={() => setLang(lang === 'en' ? 'fr' : 'en')}
                  style={{
                    display: 'flex', alignItems: 'center',
                    height: 38, borderRadius: 8,
                    border: '1px solid var(--border-strong)',
                    background: 'transparent',
                    cursor: 'pointer', overflow: 'hidden', padding: 0,
                  }}
                >
                  {(['en', 'fr'] as const).map((l, i) => (
                    <span key={l} style={{
                      padding: '0 12px', height: '100%',
                      display: 'flex', alignItems: 'center',
                      fontSize: 12, fontFamily: 'var(--font-outfit)', fontWeight: 700,
                      letterSpacing: '0.06em',
                      background: lang === l ? 'var(--text-primary)' : 'transparent',
                      color: lang === l ? 'var(--bg)' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease',
                      borderRight: i === 0 ? '1px solid var(--border-strong)' : 'none',
                    }}>{l.toUpperCase()}</span>
                  ))}
                </button>

                {/* Theme */}
                <button
                  onClick={toggle}
                  style={{
                    display: 'flex', alignItems: 'center',
                    height: 38, borderRadius: 8,
                    border: '1px solid var(--border-strong)',
                    background: 'transparent',
                    cursor: 'pointer', overflow: 'hidden', padding: 0,
                  }}
                >
                  {(['light', 'dark'] as const).map((th, i) => (
                    <span key={th} style={{
                      padding: '0 13px', height: '100%',
                      display: 'flex', alignItems: 'center', fontSize: 14,
                      background: theme === th ? 'var(--text-primary)' : 'transparent',
                      color: theme === th ? 'var(--bg)' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease',
                      borderRight: i === 0 ? '1px solid var(--border-strong)' : 'none',
                    }}>{th === 'light' ? '☀' : '☾'}</span>
                  ))}
                </button>
              </div>

              {/* GitHub */}
              <a
                href="https://github.com/PatrickLoic-dev/splash"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '9px 16px', borderRadius: 8,
                  border: '1px solid var(--border-strong)',
                  background: 'transparent',
                  color: 'var(--text-secondary)', textDecoration: 'none',
                  fontFamily: 'var(--font-outfit)', fontSize: 13, fontWeight: 500,
                  transition: 'all 0.15s ease',
                }}
              >
                <GitHubIcon size={15} />
                GitHub
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
