'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import {
  ANIMATIONS, PLATFORMS, WEB_PLATFORMS, MOBILE_PLATFORMS,
  localizeAnim, localizeStep,
  type Animation, type PlatformId, type Context, type PlatformImpl,
} from '@/lib/learnContent'
import { getSteps, type Step } from '@/lib/steps'
import { Navbar } from './Navbar'
import { AnimationPreview } from './AnimationPreview'
import { BrowserFrame } from './BrowserFrame'
import { PhoneFrame } from './PhoneFrame'
import { GridBackground } from './GridBackground'
import { useI18n } from '@/lib/i18n'
import { useBreakpoint } from '@/lib/useBreakpoint'

const CAT_COLORS: Record<string, string> = {
  Entrance:   '#534AB7',
  Navigation: '#1D9E75',
  Scroll:     '#BA7517',
  Feedback:   '#D85A30',
  Loading:    '#D4537E',
  List:       '#2B8DC8',
  Carousel:   '#7C3AED',
}

const DIFF_COLORS: Record<string, string> = {
  Beginner:     '#1D9E75',
  Intermediate: '#BA7517',
  Advanced:     '#D85A30',
}

const PLATFORM_CONTEXT: Record<string, Context> = {
  react:          'web',
  nextjs:         'web',
  vue:            'web',
  'react-native': 'mobile',
  flutter:        'mobile',
}

/* ── Platform SVG logos ── */
function ReactLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
      <g stroke="#61dafb" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </g>
    </svg>
  )
}
function NextjsLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * (80/394)} viewBox="0 0 394 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M261.919 0.0330722H330.547V12.7H303.323V79.339H289.71V12.7H261.919V0.0330722Z" fill="currentColor"/>
      <path d="M149.052 0.0330722V12.7H94.0421V33.0772H138.281V45.7441H94.0421V66.6721H149.052V79.339H80.43V12.7H80.4243V0.0330722H149.052Z" fill="currentColor"/>
      <path d="M183.32 0.0661486H165.506L229.312 79.3721H247.178L215.271 39.7464L247.127 0.126654L229.312 0.154184L206.352 28.6697L183.32 0.0661486Z" fill="currentColor"/>
      <path d="M201.6 56.7148L192.679 45.6229L165.455 79.4326H183.32L201.6 56.7148Z" fill="currentColor"/>
      <path fillRule="evenodd" clipRule="evenodd" d="M80.907 79.339L17.0151 0H0V79.3059H13.6121V16.9516L63.8067 79.339H80.907Z" fill="currentColor"/>
    </svg>
  )
}
function VueLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size * (226.69/261.76)} viewBox="0 0 261.76 226.69" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(1.3333 0 0 -1.3333 -76.311 313.34)">
        <g transform="translate(178.06 235.01)">
          <path d="m0 0-22.669-39.264-22.669 39.264h-75.491l98.16-170.02 98.16 170.02z" fill="#41b883"/>
        </g>
        <g transform="translate(178.06 235.01)">
          <path d="m0 0-22.669-39.264-22.669 39.264h-36.227l58.896-102.01 58.896 102.01z" fill="#34495e"/>
        </g>
      </g>
    </svg>
  )
}
function FlutterLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
      <g transform="matrix(.061615 0 0 .061615 -1.430818 -1.2754)">
        <defs>
          <path id="fLPa" d="M959.4 500L679.8 779.7l279.6 279.7H639.9L360.2 779.7 639.9 500h319.5zM639.9 20.7L120.6 540l159.8 159.8 679-679.1H639.9z"/>
        </defs>
        <clipPath id="fLPb"><use href="#fLPa"/></clipPath>
        <g clipPath="url(#fLPb)"><path d="M360.3 779.7L520 939.5 959.4 500H639.9z" fill="#39cefd"/></g>
        <defs>
          <path id="fLPc" d="M959.4 500L679.8 779.7l279.6 279.7H639.9L360.2 779.7 639.9 500h319.5zM639.9 20.7L120.6 540l159.8 159.8 679-679.1H639.9z"/>
        </defs>
        <clipPath id="fLPd"><use href="#fLPc"/></clipPath>
        <path clipPath="url(#fLPd)" d="M639.9 20.7h319.5l-679 679.1L120.6 540z" fill="#39cefd"/>
        <defs>
          <path id="fLPe" d="M959.4 500L679.8 779.7l279.6 279.7H639.9L360.2 779.7 639.9 500h319.5zM639.9 20.7L120.6 540l159.8 159.8 679-679.1H639.9z"/>
        </defs>
        <clipPath id="fLPf"><use href="#fLPe"/></clipPath>
        <path clipPath="url(#fLPf)" d="M520 939.5l119.9 119.8h319.5L679.8 779.7z" fill="#03569b"/>
        <g clipPath="url(#fLPb)">
          <path d="M360.282 779.645L520.086 619.84 679.9 779.645 520.086 939.45z" fill="#16b9fd"/>
        </g>
      </g>
    </svg>
  )
}
function ReactNativeLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" xmlns="http://www.w3.org/2000/svg">
      <circle cx="0" cy="0" r="2.05" fill="#61dafb"/>
      <g stroke="#61dafb" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2"/>
        <ellipse rx="11" ry="4.2" transform="rotate(60)"/>
        <ellipse rx="11" ry="4.2" transform="rotate(120)"/>
      </g>
    </svg>
  )
}

const PLATFORM_LOGOS: Record<string, React.FC<{ size?: number }>> = {
  react:          ReactLogo,
  nextjs:         NextjsLogo,
  vue:            VueLogo,
  'react-native': ReactNativeLogo,
  flutter:        FlutterLogo,
}

