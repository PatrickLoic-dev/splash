'use client'

import React, { useState, useEffect, useRef, useCallback, useSyncExternalStore } from 'react'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useSearchParams, useRouter } from 'next/navigation'
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

/* ── Tweak params ── */
interface TweakParams {
  type: 'tween' | 'spring'
  duration: number
  ease: string
  delay: number
  stiffness: number
  damping: number
}

const DEFAULT_TWEAKS: TweakParams = {
  type: 'tween',
  duration: 0.4,
  ease: 'easeOut',
  delay: 0,
  stiffness: 300,
  damping: 20,
}

function applyTweaks(code: string, p: TweakParams): string {
  return code
    .replace(/\bduration:\s*[\d.]+/g,  `duration: ${p.duration}`)
    .replace(/\bdelay:\s*[\d.]+/g,     `delay: ${p.delay}`)
    .replace(/\bstiffness:\s*[\d.]+/g, `stiffness: ${p.stiffness}`)
    .replace(/\bdamping:\s*[\d.]+/g,   `damping: ${p.damping}`)
    .replace(/(['"])easeOut\1|(['"])easeIn\1|(['"])easeInOut\1|(['"])linear\1/g, `'${p.ease}'`)
}

function openInPlayground(code: string, platform: PlatformId, deps: string[], title: string) {
  if (platform === 'flutter') {
    window.open('https://dartpad.dev/', '_blank')
    return
  }
  if (platform === 'react-native') {
    const url = `https://snack.expo.dev/?name=${encodeURIComponent('Splash — ' + title)}&code=${encodeURIComponent(code)}`
    window.open(url, '_blank')
    return
  }
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = 'https://stackblitz.com/run'
  form.target = '_blank'
  const add = (name: string, value: string) => {
    const inp = document.createElement('input')
    inp.type = 'hidden'; inp.name = name; inp.value = value
    form.appendChild(inp)
  }
  const depVersions: Record<string, string> = {
    'framer-motion': '^12.0.0',
    'react': '^19.0.0',
    'react-dom': '^19.0.0',
    'vue': '^3.0.0',
  }
  const pkgDeps = deps.reduce((acc, d) => ({ ...acc, [d]: depVersions[d] ?? 'latest' }), {
    react: '^19.0.0', 'react-dom': '^19.0.0',
  })
  add('project[title]', `Splash — ${title}`)
  add('project[description]', 'Animation pattern from Splash')
  add('project[template]', platform === 'vue' ? 'node' : 'create-react-app')
  add('project[files][package.json]', JSON.stringify({ name: 'animation-preview', private: true, dependencies: pkgDeps }, null, 2))
  add('project[files][src/App.jsx]', code)
  add('project[files][src/index.jsx]', `import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nReactDOM.createRoot(document.getElementById('root')).render(<App />);`)
  add('project[files][public/index.html]', `<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="UTF-8"><title>Animation Preview</title></head>\n<body><div id="root"></div></body>\n</html>`)
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

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

const NEW_SLUGS = new Set([
  'scroll-header-collapse',
  'magnetic-button',
  'swipe-to-delete',
  'bottom-sheet-snap',
  'implicit-animation',
  'staggered-list-flutter',
])

function NewBadge() {
  return (
    <span style={{
      padding: '3px 7px', borderRadius: 5,
      background: 'var(--accent)', color: '#fff',
      fontSize: 9, fontFamily: 'var(--font-outfit)', fontWeight: 700,
      letterSpacing: '0.06em', textTransform: 'uppercase' as const,
    }}>
      New
    </span>
  )
}

const PLATFORM_CONTEXT: Record<string, Context> = {
  react:          'web',
  nextjs:         'web',
  vue:            'web',
  'react-native': 'mobile',
  flutter:        'mobile',
}

import { PLATFORM_LOGOS } from './PlatformLogos'
import { UseCaseModal, getUseCaseImage } from './UseCaseModal'

/* ── View state ── */
type ViewState =
  | { kind: 'selector' }
  | { kind: 'filtered'; platform: PlatformId }
  | { kind: 'detail'; slug: string; context: Context; platform: PlatformId }

/* ── localStorage-backed stores ──
   Exposed via useSyncExternalStore so components read/write the same
   external system (localStorage) without a setState-in-effect hydration step. */
function createLocalStorageStore<T>(key: string, fallback: T) {
  let cache = fallback
  let hydrated = false
  const listeners = new Set<() => void>()

  function getSnapshot(): T {
    if (!hydrated) {
      try {
        const raw = localStorage.getItem(key)
        cache = raw ? JSON.parse(raw) : fallback
      } catch { cache = fallback }
      hydrated = true
    }
    return cache
  }

  return {
    getSnapshot,
    getServerSnapshot: () => fallback,
    subscribe(onStoreChange: () => void) {
      listeners.add(onStoreChange)
      return () => listeners.delete(onStoreChange)
    },
    set(value: T) {
      cache = value
      hydrated = true
      localStorage.setItem(key, JSON.stringify(value))
      listeners.forEach(l => l())
    },
  }
}

const bookmarksStore = createLocalStorageStore<string[]>('splash-bookmarks', [])
const progressStore  = createLocalStorageStore<Record<string, number>>('splash-progress', {})

export function LearnPage() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const [view,       setView]       = useState<ViewState>({ kind: 'selector' })
  const [replayKey,  setReplayKey]  = useState(0)
  const [stepIndex,  setStepIndex]  = useState(0)
  const [clickedPlatform, setClickedPlatform] = useState<PlatformId | null>(null)
  const bookmarks = useSyncExternalStore(bookmarksStore.subscribe, bookmarksStore.getSnapshot, bookmarksStore.getServerSnapshot)
  const progress  = useSyncExternalStore(progressStore.subscribe, progressStore.getSnapshot, progressStore.getServerSnapshot)
  const [cmdOpen,    setCmdOpen]    = useState(false)
  const skipUrlSync    = useRef(false)
  const viewRef        = useRef<ViewState>(view)
  const lastListView   = useRef<ViewState>({ kind: 'selector' })
  const prevSyncedView = useRef<ViewState>({ kind: 'selector' })
  useEffect(() => { viewRef.current = view }, [view])

  function toggleBookmark(slug: string) {
    const prev = bookmarksStore.getSnapshot()
    const next = prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    bookmarksStore.set(next)
  }

  function markProgress(slug: string, stepIdx: number) {
    const prev = progressStore.getSnapshot()
    const best = Math.max(prev[slug] ?? 0, stepIdx)
    progressStore.set({ ...prev, [slug]: best })
  }

  // Sync URL → state on mount / param change (including browser back/forward)
  useEffect(() => {
    const slug     = searchParams.get('slug')
    const platform = searchParams.get('platform') as PlatformId | null
    const step     = parseInt(searchParams.get('step') ?? '0', 10)
    if (!slug) {
      // Browser back/forward landed on a slug-less /learn — leave detail view
      // and restore whichever list view (selector/filtered) preceded it.
      if (viewRef.current.kind === 'detail') {
        skipUrlSync.current = true
        setView(lastListView.current)
      }
      return
    }
    const anim = ANIMATIONS.find(a => a.slug === slug)
    if (!anim) return
    const resolvedPlatform = platform ?? anim.implementations[0]?.platform ?? 'react'
    const context = PLATFORM_CONTEXT[resolvedPlatform] ?? 'web'
    skipUrlSync.current = true
    setView({ kind: 'detail', slug, context, platform: resolvedPlatform })
    setStepIndex(isNaN(step) ? 0 : step)
  }, [searchParams])

  // Sync state → URL when in detail view
  useEffect(() => {
    const prevView = prevSyncedView.current
    prevSyncedView.current = view
    if (view.kind !== 'detail') lastListView.current = view

    if (skipUrlSync.current) { skipUrlSync.current = false; return }

    if (view.kind === 'detail') {
      const params = new URLSearchParams({
        slug:     view.slug,
        platform: view.platform,
        step:     String(stepIndex),
      })
      const url = `/learn?${params.toString()}`
      // Opening a new pattern (from a list view, or a different slug) pushes
      // a history entry so /learn stays reachable via back; step/platform
      // tweaks within the same pattern just replace to avoid history spam.
      const enteringDetail = prevView.kind !== 'detail' || prevView.slug !== view.slug
      if (enteringDetail) {
        router.push(url, { scroll: false })
      } else {
        router.replace(url, { scroll: false })
      }
    } else {
      router.replace('/learn', { scroll: false })
    }
  }, [view, stepIndex])

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

  // Cmd+K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdOpen(o => !o) }
      if (e.key === 'Escape') setCmdOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const showGrid = view.kind === 'selector' || view.kind === 'filtered'

  return (
    <>
      <Navbar onOpenCmd={() => setCmdOpen(true)} />
      {showGrid && <GridBackground />}
      <CommandPalette
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onNavigate={(slug, platform) => { setCmdOpen(false); openDetail(slug, PLATFORM_CONTEXT[platform] ?? 'web', platform) }}
      />
      <div style={{ paddingTop: 56, minHeight: '100dvh', position: 'relative', zIndex: 1 }}>
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
                  bookmarks={bookmarks}
                  onToggleBookmark={toggleBookmark}
                  progress={progress}
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
                  progress={progress}
                  onStepChange={(i) => { setStepIndex(i); if (view.kind === 'detail') markProgress(view.slug, i) }}
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
  platform, onBack, onSelect, onSwitchPlatform, bookmarks, onToggleBookmark, progress
}: {
  platform: PlatformId
  onBack: () => void
  onSelect: (slug: string, platform: PlatformId) => void
  onSwitchPlatform: (p: PlatformId) => void
  bookmarks: string[]
  onToggleBookmark: (slug: string) => void
  progress: Record<string, number>
}) {
  const { t, lang } = useI18n()
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
  const [showFavOnly,  setShowFavOnly]  = useState(false)

  function toggleCat(cat: string) {
    setActiveCats(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])
  }
  function toggleDiff(diff: string) {
    setActiveDiffs(prev => prev.includes(diff) ? prev.filter(d => d !== diff) : [...prev, diff])
  }

  const filtered = available.filter(a =>
    (activeCats.length  === 0 || activeCats.includes(a.category))  &&
    (activeDiffs.length === 0 || activeDiffs.includes(a.difficulty)) &&
    (!showFavOnly || bookmarks.includes(a.slug))
  )

  const hasActiveFilters = activeCats.length > 0 || activeDiffs.length > 0

  /* ── Left sidebar (desktop) / horizontal chips (mobile/tablet) ── */
  const SidebarSection = ({ label, items, active, onToggle, colorMap, translateKey }: {
    label: string
    items: string[]
    active: string[]
    onToggle: (v: string) => void
    colorMap?: Record<string, string>
    translateKey: 'cat' | 'diff'
  }) => (
    <div style={{ marginBottom: 24 }}>
      <div style={{
        fontSize: 9, fontFamily: 'var(--font-outfit)', fontWeight: 700,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--text-tertiary)', marginBottom: 8,
      }}>{label}</div>
      <div style={{ display: 'flex', flexDirection: isDesktop ? 'column' : 'row', gap: 4, flexWrap: 'wrap' }}>
        {items.map(item => {
          const isActive  = active.includes(item)
          const color     = colorMap?.[item] ?? 'var(--accent)'
          const itemLabel = t(`${translateKey}_${item}` as Parameters<typeof t>[0])
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
              {itemLabel}
            </motion.button>
          )
        })}
      </div>
    </div>
  )

  /* ── Favorites filter ── */
  const favSlugs = bookmarks.filter(s => available.some(a => a.slug === s))

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
          {t('filt_filter_label')} {hasActiveFilters && <span style={{ color: 'var(--accent)' }}>· {filtered.length}</span>}
        </div>
      )}
      {/* Favorites section */}
      {favSlugs.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 9, fontFamily: 'var(--font-outfit)', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8 }}>
            {t('fav_title')}
          </div>
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowFavOnly(v => !v)} style={{
            padding: isDesktop ? '6px 10px' : '4px 10px', borderRadius: 7, cursor: 'pointer',
            border: `1px solid ${showFavOnly ? '#f59e0b60' : 'var(--border)'}`,
            background: showFavOnly ? '#f59e0b14' : 'transparent',
            color: showFavOnly ? '#f59e0b' : 'var(--text-tertiary)',
            fontSize: 11, fontFamily: 'var(--font-outfit)', fontWeight: showFavOnly ? 600 : 400,
            textAlign: 'left', width: isDesktop ? '100%' : 'auto',
            transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
          }}>
            {showFavOnly && <span style={{ width: 5, height: 5, borderRadius: 3, background: '#f59e0b', flexShrink: 0 }} />}
            ★ {t('fav_title')} ({favSlugs.length})
          </motion.button>
        </div>
      )}
      <SidebarSection
        label={t('filt_category')}
        items={allCategories}
        active={activeCats}
        onToggle={toggleCat}
        colorMap={CAT_COLORS}
        translateKey="cat"
      />
      <SidebarSection
        label={t('filt_difficulty')}
        items={allDifficulties.filter(d => available.some(a => a.difficulty === d))}
        active={activeDiffs}
        onToggle={toggleDiff}
        colorMap={DIFF_COLORS}
        translateKey="diff"
      />
      {hasActiveFilters && (
        <button onClick={() => { setActiveCats([]); setActiveDiffs([]) }} style={{
          fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)',
          background: 'none', border: 'none', cursor: 'pointer', padding: '2px 0',
          textDecoration: 'underline', textUnderlineOffset: 3,
        }}>{t('filt_clear')}</button>
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
              {hasActiveFilters ? `${filtered.length} ${t('filt_of')} ${available.length}` : available.length} {t('filt_patterns')} · {context === 'web' ? t('sel_web') : t('sel_mobile')}
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
                {t('filt_empty')}
                <button onClick={() => { setActiveCats([]); setActiveDiffs([]) }} style={{ display: 'block', margin: '12px auto 0', fontSize: 12, color: 'var(--accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', textUnderlineOffset: 3 }}>{t('filt_clear')}</button>
              </motion.div>
            ) : (
              <motion.div key="grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(260px, 1fr))',
                  gap: isMobile ? 10 : 14,
                }}
              >
                {filtered.map((anim, i) => {
                  const locAnim = localizeAnim(anim, lang)
                  return (
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
                          {t(`cat_${anim.category}` as Parameters<typeof t>[0])}
                        </span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          {NEW_SLUGS.has(anim.slug) && <NewBadge />}
                          <span style={{
                            fontSize: 10, fontFamily: 'var(--font-outfit)',
                            color: DIFF_COLORS[anim.difficulty], letterSpacing: '0.04em',
                          }}>
                            {t(`diff_${anim.difficulty}` as Parameters<typeof t>[0])}
                          </span>
                          {/* Bookmark button */}
                          <button
                            onClick={e => { e.stopPropagation(); onToggleBookmark(anim.slug) }}
                            onKeyDown={e => e.stopPropagation()}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer', padding: 2,
                              color: bookmarks.includes(anim.slug) ? '#f59e0b' : 'var(--text-tertiary)',
                              fontSize: 14, lineHeight: 1, flexShrink: 0, transition: 'color 0.15s',
                              display: 'flex', alignItems: 'center',
                            }}
                            title={bookmarks.includes(anim.slug) ? 'Remove bookmark' : 'Bookmark'}
                          >
                            {bookmarks.includes(anim.slug) ? '★' : '☆'}
                          </button>
                        </div>
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-power)', fontSize: 18, fontWeight: 700,
                        letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1.2,
                      }}>
                        {locAnim.title}
                      </div>
                      <div style={{
                        fontFamily: 'var(--font-outfit)', fontSize: 12,
                        color: 'var(--text-tertiary)', lineHeight: 1.6,
                      }}>
                        {locAnim.tagline}
                      </div>
                      {(() => {
                        const total   = getSteps(anim.slug, platform).length
                        const reached = progress[anim.slug] ?? -1
                        const done    = total > 0 && reached >= total - 1
                        const pct     = total > 0 ? Math.min(100, Math.round(((reached + 1) / total) * 100)) : 0
                        if (total === 0) return null
                        return (
                          <div style={{ marginTop: 4 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                              <span style={{ fontSize: 10, fontFamily: 'var(--font-outfit)', color: done ? 'var(--accent)' : 'var(--text-tertiary)' }}>
                                {done ? '✓ ' + (lang === 'fr' ? 'Terminé' : 'Completed') : pct > 0 ? `${pct}%` : ''}
                              </span>
                            </div>
                            {pct > 0 && (
                              <div style={{ height: 2, borderRadius: 1, background: 'var(--border)' }}>
                                <div style={{ height: '100%', borderRadius: 1, background: done ? 'var(--accent)' : 'var(--accent)', width: `${pct}%`, opacity: done ? 1 : 0.5, transition: 'width 0.4s ease' }} />
                              </div>
                            )}
                          </div>
                        )
                      })()}
                      <div style={{ fontSize: 11, fontFamily: 'var(--font-outfit)', color: 'var(--accent)', marginTop: 2 }}>
                        {t('filt_cta')}
                      </div>
                    </div>
                  </motion.div>
                  )
                })}
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
  slug, context, platform, replayKey, stepIndex, progress,
  onBack, onContextSwitch, onPlatformChange, onNavigate, onReplay, onStepChange,
}: {
  slug: string; context: Context; platform: PlatformId; replayKey: number; stepIndex: number
  progress: Record<string, number>
  onBack: () => void; onContextSwitch: (ctx: Context) => void; onPlatformChange: (p: PlatformId) => void
  onNavigate: (slug: string, ctx: Context) => void; onReplay: () => void; onStepChange: (i: number) => void
}) {
  const { t, lang } = useI18n()
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const useTabs = isMobile || isTablet
  const [activeTab, setActiveTab] = useState<'preview' | 'learn'>('preview')
  const [tweakParams, setTweakParams] = useState<TweakParams>(DEFAULT_TWEAKS)
  const [compareMode, setCompareMode] = useState(false)
  const rawAnim     = ANIMATIONS.find(a => a.slug === slug)!

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.key === 'ArrowLeft')  { onStepChange(Math.max(0, stepIndex - 1)); return }
      if (e.key === 'ArrowRight') { const stepsNow = getSteps(slug, platform); onStepChange(Math.min(stepsNow.length - 1, stepIndex + 1)); return }
      if (e.key === 'r' || e.key === 'R') { onReplay(); return }
      if (e.key === 'c' || e.key === 'C') {
        const stepsNow = getSteps(slug, platform)
        const code = stepsNow[stepIndex]?.code ?? rawAnim.implementations.find(i => i.platform === platform)?.code ?? ''
        if (code) navigator.clipboard.writeText(code)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [slug, platform, stepIndex, onStepChange, onReplay, rawAnim])
  const anim        = localizeAnim(rawAnim, lang)
  const accentColor = 'var(--accent)'
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
        {!isMobile && NEW_SLUGS.has(slug) && <NewBadge />}

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
            <ShareButton slug={slug} platform={platform} stepIndex={stepIndex} />
            {!isMobile && (
              <button
                onClick={() => setCompareMode(c => !c)}
                style={{
                  padding: '4px 10px', borderRadius: 6, fontSize: 11,
                  border: `1px solid ${compareMode ? 'var(--accent)' : 'var(--border)'}`,
                  background: compareMode ? 'var(--accent-faint)' : 'var(--bg-secondary)',
                  color: compareMode ? 'var(--accent)' : 'var(--text-secondary)',
                  cursor: 'pointer', fontFamily: 'var(--font-outfit)',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}
              >
                <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="2" width="6" height="12" rx="1"/><rect x="9" y="2" width="6" height="12" rx="1"/>
                </svg>
                {lang === 'fr' ? 'Comparer' : 'Compare'}
              </button>
            )}
            {!isMobile && (() => {
              const currImpl = anim.implementations.find(i => i.platform === platform)
              const currSteps = getSteps(slug, platform)
              const currCode = currSteps[stepIndex]?.code ?? currImpl?.code ?? ''
              const tweaked = applyTweaks(currCode, tweakParams)
              return (
                <button
                  onClick={() => openInPlayground(tweaked, platform, currImpl?.deps ?? [], anim.title)}
                  style={{
                    padding: '4px 10px', borderRadius: 6, fontSize: 11,
                    border: '1px solid var(--border)', background: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer', fontFamily: 'var(--font-outfit)',
                    display: 'flex', alignItems: 'center', gap: 4,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  {t('det_playground')}
                </button>
              )
            })()}
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
                  <PreviewPanel slug={slug} context={context} replayKey={replayKey} stepIndex={stepIndex} steps={steps} accentColor={accentColor} onStepChange={i => { onStepChange(i); setActiveTab('learn') }} onReplay={onReplay} concept={anim.concept} t={t} tweakParams={tweakParams} setTweakParams={setTweakParams} />
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
                  <LearnPanel anim={anim} rawAnim={rawAnim} pool={pool} platform={platform} impl={impl} steps={steps} stepIndex={stepIndex} currentStep={currentStep} accentColor={accentColor} context={context} onPlatformChange={onPlatformChange} onStepChange={onStepChange} lang={lang} t={t} tweakParams={tweakParams} />
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </>
      )}

      {/* ══ DESKTOP → side-by-side ══ */}
      {!useTabs && (
        <ResizableSplitView
          left={<PreviewPanel slug={slug} context={context} replayKey={replayKey} stepIndex={stepIndex} steps={steps} accentColor={accentColor} onStepChange={onStepChange} onReplay={onReplay} concept={anim.concept} t={t} tweakParams={tweakParams} setTweakParams={setTweakParams} />}
          right={
            compareMode
              ? <ComparePanel slug={slug} context={context} pool={pool} stepIndex={stepIndex} tweakParams={tweakParams} accentColor={accentColor} lang={lang} t={t} />
              : <LearnPanel anim={anim} rawAnim={rawAnim} pool={pool} platform={platform} impl={impl} steps={steps} stepIndex={stepIndex} currentStep={currentStep} accentColor={accentColor} context={context} onPlatformChange={onPlatformChange} onStepChange={onStepChange} lang={lang} t={t} tweakParams={tweakParams} />
          }
        />
      )}
    </div>
  )
}

