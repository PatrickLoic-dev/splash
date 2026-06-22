'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { MorphingShape, FluidBlob, PathDraw, LogoMorph } from './MorphingShape'
import { clipReveal, morphPulse, morphRotate } from '@/lib/variants/morphing'

const CLIP_ITEMS = [
  { label: 'Design', color: 'var(--accent)' },
  { label: 'Code', color: 'var(--accent-light)' },
  { label: 'Motion', color: '#1D9E75' },
  { label: 'Ship', color: '#D85A30' },
]

export function MorphingShowcase() {
  const [clipKey, setClipKey] = useState(0)

  return (
    <section id="morphing" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 120px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 56, maxWidth: 520 }}
      >
        <p style={{
          fontSize: 12, fontFamily: 'var(--font-outfit)', fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--accent-light)', marginBottom: 12,
        }}>Morphing</p>
        <h2 style={{
          fontFamily: 'var(--font-power)', fontSize: 'clamp(32px, 4vw, 48px)',
          fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--text-primary)',
          lineHeight: 1.1, marginBottom: 16,
        }}>
          SVG paths, alive.
        </h2>
        <p style={{
          fontFamily: 'var(--font-outfit)', fontSize: 16,
          color: 'var(--text-secondary)', lineHeight: 1.7,
        }}>
          Shape morphing, fluid blobs, path drawing, clip-path reveals.
          All driven by Framer Motion's <code style={{ fontSize: 13, background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 4 }}>animate</code> on SVG attributes.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {/* Shape morpher */}
        <Card label="Shape Morpher" category="SVG" code={`import { MorphingShape } from '@splash/variants'\n\n<MorphingShape autoplay interval={1800} />`}>
          <MorphingShape />
        </Card>

        {/* Fluid blob */}
        <Card label="Fluid Blob" category="SVG" code={`import { FluidBlob } from '@splash/variants'\n\n<FluidBlob />`}>
          <FluidBlob />
        </Card>

        {/* Path draw */}
        <Card label="Path Draw" category="pathLength" code={`<motion.path\n  initial={{ pathLength: 0 }}\n  animate={{ pathLength: 1 }}\n  transition={{ duration: 1.4 }}\n/>`}>
          <PathDraw />
        </Card>

        {/* Logo morph */}
        <Card label="Logo Morph" category="SVG" code={`import { LogoMorph } from '@splash/variants'\n\n<LogoMorph />`}>
          <LogoMorph />
        </Card>

        {/* Clip-path reveal */}
        <Card label="Clip Reveal" category="clipPath" code={`import { clipReveal } from '@splash/variants'\n\n<motion.div\n  variants={clipReveal}\n  initial="hidden"\n  animate="visible"\n/>`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', width: '100%' }}>
            {CLIP_ITEMS.map((item, i) => (
              <motion.div
                key={`${clipKey}-${i}`}
                variants={clipReveal}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 }}
                style={{
                  width: '80%', padding: '10px 18px',
                  borderRadius: 8, background: item.color,
                  fontFamily: 'var(--font-power)', fontWeight: 500,
                  fontSize: 15, color: '#fff', letterSpacing: '-0.01em',
                }}
              >
                {item.label}
              </motion.div>
            ))}
            <button
              onClick={() => setClipKey(k => k + 1)}
              style={{
                marginTop: 4, padding: '5px 14px', borderRadius: 7,
                border: '1px solid var(--border-strong)', background: 'transparent',
                color: 'var(--text-tertiary)', fontSize: 12, fontFamily: 'var(--font-outfit)',
                cursor: 'pointer',
              }}
            >
              ↺ replay
            </button>
          </div>
        </Card>

        {/* Morph rotate */}
        <Card label="Morph Rotate" category="Variants" code={`import { morphRotate, morphPulse } from '@splash/variants'\n\n<motion.div variants={morphRotate} />`}>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', justifyContent: 'center' }}>
            <MorphBox variants={morphRotate} label="rotate" />
            <MorphBox variants={morphPulse} label="pulse" />
          </div>
        </Card>
      </div>
    </section>
  )
}

/* ── helpers ── */

function Card({ label, category, code, children }: { label: string; category: string; code: string; children: React.ReactNode }) {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        borderRadius: 16, border: '1px solid var(--border)',
        background: 'var(--bg-secondary)', overflow: 'hidden',
      }}
    >
      <div style={{
        padding: 28, minHeight: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)',
      }}>
        {children}
      </div>
      <div style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{
              fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 500,
              letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--accent-light)',
            }}>{category}</span>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => setShowCode(v => !v)} style={btnStyle(showCode)}>{'</>'}</button>
            <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1800) }} style={btnStyle(copied)}>
              {copied ? '✓' : 'copy'}
            </button>
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-power)', fontSize: 15, fontWeight: 500, letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>
          {label}
        </p>
        {showCode && (
          <pre style={{
            marginTop: 12, padding: '12px 14px', borderRadius: 8,
            background: 'var(--bg)', border: '1px solid var(--border)',
            fontSize: 11.5, fontFamily: 'ui-monospace, monospace',
            color: 'var(--text-secondary)', overflowX: 'auto', lineHeight: 1.6,
          }}>{code}</pre>
        )}
      </div>
    </motion.div>
  )
}

function MorphBox({ variants, label }: { variants: Parameters<typeof motion.div>[0]['variants']; label: string }) {
  const [key, setKey] = useState(0)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <motion.div
        key={key}
        variants={variants}
        initial="hidden"
        animate="visible"
        onClick={() => setKey(k => k + 1)}
        style={{
          width: 60, height: 60, borderRadius: 12,
          background: 'var(--accent)', cursor: 'pointer',
        }}
      />
      <span style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)' }}>
        {label}
      </span>
    </div>
  )
}

const btnStyle = (active: boolean): React.CSSProperties => ({
  fontSize: 11, fontFamily: 'var(--font-outfit)', fontWeight: 500,
  padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border-strong)',
  background: active ? 'var(--accent-faint)' : 'transparent',
  color: active ? 'var(--accent)' : 'var(--text-tertiary)',
  cursor: 'pointer', transition: 'all 0.15s ease',
})