/* ── View state ── */
type ViewState =
  | { kind: 'selector' }
  | { kind: 'filtered'; platform: PlatformId }
  | { kind: 'detail'; slug: string; context: Context; platform: PlatformId }

export function LearnPage() {
  const searchParams = useSearchParams()
  const [view,       setView]       = useState<ViewState>({ kind: 'selector' })
  const [replayKey,  setReplayKey]  = useState(0)
  const [stepIndex,  setStepIndex]  = useState(0)
  // track which platform was clicked so the non-clicked cards can fade out
  const [clickedPlatform, setClickedPlatform] = useState<PlatformId | null>(null)

  // Handle ?slug= URL param — auto-navigate to the correct animation
  useEffect(() => {
    const slug = searchParams.get('slug')
    if (!slug) return
    const anim = ANIMATIONS.find(a => a.slug === slug)
    if (!anim) return
    const platform = anim.implementations[0]?.platform ?? 'react'
    const context  = PLATFORM_CONTEXT[platform] ?? 'web'
    setView({ kind: 'detail', slug, context, platform })
  }, [searchParams])

  function openFiltered(platform: PlatformId) {
    setClickedPlatform(platform)
    // small delay to let the click animation play before switching view
    setTimeout(() => {
      setView({ kind: 'filtered', platform })
      setClickedPlatform(null)
    }, 80)
  }

  function openDetail(slug: string, context: Context, platform?: PlatformId) {
    const anim             = ANIMATIONS.find(a => a.slug === slug)!
    const pool             = context === 'web' ? WEB_PLATFORMS : MOBILE_PLATFORMS
    const resolvedPlatform = platform
      ?? anim.implementations.find(i => pool.includes(i.platform))?.platform
      ?? pool[0]
    setView({ kind: 'detail', slug, context, platform: resolvedPlatform })
    setReplayKey(k => k + 1)
    setStepIndex(0)
  }

  function openDetailFromFilter(slug: string, platform: PlatformId) {
    openDetail(slug, PLATFORM_CONTEXT[platform] ?? 'web', platform)
  }

  const showGrid = view.kind === 'selector' || view.kind === 'filtered'

  return (
    <>
      <Navbar />
      {showGrid && <GridBackground />}
      <div style={{ paddingTop: 56, background: 'var(--bg)', minHeight: '100dvh', position: 'relative', zIndex: 1 }}>
        <LayoutGroup>
          <AnimatePresence mode="popLayout">
            {view.kind === 'selector' ? (
              <motion.div key="selector"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SelectorView
                  clickedPlatform={clickedPlatform}
                  onSelectPlatform={openFiltered}
                />
              </motion.div>

            ) : view.kind === 'filtered' ? (
              <motion.div key={`filtered-${view.platform}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FilteredView
                  platform={view.platform}
                  onBack={() => setView({ kind: 'selector' })}
                  onSelect={openDetailFromFilter}
                  onSwitchPlatform={(p) => setView({ kind: 'filtered', platform: p })}
                />
              </motion.div>

            ) : (
              <motion.div
                key={`detail-${view.slug}-${view.context}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: 'calc(100dvh - 56px)', display: 'flex', flexDirection: 'column' }}
              >
                <DetailView
                  slug={view.slug}
                  context={view.context}
                  platform={view.platform}
                  replayKey={replayKey}
                  stepIndex={stepIndex}
                  onBack={() => setView({ kind: 'filtered', platform: view.platform })}
                  onContextSwitch={ctx => openDetail(view.slug, ctx)}
                  onPlatformChange={p => {
                    setView(v => v.kind === 'detail' ? { ...v, platform: p } : v)
                    setStepIndex(0)
                  }}
                  onNavigate={(slug, ctx) => openDetail(slug, ctx)}
                  onReplay={() => setReplayKey(k => k + 1)}
                  onStepChange={setStepIndex}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </LayoutGroup>
      </div>
    </>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Selector — platform cards                                                  */
/* ────────────────────────────────────────────────────────────────────────── */

function SelectorView({
  onSelectPlatform,
  clickedPlatform,
}: {
  onSelectPlatform: (p: PlatformId) => void
  clickedPlatform: PlatformId | null
}) {
  const { t } = useI18n()
  const { isMobile, isTablet } = useBreakpoint()
  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: isMobile ? '40px 20px 72px' : isTablet ? '48px 28px 80px' : '64px 40px 96px' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginBottom: 48 }}
      >
        <p style={{
          fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 600,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--text-tertiary)', marginBottom: 10,
        }}>
          {t('sel_eyebrow')}
        </p>
        <h1 style={{
          fontFamily: 'var(--font-power)', fontSize: 'clamp(32px, 4vw, 48px)',
          fontWeight: 700, letterSpacing: '-0.03em',
          color: 'var(--text-primary)', lineHeight: 1.08, marginBottom: 14,
        }}>
          {t('sel_h1')}
        </h1>
        <p style={{
          fontFamily: 'var(--font-outfit)', fontSize: 16,
          color: 'var(--text-secondary)', lineHeight: 1.7, maxWidth: 480,
        }}>
          {t('sel_sub')}
        </p>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: isMobile ? 10 : 16,
      }}>
        {PLATFORMS.map((p, i) => {
          const LogoComp = PLATFORM_LOGOS[p.id]
          const isWeb    = WEB_PLATFORMS.includes(p.id)
          const isClicked = clickedPlatform === p.id
          const isDimmed  = clickedPlatform !== null && !isClicked

          return (
            <motion.button
              key={p.id}
              layoutId={`plt-card-${p.id}`}
              onClick={() => onSelectPlatform(p.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isDimmed ? 0.3 : 1,
                y: 0,
                scale: isClicked ? 1.04 : 1,
              }}
              transition={{
                opacity: { duration: 0.18 },
                scale: { duration: 0.12 },
                y: { delay: 0.05 + i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              }}
              whileHover={clickedPlatform ? {} : { y: -4, scale: 1.02 }}
              whileTap={clickedPlatform ? {} : { scale: 0.97 }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: '28px 20px',
                cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
              }}
              onMouseEnter={e => {
                if (clickedPlatform) return
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(83,74,183,0.12)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* This icon container has a layoutId that morphs into the FilteredView header */}
              <motion.div
                layoutId={`plt-icon-${p.id}`}
                style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--text-primary)',
                }}
              >
                {LogoComp && <LogoComp size={p.id === 'nextjs' ? 36 : 30} />}
              </motion.div>
              <motion.div style={{ textAlign: 'center' }} layoutId={`plt-label-${p.id}`}>
                <div style={{
                  fontFamily: 'var(--font-power)', fontSize: 15, fontWeight: 700,
                  letterSpacing: '-0.01em', color: 'var(--text-primary)', marginBottom: 4,
                }}>
                  {p.label}
                </div>
                <div style={{
                  fontSize: 10, fontFamily: 'var(--font-outfit)',
                  color: 'var(--text-tertiary)', letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}>
                  {isWeb ? t('sel_web') : t('sel_mobile')}
                </div>
              </motion.div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Filtered — animation list for a platform                                  */
/* ────────────────────────────────────────────────────────────────────────── */

function FilteredView({
  platform, onBack, onSelect, onSwitchPlatform
}: {
  platform: PlatformId
  onBack: () => void
  onSelect: (slug: string, platform: PlatformId) => void
  onSwitchPlatform: (p: PlatformId) => void
}) {
  const { t } = useI18n()
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const platformInfo = PLATFORMS.find(p => p.id === platform)!
  const context      = PLATFORM_CONTEXT[platform] ?? 'web'
  const available    = ANIMATIONS.filter(a => a.implementations.some(i => i.platform === platform))
  const LogoComp     = PLATFORM_LOGOS[platform]

  /* ── Secondary filters ── */
  const allCategories  = Array.from(new Set(available.map(a => a.category))) as string[]
  const allDifficulties: Array<'Beginner' | 'Intermediate' | 'Advanced'> = ['Beginner', 'Intermediate', 'Advanced']
  const [activeCats,   setActiveCats]   = useState<string[]>([])
  const [activeDiffs,  setActiveDiffs]  = useState<string[]>([])

  function toggleCat(cat: string) {
    setActiveCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }
  function toggleDiff(diff: string) {
    setActiveDiffs(prev => prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff])
  }

  const filtered = available.filter(a =>
    (activeCats.length  === 0 || activeCats.includes(a.category))  &&
    (activeDiffs.length === 0 || activeDiffs.includes(a.difficulty))
  )

  const hasActiveFilters = activeCats.length > 0 || activeDiffs.length > 0

  /* ── Left sidebar (desktop) / horizontal chips (mobile/tablet) ── */
  const SidebarSection = ({ label, items, active, onToggle, colorMap }: {
    label: string
    items: string[]
    active: string[]
    onToggle: (v: string) => void
    colorMap?: Record<string, string>
  }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontSize: 9, fontFamily: 'var(--font-outfit)', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--text-tertiary)', marginBottom: 8,
      }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: isDesktop ? 'column' : 'row', gap: 4, flexWrap: 'wrap' }}>
        {items.map(item => {
          const isActive = active.includes(item)
          const color    = colorMap?.[item] ?? 'var(--accent)'
          return (
            <motion.button key={item} whileTap={{ scale: 0.95 }}
              onClick={() => onToggle(item)}
              style={{
                padding: isDesktop ? '6px 10px' : '4px 10px',
                borderRadius: 7, cursor: 'pointer',
                border: `1px solid ${isActive ? color + '60' : 'var(--border)'}`,
                background: isActive ? color + '14' : 'transparent',
                color: isActive ? color : 'var(--text-tertiary)',
                fontSize: 11, fontFamily: 'var(--font-outfit)',
                fontWeight: isActive ? 600 : 400,
                textAlign: 'left', width: isDesktop ? '100%' : 'auto',
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {isActive && <span style={{ width: 5, height: 5, borderRadius: 3, background: color, flexShrink: 0 }} />}
              {item}
            </motion.button>
          )
        })}
      </div>
    </div>
  )

  const sidebar = (
    <div style={{
      width: isDesktop ? 172 : '100%',
      flexShrink: 0,
      ...(isDesktop ? {
        position: 'sticky', top: 76, alignSelf: 'flex-start',
        padding: '16px 14px', borderRadius: 12,
        border: '1px solid var(--border)', background: 'var(--bg-secondary)',
      } : {}),
    }}>
      {isDesktop && (
        <div style={{ fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 16, letterSpacing: '0.04em' }}>
          Filters {hasActiveFilters && <span style={{ color: 'var(--accent)' }}>· {filtered.length}</span>}
        </div>
      )}
      <SidebarSection
        label="Category"
        items={allCategories}
        active={activeCats}
        onToggle={toggleCat}
        colorMap={CAT_COLORS}
      />
      <SidebarSection
        label="Difficulty"
        items={allDifficulties.filter(d => available.some(a => a.difficulty === d))}
        active={activeDiffs}
        onToggle={toggleDiff}
        colorMap={DIFF_COLORS}
      />
      {hasActiveFilters && (
        <button onClick={() => { setActiveCats([]); setActiveDiffs([]) }} style={{
          fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)',
          background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>Clear filters</button>
      )}
    </div>
  )

  return (
    <div style={{ maxWidth: isDesktop ? 1200 : 1000, margin: '0 auto', padding: isMobile ? '32px 16px 72px' : isTablet ? '40px 28px 80px' : '48px 40px 96px' }}>

      {/* Header — icon morphs from the selected platform card via layoutId */}
      <div style={{ marginBottom: 32 }}>
        <button onClick={onBack} style={{
          fontSize: 12, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)',
          background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 16px',
          display: 'flex', alignItems: 'center', gap: 6,
          transition: 'color 0.15s',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
        >
          {t('filt_back')}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <motion.div
            layoutId={`plt-icon-${platform}`}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            style={{
              width: 52, height: 52, borderRadius: 12,
              background: 'var(--bg-secondary)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-primary)', flexShrink: 0,
            }}
          >
            {LogoComp && <LogoComp size={platform === 'nextjs' ? 34 : 28} />}
          </motion.div>
          <motion.div layoutId={`plt-label-${platform}`}>
            <h1 style={{
              fontFamily: 'var(--font-power)', fontSize: 'clamp(26px, 3.5vw, 36px)',
              fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)',
            }}>
              {platformInfo.label}
            </h1>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 13, color: 'var(--text-tertiary)', marginTop: 3 }}>
              {hasActiveFilters ? `${filtered.length} of ${available.length}` : available.length} {t('filt_patterns')} · {context === 'web' ? t('sel_web') : t('sel_mobile')}
            </p>
          </motion.div>
        </div>

        {/* Platform switcher pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {PLATFORMS.map(p => {
            const LComp  = PLATFORM_LOGOS[p.id]
            const active = p.id === platform
            return (
              <motion.button
                key={p.id}
                onClick={() => onSwitchPlatform(p.id)}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '6px 12px', borderRadius: 8,
                  border: `1px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                  background: active ? 'var(--accent-faint)' : 'var(--bg-secondary)',
                  color: active ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: 12, fontFamily: 'var(--font-outfit)', fontWeight: active ? 600 : 400,
                  cursor: 'pointer', transition: 'all 0.15s',
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', color: active ? 'var(--accent)' : 'var(--text-tertiary)' }}>
                  {LComp && <LComp size={p.id === 'nextjs' ? 22 : 14} />}
                </span>
                {p.label}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Body: sidebar + cards */}
      <div style={{ display: 'flex', gap: isDesktop ? 28 : 0, alignItems: 'flex-start', flexDirection: isDesktop ? 'row' : 'column' }}>

        {/* Sidebar / horizontal chips */}
        {!isDesktop && <div style={{ width: '100%', marginBottom: 16 }}>{sidebar}</div>}
        {isDesktop && sidebar}

        {/* Animation cards grid */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontFamily: 'var(--font-outfit)', fontSize: 13 }}>
                No animations match the selected filters.
                <button onClick={() => { setActiveCats([]); setActiveDiffs([]) }} style={{ display: 'block', margin: '12px auto 0', fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>Clear filters</button>
              </motion.div>
            ) : (
              <motion.div key="grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: isMobile ? 10 : 14,
                }}
              >
                {filtered.map((anim, i) => (
                  <motion.div
                    key={anim.slug}
                    layout
                    onClick={() => onSelect(anim.slug, platform)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(anim.slug, platform) } }}
                    role="button"
                    tabIndex={0}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{
                      delay: 0.04 + i * 0.03, duration: 0.35, ease: [0.22, 1, 0.36, 1],
                      layout: { type: 'tween', duration: 0.22, ease: [0.22, 1, 0.36, 1] },
                    }}
                    whileHover={{ y: -3, transition: { duration: 0.15, ease: 'easeOut' } }}
                    whileTap={{ scale: 0.98, transition: { duration: 0.08 } }}
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: 14,
                      padding: 0,
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex', flexDirection: 'column', gap: 0,
                      overflow: 'hidden',
                      willChange: 'transform, opacity',
                    }}
                    onMouseEnter={e => {
                      const c = CAT_COLORS[anim.category] ?? '#534AB7'
                      e.currentTarget.style.borderColor = c + '60'
                      e.currentTarget.style.boxShadow   = `0 4px 20px ${c}14`
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = 'var(--border)'
                      e.currentTarget.style.boxShadow   = 'none'
                    }}
                  >
                    {/* ── Mini framed preview thumbnail ── */}
                    <div style={{
                      height: context === 'mobile' ? 148 : 136,
                      overflow: 'hidden',
                      borderBottom: '1px solid var(--border)',
                      background: 'var(--bg)',
                      display: 'flex',
                      alignItems: context === 'mobile' ? 'flex-start' : 'stretch',
                      justifyContent: context === 'mobile' ? 'center' : 'stretch',
                      pointerEvents: 'none',
                      flexShrink: 0,
                      contain: 'layout paint',
                    }}>
                      {context === 'mobile' ? (
                        <div style={{ transform: 'scale(0.32) translateZ(0)', transformOrigin: 'top center', width: 200, flexShrink: 0 }}>
                          <PhoneFrame>
                            <AnimationPreview slug={anim.slug} context="mobile" stepIndex={3} />
                          </PhoneFrame>
                        </div>
                      ) : (
                        <div style={{ transform: 'scale(0.56) translateZ(0)', transformOrigin: 'top left', width: '179%', flexShrink: 0 }}>
                          <BrowserFrame>
                            <AnimationPreview slug={anim.slug} context="web" stepIndex={3} />
                          </BrowserFrame>
                        </div>
                      )}
                    </div>

                    {/* ── Text content ── */}
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{
                          padding: '3px 8px', borderRadius: 5,
                          background: (CAT_COLORS[anim.category] ?? '#534AB7') + '18',
                          color: CAT_COLORS[anim.category] ?? '#534AB7',
                          fontSize: 9, fontFamily: 'var(--font-outfit)', fontWeight: 600,
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}>
                          {anim.category}
                        </span>
                        <span style={{
                          fontSize: 10, fontFamily: 'var(--font-outfit)',
                          color: DIFF_COLORS[anim.difficulty], letterSpacing: '0.04em',
                        }}>
                          {t(`diff_${anim.difficulty}` as Parameters<typeof t>[0])}
                        </span>
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-power)', fontSize: 18, fontWeight: 700,
                        letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.2,
                      }}>
                        {anim.title}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-outfit)', fontSize: 12,
                        color: 'var(--text-tertiary)', lineHeight: 1.6,
                      }}>
                        {anim.tagline}
                      </div>
                      <div style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--accent)', marginTop: 2 }}>
                        {t('filt_cta')}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Detail                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

