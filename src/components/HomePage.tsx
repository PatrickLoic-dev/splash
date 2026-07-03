'use client'

import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ANIMATIONS, PLATFORMS, localizeAnim } from '@/lib/learnContent'
import { GridBackground } from './GridBackground'
import { useI18n } from '@/lib/i18n'
import { useBreakpoint } from '@/lib/useBreakpoint'
import { PLATFORM_LOGOS } from './PlatformLogos'
import { Logo } from './Logo'

const FEATURED_SLUGS = ['entrance-reveal', 'shared-element', 'stagger-list', 'gesture-feedback']
const FEATURED = ANIMATIONS.filter(a => FEATURED_SLUGS.includes(a.slug))

const CATEGORY_COLORS: Record<string, string> = {
  Entrance:   '#A3E635',
  Navigation: '#1D9E75',
  Scroll:     '#BA7517',
  Feedback:   '#D85A30',
  Loading:    '#D4537E',
  List:       '#2B8DC8',
  Carousel:   '#7C3AED',
}

function CyclingWord({ lang }: { lang: 'en' | 'fr' }) {
  const words = lang === 'fr'
    ? ['livrent.', 'scalent.', 'ravissent.', 'convertissent.']
    : ['ship.', 'scale.', 'delight.', 'convert.']
  const [index, setIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % words.length), 2500)
    return () => clearInterval(id)
  }, [words.length])
  return (
    <span style={{ display: 'inline-block', position: 'relative', overflow: 'hidden', verticalAlign: 'bottom' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={words[index]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: 'inline-block', color: 'var(--accent)' }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

/* ── Scroll-reveal ── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ── Nav dots ── */
function ScrollDots({ active, count, onDot }: { active: number; count: number; onDot: (i: number) => void }) {
  return (
    <div style={{
      position: 'fixed', right: 24, top: '50%', transform: 'translateY(-50%)',
      display: 'flex', flexDirection: 'column', gap: 10, zIndex: 50,
    }}>
      {Array.from({ length: count }).map((_, i) => (
        <button key={i} onClick={() => onDot(i)}
          aria-label={`Go to section ${i + 1}`}
          style={{
            width: i === active ? 6 : 5,
            height: i === active ? 22 : 5,
            borderRadius: 99,
            border: 'none',
            background: i === active ? 'var(--accent)' : 'var(--border-strong)',
            cursor: 'pointer',
            padding: 0,
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  )
}

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/>
    </svg>
  )
}

const SECTION_COUNT = 4 // hero, platforms, animations, CTA

export function HomePage() {
  const { t, lang } = useI18n()
  const { isMobile, isTablet } = useBreakpoint()
  const [activeSection, setActiveSection] = useState(0)
  const sectionRefs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ]

  useEffect(() => {
    const observers = sectionRefs.map((ref, i) => {
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(i) },
        { threshold: 0.5 }
      )
      if (ref.current) obs.observe(ref.current)
      return obs
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  const scrollTo = (i: number) => {
    sectionRefs[i].current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{ background: 'var(--bg)', position: 'relative', cursor: 'none' }}>
      <GridBackground />
      {!isMobile && <ScrollDots active={activeSection} count={SECTION_COUNT} onDot={scrollTo} />}

      <div style={{
        position: 'relative', zIndex: 1,
        height: '100dvh', overflowY: 'scroll',
        scrollSnapType: 'y mandatory',
        scrollBehavior: 'smooth',
      }}>

        {/* ── Section 1: Hero ── */}
        <section ref={sectionRefs[0]} style={{
          height: '100dvh',
          scrollSnapAlign: 'start',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? '0 20px' : '0 40px',
        }}>
          <div style={{ textAlign: 'center', maxWidth: 720 }}>
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 14px', borderRadius: 20,
                border: '1px solid var(--border)',
                background: 'var(--bg-secondary)',
                marginBottom: 32,
              }}>
                <span style={{
                  fontSize: 11, fontFamily: 'var(--font-outfit)', fontWeight: 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--accent)',
                }}>
                  {t('home_badge')}
                </span>
              </div>

              <h1 style={{
                fontFamily: 'var(--font-power)',
                fontSize: 'clamp(44px, 7vw, 80px)',
                fontWeight: 700,
                letterSpacing: '-0.04em',
                color: 'var(--text-primary)',
                lineHeight: 1.04,
                marginBottom: 28,
              }}>
                {t('home_h1_line1')}
                <br />
                <span style={{ color: 'var(--text-primary)' }}>{t('home_h1_that')}</span>
                <CyclingWord lang={lang} />
              </h1>

              <p style={{
                fontFamily: 'var(--font-outfit)',
                fontSize: 'clamp(15px, 2vw, 19px)',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: 520,
                margin: '0 auto 44px',
              }}>
                {t('home_sub')}
              </p>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href="/learn" className="btn-border-anim"
                  style={{
                    padding: '13px 32px', borderRadius: 10,
                    color: 'var(--text-primary)',
                    fontSize: 15, fontWeight: 600,
                    fontFamily: 'var(--font-outfit)',
                    textDecoration: 'none',
                    letterSpacing: '-0.01em',
                    display: 'inline-block',
                  }}
                >
                  {t('home_cta')}
                </a>
                <a href="https://github.com/PatrickLoic-dev/splash" target="_blank" rel="noopener noreferrer"
                  style={{
                    padding: '13px 24px', borderRadius: 10,
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text-secondary)',
                    fontSize: 15, fontWeight: 500,
                    fontFamily: 'var(--font-outfit)',
                    textDecoration: 'none',
                    display: 'flex', alignItems: 'center', gap: 8,
                    transition: 'border-color 0.15s, color 0.15s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--text-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border-strong)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                  <GitHubIcon size={16} />
                  {t('home_github')}
                </a>
              </div>
            </motion.div>

            {/* scroll hint */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}
              style={{ marginTop: 56, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
            >
              <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 11, color: 'var(--text-tertiary)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Scroll
              </span>
              <motion.div
                animate={{ y: [0, 6, 0] }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
                style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, var(--accent), transparent)' }}
              />
            </motion.div>
          </div>
        </section>

        {/* ── Section 2: Platforms ── */}
        <section ref={sectionRefs[1]} style={{
          height: '100dvh',
          scrollSnapAlign: 'start',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? '0 20px' : '0 40px',
        }}>
          <div style={{ maxWidth: 800, width: '100%', textAlign: 'center' }}>
            <Reveal>
              <p style={{
                fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 600,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--accent)', marginBottom: 16,
              }}>
                {t('home_badge')}
              </p>
              <h2 style={{
                fontFamily: 'var(--font-power)', fontWeight: 700,
                fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '-0.03em',
                color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 48,
              }}>
                {lang === 'fr' ? 'Toutes les plateformes.' : 'Every platform.'}
              </h2>
            </Reveal>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: isMobile ? 16 : 36, flexWrap: 'wrap',
            }}>
              {PLATFORMS.map((p, i) => {
                const LogoComp = PLATFORM_LOGOS[p.id]
                return (
                  <motion.div key={p.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
                  >
                    <div style={{
                      width: 64, height: 64, borderRadius: 16,
                      border: '1px solid var(--border)',
                      background: 'var(--bg-secondary)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--text-primary)',
                    }}>
                      {LogoComp && <LogoComp size={p.id === 'nextjs' ? 38 : 32} />}
                    </div>
                    <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {p.label}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Section 3: 3 Featured Animations ── */}
        <section ref={sectionRefs[2]} style={{
          minHeight: '100dvh',
          scrollSnapAlign: 'start',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? '80px 20px' : '80px 40px',
        }}>
          <div style={{ maxWidth: 1000, width: '100%' }}>
            <Reveal>
              <div style={{ textAlign: 'center', marginBottom: 48 }}>
                <p style={{
                  fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 600,
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                  color: 'var(--accent)', marginBottom: 12,
                }}>
                  {ANIMATIONS.length} {lang === 'fr' ? 'patterns' : 'patterns'}
                </p>
                <h2 style={{
                  fontFamily: 'var(--font-power)', fontWeight: 700,
                  fontSize: 'clamp(28px, 4vw, 42px)', letterSpacing: '-0.03em',
                  color: 'var(--text-primary)', lineHeight: 1.1,
                }}>
                  {t('home_section_h2')}
                </h2>
              </div>
            </Reveal>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
              gap: 16,
            }}>
              {FEATURED.map((anim, i) => {
                const loc = localizeAnim(anim, lang)
                return (
                  <Reveal key={anim.slug} delay={i * 0.08}>
                    <motion.a
                      href={`/learn?slug=${anim.slug}`}
                      whileHover={{ y: -6, transition: { duration: 0.2 } }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        display: 'block', padding: '28px', borderRadius: 16,
                        border: '1px solid var(--border)',
                        background: 'var(--bg-secondary)',
                        textDecoration: 'none', height: '100%',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                        <span style={{
                          padding: '4px 10px', borderRadius: 6,
                          background: (CATEGORY_COLORS[anim.category] ?? '#A3E635') + '20',
                          color: CATEGORY_COLORS[anim.category] ?? '#A3E635',
                          fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 600,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}>
                          {anim.category}
                        </span>
                        <span style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)' }}>
                          {anim.difficulty}
                        </span>
                      </div>
                      <h3 style={{
                        fontFamily: 'var(--font-power)', fontSize: 22,
                        fontWeight: 700, letterSpacing: '-0.02em',
                        color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 10,
                      }}>
                        {loc.title}
                      </h3>
                      <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 13, color: 'var(--text-tertiary)', lineHeight: 1.6 }}>
                        {loc.tagline}
                      </p>
                    </motion.a>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Section 4: CTA ── */}
        <section ref={sectionRefs[3]} style={{
          height: '100dvh',
          scrollSnapAlign: 'start',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: isMobile ? '0 20px' : '0 40px',
          textAlign: 'center',
        }}>
          <Reveal>
            <div style={{ maxWidth: 600 }}>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{ margin: '0 auto 32px', display: 'flex', justifyContent: 'center' }}
              >
                <Logo size={64} showWordmark={false} />
              </motion.div>

              <h2 style={{
                fontFamily: 'var(--font-power)', fontWeight: 700,
                fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-0.03em',
                color: 'var(--text-primary)', lineHeight: 1.1, marginBottom: 20,
              }}>
                {lang === 'fr' ? 'Prêt à animer ?' : 'Ready to animate?'}
              </h2>
              <p style={{
                fontFamily: 'var(--font-outfit)', fontSize: 17,
                color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40,
              }}>
                {lang === 'fr'
                  ? '10 patterns fondamentaux. Chaque plateforme. Du code prêt pour la production.'
                  : '10 fundamental patterns. Every platform. Production-ready code.'}
              </p>
              <a href="/learn" className="btn-border-anim"
                style={{
                  padding: '16px 40px', borderRadius: 12,
                  color: 'var(--text-primary)',
                  fontSize: 16, fontWeight: 600,
                  fontFamily: 'var(--font-outfit)',
                  textDecoration: 'none',
                  display: 'inline-block',
                  letterSpacing: '-0.01em',
                }}
              >
                {t('home_cta')} →
              </a>
            </div>
          </Reveal>
        </section>

      </div>
    </div>
  )
}
