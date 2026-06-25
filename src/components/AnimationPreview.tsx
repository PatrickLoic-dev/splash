'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate as fmAnimate, useScroll } from 'framer-motion'
import type { Context } from '@/lib/learnContent'

/* ── Shared shimmer ─────────────────────────────────────────────────────── */

function Shimmer({ width = '100%', height = 10, radius = 4 }: {
  width?: string | number
  height?: number
  radius?: number
}) {
  return (
    <div style={{
      width, height, borderRadius: radius,
      overflow: 'hidden', background: 'var(--bg-tertiary)',
      position: 'relative', flexShrink: 0,
    }}>
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

/* ── 1. Entrance Reveal ─────────────────────────────────────────────────── */

function EntranceRevealWeb({ step }: { step: number }) {
  const rows = [
    { color: '#534AB7', stat: '↑ 12%' },
    { color: '#1D9E75', stat: '↑  8%' },
    { color: '#D85A30', stat: '↓  2%' },
  ]
  return (
    <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
      {rows.map((row, i) => (
        <motion.div
          key={i}
          initial={step === 0 ? false : { opacity: 0, y: step >= 2 ? 22 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: step >= 3 ? 0.15 + i * 0.14 : 0,
            duration: 0.6,
            ease: step >= 2 ? [0.22, 1, 0.36, 1] : 'easeOut',
          }}
          style={{
            padding: '12px 14px', borderRadius: 10,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 12,
          }}
        >
          <div style={{ width: 30, height: 30, borderRadius: 8, background: row.color, flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ width: 56, height: 7, borderRadius: 3, background: 'var(--text-secondary)', opacity: 0.6 }} />
            <div style={{ width: 88, height: 5, borderRadius: 3, background: 'var(--border-strong)' }} />
          </div>
          <span style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)', fontWeight: 600 } as React.CSSProperties}>
            {row.stat}
          </span>
        </motion.div>
      ))}
    </div>
  )
}

function EntranceRevealMobile({ step }: { step: number }) {
  const items = [
    { label: 'Messages', sub: '3 unread', color: '#534AB7' },
    { label: 'Camera',   sub: 'Open',     color: '#1D9E75' },
    { label: 'Notes',    sub: '12 saved', color: '#BA7517' },
  ]
  return (
    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {items.map((item, i) => (
        <motion.div
          key={i}
          initial={step === 0 ? false : { opacity: 0, y: step >= 2 ? 16 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: step >= 3 ? 0.15 + i * 0.12 : 0,
            duration: 0.5,
            ease: step >= 2 ? [0.22, 1, 0.36, 1] : 'easeOut',
          }}
          style={{
            padding: '9px 10px', borderRadius: 12,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 9,
          }}
        >
          <div style={{ width: 34, height: 34, borderRadius: 10, background: item.color, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-primary)', fontWeight: 500 }}>{item.label}</div>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)', marginTop: 2 }}>{item.sub}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

/* ── 2. Page Transitions ────────────────────────────────────────────────── */

function PTOverviewContent({ onDetail }: { onDetail: () => void }) {
  return (
    <div>
      <div style={{ width: 80, height: 9, borderRadius: 4, background: 'var(--text-primary)', marginBottom: 8 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{ height: 48, borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border)' }} />
        ))}
      </div>
      <button onClick={onDetail} style={{
        fontSize: 11, padding: '6px 14px', borderRadius: 6,
        background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
        fontFamily: 'var(--font-outfit)',
      }}>
        View detail →
      </button>
    </div>
  )
}

function PTDetailContent({ onBack }: { onBack: () => void }) {
  return (
    <div>
      <button onClick={onBack} style={{
        fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none',
        cursor: 'pointer', fontFamily: 'var(--font-outfit)', marginBottom: 12, padding: 0,
      }}>
        ← Overview
      </button>
      <div style={{ width: '100%', height: 70, borderRadius: 10, background: 'var(--accent)', opacity: 0.18, marginBottom: 10 }} />
      <div style={{ width: 100, height: 9, borderRadius: 4, background: 'var(--text-primary)', marginBottom: 6 }} />
      <div style={{ width: 140, height: 6, borderRadius: 3, background: 'var(--border-strong)', marginBottom: 4 }} />
      <div style={{ width: 120, height: 6, borderRadius: 3, background: 'var(--border-strong)' }} />
    </div>
  )
}

function PageTransitionsWeb({ step }: { step: number }) {
  const [page, setPage] = useState<'overview' | 'detail'>('overview')

  const tabBar = (
    <div style={{
      height: 36, background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 16px', gap: 20, flexShrink: 0,
    }}>
      {(['overview', 'detail'] as const).map(p => (
        <button key={p} onClick={() => setPage(p)} style={{
          fontSize: 11, fontFamily: 'var(--font-outfit)', fontWeight: page === p ? 600 : 400,
          color: page === p ? 'var(--accent)' : 'var(--text-secondary)',
          background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0',
          borderBottom: `2px solid ${page === p ? 'var(--accent)' : 'transparent'}`,
          textTransform: 'capitalize',
        }}>
          {p}
        </button>
      ))}
    </div>
  )

  if (step === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 240 }}>
        {tabBar}
        <div style={{ flex: 1, padding: 16 }}>
          {page === 'overview'
            ? <PTOverviewContent onDetail={() => setPage('detail')} />
            : <PTDetailContent onBack={() => setPage('overview')} />
          }
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 240 }}>
      {tabBar}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode={step >= 3 ? 'wait' : undefined}>
          <motion.div
            key={page}
            initial={{ opacity: 0, y: step >= 2 ? 14 : 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: step >= 2 ? -14 : 0 }}
            transition={{ duration: 0.28, ease: step >= 2 ? [0.22, 1, 0.36, 1] as [number,number,number,number] : 'easeOut' as const }}
            style={{ position: 'absolute', inset: 0, padding: 16 }}
          >
            {page === 'overview'
              ? <PTOverviewContent onDetail={() => setPage('detail')} />
              : <PTDetailContent onBack={() => setPage('overview')} />
            }
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

function PageTransitionsMobile({ step }: { step: number }) {
  const [page, setPage] = useState<'list' | 'detail'>('list')
  const slideDir = 24

  const listContent = (
    <div style={{ padding: '8px 10px' }}>
      <div style={{ fontSize: 12, fontFamily: 'var(--font-power)', color: 'var(--text-primary)', marginBottom: 10, fontWeight: 400 }}>Inbox</div>
      {(['Project update', 'Team standup', 'New message'] as const).map((item, i) => (
        <div key={i} onClick={() => setPage('detail')} style={{
          padding: '8px 10px', borderRadius: 10,
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          marginBottom: 6, cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: ['#534AB7','#1D9E75','#D85A30'][i], flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-outfit)', color: 'var(--text-primary)', fontWeight: 500 }}>{item}</div>
            <div style={{ fontSize: 8, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)', marginTop: 1 }}>Tap to open →</div>
          </div>
        </div>
      ))}
    </div>
  )

  const detailContent = (
    <div style={{ padding: '8px 10px' }}>
      <button onClick={() => setPage('list')} style={{
        fontSize: 10, color: 'var(--accent)', background: 'none', border: 'none',
        cursor: 'pointer', fontFamily: 'var(--font-outfit)', marginBottom: 8, padding: 0,
      }}>
        ← Back
      </button>
      <div style={{ width: '100%', height: 58, borderRadius: 10, background: 'var(--accent)', opacity: 0.22, marginBottom: 10 }} />
      <div style={{ fontSize: 11, fontFamily: 'var(--font-power)', color: 'var(--text-primary)', marginBottom: 6 }}>Project update</div>
      {[0,1,2].map(i => (
        <div key={i} style={{ width: ['100%','85%','92%'][i], height: 5, borderRadius: 2, background: 'var(--border-strong)', marginBottom: 4 }} />
      ))}
    </div>
  )

  if (step === 0) {
    return (
      <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
        {page === 'list' ? listContent : detailContent}
      </div>
    )
  }

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode={step >= 3 ? 'wait' : undefined}>
        {page === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, x: step >= 2 ? -slideDir : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step >= 2 ? -slideDir : 0 }}
            transition={{ duration: 0.28, ease: step >= 2 ? [0.22,1,0.36,1] as [number,number,number,number] : 'easeOut' as const }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {listContent}
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: step >= 2 ? slideDir : 0 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: step >= 2 ? slideDir : 0 }}
            transition={{ duration: 0.28, ease: step >= 2 ? [0.22,1,0.36,1] as [number,number,number,number] : 'easeOut' as const }}
            style={{ position: 'absolute', inset: 0 }}
          >
            {detailContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── 3. Gesture Feedback ────────────────────────────────────────────────── */

function GestureFeedbackWeb({ step }: { step: number }) {
  return (
    <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'stretch' }}>
      <motion.button
        whileTap={step >= 1 ? { scale: 0.94 } : undefined}
        whileHover={step >= 2 ? { scale: 1.025, y: -2 } : undefined}
        transition={step >= 3 ? { type: 'spring', stiffness: 400, damping: 17 } : undefined}
        style={{
          padding: '12px 0', borderRadius: 10,
          background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
          fontSize: 13, fontFamily: 'var(--font-outfit)', fontWeight: 500,
        }}
      >
        {step === 0 ? 'Click me' : step === 1 ? 'Press — tap feedback' : 'Press me — feel the spring'}
      </motion.button>

      {step >= 3 ? (
        <motion.div
          drag="x"
          dragConstraints={{ left: -70, right: 70 }}
          dragElastic={0.25}
          whileDrag={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
          style={{
            padding: '12px 16px', borderRadius: 10, cursor: 'grab',
            border: '1px solid var(--border)', background: 'var(--bg-secondary)',
            fontSize: 12, fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)',
            textAlign: 'center', userSelect: 'none',
          }}
        >
          ← Drag me →
        </motion.div>
      ) : (
        <div style={{
          padding: '12px 16px', borderRadius: 10,
          border: '1px dashed var(--border)', background: 'var(--bg-secondary)',
          fontSize: 12, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)',
          textAlign: 'center', opacity: 0.5,
        }}>
          Drag (step 4)
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        {['Like', 'Save', 'Share'].map(label => (
          <motion.button
            key={label}
            whileTap={step >= 1 ? { scale: 1.25 } : undefined}
            transition={step >= 3 ? { type: 'spring', stiffness: 500, damping: 15 } : undefined}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 8,
              border: '1px solid var(--border)', background: 'var(--bg)',
              fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            {label}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

function GestureFeedbackMobile({ step }: { step: number }) {
  return (
    <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'stretch' }}>
      <motion.button
        whileTap={step >= 1 ? { scale: 0.93 } : undefined}
        transition={step >= 3 ? { type: 'spring', stiffness: 400, damping: 17 } : undefined}
        style={{
          padding: '11px 0', borderRadius: 12,
          background: 'var(--accent)', color: '#fff', border: 'none', cursor: 'pointer',
          fontSize: 12, fontFamily: 'var(--font-outfit)', fontWeight: 500,
        }}
      >
        {step === 0 ? 'Tap' : 'Tap me'}
      </motion.button>

      {step >= 3 ? (
        <motion.div
          drag="x"
          dragConstraints={{ left: -40, right: 40 }}
          dragElastic={0.35}
          style={{
            padding: '10px 12px', borderRadius: 12, cursor: 'grab',
            border: '1px solid var(--border)', background: 'var(--bg-secondary)',
            fontSize: 10, fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)',
            textAlign: 'center', userSelect: 'none',
          }}
        >
          Swipe to dismiss
        </motion.div>
      ) : (
        <div style={{
          padding: '10px 12px', borderRadius: 12,
          border: '1px dashed var(--border)', background: 'var(--bg-secondary)',
          fontSize: 10, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)',
          textAlign: 'center', opacity: 0.5,
        }}>
          Swipe (step 4)
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        {['♥', '★', '⋯'].map((icon, i) => (
          <motion.button
            key={i}
            whileTap={step >= 1 ? { scale: 1.35 } : undefined}
            transition={step >= 3 ? { type: 'spring', stiffness: 500, damping: 14 } : undefined}
            style={{
              width: 44, height: 44, borderRadius: 22,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              fontSize: 18, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {icon}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

/* ── 4. Parallax ────────────────────────────────────────────────────────── */

function ParallaxWeb({ step }: { step: number }) {
  const p    = useMotionValue(0)
  const bgY  = useTransform(p, [0, 1], [0, -56])
  const textY = useTransform(p, [0, 1], [10, -10])

  useEffect(() => {
    if (step === 0) return
    const c = fmAnimate(p, [0, 1], { duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' })
    return c.stop
  }, [step, p])

  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: 240 }}>
      <motion.div style={{
        position: 'absolute', inset: '-20%',
        y: step >= 1 ? bgY : 0,
        background: 'radial-gradient(ellipse at 50% 50%, var(--accent) 0%, transparent 65%)',
        opacity: 0.2,
      }} />
      <motion.div style={{ position: 'absolute', inset: 0, y: step >= 1 ? bgY : 0 }}>
        {[
          { left: '12%', top: '25%', w: 52, h: 52, r: 12, c: '#534AB7' },
          { left: '72%', top: '15%', w: 36, h: 36, r: 9,  c: '#1D9E75' },
          { left: '55%', top: '62%', w: 68, h: 26, r: 8,  c: '#D85A30' },
        ].map((s, i) => (
          <div key={i} style={{
            position: 'absolute', left: s.left, top: s.top,
            width: s.w, height: s.h, borderRadius: s.r,
            background: s.c, opacity: 0.12,
          }} />
        ))}
      </motion.div>
      <motion.div style={{ position: 'relative', zIndex: 1, y: step >= 2 ? textY : 0, padding: '44px 24px 24px' }}>
        <div style={{ width: 52, height: 7, borderRadius: 3, background: 'var(--accent)', opacity: 0.5, marginBottom: 10 }} />
        <div style={{ width: 130, height: 11, borderRadius: 4, background: 'var(--text-primary)', marginBottom: 8 }} />
        <div style={{ width: 108, height: 7, borderRadius: 3, background: 'var(--border-strong)', marginBottom: 6 }} />
        <div style={{ width: 90, height: 7, borderRadius: 3, background: 'var(--border-strong)' }} />
      </motion.div>
      {step >= 3 && (
        <div style={{
          position: 'absolute', bottom: 8, right: 10,
          fontSize: 8, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)',
          letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          auto-scrolling
        </div>
      )}
      {step === 0 && (
        <div style={{
          position: 'absolute', bottom: 8, right: 10,
          fontSize: 8, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)',
          letterSpacing: '0.08em', textTransform: 'uppercase', opacity: 0.5,
        }}>
          static
        </div>
      )}
    </div>
  )
}

function ParallaxMobile({ step }: { step: number }) {
  const p    = useMotionValue(0)
  const bgY  = useTransform(p, [0, 1], [0, -40])
  const textY = useTransform(p, [0, 1], [8, -8])

  useEffect(() => {
    if (step === 0) return
    const c = fmAnimate(p, [0, 1], { duration: 4, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' })
    return c.stop
  }, [step, p])

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <motion.div style={{
        position: 'absolute', top: '-10%', left: 0, right: 0, height: '55%',
        y: step >= 1 ? bgY : 0,
        background: 'linear-gradient(145deg, #534AB7 0%, #1D9E75 100%)',
        opacity: 0.45,
      }} />
      <motion.div style={{ position: 'relative', zIndex: 1, y: step >= 2 ? textY : 0, padding: '88px 10px 10px' }}>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-power)', color: 'var(--text-primary)', fontWeight: 400, marginBottom: 4 }}>Explore</div>
        <div style={{ fontSize: 9, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)', marginBottom: 10 }}>
          {step === 0 ? 'Static layout' : 'Scroll to discover'}
        </div>
        {[1,2].map(i => (
          <div key={i} style={{ height: 38, borderRadius: 9, background: 'var(--bg-secondary)', border: '1px solid var(--border)', marginBottom: 6 }} />
        ))}
      </motion.div>
    </div>
  )
}

/* ── 5. Skeleton Loading ────────────────────────────────────────────────── */

function SkeletonLoadingWeb({ step }: { step: number }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (step < 2) return
    const t = setTimeout(() => setLoaded(true), 1800)
    return () => clearTimeout(t)
  }, [step])

  // Step 0: plain grey rectangles, no shimmer
  if (step === 0) {
    return (
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-tertiary)', flexShrink: 0 }} />
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 2 }}>
            <div style={{ width: '55%', height: 9, borderRadius: 4, background: 'var(--bg-tertiary)' }} />
            <div style={{ width: '80%', height: 7, borderRadius: 3, background: 'var(--bg-tertiary)' }} />
            <div style={{ width: '65%', height: 7, borderRadius: 3, background: 'var(--bg-tertiary)' }} />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <div style={{ width: '100%', height: 7, borderRadius: 3, background: 'var(--bg-tertiary)' }} />
          <div style={{ width: '88%',  height: 7, borderRadius: 3, background: 'var(--bg-tertiary)' }} />
          <div style={{ width: '94%',  height: 7, borderRadius: 3, background: 'var(--bg-tertiary)' }} />
        </div>
      </div>
    )
  }

  const skeleton = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 10 }}>
        <Shimmer width={40} height={40} radius={8} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6, paddingTop: 2 }}>
          <Shimmer width="55%" height={9} />
          <Shimmer width="80%" height={7} />
          <Shimmer width="65%" height={7} />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <Shimmer width="100%" height={7} />
        <Shimmer width="88%"  height={7} />
        <Shimmer width="94%"  height={7} />
      </div>
    </div>
  )

  const realContent = (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 8, background: '#534AB7', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 12, fontFamily: 'var(--font-outfit)', color: 'var(--text-primary)', fontWeight: 600 }}>Sarah Chen</div>
          <div style={{ fontSize: 10, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)' }}>Product Designer</div>
        </div>
      </div>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
        Working on the new design system for Q3 — just wrapped up the icon library.
      </div>
    </div>
  )

  // Step 1: shimmer only, no transition to real content
  if (step === 1) {
    return <div style={{ padding: 16 }}>{skeleton}</div>
  }

  // Steps 2+: AnimatePresence crossfade
  return (
    <div style={{ padding: 16 }}>
      <AnimatePresence mode="wait">
        {!loaded ? (
          <motion.div key="sk" exit={{ opacity: 0 }} transition={{ duration: step >= 3 ? 0.3 : 0.08 }}>
            {skeleton}
          </motion.div>
        ) : (
          <motion.div key="real" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: step >= 3 ? 0.4 : 0.08 }}>
            {realContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function SkeletonLoadingMobile({ step }: { step: number }) {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (step < 2) return
    const t = setTimeout(() => setLoaded(true), 1800)
    return () => clearTimeout(t)
  }, [step])

  function SkRow({ shimmer }: { shimmer: boolean }) {
    return (
      <div style={{
        padding: 10, borderRadius: 10, background: 'var(--bg-secondary)',
        border: '1px solid var(--border)', marginBottom: 8,
        display: 'flex', gap: 8,
      }}>
        {shimmer
          ? <Shimmer width={34} height={34} radius={9} />
          : <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--bg-tertiary)', flexShrink: 0 }} />
        }
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
          {shimmer ? <><Shimmer width="52%" height={8} /><Shimmer width="78%" height={6} /></> : (
            <>
              <div style={{ width: '52%', height: 8, borderRadius: 4, background: 'var(--bg-tertiary)' }} />
              <div style={{ width: '78%', height: 6, borderRadius: 3, background: 'var(--bg-tertiary)' }} />
            </>
          )}
        </div>
      </div>
    )
  }

  if (step < 2) {
    return (
      <div style={{ padding: '8px 10px' }}>
        <SkRow shimmer={step === 1} />
        <SkRow shimmer={step === 1} />
      </div>
    )
  }

  const realItems = [
    { name: 'Alex Kim', msg: 'On my way!',     color: '#534AB7' },
    { name: 'Maria L', msg: 'See you at 3pm', color: '#1D9E75' },
  ]

  return (
    <div style={{ padding: '8px 10px' }}>
      <AnimatePresence mode="wait">
        {!loaded ? (
          <motion.div key="sk" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <SkRow shimmer />
            <SkRow shimmer />
          </motion.div>
        ) : (
          <motion.div key="real" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
            {realItems.map((item, i) => (
              <div key={i} style={{
                padding: 10, borderRadius: 10, background: 'var(--bg-secondary)',
                border: '1px solid var(--border)', marginBottom: 8,
                display: 'flex', gap: 8, alignItems: 'center',
              }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: item.color, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 10, fontFamily: 'var(--font-outfit)', color: 'var(--text-primary)', fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: 9,  fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)' }}>{item.msg}</div>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── 6. Stagger List ────────────────────────────────────────────────────── */

function StaggerListWeb({ step }: { step: number }) {
  const items = ['Dashboard', 'Analytics', 'Users', 'Settings', 'Billing']

  const containerV = step >= 3
    ? { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
    : undefined

  const itemV = step >= 2
    ? { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22,1,0.36,1] as [number,number,number,number] } } }
    : step === 1
      ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.45 } } }
      : undefined

  const card = (item: string) => (
    <div style={{
      padding: '10px 14px', borderRadius: 8,
      border: '1px solid var(--border)', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontFamily: 'var(--font-outfit)', color: 'var(--text-primary)' }}>{item}</span>
    </div>
  )

  if (step === 0) {
    return (
      <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(item => <div key={item}>{card(item)}</div>)}
      </div>
    )
  }

  return (
    <motion.div
      variants={containerV}
      initial="hidden"
      animate="visible"
      style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {items.map(item => (
        <motion.div key={item} variants={itemV}>
          {card(item)}
        </motion.div>
      ))}
    </motion.div>
  )
}

function StaggerListMobile({ step }: { step: number }) {
  const items = ['Home', 'Explore', 'Library', 'Settings']

  const containerV = step >= 3
    ? { hidden: {}, visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } } }
    : undefined

  const itemV = step >= 2
    ? { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22,1,0.36,1] as [number,number,number,number] } } }
    : step === 1
      ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.45 } } }
      : undefined

  const card = (item: string, i: number) => (
    <div style={{
      padding: '9px 10px', borderRadius: 10,
      background: i === 0 ? 'var(--accent)' : 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      <div style={{ width: 5, height: 5, borderRadius: '50%', background: i === 0 ? '#fff' : 'var(--accent)', flexShrink: 0 }} />
      <span style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', fontWeight: 500, color: i === 0 ? '#fff' : 'var(--text-primary)' }}>
        {item}
      </span>
    </div>
  )

  if (step === 0) {
    return (
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontSize: 12, fontFamily: 'var(--font-power)', color: 'var(--text-primary)', fontWeight: 400, marginBottom: 6 }}>Menu</div>
        {items.map((item, i) => <div key={item}>{card(item, i)}</div>)}
      </div>
    )
  }

  return (
    <motion.div
      variants={containerV}
      initial="hidden"
      animate="visible"
      style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 6 }}
    >
      <div style={{ fontSize: 12, fontFamily: 'var(--font-power)', color: 'var(--text-primary)', fontWeight: 400, marginBottom: 6 }}>Menu</div>
      {items.map((item, i) => (
        <motion.div key={item} variants={itemV}>
          {card(item, i)}
        </motion.div>
      ))}
    </motion.div>
  )
}

