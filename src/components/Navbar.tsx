'use client'

import { useEffect, useState } from 'react'
import { useTheme } from './ThemeProvider'
import { Logo } from './Logo'

export function Navbar() {
  const { theme, toggle } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg)',
      }}
    >
      <nav
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Logo size={28} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <NavLink href="#variants">Variants</NavLink>
          <NavLink href="#docs">Docs</NavLink>
          <NavLink href="https://github.com" external>GitHub</NavLink>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            suppressHydrationWarning
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: '1px solid var(--border-strong)',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)',
              transition: 'all 0.15s ease',
              fontSize: 16,
            }}
          >
            {/* Only render icon after mount — avoids server/client mismatch */}
            {mounted ? (theme === 'dark' ? '☀' : '☾') : null}
          </button>

          <a
            href="#install"
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              background: 'var(--accent)',
              color: '#fff',
              fontSize: 13,
              fontWeight: 500,
              textDecoration: 'none',
              fontFamily: 'var(--font-outfit)',
              letterSpacing: '0.01em',
              transition: 'opacity 0.15s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            npm install
          </a>
        </div>
      </nav>
    </header>
  )
}

function NavLink({ href, children, external }: { href: string; children: React.ReactNode; external?: boolean }) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{
        fontSize: 14,
        fontWeight: 400,
        color: 'var(--text-secondary)',
        textDecoration: 'none',
        fontFamily: 'var(--font-outfit)',
        transition: 'color 0.15s ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
    >
      {children}
    </a>
  )
}
