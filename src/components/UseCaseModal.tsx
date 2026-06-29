'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { UseCase } from '@/lib/learnContent'

/* Per-slug, per-index curated images from Unsplash */
const USE_CASE_IMAGES: Record<string, string[]> = {
  'entrance-reveal': [
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80', // landing page design
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80', // feature grid
    'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80', // article reading
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', // stats dashboard
  ],
  'page-transitions': [
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80', // mobile app
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // e-commerce
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', // wizard steps
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80', // presentation
  ],
  'gesture-feedback': [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', // button press
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', // swipe checkout
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80', // drag UI
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80', // like button
  ],
  'parallax': [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // hero parallax
    'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=800&q=80', // depth scroll
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80', // retail parallax
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', // tech product
  ],
  'skeleton-loading': [
    'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80', // social feed
    'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&q=80', // e-commerce grid
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80', // news feed
    'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', // profile load
  ],
  'stagger-list': [
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80', // task list
    'https://images.unsplash.com/photo-1592210454359-9043f067919b?w=800&q=80', // menu items
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&q=80', // team grid
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', // search results
  ],
  'image-carousel': [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', // product shots
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', // photo gallery
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80', // real estate
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80', // food delivery
  ],
  'onboarding-flow': [
    'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80', // mobile onboarding
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80', // setup wizard
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', // stepper
    'https://images.unsplash.com/photo-1586936893354-362ad6ae47ba?w=800&q=80', // welcome screen
  ],
  'shared-element': [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', // profile card → detail
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', // product card expand
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80', // article expand
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // cart item grow
  ],
  'collapsing-header': [
    'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80', // mobile profile
    'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80', // blog header
    'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80', // product detail
    'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80', // news app
  ],
  'pan-dismiss': [
    'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800&q=80', // notification swipe
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80', // email swipe
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80', // bottom sheet
    'https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80', // card dismiss
  ],
  'flutter-hero': [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', // shop grid → detail
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80', // photo library
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80', // contact list
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80', // furniture app
  ],
  'view-transitions': [
    'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80', // spa navigation
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80', // news morph
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', // e-commerce
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80', // dark mode switch
  ],
  'flip-list': [
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80', // sort list
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80', // filter grid
    'https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=800&q=80', // kanban
    'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80', // reorder list
  ],
}

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&q=80',
  'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
]

export function getUseCaseImage(slug: string, index: number): string {
  const images = USE_CASE_IMAGES[slug] ?? FALLBACK_IMAGES
  return images[index % images.length]
}

interface ModalProps {
  useCase: UseCase & { image: string; index: number }
  slug: string
  accentColor: string
  onClose: () => void
}

export function UseCaseModal({ useCase, accentColor, onClose }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
        }}
      />

      {/* Modal — hero expansion */}
      <motion.div
        key="modal"
        layoutId={`usecase-card-${useCase.index}`}
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 1001,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
          padding: '24px',
        }}
      >
        <div style={{
          pointerEvents: 'all',
          background: 'var(--bg)',
          borderRadius: 20,
          overflow: 'hidden',
          width: '100%',
          maxWidth: 640,
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
          border: '1px solid var(--border)',
        }}>
          {/* Image */}
          <div style={{ position: 'relative', height: 280, overflow: 'hidden' }}>
            <img
              src={useCase.image}
              alt={useCase.label}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              loading="eager"
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.6) 100%)',
            }} />
            {/* Label chip on image */}
            <div style={{
              position: 'absolute', bottom: 16, left: 16,
              padding: '4px 12px', borderRadius: 20,
              background: accentColor,
              color: '#fff',
              fontSize: 11, fontFamily: 'var(--font-outfit)', fontWeight: 700,
              letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              {useCase.label}
            </div>
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: 12, right: 12,
                width: 32, height: 32, borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)',
                border: 'none',
                color: '#fff', fontSize: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                backdropFilter: 'blur(4px)',
              }}
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div style={{ padding: '24px 28px 28px' }}>
            <p style={{
              fontFamily: 'var(--font-outfit)', fontSize: 15,
              color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0,
            }}>
              {useCase.example}
            </p>

            {/* Accent line */}
            <div style={{
              marginTop: 20, paddingTop: 16,
              borderTop: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ width: 3, height: 16, borderRadius: 2, background: accentColor }} />
              <span style={{
                fontFamily: 'var(--font-outfit)', fontSize: 11, fontWeight: 600,
                color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase',
              }}>
                Real-world example
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
