'use client'

import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ANIMATIONS, PLATFORMS } from '@/lib/learnContent'
import { GridBackground } from './GridBackground'
import { useI18n } from '@/lib/i18n'
import { useBreakpoint } from '@/lib/useBreakpoint'

const CATEGORY_COLORS: Record<string, string> = {
  Entrance:   '#534AB7',
  Navigation: '#1D9E75',
  Scroll:     '#BA7517',
  Feedback:   '#D85A30',
  Loading:    '#D4537E',
  List:       '#2B8DC8',
  Carousel:   '#7C3AED',
}

import { PLATFORM_LOGOS } from './PlatformLogos'

/* ── Scroll-reveal wrapper ── */
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}


const CYCLING_WORDS_EN = ['ship.', 'scale.', 'delight.', 'convert.']
const CYCLING_WORDS_FR = ['livrent.', 'scalent.', 'ravissent.', 'convertissent.']

function CyclingWord({ lang }: { lang: 'en' | 'fr' }) {
  const words = lang === 'fr' ? CYCLING_WORDS_FR : CYCLING_WORDS_EN
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % words.length), 2500)
    return () => clearInterval(id)
  }, [words.length])

  return (
    <span style={{ display: 'inline-block', position: 'relative', overflow: 'hidden', verticalAlign: 'bottom' }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={words[index]}
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

export function HomePage() {
  const { t, lang } = useI18n()
  const { isMobile, isTablet } = useBreakpoint()
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100dvh', position: 'relative' }}>
      <GridBackground />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── Hero ── */}
        <section style={{
          maxWidth: 1100,
          margin: '0 auto',
          padding: isMobile ? '88px 20px 56px' : isTablet ? '100px 32px 72px' : '120px 40px 96px',
          textAlign: 'center',
        }}>
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
              <span style={{ color: 'var(--text-primary)' }}>{t('home_h1_that')}</span><CyclingWord lang={lang} />
            </h1>

            <p style={{
              fontFamily: 'var(--font-outfit)',
              fontSize: 'clamp(16px, 2vw, 20px)',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              maxWidth: 560,
              margin: '0 auto 44px',
            }}>
              {t('home_sub')}
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href="/learn"
                style={{
                  padding: '13px 28px', borderRadius: 10,
                  background: 'none',
                  border: '1.5px solid var(--accent)',
                  color: 'var(--accent)',
                  fontSize: 15, fontWeight: 600,
                  fontFamily: 'var(--font-outfit)',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  display: 'inline-block',
                }}
              >
                {t('home_cta')}
              </a>
              <a
                href="https://github.com/PatrickLoic-dev/splash"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '13px 28px', borderRadius: 10,
                  border: '1px solid var(--border-strong)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  fontSize: 15, fontWeight: 400,
                  fontFamily: 'var(--font-outfit)',
                  textDecoration: 'none',
                  letterSpacing: '-0.01em',
                  transition: 'border-color 0.15s ease',
                  display: 'flex', alignItems: 'center', gap: 8,
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--text-tertiary)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border-strong)')}
              >
                <GitHubIcon size={16} />
                {t('home_github')}
              </a>
            </div>
          </motion.div>
        </section>

        {/* ── Platform row ── */}
        <section style={{
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
          padding: isMobile ? '20px 20px' : '28px 40px',
          background: 'var(--bg-secondary)',
        }}>
          <div style={{
            maxWidth: 1100, margin: '0 auto',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: isMobile ? 16 : isTablet ? 28 : 48, flexWrap: 'wrap',
          }}>
            {PLATFORMS.map((p, i) => {
              const LogoComp = PLATFORM_LOGOS[p.id]
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}
                >
                  <div style={{
                    width: 52, height: 52, borderRadius: 12,
                    border: '1px solid var(--border)',
                    background: 'var(--bg)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--text-primary)',
                  }}>
                    {LogoComp && <LogoComp size={p.id === 'nextjs' ? 34 : 28} />}
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-outfit)', fontSize: 12,
                    color: 'var(--text-secondary)', fontWeight: 400,
                  }}>
                    {p.label}
                  </span>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ── Animation pattern grid ── */}
        <section style={{ maxWidth: 1100, margin: '0 auto', padding: isMobile ? '48px 20px' : isTablet ? '64px 32px' : '80px 40px' }}>
          <Reveal>
            <div style={{ marginBottom: 48 }}>
              <p style={{
                fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 600,
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--text-tertiary)', marginBottom: 12,
              }}>
                {t('home_count_label')}
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
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: isMobile ? 12 : 16,
          }}>
            {ANIMATIONS.map((anim, i) => (
              <Reveal key={anim.slug} delay={i * 0.04}>
                <motion.a
                  href={`/learn?slug=${anim.slug}`}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    display: 'block',
                    padding: '28px',
                    borderRadius: 16,
                    border: '1px solid var(--border)',
                    background: 'var(--bg-secondary)',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    height: '100%',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: 6,
                      background: (CATEGORY_COLORS[anim.category] ?? '#534AB7') + '20',
                      color: CATEGORY_COLORS[anim.category] ?? '#534AB7',
                      fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 600,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                    }}>
                      {anim.category}
                    </span>
                    <span style={{
                      fontSize: 11, fontFamily: 'var(--font-outfit)',
                      color: 'var(--text-tertiary)', fontWeight: 400,
                      letterSpacing: '0.02em',
                    }}>
                      {anim.difficulty}
                    </span>
                  </div>

                  <h3 style={{
                    fontFamily: 'var(--font-power)', fontSize: 22,
                    fontWeight: 700, letterSpacing: '-0.02em',
                    color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 10,
                  }}>
                    {anim.title}
                  </h3>

                  <p style={{
                    fontFamily: 'var(--font-outfit)', fontSize: 13,
                    color: 'var(--text-tertiary)', lineHeight: 1.6, marginBottom: 20,
                  }}>
                    {anim.tagline}
                  </p>

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {PLATFORMS.map(p => {
                      const hasImpl = anim.implementations.some(im => im.platform === p.id)
                      return (
                        <span key={p.id} style={{
                          padding: '2px 8px', borderRadius: 4,
                          background: hasImpl ? 'var(--bg-tertiary)' : 'transparent',
                          border: `1px solid ${hasImpl ? 'var(--border)' : 'transparent'}`,
                          fontFamily: 'var(--font-outfit)', fontSize: 10,
                          color: hasImpl ? 'var(--text-secondary)' : 'var(--text-tertiary)',
                          fontWeight: hasImpl ? 500 : 400,
                          opacity: hasImpl ? 1 : 0.4,
                        }}>
                          {p.label}
                        </span>
                      )
                    })}
                  </div>
                </motion.a>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ── Footer ── */}
        <footer style={{
          borderTop: '1px solid var(--border)',
          padding: isMobile ? '28px 20px' : '36px 40px',
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          maxWidth: 1100,
          margin: '0 auto',
          flexWrap: 'wrap',
          gap: 16,
        }}>
          <span style={{
            fontFamily: 'var(--font-outfit)', fontSize: 13,
            color: 'var(--text-tertiary)',
          }}>
            {t('home_license')}
          </span>
          <a
            href="https://github.com/PatrickLoic-dev/splash"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: 'var(--font-outfit)', fontSize: 13,
              color: 'var(--text-secondary)',
              textDecoration: 'none',
              border: '1px solid var(--border)',
              padding: '7px 14px', borderRadius: 8,
              background: 'var(--bg-secondary)',
              transition: 'all 0.15s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--accent)'
              e.currentTarget.style.color = 'var(--accent)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
          >
            <GitHubIcon size={15} />
            {t('home_star')}
          </a>
        </footer>
      </div>
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
