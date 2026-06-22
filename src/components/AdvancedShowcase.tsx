'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { MagneticCursor } from './animations/MagneticCursor'
import { ElasticCarousel } from './animations/ElasticCarousel'
import { MagneticButton } from './animations/MagneticButton'
import { TiltCardGrid } from './animations/TiltCard'
import { FloatingDock } from './animations/FloatingDock'
import { TypewriterText } from './animations/TypewriterText'
import { RippleButtonShowcase } from './animations/RippleButton'
import { SpotlightGrid } from './animations/SpotlightCard'
import { ParallaxSection } from './animations/ParallaxSection'
import { TextReveal, GradientTextReveal } from './animations/TextReveal'

interface ShowcaseItem {
  id: string
  label: string
  category: string
  importLine: string
  component: React.ReactNode
}

const ITEMS: ShowcaseItem[] = [
  {
    id: 'magnetic-cursor',
    label: 'Magnetic Cursor',
    category: 'Cursor',
    importLine: "import { MagneticCursor } from '@splash/variants'",
    component: <MagneticCursor />,
  },
  {
    id: 'elastic-carousel',
    label: 'Elastic Carousel',
    category: 'Carousel',
    importLine: "import { ElasticCarousel } from '@splash/variants'",
    component: <ElasticCarousel />,
  },
  {
    id: 'floating-dock',
    label: 'Floating Dock',
    category: 'Interactive',
    importLine: "import { FloatingDock } from '@splash/variants'",
    component: <FloatingDock />,
  },
  {
    id: 'spotlight',
    label: 'Spotlight Cards',
    category: 'Cards',
    importLine: "import { SpotlightCard, SpotlightGrid } from '@splash/variants'",
    component: <SpotlightGrid />,
  },
  {
    id: 'tilt',
    label: 'Tilt Cards',
    category: 'Cards',
    importLine: "import { TiltCard } from '@splash/variants'",
    component: <TiltCardGrid />,
  },
  {
    id: 'magnetic-button',
    label: 'Magnetic Buttons',
    category: 'Button',
    importLine: "import { MagneticButton } from '@splash/variants'",
    component: <MagneticButton />,
  },
  {
    id: 'ripple',
    label: 'Ripple Button',
    category: 'Button',
    importLine: "import { RippleButton } from '@splash/variants'",
    component: <RippleButtonShowcase />,
  },
  {
    id: 'text-reveal',
    label: 'Text Reveal',
    category: 'Text',
    importLine: "import { TextReveal } from '@splash/variants'",
    component: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <TextReveal text="Motion-first design" mode="words" fontSize={26} />
        <TextReveal text="Every character animated" mode="chars" fontSize={20} />
        <GradientTextReveal text="Splash." />
      </div>
    ),
  },
  {
    id: 'parallax',
    label: 'Parallax Layers',
    category: 'Scroll',
    importLine: "import { ParallaxSection } from '@splash/variants'",
    component: <ParallaxSection />,
  },
  {
    id: 'typewriter',
    label: 'Typewriter',
    category: 'Text',
    importLine: "import { TypewriterText } from '@splash/variants'",
    component: <TypewriterText />,
  },
]

const CATEGORIES = ['All', ...Array.from(new Set(ITEMS.map(i => i.category)))]

export function AdvancedShowcase() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = activeCategory === 'All' ? ITEMS : ITEMS.filter(i => i.category === activeCategory)

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1800)
  }

  return (
    <section
      id="advanced"
      style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 120px' }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 48, maxWidth: 560 }}
      >
        <p style={{
          fontSize: 12, fontFamily: 'var(--font-outfit)', fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--accent-light)', marginBottom: 12,
        }}>
          Advanced
        </p>
        <h2 style={{
          fontFamily: 'var(--font-power)',
          fontSize: 'clamp(32px, 4vw, 48px)',
          fontWeight: 300,
          letterSpacing: '-0.03em',
          color: 'var(--text-primary)',
          lineHeight: 1.1,
          marginBottom: 16,
        }}>
          Beyond variants.
        </h2>
        <p style={{
          fontFamily: 'var(--font-outfit)', fontSize: 16,
          color: 'var(--text-secondary)', lineHeight: 1.7,
        }}>
          Full-featured interactive components — cursors, carousels, docks, spotlight cards.
          Drop in, customize, ship.
        </p>
      </motion.div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 36 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 14px',
              borderRadius: 99,
              border: '1px solid',
              borderColor: activeCategory === cat ? 'var(--accent)' : 'var(--border-strong)',
              background: activeCategory === cat ? 'var(--accent-faint)' : 'transparent',
              color: activeCategory === cat ? 'var(--accent)' : 'var(--text-tertiary)',
              fontSize: 12,
              fontFamily: 'var(--font-outfit)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              letterSpacing: '0.03em',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {filtered.map((item, i) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
            style={{
              borderRadius: 16,
              border: '1px solid var(--border)',
              background: 'var(--bg-secondary)',
              overflow: 'hidden',
            }}
          >
            {/* Preview */}
            <div style={{
              padding: 24,
              minHeight: 160,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-tertiary)',
              borderBottom: '1px solid var(--border)',
            }}>
              {item.component}
            </div>

            {/* Info bar */}
            <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{
                    fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 500,
                    letterSpacing: '0.07em', textTransform: 'uppercase',
                    color: 'var(--accent-light)',
                  }}>
                    {item.category}
                  </span>
                </div>
                <p style={{
                  fontFamily: 'var(--font-power)', fontSize: 15, fontWeight: 500,
                  letterSpacing: '-0.01em', color: 'var(--text-primary)',
                }}>
                  {item.label}
                </p>
              </div>
              <button
                onClick={() => copy(item.id, item.importLine)}
                style={{
                  flexShrink: 0,
                  padding: '6px 12px',
                  borderRadius: 7,
                  border: '1px solid var(--border-strong)',
                  background: copiedId === item.id ? 'var(--accent-faint)' : 'transparent',
                  color: copiedId === item.id ? 'var(--accent)' : 'var(--text-tertiary)',
                  fontSize: 11,
                  fontFamily: 'var(--font-outfit)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap',
                }}
              >
                {copiedId === item.id ? '✓ copied' : 'copy import'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
