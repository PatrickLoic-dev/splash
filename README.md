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

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11-purple?style=flat-square)](https://framer.com/motion)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## What is Splash?

**Splash** is an interactive animation learning platform that teaches UI animation patterns across five major frontend frameworks — React, Next.js, Vue 3, React Native, and Flutter.

Each animation is broken into **4 incremental steps** that build on each other, explaining *why* each addition matters. A live preview updates as you progress through the steps, and production-ready code is available for every platform.

### Core principles

- **Incremental** — animations are taught step by step, not dumped as a final snippet
- **Cross-platform** — every pattern has an implementation for all 5 platforms
- **Bilingual** — full English + French translation on all content
- **No magic** — every technique is explained in plain language before the code appears

---

## Features

| Feature | Description |
|---|---|
| 14 animation patterns | Curated set covering the most impactful UI motion patterns |
| 5 platforms | React, Next.js, Vue 3, React Native, Flutter |
| Step-by-step learning | 4 incremental steps per pattern per platform |
| Live preview | Interactive preview updates in real time as you advance through steps |
| Framed previews | Browser frame (web) or phone bezel (mobile) on every preview |
| Filter sidebar | Filter animations by category and difficulty level |
| Bilingual | All content available in EN and FR |
| Dark / Light mode | Full theme support via CSS variables |
| Fully static | Exports to static HTML — deployable to any CDN |

---

## Animation Catalog

> **✓** = implementation available · **Web** = browser frame preview · **Mobile** = phone frame preview

| # | Animation | Category | Difficulty | Web | Mobile |
|---|---|---|---|:---:|:---:|
| 1 | Entrance Reveal | Entrance | Beginner | ✓ | ✓ |
| 2 | Page Transitions | Navigation | Beginner | ✓ | ✓ |
| 3 | Gesture Feedback | Feedback | Beginner | ✓ | ✓ |
| 4 | Parallax | Scroll | Intermediate | ✓ | ✓ |
| 5 | Skeleton Loading | Loading | Beginner | ✓ | ✓ |
| 6 | Stagger List | List | Beginner | ✓ | ✓ |
| 7 | Image Carousel | Carousel | Intermediate | ✓ | ✓ |
| 8 | Onboarding Flow | Navigation | Intermediate | ✓ | ✓ |
| 9 | Shared Element | Navigation | Advanced | ✓ | ✓ |
| 10 | Collapsing Header | Scroll | Advanced | ✓ | ✓ |
| 11 | Pan Dismiss | Feedback | Intermediate | ✓ | ✓ |
| 12 | Flutter Hero | Navigation | Intermediate | ✓ | ✓ |
| 13 | View Transitions | Navigation | Intermediate | ✓ | ✓ |
| 14 | FLIP List | List | Intermediate | ✓ | ✓ |

**Platform coverage per animation:**

| Animation | React | Next.js | Vue 3 | React Native | Flutter |
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

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router, `output: 'export'`) |
| Language | TypeScript 5 |
| Animation (web) | Framer Motion 11 |
| Styling | Inline styles + CSS custom properties (no Tailwind) |
| i18n | Custom `useI18n` hook (EN / FR) |
| Responsive | Custom `useBreakpoint` hook (`< 640px` mobile · `640–900px` tablet · `≥ 900px` desktop) |
| Fonts | Power Grotesk (display) + Outfit (body) |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev

# Build for production (static export)
npm run build
```

The app exports to `out/` as fully static HTML. No server required.

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with ThemeProvider
│   ├── page.tsx            # Home page
│   └── learn/page.tsx      # Animation learning page
├── components/
│   ├── AnimationPreview.tsx # All live preview components (Web + Mobile)
│   ├── BrowserFrame.tsx     # Browser chrome wrapper for web previews
│   ├── PhoneFrame.tsx       # Phone bezel wrapper for mobile previews
│   ├── LearnPage.tsx        # Main learning UI (selector, filtered view, detail view)
│   ├── HomePage.tsx         # Landing page
│   └── ...
└── lib/
    ├── learnContent.ts      # Animation metadata, descriptions, implementations
    ├── steps.ts             # Step-by-step code examples (all platforms + FR)
    ├── i18n.tsx             # Translation strings (EN / FR)
    └── useBreakpoint.ts     # Responsive breakpoint hook
```

---

## Adding a New Animation

Follow these steps to add a new animation to the platform. Every step is required — incomplete animations will not display correctly.

### 1. Define the animation in `learnContent.ts`

Add a new entry to the `ANIMATIONS` array:

```typescript
{
  slug: 'my-animation',           // URL-safe, kebab-case, unique
  title: 'My Animation',
  category: 'Feedback',           // See categories below
  difficulty: 'Intermediate',     // 'Beginner' | 'Intermediate' | 'Advanced'
  tagline: 'One-line description of what it does',
  concept: 'Paragraph explaining the concept and why it matters...',
  howItWorks: [
    'Step 1 explanation (plain language)',
    'Step 2 explanation...',
    // 3–5 bullet points
  ],
  implementations: [
    {
      platform: 'react',
      deps: ['framer-motion'],
      notes: 'Optional note shown above the code block',
      code: `// Full working code example (React)`,
    },
    // repeat for: 'nextjs', 'vue', 'react-native', 'flutter'
  ],
  useCases: [
    { label: 'Use case label', example: 'Concrete example sentence.' },
    // 3–5 use cases
  ],
  tips: [
    'Practical tip 1...',
    // 3–5 tips
  ],
  fr: {
    // Full French translation of every field above
    title: '...',
    tagline: '...',
    concept: '...',
    howItWorks: ['...', '...'],
    useCases: [{ label: '...', example: '...' }],
    tips: ['...'],
  },
}
```

**Available categories:** `'Entrance'` · `'Navigation'` · `'Scroll'` · `'Feedback'` · `'Loading'` · `'List'` · `'Carousel'`

### 2. Add step-by-step code in `steps.ts`

Add a `StepMap` object and register it in the `ALL_STEPS` lookup:

```typescript
// steps.ts

const myAnimation: StepMap = {
  react: [
    {
      title: 'Step 1 title',
      description: 'What this step establishes and why it matters.',
      fr: { title: 'Titre étape 1', description: 'Explication en français...' },
      code: `// Minimal code for step 1`,
    },
    // Steps 2, 3, 4 — each adds one new concept on top of the previous
  ],
  nextjs: [ /* 4 steps */ ],
  vue:    [ /* 4 steps */ ],
  'react-native': [ /* 4 steps */ ],
  flutter: [ /* 4 steps */ ],
}

// In ALL_STEPS:
const ALL_STEPS: Record<string, StepMap> = {
  // ... existing entries ...
  'my-animation': myAnimation,
}
```

**Rules for steps:**
- Exactly **4 steps** per platform
- Each step **builds on the previous** — step 1 is the static baseline, step 4 is the fully polished version
- Every step **must have** `fr: { title, description }` — no exceptions
- Code in each step should be **focused** (8–20 lines) — show only what changed

### 3. Create the preview component in `AnimationPreview.tsx`

Add two components — one for web, one for mobile — and register them in the dispatch maps:

```typescript
// Web preview (renders inside BrowserFrame)
function MyAnimationWeb({ step }: { step: number }) {
  // step 0 = static baseline, step 3 = fully polished
  // Use step comparisons (step >= 1, step >= 2, etc.) to progressively
  // enable animation features that match the learning steps.
  return <div>...</div>
}

// Mobile preview (renders inside PhoneFrame)
function MyAnimationMobile({ step }: { step: number }) {
  return <div>...</div>
}

// Register in the dispatch maps at the bottom of the file:
const WEB_MAP: Record<string, React.FC<{ step: number }>> = {
  // ... existing entries ...
  'my-animation': MyAnimationWeb,
}

const MOBILE_MAP: Record<string, React.FC<{ step: number }>> = {
  // ... existing entries ...
  'my-animation': MyAnimationMobile,
}
```

**Preview guidelines:**
- The web preview renders inside `BrowserFrame` (fixed 240px content height)
- The mobile preview renders inside `PhoneFrame` (200 × 420px, content starts at 28px from top)
- Use `useEffect` with `step` as a dependency to reset state when the user changes steps
- Never use `position: fixed` inside previews — use `position: absolute` relative to the preview container
- Avoid `layoutId` values that could collide across multiple preview instances; prefer overlay patterns (like `SharedElementWeb`) over page-switch patterns for shared-element animations

### 4. Verify

```bash
# TypeScript must pass with zero errors
npx tsc --noEmit

# Start dev server and manually verify:
# - Preview renders at all 4 steps
# - FR translation displays correctly when language is set to FR
# - Animation card thumbnail shows in the filtered view
# - Detail view opens and stepper works
npm run dev
```

---

## Translation Guidelines

All user-facing strings must be available in both English and French.

| Location | How to translate |
|---|---|
| UI labels (buttons, tabs, etc.) | Add key to `src/lib/i18n.tsx` in both `en` and `fr` objects |
| Animation title / tagline / concept | Add `fr: { ... }` to the animation entry in `learnContent.ts` |
| Step titles and descriptions | Add `fr: { title, description }` to every step in `steps.ts` |

The `localizeAnim(anim, lang)` and `localizeStep(step, lang)` helpers in `learnContent.ts` handle merging FR overrides at render time.

---

## Objectives

1. **Learn by doing** — users should be able to implement any pattern immediately after viewing it
2. **No framework lock-in** — every pattern is available on all 5 platforms with equivalent quality
3. **Production-ready code** — snippets should work as-is in real projects, not toy examples
4. **Accessible to beginners** — each step starts from scratch with a static baseline, no prior animation knowledge assumed
5. **Fast** — fully static export, no server-side rendering, no API calls

---

## Contributing

Contributions welcome. Please follow the **Adding a New Animation** guide above and ensure:

- All 5 platform implementations are present
- All 4 steps per platform are defined
- `fr:` translations are complete on every step and on the animation entry
- TypeScript compiles with zero errors (`npx tsc --noEmit`)
- The preview component correctly reflects each step's state

---

<div align="center">

Built with Next.js · Framer Motion · TypeScript

</div>
