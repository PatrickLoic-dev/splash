'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  pageFade, pageSlideUp, pageSlideLeft,
  pageScale, pageFlip, pageDoor, pageReveal,
} from '@/lib/variants/pageTransitions'
import type { Variants } from 'framer-motion'

const TRANSITIONS: { key: string; label: string; variants: Variants; description: string }[] = [
  { key: 'fade', label: 'pageFade', variants: pageFade, description: 'Simple opacity cross-fade. The safe default.' },
  { key: 'slideUp', label: 'pageSlideUp', variants: pageSlideUp, description: 'New page rises while old one exits upward.' },
  { key: 'slideLeft', label: 'pageSlideLeft', variants: pageSlideLeft, description: 'Horizontal slide — ideal for wizard flows.' },
  { key: 'scale', label: 'pageScale', variants: pageScale, description: 'Subtle scale-in. Feels native and modern.' },
  { key: 'flip', label: 'pageFlip', variants: pageFlip, description: '3D Y-axis rotation with perspective.' },
  { key: 'door', label: 'pageDoor', variants: pageDoor, description: 'Scale from left edge — like opening a door.' },
  { key: 'reveal', label: 'pageReveal', variants: pageReveal, description: 'Clip-path wipe from left to right.' },
]

const PAGES = [
  { bg: 'var(--accent)', label: 'Page 01', icon: '◈' },
  { bg: '#1D9E75', label: 'Page 02', icon: '✦' },
  { bg: '#D85A30', label: 'Page 03', icon: '⚡' },
  { bg: '#BA7517', label: 'Page 04', icon: '◎' },
]

function PageDemo({ variants }: { variants: Variants }) {
  const [pageIndex, setPageIndex] = useState(0)
  const page = PAGES[pageIndex]

  const next = () => setPageIndex(i => (i + 1) % PAGES.length)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
      <div style={{
        width: '100%', height: 120, borderRadius: 12,
        overflow: 'hidden', position: 'relative',
        background: 'var(--bg)',
        border: '1px solid var(--border)',
      }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pageIndex}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              position: 'absolute', inset: 0,
              background: page.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 6,
            }}
          >
            <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.9)' }}>{page.icon}</span>
            <span style={{
              fontFamily: 'var(--font-power)', fontSize: 14, fontWeight: 400,
              color: 'rgba(255,255,255,0.75)', letterSpacing: '0.04em',
            }}>
              {page.label}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <button
        onClick={next}
        style={{
          padding: '6px 18px', borderRadius: 8,
          border: '1px solid var(--border-strong)', background: 'transparent',
          color: 'var(--text-secondary)', fontSize: 12,
          fontFamily: 'var(--font-outfit)', cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
      >
        next page →
      </button>
    </div>
  )
}

/* Curtain demo */
function CurtainDemo() {
  const [visible, setVisible] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)

  const trigger = () => {
    setVisible(true)
    setTimeout(() => {
      setPageIndex(i => (i + 1) % PAGES.length)
      setVisible(false)
    }, 500)
  }

  const page = PAGES[pageIndex]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, width: '100%' }}>
      <div style={{
        width: '100%', height: 120, borderRadius: 12,
        overflow: 'hidden', position: 'relative',
        background: page.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 6,
        border: '1px solid var(--border)',
      }}>
        <span style={{ fontSize: 28, color: 'rgba(255,255,255,0.9)' }}>{page.icon}</span>
        <span style={{ fontFamily: 'var(--font-power)', fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
          {page.label}
        </span>

        {/* Curtain overlay */}
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={{ scaleX: 0, originX: '0%' }}
              animate={{ scaleX: 1, originX: '0%', transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ scaleX: 0, originX: '100%', transition: { duration: 0.25, ease: 'easeIn', delay: 0.05 } }}
              style={{
                position: 'absolute', inset: 0,
                background: 'var(--accent)',
                zIndex: 10,
              }}
            />
          )}
        </AnimatePresence>
      </div>
      <button
        onClick={trigger}
        style={{
          padding: '6px 18px', borderRadius: 8,
          border: '1px solid var(--border-strong)', background: 'transparent',
          color: 'var(--text-secondary)', fontSize: 12,
          fontFamily: 'var(--font-outfit)', cursor: 'pointer',
        }}
      >
        trigger curtain →
      </button>
    </div>
  )
}

