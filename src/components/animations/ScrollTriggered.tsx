'use client'

import { useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion'
import {
  scrollFadeUp, scrollFadeLeft, scrollFadeRight,
  scrollScale, scrollRotateIn, scrollStagger, scrollStaggerItem, scrollFlipUp,
} from '@/lib/variants/scroll'

/* ─── Scroll-linked horizontal progress ─── */
export function ScrollLinkedProgress() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const springWidth = useSpring(width as unknown as number, { stiffness: 200, damping: 30 })

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div style={{
        height: 4, width: '100%', borderRadius: 99,
        background: 'var(--bg-tertiary)', overflow: 'hidden', marginBottom: 8,
      }}>
        <motion.div style={{ height: '100%', background: 'var(--accent)', borderRadius: 99, width }} />
      </div>
      <span style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)' }}>
        Scroll progress — linked to this element's visibility
      </span>
    </div>
  )
}

/* ─── Parallax text on scroll ─── */
export function ScrollParallaxText() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const y1 = useTransform(scrollYProgress, [0, 1], [60, -60])
  const y2 = useTransform(scrollYProgress, [0, 1], [30, -30])
  const y3 = useTransform(scrollYProgress, [0, 1], [80, -80])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <div ref={ref} style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
      <motion.p style={{ y: y1, opacity, position: 'absolute', top: 20, left: 0, fontFamily: 'var(--font-power)', fontSize: 38, fontWeight: 700, letterSpacing: '-0.04em', color: 'var(--text-primary)', whiteSpace: 'nowrap' }}>
        Scroll
      </motion.p>
      <motion.p style={{ y: y2, opacity, position: 'absolute', top: 60, left: 60, fontFamily: 'var(--font-power)', fontSize: 24, fontWeight: 300, letterSpacing: '-0.02em', color: 'var(--accent-light)', whiteSpace: 'nowrap' }}>
        — linked
      </motion.p>
      <motion.p style={{ y: y3, opacity, position: 'absolute', top: 95, left: 20, fontFamily: 'var(--font-power)', fontSize: 16, fontWeight: 300, letterSpacing: '-0.01em', color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
        parallax layers
      </motion.p>
    </div>
  )
}

/* ─── Count-up on scroll entry ─── */
function CountUp({ end, label }: { end: number; label: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const [displayed, setDisplayed] = useState(0)

  useRef(() => {
    if (!inView) return
    let start = 0
    const step = () => {
      start += Math.ceil(end / 40)
      if (start >= end) { setDisplayed(end); return }
      setDisplayed(start)
      requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  })

  // simpler approach — spring directly
  const count = useSpring(0, { stiffness: 60, damping: 20 })
  const [value, setDisplayedValue] = useState('0')

  count.on('change', v => setDisplayedValue(Math.round(v).toString()))

  const triggered = useRef(false)
  if (inView && !triggered.current) {
    triggered.current = true
    count.set(end)
  }

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <motion.span
        style={{
          fontFamily: 'var(--font-power)', fontSize: 52, fontWeight: 300,
          letterSpacing: '-0.04em', color: 'var(--text-primary)', display: 'block',
        }}
      >
        {value}
      </motion.span>
      <span style={{
        fontFamily: 'var(--font-outfit)', fontSize: 12,
        color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  )
}

/* ─── Main showcase ─── */
export function ScrollTriggeredShowcase() {
  return (
    <section id="scroll" style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 120px' }}>
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
        }}>Scroll-triggered</p>
        <h2 style={{
          fontFamily: 'var(--font-power)', fontSize: 'clamp(32px, 4vw, 48px)',
          fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--text-primary)',
          lineHeight: 1.1, marginBottom: 16,
        }}>
          Scroll drives everything.
        </h2>
        <p style={{
          fontFamily: 'var(--font-outfit)', fontSize: 16,
          color: 'var(--text-secondary)', lineHeight: 1.7,
        }}>
          Variants for <code style={{ fontSize: 13, background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 4 }}>whileInView</code>, scroll-linked transforms, count-up, staggered lists.
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>

        {/* scrollFadeUp */}
        <ScrollCard label="scrollFadeUp" category="whileInView" code={`import { scrollFadeUp } from '@splash/variants'\n\n<motion.div\n  variants={scrollFadeUp}\n  initial="offscreen"\n  whileInView="onscreen"\n  viewport={{ once: true, margin: '-60px' }}\n/>`}>
          <AnimBox variants={scrollFadeUp} label="Fades up on entry" />
        </ScrollCard>

        {/* scrollScale */}
        <ScrollCard label="scrollScale" category="whileInView" code={`import { scrollScale } from '@splash/variants'\n\n<motion.div\n  variants={scrollScale}\n  initial="offscreen"\n  whileInView="onscreen"\n  viewport={{ once: true }}\n/>`}>
          <AnimBox variants={scrollScale} label="Scales in on entry" shape="circle" />
        </ScrollCard>

        {/* scrollFlipUp */}
        <ScrollCard label="scrollFlipUp" category="whileInView" code={`import { scrollFlipUp } from '@splash/variants'\n\n<motion.div\n  style={{ transformPerspective: 800 }}\n  variants={scrollFlipUp}\n  initial="offscreen"\n  whileInView="onscreen"\n/>`}>
          <AnimBox variants={scrollFlipUp} label="Flips in on entry" perspective />
        </ScrollCard>

        {/* scrollFadeLeft / Right */}
        <ScrollCard label="scrollFadeLeft / Right" category="whileInView" code={`import { scrollFadeLeft, scrollFadeRight } from '@splash/variants'`}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <AnimBox variants={scrollFadeLeft} label="← left" small />
            <AnimBox variants={scrollFadeRight} label="right →" small />
          </div>
        </ScrollCard>

        {/* Stagger list */}
        <ScrollCard label="scrollStagger" category="stagger" code={`import { scrollStagger, scrollStaggerItem } from '@splash/variants'\n\n<motion.ul variants={scrollStagger} initial="offscreen" whileInView="onscreen">\n  {items.map(i => <motion.li variants={scrollStaggerItem} />)}\n</motion.ul>`}>
          <StaggerList />
        </ScrollCard>

        {/* scrollRotateIn */}
        <ScrollCard label="scrollRotateIn" category="whileInView" code={`import { scrollRotateIn } from '@splash/variants'\n\n<motion.div\n  variants={scrollRotateIn}\n  initial="offscreen"\n  whileInView="onscreen"\n/>`}>
          <AnimBox variants={scrollRotateIn} label="Rotates in" />
        </ScrollCard>

        {/* Scroll-linked progress */}
        <ScrollCard label="Scroll-linked" category="useScroll" code={`const { scrollYProgress } = useScroll({ target: ref })\nconst width = useTransform(scrollYProgress, [0,1], ['0%','100%'])`}>
          <ScrollLinkedProgress />
        </ScrollCard>

        {/* Parallax text */}
        <ScrollCard label="Parallax Text" category="useScroll" code={`const y = useTransform(scrollYProgress, [0,1], [60, -60])\n<motion.p style={{ y }}>Scroll</motion.p>`}>
          <ScrollParallaxText />
        </ScrollCard>

        {/* Count up */}
        <ScrollCard label="Count-up" category="useInView" code={`const inView = useInView(ref, { once: true })\nconst count = useSpring(0)\nif (inView) count.set(targetValue)`}>
          <div style={{ display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'center' }}>
            <CountUp end={127} label="variants" />
            <CountUp end={4200} label="stars" />
            <CountUp end={98} label="fps" />
          </div>
        </ScrollCard>

      </div>
    </section>
  )
}

