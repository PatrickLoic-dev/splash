# Splash

**Learn the animations every app needs — implemented for every major platform.**

Splash is an interactive learning platform covering ten fundamental animation patterns, each explained in depth with production-ready code for React, Next.js, Vue, React Native, and Flutter.

## What's inside

| Pattern | Category | Difficulty |
|---|---|---|
| Fade In | Entrance | Beginner |
| Slide Up | Entrance | Beginner |
| Stagger List | List | Beginner |
| Spring Card | Feedback | Intermediate |
| Skeleton Loader | Loading | Beginner |
| Shared Element | Navigation | Advanced |
| Collapsing Header | Scroll | Intermediate |
| Page Transition | Navigation | Intermediate |
| Infinite Carousel | Carousel | Intermediate |
| Pull to Refresh | Feedback | Advanced |

Each pattern includes:
- A live interactive preview (browser frame or mobile phone frame)
- Step-by-step implementation walkthrough
- Platform-specific code for all 5 stacks
- Real-world use cases and production tips

## Tech stack

- **Framework** — Next.js 14+ (App Router, static export)
- **Animations** — Framer Motion
- **Styling** — CSS custom properties, no UI library
- **i18n** — Built-in EN/FR toggle, no external dependency
- **Fonts** — PowerGrotesk (headings), Outfit (body)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # static export → out/
```

## Project structure

```
src/
├── app/
│   ├── page.tsx           # Home
│   └── learn/page.tsx     # Learn (selector → filtered → detail)
├── components/
│   ├── HomePage.tsx
│   ├── LearnPage.tsx
│   ├── Navbar.tsx
│   ├── AnimationPreview.tsx
│   ├── GridBackground.tsx
│   ├── BrowserFrame.tsx
│   └── PhoneFrame.tsx
└── lib/
    ├── learnContent.ts    # Animation metadata, use cases, tips
    ├── steps.ts           # Per-platform step-by-step code walkthroughs
    └── i18n.tsx           # EN/FR translations + useI18n hook
```

## Contributing

Adding a new animation pattern requires three things:

1. **`learnContent.ts`** — add an entry to `ANIMATIONS` with title, tagline, concept, howItWorks steps, useCases, tips, and per-platform implementations.
2. **`steps.ts`** — add a `StepMap` entry keyed by slug with 4-step progressions for each platform.
3. **`AnimationPreview.tsx`** — add a case for the new slug returning the live preview component.

## License

MIT