/* Code block for Next.js usage */
const NEXTJS_CODE = `// app/layout.tsx
import { PageTransitionWrapper } from '@splash/variants'
import { pageSlideUp } from '@splash/variants'
import { usePathname } from 'next/navigation'

export default function Layout({ children }) {
  const pathname = usePathname()

  return (
    <PageTransitionWrapper
      motionKey={pathname}
      variants={pageSlideUp}
    >
      {children}
    </PageTransitionWrapper>
  )
}`

/* ─── Main section ─── */
export function PageTransitionsShowcase() {
  const [copied, setCopied] = useState(false)

  return (
    <section id="page-transitions" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 120px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 56, maxWidth: 560 }}
      >
        <p style={{
          fontSize: 12, fontFamily: 'var(--font-outfit)', fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--accent-light)', marginBottom: 12,
        }}>Page Transitions</p>
        <h2 style={{
          fontFamily: 'var(--font-power)', fontSize: 'clamp(32px, 4vw, 48px)',
          fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--text-primary)',
          lineHeight: 1.1, marginBottom: 16,
        }}>
          Routes, animated.
        </h2>
        <p style={{
          fontFamily: 'var(--font-outfit)', fontSize: 16,
          color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24,
        }}>
          7 ready-made page transition variants for Next.js App Router.
          Drop <code style={{ fontSize: 13, background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 4 }}>PageTransitionWrapper</code> in your layout — done.
        </p>

        {/* Quick-start code */}
        <div style={{
          position: 'relative', borderRadius: 12,
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          overflow: 'hidden',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 16px', borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
              app/layout.tsx
            </span>
            <button
              onClick={() => { navigator.clipboard.writeText(NEXTJS_CODE); setCopied(true); setTimeout(() => setCopied(false), 1800) }}
              style={{
                fontSize: 11, fontFamily: 'var(--font-outfit)', padding: '3px 10px',
                borderRadius: 5, border: '1px solid var(--border-strong)',
                background: copied ? 'var(--accent-faint)' : 'transparent',
                color: copied ? 'var(--accent)' : 'var(--text-tertiary)',
                cursor: 'pointer',
              }}
            >
              {copied ? '✓ copied' : 'copy'}
            </button>
          </div>
          <pre style={{
            padding: '16px 20px', fontSize: 12, fontFamily: 'ui-monospace, monospace',
            color: 'var(--text-secondary)', overflowX: 'auto', lineHeight: 1.7,
            margin: 0,
          }}>
            {NEXTJS_CODE}
          </pre>
        </div>
      </motion.div>

      {/* Transition demos grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, marginBottom: 20 }}>
        {TRANSITIONS.map((t, i) => (
          <motion.div
            key={t.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
            style={{
              borderRadius: 16, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', overflow: 'hidden',
            }}
          >
            <div style={{ padding: 20, background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
              <PageDemo variants={t.variants} />
            </div>
            <div style={{ padding: '14px 18px' }}>
              <p style={{
                fontFamily: 'var(--font-power)', fontSize: 14, fontWeight: 500,
                letterSpacing: '-0.01em', color: 'var(--accent-light)', marginBottom: 4,
              }}>
                {t.label}
              </p>
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
                {t.description}
              </p>
            </div>
          </motion.div>
        ))}

        {/* Curtain special card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{
            borderRadius: 16, border: '1px solid var(--border)',
            background: 'var(--bg-secondary)', overflow: 'hidden',
          }}
        >
          <div style={{ padding: 20, background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)' }}>
            <CurtainDemo />
          </div>
          <div style={{ padding: '14px 18px' }}>
            <p style={{
              fontFamily: 'var(--font-power)', fontSize: 14, fontWeight: 500,
              letterSpacing: '-0.01em', color: 'var(--accent-light)', marginBottom: 4,
            }}>
              CurtainTransition
            </p>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.5 }}>
              Overlay wipe between routes — covers old page, reveals new one.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