/* ── 7. Image Carousel ──────────────────────────────────────────────────── */

const CAROUSEL_SLIDES = [
  { id: 'a', color: '#534AB7', label: 'Mountain Vista' },
  { id: 'b', color: '#1D9E75', label: 'Forest Trail'   },
  { id: 'c', color: '#D85A30', label: 'Ocean Sunset'   },
]

const carouselVariants = {
  enter:  (d: number) => ({ x: d > 0 ? '100%' : '-100%', scale: 0.92 }),
  center: { x: 0, scale: 1 },
  exit:   (d: number) => ({ x: d < 0 ? '100%' : '-100%', opacity: 0.4 }),
}

function ImageCarouselWeb({ step }: { step: number }) {
  const [[page, dir], setPage] = useState([0, 0])

  function go(d: number) {
    setPage(([p]) => [(p + d + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length, d])
  }

  const slide = CAROUSEL_SLIDES[page]

  if (step === 0) {
    return (
      <div style={{ padding: '20px 16px', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ flex: 1, borderRadius: 14, background: slide.color,
          display: 'flex', alignItems: 'flex-end', padding: 14, position: 'relative' }}>
          <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{slide.label}</span>
        </div>
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
          {CAROUSEL_SLIDES.map((_, i) => (
            <div key={i} onClick={() => setPage([i, i > page ? 1 : -1])}
              style={{ width: i === page ? 18 : 6, height: 6, borderRadius: 3,
                background: i === page ? '#555' : '#ccc', cursor: 'pointer', transition: 'width 0.2s' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px 16px', height: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 14 }}>
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={page}
            custom={dir}
            variants={step >= 2 ? carouselVariants : undefined}
            initial={step >= 2 ? 'enter' : { x: dir > 0 ? '100%' : '-100%' }}
            animate={step >= 2 ? 'center' : { x: 0 }}
            exit={step >= 2 ? 'exit' : { x: dir < 0 ? '100%' : '-100%', opacity: 0.4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag={step >= 3 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={step >= 3 ? ((_, { offset, velocity }) => {
              if (Math.abs(velocity.x) > 500 || Math.abs(offset.x) > 60) go(offset.x < 0 ? 1 : -1)
            }) : undefined}
            style={{ position: 'absolute', inset: 0, background: slide.color, borderRadius: 14,
              cursor: step >= 3 ? 'grab' : 'default',
              display: 'flex', alignItems: 'flex-end', padding: 14 }}
          >
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} exit={{ opacity: 0.5 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: 14 }}
              />
            )}
            <span style={{ position: 'relative', color: '#fff', fontSize: 14, fontWeight: 600 }}>{slide.label}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center' }}>
        {CAROUSEL_SLIDES.map((_, i) => (
          step >= 3
            ? <motion.div key={i} onClick={() => go(i - page)}
                animate={{ width: i === page ? 18 : 6, opacity: i === page ? 1 : 0.4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ height: 6, borderRadius: 3, background: '#fff', cursor: 'pointer' }} />
            : <div key={i} onClick={() => go(i - page)}
                style={{ width: i === page ? 18 : 6, height: 6, borderRadius: 3,
                  background: '#fff', opacity: i === page ? 1 : 0.4, cursor: 'pointer', transition: 'width 0.2s' }} />
        ))}
      </div>
    </div>
  )
}

function ImageCarouselMobile({ step }: { step: number }) {
  const [[page, dir], setPage] = useState([0, 0])

  function go(d: number) {
    setPage(([p]) => [(p + d + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length, d])
  }

  const slide = CAROUSEL_SLIDES[page]

  if (step === 0) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '10px 10px 14px' }}>
        <div style={{ flex: 1, borderRadius: 12, background: slide.color,
          display: 'flex', alignItems: 'flex-end', padding: 12, position: 'relative' }}>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>{slide.label}</span>
        </div>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 8 }}>
          {CAROUSEL_SLIDES.map((_, i) => (
            <div key={i} onClick={() => setPage([i, i > page ? 1 : -1])}
              style={{ width: i === page ? 16 : 5, height: 5, borderRadius: 3,
                background: i === page ? '#555' : '#ccc', cursor: 'pointer', transition: 'width 0.2s' }} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '10px 10px 14px' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 12 }}>
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={page}
            custom={dir}
            variants={step >= 2 ? carouselVariants : undefined}
            initial={step >= 2 ? 'enter' : { x: dir > 0 ? '100%' : '-100%' }}
            animate={step >= 2 ? 'center' : { x: 0 }}
            exit={step >= 2 ? 'exit' : { x: dir < 0 ? '100%' : '-100%', opacity: 0.4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag={step >= 3 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={step >= 3 ? ((_, { offset, velocity }) => {
              if (Math.abs(velocity.x) > 400 || Math.abs(offset.x) > 40) go(offset.x < 0 ? 1 : -1)
            }) : undefined}
            style={{ position: 'absolute', inset: 0, background: slide.color, borderRadius: 12,
              cursor: step >= 3 ? 'grab' : 'default',
              display: 'flex', alignItems: 'flex-end', padding: 12 }}
          >
            {step >= 2 && (
              <motion.div
                initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} exit={{ opacity: 0.5 }}
                transition={{ duration: 0.3 }}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: 12 }}
              />
            )}
            <span style={{ position: 'relative', color: '#fff', fontSize: 12, fontWeight: 600 }}>{slide.label}</span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', marginTop: 8 }}>
        {CAROUSEL_SLIDES.map((_, i) => (
          step >= 3
            ? <motion.div key={i} onClick={() => go(i - page)}
                animate={{ width: i === page ? 16 : 5, opacity: i === page ? 1 : 0.4 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ height: 5, borderRadius: 3, background: '#fff', cursor: 'pointer' }} />
            : <div key={i} onClick={() => go(i - page)}
                style={{ width: i === page ? 16 : 5, height: 5, borderRadius: 3,
                  background: '#fff', opacity: i === page ? 1 : 0.4, cursor: 'pointer', transition: 'width 0.2s' }} />
        ))}
      </div>
    </div>
  )
}

/* ── 8. Onboarding Flow ─────────────────────────────────────────────────── */

const OB_SCREENS = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

function OnboardingFlowWeb({ step }: { step: number }) {
  const [idx, setIdx] = useState(0)
  const s = OB_SCREENS[idx]

  const screenContent = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 12, position: 'absolute', inset: 0 }}>
      {step >= 3
        ? <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.35, ease: [0.22,1,0.36,1] }}
            style={{ width: 56, height: 56, borderRadius: 18, background: s.color }} />
        : <div style={{ width: 56, height: 56, borderRadius: 18, background: s.color }} />
      }
      <div style={{ fontFamily: 'var(--font-power)', fontSize: 17, color: 'var(--text-primary)',
        letterSpacing: '-0.02em', textAlign: 'center' }}>{s.title}</div>
      <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 12, color: 'var(--text-secondary)',
        textAlign: 'center', lineHeight: 1.6, maxWidth: 200 }}>{s.body}</div>
    </div>
  )

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '20px 16px' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {step === 0
          ? screenContent
          : <AnimatePresence mode="wait">
              <motion.div key={idx}
                initial={step >= 3 ? { opacity: 0, x: 28 } : { opacity: 0 }}
                animate={step >= 3 ? { opacity: 1, x: 0 }  : { opacity: 1 }}
                exit={step >= 3 ? { opacity: 0, x: -28 }   : { opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
                style={{ position: 'absolute', inset: 0 }}
              >
                {screenContent}
              </motion.div>
            </AnimatePresence>
        }
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 14 }}>
        {OB_SCREENS.map((_, i) => (
          step >= 3
            ? <motion.div key={i} onClick={() => setIdx(i)}
                animate={{ width: i === idx ? 22 : 7, opacity: i === idx ? 1 : 0.3, background: s.color }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ height: 7, borderRadius: 4, cursor: 'pointer' }} />
            : <div key={i} onClick={() => setIdx(i)} style={{
                width: i === idx ? 22 : 7, height: 7, borderRadius: 4, cursor: 'pointer',
                background: i === idx ? s.color : 'rgba(0,0,0,0.15)', transition: 'all 0.2s' }} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {idx > 0 && (
          <button onClick={() => setIdx(i => i - 1)} style={{
            flex: 1, padding: '8px', borderRadius: 8, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}>
            Back
          </button>
        )}
        <motion.button whileTap={step >= 2 ? { scale: 0.97 } : undefined}
          onClick={() => idx < OB_SCREENS.length - 1 && setIdx(i => i + 1)}
          style={{ flex: 1, padding: '8px', borderRadius: 8, border: 'none',
            background: s.color, color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}>
          {idx === OB_SCREENS.length - 1 ? 'Get started →' : 'Next →'}
        </motion.button>
      </div>
    </div>
  )
}

function OnboardingFlowMobile({ step }: { step: number }) {
  const [idx, setIdx] = useState(0)
  const s = OB_SCREENS[idx]

  const screenContent = (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 10, position: 'absolute', inset: 0 }}>
      {step >= 3
        ? <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.35, ease: [0.22,1,0.36,1] }}
            style={{ width: 48, height: 48, borderRadius: 14, background: s.color }} />
        : <div style={{ width: 48, height: 48, borderRadius: 14, background: s.color }} />
      }
      <div style={{ fontSize: 14, fontFamily: 'var(--font-power)', color: 'var(--text-primary)',
        letterSpacing: '-0.02em', textAlign: 'center' }}>{s.title}</div>
      <div style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)',
        textAlign: 'center', lineHeight: 1.5, maxWidth: 160 }}>{s.body}</div>
    </div>
  )

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: '14px 12px' }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {step === 0
          ? screenContent
          : <AnimatePresence mode="wait">
              <motion.div key={idx}
                initial={step >= 3 ? { opacity: 0, x: 22 } : { opacity: 0 }}
                animate={step >= 3 ? { opacity: 1, x: 0 }  : { opacity: 1 }}
                exit={step >= 3 ? { opacity: 0, x: -22 }   : { opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.22,1,0.36,1] }}
                style={{ position: 'absolute', inset: 0 }}
              >
                {screenContent}
              </motion.div>
            </AnimatePresence>
        }
      </div>

      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 10 }}>
        {OB_SCREENS.map((_, i) => (
          step >= 3
            ? <motion.div key={i} onClick={() => setIdx(i)}
                animate={{ width: i === idx ? 18 : 6, opacity: i === idx ? 1 : 0.3, background: s.color }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                style={{ height: 6, borderRadius: 3, cursor: 'pointer' }} />
            : <div key={i} onClick={() => setIdx(i)} style={{
                width: i === idx ? 18 : 6, height: 6, borderRadius: 3, cursor: 'pointer',
                background: i === idx ? s.color : 'rgba(0,0,0,0.15)', transition: 'all 0.2s' }} />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6 }}>
        {idx > 0 && (
          <button onClick={() => setIdx(i => i - 1)} style={{
            flex: 1, padding: '7px', borderRadius: 8, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-secondary)', fontSize: 11, cursor: 'pointer' }}>
            Back
          </button>
        )}
        <motion.button whileTap={step >= 2 ? { scale: 0.97 } : undefined}
          onClick={() => idx < OB_SCREENS.length - 1 && setIdx(i => i + 1)}
          style={{ flex: 1, padding: '7px', borderRadius: 8, border: 'none',
            background: s.color, color: '#fff', fontSize: 11, fontWeight: 500, cursor: 'pointer' }}>
          {idx === OB_SCREENS.length - 1 ? 'Get started →' : 'Next →'}
        </motion.button>
      </div>
    </div>
  )
}

/* ── 9. Shared Element Transitions ──────────────────────────────────────── */

const SE_ITEMS = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

function SharedElementWeb({ step }: { step: number }) {
  const [selected, setSelected] = useState<string | null>(null)
  const item = SE_ITEMS.find(i => i.id === selected)

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {SE_ITEMS.map(it => (
          <motion.div layout={step >= 3} key={it.id} onClick={() => setSelected(it.id)}
            style={{ display: 'flex', gap: 10, alignItems: 'center', padding: 10,
              borderRadius: 10, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', cursor: 'pointer' }}>
            {step >= 2
              ? <motion.div layoutId={`hero-${it.id}`}
                  transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                  style={{ width: 40, height: 40, borderRadius: 8, background: it.color, flexShrink: 0 }} />
              : <div style={{ width: 40, height: 40, borderRadius: 8, background: it.color, flexShrink: 0 }} />
            }
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: 'var(--text-primary)', fontFamily: 'var(--font-power)' }}>{it.title}</div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 1 }}>{it.sub}</div>
            </div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 11 }}>›</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && item && (
          <>
            <motion.div key="bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
            />
            <motion.div key="sh"
              initial={step >= 1 ? { y: '100%' } : {}} animate={{ y: 0 }}
              exit={step >= 1 ? { y: '100%' } : { opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'var(--bg)', borderRadius: '16px 16px 0 0', padding: 18, zIndex: 50 }}
            >
              {step >= 2
                ? <motion.div layoutId={`hero-${selected}`}
                    transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                    style={{ width: '100%', height: 120, borderRadius: 12, background: item.color, marginBottom: 14 }} />
                : <div style={{ width: '100%', height: 120, borderRadius: 12, background: item.color, marginBottom: 14 }} />
              }
              <div style={{ fontFamily: 'var(--font-power)', fontSize: 18, color: 'var(--text-primary)',
                letterSpacing: '-0.02em', marginBottom: 4 }}>{item.title}</div>
              <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 12, color: 'var(--text-secondary)',
                marginBottom: 14 }}>{item.sub} · Tap backdrop to close</div>
              <button onClick={() => setSelected(null)} style={{
                padding: '8px 16px', borderRadius: 8, background: item.color, color: '#fff',
                border: 'none', cursor: 'pointer', fontSize: 12 }}>
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

