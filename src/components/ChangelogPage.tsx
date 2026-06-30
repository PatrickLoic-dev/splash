'use client'

import { motion } from 'framer-motion'
import { Navbar } from './Navbar'
import { useI18n } from '@/lib/i18n'

interface ChangelogEntry {
  version: string
  date: string
  items: string[]
}

const ENTRIES: ChangelogEntry[] = [
  {
    version: 'v1.5',
    date: 'June 2025',
    items: [
      'URL sharing — deep links encode animation + platform + step',
      'Cmd+K command palette — global search and navigation',
      'Progress tracking — per-animation completion, badge unlock per category',
      'Phase accordion — steps grouped into Setup / Core / Polish',
      '3 new animations — Morphing Button, Drag Reorder, Number Counter',
      '404 page — canvas particle animation with spring entrance',
      'Flutter Hero fix — layoutId transition now works correctly',
      'Mobile cursor fix — custom cursor disabled on touch devices',
    ],
  },
  {
    version: 'v1.4',
    date: 'May 2025',
    items: [
      'Bookmarks / favorites system',
      'Keyboard shortcuts (step navigation, Esc to close)',
      'Grouped steps with code diff view',
      'Resizable split pane (preview ↔ code)',
      'Use-case modal with real-world examples',
    ],
  },
  {
    version: 'v1.3',
    date: 'April 2025',
    items: [
      'Obsidian Lime design system — full dark/light mode via CSS custom properties',
      'View Transitions API theme crossfade',
      'Custom magnetic cursor',
      'Page transitions with Framer Motion AnimatePresence',
      'Snap scroll on home page',
    ],
  },
  {
    version: 'v1.2',
    date: 'March 2025',
    items: [
      'Full EN/FR bilingual support',
      'Filter sidebar (category + difficulty)',
      'Platform logos and platform selector view',
    ],
  },
  {
    version: 'v1.1',
    date: 'March 2025',
    items: [
      'Live preview with browser frame and phone bezel',
      'Step-by-step stepper with code blocks',
      'Dark mode via system preference detection',
    ],
  },
  {
    version: 'v1.0',
    date: 'February 2025',
    items: [
      'Initial release — 10 animation patterns, React and Next.js only',
    ],
  },
]

export function ChangelogPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { lang } = useI18n()

  return (
    <>
      <Navbar />
      <div style={{ paddingTop: 80, minHeight: '100dvh', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px 100px' }}>

          {/* Page header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ marginBottom: 64 }}
          >
            <p style={{
              fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 600,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--accent)', marginBottom: 12,
            }}>
              What&apos;s new
            </p>
            <h1 style={{
              fontFamily: 'var(--font-power)', fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700, letterSpacing: '-0.03em',
              color: 'var(--text-primary)', lineHeight: 1.06, marginBottom: 16,
            }}>
              Changelog
            </h1>
            <p style={{
              fontFamily: 'var(--font-outfit)', fontSize: 16,
              color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 460,
            }}>
              A running log of everything shipped to Splash — features, fixes, and improvements.
            </p>
          </motion.div>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: 15,
              top: 8,
              bottom: 8,
              width: 1,
              background: 'var(--border)',
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {ENTRIES.map((entry, i) => (
                <motion.div
                  key={entry.version}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.1 + i * 0.08,
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  style={{ display: 'flex', gap: 32, paddingBottom: i < ENTRIES.length - 1 ? 52 : 0 }}
                >
                  {/* Timeline dot */}
                  <div style={{ flexShrink: 0, width: 31, display: 'flex', justifyContent: 'center', paddingTop: 4 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: i === 0 ? 'var(--accent)' : 'var(--bg-tertiary)',
                      border: `2px solid ${i === 0 ? 'var(--accent)' : 'var(--border-strong)'}`,
                      boxShadow: i === 0 ? '0 0 0 4px var(--accent-faint)' : 'none',
                      zIndex: 1, position: 'relative',
                      flexShrink: 0,
                      marginTop: 1,
                    }} />
                  </div>

                  {/* Entry content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Version badge + date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: 6,
                        background: i === 0 ? 'var(--accent)' : 'var(--bg-secondary)',
                        color: i === 0 ? '#fff' : 'var(--accent)',
                        border: `1px solid ${i === 0 ? 'var(--accent)' : 'var(--accent-mid)'}`,
                        fontFamily: 'var(--font-power)', fontSize: 13, fontWeight: 700,
                        letterSpacing: '-0.01em',
                      }}>
                        {entry.version}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-outfit)', fontSize: 12,
                        color: 'var(--text-tertiary)', letterSpacing: '0.02em',
                      }}>
                        {entry.date}
                      </span>
                    </div>

                    {/* Bullet list */}
                    <ul style={{
                      listStyle: 'none', padding: 0, margin: 0,
                      display: 'flex', flexDirection: 'column', gap: 10,
                    }}>
                      {entry.items.map((item, j) => {
                        const [before, ...rest] = item.split(' — ')
                        const after = rest.join(' — ')
                        return (
                          <motion.li
                            key={j}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 + i * 0.08 + j * 0.04, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}
                          >
                            <div style={{
                              width: 5, height: 5, borderRadius: '50%',
                              background: 'var(--accent)', flexShrink: 0,
                              marginTop: 7, opacity: 0.6,
                            }} />
                            <p style={{
                              fontFamily: 'var(--font-outfit)', fontSize: 14,
                              color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0,
                            }}>
                              {after ? (
                                <>
                                  <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{before}</strong>
                                  {' — '}
                                  {after}
                                </>
                              ) : (
                                item
                              )}
                            </p>
                          </motion.li>
                        )
                      })}
                    </ul>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