/* ── Resizable split view for desktop ── */
function ResizableSplitView({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  const [splitPct, setSplitPct] = useState(38)
  const dragging = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current || !containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const pct  = ((e.clientX - rect.left) / rect.width) * 100
      setSplitPct(Math.min(75, Math.max(25, pct)))
    }
    function onMouseUp() { dragging.current = false; document.body.style.cursor = '' }
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => { document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp) }
  }, [])

  return (
    <div ref={containerRef} style={{ flex: 1, display: 'flex', flexDirection: 'row', overflow: 'hidden' }}>
      {/* Left pane */}
      <div style={{
        flex: `0 0 ${splitPct}%`,
        borderRight: '1px solid var(--border)',
        background: 'var(--bg-secondary)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: 24, gap: 16, overflowY: 'auto',
      }}>
        {left}
      </div>
      {/* Drag handle */}
      <div
        onMouseDown={() => { dragging.current = true; document.body.style.cursor = 'col-resize' }}
        style={{
          width: 6, flexShrink: 0, cursor: 'col-resize', background: 'var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
          transition: 'background 0.15s',
          userSelect: 'none',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--accent)')}
        onMouseLeave={e => { if (!dragging.current) e.currentTarget.style.background = 'var(--border)' }}
      >
        {/* Grip dots */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3, pointerEvents: 'none' }}>
          {[0,1,2].map(i => <div key={i} style={{ width: 2, height: 2, borderRadius: '50%', background: 'var(--text-tertiary)', opacity: 0.6 }} />)}
        </div>
      </div>
      {/* Right pane */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '36px 48px 80px' }}>
        {right}
      </div>
    </div>
  )
}