function SharedElementMobile({ step }: { step: number }) {
  const [selected, setSelected] = useState<string | null>(null)
  const item = SE_ITEMS.find(i => i.id === selected)

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {SE_ITEMS.map(it => (
          <motion.div layout={step >= 3} key={it.id} onClick={() => setSelected(it.id)}
            style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 8,
              borderRadius: 9, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', cursor: 'pointer' }}>
            {step >= 2
              ? <motion.div layoutId={`hero-m-${it.id}`}
                  transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                  style={{ width: 34, height: 34, borderRadius: 7, background: it.color, flexShrink: 0 }} />
              : <div style={{ width: 34, height: 34, borderRadius: 7, background: it.color, flexShrink: 0 }} />
            }
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--text-primary)', fontFamily: 'var(--font-power)' }}>{it.title}</div>
              <div style={{ fontSize: 9, color: 'var(--text-tertiary)', marginTop: 1 }}>{it.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && item && (
          <>
            <motion.div key="bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
            />
            <motion.div key="sh"
              initial={step >= 1 ? { y: '100%' } : {}} animate={{ y: 0 }}
              exit={step >= 1 ? { y: '100%' } : { opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'var(--bg)', borderRadius: '14px 14px 0 0', padding: 14, zIndex: 50 }}
            >
              {step >= 2
                ? <motion.div layoutId={`hero-m-${selected}`}
                    transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                    style={{ width: '100%', height: 100, borderRadius: 10, background: item.color, marginBottom: 12 }} />
                : <div style={{ width: '100%', height: 100, borderRadius: 10, background: item.color, marginBottom: 12 }} />
              }
              <div style={{ fontSize: 15, fontFamily: 'var(--font-power)', color: 'var(--text-primary)',
                letterSpacing: '-0.02em', marginBottom: 3 }}>{item.title}</div>
              <div style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-secondary)',
                marginBottom: 12 }}>{item.sub} · Tap outside to close</div>
              <button onClick={() => setSelected(null)} style={{
                padding: '7px 14px', borderRadius: 7, background: item.color, color: '#fff',
                border: 'none', cursor: 'pointer', fontSize: 11 }}>
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── 10. Collapsing Header ──────────────────────────────────────────────── */

const CONTENT_ROWS = Array.from({ length: 12 })

function CollapsingHeaderWeb({ step }: { step: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY }  = useScroll({ container: containerRef })

  const headerPadY  = useTransform(scrollY, [0, 120], [18, 8])
  const avatarScale = useTransform(scrollY, [0, 120], [1, 0.55])
  const titleSize   = useTransform(scrollY, [0, 120], [20, 13])
  const searchOp    = useTransform(scrollY, [0, 80],  [1, 0])

  const staticHeader = (
    <header style={{ position: 'sticky', top: 0, zIndex: 10, padding: '18px 14px',
      background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <div style={{ width: 38, height: 38, borderRadius: 19, background: '#534AB7', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 20, fontFamily: 'var(--font-power)', color: 'var(--text-primary)',
            letterSpacing: '-0.02em' }}>Profile</div>
          <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 1 }}>@username · 128 posts</div>
        </div>
      </div>
      <div style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)',
        background: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-tertiary)' }}>
        Search posts...
      </div>
    </header>
  )

  return (
    <div ref={containerRef} style={{ height: '100%', overflowY: 'auto' }}>
      {step === 0 ? staticHeader : (
        <motion.header style={{
          position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          paddingLeft: 14, paddingRight: 14,
          paddingTop: headerPadY, paddingBottom: headerPadY,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <motion.div style={{
              scale: step >= 2 ? avatarScale : 1,
              transformOrigin: 'left center', flexShrink: 0,
            }}>
              <div style={{ width: 38, height: 38, borderRadius: 19, background: '#534AB7' }} />
            </motion.div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <motion.div style={{
                fontSize: step >= 3 ? titleSize : 20,
                fontFamily: 'var(--font-power)', color: 'var(--text-primary)',
                letterSpacing: '-0.02em', lineHeight: 1.2, whiteSpace: 'nowrap',
              }}>Profile</motion.div>
              <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginTop: 1 }}>@username · 128 posts</div>
            </div>
          </div>
          <motion.div style={{ opacity: step >= 2 ? searchOp : 1 }}>
            <div style={{ padding: '6px 10px', borderRadius: 8, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', fontSize: 11, color: 'var(--text-tertiary)' }}>
              Search posts...
            </div>
          </motion.div>
        </motion.header>
      )}
      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {CONTENT_ROWS.map((_, i) => (
          <div key={i} style={{ padding: 12, borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div style={{ width: 70, height: 6, borderRadius: 3, background: 'var(--border-strong)', marginBottom: 6 }} />
            <div style={{ width: '88%', height: 5, borderRadius: 3, background: 'var(--border)', marginBottom: 4 }} />
            <div style={{ width: '68%', height: 5, borderRadius: 3, background: 'var(--border)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

function CollapsingHeaderMobile({ step }: { step: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY }  = useScroll({ container: containerRef })

  const headerPadY  = useTransform(scrollY, [0, 100], [14, 6])
  const avatarScale = useTransform(scrollY, [0, 100], [1, 0.52])
  const titleSize   = useTransform(scrollY, [0, 100], [16, 11])
  const searchOp    = useTransform(scrollY, [0, 70],  [1, 0])

  const staticHeader = (
    <header style={{ position: 'sticky', top: 0, zIndex: 10, padding: '14px 12px',
      background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <div style={{ width: 32, height: 32, borderRadius: 16, background: '#534AB7', flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 16, fontFamily: 'var(--font-power)', color: 'var(--text-primary)',
            letterSpacing: '-0.02em' }}>Profile</div>
          <div style={{ fontSize: 9, color: 'var(--text-tertiary)', marginTop: 1 }}>@username · 128 posts</div>
        </div>
      </div>
      <div style={{ padding: '5px 9px', borderRadius: 7, border: '1px solid var(--border)',
        background: 'var(--bg-secondary)', fontSize: 10, color: 'var(--text-tertiary)' }}>
        Search posts...
      </div>
    </header>
  )

  return (
    <div ref={containerRef} style={{ height: '100%', overflowY: 'auto' }}>
      {step === 0 ? staticHeader : (
        <motion.header style={{
          position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          paddingLeft: 12, paddingRight: 12,
          paddingTop: headerPadY, paddingBottom: headerPadY,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
            <motion.div style={{
              scale: step >= 2 ? avatarScale : 1,
              transformOrigin: 'left center', flexShrink: 0,
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 16, background: '#534AB7' }} />
            </motion.div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <motion.div style={{
                fontSize: step >= 3 ? titleSize : 16,
                fontFamily: 'var(--font-power)', color: 'var(--text-primary)',
                letterSpacing: '-0.02em', lineHeight: 1.2, whiteSpace: 'nowrap',
              }}>Profile</motion.div>
              <div style={{ fontSize: 9, color: 'var(--text-tertiary)', marginTop: 1 }}>@username · 128 posts</div>
            </div>
          </div>
          <motion.div style={{ opacity: step >= 2 ? searchOp : 1 }}>
            <div style={{ padding: '5px 9px', borderRadius: 7, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', fontSize: 10, color: 'var(--text-tertiary)' }}>
              Search posts...
            </div>
          </motion.div>
        </motion.header>
      )}
      <div style={{ padding: '10px', display: 'flex', flexDirection: 'column', gap: 7 }}>
        {CONTENT_ROWS.map((_, i) => (
          <div key={i} style={{ padding: 10, borderRadius: 8,
            border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div style={{ width: 55, height: 5, borderRadius: 3, background: 'var(--border-strong)', marginBottom: 5 }} />
            <div style={{ width: '85%', height: 4, borderRadius: 2, background: 'var(--border)', marginBottom: 3 }} />
            <div style={{ width: '65%', height: 4, borderRadius: 2, background: 'var(--border)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── 11. Pan Dismiss ────────────────────────────────────────────────────── */

function PanDismissWeb({ step }: { step: number }) {
  const initial = [
    { id: 'a', label: 'Design review', color: '#534AB7' },
    { id: 'b', label: 'Update docs',   color: '#1D9E75' },
    { id: 'c', label: 'Fix bug #42',   color: '#D85A30' },
  ]
  const [items, setItems] = useState(initial)
  useEffect(() => { setItems(initial) }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  function remove(id: string) { setItems(p => p.filter(i => i.id !== id)) }

  return (
    <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 0 }}>
      <AnimatePresence>
        {items.map(item => (
          <motion.div
            key={item.id}
            layout={step >= 3}
            exit={step >= 1 ? { x: '-100%', opacity: 0 } : {}}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
            style={{ position: 'relative', overflow: 'hidden', marginBottom: 8 }}
          >
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: 64,
              background: '#D85A30', display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: '0 10px 10px 0',
            }}>
              <span style={{ color: '#fff', fontSize: 10, fontFamily: 'var(--font-outfit)' }}>Delete</span>
            </div>
            <motion.div
              drag={step >= 1 ? 'x' : false}
              dragConstraints={{ left: -64, right: 0 }}
              dragElastic={step >= 2 ? 0.1 : 0.5}
              onDragEnd={step >= 2 ? ((_, { offset }) => { if (offset.x < -36) remove(item.id) }) : undefined}
              whileDrag={step >= 3 ? { boxShadow: '0 4px 20px rgba(0,0,0,0.14)' } : undefined}
              style={{
                padding: '12px 14px', borderRadius: 10,
                border: '1px solid var(--border)', background: 'var(--bg)',
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: step >= 1 ? 'grab' : 'default',
                position: 'relative', zIndex: 1, userSelect: 'none',
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 4, background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontFamily: 'var(--font-outfit)', color: 'var(--text-primary)', flex: 1 }}>{item.label}</span>
              {step >= 1 && <span style={{ fontSize: 9, color: 'var(--text-tertiary)', fontFamily: 'var(--font-outfit)' }}>← swipe</span>}
            </motion.div>
          </motion.div>
        ))}
      </AnimatePresence>
      {items.length === 0 && (
        <button onClick={() => setItems(initial)} style={{
          padding: '10px', borderRadius: 10, border: '1px dashed var(--border)',
          background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-outfit)',
          fontSize: 11, color: 'var(--text-tertiary)',
        }}>Reset list</button>
      )}
    </div>
  )
}

function PanDismissMobile({ step }: { step: number }) {
  const y = useMotionValue(0)
  const cardOpacity = useTransform(y, [0, 180], [1, 0])
  const cardScale   = useTransform(y, [0, 180], [1, 0.88])
  const backdropOp  = useTransform(y, [0, 180], [0, 0.5])
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => { setDismissed(false); y.set(0) }, [step, y])

  if (dismissed) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 20 }}>
        <span style={{ fontSize: 9, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)' }}>Card dismissed</span>
        <button onClick={() => { setDismissed(false); y.set(0) }} style={{
          padding: '6px 14px', borderRadius: 8, background: 'var(--accent)', color: '#fff',
          border: 'none', cursor: 'pointer', fontSize: 11, fontFamily: 'var(--font-outfit)',
        }}>Restore</button>
      </div>
    )
  }

  return (
    <div style={{ height: '100%', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', padding: 10 }}>
      {step >= 3 && (
        <motion.div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,1)', opacity: backdropOp }} />
      )}
      <motion.div
        drag={step >= 1 ? 'y' : false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={step >= 2 ? 0.6 : 1}
        style={{
          y: step >= 1 ? y : 0,
          opacity: step >= 3 ? cardOpacity : 1,
          scale: step >= 3 ? cardScale : 1,
          width: '100%', padding: '14px 12px', borderRadius: 14,
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          cursor: step >= 1 ? 'grab' : 'default', userSelect: 'none',
        }}
        onDragEnd={(_, { offset }) => {
          if (step >= 2 && offset.y > 70) {
            fmAnimate(y, 360, { duration: 0.22, ease: 'easeIn' }).then(() => setDismissed(true))
          } else {
            fmAnimate(y, 0, { type: 'spring', stiffness: 400, damping: 30 })
          }
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#534AB7', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-primary)', fontWeight: 600 }}>Notification</div>
            <div style={{ fontSize: 9, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)' }}>
              {step >= 1 ? 'Drag down to dismiss' : 'New message'}
            </div>
          </div>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: 'var(--border)', marginBottom: 6 }} />
        <div style={{ display: 'flex', gap: 6 }}>
          <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--border-strong)' }} />
          <div style={{ flex: 2, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>
      </motion.div>
    </div>
  )
}

/* ── 12. Flutter Hero ───────────────────────────────────────────────────── */

const HERO_ITEMS = [
  { id: 'a', color: '#534AB7', label: 'Aurora' },
  { id: 'b', color: '#1D9E75', label: 'Forest' },
  { id: 'c', color: '#D85A30', label: 'Ember'  },
]

function FlutterHeroWeb({ step }: { step: number }) {
  const [selIdx, setSelIdx] = useState<number | null>(null)
  const [page, setPage] = useState<'grid' | 'detail'>('grid')

  useEffect(() => { setSelIdx(null); setPage('grid') }, [step])

  function open(i: number) { setSelIdx(i); setPage('detail') }
  function close() { setPage('grid') }

  const item = selIdx !== null ? HERO_ITEMS[selIdx] : null

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode={step >= 2 ? 'wait' : undefined}>
        {page === 'grid' ? (
          <motion.div key="grid"
            initial={step >= 2 ? { opacity: 0 } : false} animate={{ opacity: 1 }}
            exit={step >= 2 ? { opacity: 0 } : {}} transition={{ duration: 0.18 }}
            style={{ position: 'absolute', inset: 0, padding: '14px 16px' }}
          >
            <div style={{ fontSize: 13, fontFamily: 'var(--font-power)', color: 'var(--text-primary)', marginBottom: 10 }}>Gallery</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              {HERO_ITEMS.map((it, i) => (
                step >= 3 ? (
                  <motion.div key={it.id} layoutId={`hero-web-${it.id}`}
                    onClick={() => open(i)} transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                    style={{ height: 80, borderRadius: 10, background: it.color, cursor: 'pointer', display: 'flex', alignItems: 'flex-end', padding: 7 }}>
                    <span style={{ fontSize: 9, color: '#fff', fontFamily: 'var(--font-outfit)' }}>{it.label}</span>
                  </motion.div>
                ) : (
                  <div key={it.id} onClick={() => open(i)}
                    style={{ height: 80, borderRadius: 10, background: it.color, cursor: 'pointer', display: 'flex', alignItems: 'flex-end', padding: 7 }}>
                    <span style={{ fontSize: 9, color: '#fff', fontFamily: 'var(--font-outfit)' }}>{it.label}</span>
                  </div>
                )
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="detail"
            initial={step >= 2 ? { opacity: 0 } : false} animate={{ opacity: 1 }}
            exit={step >= 2 ? { opacity: 0 } : {}} transition={{ duration: 0.18 }}
            style={{ position: 'absolute', inset: 0, padding: '14px 16px' }}
          >
            <button onClick={close} style={{ fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 10, fontFamily: 'var(--font-outfit)' }}>← Back</button>
            {item && (
              step >= 3 ? (
                <motion.div layoutId={`hero-web-${item.id}`}
                  transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                  style={{ width: '100%', height: 110, borderRadius: 12, background: item.color, marginBottom: 12, display: 'flex', alignItems: 'flex-end', padding: 12 }}>
                  <span style={{ fontSize: 15, color: '#fff', fontFamily: 'var(--font-power)' }}>{item.label}</span>
                </motion.div>
              ) : (
                <div style={{ width: '100%', height: 110, borderRadius: 12, background: item.color, marginBottom: 12, display: 'flex', alignItems: 'flex-end', padding: 12 }}>
                  <span style={{ fontSize: 15, color: '#fff', fontFamily: 'var(--font-power)' }}>{item.label}</span>
                </div>
              )
            )}
            <div style={{ width: 80, height: 8, borderRadius: 4, background: 'var(--text-primary)', marginBottom: 6 }} />
            <div style={{ width: '75%', height: 5, borderRadius: 3, background: 'var(--border-strong)', marginBottom: 4 }} />
            <div style={{ width: '60%', height: 5, borderRadius: 3, background: 'var(--border-strong)' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function FlutterHeroMobile({ step }: { step: number }) {
  const [selIdx, setSelIdx] = useState<number | null>(null)
  const item = selIdx !== null ? HERO_ITEMS[selIdx] : null

  useEffect(() => { setSelIdx(null) }, [step])

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden', padding: 10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
        {HERO_ITEMS.map((it, i) => (
          step >= 3 ? (
            <motion.div key={it.id} layoutId={`hero-mob-${it.id}`}
              onClick={() => setSelIdx(i)} transition={{ type: 'spring', stiffness: 200, damping: 28 }}
              style={{ height: 65, borderRadius: 9, background: it.color, cursor: 'pointer', display: 'flex', alignItems: 'flex-end', padding: 5 }}>
              <span style={{ fontSize: 8, color: '#fff', fontFamily: 'var(--font-outfit)' }}>{it.label}</span>
            </motion.div>
          ) : (
            <div key={it.id} onClick={() => setSelIdx(i)}
              style={{ height: 65, borderRadius: 9, background: it.color, cursor: 'pointer', display: 'flex', alignItems: 'flex-end', padding: 5 }}>
              <span style={{ fontSize: 8, color: '#fff', fontFamily: 'var(--font-outfit)' }}>{it.label}</span>
            </div>
          )
        ))}
      </div>

      <AnimatePresence>
        {selIdx !== null && item && (
          <>
            <motion.div key="bd"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelIdx(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 40 }} />
            {step >= 3 ? (
              <motion.div key="detail" layoutId={`hero-mob-${item.id}`}
                transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                onClick={() => setSelIdx(null)}
                style={{ position: 'absolute', top: 14, left: 10, right: 10, height: 160, borderRadius: 14, background: item.color, zIndex: 50, display: 'flex', alignItems: 'flex-end', padding: 12, cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: 14, color: '#fff', fontFamily: 'var(--font-power)' }}>{item.label}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-outfit)' }}>Tap to close</div>
                </div>
              </motion.div>
            ) : (
              <motion.div key="detail-static"
                initial={step >= 1 ? { opacity: 0, scale: 0.92 } : {}}
                animate={{ opacity: 1, scale: 1 }}
                exit={step >= 1 ? { opacity: 0, scale: 0.92 } : {}}
                transition={{ duration: 0.22 }}
                onClick={() => setSelIdx(null)}
                style={{ position: 'absolute', top: 14, left: 10, right: 10, height: 160, borderRadius: 14, background: item.color, zIndex: 50, display: 'flex', alignItems: 'flex-end', padding: 12, cursor: 'pointer' }}>
                <div>
                  <div style={{ fontSize: 14, color: '#fff', fontFamily: 'var(--font-power)' }}>{item.label}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-outfit)' }}>Tap to close</div>
                </div>
              </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── 13. View Transitions ───────────────────────────────────────────────── */

const VT_ITEMS = [
  { color: '#534AB7', title: 'Aurora Borealis', sub: 'Nature · 3 min read' },
  { color: '#1D9E75', title: 'Forest Trail',    sub: 'Outdoors · 5 min read' },
]

function ViewTransitionsWeb({ step }: { step: number }) {
  const [page, setPage]     = useState<'list' | 'detail'>('list')
  const [selIdx, setSelIdx] = useState(0)

  useEffect(() => { setPage('list') }, [step])

  function open(i: number) { setSelIdx(i); setPage('detail') }

  const listContent = (
    <div style={{ padding: '14px 16px' }}>
      <div style={{ fontSize: 13, fontFamily: 'var(--font-power)', color: 'var(--text-primary)', marginBottom: 10 }}>Articles</div>
      {VT_ITEMS.map((it, i) => (
        <div key={i} onClick={() => open(i)} style={{
          display: 'flex', gap: 10, alignItems: 'center', padding: '8px 10px',
          borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-secondary)',
          cursor: 'pointer', marginBottom: 8,
        }}>
          {step >= 3
            ? <motion.div layoutId={`vt-w-${i}`} transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                style={{ width: 44, height: 44, borderRadius: 8, background: it.color, flexShrink: 0 }} />
            : <div style={{ width: 44, height: 44, borderRadius: 8, background: it.color, flexShrink: 0 }} />
          }
          <div>
            <div style={{ fontSize: 12, fontFamily: 'var(--font-outfit)', color: 'var(--text-primary)', fontWeight: 500 }}>{it.title}</div>
            <div style={{ fontSize: 10, color: 'var(--text-tertiary)' }}>{it.sub}</div>
          </div>
        </div>
      ))}
    </div>
  )

  const it = VT_ITEMS[selIdx]
  const detailContent = (
    <div style={{ padding: '14px 16px' }}>
      <button onClick={() => setPage('list')} style={{ fontSize: 11, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 10, fontFamily: 'var(--font-outfit)' }}>← Articles</button>
      {step >= 3
        ? <motion.div layoutId={`vt-w-${selIdx}`} transition={{ type: 'spring', stiffness: 200, damping: 28 }}
            style={{ width: '100%', height: 100, borderRadius: 12, background: it.color, marginBottom: 12 }} />
        : <div style={{ width: '100%', height: 100, borderRadius: 12, background: it.color, marginBottom: 12 }} />
      }
      <div style={{ fontSize: 14, fontFamily: 'var(--font-power)', color: 'var(--text-primary)', marginBottom: 4 }}>{it.title}</div>
      <div style={{ fontSize: 10, color: 'var(--text-tertiary)', marginBottom: 10 }}>{it.sub}</div>
      <div style={{ width: '100%', height: 5, borderRadius: 3, background: 'var(--border-strong)', marginBottom: 4 }} />
      <div style={{ width: '82%', height: 5, borderRadius: 3, background: 'var(--border)', marginBottom: 4 }} />
      <div style={{ width: '68%', height: 5, borderRadius: 3, background: 'var(--border)' }} />
    </div>
  )

  if (step === 0) {
    return (
      <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
        {page === 'list' ? listContent : detailContent}
      </div>
    )
  }

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: step >= 2 ? 12 : 0 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: step >= 2 ? -12 : 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {page === 'list' ? listContent : detailContent}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function ViewTransitionsMobile({ step }: { step: number }) {
  const [page, setPage]     = useState<'list' | 'detail'>('list')
  const [selIdx, setSelIdx] = useState(0)

  useEffect(() => { setPage('list') }, [step])

  function open(i: number) { setSelIdx(i); setPage('detail') }

  const it = VT_ITEMS[selIdx]

  const listContent = (
    <div style={{ padding: '8px 10px' }}>
      <div style={{ fontSize: 12, fontFamily: 'var(--font-power)', color: 'var(--text-primary)', marginBottom: 8 }}>Articles</div>
      {VT_ITEMS.map((item, i) => (
        <div key={i} onClick={() => open(i)} style={{
          display: 'flex', gap: 8, alignItems: 'center', padding: '7px 8px',
          borderRadius: 9, border: '1px solid var(--border)', background: 'var(--bg-secondary)',
          cursor: 'pointer', marginBottom: 6,
        }}>
          {step >= 3
            ? <motion.div layoutId={`vt-m-${i}`} transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                style={{ width: 36, height: 36, borderRadius: 7, background: item.color, flexShrink: 0 }} />
            : <div style={{ width: 36, height: 36, borderRadius: 7, background: item.color, flexShrink: 0 }} />
          }
          <div>
            <div style={{ fontSize: 10, fontFamily: 'var(--font-outfit)', color: 'var(--text-primary)', fontWeight: 500 }}>{item.title}</div>
            <div style={{ fontSize: 8, color: 'var(--text-tertiary)' }}>{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  )

  const detailContent = (
    <div style={{ padding: '8px 10px' }}>
      <button onClick={() => setPage('list')} style={{ fontSize: 10, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 8, fontFamily: 'var(--font-outfit)' }}>← Back</button>
      {step >= 3
        ? <motion.div layoutId={`vt-m-${selIdx}`} transition={{ type: 'spring', stiffness: 200, damping: 28 }}
            style={{ width: '100%', height: 80, borderRadius: 10, background: it.color, marginBottom: 10 }} />
        : <div style={{ width: '100%', height: 80, borderRadius: 10, background: it.color, marginBottom: 10 }} />
      }
      <div style={{ fontSize: 12, fontFamily: 'var(--font-power)', color: 'var(--text-primary)', marginBottom: 3 }}>{it.title}</div>
      <div style={{ fontSize: 9, color: 'var(--text-tertiary)', marginBottom: 8 }}>{it.sub}</div>
      <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'var(--border-strong)', marginBottom: 3 }} />
      <div style={{ width: '80%', height: 4, borderRadius: 2, background: 'var(--border)', marginBottom: 3 }} />
      <div style={{ width: '65%', height: 4, borderRadius: 2, background: 'var(--border)' }} />
    </div>
  )

  if (step === 0) {
    return <div style={{ height: '100%', overflow: 'hidden' }}>{page === 'list' ? listContent : detailContent}</div>
  }

  return (
    <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, x: page === 'detail' ? (step >= 2 ? 18 : 0) : (step >= 2 ? -18 : 0) }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: page === 'list' ? (step >= 2 ? -18 : 0) : (step >= 2 ? 18 : 0) }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
          style={{ position: 'absolute', inset: 0 }}
        >
          {page === 'list' ? listContent : detailContent}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ── 14. FLIP List ──────────────────────────────────────────────────────── */

const FLIP_ALL = [
  { id: 'a', label: 'React',   color: '#61DAFB' },
  { id: 'b', label: 'Vue',     color: '#42B883' },
  { id: 'c', label: 'Angular', color: '#DD0031' },
  { id: 'd', label: 'Svelte',  color: '#FF3E00' },
]

function FlipListWeb({ step }: { step: number }) {
  const [items, setItems] = useState(FLIP_ALL)
  const [filter, setFilter] = useState<'all' | 'top2'>('all')

  useEffect(() => { setFilter('all'); setItems(FLIP_ALL) }, [step])
  useEffect(() => {
    setItems(filter === 'all' ? FLIP_ALL : FLIP_ALL.slice(0, 2))
  }, [filter])

  return (
    <div style={{ padding: '14px 16px' }}>
      <div style={{ display: 'flex', gap: 6, marginBottom: 12, alignItems: 'center' }}>
        {(['all', 'top2'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '4px 10px', borderRadius: 6,
            border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
            background: filter === f ? 'var(--accent-faint)' : 'var(--bg)',
            color: filter === f ? 'var(--accent)' : 'var(--text-tertiary)',
            fontSize: 11, fontFamily: 'var(--font-outfit)', cursor: 'pointer',
          }}>{f === 'all' ? 'All' : 'Top 2'}</button>
        ))}
        <button onClick={() => setItems(p => [...p].reverse())} style={{
          marginLeft: 'auto', padding: '4px 10px', borderRadius: 6,
          border: '1px solid var(--border)', background: 'var(--bg)',
          color: 'var(--text-tertiary)', fontSize: 11, fontFamily: 'var(--font-outfit)', cursor: 'pointer',
        }}>Flip ↕</button>
      </div>

      <motion.div layout={step >= 3} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <AnimatePresence mode="popLayout">
          {items.map(item => (
            <motion.div
              key={item.id}
              layout={step >= 3}
              initial={step >= 1 ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={step >= 1 ? { opacity: 0, y: -8, height: 0, marginBottom: 0 } : {}}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              style={{
                padding: '10px 12px', borderRadius: 8,
                border: '1px solid var(--border)', background: 'var(--bg)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}
            >
              <div style={{ width: 8, height: 8, borderRadius: 4, background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 12, fontFamily: 'var(--font-outfit)', color: 'var(--text-primary)' }}>{item.label}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

function FlipListMobile({ step }: { step: number }) {
  const mobileAll = [
    { id: 'a', label: 'React Native', color: '#61DAFB' },
    { id: 'b', label: 'Flutter',      color: '#54C5F8' },
    { id: 'c', label: 'Ionic',        color: '#3880FF' },
  ]
  const [items, setItems] = useState(mobileAll)
  const [filter, setFilter] = useState<'all' | 'top'>('all')

  useEffect(() => { setFilter('all'); setItems(mobileAll) }, [step]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    setItems(filter === 'all' ? mobileAll : mobileAll.slice(0, 2))
  }, [filter]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ padding: '8px 10px' }}>
      <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
        {(['all', 'top'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '3px 8px', borderRadius: 5,
            border: `1px solid ${filter === f ? 'var(--accent)' : 'var(--border)'}`,
            background: filter === f ? 'var(--accent-faint)' : 'var(--bg)',
            color: filter === f ? 'var(--accent)' : 'var(--text-tertiary)',
            fontSize: 10, fontFamily: 'var(--font-outfit)', cursor: 'pointer',
          }}>{f === 'all' ? 'All' : 'Top 2'}</button>
        ))}
        <button onClick={() => setItems(p => [...p].reverse())} style={{
          marginLeft: 'auto', padding: '3px 8px', borderRadius: 5,
          border: '1px solid var(--border)', background: 'var(--bg)',
          color: 'var(--text-tertiary)', fontSize: 10, fontFamily: 'var(--font-outfit)', cursor: 'pointer',
        }}>↕</button>
      </div>

      <motion.div layout={step >= 3} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <AnimatePresence mode="popLayout">
          {items.map(item => (
            <motion.div
              key={item.id}
              layout={step >= 3}
              initial={step >= 1 ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              exit={step >= 1 ? { opacity: 0, y: -6, height: 0 } : {}}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] }}
              style={{
                padding: '9px 10px', borderRadius: 8,
                border: '1px solid var(--border)', background: 'var(--bg)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: 3, background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-primary)' }}>{item.label}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ── Dispatch ───────────────────────────────────────────────────────────── */

const WEB_MAP: Record<string, React.FC<{ step: number }>> = {
  'entrance-reveal':   EntranceRevealWeb,
  'page-transitions':  PageTransitionsWeb,
  'gesture-feedback':  GestureFeedbackWeb,
  'parallax':          ParallaxWeb,
  'skeleton-loading':  SkeletonLoadingWeb,
  'stagger-list':      StaggerListWeb,
  'image-carousel':    ImageCarouselWeb,
  'onboarding-flow':   OnboardingFlowWeb,
  'shared-element':    SharedElementWeb,
  'collapsing-header': CollapsingHeaderWeb,
  'pan-dismiss':       PanDismissWeb,
  'flutter-hero':      FlutterHeroWeb,
  'view-transitions':  ViewTransitionsWeb,
  'flip-list':         FlipListWeb,
}

const MOBILE_MAP: Record<string, React.FC<{ step: number }>> = {
  'entrance-reveal':   EntranceRevealMobile,
  'page-transitions':  PageTransitionsMobile,
  'gesture-feedback':  GestureFeedbackMobile,
  'parallax':          ParallaxMobile,
  'skeleton-loading':  SkeletonLoadingMobile,
  'stagger-list':      StaggerListMobile,
  'image-carousel':    ImageCarouselMobile,
  'onboarding-flow':   OnboardingFlowMobile,
  'shared-element':    SharedElementMobile,
  'collapsing-header': CollapsingHeaderMobile,
  'pan-dismiss':       PanDismissMobile,
  'flutter-hero':      FlutterHeroMobile,
  'view-transitions':  ViewTransitionsMobile,
  'flip-list':         FlipListMobile,
}

export function AnimationPreview({ slug, context, stepIndex = 3 }: {
  slug: string
  context: Context
  stepIndex?: number
}) {
  const Preview = (context === 'web' ? WEB_MAP : MOBILE_MAP)[slug]
  if (!Preview) {
    return (
      <div style={{ padding: 24, color: 'var(--text-tertiary)', fontSize: 13, fontFamily: 'var(--font-outfit)' }}>
        No preview available
      </div>
    )
  }
  return <Preview step={stepIndex} />
}