function DetailView({
  slug, context, platform, replayKey, stepIndex,
  onBack, onContextSwitch, onPlatformChange, onNavigate, onReplay, onStepChange,
}: {
  slug: string; context: Context; platform: PlatformId; replayKey: number; stepIndex: number
  onBack: () => void; onContextSwitch: (ctx: Context) => void; onPlatformChange: (p: PlatformId) => void
  onNavigate: (slug: string, ctx: Context) => void; onReplay: () => void; onStepChange: (i: number) => void
}) {
  const { t, lang } = useI18n()
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const useTabs = isMobile || isTablet
  const [activeTab, setActiveTab] = useState<'preview' | 'learn'>('preview')
  const rawAnim     = ANIMATIONS.find(a => a.slug === slug)!
  const anim        = localizeAnim(rawAnim, lang)
  const accentColor = CAT_COLORS[anim.category] ?? '#534AB7'
  const pool        = context === 'web' ? WEB_PLATFORMS : MOBILE_PLATFORMS
  const impl        = anim.implementations.find(i => i.platform === platform)
  const idx         = ANIMATIONS.findIndex(a => a.slug === slug)
  const prev        = ANIMATIONS[idx - 1]
  const next        = ANIMATIONS[idx + 1]
  const steps       = getSteps(slug, platform)
  const currentStep = steps[stepIndex] ?? steps[0]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

      {/* ── Top bar ── */}
      <div style={{
        height: 50, padding: isMobile ? '0 12px' : '0 20px', flexShrink: 0,
        display: 'flex', alignItems: 'center', gap: isMobile ? 6 : 12,
        borderBottom: '1px solid var(--border)', background: 'var(--bg)',
        overflowX: 'auto',
      }}>
        <button onClick={onBack} style={{
          fontSize: 12, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)',
          background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px', borderRadius: 6, flexShrink: 0,
        }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-tertiary)')}
        >{t('det_back')}</button>

        {!isMobile && <span style={{ color: 'var(--border-strong)', fontSize: 16 }}>|</span>}
        {!isMobile && (
          <span style={{ fontFamily: 'var(--font-power)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
            {anim.title}
          </span>
        )}
        {!isMobile && (
          <span style={{ padding: '2px 8px', borderRadius: 5, background: accentColor + '18', color: accentColor, fontSize: 9, fontFamily: 'var(--font-outfit)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
            {anim.category}
          </span>
        )}
        {!isMobile && (
          <span style={{ padding: '2px 8px', borderRadius: 5, background: 'var(--bg-tertiary)', color: DIFF_COLORS[anim.difficulty], fontSize: 9, fontFamily: 'var(--font-outfit)', fontWeight: 500, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
            {t(`diff_${anim.difficulty}` as Parameters<typeof t>[0])}
          </span>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 4, flexShrink: 0 }}>
          {(['web', 'mobile'] as Context[]).map(ctx => (
            <button key={ctx} onClick={() => onContextSwitch(ctx)} style={{
              padding: '5px 14px', borderRadius: 7,
              background: context === ctx ? accentColor : 'var(--bg-secondary)',
              border: `1px solid ${context === ctx ? accentColor : 'var(--border)'}`,
              color: context === ctx ? '#fff' : 'var(--text-secondary)',
              fontSize: 11, cursor: 'pointer', fontFamily: 'var(--font-outfit)', fontWeight: 500, transition: 'all 0.15s ease', whiteSpace: 'nowrap',
            }}>{ctx === 'web' ? t('det_web') : t('det_mobile')}</button>
          ))}
        </div>
        {!isMobile && (
          <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            <button onClick={() => prev && onNavigate(prev.slug, context)} disabled={!prev} style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 11,
              border: '1px solid var(--border)', background: 'var(--bg-secondary)',
              color: prev ? 'var(--text-secondary)' : 'var(--border-strong)',
              cursor: prev ? 'pointer' : 'default', fontFamily: 'var(--font-outfit)',
            }}>←</button>
            <button onClick={() => next && onNavigate(next.slug, context)} disabled={!next} style={{
              padding: '4px 10px', borderRadius: 6, fontSize: 11,
              border: '1px solid var(--border)', background: 'var(--bg-secondary)',
              color: next ? 'var(--text-secondary)' : 'var(--border-strong)',
              cursor: next ? 'pointer' : 'default', fontFamily: 'var(--font-outfit)',
            }}>→</button>
          </div>
        )}
      </div>

      {/* ══ MOBILE / TABLET → tabs ══ */}
      {useTabs && (
        <>
          {/* Tab bar */}
          <div style={{ display: 'flex', flexShrink: 0, borderBottom: '1px solid var(--border)', background: 'var(--bg)', padding: '0 20px' }}>
            {(['preview', 'learn'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '10px 18px', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: 'var(--font-outfit)', fontSize: 13, fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-tertiary)',
                borderBottom: `2px solid ${activeTab === tab ? accentColor : 'transparent'}`,
                marginBottom: -1, transition: 'all 0.15s ease',
              }}>
                {tab === 'preview' ? t('det_tab_preview') : t('det_tab_learn')}
              </button>
            ))}
          </div>

          {/* Tab panels */}
          <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>
            <AnimatePresence mode="wait" initial={false}>

              {activeTab === 'preview' && (
                <motion.div key="preview"
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'absolute', inset: 0, overflowY: 'auto', background: 'var(--bg-secondary)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 16, gap: 16 }}
                >
                  <PreviewPanel slug={slug} context={context} replayKey={replayKey} stepIndex={stepIndex} steps={steps} accentColor={accentColor} onStepChange={i => { onStepChange(i); setActiveTab('learn') }} onReplay={onReplay} concept={anim.concept} t={t} />
                  {steps.length > 0 && (
                    <button onClick={() => setActiveTab('learn')} style={{ padding: '9px 22px', borderRadius: 9, background: accentColor, color: '#fff', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-outfit)', fontSize: 13, fontWeight: 600 }}>
                      {t('det_tab_learn')} →
                    </button>
                  )}
                </motion.div>
              )}

              {activeTab === 'learn' && (
                <motion.div key="learn"
                  initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 12 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                  style={{ position: 'absolute', inset: 0, overflowY: 'auto', padding: '24px 16px 60px' }}
                >
                  <LearnPanel anim={anim} rawAnim={rawAnim} pool={pool} platform={platform} impl={impl} steps={steps} stepIndex={stepIndex} currentStep={currentStep} accentColor={accentColor} context={context} onPlatformChange={onPlatformChange} onStepChange={onStepChange} lang={lang} t={t} />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </>
      )}

      {/* ══ DESKTOP → side-by-side ══ */}
      {!useTabs && (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
          {/* Left: preview panel */}
          <div style={{
            width: 380, flexShrink: 0,
            borderRight: '1px solid var(--border)',
            background: 'var(--bg-secondary)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: 24, gap: 16, overflowY: 'auto',
          }}>
            <PreviewPanel slug={slug} context={context} replayKey={replayKey} stepIndex={stepIndex} steps={steps} accentColor={accentColor} onStepChange={onStepChange} onReplay={onReplay} concept={anim.concept} t={t} />
          </div>

          {/* Right: learn panel */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '36px 48px 80px' }}>
            <LearnPanel anim={anim} rawAnim={rawAnim} pool={pool} platform={platform} impl={impl} steps={steps} stepIndex={stepIndex} currentStep={currentStep} accentColor={accentColor} context={context} onPlatformChange={onPlatformChange} onStepChange={onStepChange} lang={lang} t={t} />
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Shared preview panel (used in both tab and side-by-side layouts) ── */
function PreviewPanel({ slug, context, replayKey, stepIndex, steps, accentColor, onStepChange, onReplay, concept, t }: {
  slug: string; context: Context; replayKey: number; stepIndex: number; steps: Step[]; accentColor: string
  onStepChange: (i: number) => void; onReplay: () => void; concept: string; t: (k: Parameters<ReturnType<typeof useI18n>['t']>[0]) => string
}) {
  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div key={`${slug}-${context}-${replayKey}`}
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', display: 'flex', justifyContent: 'center', willChange: 'transform, opacity' }}
        >
          {context === 'web' ? (
            <BrowserFrame><AnimationPreview key={`${replayKey}-${stepIndex}`} slug={slug} context="web" stepIndex={stepIndex} /></BrowserFrame>
          ) : (
            <PhoneFrame><AnimationPreview key={`${replayKey}-${stepIndex}`} slug={slug} context="mobile" stepIndex={stepIndex} /></PhoneFrame>
          )}
        </motion.div>
      </AnimatePresence>

      {steps.length > 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 12px', borderRadius: 20, background: accentColor + '12', border: `1px solid ${accentColor}30` }}>
          {steps.map((_, i) => (
            <button key={i} onClick={() => onStepChange(i)} style={{
              width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
              background: stepIndex === i ? accentColor : 'var(--bg-tertiary)',
              color: stepIndex === i ? '#fff' : 'var(--text-tertiary)',
              border: `1px solid ${stepIndex === i ? accentColor : 'var(--border)'}`,
              fontSize: 9, fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-outfit)', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{i + 1}</button>
          ))}
          <button onClick={onReplay} style={{ marginLeft: 4, padding: '2px 8px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-tertiary)', fontSize: 10, fontFamily: 'var(--font-outfit)', cursor: 'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.color = accentColor }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
          >{t('det_replay')}</button>
        </div>
      ) : (
        <button onClick={onReplay} style={{ padding: '7px 20px', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text-secondary)', fontSize: 12, fontFamily: 'var(--font-outfit)', cursor: 'pointer' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.color = accentColor }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
        >{t('det_replay')}</button>
      )}

      <div style={{ width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)' }}>
        <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{concept}</p>
      </div>
    </>
  )
}

/* ── Shared learn panel (used in both tab and side-by-side layouts) ── */
function LearnPanel({ anim, rawAnim, pool, platform, impl, steps, stepIndex, currentStep, accentColor, context, onPlatformChange, onStepChange, lang, t }: {
  anim: Animation; rawAnim: Animation; pool: PlatformId[]; platform: PlatformId
  impl: PlatformImpl | undefined; steps: Step[]; stepIndex: number; currentStep: Step | undefined
  accentColor: string; context: Context; onPlatformChange: (p: PlatformId) => void
  onStepChange: (i: number) => void; lang: 'en' | 'fr'
  t: (k: Parameters<ReturnType<typeof useI18n>['t']>[0]) => string
}) {
  return (
    <>
      <Section title={t('det_how')} color={accentColor}>
        <ol style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
          {anim.howItWorks.map((step, i) => (
            <li key={i} style={{ display: 'flex', gap: 14 }}>
              <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: accentColor, color: '#fff', fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>{i + 1}</span>
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}><Inline text={step} /></p>
            </li>
          ))}
        </ol>
      </Section>
      <Divider />
      <Section title={t('det_impl')} color={accentColor}>
        <div style={{ display: 'flex', gap: 2, background: 'var(--bg-secondary)', borderRadius: '10px 10px 0 0', border: '1px solid var(--border)', borderBottom: 'none', padding: '8px 8px 0', overflowX: 'auto' }}>
          {PLATFORMS.filter(p => pool.includes(p.id)).map(p => {
            const hasImpl  = rawAnim.implementations.some(i => i.platform === p.id)
            const isActive = platform === p.id
            const LComp    = PLATFORM_LOGOS[p.id]
            return (
              <button key={p.id} onClick={() => hasImpl && onPlatformChange(p.id)} disabled={!hasImpl}
                style={{ padding: '5px 14px 7px', border: 'none', borderRadius: '7px 7px 0 0', background: isActive ? 'var(--bg-tertiary)' : 'transparent', cursor: hasImpl ? 'pointer' : 'default', opacity: hasImpl ? 1 : 0.3, position: 'relative', minWidth: 90, transition: 'background 0.15s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
              >
                <span style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)', display: 'flex' }}>
                  {LComp && <LComp size={p.id === 'nextjs' ? 28 : 16} />}
                </span>
                <div style={{ fontSize: 9, fontFamily: 'var(--font-outfit)', fontWeight: isActive ? 600 : 400, color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{p.label}</div>
                {isActive && (
                  <motion.div layoutId={`tab-${context}`} style={{ position: 'absolute', bottom: 0, left: 6, right: 6, height: 2, borderRadius: 2, background: accentColor }} transition={{ type: 'spring', stiffness: 500, damping: 30 }} />
                )}
              </button>
            )
          })}
        </div>
        {impl ? (
          <div>
            {impl.notes && (
              <div style={{ padding: '9px 14px', background: accentColor + '10', border: `1px solid ${accentColor}28`, borderTop: 'none', fontFamily: 'var(--font-outfit)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                <Inline text={impl.notes} />
              </div>
            )}
            {impl.deps.length > 0 && (
              <div style={{ padding: '8px 12px', background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.08em' }}>{t('det_deps')}</span>
                {impl.deps.map(dep => (
                  <span key={dep} style={{ padding: '2px 7px', borderRadius: 4, background: 'var(--bg-tertiary)', border: '1px solid var(--border)', fontFamily: 'ui-monospace, monospace', fontSize: 11, color: 'var(--accent-light)' }}>{dep}</span>
                ))}
              </div>
            )}
            {steps.length > 0 && currentStep ? (
              <StepperBlock steps={steps} stepIndex={stepIndex} accentColor={accentColor} onStepChange={onStepChange} currentStep={currentStep} lang={lang} />
            ) : (
              <CodeBlock code={impl.code} />
            )}
          </div>
        ) : (
          <div style={{ padding: '24px', borderRadius: '0 0 10px 10px', border: '1px solid var(--border)', borderTop: 'none', background: 'var(--bg-secondary)', textAlign: 'center', fontFamily: 'var(--font-outfit)', fontSize: 13, color: 'var(--text-tertiary)' }}>
            {t('det_no_impl')}
          </div>
        )}
      </Section>
      <Divider />
      <Section title={t('det_cases')} color={accentColor}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {anim.useCases.map((uc, i) => (
            <div key={i} style={{
              borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', overflow: 'hidden',
            }}>
              {/* Mini preview thumbnail */}
              <div style={{
                height: context === 'mobile' ? 148 : 136,
                background: 'var(--bg)', overflow: 'hidden', flexShrink: 0,
                display: 'flex',
                alignItems: context === 'mobile' ? 'flex-start' : 'stretch',
                justifyContent: context === 'mobile' ? 'center' : 'stretch',
                pointerEvents: 'none',
                borderBottom: '1px solid var(--border)',
                contain: 'layout paint',
              }}>
                {context === 'mobile' ? (
                  <div style={{ transform: 'scale(0.32) translateZ(0)', transformOrigin: 'top center', width: 200, flexShrink: 0 }}>
                    <PhoneFrame>
                      <AnimationPreview slug={anim.slug} context="mobile" stepIndex={3} />
                    </PhoneFrame>
                  </div>
                ) : (
                  <div style={{ transform: 'scale(0.56) translateZ(0)', transformOrigin: 'top left', width: '179%', flexShrink: 0 }}>
                    <BrowserFrame>
                      <AnimationPreview slug={anim.slug} context="web" stepIndex={3} />
                    </BrowserFrame>
                  </div>
                )}
              </div>
              {/* Label + text */}
              <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <span style={{ padding: '2px 8px', borderRadius: 12, background: accentColor + '1a', color: accentColor, fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 600, letterSpacing: '0.04em', width: 'fit-content' }}>{uc.label}</span>
                <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{uc.example}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
      <Divider />
      <Section title={t('det_tips')} color={accentColor}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {anim.tips.map((tip, i) => (
            <div key={i} style={{ padding: '13px 16px', borderRadius: 9, border: `1px solid ${accentColor}33`, background: accentColor + '0a', display: 'flex', gap: 10 }}>
              <div style={{ flexShrink: 0, width: 5, borderRadius: 3, background: accentColor, opacity: 0.5, marginTop: 3, alignSelf: 'stretch' }} />
              <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}><Inline text={tip} /></p>
            </div>
          ))}
        </div>
      </Section>
    </>
  )
}

/* ── Stepper ── */
function StepperBlock({ steps, stepIndex, accentColor, onStepChange, currentStep, lang }: {
  steps: Step[]; stepIndex: number; accentColor: string; onStepChange: (i: number) => void; currentStep: Step; lang: 'en' | 'fr'
}) {
  return (
    <div>
      {/* Step tabs — scrollable on mobile */}
      <div style={{ display: 'flex', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)', background: 'var(--bg-secondary)', overflowX: 'auto' }}>
        {steps.map((s, i) => {
          const ls       = localizeStep(s, lang)
          const isActive = stepIndex === i
          return (
            <button key={i} onClick={() => onStepChange(i)} style={{
              flex: '0 0 auto', minWidth: 80, padding: '10px 12px', border: 'none',
              borderBottom: `2px solid ${isActive ? accentColor : 'transparent'}`,
              borderRight: i < steps.length - 1 ? '1px solid var(--border)' : 'none',
              background: isActive ? accentColor + '0e' : 'transparent',
              cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{
                  width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                  background: isActive ? accentColor : 'var(--bg-tertiary)',
                  color: isActive ? '#fff' : 'var(--text-tertiary)',
                  border: `1px solid ${isActive ? accentColor : 'var(--border)'}`,
                  fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-outfit)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{i + 1}</span>
                <span style={{
                  fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)', lineHeight: 1.3,
                  whiteSpace: 'nowrap',
                }}>{ls.title}</span>
              </div>
            </button>
          )
        })}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={stepIndex} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.18 }}>
          {/* Step description — why this step matters */}
          <div style={{
            padding: '14px 18px',
            background: accentColor + '08',
            borderLeft: `1px solid ${accentColor}28`,
            borderRight: `1px solid ${accentColor}28`,
            borderBottom: `1px solid ${accentColor}18`,
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
              <span style={{
                fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 700,
                color: accentColor, letterSpacing: '0.06em', textTransform: 'uppercase',
              }}>Step {stepIndex + 1} / {steps.length}</span>
              <span style={{ fontSize: 13, fontFamily: 'var(--font-outfit)', fontWeight: 600, color: 'var(--text-primary)' }}>
                {localizeStep(currentStep, lang).title}
              </span>
            </div>
            <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, margin: 0 }}>
              <Inline text={localizeStep(currentStep, lang).description} />
            </p>
          </div>
          <CodeBlock code={currentStep.code} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <h2 style={{
        fontFamily: 'var(--font-power)', fontSize: 18, fontWeight: 700,
        letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: 18,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{ width: 4, height: 18, borderRadius: 2, background: color, flexShrink: 0 }} />
        {title}
      </h2>
      {children}
    </div>
  )
}

function Divider() {
  return <div style={{ height: 1, background: 'var(--border)', margin: '32px 0' }} />
}

function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false)
  const { t } = useI18n()
  return (
    <div style={{ position: 'relative' }}>
      <pre style={{
        padding: '18px 22px', borderRadius: '0 0 10px 10px',
        background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderTop: 'none',
        fontSize: 12, fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
        color: 'var(--text-secondary)', overflowX: 'auto', lineHeight: 1.7, margin: 0, whiteSpace: 'pre',
      }}>{code}</pre>
      <button
        onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1600) }}
        style={{
          position: 'absolute', top: 10, right: 10,
          padding: '3px 10px', borderRadius: 5, border: '1px solid var(--border-strong)',
          background: copied ? 'var(--accent-faint)' : 'var(--bg-secondary)',
          color: copied ? 'var(--accent)' : 'var(--text-tertiary)',
          fontSize: 10, fontFamily: 'var(--font-outfit)', fontWeight: 500,
          cursor: 'pointer', transition: 'all 0.15s ease',
        }}
      >{copied ? t('det_copied') : t('det_copy')}</button>
    </div>
  )
}

function Inline({ text }: { text: string }) {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/)
  return (
    <>
      {tokens.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**'))
          return <strong key={i} style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>
        if (part.startsWith('*') && part.endsWith('*'))
          return <em key={i} style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>{part.slice(1, -1)}</em>
        if (part.startsWith('`') && part.endsWith('`'))
          return <code key={i} style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.87em', background: 'var(--bg-tertiary)', padding: '1px 5px', borderRadius: 4, color: 'var(--accent-light)' }}>{part.slice(1, -1)}</code>
        return <span key={i}>{part}</span>
      })}
    </>
  )
}