/* ── TweakerPanel ── */
function TweakerPanel({ params, onChange, accentColor }: {
  params: TweakParams
  onChange: (p: TweakParams) => void
  accentColor: string
}) {
  const [open, setOpen] = useState(false)
  const { lang } = useI18n()

  const sliders = [
    params.type === 'tween' && { key: 'duration', label: 'Duration', min: 0.1, max: 2, step: 0.05, value: params.duration, unit: 's' },
    params.type === 'tween' && { key: 'delay',    label: 'Delay',    min: 0,   max: 1.5, step: 0.05, value: params.delay, unit: 's' },
    params.type === 'spring' && { key: 'stiffness', label: 'Stiffness', min: 50, max: 800, step: 10, value: params.stiffness, unit: '' },
    params.type === 'spring' && { key: 'damping',   label: 'Damping',   min: 5,  max: 60,  step: 1,  value: params.damping,   unit: '' },
  ].filter(Boolean) as { key: string; label: string; min: number; max: number; step: number; value: number; unit: string }[]

  const easeOptions = ['easeOut', 'easeIn', 'easeInOut', 'linear']

  return (
    <div style={{ width: '100%', borderRadius: 10, border: `1px solid ${accentColor}30`, background: accentColor + '07', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 14px', border: 'none', background: 'transparent',
          cursor: 'pointer', textAlign: 'left',
        }}
      >
        <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke={accentColor} strokeWidth="2" strokeLinecap="round">
          <line x1="2" y1="4" x2="16" y2="4"/><circle cx="6" cy="4" r="2" fill={accentColor} stroke="none"/>
          <line x1="2" y1="9" x2="16" y2="9"/><circle cx="12" cy="9" r="2" fill={accentColor} stroke="none"/>
          <line x1="2" y1="14" x2="16" y2="14"/><circle cx="7" cy="14" r="2" fill={accentColor} stroke="none"/>
        </svg>
        <span style={{ fontFamily: 'var(--font-outfit)', fontSize: 11, fontWeight: 700, color: accentColor, letterSpacing: '0.07em', textTransform: 'uppercase', flex: 1 }}>
          {lang === 'fr' ? 'Paramètres' : 'Tweaker'}
        </span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }} style={{ fontSize: 9, color: accentColor, display: 'inline-block' }}>▾</motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '4px 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Type toggle */}
              <div style={{ display: 'flex', gap: 4, padding: '3px', background: 'var(--bg-tertiary)', borderRadius: 7 }}>
                {(['tween', 'spring'] as const).map(ty => (
                  <button key={ty} onClick={() => onChange({ ...params, type: ty })} style={{
                    flex: 1, padding: '4px 0', borderRadius: 5, border: 'none', cursor: 'pointer',
                    background: params.type === ty ? accentColor : 'transparent',
                    color: params.type === ty ? '#fff' : 'var(--text-tertiary)',
                    fontFamily: 'var(--font-outfit)', fontSize: 11, fontWeight: 600,
                    transition: 'all 0.15s',
                  }}>{ty}</button>
                ))}
              </div>

              {/* Ease select (tween only) */}
              {params.type === 'tween' && (
                <div>
                  <label style={{ display: 'block', fontSize: 10, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }}>
                    Easing
                  </label>
                  <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                    {easeOptions.map(e => (
                      <button key={e} onClick={() => onChange({ ...params, ease: e })} style={{
                        padding: '3px 9px', borderRadius: 5, border: '1px solid',
                        borderColor: params.ease === e ? accentColor : 'var(--border)',
                        background: params.ease === e ? accentColor + '18' : 'var(--bg)',
                        color: params.ease === e ? accentColor : 'var(--text-secondary)',
                        fontFamily: 'ui-monospace, monospace', fontSize: 10, cursor: 'pointer',
                        transition: 'all 0.12s',
                      }}>{e}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sliders */}
              {sliders.map(s => (
                <div key={s.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <label style={{ fontSize: 10, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s.label}</label>
                    <span style={{ fontSize: 10, fontFamily: 'ui-monospace, monospace', color: accentColor }}>{s.value}{s.unit}</span>
                  </div>
                  <input
                    type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                    onChange={e => onChange({ ...params, [s.key]: parseFloat(e.target.value) })}
                    style={{ width: '100%', accentColor, height: 4, cursor: 'pointer' }}
                  />
                </div>
              ))}

              {/* Reset button */}
              <button
                onClick={() => onChange(DEFAULT_TWEAKS)}
                style={{
                  alignSelf: 'flex-start', padding: '3px 10px', borderRadius: 5,
                  border: '1px solid var(--border)', background: 'var(--bg)',
                  fontFamily: 'var(--font-outfit)', fontSize: 10, color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = accentColor; e.currentTarget.style.color = accentColor }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-tertiary)' }}
              >
                {lang === 'fr' ? 'Réinitialiser' : 'Reset'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Shared preview panel (used in both tab and side-by-side layouts) ── */
function PreviewPanel({ slug, context, replayKey, stepIndex, steps, accentColor, onStepChange, onReplay, concept, t, tweakParams, setTweakParams }: {
  slug: string; context: Context; replayKey: number; stepIndex: number; steps: Step[]; accentColor: string
  onStepChange: (i: number) => void; onReplay: () => void; concept: string; t: (k: Parameters<ReturnType<typeof useI18n>['t']>[0]) => string
  tweakParams: TweakParams; setTweakParams: (p: TweakParams) => void
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

      {/* TweakerPanel — between step dots and keyboard hint */}
      <TweakerPanel params={tweakParams} onChange={setTweakParams} accentColor={accentColor} />

      {/* Keyboard hint row */}
      {steps.length > 0 && (
        <div style={{ fontSize: 10, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)', opacity: 0.7, textAlign: 'center', letterSpacing: '0.02em' }}>
          ← → steps · R replay · C copy
        </div>
      )}

      <div style={{ width: '100%', padding: '14px 16px', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg)' }}>
        <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>{concept}</p>
      </div>
    </>
  )
}

/* ── Use-case cards with hero modal ── */
function UseCasesSection({ anim, accentColor }: { anim: Animation; accentColor: string }) {
  const { t } = useI18n()
  const [activeUseCase, setActiveUseCase] = useState<null | { uc: { label: string; example: string }; image: string; index: number }>(null)

  return (
    <>
      <Section title={t('det_cases')} color={accentColor}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {anim.useCases.map((uc, i) => {
            const image = getUseCaseImage(anim.slug, i)
            return (
              <motion.div
                key={i}
                layoutId={`usecase-card-${i}`}
                onClick={() => setActiveUseCase({ uc, image, index: i })}
                whileHover={{ y: -3, transition: { duration: 0.18 } }}
                style={{
                  borderRadius: 12, border: '1px solid var(--border)',
                  background: 'var(--bg-secondary)', overflow: 'hidden',
                  cursor: 'pointer',
                }}
              >
                {/* Real image */}
                <div style={{ height: 120, overflow: 'hidden', position: 'relative' }}>
                  <img
                    src={image}
                    alt={uc.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 100%)',
                  }} />
                  <span style={{
                    position: 'absolute', bottom: 8, left: 10,
                    padding: '2px 8px', borderRadius: 10,
                    background: accentColor,
                    color: '#fff',
                    fontSize: 9, fontFamily: 'var(--font-outfit)', fontWeight: 700,
                    letterSpacing: '0.06em', textTransform: 'uppercase',
                  }}>{uc.label}</span>
                </div>
                <div style={{ padding: '10px 12px' }}>
                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 12, color: 'var(--text-tertiary)', lineHeight: 1.6, margin: 0,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                  }}>{uc.example}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </Section>

      <AnimatePresence>
        {activeUseCase && (
          <UseCaseModal
            useCase={{ ...activeUseCase.uc, image: activeUseCase.image, index: activeUseCase.index }}
            slug={anim.slug}
            accentColor={accentColor}
            onClose={() => setActiveUseCase(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}

/* ── Shared learn panel (used in both tab and side-by-side layouts) ── */
function LearnPanel({ anim, rawAnim, pool, platform, impl, steps, stepIndex, currentStep, accentColor, context, onPlatformChange, onStepChange, lang, t, tweakParams }: {
  anim: Animation; rawAnim: Animation; pool: PlatformId[]; platform: PlatformId
  impl: PlatformImpl | undefined; steps: Step[]; stepIndex: number; currentStep: Step | undefined
  accentColor: string; context: Context; onPlatformChange: (p: PlatformId) => void
  onStepChange: (i: number) => void; lang: 'en' | 'fr'
  t: (k: Parameters<ReturnType<typeof useI18n>['t']>[0]) => string
  tweakParams: TweakParams
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
              <StepperBlock steps={steps} stepIndex={stepIndex} accentColor={accentColor} onStepChange={onStepChange} currentStep={currentStep} lang={lang} tweakParams={tweakParams} />
            ) : (
              <CodeBlock code={applyTweaks(impl.code, tweakParams)} />
            )}
          </div>
        ) : (
          <div style={{ padding: '24px', borderRadius: '0 0 10px 10px', border: '1px solid var(--border)', borderTop: 'none', background: 'var(--bg-secondary)', textAlign: 'center', fontFamily: 'var(--font-outfit)', fontSize: 13, color: 'var(--text-tertiary)' }}>
            {t('det_no_impl')}
          </div>
        )}
      </Section>
      <Divider />
      <UseCasesSection anim={anim} accentColor={accentColor} />
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

/* ── Stepper with phase accordions ── */
function StepperBlock({ steps, stepIndex, accentColor, onStepChange, currentStep, lang, tweakParams }: {
  steps: Step[]; stepIndex: number; accentColor: string; onStepChange: (i: number) => void; currentStep: Step; lang: 'en' | 'fr'; tweakParams: TweakParams
}) {
  const n  = steps.length
  const p1 = Math.ceil(n / 3)
  const p2 = Math.ceil(2 * n / 3)

  const phases = [
    { label: lang === 'fr' ? 'Configuration' : 'Setup',      indices: steps.slice(0,  p1).map((_, i) => i) },
    { label: lang === 'fr' ? 'Logique principale' : 'Core logic', indices: steps.slice(p1, p2).map((_, i) => p1 + i) },
    { label: lang === 'fr' ? 'Finition' : 'Polish',          indices: steps.slice(p2).map((_, i) => p2 + i) },
  ].filter(ph => ph.indices.length > 0)

  // Track which phases are open — open the one containing current step
  const phaseOf = (idx: number) => phases.findIndex(ph => ph.indices.includes(idx))
  const [openPhases, setOpenPhases] = useState<Set<number>>(() => new Set([phaseOf(stepIndex)]))

  // When stepIndex changes, ensure its phase is open
  useEffect(() => {
    const p = phaseOf(stepIndex)
    setOpenPhases(prev => prev.has(p) ? prev : new Set([...prev, p]))
  }, [stepIndex])

  const togglePhase = (i: number) =>
    setOpenPhases(prev => { const s = new Set(prev); s.has(i) ? s.delete(i) : s.add(i); return s })

  return (
    <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 10px 10px', overflow: 'hidden' }}>
      {phases.map((phase, pi) => {
        const isOpen         = openPhases.has(pi)
        const hasActiveStep  = phase.indices.includes(stepIndex)
        return (
          <div key={pi} style={{ borderTop: pi > 0 ? '1px solid var(--border)' : 'none' }}>

            {/* Phase header — accordion toggle */}
            <button
              onClick={() => togglePhase(pi)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 16px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: hasActiveStep ? accentColor + '0c' : 'var(--bg-secondary)',
                transition: 'background 0.15s',
              }}
            >
              {/* Phase dot */}
              <div style={{
                width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                background: hasActiveStep ? accentColor : 'var(--border-strong)',
                boxShadow: hasActiveStep ? `0 0 0 3px ${accentColor}28` : 'none',
                transition: 'all 0.2s',
              }} />
              <span style={{
                fontFamily: 'var(--font-outfit)', fontSize: 11, fontWeight: 700,
                color: hasActiveStep ? accentColor : 'var(--text-secondary)',
                letterSpacing: '0.07em', textTransform: 'uppercase', flex: 1,
              }}>
                {phase.label}
              </span>
              <span style={{
                fontSize: 10, color: 'var(--text-tertiary)', fontFamily: 'var(--font-outfit)',
              }}>
                {phase.indices.length} step{phase.indices.length > 1 ? 's' : ''}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{ fontSize: 10, color: 'var(--text-tertiary)', display: 'inline-block', lineHeight: 1 }}
              >
                ▾
              </motion.span>
            </button>

            {/* Steps list inside phase */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ borderTop: '1px solid var(--border)' }}>
                    {phase.indices.map(i => {
                      const s        = steps[i]
                      const ls       = localizeStep(s, lang)
                      const isActive = stepIndex === i
                      const prevCode = i > 0 ? (steps[i - 1]?.code ?? '') : ''
                      const currCode = s.code ?? ''
                      const prevSet  = new Set(prevCode.split('\n'))
                      const added    = i > 0 ? currCode.split('\n').filter(l => !prevSet.has(l)).length : 0
                      return (
                        <div key={i} style={{ borderTop: i !== phase.indices[0] ? '1px solid var(--border)' : 'none' }}>
                          {/* Step row */}
                          <button
                            onClick={() => onStepChange(i)}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                              padding: '10px 16px 10px 28px', border: 'none', cursor: 'pointer',
                              textAlign: 'left', background: isActive ? accentColor + '10' : 'var(--bg)',
                              borderLeft: isActive ? `3px solid ${accentColor}` : '3px solid transparent',
                              transition: 'all 0.15s',
                            }}
                          >
                            <span style={{
                              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                              background: isActive ? accentColor : 'var(--bg-tertiary)',
                              color: isActive ? '#fff' : 'var(--text-tertiary)',
                              border: `1px solid ${isActive ? accentColor : 'var(--border)'}`,
                              fontSize: 9, fontWeight: 700, fontFamily: 'var(--font-outfit)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              transition: 'all 0.15s',
                            }}>{i + 1}</span>
                            <span style={{
                              flex: 1, fontSize: 12, fontFamily: 'var(--font-outfit)',
                              fontWeight: isActive ? 600 : 400,
                              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                              lineHeight: 1.4,
                            }}>{ls.title}</span>
                            {added > 0 && (
                              <span style={{
                                fontSize: 9, fontFamily: 'var(--font-outfit)', fontWeight: 600,
                                padding: '1px 5px', borderRadius: 4,
                                background: accentColor + '20', color: accentColor, flexShrink: 0,
                              }}>+{added}</span>
                            )}
                          </button>

                          {/* Expanded: description + code diff */}
                          <AnimatePresence initial={false}>
                            {isActive && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                style={{ overflow: 'hidden' }}
                              >
                                <div style={{
                                  padding: '12px 16px 0 28px',
                                  background: accentColor + '06',
                                  borderTop: `1px solid ${accentColor}20`,
                                }}>
                                  <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.75, margin: '0 0 12px' }}>
                                    <Inline text={localizeStep(currentStep, lang).description} />
                                  </p>
                                </div>
                                {(() => {
                                  const tweakedCode = applyTweaks(currCode, tweakParams)
                                  const prevSet2 = new Set(prevCode.split('\n'))
                                  const addedSet = i > 0 ? new Set(tweakedCode.split('\n').filter(l => !prevSet2.has(l))) : new Set<string>()
                                  return <CodeBlock code={tweakedCode} addedLines={addedSet} accentColor={accentColor} />
                                })()}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ── Compare panel ── */
function ComparePanel({
  slug, context, pool, stepIndex, tweakParams, accentColor, lang, t
}: {
  slug: string; context: Context; pool: PlatformId[]; stepIndex: number
  tweakParams: TweakParams; accentColor: string; lang: 'en' | 'fr'
  t: (k: Parameters<ReturnType<typeof useI18n>['t']>[0]) => string
}) {
  const rawAnim = ANIMATIONS.find(a => a.slug === slug)!
  const [leftPlatform,  setLeftPlatform]  = useState<PlatformId>(pool[0])
  const [rightPlatform, setRightPlatform] = useState<PlatformId>(pool[1] ?? pool[0])

  function renderCodeFor(platform: PlatformId, setPlatform: (p: PlatformId) => void) {
    const impl = rawAnim.implementations.find(i => i.platform === platform)
    const steps = getSteps(slug, platform)
    const code = steps[stepIndex]?.code ?? impl?.code ?? ''
    const tweaked = applyTweaks(code, tweakParams)
    return (
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
        <div style={{ display: 'flex', gap: 2, background: 'var(--bg-secondary)', borderRadius: '10px 10px 0 0', border: '1px solid var(--border)', borderBottom: 'none', padding: '6px 6px 0', overflowX: 'auto' }}>
          {PLATFORMS.filter(p => pool.includes(p.id)).map(p => {
            const LComp = PLATFORM_LOGOS[p.id]
            const isActive = platform === p.id
            return (
              <button key={p.id} onClick={() => setPlatform(p.id)} style={{
                padding: '4px 10px 6px', border: 'none', borderRadius: '6px 6px 0 0',
                background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                transition: 'background 0.15s',
              }}>
                <span style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)', display: 'flex' }}>
                  {LComp && <LComp size={14} />}
                </span>
                <span style={{ fontSize: 8, fontFamily: 'var(--font-outfit)', fontWeight: isActive ? 600 : 400, color: isActive ? accentColor : 'var(--text-tertiary)' }}>{p.label}</span>
              </button>
            )
          })}
        </div>
        <CodeBlock code={tweaked} />
      </div>
    )
  }

  return (
    <div style={{ padding: '20px 20px 60px' }}>
      <p style={{ fontFamily: 'var(--font-outfit)', fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 14, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
        {lang === 'fr' ? 'Comparer les frameworks' : 'Compare frameworks'} — Step {stepIndex + 1}
      </p>
      <div style={{ display: 'flex', gap: 16 }}>
        {renderCodeFor(leftPlatform, setLeftPlatform)}
        <div style={{ width: 1, background: 'var(--border)', flexShrink: 0 }} />
        {renderCodeFor(rightPlatform, setRightPlatform)}
      </div>
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

function CodeBlock({ code, addedLines, accentColor }: { code: string; addedLines?: Set<string>; accentColor?: string }) {
  const [copied, setCopied] = useState(false)
  const { t } = useI18n()
  const lines = code.split('\n')
  const hasHighlight = addedLines && addedLines.size > 0
  return (
    <div style={{ position: 'relative' }}>
      <pre style={{
        padding: hasHighlight ? '0' : '18px 22px', borderRadius: '0 0 10px 10px',
        background: 'var(--bg-tertiary)', border: '1px solid var(--border)', borderTop: 'none',
        fontSize: 12, fontFamily: 'ui-monospace, "Cascadia Code", "Fira Code", monospace',
        color: 'var(--text-secondary)', overflowX: 'auto', lineHeight: 1.7, margin: 0, whiteSpace: 'pre',
      }}>
        {hasHighlight ? lines.map((line, i) => {
          const isAdded = addedLines!.has(line)
          return (
            <div key={i} style={{
              paddingLeft: 22, paddingRight: 22,
              ...(i === 0 ? { paddingTop: 18 } : {}),
              ...(i === lines.length - 1 ? { paddingBottom: 18 } : {}),
              background: isAdded ? (accentColor ?? '#534AB7') + '22' : 'transparent',
              borderLeft: isAdded ? `3px solid ${accentColor ?? '#534AB7'}` : '3px solid transparent',
            }}>{line}</div>
          )
        }) : code}
      </pre>
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

/* â"€â"€ Share button â"€â"€ */
function ShareButton({ slug, platform, stepIndex }: { slug: string; platform: PlatformId; stepIndex: number }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)

  function share() {
    const params = new URLSearchParams({ slug, platform, step: String(stepIndex) })
    const url = `${window.location.origin}/learn?${params.toString()}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <button onClick={share} style={{
      padding: '4px 10px', borderRadius: 6, fontSize: 11,
      border: '1px solid var(--border)', background: copied ? 'var(--accent)' : 'var(--bg-secondary)',
      color: copied ? '#fff' : 'var(--text-secondary)',
      cursor: 'pointer', fontFamily: 'var(--font-outfit)', transition: 'all 0.2s',
      display: 'flex', alignItems: 'center', gap: 5,
    }}>
      {copied ? t('det_shared') : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
          </svg>
          {t('det_share')}
        </>
      )}
    </button>
  )
}

/* â"€â"€ Command palette â"€â"€ */
function CommandPalette({ open, onClose, onNavigate }: {
  open: boolean
  onClose: () => void
  onNavigate: (slug: string, platform: PlatformId) => void
}) {
  const { t, lang } = useI18n()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) { setQuery(''); setTimeout(() => inputRef.current?.focus(), 50) }
  }, [open])

  const results = query.trim()
    ? ANIMATIONS.filter(a => {
        const q = query.toLowerCase()
        const loc = localizeAnim(a, lang)
        return loc.title.toLowerCase().includes(q) ||
               loc.tagline.toLowerCase().includes(q) ||
               a.category.toLowerCase().includes(q) ||
               a.slug.includes(q)
      })
    : ANIMATIONS

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="cmd-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 9000, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          />
          <div style={{ position: 'fixed', inset: 0, zIndex: 9001, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
          <motion.div
            key="cmd-panel"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              pointerEvents: 'all',
              width: '90%', maxWidth: 580,
              background: 'var(--bg)', border: '1px solid var(--border-strong)',
              borderRadius: 16, overflow: 'hidden',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2.2">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder={lang === 'fr' ? 'Rechercher une animation...' : 'Search animations...'}
                style={{
                  flex: 1, border: 'none', background: 'transparent', outline: 'none',
                  fontFamily: 'var(--font-outfit)', fontSize: 15, color: 'var(--text-primary)',
                  cursor: 'text',
                }}
              />
              <kbd style={{ fontSize: 10, fontFamily: 'var(--font-outfit)', color: 'var(--text-tertiary)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>Esc</kbd>
            </div>

            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {results.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', fontFamily: 'var(--font-outfit)', fontSize: 13, color: 'var(--text-tertiary)' }}>
                  {lang === 'fr' ? 'Aucun rÃ©sultat' : 'No results'}
                </div>
              ) : results.map((anim, i) => {
                const loc      = localizeAnim(anim, lang)
                const platform = anim.implementations[0]?.platform ?? 'react'
                return (
                  <button key={anim.slug} onClick={() => onNavigate(anim.slug, platform)} style={{
                    width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 16px', border: 'none', background: 'transparent',
                    cursor: 'pointer', textAlign: 'left',
                    borderTop: i > 0 ? '1px solid var(--border)' : 'none',
                    transition: 'background 0.1s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-power)', fontSize: 14, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 1 }}>{loc.title}</div>
                      <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 11, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{loc.tagline}</div>
                    </div>
                    <span style={{
                      fontSize: 9, fontFamily: 'var(--font-outfit)', fontWeight: 600, letterSpacing: '0.07em',
                      color: CAT_COLORS[anim.category] ?? '#534AB7', textTransform: 'uppercase' as const, flexShrink: 0,
                    }}>{anim.category}</span>
                  </button>
                )
              })}
            </div>

            <div style={{ padding: '8px 16px', borderTop: '1px solid var(--border)', display: 'flex', gap: 16 }}>
              {([['Enter', lang === 'fr' ? 'ouvrir' : 'open'], ['Esc', lang === 'fr' ? 'fermer' : 'close']] as [string, string][]).map(([key, label]) => (
                <span key={key} style={{ display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-outfit)', fontSize: 10, color: 'var(--text-tertiary)' }}>
                  <kbd style={{ padding: '1px 5px', borderRadius: 3, border: '1px solid var(--border)', background: 'var(--bg-secondary)', fontSize: 10 }}>{key}</kbd>
                  {label}
                </span>
              ))}
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

const CAT_ICONS: Record<string, string> = {}

