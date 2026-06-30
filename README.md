<div align="center">

```
███████╗██████╗ ██╗      █████╗ ███████╗██╗  ██╗
██╔════╝██╔══██╗██║     ██╔══██╗██╔════╝██║  ██║
███████╗██████╔╝██║     ███████║███████╗███████║
╚════██║██╔═══╝ ██║     ██╔══██║╚════██║██╔══██║
███████║██║     ███████╗██║  ██║███████║██║  ██║
╚══════╝╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
```

**Animation patterns for every stack. Learn once, ship anywhere.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-BB4B96?style=flat-square)](https://framer.com/motion)
[![License](https://img.shields.io/badge/License-MIT-22C55E?style=flat-square)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.5-A3E635?style=flat-square)](#changelog)

</div>

---

## Table of Contents

- [What is Splash?](#what-is-splash)
- [Features](#features)
- [Animation Catalog](#animation-catalog)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Adding a New Animation](#adding-a-new-animation)
- [Translation Guidelines](#translation-guidelines)
- [Design System](#design-system)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Changelog](#changelog)
- [Contributing](#contributing)

---

## What is Splash?

**Splash** is an open-source interactive animation learning platform. It teaches UI motion patterns across the five major frontend frameworks — React, Next.js, Vue 3, React Native, and Flutter — through structured, step-by-step lessons with live in-browser previews.

Most animation resources show you the finished result. Splash shows you how to get there. Each pattern is broken into four incremental steps that build on each other, with plain-language explanations of *why* each addition matters before the code appears. Every snippet is production-ready and works as-is in a real project.

### Design philosophy

- **Incremental by default** — step 1 is always a static baseline. Step 4 is the full polished result. You see every decision.
- **No framework favoritism** — React, Next.js, Vue, React Native, and Flutter all receive identical treatment. Same depth, same number of steps, same production quality.
- **Explanation first** — the "how it works" section is required reading before implementation details are shown. Code without context is just copying.
- **Bilingual** — every piece of content (titles, descriptions, step text, tips, use cases) is available in English and French.
- **No server, no account** — fully static export. Your progress is stored in `localStorage`. Nothing is tracked externally.

---

## Features

### Learning

| Feature | Detail |
|---|---|
| **17 animation patterns** | Curated set covering the highest-impact UI motion patterns, from beginner to advanced |
| **5 platforms** | React, Next.js, Vue 3, React Native, Flutter — full implementations for all |
| **Phase accordion** | Steps grouped into Setup → Core Logic → Polish phases, auto-expanding to your current position |
| **Live preview** | Interactive preview updates in real time as you advance through steps — web patterns in a browser frame, mobile patterns in a phone bezel |
| **Code diff view** | Each step highlights only what changed from the previous step |
| **Use-case modal** | Real-world examples for every pattern: apps that use it, why it works, when to reach for it |
| **Progress tracking** | Per-animation progress stored in `localStorage`. Completion badges unlock per category |
| **Bookmarks** | Save any animation to a personal favorites list |

### Navigation & UX

| Feature | Detail |
|---|---|
| **Cmd+K command palette** | Global search across all animations. Filter by platform, jump to a specific step, navigate sections — all from the keyboard |
| **URL sharing** | Deep links encode animation + platform + step: `/learn?slug=flutter-hero&platform=react&step=2`. Share exactly where you are |
| **Resizable split pane** | Drag the divider between the code panel and the preview to adjust proportions |
| **Custom cursor** | Magnetic cursor that snaps to interactive elements on pointer devices. Auto-disabled on touch screens |
| **404 page** | Animated canvas particle field with spring entrance — even error pages have motion |

### Infrastructure

| Feature | Detail |
|---|---|
| **Fully static** | `output: 'export'` — deploys to any CDN, no server required |
| **Dark / Light mode** | CSS custom property-based theming, system preference auto-detected on first visit |
| **Page transitions** | Framer Motion `AnimatePresence` cross-fades between routes |
| **View Transitions API** | Theme toggle uses the View Transitions API for a GPU-composited crossfade with no per-element CSS transitions |
| **Bilingual** | All UI strings and all content available in EN and FR |
| **Zero tracking** | No analytics, no cookies, no external calls except font loading |

---

## Animation Catalog

17 patterns across 7 categories.

| # | Slug | Animation | Category | Difficulty |
|---|---|---|---|---|
| 1 | `entrance-reveal` | Entrance Reveal | Entrance | Beginner |
| 2 | `page-transitions` | Page Transitions | Navigation | Beginner |
| 3 | `gesture-feedback` | Gesture Feedback | Feedback | Beginner |
| 4 | `parallax` | Parallax | Scroll | Intermediate |
| 5 | `skeleton-loading` | Skeleton Loading | Loading | Beginner |
| 6 | `stagger-list` | Stagger List | List | Beginner |
| 7 | `image-carousel` | Image Carousel | Carousel | Intermediate |
| 8 | `onboarding-flow` | Onboarding Flow | Navigation | Intermediate |
| 9 | `shared-element` | Shared Element | Navigation | Advanced |
| 10 | `collapsing-header` | Collapsing Header | Scroll | Advanced |
| 11 | `pan-dismiss` | Pan Dismiss | Feedback | Intermediate |
| 12 | `flutter-hero` | Flutter Hero | Navigation | Intermediate |
| 13 | `view-transitions` | View Transitions | Navigation | Intermediate |
| 14 | `flip-list` | FLIP List | List | Intermediate |
| 15 | `morphing-button` | Morphing Button | Feedback | Intermediate |
| 16 | `drag-reorder` | Drag Reorder | List | Intermediate |
| 17 | `number-counter` | Number Counter | Feedback | Beginner |

**Platform coverage** — all 17 patterns have complete implementations on all 5 platforms:

| Animation | React | Next.js | Vue 3 | RN | Flutter |
|---|:---:|:---:|:---:|:---:|:---:|
| Entrance Reveal | ✓ | ✓ | ✓ | ✓ | ✓ |
| Page Transitions | ✓ | ✓ | ✓ | ✓ | ✓ |
| Gesture Feedback | ✓ | ✓ | ✓ | ✓ | ✓ |
| Parallax | ✓ | ✓ | ✓ | ✓ | ✓ |
| Skeleton Loading | ✓ | ✓ | ✓ | ✓ | ✓ |
| Stagger List | ✓ | ✓ | ✓ | ✓ | ✓ |
| Image Carousel | ✓ | ✓ | ✓ | ✓ | ✓ |
| Onboarding Flow | ✓ | ✓ | ✓ | ✓ | ✓ |
| Shared Element | ✓ | ✓ | ✓ | ✓ | ✓ |
| Collapsing Header | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pan Dismiss | ✓ | ✓ | ✓ | ✓ | ✓ |
| Flutter Hero | ✓ | ✓ | ✓ | ✓ | ✓ |
| View Transitions | ✓ | ✓ | ✓ | ✓ | ✓ |
| FLIP List | ✓ | ✓ | ✓ | ✓ | ✓ |
| Morphing Button | ✓ | ✓ | ✓ | ✓ | ✓ |
| Drag Reorder | ✓ | ✓ | ✓ | ✓ | ✓ |
| Number Counter | ✓ | ✓ | ✓ | ✓ | ✓ |

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router, `output: 'export'`) | 16 |
| UI library | React | 19 |
| Language | TypeScript | 5 |
| Animation — web | Framer Motion | 12 |
| Animation — morphing | Flubber (SVG path interpolation) | 0.4 |
| Styling | CSS custom properties + inline styles (no CSS-in-JS runtime) | — |
| Icons | Tabler Icons + Lucide | latest |
| i18n | Custom `useI18n` hook | — |
| Responsive | Custom `useBreakpoint` hook | — |
| Fonts | Cabinet Grotesk (display) · Satoshi (body) | — |

### Why no CSS-in-JS?

Splash uses CSS custom properties for theming and inline styles for component-level styling. This keeps the bundle small, avoids hydration mismatches in the static export, and lets the CSS variables drive theme changes through the View Transitions API without touching JavaScript.

### Why Framer Motion for the web previews but not the mobile previews?

The mobile previews simulate React Native / Flutter behavior — they use CSS and inline style animations to approximate what those platforms actually produce, rather than using Framer Motion (which would diverge from the real implementation). The live preview should look like what you'll get when you ship the code.

---

## Architecture

```
                     ┌─────────────────────────────┐
                     │         Next.js App Router   │
                     │  /              /learn        │
                     └────────┬────────────┬────────┘
                              │            │
                    ┌─────────▼──┐  ┌──────▼──────────────────────┐
                    │  HomePage  │  │         LearnPage            │
                    │            │  │                              │
                    │  Hero      │  │  ┌──────────┐ ┌──────────┐  │
                    │  Patterns  │  │  │ Selector │ │ Filtered │  │
                    │  Footer    │  │  │  View    │ │  View    │  │
                    └────────────┘  │  └──────────┘ └──────────┘  │
                                    │       │             │        │
                                    │  ┌────▼─────────────▼─────┐ │
                                    │  │       DetailView        │ │
                                    │  │                         │ │
                                    │  │  Preview  │  Stepper   │ │
                                    │  │  (Web/    │  (Phase    │ │
                                    │  │  Mobile)  │  Accordion)│ │
                                    │  └───────────────────────-┘ │
                                    └──────────────────────────────┘

Data layer
──────────
learnContent.ts  →  animation metadata, descriptions, implementations (FR+EN)
steps.ts         →  step-by-step code diffs, all 5 platforms × 17 animations
i18n.tsx         →  UI label strings (EN / FR), useI18n hook
```

### State management

There is no global state library. State flows through:

1. **`LearnPage` local state** — selected platform, active animation slug, current step index, open command palette, progress map, bookmark list
2. **URL params** — `?slug=`, `?platform=`, `?step=` kept in sync via `useRouter().replace()` and `useSearchParams()`. A `skipUrlSync` ref prevents circular update loops.
3. **`localStorage`** — progress (`splash-progress`), bookmarks (`splash-bookmarks`), theme (`splash-theme`), language (`splash-lang`)

### Preview rendering

`AnimationPreview.tsx` exports a single `<AnimationPreview slug platform step />` component. Internally it maintains two dispatch maps — `WEB_MAP` and `MOBILE_MAP` — keyed by slug. Each entry is a React component that receives `step: number` (0–3) and progressively enables motion features based on step comparisons.

Web previews render inside `<BrowserFrame>`. Mobile previews render inside `<PhoneFrame>`. Neither frame has any knowledge of which animation it contains.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+ (or pnpm / yarn)

### Install and run

```bash
# Clone
git clone https://github.com/PatrickLoic-dev/splash.git
cd splash

# Install dependencies
npm install

# Start the dev server
npm run dev
# → http://localhost:3000
```

### Build for production

```bash
npm run build
# Outputs to out/ — fully static, no server required
```

The `out/` directory can be deployed directly to Vercel, Netlify, GitHub Pages, Cloudflare Pages, or any static host.

### Type check

```bash
npx tsc --noEmit
# Must exit with 0 errors before any PR is merged
```

---

## Project Structure

```
splash/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout — ThemeProvider, I18nProvider, Navbar, FooterGate, CustomCursor
│   │   ├── page.tsx                # Home page (delegates to HomePage component)
│   │   ├── learn/
│   │   │   └── page.tsx            # Learn page (delegates to LearnPage component)
│   │   ├── not-found.tsx           # 404 — canvas particle animation, spring entrance
│   │   └── globals.css             # CSS custom properties, theme tokens, global resets
│   │
│   ├── components/
│   │   ├── AnimationPreview.tsx    # All 17 live preview components (Web + Mobile variants)
│   │   ├── BrowserFrame.tsx        # Browser chrome wrapper for web previews
│   │   ├── CustomCursor.tsx        # Magnetic cursor (pointer devices only)
│   │   ├── Footer.tsx              # Site footer
│   │   ├── FooterGate.tsx          # Hides footer when detail view is open (Suspense wrapper)
│   │   ├── GridBackground.tsx      # Dot-grid background with cursor glow effect
│   │   ├── HomePage.tsx            # Landing page — hero, pattern grid, CTA
│   │   ├── LearnPage.tsx           # Main learning UI — selector, filtered view, detail view,
│   │   │                           #   stepper, command palette, share button, progress
│   │   ├── Logo.tsx                # Splash wordmark SVG
│   │   ├── Navbar.tsx              # Top navigation — theme toggle, lang toggle, Cmd+K trigger
│   │   ├── PageTransition.tsx      # Route-level AnimatePresence wrapper
│   │   ├── PhoneFrame.tsx          # Phone bezel wrapper for mobile previews
│   │   ├── PlatformLogos.tsx       # SVG logos for each platform
│   │   ├── ThemeProvider.tsx       # Dark/light mode — View Transitions API crossfade
│   │   └── UseCaseModal.tsx        # Modal showing real-world use cases per animation
│   │
│   └── lib/
│       ├── learnContent.ts         # Animation definitions — metadata, descriptions,
│       │                           #   implementations × 5 platforms, use cases, tips (EN + FR)
│       ├── steps.ts                # Step-by-step code — 4 steps × 5 platforms × 17 animations
│       ├── i18n.tsx                # Translation strings (EN / FR) + useI18n hook
│       └── useBreakpoint.ts        # Responsive hook — mobile (<640px) / tablet / desktop
│
├── public/                         # Static assets
├── next.config.ts                  # output: 'export', image: unoptimized
├── tsconfig.json
└── package.json
```

---

## Adding a New Animation

Every animation requires entries in three files plus a preview component. All four are required — the UI will silently skip any animation missing a preview registration.

### 1. Define the animation in `learnContent.ts`

Add a new object to the `ANIMATIONS` array. The `slug` must be unique and URL-safe.

```typescript
{
  slug: 'my-animation',
  title: 'My Animation',
  category: 'Feedback',          // 'Entrance' | 'Navigation' | 'Scroll' | 'Feedback'
                                  // | 'Loading' | 'List' | 'Carousel'
  difficulty: 'Intermediate',    // 'Beginner' | 'Intermediate' | 'Advanced'
  tagline: 'One sentence describing what the animation does.',
  concept: `
    Two or three sentences explaining the underlying concept — what problem
    this animation solves and why it improves the UX.
  `,
  howItWorks: [
    'Plain-language explanation of mechanism 1',
    'Plain-language explanation of mechanism 2',
    // 3–5 bullet points, no code
  ],
  implementations: [
    {
      platform: 'react',
      deps: ['framer-motion'],
      notes: 'Optional short note displayed above the code block.',
      code: `// Full working React implementation — copy-paste ready`,
    },
    { platform: 'nextjs',        deps: [...], code: `...` },
    { platform: 'vue',           deps: [...], code: `...` },
    { platform: 'react-native',  deps: [...], code: `...` },
    { platform: 'flutter',       deps: [...], code: `...` },
  ],
  useCases: [
    { label: 'E-commerce', example: 'Add-to-cart confirmation that morphs the button.' },
    // 3–5 concrete use cases
  ],
  tips: [
    'Keep the duration under 300ms for micro-interactions.',
    // 3–5 practical tips
  ],
  fr: {
    // Complete French translation of every text field above.
    // Keys: title, tagline, concept, howItWorks[], useCases[], tips[]
    title:      '...',
    tagline:    '...',
    concept:    '...',
    howItWorks: ['...', '...'],
    useCases:   [{ label: '...', example: '...' }],
    tips:       ['...'],
  },
}
```

### 2. Add step-by-step code in `steps.ts`

Each animation needs a `StepMap` — a record of 4 steps per platform. Register it in `ALL_STEPS`.

```typescript
// steps.ts

const myAnimation: StepMap = {
  react: [
    {
      title: 'Static baseline',
      description: 'What this step establishes. Why starting without animation matters.',
      fr: {
        title: 'Base statique',
        description: 'Ce que cette étape établit en français.',
      },
      code: `// Minimal static version — no motion yet`,
    },
    {
      title: 'Add the motion wrapper',
      description: 'What changes and why this addition matters.',
      fr: { title: '...', description: '...' },
      code: `// Step 1 code + the new motion wrapper`,
    },
    {
      title: 'Configure the transition',
      description: '...',
      fr: { title: '...', description: '...' },
      code: `// Step 2 code + transition config`,
    },
    {
      title: 'Polish and edge cases',
      description: '...',
      fr: { title: '...', description: '...' },
      code: `// Full polished version`,
    },
  ],
  nextjs:        [ /* 4 steps — same shape */ ],
  vue:           [ /* 4 steps */ ],
  'react-native':[ /* 4 steps */ ],
  flutter:       [ /* 4 steps */ ],
}

// Register:
export const ALL_STEPS: Record<string, StepMap> = {
  // ... existing entries ...
  'my-animation': myAnimation,
}
```

**Step rules:**
- Exactly **4 steps** per platform — no more, no less.
- Step 1 is always the **static baseline** (no animation). Step 4 is the **fully polished result**.
- Each step **builds on the previous** — show the cumulative code, not just the diff. The diff view is generated automatically.
- `fr: { title, description }` is **required** on every step. The build does not enforce this but the FR UI will break without it.
- Code snippets should be **complete and runnable**, not excerpts.

### 3. Create the preview component in `AnimationPreview.tsx`

Add a web component, a mobile component, and register both in the dispatch maps.

```typescript
// ─── Web preview ─────────────────────────────────────────────────────────────
// Renders inside BrowserFrame (content area: ~460px wide × 240px tall)
function MyAnimationWeb({ step }: { step: number }) {
  // step is 0-indexed (0 = step 1, 3 = step 4)
  // Use step comparisons to progressively enable motion:
  //   step >= 1 → add the wrapper
  //   step >= 2 → add the transition config
  //   step >= 3 → add spring + polish

  const [triggered, setTriggered] = useState(false)

  // Reset when step changes so the preview reflects the current learning state
  useEffect(() => { setTriggered(false) }, [step])

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      {step >= 1 ? (
        <motion.button
          onClick={() => setTriggered(t => !t)}
          animate={{ scale: triggered ? 1.1 : 1 }}
          transition={step >= 2 ? { type: 'spring', stiffness: 300 } : {}}
        >
          Click me
        </motion.button>
      ) : (
        <button onClick={() => setTriggered(t => !t)}>Click me</button>
      )}
    </div>
  )
}

// ─── Mobile preview ───────────────────────────────────────────────────────────
// Renders inside PhoneFrame (content area: 200px wide, starts at 28px from top)
function MyAnimationMobile({ step }: { step: number }) {
  // Simulate the RN/Flutter equivalent — use CSS animations, not Framer Motion
  const [triggered, setTriggered] = useState(false)
  useEffect(() => { setTriggered(false) }, [step])

  return (
    <div style={{ padding: 16 }}>
      <button
        onClick={() => setTriggered(t => !t)}
        style={{
          transform: triggered && step >= 1 ? 'scale(1.1)' : 'scale(1)',
          transition: step >= 2 ? 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)' : 'none',
        }}
      >
        Tap me
      </button>
    </div>
  )
}

// ─── Register ─────────────────────────────────────────────────────────────────
const WEB_MAP: Record<string, React.FC<{ step: number }>> = {
  // ... existing entries ...
  'my-animation': MyAnimationWeb,
}

const MOBILE_MAP: Record<string, React.FC<{ step: number }>> = {
  // ... existing entries ...
  'my-animation': MyAnimationMobile,
}
```

**Preview constraints:**
- Never use `position: fixed` inside a preview — use `position: absolute` relative to the container.
- Never use `layoutId` values that could collide across multiple mounted instances. Prefer explicit overlay patterns (like the Flutter Hero implementation) over implicit shared-element transitions.
- Web previews: content height is **240px**. Don't overflow vertically.
- Mobile previews: content width is **200px**, top clearance of **28px** (status bar). Phone bezel clips overflow.
- The preview must make visual sense at every step — step 0 (the static baseline) should not look broken.

### 4. Verify

```bash
# TypeScript — zero errors required
npx tsc --noEmit

# Manual checklist:
npm run dev
```

Open `http://localhost:3000/learn` and verify:

- [ ] Animation card appears in the filtered view
- [ ] Preview renders correctly at all 4 steps (web + mobile tabs)
- [ ] Phase accordion groups the steps into Setup / Core / Polish correctly
- [ ] Switching platforms shows the correct step count and code
- [ ] FR translation displays correctly (`lang=fr` in URL or toggle in navbar)
- [ ] Cmd+K palette finds the animation by name
- [ ] Deep link works: `/learn?slug=my-animation&platform=react&step=0`

---

## Translation Guidelines

Every user-facing string must be available in both English and French. There are three places where strings live:

### UI labels — `src/lib/i18n.tsx`

Add the key to both the `en` and `fr` objects. The key must follow the existing `section_name` convention.

```typescript
// en object
my_label: 'My Label',

// fr object
my_label: 'Mon libellé',
```

Use it in components via:

```typescript
const { t } = useI18n()
// ...
<span>{t('my_label')}</span>
```

### Animation content — `learnContent.ts`

Every animation object has a top-level `fr` key that overrides all text fields. Only provide the fields that differ from English (but in practice, all of them do).

```typescript
fr: {
  title:      'Titre français',
  tagline:    'Description courte en français.',
  concept:    'Explication du concept...',
  howItWorks: ['Point 1', 'Point 2', 'Point 3'],
  useCases:   [{ label: '...', example: '...' }],
  tips:       ['Conseil 1', 'Conseil 2'],
}
```

The `localizeAnim(anim, lang)` helper merges FR overrides at render time — no manual branching needed.

### Step content — `steps.ts`

Every step object has a `fr: { title, description }` field. This is the only required override — the code itself is the same for both languages.

```typescript
{
  title: 'Add the wrapper',
  description: 'Wrapping the element gives Framer Motion control over its layout.',
  fr: {
    title:       'Ajouter le wrapper',
    description: "Encapsuler l'élément donne à Framer Motion le contrôle de son layout.",
  },
  code: `...`,
}
```

The `localizeStep(step, lang)` helper applies the FR override at render time.

---

## Design System

### Color tokens

Splash uses a single palette — **Obsidian Lime** — with full dark and light mode variants defined as CSS custom properties on `:root` and `.dark`.

| Token | Light | Dark | Usage |
|---|---|---|---|
| `--bg` | `#FFFFFF` | `#080808` | Page background |
| `--bg-secondary` | `#F5F5F5` | `#111111` | Card backgrounds, input fills |
| `--bg-tertiary` | `#EBEBEB` | `#1A1A1A` | Hover states, dividers |
| `--text-primary` | `#0A0A0A` | `#FFFFFF` | Body text, headings |
| `--text-secondary` | `#555555` | `#B0B8A8` | Labels, captions |
| `--text-tertiary` | `#999999` | `#606858` | Placeholders, disabled |
| `--accent` | `#5A9200` | `#A3E635` | CTAs, highlights, progress bars |
| `--accent-light` | `#82C400` | `#CAFF6A` | Hover state for accent elements |
| `--accent-faint` | `#F0FAE0` | `#0E1C00` | Accent background tints |
| `--border` | `rgba(0,0,0,.08)` | `rgba(163,230,53,.08)` | Default borders |
| `--border-strong` | `rgba(0,0,0,.14)` | `rgba(163,230,53,.15)` | Emphasized borders |

### Typography

| Role | Font | Weight |
|---|---|---|
| Display / headings | Cabinet Grotesk | 700–800 |
| Body / UI | Satoshi | 400–500 |
| Code | System monospace (`ui-monospace`) | 400 |

### Breakpoints

Defined in `useBreakpoint.ts`:

| Name | Range |
|---|---|
| `mobile` | `< 640px` |
| `tablet` | `640px – 899px` |
| `desktop` | `≥ 900px` |

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Cmd+K` / `Ctrl+K` | Open command palette |
| `Esc` | Close command palette / close detail view |
| `←` / `→` | Previous / next step (in detail view) |
| `1` – `5` | Jump to step 1–4 (in detail view) |

---

## Changelog

### v1.5 — June 2025

- **URL sharing** — deep links encode animation + platform + step
- **Cmd+K command palette** — global search and navigation
- **Progress tracking** — per-animation completion stored in `localStorage`, badge unlock per category
- **Phase accordion** — steps grouped into Setup / Core / Polish, auto-expands to current step
- **3 new animations** — Morphing Button, Drag Reorder, Number Counter
- **404 page** — canvas particle animation with spring entrance
- **Flutter Hero fix** — Framer Motion `layoutId` transition now works correctly (grid card kept in DOM at `opacity: 0` while detail is open)
- **Mobile cursor fix** — custom cursor disabled entirely on `pointer: coarse` devices

### v1.4 — May 2025

- Bookmarks / favorites system
- Keyboard shortcuts (step navigation, Esc to close)
- Grouped steps with code diff view
- Resizable split pane (preview ↔ code)
- Use-case modal with real-world examples

### v1.3 — April 2025

- Obsidian Lime design system — full dark/light mode via CSS custom properties
- View Transitions API theme crossfade
- Custom magnetic cursor
- Page transitions with Framer Motion `AnimatePresence`
- Snap scroll on home page

### v1.2 — March 2025

- Full EN / FR bilingual support
- Filter sidebar (category + difficulty)
- Platform logos and platform selector view
- Skeleton loading for async content

### v1.1 — March 2025

- Live preview with browser frame (web) and phone bezel (mobile)
- Step-by-step stepper with code blocks
- Dark mode via system preference detection

### v1.0 — February 2025

- Initial release — 10 animation patterns, React and Next.js only

---

## Contributing

Contributions are welcome. Before opening a PR:

1. Follow the **Adding a New Animation** guide above exactly.
2. All 5 platform implementations must be present and complete.
3. All 4 steps must be defined per platform.
4. `fr:` translations must be complete on every step and on the animation entry itself.
5. TypeScript must compile with zero errors: `npx tsc --noEmit`
6. The preview must render correctly at all 4 steps on both web and mobile tabs.
7. Verify the deep link works: `/learn?slug=your-slug&platform=react&step=0`

For bug fixes or UI improvements, open an issue first to align on the approach.

---

<div align="center">

Built with Next.js · React 19 · Framer Motion · TypeScript

MIT License

</div>