/* ── helpers ── */

function ScrollCard({ label, category, code, children }: { label: string; category: string; code: string; children: React.ReactNode }) {
  const [showCode, setShowCode] = useState(false)
  const [copied, setCopied] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ borderRadius: 16, border: '1px solid var(--border)', background: 'var(--bg-secondary)', overflow: 'hidden' }}
    >
      <div style={{
        padding: 28, minHeight: 160,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border)',
      }}>
        {children}
      </div>
      <div style={{ padding: '14px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 500, letterSpacing: '0.07em', textTransform: 'uppercase', color: 'var(--accent-light)' }}>
            {category}
          </span>
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
          <pre style={{ marginTop: 12, padding: '12px 14px', borderRadius: 8, background: 'var(--bg)', border: '1px solid var(--border)', fontSize: 11.5, fontFamily: 'ui-monospace, monospace', color: 'var(--text-secondary)', overflowX: 'auto', lineHeight: 1.6 }}>
            {code}
          </pre>
        )}
      </div>
    </motion.div>
  )
}

const btnStyle = (active: boolean): React.CSSProperties => ({
  fontSize: 11, fontFamily: 'var(--font-outfit)', fontWeight: 500,
  padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border-strong)',
  background: active ? 'var(--accent-faint)' : 'transparent',
  color: active ? 'var(--accent)' : 'var(--text-tertiary)',
  cursor: 'pointer', transition: 'all 0.15s ease',
})

function AnimBox({
  variants, label, shape = 'square', perspective = false, small = false,
}: {
  variants: Parameters<typeof motion.div>[0]['variants']
  label?: string
  shape?: 'square' | 'circle'
  perspective?: boolean
  small?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-20px' })

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <motion.div
        variants={variants}
        initial="offscreen"
        animate={inView ? 'onscreen' : 'offscreen'}
        style={{
          width: small ? 48 : 64,
          height: small ? 48 : 64,
          borderRadius: shape === 'circle' ? '50%' : 12,
          background: 'var(--accent)',
          transformPerspective: perspective ? 800 : undefined,
        }}
      />
      {label && <span style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)' }}>{label}</span>}
    </div>
  )
}

function StaggerList() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: false, margin: '-20px' })

  const items = ['Design tokens', 'Motion variants', 'Spring presets', 'Scroll hooks']

  return (
    <motion.div
      ref={ref}
      variants={scrollStagger}
      initial="offscreen"
      animate={inView ? 'onscreen' : 'offscreen'}
      style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}
    >
      {items.map((item) => (
        <motion.div
          key={item}
          variants={scrollStaggerItem}
          style={{
            padding: '8px 14px', borderRadius: 8,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            fontFamily: 'var(--font-outfit)', fontSize: 13, color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
          {item}
        </motion.div>
      ))}
    </motion.div>
  )
}
