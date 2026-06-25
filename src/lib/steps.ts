import type { PlatformId } from './learnContent'

export interface Step {
  title: string
  description: string  /* EN explanation of WHY this step matters */
  code: string
  fr?: {
    title?: string
    description?: string
  }
}

export type StepMap = Partial<Record<PlatformId, Step[]>>

/* ─────────────────────────────────────────────────────────────────── */
/*  1. Entrance Reveal                                                  */
/* ─────────────────────────────────────────────────────────────────── */

const entranceReveal: StepMap = {
  react: [
    {
      title: 'Render the element',
      description: 'Start with a plain `div`. Get the layout right before adding any animation. The element renders immediately at full opacity — this is the baseline we\'ll animate from.',
      fr: {
        title: 'Rendre l\'élément',
        description: 'Commencer avec un `div` simple. Obtenir la mise en page correcte avant d\'ajouter des animations. L\'élément s\'affiche immédiatement en opacité totale — c\'est la base depuis laquelle nous allons animer.',
      },
      code: `function RevealOnScroll({ children }) {
  return (
    <div className="section">
      {children}
    </div>
  )
}`,
    },
    {
      title: 'Swap to motion.div',
      description: 'Replace `div` with `motion.div` and set `initial` → `animate`. The element now fades from invisible to visible on every mount. No scroll awareness yet — it plays immediately.',
      fr: {
        title: 'Passer à motion.div',
        description: 'Remplacer `div` par `motion.div` et définir `initial` → `animate`. L\'élément s\'estompe maintenant de invisible à visible à chaque montage. Pas encore de conscience du scroll — il se joue immédiatement.',
      },
      code: `import { motion } from 'framer-motion'

function RevealOnScroll({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}`,
    },
    {
      title: 'Add a slide direction',
      description: 'Add `y: 32` to `initial` so the element slides up as it fades in. The cubic-bezier `[0.22, 1, 0.36, 1]` starts fast and decelerates — it matches how objects fall, which reads as natural.',
      fr: {
        title: 'Ajouter une direction de glissement',
        description: 'Ajouter `y: 32` à `initial` pour que l\'élément glisse vers le haut en s\'estompant. Le cubic-bezier `[0.22, 1, 0.36, 1]` démarre vite et décélère — il imite la façon dont les objets tombent, ce qui paraît naturel.',
      },
      code: `import { motion } from 'framer-motion'

function RevealOnScroll({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}`,
    },
    {
      title: 'Trigger on scroll + stagger',
      description: '`useInView` wraps an IntersectionObserver. When the element crosses `margin: \'-80px\'` (80px before the viewport edge), `inView` flips true and the animation runs once. Pass a `delay` prop to stagger multiple sibling elements.',
      fr: {
        title: 'Déclencher au scroll + cascade',
        description: '`useInView` enveloppe un IntersectionObserver. Quand l\'élément franchit `margin: \'-80px\'` (80px avant le bord de la fenêtre), `inView` passe à true et l\'animation se joue une fois. Passer une prop `delay` pour décaler plusieurs éléments frères.',
      },
      code: `import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

function RevealOnScroll({ children, delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// Stagger siblings with the delay prop
<RevealOnScroll delay={0}>   <h2>Heading</h2>   </RevealOnScroll>
<RevealOnScroll delay={0.1}> <p>Paragraph</p>   </RevealOnScroll>
<RevealOnScroll delay={0.2}> <img src="..." />  </RevealOnScroll>`,
    },
  ],

  nextjs: [
    {
      title: 'Add the client directive',
      description: 'In the App Router, any component that uses `useRef` or `useInView` (browser APIs) must declare `\'use client\'` at the top. Server Components can still import and use this component — Next.js handles the boundary.',
      code: `'use client'

// This directive tells Next.js: "render this component in the browser."
// Server Components that import RevealOnScroll remain server-rendered;
// only RevealOnScroll itself ships to the client.

function RevealOnScroll({ children }) {
  return <div>{children}</div>
}`,
    },
    {
      title: 'Add motion.div',
      description: 'Same as the React implementation. The `\'use client\'` directive at the top is the only Next.js-specific requirement.',
      code: `'use client'
import { motion } from 'framer-motion'

function RevealOnScroll({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}`,
    },
    {
      title: 'Add slide + easing',
      description: 'Add `y` offset and the cubic-bezier ease. At this stage, the animation plays on every mount. In Next.js, hard navigations remount the page — so users see the animation every time they arrive.',
      code: `'use client'
import { motion } from 'framer-motion'

function RevealOnScroll({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}`,
    },
    {
      title: 'Connect useInView + stagger',
      description: 'Export this component from a dedicated file and import it into any Server Component page — the boundary is implicit. The `delay` prop staggers siblings without any additional orchestration logic.',
      code: `'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function RevealOnScroll({ children, delay = 0 }: {
  children: React.ReactNode
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

// In a Server Component page:
// import { RevealOnScroll } from '@/components/RevealOnScroll'
// <RevealOnScroll delay={0.1}><p>Content</p></RevealOnScroll>`,
    },
  ],

  vue: [
    {
      title: 'Plain template div',
      description: 'Render the content without any animation. In Vue 3, the `<template>` tag holds the markup. Establish the correct layout before touching transitions.',
      code: `<template>
  <div class="section">
    <slot />
  </div>
</template>

<script setup lang="ts">
// Nothing yet — just the element
</script>`,
    },
    {
      title: 'Bind opacity to a reactive flag',
      description: 'Introduce a `isVisible` ref and bind `opacity` to it via `:style`. Set `isVisible` to true in `onMounted` so it animates on mount. Add a CSS `transition` for the actual motion.',
      code: `<template>
  <div :style="{ opacity: isVisible ? 1 : 0, transition: 'opacity 0.6s ease' }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const isVisible = ref(false)
onMounted(() => { isVisible.value = true })
</script>`,
    },
    {
      title: 'Add translateY',
      description: 'Add `transform: translateY` to the bound style object. Use the same cubic-bezier easing string you\'d use in Framer Motion — CSS `transition` accepts it natively.',
      code: `<template>
  <div :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{ delay?: number }>()
const isVisible = ref(false)
onMounted(() => setTimeout(() => { isVisible.value = true }, (props.delay ?? 0) * 1000))

const style = computed(() => ({
  opacity: isVisible.value ? 1 : 0,
  transform: isVisible.value ? 'translateY(0)' : 'translateY(32px)',
  transition: \`opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)\`,
}))
</script>`,
    },
    {
      title: 'Trigger on scroll with VueUse',
      description: '`useIntersectionObserver` from VueUse replaces the manual `onMounted` trigger. The observer fires once when the element enters the viewport, then disconnects (`{ once: true }` equivalent via `stop()`).',
      code: `<template>
  <div ref="el" :style="style"><slot /></div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = withDefaults(defineProps<{ delay?: number }>(), { delay: 0 })

const el          = ref<HTMLElement | null>(null)
const isVisible   = ref(false)

const { stop } = useIntersectionObserver(
  el,
  ([entry]) => { if (entry.isIntersecting) { isVisible.value = true; stop() } },
  { rootMargin: '-80px 0px' },
)

const style = computed(() => ({
  opacity: isVisible.value ? 1 : 0,
  transform: isVisible.value ? 'translateY(0)' : 'translateY(32px)',
  transition: [
    \`opacity 0.6s cubic-bezier(0.22,1,0.36,1) \${props.delay}s\`,
    \`transform 0.6s cubic-bezier(0.22,1,0.36,1) \${props.delay}s\`,
  ].join(', '),
}))
</script>`,
    },
  ],

  'react-native': [
    {
      title: 'Plain View',
      description: 'Start with a standard `View`. In React Native there is no DOM, so no IntersectionObserver — the animation will trigger on layout (when the element is measured) rather than on scroll.',
      code: `import { View } from 'react-native'

function RevealOnMount({ children }) {
  return (
    <View>
      {children}
    </View>
  )
}`,
    },
    {
      title: 'Create shared values',
      description: '`useSharedValue` creates values that live on the UI thread — animations driven by them never pass through the JS bridge. Declare one for opacity and one for translateY.',
      code: `import Animated, { useSharedValue } from 'react-native-reanimated'

function RevealOnMount({ children }) {
  const opacity    = useSharedValue(0)   // starts hidden
  const translateY = useSharedValue(32)  // starts below

  return (
    <Animated.View>
      {children}
    </Animated.View>
  )
}`,
    },
    {
      title: 'Animate on layout',
      description: '`onLayout` fires once when the element is first measured and added to the layout tree. Trigger `withTiming` there — no setTimeout needed. `useAnimatedStyle` subscribes to shared value changes on the UI thread.',
      code: `import Animated, {
  useSharedValue, useAnimatedStyle, withTiming, Easing,
} from 'react-native-reanimated'

function RevealOnMount({ children }) {
  const opacity    = useSharedValue(0)
  const translateY = useSharedValue(32)

  function onLayout() {
    opacity.value    = withTiming(1, { duration: 600 })
    translateY.value = withTiming(0, {
      duration: 600,
      easing: Easing.bezier(0.22, 1, 0.36, 1),
    })
  }

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={animStyle} onLayout={onLayout}>
      {children}
    </Animated.View>
  )
}`,
    },
    {
      title: 'Add delay prop for stagger',
      description: '`withDelay` wraps any animation and defers it by the given milliseconds. Pass a `delay` prop to each instance and the parent controls the cascade — no separate stagger hook needed.',
      code: `import Animated, {
  useSharedValue, useAnimatedStyle,
  withDelay, withTiming, Easing,
} from 'react-native-reanimated'

function RevealOnMount({ children, delay = 0 }: {
  children: React.ReactNode
  delay?: number
}) {
  const opacity    = useSharedValue(0)
  const translateY = useSharedValue(32)

  function onLayout() {
    opacity.value = withDelay(delay, withTiming(1, { duration: 600 }))
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 600, easing: Easing.bezier(0.22, 1, 0.36, 1) })
    )
  }

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return <Animated.View style={style} onLayout={onLayout}>{children}</Animated.View>
}

// Stagger three elements by 120ms each
<RevealOnMount delay={0}>   <Heading />   </RevealOnMount>
<RevealOnMount delay={120}> <Paragraph /> </RevealOnMount>
<RevealOnMount delay={240}> <Card />      </RevealOnMount>`,
    },
  ],

  flutter: [
    {
      title: 'StatefulWidget scaffold',
      description: 'Flutter animations require a `StatefulWidget` so the `AnimationController` can be initialized and disposed with the widget lifecycle. Start with the scaffold — no animation logic yet.',
      code: `import 'package:flutter/material.dart';

class RevealOnMount extends StatefulWidget {
  final Widget child;
  const RevealOnMount({ required this.child, super.key });

  @override
  State<RevealOnMount> createState() => _RevealOnMountState();
}

class _RevealOnMountState extends State<RevealOnMount> {
  @override
  Widget build(BuildContext context) => widget.child;
}`,
    },
    {
      title: 'Add AnimationController + FadeTransition',
      description: '`AnimationController` drives all animations in Flutter — think of it as the `useMotionValue(0)` → animate to 1 equivalent. `FadeTransition` subscribes to the animation and handles opacity.',
      code: `class _RevealOnMountState extends State<RevealOnMount>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _opacity;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _opacity = Tween<double>(begin: 0, end: 1)
        .animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOut));

    _ctrl.forward(); // play immediately on mount
  }

  @override
  Widget build(BuildContext context) =>
      FadeTransition(opacity: _opacity, child: widget.child);

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }
}`,
    },
    {
      title: 'Add SlideTransition',
      description: '`SlideTransition` animates position as a fractional offset of the widget\'s own size. `Offset(0, 0.1)` starts 10% below — equivalent to `translateY: 32px` on a 320px element.',
      code: `// Add to initState:
_slide = Tween<Offset>(
  begin: const Offset(0, 0.1),
  end: Offset.zero,
).animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOutCubic));

// Wrap both transitions in build:
@override
Widget build(BuildContext context) => FadeTransition(
  opacity: _opacity,
  child: SlideTransition(
    position: _slide,
    child: widget.child,
  ),
);`,
    },
    {
      title: 'Add delay for stagger',
      description: '`Future.delayed` defers the controller\'s `forward()` call. The `mounted` check prevents calling `forward()` if the widget was disposed before the delay elapsed — important for fast navigation.',
      code: `import 'package:flutter/material.dart';

class RevealOnMount extends StatefulWidget {
  final Widget child;
  final Duration delay;
  const RevealOnMount({
    required this.child,
    this.delay = Duration.zero,
    super.key,
  });
  @override State<RevealOnMount> createState() => _RevealOnMountState();
}

class _RevealOnMountState extends State<RevealOnMount>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _opacity;
  late final Animation<Offset>  _slide;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 600));
    _opacity = Tween<double>(begin: 0, end: 1).animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOut));
    _slide   = Tween<Offset>(begin: const Offset(0, 0.1), end: Offset.zero).animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOutCubic));
    Future.delayed(widget.delay, () { if (mounted) _ctrl.forward(); });
  }

  @override
  Widget build(BuildContext context) => FadeTransition(
    opacity: _opacity,
    child: SlideTransition(position: _slide, child: widget.child),
  );

  @override void dispose() { _ctrl.dispose(); super.dispose(); }
}

// Stagger three elements
RevealOnMount(delay: Duration.zero,            child: Heading())
RevealOnMount(delay: Duration(milliseconds: 120), child: Paragraph())
RevealOnMount(delay: Duration(milliseconds: 240), child: Card())`,
    },
  ],
}

/* ─────────────────────────────────────────────────────────────────── */
/*  2. Page Transitions                                                 */
/* ─────────────────────────────────────────────────────────────────── */

const pageTransitions: StepMap = {
  react: [
    {
      title: 'Instant state switch',
      description: 'Two views controlled by a `useState` boolean. Swapping state replaces one component with another immediately — no animation. This is the baseline to improve on.',
      code: `import { useState } from 'react'

export function App() {
  const [page, setPage] = useState<'overview' | 'detail'>('overview')

  return (
    <div>
      <nav>
        <button onClick={() => setPage('overview')}>Overview</button>
        <button onClick={() => setPage('detail')}>Detail</button>
      </nav>
      {page === 'overview' ? <OverviewPage /> : <DetailPage />}
    </div>
  )
}`,
    },
    {
      title: 'Wrap in AnimatePresence',
      description: '`AnimatePresence` watches its children for unmounts and runs their `exit` animation before removing them from the DOM. Without an `exit` prop on children, there\'s still no visible animation — but the plumbing is in place.',
      code: `import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'

export function App() {
  const [page, setPage] = useState<'overview' | 'detail'>('overview')

  return (
    <div>
      <nav>...</nav>
      <AnimatePresence>
        {page === 'overview' ? <OverviewPage /> : <DetailPage />}
      </AnimatePresence>
    </div>
  )
}`,
    },
    {
      title: 'Add initial + exit to the page',
      description: 'Each page component becomes a `motion.div` with `initial`, `animate`, and `exit`. The `key` prop is critical — React uses it to identify which child changed, and `AnimatePresence` uses it to trigger enter/exit.',
      code: `import { motion } from 'framer-motion'

// Each page component:
function OverviewPage() {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* page content */}
    </motion.div>
  )
}

function DetailPage() {
  return (
    <motion.div
      key="detail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* page content */}
    </motion.div>
  )
}`,
    },
    {
      title: 'Add mode="wait" and directional slide',
      description: '`mode="wait"` makes the exit animation finish before the enter animation starts — prevents two pages overlapping. Adding `y` offset makes the swap feel directional: old page slides up, new page comes in from below.',
      code: `import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function App() {
  const [page, setPage] = useState<'overview' | 'detail'>('overview')

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <nav>...</nav>
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {page === 'overview' ? <OverviewPage /> : <DetailPage />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}`,
    },
  ],

  nextjs: [
    {
      title: 'Detect the current route',
      description: '`usePathname` from `next/navigation` gives you the current URL path as a string. This is the key React needs to identify which page is "current" — and which one just changed.',
      code: `'use client'
import { usePathname } from 'next/navigation'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // pathname is e.g. '/about', '/work/project-1'
  console.log(pathname)

  return <>{children}</>
}`,
    },
    {
      title: 'Add AnimatePresence in the layout',
      description: 'Place `AnimatePresence` in a Client Component inside `app/layout.tsx`. Use `pathname` as the key — React treats a different key as a new child, triggering the exit → enter sequence.',
      code: `'use client'
import { AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      {/* key change triggers exit/enter */}
      <div key={pathname}>{children}</div>
    </AnimatePresence>
  )
}`,
    },
    {
      title: 'Upgrade the wrapper to motion.div',
      description: 'Swap the inner `div` for `motion.div` with `initial`, `animate`, and `exit`. Every page in the app now gets this transition for free — no per-page changes needed.',
      code: `'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}`,
    },
    {
      title: 'Wire into the root layout',
      description: '`RootLayout` is a Server Component — it can import the Client Component `LayoutWrapper` freely. The `{children}` passed in are the Server-rendered page components; they stream in without waiting for the client.',
      code: `// app/layout.tsx  — Server Component (no 'use client')
import { LayoutWrapper } from '@/components/LayoutWrapper'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  )
}

// components/LayoutWrapper.tsx  — full code from step 3
'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={pathname}
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}`,
    },
  ],

  vue: [
    {
      title: 'Instant RouterView',
      description: '`<RouterView>` renders the current route\'s component. By default, switching routes is instant — the old component unmounts and the new one mounts in the same tick.',
      code: `<!-- App.vue -->
<template>
  <nav>
    <RouterLink to="/">Overview</RouterLink>
    <RouterLink to="/detail">Detail</RouterLink>
  </nav>
  <RouterView />
</template>`,
    },
    {
      title: 'Wrap RouterView in Transition',
      description: 'Vue\'s `<Transition>` component wraps the entering/leaving element and applies CSS classes at each phase. The `name` prop prefixes all class names: `page-enter-from`, `page-leave-to`, etc.',
      code: `<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<!-- No CSS yet — the transition exists but is instant -->`,
    },
    {
      title: 'Add CSS transition classes',
      description: 'Apply `transition` in the `-active` classes and the start/end states in `-from` / `-to`. Vue applies these classes during the enter/leave phases, and CSS does the actual animation.',
      code: `<template>
  <RouterView v-slot="{ Component }">
    <Transition name="page">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-enter-from { opacity: 0; transform: translateY(16px); }
.page-leave-to   { opacity: 0; transform: translateY(-16px); }
</style>`,
    },
    {
      title: 'Add mode="out-in" to prevent overlap',
      description: '`mode="out-in"` tells Vue to wait for the leaving component to finish its exit before mounting the entering one — preventing two pages from overlapping mid-transition. Pass the route path as `:key` so Vue detects same-component route changes.',
      code: `<template>
  <RouterView v-slot="{ Component, route }">
    <Transition name="page" mode="out-in">
      <component :is="Component" :key="route.path" />
    </Transition>
  </RouterView>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition:
    opacity  0.3s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.page-enter-from { opacity: 0; transform: translateY(16px);  }
.page-leave-to   { opacity: 0; transform: translateY(-16px); }
.page-move       { transition: transform 0.4s ease; }
</style>`,
    },
  ],

  'react-native': [
    {
      title: 'Default Stack navigator',
      description: 'React Navigation\'s Stack navigator already provides platform-native transitions (slide on iOS, fade-up on Android). Understanding the default is important before customising.',
      code: `import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Overview" component={OverviewScreen} />
      <Stack.Screen name="Detail"   component={DetailScreen} />
    </Stack.Navigator>
  )
}
// Default: slides from right on iOS, scales-up on Android`,
    },
    {
      title: 'Use a built-in interpolator',
      description: '`CardStyleInterpolators` ships preset animation curves. `forFadeFromCenter` gives a cross-fade, `forHorizontalIOS` gives the native iOS push slide. No custom math needed.',
      code: `import { CardStyleInterpolators } from '@react-navigation/stack'

<Stack.Navigator
  screenOptions={{
    headerShown: false,
    cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
    transitionSpec: {
      open:  { animation: 'timing', config: { duration: 350 } },
      close: { animation: 'timing', config: { duration: 300 } },
    },
  }}
>
  <Stack.Screen name="Overview" component={OverviewScreen} />
  <Stack.Screen name="Detail"   component={DetailScreen} />
</Stack.Navigator>`,
    },
    {
      title: 'Write a custom interpolator',
      description: 'A `cardStyleInterpolator` receives `current.progress` (0 → 1 on enter, 1 → 0 on exit) and the screen dimensions. Return an animated style object.',
      code: `const forFadeSlide = ({ current, layouts }) => ({
  cardStyle: {
    opacity: current.progress,
    transform: [{
      translateY: current.progress.interpolate({
        inputRange:  [0, 1],
        outputRange: [layouts.screen.height * 0.06, 0],
      }),
    }],
  },
})

<Stack.Navigator screenOptions={{
  headerShown: false,
  cardStyleInterpolator: forFadeSlide,
}}>`,
    },
    {
      title: 'Configure timing per transition',
      description: '`transitionSpec` lets you set different speeds for push (open) vs pop (close). Closing slightly faster than opening feels more responsive — the user already knows where they\'re going.',
      code: `import { createStackNavigator } from '@react-navigation/stack'
const Stack = createStackNavigator()

const forFadeSlide = ({ current, layouts }) => ({
  cardStyle: {
    opacity: current.progress,
    transform: [{
      translateY: current.progress.interpolate({
        inputRange: [0, 1], outputRange: [layouts.screen.height * 0.06, 0],
      }),
    }],
  },
})

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      cardStyleInterpolator: forFadeSlide,
      transitionSpec: {
        open:  { animation: 'timing', config: { duration: 380 } },
        close: { animation: 'timing', config: { duration: 280 } },
      },
    }}>
      <Stack.Screen name="Overview" component={OverviewScreen} />
      <Stack.Screen name="Detail"   component={DetailScreen} />
    </Stack.Navigator>
  )
}`,
    },
  ],

  flutter: [
    {
      title: 'Navigator.push with default route',
      description: 'Flutter\'s default `MaterialPageRoute` slides up from the bottom on Android and slides from the right on iOS. This is the baseline — we\'ll replace it with a custom route.',
      code: `// Navigate with the default transition
Navigator.push(
  context,
  MaterialPageRoute(builder: (_) => const DetailScreen()),
);`,
    },
    {
      title: 'Replace with PageRouteBuilder',
      description: '`PageRouteBuilder` lets you define `transitionsBuilder`. The `animation` parameter is the controller (0 → 1 on enter). Returning `child` unchanged gives an instant transition — the hook is in place.',
      code: `Navigator.push(
  context,
  PageRouteBuilder(
    pageBuilder: (_, __, ___) => const DetailScreen(),
    transitionDuration: const Duration(milliseconds: 350),
    transitionsBuilder: (context, animation, secondary, child) {
      // No animation yet — just passes child through
      return child;
    },
  ),
);`,
    },
    {
      title: 'Add FadeTransition',
      description: '`FadeTransition` subscribes to the `animation` and sets the widget\'s opacity. `CurveTween` maps the linear 0–1 controller value through a curve for more natural motion.',
      code: `transitionsBuilder: (context, animation, secondary, child) {
  final fade = Tween<double>(begin: 0.0, end: 1.0)
      .chain(CurveTween(curve: Curves.easeOut))
      .animate(animation);

  return FadeTransition(opacity: fade, child: child);
},`,
    },
    {
      title: 'Combine fade + slide as a reusable route',
      description: 'Extract into a `FadeSlideRoute` class so you can use it anywhere in the app with `Navigator.push(context, FadeSlideRoute(page: ...))` — no boilerplate at the call site.',
      code: `import 'package:flutter/material.dart';

class FadeSlideRoute<T> extends PageRouteBuilder<T> {
  final Widget page;
  FadeSlideRoute({required this.page}) : super(
    pageBuilder: (_, __, ___) => page,
    transitionDuration:        const Duration(milliseconds: 350),
    reverseTransitionDuration: const Duration(milliseconds: 280),
    transitionsBuilder: (_, animation, __, child) {
      final fade  = Tween<double>(begin: 0.0, end: 1.0)
          .chain(CurveTween(curve: Curves.easeOut)).animate(animation);
      final slide = Tween<Offset>(begin: const Offset(0, 0.06), end: Offset.zero)
          .chain(CurveTween(curve: Curves.easeOutCubic)).animate(animation);
      return FadeTransition(
        opacity: fade,
        child: SlideTransition(position: slide, child: child),
      );
    },
  );
}

// Usage anywhere
Navigator.push(context, FadeSlideRoute(page: const DetailScreen()));`,
    },
  ],
}

/* ─────────────────────────────────────────────────────────────────── */
/*  3. Gesture Feedback                                                 */
/* ─────────────────────────────────────────────────────────────────── */

const gestureFeedback: StepMap = {
  react: [
    {
      title: 'Plain HTML button',
      description: 'A regular `<button>` — no animation. Clicking it works, but there\'s no visual confirmation that the press was registered. This is the problem we\'re solving.',
      code: `export function ActionButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '12px 28px',
        borderRadius: 10,
        background: 'var(--accent)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        fontSize: 14,
      }}
    >
      {children}
    </button>
  )
}`,
    },
    {
      title: 'Add whileTap press feedback',
      description: '`motion.button` replaces the plain button. `whileTap={{ scale: 0.94 }}` animates to 94% size while the pointer is held down and springs back on release. The spring\'s stiffness/damping ratio determines bounciness.',
      code: `import { motion } from 'framer-motion'

export function ActionButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{
        padding: '12px 28px', borderRadius: 10,
        background: 'var(--accent)', color: '#fff',
        border: 'none', cursor: 'pointer', fontSize: 14,
      }}
    >
      {children}
    </motion.button>
  )
}`,
    },
    {
      title: 'Add whileHover lift',
      description: '`whileHover` activates while the cursor is over the element. Combining a slight scale-up with a negative `y` offset simulates the button rising from the surface — shadow would complete the illusion.',
      code: `import { motion } from 'framer-motion'

export function ActionButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{
        padding: '12px 28px', borderRadius: 10,
        background: 'var(--accent)', color: '#fff',
        border: 'none', cursor: 'pointer', fontSize: 14,
      }}
    >
      {children}
    </motion.button>
  )
}`,
    },
    {
      title: 'Add drag-to-dismiss card',
      description: '`drag="x"` enables horizontal dragging. `dragConstraints` sets the allowed range — `{ left: 0, right: 0 }` means the card always wants to return to center. `dragElastic` controls how far it can stretch past the constraint.',
      code: `import { motion } from 'framer-motion'

// Spring button (from step 3)
export function SpringButton({ children, onClick }) {
  return (
    <motion.button onClick={onClick}
      whileTap={{ scale: 0.94 }} whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{ padding: '12px 28px', borderRadius: 10, background: 'var(--accent)',
        color: '#fff', border: 'none', cursor: 'pointer', fontSize: 14 }}>
      {children}
    </motion.button>
  )
}

// Swipe-to-dismiss card
export function SwipeCard({ onDismiss, children }) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={(_, info) => {
        if (Math.abs(info.velocity.x) > 500 || Math.abs(info.offset.x) > 120) {
          onDismiss()
        }
      }}
      style={{ cursor: 'grab', touchAction: 'none' }}
    >
      {children}
    </motion.div>
  )
}`,
    },
  ],

  'react-native': [
    {
      title: 'Pressable with no animation',
      description: '`Pressable` is the modern RN touch element — unlike `TouchableOpacity`, it doesn\'t animate by default. This gives us full control over the feedback.',
      code: `import { Pressable, Text, StyleSheet } from 'react-native'

export function ActionButton({ children, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.btn}>
      <Text style={styles.label}>{children}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  btn:   { padding: 14, borderRadius: 12, backgroundColor: '#534AB7', alignItems: 'center' },
  label: { color: '#fff', fontSize: 14, fontWeight: '600' },
})`,
    },
    {
      title: 'Add scale with useSharedValue',
      description: '`useSharedValue(1)` creates a scale value on the UI thread. `Gesture.Tap().onBegin()` scales it down; `.onFinalize()` springs it back. This runs at 60fps without touching the JS thread.',
      code: `import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

export function ActionButton({ children, onPress }) {
  const scale = useSharedValue(1)

  const tap = Gesture.Tap()
    .onBegin(() => { scale.value = withSpring(0.94, { stiffness: 400, damping: 17 }) })
    .onFinalize(() => { scale.value = withSpring(1,    { stiffness: 400, damping: 17 }) })

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={[style, { borderRadius: 12, backgroundColor: '#534AB7' }]}>
        {children}
      </Animated.View>
    </GestureDetector>
  )
}`,
    },
    {
      title: 'Call onPress from the UI thread',
      description: '`runOnJS` bridges a JS function call back from the UI thread. Without it, calling `onPress()` inside a Reanimated gesture handler would crash — JS callbacks must be invoked with `runOnJS`.',
      code: `import { runOnJS } from 'react-native-reanimated'

const tap = Gesture.Tap()
  .onBegin(() => { scale.value = withSpring(0.94, { stiffness: 400, damping: 17 }) })
  .onFinalize(() => {
    scale.value = withSpring(1, { stiffness: 400, damping: 17 })
    if (onPress) runOnJS(onPress)()  // ← bridge back to JS thread
  })`,
    },
    {
      title: 'Add swipe-to-dismiss with Pan gesture',
      description: '`Gesture.Pan()` tracks drag movement. `onChange` updates `translateX` in real time; `onEnd` checks velocity and offset to decide whether to dismiss or snap back with `withSpring(0)`.',
      code: `import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

export function SwipeCard({ onDismiss, children }) {
  const translateX = useSharedValue(0)

  const pan = Gesture.Pan()
    .onChange(e => { translateX.value = e.translationX })
    .onEnd(e => {
      if (Math.abs(e.velocityX) > 500 || Math.abs(e.translationX) > 120) {
        translateX.value = withSpring(e.velocityX > 0 ? 400 : -400)
        runOnJS(onDismiss)()
      } else {
        translateX.value = withSpring(0)
      }
    })

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }))

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  )
}`,
    },
  ],

  flutter: [
    {
      title: 'Plain ElevatedButton',
      description: 'Flutter\'s `ElevatedButton` has a built-in ink ripple. That\'s fine for Material apps, but we want precise spring physics — so we\'ll replace it with a custom gesture widget.',
      code: `ElevatedButton(
  onPressed: () {},
  child: const Text('Press me'),
)`,
    },
    {
      title: 'GestureDetector + press state',
      description: '`GestureDetector` catches `onTapDown`, `onTapUp`, and `onTapCancel`. The `AnimationController` drives the scale — `forward()` on press, `reverse()` on release.',
      code: `class SpringButton extends StatefulWidget {
  final Widget child;
  final VoidCallback? onPressed;
  const SpringButton({required this.child, this.onPressed, super.key});
  @override State<SpringButton> createState() => _SpringButtonState();
}

class _SpringButtonState extends State<SpringButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration:        const Duration(milliseconds: 80),
      reverseDuration: const Duration(milliseconds: 300),
    );
  }

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTapDown:   (_) => _ctrl.forward(),
    onTapUp:     (_) { _ctrl.reverse(); widget.onPressed?.call(); },
    onTapCancel: ()  => _ctrl.reverse(),
    child: widget.child,
  );

  @override void dispose() { _ctrl.dispose(); super.dispose(); }
}`,
    },
    {
      title: 'Add ScaleTransition',
      description: '`ScaleTransition` drives `Transform.scale` from the animation. A `Tween(begin: 1.0, end: 0.94)` maps the 0–1 controller value to the 1–0.94 scale range. `Curves.elasticOut` on reverse gives the spring-back feel.',
      code: `@override
void initState() {
  super.initState();
  _ctrl = AnimationController(
    vsync: this,
    duration:        const Duration(milliseconds: 80),
    reverseDuration: const Duration(milliseconds: 400),
  );
  _scale = Tween<double>(begin: 1.0, end: 0.94).animate(
    CurvedAnimation(
      parent: _ctrl,
      curve:        Curves.easeIn,
      reverseCurve: Curves.elasticOut,  // ← the "spring back" feel
    ),
  );
}

// In build:
ScaleTransition(scale: _scale, child: widget.child)`,
    },
    {
      title: 'Add Dismissible for swipe',
      description: '`Dismissible` is a first-party Flutter widget that handles swipe-to-dismiss. Use `SpringButton` for tap feedback and `Dismissible` for swipe — compose them rather than re-implementing.',
      code: `// Compose SpringButton + Dismissible

// 1. Spring tap feedback (full component from step 3)
SpringButton(
  onPressed: () => print('tapped'),
  child: Container(
    padding: const EdgeInsets.all(14),
    decoration: BoxDecoration(
      color: const Color(0xFF534AB7),
      borderRadius: BorderRadius.circular(12),
    ),
    child: const Text('Press me', style: TextStyle(color: Colors.white)),
  ),
)

// 2. Swipe to dismiss (built-in widget)
Dismissible(
  key: ValueKey(item.id),
  direction: DismissDirection.horizontal,
  background: Container(color: Colors.red, alignment: Alignment.centerLeft,
    padding: const EdgeInsets.only(left: 20),
    child: const Icon(Icons.delete, color: Colors.white)),
  onDismissed: (_) => onDismiss(item),
  child: ItemCard(item: item),
)`,
    },
  ],
}

/* ─────────────────────────────────────────────────────────────────── */
/*  4. Parallax                                                         */
/* ─────────────────────────────────────────────────────────────────── */

const parallax: StepMap = {
  react: [
    {
      title: 'Static layered divs',
      description: 'Two layers — a background and foreground — stacked with `position: absolute`. No animation yet. Establish `overflow: hidden` on the container now; forgetting it causes background bleed when we add motion.',
      code: `export function ParallaxSection({ image, children }) {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: 480 }}>
      {/* Background layer */}
      <div style={{
        position: 'absolute', inset: '-10%',
        backgroundImage: \`url(\${image})\`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }} />
      {/* Foreground content */}
      <div style={{ position: 'relative', zIndex: 1, padding: '80px 40px' }}>
        {children}
      </div>
    </section>
  )
}`,
    },
    {
      title: 'Wire useScroll to the section',
      description: '`useScroll({ target: sectionRef })` creates a `scrollYProgress` MotionValue that goes from 0 (section bottom entering viewport) to 1 (section top leaving). At this stage we\'re just reading the value — no visual change yet.',
      code: `import { useRef } from 'react'
import { useScroll } from 'framer-motion'

export function ParallaxSection({ image, children }) {
  const sectionRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
    //         ↑ when section bottom hits viewport bottom (enters)
    //                    ↑ when section top hits viewport top (exits)
  })

  return (
    <section ref={sectionRef} style={{ position: 'relative', overflow: 'hidden', minHeight: 480 }}>
      {/* same markup — scroll tracked but not applied yet */}
    </section>
  )
}`,
    },
    {
      title: 'Apply motion to the background',
      description: '`useTransform` maps the 0–1 scroll range to pixel offsets. The background gets a ±40px range — small, but enough to create visible depth. Apply it via `style={{ y: bgY }}` on a `motion.div`.',
      code: `import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function ParallaxSection({ image, children }) {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef, offset: ['start end', 'end start'],
  })

  // Maps progress 0→1 to y offset -40→40
  const bgY = useTransform(scrollYProgress, [0, 1], [-40, 40])

  return (
    <section ref={sectionRef} style={{ position: 'relative', overflow: 'hidden', minHeight: 480 }}>
      <motion.div style={{
        y: bgY,
        position: 'absolute', inset: '-10%',
        backgroundImage: \`url(\${image})\`, backgroundSize: 'cover',
      }} />
      <div style={{ position: 'relative', zIndex: 1, padding: '80px 40px' }}>
        {children}
      </div>
    </section>
  )
}`,
    },
    {
      title: 'Add a foreground layer at a different speed',
      description: 'The foreground moves in the opposite direction to the background — this is what creates the perceived depth. Two layers moving at different speeds tricks the visual cortex into reading distance.',
      code: `import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function ParallaxSection({ image, children }) {
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef, offset: ['start end', 'end start'],
  })

  const bgY   = useTransform(scrollYProgress, [0, 1], [-40,  40])
  const textY = useTransform(scrollYProgress, [0, 1], [ 40, -40])
  //                                                    ↑ reversed direction = depth

  return (
    <section ref={sectionRef} style={{ position: 'relative', overflow: 'hidden', minHeight: 480 }}>
      {/* Background — moves slowly */}
      <motion.div style={{
        y: bgY, position: 'absolute', inset: '-10%',
        backgroundImage: \`url(\${image})\`, backgroundSize: 'cover',
      }} />
      {/* Foreground — moves faster in opposite direction */}
      <motion.div style={{ y: textY, position: 'relative', zIndex: 1, padding: '80px 40px' }}>
        {children}
      </motion.div>
    </section>
  )
}`,
    },
  ],

  'react-native': [
    {
      title: 'ScrollView with a header image',
      description: 'Place the hero image above the scrollable content inside a `ScrollView`. No parallax yet — just the structure. Use `overflow: hidden` on the image container to clip motion later.',
      code: `import { ScrollView, View, Image, StyleSheet } from 'react-native'

const HEADER_HEIGHT = 280

export function ParallaxScrollView({ imageSource, children }) {
  return (
    <ScrollView>
      <View style={{ height: HEADER_HEIGHT, overflow: 'hidden' }}>
        <Image source={imageSource} style={StyleSheet.absoluteFill} resizeMode="cover" />
      </View>
      <View style={{ backgroundColor: 'white', minHeight: 600 }}>
        {children}
      </View>
    </ScrollView>
  )
}`,
    },
    {
      title: 'Track scroll with Animated.event',
      description: '`Animated.event` maps `nativeEvent.contentOffset.y` directly to an `Animated.Value` — no JS bridge for every scroll frame. `scrollEventThrottle={16}` syncs at ~60fps.',
      code: `import { useRef } from 'react'
import { ScrollView, Animated } from 'react-native'

const HEADER_HEIGHT = 280

export function ParallaxScrollView({ imageSource, children }) {
  const scrollY = useRef(new Animated.Value(0)).current

  return (
    <ScrollView
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
    >
      {/* header + content */}
    </ScrollView>
  )
}`,
    },
    {
      title: 'Interpolate scrollY to translateY',
      description: '`.interpolate()` maps the scroll position to a translateY for the image. As the user scrolls down (positive Y), the image moves up at only 0.3× speed — creating the lag that reads as depth.',
      code: `const imageTranslate = scrollY.interpolate({
  inputRange:  [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
  outputRange: [ HEADER_HEIGHT * 0.5, 0, -HEADER_HEIGHT * 0.3],
  extrapolate: 'clamp',
})
//  ↑ pull-down stretches image ↑ normal ↑ scroll-up moves image slower`,
    },
    {
      title: 'Apply to Animated.Image',
      description: 'Swap the plain `Image` for `Animated.Image` and apply the interpolated transform. The header fades out as content scrolls up — combine with `headerOpacity` interpolation for the full effect.',
      code: `import { useRef } from 'react'
import { ScrollView, Animated, View, StyleSheet } from 'react-native'

const HEADER_HEIGHT = 280

export function ParallaxScrollView({ imageSource, children }) {
  const scrollY = useRef(new Animated.Value(0)).current

  const imageTranslate = scrollY.interpolate({
    inputRange: [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
    outputRange: [HEADER_HEIGHT * 0.5, 0, -HEADER_HEIGHT * 0.3],
    extrapolate: 'clamp',
  })
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT * 0.6],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  })

  return (
    <ScrollView
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: true }
      )}
      scrollEventThrottle={16}
    >
      <View style={{ height: HEADER_HEIGHT, overflow: 'hidden' }}>
        <Animated.Image
          source={imageSource}
          style={[StyleSheet.absoluteFill, { transform: [{ translateY: imageTranslate }] }]}
          resizeMode="cover"
        />
        <Animated.View style={{ opacity: headerOpacity, flex: 1, justifyContent: 'flex-end', padding: 24 }}>
          {/* overlay text */}
        </Animated.View>
      </View>
      <View style={{ backgroundColor: 'white', minHeight: 600 }}>{children}</View>
    </ScrollView>
  )
}`,
    },
  ],

  flutter: [
    {
      title: 'CustomScrollView scaffold',
      description: '`CustomScrollView` with `SliverAppBar` and `SliverToBoxAdapter` is Flutter\'s native approach to parallax headers. The `SliverAppBar` handles the collapsing behaviour.',
      code: `import 'package:flutter/material.dart';

class ParallaxScreen extends StatelessWidget {
  final String imageUrl;
  final Widget body;
  const ParallaxScreen({required this.imageUrl, required this.body, super.key});

  @override
  Widget build(BuildContext context) => CustomScrollView(
    slivers: [
      SliverAppBar(expandedHeight: 300, pinned: true,
        flexibleSpace: FlexibleSpaceBar(background: Image.network(imageUrl, fit: BoxFit.cover))),
      SliverToBoxAdapter(child: body),
    ],
  );
}`,
    },
    {
      title: 'Enable built-in parallax',
      description: '`collapseMode: CollapseMode.parallax` is all you need for Flutter\'s built-in parallax on `FlexibleSpaceBar`. The framework handles the offset math automatically.',
      code: `SliverAppBar(
  expandedHeight: 300,
  pinned: true,
  flexibleSpace: FlexibleSpaceBar(
    collapseMode: CollapseMode.parallax,  // ← one line!
    background: Image.network(imageUrl, fit: BoxFit.cover),
    title: const Text('Mountain Trail'),
    titlePadding: const EdgeInsets.only(left: 16, bottom: 16),
  ),
)`,
    },
    {
      title: 'Manual parallax with ScrollController',
      description: 'For custom parallax on non-SliverAppBar content, attach a `ScrollController` and rebuild on scroll. Multiply the offset by a factor < 1 to slow the background layer down.',
      code: `class ManualParallax extends StatefulWidget {
  final Widget child;
  const ManualParallax({required this.child, super.key});
  @override State<ManualParallax> createState() => _ManualParallaxState();
}

class _ManualParallaxState extends State<ManualParallax> {
  final _controller = ScrollController();
  double _offset = 0;

  @override
  void initState() {
    super.initState();
    _controller.addListener(() => setState(() => _offset = _controller.offset));
  }

  @override
  Widget build(BuildContext context) => Stack(children: [
    Transform.translate(
      offset: Offset(0, -_offset * 0.3), // 0.3× speed = parallax
      child: Image.network('...', fit: BoxFit.cover, height: 300, width: double.infinity),
    ),
    SingleChildScrollView(controller: _controller, child: widget.child),
  ]);

  @override void dispose() { _controller.dispose(); super.dispose(); }
}`,
    },
    {
      title: 'Wrap in a reusable widget',
      description: 'Extract into a `ParallaxImage` widget that takes `imageUrl` and `factor` props. A `factor` of 0 means the image is fixed; 1 means it scrolls at full speed (no parallax); 0.3 is a good default.',
      code: `import 'package:flutter/material.dart';

class ParallaxImage extends StatefulWidget {
  final String imageUrl;
  final double factor;
  final double height;
  const ParallaxImage({
    required this.imageUrl,
    this.factor = 0.3,
    this.height = 280,
    super.key,
  });
  @override State<ParallaxImage> createState() => _ParallaxImageState();
}

class _ParallaxImageState extends State<ParallaxImage> {
  late final ScrollController _ctrl;
  double _offset = 0;

  @override
  void initState() {
    super.initState();
    _ctrl = ScrollController()
      ..addListener(() => setState(() => _offset = _ctrl.offset));
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    height: widget.height,
    child: ClipRect(
      child: Transform.translate(
        offset: Offset(0, -_offset * widget.factor),
        child: Image.network(widget.imageUrl, fit: BoxFit.cover,
          width: double.infinity, height: widget.height * 1.4),
      ),
    ),
  );

  @override void dispose() { _ctrl.dispose(); super.dispose(); }
}`,
    },
  ],
}

/* ─────────────────────────────────────────────────────────────────── */
/*  5. Skeleton Loading                                                 */
/* ─────────────────────────────────────────────────────────────────── */

const skeletonLoading: StepMap = {
  react: [
    {
      title: 'Static gray placeholder',
      description: 'A gray rectangle the same size as the real content. This is already better than a spinner — the user can see that something is coming and where it will appear.',
      code: `export function Skeleton() {
  return (
    <div style={{
      width: '100%',
      height: 16,
      borderRadius: 6,
      background: '#2a2a2a',
    }} />
  )
}`,
    },
    {
      title: 'Add the shimmer animation',
      description: 'A `motion.div` absolutely positioned inside the skeleton sweeps from left to right using `animate={{ x: ["-100%", "100%"] }}`. The gradient creates the light-catching effect. The parent\'s `overflow: hidden` keeps it clipped.',
      code: `import { motion } from 'framer-motion'

export function Skeleton({ width = '100%', height = 16, borderRadius = 6 }) {
  return (
    <div style={{
      width, height, borderRadius,
      background: '#2a2a2a',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}`,
    },
    {
      title: 'Compose into a card skeleton',
      description: 'Build the structural skeleton of the real card — same layout, same proportions, but every element is a `<Skeleton>`. A narrow avatar, two short text lines, one long line.',
      code: `import { motion } from 'framer-motion'

function Skeleton({ width = '100%', height = 16, borderRadius = 6 }) {
  return (
    <div style={{ width, height, borderRadius, background: 'var(--bg-tertiary)',
      position: 'relative', overflow: 'hidden' }}>
      <motion.div
        style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.07), transparent)' }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export function CardSkeleton() {
  return (
    <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)',
      display: 'flex', gap: 12 }}>
      <Skeleton width={44} height={44} borderRadius={22} />  {/* avatar */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton width="55%" height={12} />   {/* name */}
        <Skeleton width="90%" height={10} />   {/* line 1 */}
        <Skeleton width="75%" height={10} />   {/* line 2 */}
      </div>
    </div>
  )
}`,
    },
    {
      title: 'Swap to real content on load',
      description: '`AnimatePresence mode="wait"` handles the skeleton → content swap. The skeleton fades out, then the real content fades in. `once` state ensures the swap only happens in one direction.',
      code: `import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export function UserCard({ userId }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUser(userId).then(setUser)
  }, [userId])

  return (
    <AnimatePresence mode="wait">
      {!user ? (
        <motion.div key="skeleton" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
          <CardSkeleton />
        </motion.div>
      ) : (
        <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}>
          <div style={{ display: 'flex', gap: 12, padding: 20 }}>
            <img src={user.avatar} style={{ width: 44, height: 44, borderRadius: 22 }} />
            <div>
              <div style={{ fontWeight: 600 }}>{user.name}</div>
              <div style={{ color: '#999' }}>{user.role}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}`,
    },
  ],

  'react-native': [
    {
      title: 'Gray View placeholder',
      description: 'A plain `View` with a gray `backgroundColor` and the same dimensions as the real content. Already better than nothing — the user sees where content will appear.',
      code: `import { View } from 'react-native'

export function Skeleton({ width, height = 16, borderRadius = 4 }) {
  return (
    <View style={{
      width: width ?? '100%',
      height,
      borderRadius,
      backgroundColor: '#1C1C1E',
    }} />
  )
}`,
    },
    {
      title: 'Add shimmer with useSharedValue',
      description: '`withRepeat(withTiming(...), -1)` loops the animation indefinitely. `-1` means infinite repeats. The value animates from -1 to 1, mapping to a translateX offset.',
      code: `import Animated, { useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated'
import { useEffect } from 'react'

export function Skeleton({ width, height = 16, borderRadius = 4 }) {
  const shimmer = useSharedValue(-1)

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1, // infinite
    )
  }, [])

  // shimmer drives translateX next step
  return <Animated.View style={{ width: width ?? '100%', height, borderRadius, backgroundColor: '#1C1C1E' }} />
}`,
    },
    {
      title: 'Apply gradient overlay',
      description: '`useAnimatedStyle` maps the shimmer value to `translateX`. A `LinearGradient` overlay moves across the surface, creating the light sweep effect.',
      code: `import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, Easing } from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'
import { View, StyleSheet } from 'react-native'
import { useEffect } from 'react'

export function Skeleton({ width, height = 16, borderRadius = 4 }: {
  width?: number | string; height?: number; borderRadius?: number
}) {
  const shimmer = useSharedValue(-1)
  useEffect(() => {
    shimmer.value = withRepeat(withTiming(1, { duration: 1500, easing: Easing.linear }), -1)
  }, [])

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shimmer.value * 200 }],
  }))

  return (
    <View style={{ width: width ?? '100%', height, borderRadius, backgroundColor: '#1C1C1E', overflow: 'hidden' }}>
      <Animated.View style={[StyleSheet.absoluteFill, animStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.08)', 'transparent']}
          start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  )
}`,
    },
    {
      title: 'Compose and swap to real content',
      description: 'Build a `CardSkeleton` using `Skeleton` primitives, then conditionally swap to the real `UserCard` when data arrives. Use Reanimated\'s `FadeIn` / `FadeOut` for the swap.',
      code: `import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

export function CardSkeleton() {
  return (
    <View style={{ padding: 16, flexDirection: 'row', gap: 12 }}>
      <Skeleton width={44} height={44} borderRadius={22} />
      <View style={{ flex: 1, gap: 8 }}>
        <Skeleton width="55%" height={12} />
        <Skeleton width="90%" height={10} />
        <Skeleton width="75%" height={10} />
      </View>
    </View>
  )
}

export function UserCard({ user }: { user: User | null }) {
  if (!user) {
    return <Animated.View exiting={FadeOut}><CardSkeleton /></Animated.View>
  }
  return (
    <Animated.View entering={FadeIn} style={{ padding: 16, flexDirection: 'row', gap: 12 }}>
      <Image source={{ uri: user.avatar }} style={{ width: 44, height: 44, borderRadius: 22 }} />
      <View>
        <Text style={{ fontWeight: '600', color: '#fff' }}>{user.name}</Text>
        <Text style={{ color: '#888' }}>{user.role}</Text>
      </View>
    </Animated.View>
  )
}`,
    },
  ],

  flutter: [
    {
      title: 'Container placeholder',
      description: 'A `Container` with a gray `decoration` and the target dimensions. Wrap in a `ClipRRect` for rounded corners — this clips the shimmer gradient we\'ll add next.',
      code: `import 'package:flutter/material.dart';

class Skeleton extends StatelessWidget {
  final double width;
  final double height;
  final double borderRadius;

  const Skeleton({
    this.width = double.infinity,
    this.height = 16,
    this.borderRadius = 4,
    super.key,
  });

  @override
  Widget build(BuildContext context) => ClipRRect(
    borderRadius: BorderRadius.circular(borderRadius),
    child: Container(
      width: width, height: height,
      color: const Color(0xFF1C1C1E),
    ),
  );
}`,
    },
    {
      title: 'Add AnimationController for shimmer',
      description: 'A looping `AnimationController` drives the shimmer position from -1.5 to 2.5 (extending beyond the widget edges so the gradient enters and exits smoothly).',
      code: `class _SkeletonState extends State<Skeleton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _shimmer;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat();
    _shimmer = Tween<double>(begin: -1.5, end: 2.5)
        .animate(CurvedAnimation(parent: _ctrl, curve: Curves.linear));
  }

  // build next...
  @override void dispose() { _ctrl.dispose(); super.dispose(); }
}`,
    },
    {
      title: 'Paint the gradient with AnimatedBuilder',
      description: '`AnimatedBuilder` rebuilds only the decorated box on each frame. The `LinearGradient`\'s `begin` and `end` alignments shift with `_shimmer.value`, moving the highlight across the surface.',
      code: `@override
Widget build(BuildContext context) => ClipRRect(
  borderRadius: BorderRadius.circular(widget.borderRadius),
  child: AnimatedBuilder(
    animation: _shimmer,
    builder: (_, __) => Container(
      width: widget.width, height: widget.height,
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment(_shimmer.value - 1, 0),
          end:   Alignment(_shimmer.value,     0),
          colors: const [
            Color(0xFF1C1C1E),
            Color(0xFF2D2D30),  // lighter midpoint = shimmer
            Color(0xFF1C1C1E),
          ],
        ),
      ),
    ),
  ),
);`,
    },
    {
      title: 'Compose and swap with AnimatedSwitcher',
      description: '`AnimatedSwitcher` handles the skeleton → real content swap with a cross-fade. The key change on the child triggers the transition. No manual `AnimationController` needed.',
      code: `import 'package:flutter/material.dart';

class CardSkeleton extends StatelessWidget {
  const CardSkeleton({super.key});
  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(16),
    child: Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const Skeleton(width: 44, height: 44, borderRadius: 22),
      const SizedBox(width: 12),
      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        const Skeleton(height: 12),
        const SizedBox(height: 8),
        Skeleton(width: MediaQuery.of(context).size.width * 0.55, height: 10),
      ])),
    ]),
  );
}

// Usage with AnimatedSwitcher
AnimatedSwitcher(
  duration: const Duration(milliseconds: 350),
  child: user == null
      ? const CardSkeleton(key: ValueKey('skeleton'))
      : UserCard(key: ValueKey('user'), user: user!),
)`,
    },
  ],
}

/* ─────────────────────────────────────────────────────────────────── */
/*  6. Stagger List                                                     */
/* ─────────────────────────────────────────────────────────────────── */

const staggerList: StepMap = {
  react: [
    {
      title: 'Plain ul/li list',
      description: 'A regular HTML list. All items render simultaneously with no transition. This is what we\'re improving — the instant pop-in feels abrupt, especially for long lists.',
      code: `const items = ['Dashboard', 'Analytics', 'Users', 'Settings', 'Billing']

export function NavList() {
  return (
    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(item => (
        <li key={item} style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg-secondary)' }}>
          {item}
        </li>
      ))}
    </ul>
  )
}`,
    },
    {
      title: 'Add opacity animation to each item',
      description: 'Swap `li` for `motion.li` with `initial={{ opacity: 0 }}` and `animate={{ opacity: 1 }}`. All items animate — but they all fade in at exactly the same time. Still no cascade.',
      code: `import { motion } from 'framer-motion'

const items = ['Dashboard', 'Analytics', 'Users', 'Settings', 'Billing']

export function NavList() {
  return (
    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(item => (
        <motion.li
          key={item}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg-secondary)' }}
        >
          {item}
        </motion.li>
      ))}
    </ul>
  )
}`,
    },
    {
      title: 'Add staggerChildren with variants',
      description: '`variants` let the parent (`motion.ul`) orchestrate its children. Setting `staggerChildren: 0.07` on the container\'s `transition` tells Framer Motion to delay each child\'s animation start by 70ms. Children don\'t need explicit delays — they inherit from the parent variant.',
      code: `import { motion } from 'framer-motion'

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}
const item = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
}

const items = ['Dashboard', 'Analytics', 'Users', 'Settings', 'Billing']

export function NavList() {
  return (
    <motion.ul
      variants={container}
      initial="hidden"
      animate="visible"
      style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {items.map(it => (
        <motion.li key={it} variants={item}
          style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg-secondary)' }}>
          {it}
        </motion.li>
      ))}
    </motion.ul>
  )
}`,
    },
    {
      title: 'Trigger on scroll with useInView',
      description: '`useInView` on the container controls when the `animate` prop switches from `"hidden"` to `"visible"`. `once: true` prevents replaying on scroll-back. The stagger still runs from the container — no per-item change needed.',
      code: `import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const item = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
}

export function NavList({ items }: { items: string[] }) {
  const ref    = useRef<HTMLUListElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.ul
      ref={ref}
      variants={container}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {items.map(it => (
        <motion.li key={it} variants={item}
          style={{ padding: '10px 14px', borderRadius: 8, background: 'var(--bg-secondary)' }}>
          {it}
        </motion.li>
      ))}
    </motion.ul>
  )
}`,
    },
  ],

  'react-native': [
    {
      title: 'FlatList with no animation',
      description: '`FlatList` virtualizes long lists — only renders what\'s visible. Always use it for lists longer than 20 items. Short lists can use a plain `View` + `map`.',
      code: `import { FlatList, Text, View, StyleSheet } from 'react-native'

const items = ['Dashboard', 'Analytics', 'Users', 'Settings', 'Billing']

export function NavList() {
  return (
    <FlatList
      data={items}
      keyExtractor={item => item}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.label}>{item}</Text>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  row:   { padding: 14, marginBottom: 8, borderRadius: 10, backgroundColor: '#1C1C1E' },
  label: { color: '#fff', fontSize: 14 },
})`,
    },
    {
      title: 'Fade in each item on mount',
      description: 'Replace the inner `View` with `Animated.View`. Use `withTiming` in `onLayout` — it fires once when each item is first rendered. All items animate simultaneously.',
      code: `import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

function NavItem({ label }: { label: string }) {
  const opacity = useSharedValue(0)
  const style   = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <Animated.View style={[style, { padding: 14, marginBottom: 8, borderRadius: 10, backgroundColor: '#1C1C1E' }]}
      onLayout={() => { opacity.value = withTiming(1, { duration: 450 }) }}>
      <Text style={{ color: '#fff', fontSize: 14 }}>{label}</Text>
    </Animated.View>
  )
}`,
    },
    {
      title: 'Add slide + stagger with withDelay',
      description: '`withDelay(index * 70, ...)` staggers each item by 70ms × its index. The `index` comes from `FlatList`\'s `renderItem` callback. Both opacity and translateY run in parallel.',
      code: `import Animated, {
  useSharedValue, useAnimatedStyle, withDelay, withTiming, Easing,
} from 'react-native-reanimated'

function NavItem({ label, index }: { label: string; index: number }) {
  const opacity    = useSharedValue(0)
  const translateY = useSharedValue(16)
  const delay      = index * 70

  function onLayout() {
    opacity.value    = withDelay(delay, withTiming(1, { duration: 450 }))
    translateY.value = withDelay(delay,
      withTiming(0, { duration: 450, easing: Easing.bezier(0.22, 1, 0.36, 1) }))
  }

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={[style, { padding: 14, marginBottom: 8, borderRadius: 10, backgroundColor: '#1C1C1E' }]}
      onLayout={onLayout}>
      <Text style={{ color: '#fff', fontSize: 14 }}>{label}</Text>
    </Animated.View>
  )
}

// In FlatList:
renderItem={({ item, index }) => <NavItem label={item} index={index} />}`,
    },
    {
      title: 'Cap delay for long lists',
      description: 'For lists with many items, an uncapped stagger makes the last item wait too long. Cap the delay at 400ms so the animation feels energetic regardless of list length.',
      code: `function NavItem({ label, index }: { label: string; index: number }) {
  const opacity    = useSharedValue(0)
  const translateY = useSharedValue(16)

  // Cap: no item waits more than 400ms to start
  const delay = Math.min(index * 70, 400)

  function onLayout() {
    opacity.value    = withDelay(delay, withTiming(1, { duration: 450 }))
    translateY.value = withDelay(delay,
      withTiming(0, { duration: 450, easing: Easing.bezier(0.22, 1, 0.36, 1) }))
  }

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={[style, { padding: 14, marginBottom: 8, borderRadius: 10, backgroundColor: '#1C1C1E' }]}
      onLayout={onLayout}>
      <Text style={{ color: '#fff', fontSize: 14 }}>{label}</Text>
    </Animated.View>
  )
}`,
    },
  ],

  flutter: [
    {
      title: 'Column of plain widgets',
      description: 'A `Column` renders all children simultaneously. Each item is a plain `Container`. This is the baseline — no animation, no cascade.',
      code: `import 'package:flutter/material.dart';

class NavList extends StatelessWidget {
  final List<String> items;
  const NavList({required this.items, super.key});

  @override
  Widget build(BuildContext context) => Column(
    children: items.map((item) => Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1C1C1E),
        borderRadius: BorderRadius.circular(10),
      ),
      child: Text(item, style: const TextStyle(color: Colors.white, fontSize: 14)),
    )).toList(),
  );
}`,
    },
    {
      title: 'Add AnimationController for a single item',
      description: 'Convert one list item to a `StatefulWidget`. A `SingleTickerProviderStateMixin` gives it access to `vsync`. The controller drives a `FadeTransition` + `SlideTransition`.',
      code: `class _NavItemState extends State<NavItem>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _fade;
  late final Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 450));
    _fade  = Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(parent: _ctrl, curve: Curves.easeOut));
    _slide = Tween<Offset>(begin: const Offset(0, 0.2), end: Offset.zero).animate(
        CurvedAnimation(parent: _ctrl, curve: Curves.easeOutCubic));
    _ctrl.forward();
  }

  @override
  Widget build(BuildContext context) => FadeTransition(
    opacity: _fade,
    child: SlideTransition(position: _slide, child: /* item content */),
  );

  @override void dispose() { _ctrl.dispose(); super.dispose(); }
}`,
    },
    {
      title: 'Stagger with a single controller + Interval',
      description: 'Move the `AnimationController` to the parent list widget. Each item uses an `Interval` to define its window within the parent\'s 0–1 timeline — this is Flutter\'s stagger pattern.',
      code: `class StaggerList extends StatefulWidget {
  final List<String> items;
  const StaggerList({required this.items, super.key});
  @override State<StaggerList> createState() => _StaggerListState();
}

class _StaggerListState extends State<StaggerList>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    final n = widget.items.length;
    _ctrl = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 300 + n * 70),
    )..forward();
  }

  @override
  Widget build(BuildContext context) => Column(
    children: List.generate(widget.items.length, (i) {
      final start = (i * 70) / (300 + widget.items.length * 70);
      final end   = (start + 450 / (300 + widget.items.length * 70)).clamp(0.0, 1.0);
      final fade  = Tween<double>(begin: 0, end: 1).animate(
          CurvedAnimation(parent: _ctrl, curve: Interval(start, end, curve: Curves.easeOut)));

      return FadeTransition(opacity: fade,
        child: Container(margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: const Color(0xFF1C1C1E), borderRadius: BorderRadius.circular(10)),
          child: Text(widget.items[i], style: const TextStyle(color: Colors.white, fontSize: 14))));
    }),
  );

  @override void dispose() { _ctrl.dispose(); super.dispose(); }
}`,
    },
    {
      title: 'Add slide + cap delay for long lists',
      description: 'Add a `SlideTransition` per item using the same `Interval`. Cap the start offset so items beyond index ~5 don\'t wait too long. Remove the raw `AnimationController` from each item — one controller rules them all.',
      code: `class _StaggerListState extends State<StaggerList>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800), // fixed, not n*70
    )..forward();
  }

  @override
  Widget build(BuildContext context) => Column(
    children: List.generate(widget.items.length, (i) {
      // Cap at index 5 so item 6+ don't lag behind
      final cappedI = i.clamp(0, 5);
      final start   = cappedI / 10.0;                        // 0, 0.1, 0.2, ... 0.5
      final end     = (start + 0.55).clamp(0.0, 1.0);

      final curve = CurvedAnimation(parent: _ctrl, curve: Interval(start, end, curve: Curves.easeOutCubic));
      final fade  = Tween<double>(begin: 0, end: 1).animate(curve);
      final slide = Tween<Offset>(begin: const Offset(0, 0.25), end: Offset.zero).animate(curve);

      return FadeTransition(opacity: fade,
        child: SlideTransition(position: slide,
          child: Container(margin: const EdgeInsets.only(bottom: 8), padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(color: const Color(0xFF1C1C1E), borderRadius: BorderRadius.circular(10)),
            child: Text(widget.items[i], style: const TextStyle(color: Colors.white, fontSize: 14)))));
    }),
  );

  @override void dispose() { _ctrl.dispose(); super.dispose(); }
}`,
    },
  ],
}

/* ─────────────────────────────────────────────────────────────────── */
/*  Export                                                              */
/* ─────────────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────────── */
/*  7. Image Carousel                                                   */
/* ─────────────────────────────────────────────────────────────────── */

const imageCarouselReact: Step[] = [
  {
    title: 'Static slides',
    description: 'Render three coloured slides in a relative container. No animation yet — just the layout foundation.',
    code: `import { useState } from 'react'

const slides = [
  { id: 'a', color: '#534AB7', label: 'Mountain Vista' },
  { id: 'b', color: '#1D9E75', label: 'Forest Trail'   },
  { id: 'c', color: '#D85A30', label: 'Ocean Sunset'   },
]

export function ImageCarousel() {
  const [page, setPage] = useState(0)
  const s = slides[page]

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: 280, borderRadius: 16,
      background: s.color, display: 'flex', alignItems: 'flex-end', padding: 20 }}>
      <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{s.label}</span>
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 5 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setPage(i)}
            style={{ width: i === page ? 20 : 6, height: 6, borderRadius: 3,
              background: '#fff', opacity: i === page ? 1 : 0.4, cursor: 'pointer',
              transition: 'width 0.2s' }} />
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    title: 'AnimatePresence + slide',
    description: 'Wrap slides in AnimatePresence so the outgoing slide exits before the next one enters. Add x-axis enter/exit so cards slide in from the correct edge.',
    code: `import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  { id: 'a', color: '#534AB7', label: 'Mountain Vista' },
  { id: 'b', color: '#1D9E75', label: 'Forest Trail'   },
  { id: 'c', color: '#D85A30', label: 'Ocean Sunset'   },
]

export function ImageCarousel() {
  const [[page, dir], setPage] = useState([0, 0])

  function go(d: number) {
    setPage(([p]) => [(p + d + slides.length) % slides.length, d])
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: 280, borderRadius: 16 }}>
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={page}
          custom={dir}
          initial={(d: number) => ({ x: d > 0 ? '100%' : '-100%' })}
          animate={{ x: 0 }}
          exit={(d: number) => ({ x: d < 0 ? '100%' : '-100%' })}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ position: 'absolute', inset: 0, background: slides[page].color,
            borderRadius: 16, display: 'flex', alignItems: 'flex-end', padding: 20 }}
        >
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{slides[page].label}</span>
        </motion.div>
      </AnimatePresence>
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 5, zIndex: 10 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => go(i - page)}
            style={{ width: i === page ? 20 : 6, height: 6, borderRadius: 3,
              background: '#fff', opacity: i === page ? 1 : 0.4, cursor: 'pointer',
              transition: 'width 0.2s' }} />
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    title: 'Scale depth + dark overlay',
    description: 'Add scale: 0.92 on enter so slides zoom in as they arrive. Add a sibling motion.div that fades from opacity 0.5 to 0, creating the cinematic dark-reveal effect.',
    code: `import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  { id: 'a', color: '#534AB7', label: 'Mountain Vista' },
  { id: 'b', color: '#1D9E75', label: 'Forest Trail'   },
  { id: 'c', color: '#D85A30', label: 'Ocean Sunset'   },
]

const variants = {
  enter:  (d: number) => ({ x: d > 0 ? '100%' : '-100%', scale: 0.92 }),
  center: { x: 0, scale: 1 },
  exit:   (d: number) => ({ x: d < 0 ? '100%' : '-100%', opacity: 0.4 }),
}

export function ImageCarousel() {
  const [[page, dir], setPage] = useState([0, 0])

  function go(d: number) {
    setPage(([p]) => [(p + d + slides.length) % slides.length, d])
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: 280, borderRadius: 16 }}>
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={page} custom={dir} variants={variants}
          initial="enter" animate="center" exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ position: 'absolute', inset: 0, background: slides[page].color,
            borderRadius: 16, display: 'flex', alignItems: 'flex-end', padding: 20 }}
        >
          {/* Overlay fades out as slide settles */}
          <motion.div
            initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} exit={{ opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: 16 }}
          />
          <span style={{ position: 'relative', color: '#fff', fontSize: 16, fontWeight: 600 }}>
            {slides[page].label}
          </span>
        </motion.div>
      </AnimatePresence>
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 5, zIndex: 10 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => go(i - page)}
            style={{ width: i === page ? 20 : 6, height: 6, borderRadius: 3,
              background: '#fff', opacity: i === page ? 1 : 0.4, cursor: 'pointer',
              transition: 'width 0.2s' }} />
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    title: 'Drag-to-swipe + spring dots',
    description: 'Add drag="x" with a velocity/offset threshold so swiping advances the carousel. Replace CSS dot transitions with motion.div animate={{ width }} springs.',
    code: `import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  { id: 'a', color: '#534AB7', label: 'Mountain Vista' },
  { id: 'b', color: '#1D9E75', label: 'Forest Trail'   },
  { id: 'c', color: '#D85A30', label: 'Ocean Sunset'   },
]

const variants = {
  enter:  (d: number) => ({ x: d > 0 ? '100%' : '-100%', scale: 0.92 }),
  center: { x: 0, scale: 1 },
  exit:   (d: number) => ({ x: d < 0 ? '100%' : '-100%', opacity: 0.4 }),
}

export function ImageCarousel() {
  const [[page, dir], setPage] = useState([0, 0])

  function go(d: number) {
    setPage(([p]) => [(p + d + slides.length) % slides.length, d])
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: 280, borderRadius: 16 }}>
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={page} custom={dir} variants={variants}
          initial="enter" animate="center" exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, { offset, velocity }) => {
            if (Math.abs(velocity.x) > 500 || Math.abs(offset.x) > 100)
              go(offset.x < 0 ? 1 : -1)
          }}
          style={{ position: 'absolute', inset: 0, background: slides[page].color,
            borderRadius: 16, cursor: 'grab', display: 'flex', alignItems: 'flex-end', padding: 20 }}
        >
          <motion.div
            initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} exit={{ opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: 16 }}
          />
          <span style={{ position: 'relative', color: '#fff', fontSize: 16, fontWeight: 600 }}>
            {slides[page].label}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Spring-animated pill dots */}
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 5, zIndex: 10 }}>
        {slides.map((_, i) => (
          <motion.div key={i} onClick={() => go(i - page)}
            animate={{ width: i === page ? 20 : 6, opacity: i === page ? 1 : 0.4 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{ height: 6, borderRadius: 3, background: '#fff', cursor: 'pointer' }}
          />
        ))}
      </div>
    </div>
  )
}`,
  },
]

const imageCarouselNextjs: Step[] = [
  {
    title: 'Static slides',
    description: "Add 'use client' at the top — drag events and useState are browser APIs. Everything else is identical to the React implementation.",
    code: `'use client'
import { useState } from 'react'

const slides = [
  { id: 'a', color: '#534AB7', label: 'Mountain Vista' },
  { id: 'b', color: '#1D9E75', label: 'Forest Trail'   },
  { id: 'c', color: '#D85A30', label: 'Ocean Sunset'   },
]

export function ImageCarousel() {
  const [page, setPage] = useState(0)
  const s = slides[page]

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: 280, borderRadius: 16,
      background: s.color, display: 'flex', alignItems: 'flex-end', padding: 20 }}>
      <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{s.label}</span>
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 5 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => setPage(i)}
            style={{ width: i === page ? 20 : 6, height: 6, borderRadius: 3,
              background: '#fff', opacity: i === page ? 1 : 0.4, cursor: 'pointer',
              transition: 'width 0.2s' }} />
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    title: 'AnimatePresence + slide',
    description: 'Import framer-motion (already client-safe). The custom prop passes direction through AnimatePresence to the variant functions.',
    code: `'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  { id: 'a', color: '#534AB7', label: 'Mountain Vista' },
  { id: 'b', color: '#1D9E75', label: 'Forest Trail'   },
  { id: 'c', color: '#D85A30', label: 'Ocean Sunset'   },
]

export function ImageCarousel() {
  const [[page, dir], setPage] = useState([0, 0])

  function go(d: number) {
    setPage(([p]) => [(p + d + slides.length) % slides.length, d])
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: 280, borderRadius: 16 }}>
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={page} custom={dir}
          initial={(d: number) => ({ x: d > 0 ? '100%' : '-100%' })}
          animate={{ x: 0 }}
          exit={(d: number) => ({ x: d < 0 ? '100%' : '-100%' })}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ position: 'absolute', inset: 0, background: slides[page].color,
            borderRadius: 16, display: 'flex', alignItems: 'flex-end', padding: 20 }}
        >
          <span style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>{slides[page].label}</span>
        </motion.div>
      </AnimatePresence>
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 5, zIndex: 10 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => go(i - page)}
            style={{ width: i === page ? 20 : 6, height: 6, borderRadius: 3,
              background: '#fff', opacity: i === page ? 1 : 0.4, cursor: 'pointer',
              transition: 'width 0.2s' }} />
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    title: 'Scale depth + dark overlay',
    description: 'Add scale: 0.92 on enter and the dark overlay motion.div. Export from components/ImageCarousel.tsx so any Server Component page can import it.',
    code: `'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  { id: 'a', color: '#534AB7', label: 'Mountain Vista' },
  { id: 'b', color: '#1D9E75', label: 'Forest Trail'   },
  { id: 'c', color: '#D85A30', label: 'Ocean Sunset'   },
]

const variants = {
  enter:  (d: number) => ({ x: d > 0 ? '100%' : '-100%', scale: 0.92 }),
  center: { x: 0, scale: 1 },
  exit:   (d: number) => ({ x: d < 0 ? '100%' : '-100%', opacity: 0.4 }),
}

export function ImageCarousel() {
  const [[page, dir], setPage] = useState([0, 0])

  function go(d: number) {
    setPage(([p]) => [(p + d + slides.length) % slides.length, d])
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: 280, borderRadius: 16 }}>
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={page} custom={dir} variants={variants}
          initial="enter" animate="center" exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          style={{ position: 'absolute', inset: 0, background: slides[page].color,
            borderRadius: 16, display: 'flex', alignItems: 'flex-end', padding: 20 }}
        >
          <motion.div
            initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} exit={{ opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: 16 }}
          />
          <span style={{ position: 'relative', color: '#fff', fontSize: 16, fontWeight: 600 }}>
            {slides[page].label}
          </span>
        </motion.div>
      </AnimatePresence>
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 5, zIndex: 10 }}>
        {slides.map((_, i) => (
          <div key={i} onClick={() => go(i - page)}
            style={{ width: i === page ? 20 : 6, height: 6, borderRadius: 3,
              background: '#fff', opacity: i === page ? 1 : 0.4, cursor: 'pointer',
              transition: 'width 0.2s' }} />
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    title: 'Drag-to-swipe + spring dots',
    description: 'Add drag="x" with velocity threshold. In Next.js App Router, place this in app/components/ — no special config needed; the "use client" boundary is self-contained.',
    code: `'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const slides = [
  { id: 'a', color: '#534AB7', label: 'Mountain Vista' },
  { id: 'b', color: '#1D9E75', label: 'Forest Trail'   },
  { id: 'c', color: '#D85A30', label: 'Ocean Sunset'   },
]

const variants = {
  enter:  (d: number) => ({ x: d > 0 ? '100%' : '-100%', scale: 0.92 }),
  center: { x: 0, scale: 1 },
  exit:   (d: number) => ({ x: d < 0 ? '100%' : '-100%', opacity: 0.4 }),
}

export function ImageCarousel() {
  const [[page, dir], setPage] = useState([0, 0])

  function go(d: number) {
    setPage(([p]) => [(p + d + slides.length) % slides.length, d])
  }

  return (
    <div style={{ position: 'relative', overflow: 'hidden', height: 280, borderRadius: 16 }}>
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={page} custom={dir} variants={variants}
          initial="enter" animate="center" exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, { offset, velocity }) => {
            if (Math.abs(velocity.x) > 500 || Math.abs(offset.x) > 100)
              go(offset.x < 0 ? 1 : -1)
          }}
          style={{ position: 'absolute', inset: 0, background: slides[page].color,
            borderRadius: 16, cursor: 'grab', display: 'flex', alignItems: 'flex-end', padding: 20 }}
        >
          <motion.div
            initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} exit={{ opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: 16 }}
          />
          <span style={{ position: 'relative', color: '#fff', fontSize: 16, fontWeight: 600 }}>
            {slides[page].label}
          </span>
        </motion.div>
      </AnimatePresence>
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 5, zIndex: 10 }}>
        {slides.map((_, i) => (
          <motion.div key={i} onClick={() => go(i - page)}
            animate={{ width: i === page ? 20 : 6, opacity: i === page ? 1 : 0.4 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{ height: 6, borderRadius: 3, background: '#fff', cursor: 'pointer' }}
          />
        ))}
      </div>
    </div>
  )
}`,
  },
]

const imageCarouselVue: Step[] = [
  {
    title: 'Static slides',
    description: 'Render slides with reactive page state. A basic click handler on the dots updates the page index. No transition yet — just establish the data and template structure.',
    code: `<template>
  <div class="carousel">
    <div class="slide" :style="{ background: slides[page].color }">
      <span class="label">{{ slides[page].label }}</span>
    </div>
    <div class="dots">
      <div v-for="(_, i) in slides" :key="i"
        class="dot" :class="{ active: i === page }"
        @click="page = i" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const slides = [
  { color: '#534AB7', label: 'Mountain Vista' },
  { color: '#1D9E75', label: 'Forest Trail'   },
  { color: '#D85A30', label: 'Ocean Sunset'   },
]

const page = ref(0)
</script>

<style scoped>
.carousel { position: relative; height: 280px; border-radius: 16px; overflow: hidden; }
.slide    { position: absolute; inset: 0; display: flex; align-items: flex-end; padding: 20px; }
.label    { color: #fff; font-size: 16px; font-weight: 600; }
.dots     { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
            display: flex; gap: 5px; z-index: 10; }
.dot      { width: 6px; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.4);
            cursor: pointer; transition: width 0.2s; }
.dot.active { width: 20px; background: white; opacity: 1; }
</style>`,
  },
  {
    title: 'Direction-aware TransitionGroup',
    description: 'Use a computed transition name ("slide-left" or "slide-right") so the incoming slide enters from the correct edge. TransitionGroup with absolute positioning lets enter and exit overlap.',
    code: `<template>
  <div class="carousel">
    <TransitionGroup :name="dir > 0 ? 'slide-left' : 'slide-right'">
      <div v-for="s in [slides[page]]" :key="page"
        class="slide" :style="{ background: s.color }">
        <span class="label">{{ s.label }}</span>
      </div>
    </TransitionGroup>
    <div class="dots">
      <div v-for="(_, i) in slides" :key="i"
        class="dot" :class="{ active: i === page }"
        @click="go(i - page)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const slides = [
  { color: '#534AB7', label: 'Mountain Vista' },
  { color: '#1D9E75', label: 'Forest Trail'   },
  { color: '#D85A30', label: 'Ocean Sunset'   },
]
const page = ref(0)
const dir  = ref(1)

function go(d: number) {
  if (d === 0) return
  dir.value  = d
  page.value = (page.value + d + slides.length) % slides.length
}
</script>

<style scoped>
.carousel { position: relative; height: 280px; border-radius: 16px; overflow: hidden; }
.slide    { position: absolute; inset: 0; display: flex; align-items: flex-end; padding: 20px; }
.label    { color: #fff; font-size: 16px; font-weight: 600; }
.dots     { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
            display: flex; gap: 5px; z-index: 10; }
.dot      { width: 6px; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.4);
            cursor: pointer; transition: width 0.2s; }
.dot.active { width: 20px; background: white; opacity: 1; }

.slide-left-enter-from, .slide-right-leave-to  { transform: translateX(100%) scale(0.92); }
.slide-left-leave-to,  .slide-right-enter-from { transform: translateX(-100%) scale(0.92); }
.slide-left-enter-active,  .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  position: absolute; width: 100%;
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s;
}
</style>`,
  },
  {
    title: 'Dark overlay via keyframe',
    description: 'Add an .overlay div inside each slide. A CSS @keyframes animation fades it from 0.4 opacity to 0 as the slide settles — the same cinematic reveal as the React version.',
    code: `<template>
  <div class="carousel">
    <TransitionGroup :name="dir > 0 ? 'slide-left' : 'slide-right'">
      <div v-for="s in [slides[page]]" :key="page"
        class="slide" :style="{ background: s.color }">
        <div class="overlay" />
        <span class="label">{{ s.label }}</span>
      </div>
    </TransitionGroup>
    <div class="dots">
      <div v-for="(_, i) in slides" :key="i"
        class="dot" :class="{ active: i === page }"
        @click="go(i - page)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const slides = [
  { color: '#534AB7', label: 'Mountain Vista' },
  { color: '#1D9E75', label: 'Forest Trail'   },
  { color: '#D85A30', label: 'Ocean Sunset'   },
]
const page = ref(0)
const dir  = ref(1)

function go(d: number) {
  if (d === 0) return
  dir.value  = d
  page.value = (page.value + d + slides.length) % slides.length
}
</script>

<style scoped>
.carousel { position: relative; height: 280px; border-radius: 16px; overflow: hidden; }
.slide    { position: absolute; inset: 0; display: flex; align-items: flex-end; padding: 20px; }
.overlay  { position: absolute; inset: 0; background: rgba(0,0,0,0.4); border-radius: 16px;
            animation: fade-overlay 0.35s ease forwards; }
.label    { position: relative; color: #fff; font-size: 16px; font-weight: 600; }
.dots     { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
            display: flex; gap: 5px; z-index: 10; }
.dot      { width: 6px; height: 6px; border-radius: 3px; background: rgba(255,255,255,0.4);
            cursor: pointer; transition: width 0.2s; }
.dot.active { width: 20px; background: white; opacity: 1; }

@keyframes fade-overlay { to { opacity: 0; } }

.slide-left-enter-from, .slide-right-leave-to  { transform: translateX(100%) scale(0.92); }
.slide-left-leave-to,  .slide-right-enter-from { transform: translateX(-100%) scale(0.92); }
.slide-left-enter-active,  .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  position: absolute; width: 100%;
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s;
}
</style>`,
  },
  {
    title: 'Touch swipe + animated dots',
    description: 'Listen for touchstart / touchend on the slide div. When the horizontal delta exceeds 50px, call go(). Animate dot width with a CSS cubic-bezier spring for the expanding pill effect.',
    code: `<template>
  <div class="carousel">
    <TransitionGroup :name="dir > 0 ? 'slide-left' : 'slide-right'">
      <div v-for="s in [slides[page]]" :key="page"
        class="slide" :style="{ background: s.color }"
        @touchstart.passive="startX = $event.touches[0].clientX"
        @touchend="onSwipe">
        <div class="overlay" />
        <span class="label">{{ s.label }}</span>
      </div>
    </TransitionGroup>

    <div class="dots">
      <div v-for="(_, i) in slides" :key="i"
        class="dot" :class="{ active: i === page }"
        :style="{ background: i === page ? '#fff' : 'rgba(255,255,255,0.4)' }"
        @click="go(i - page)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const slides = [
  { color: '#534AB7', label: 'Mountain Vista' },
  { color: '#1D9E75', label: 'Forest Trail'   },
  { color: '#D85A30', label: 'Ocean Sunset'   },
]
const page  = ref(0)
const dir   = ref(1)
let startX  = 0

function go(d: number) {
  if (d === 0) return
  dir.value  = d
  page.value = (page.value + d + slides.length) % slides.length
}

function onSwipe(e: TouchEvent) {
  const dx = startX - e.changedTouches[0].clientX
  if (Math.abs(dx) > 50) go(dx > 0 ? 1 : -1)
}
</script>

<style scoped>
.carousel { position: relative; height: 280px; border-radius: 16px; overflow: hidden; }
.slide    { position: absolute; inset: 0; display: flex; align-items: flex-end; padding: 20px; }
.overlay  { position: absolute; inset: 0; background: rgba(0,0,0,0.4); border-radius: 16px;
            animation: fade-overlay 0.35s ease forwards; }
.label    { position: relative; color: #fff; font-size: 16px; font-weight: 600; }
.dots     { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
            display: flex; gap: 5px; z-index: 10; }
.dot      { height: 6px; width: 6px; border-radius: 3px; cursor: pointer;
            transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); }
.dot.active { width: 20px; }

@keyframes fade-overlay { to { opacity: 0; } }

.slide-left-enter-from, .slide-right-leave-to  { transform: translateX(100%) scale(0.92); }
.slide-left-leave-to,  .slide-right-enter-from { transform: translateX(-100%) scale(0.92); }
.slide-left-enter-active,  .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  position: absolute; width: 100%;
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s;
}
</style>`,
  },
]

const imageCarouselRN: Step[] = [
  {
    title: 'Static slides',
    description: 'Use a FlatList with horizontal scroll and pagingEnabled for free snap-to-slide behaviour. No animation yet — just the layout foundation.',
    code: `import { View, FlatList, Text, StyleSheet, Dimensions } from 'react-native'

const { width: W } = Dimensions.get('window')

const slides = [
  { id: 'a', color: '#534AB7', label: 'Mountain Vista' },
  { id: 'b', color: '#1D9E75', label: 'Forest Trail'   },
  { id: 'c', color: '#D85A30', label: 'Ocean Sunset'   },
]

export function ImageCarousel() {
  return (
    <View style={{ height: 280 }}>
      <FlatList
        data={slides}
        keyExtractor={s => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[s.slide, { backgroundColor: item.color }]}>
            <Text style={s.label}>{item.label}</Text>
          </View>
        )}
      />
    </View>
  )
}

const s = StyleSheet.create({
  slide: { width: W, height: 280, justifyContent: 'flex-end', padding: 20 },
  label: { color: '#fff', fontSize: 16, fontWeight: '600' },
})`,
  },
  {
    title: 'Track scrollX with Animated.event',
    description: 'Swap to Animated.FlatList and pass scrollX to onScroll via Animated.event. useNativeDriver: true keeps everything on the UI thread — no JS bridge bottleneck.',
    code: `import { useRef } from 'react'
import { Animated, View, Dimensions, StyleSheet, Text } from 'react-native'

const { width: W } = Dimensions.get('window')

const slides = [
  { id: 'a', color: '#534AB7', label: 'Mountain Vista' },
  { id: 'b', color: '#1D9E75', label: 'Forest Trail'   },
  { id: 'c', color: '#D85A30', label: 'Ocean Sunset'   },
]

export function ImageCarousel() {
  const scrollX = useRef(new Animated.Value(0)).current

  return (
    <View style={{ height: 280 }}>
      <Animated.FlatList
        data={slides}
        keyExtractor={s => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[s.slide, { backgroundColor: item.color }]}>
            <Text style={s.label}>{item.label}</Text>
          </View>
        )}
      />
    </View>
  )
}

const s = StyleSheet.create({
  slide: { width: W, height: 280, justifyContent: 'flex-end', padding: 20 },
  label: { color: '#fff', fontSize: 16, fontWeight: '600' },
})`,
  },
  {
    title: 'Scale depth via interpolate',
    description: 'For each slide, interpolate scrollX over [prev, current, next] page positions → scale [0.92, 1, 0.92]. The Animated.View wraps the slide content and receives the transform.',
    code: `import { useRef } from 'react'
import { Animated, View, Dimensions, StyleSheet, Text } from 'react-native'

const { width: W } = Dimensions.get('window')

const slides = [
  { id: 'a', color: '#534AB7', label: 'Mountain Vista' },
  { id: 'b', color: '#1D9E75', label: 'Forest Trail'   },
  { id: 'c', color: '#D85A30', label: 'Ocean Sunset'   },
]

export function ImageCarousel() {
  const scrollX = useRef(new Animated.Value(0)).current

  return (
    <View style={{ height: 280 }}>
      <Animated.FlatList
        data={slides}
        keyExtractor={s => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const range = [(index - 1) * W, index * W, (index + 1) * W]
          const scale = scrollX.interpolate({
            inputRange: range, outputRange: [0.92, 1, 0.92], extrapolate: 'clamp',
          })

          return (
            <Animated.View style={[s.slide, { backgroundColor: item.color, transform: [{ scale }] }]}>
              <Text style={s.label}>{item.label}</Text>
            </Animated.View>
          )
        }}
      />
    </View>
  )
}

const s = StyleSheet.create({
  slide: { width: W, height: 280, borderRadius: 16, justifyContent: 'flex-end', padding: 20 },
  label: { color: '#fff', fontSize: 16, fontWeight: '600' },
})`,
  },
  {
    title: 'Dark overlay + animated dot indicators',
    description: 'Add an overlay View whose opacity is also interpolated from scrollX — 0.5 on neighbours, 0 on the active slide. Drive the dot width the same way for the expanding pill effect.',
    code: `import { useRef } from 'react'
import { Animated, View, StyleSheet, Dimensions, Text } from 'react-native'

const { width: W } = Dimensions.get('window')

const slides = [
  { id: 'a', color: '#534AB7', label: 'Mountain Vista' },
  { id: 'b', color: '#1D9E75', label: 'Forest Trail'   },
  { id: 'c', color: '#D85A30', label: 'Ocean Sunset'   },
]

export function ImageCarousel() {
  const scrollX = useRef(new Animated.Value(0)).current

  return (
    <View style={{ height: 280 }}>
      <Animated.FlatList
        data={slides}
        keyExtractor={s => s.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true },
        )}
        scrollEventThrottle={16}
        renderItem={({ item, index }) => {
          const range   = [(index - 1) * W, index * W, (index + 1) * W]
          const scale   = scrollX.interpolate({ inputRange: range, outputRange: [0.92, 1, 0.92], extrapolate: 'clamp' })
          const overlay = scrollX.interpolate({ inputRange: range, outputRange: [0.5, 0, 0.5],  extrapolate: 'clamp' })

          return (
            <Animated.View style={[s.slide, { backgroundColor: item.color, transform: [{ scale }] }]}>
              <Animated.View style={[StyleSheet.absoluteFill,
                { backgroundColor: 'rgba(0,0,0,0.4)', opacity: overlay, borderRadius: 16 }]} />
              <Text style={s.label}>{item.label}</Text>
            </Animated.View>
          )
        }}
      />

      <View style={s.dots}>
        {slides.map((_, i) => {
          const range   = [(i - 1) * W, i * W, (i + 1) * W]
          const width   = scrollX.interpolate({ inputRange: range, outputRange: [6, 20, 6], extrapolate: 'clamp' })
          const opacity = scrollX.interpolate({ inputRange: range, outputRange: [0.4, 1, 0.4], extrapolate: 'clamp' })
          return <Animated.View key={i} style={[s.dot, { width, opacity }]} />
        })}
      </View>
    </View>
  )
}

const s = StyleSheet.create({
  slide: { width: W, height: 280, borderRadius: 16, justifyContent: 'flex-end', padding: 20 },
  label: { color: '#fff', fontSize: 16, fontWeight: '600', position: 'relative' },
  dots:  { position: 'absolute', bottom: 12, alignSelf: 'center', flexDirection: 'row', gap: 5 },
  dot:   { height: 6, borderRadius: 3, backgroundColor: '#fff' },
})`,
  },
]

const imageCarouselFlutter: Step[] = [
  {
    title: 'Static slides',
    description: 'Use PageView.builder as the foundation. A simple StatefulWidget tracks the current page via a listener on PageController so dots can reflect position.',
    code: `import 'package:flutter/material.dart';

class ImageCarousel extends StatefulWidget {
  const ImageCarousel({super.key});
  @override State<ImageCarousel> createState() => _State();
}

class _State extends State<ImageCarousel> {
  final _ctrl = PageController();
  int _page   = 0;

  static const _slides = [
    MapEntry(Color(0xFF534AB7), 'Mountain Vista'),
    MapEntry(Color(0xFF1D9E75), 'Forest Trail'),
    MapEntry(Color(0xFFD85A30), 'Ocean Sunset'),
  ];

  @override
  void initState() {
    super.initState();
    _ctrl.addListener(() => setState(() => _page = _ctrl.page?.round() ?? 0));
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    height: 280,
    child: PageView.builder(
      controller: _ctrl,
      itemCount: _slides.length,
      itemBuilder: (_, i) => Container(
        color: _slides[i].key,
        alignment: Alignment.bottomLeft,
        padding: const EdgeInsets.all(20),
        child: Text(_slides[i].value,
          style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
      ),
    ),
  );

  @override void dispose() { _ctrl.dispose(); super.dispose(); }
}`,
  },
  {
    title: 'Dot indicators',
    description: 'Add a Stack to overlay dot indicators. Use AnimatedContainer so each dot\'s width animates between 6 and 20 as _page changes.',
    code: `import 'package:flutter/material.dart';

class ImageCarousel extends StatefulWidget {
  const ImageCarousel({super.key});
  @override State<ImageCarousel> createState() => _State();
}

class _State extends State<ImageCarousel> {
  final _ctrl = PageController();
  int _page   = 0;

  static const _slides = [
    MapEntry(Color(0xFF534AB7), 'Mountain Vista'),
    MapEntry(Color(0xFF1D9E75), 'Forest Trail'),
    MapEntry(Color(0xFFD85A30), 'Ocean Sunset'),
  ];

  @override
  void initState() {
    super.initState();
    _ctrl.addListener(() => setState(() => _page = _ctrl.page?.round() ?? 0));
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    height: 280,
    child: Stack(children: [
      PageView.builder(
        controller: _ctrl,
        itemCount: _slides.length,
        itemBuilder: (_, i) => Container(
          decoration: BoxDecoration(color: _slides[i].key, borderRadius: BorderRadius.circular(16)),
          alignment: Alignment.bottomLeft,
          padding: const EdgeInsets.all(20),
          child: Text(_slides[i].value,
            style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
        ),
      ),
      // Animated dot row
      Positioned(
        bottom: 12, left: 0, right: 0,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_slides.length, (i) => AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            margin: const EdgeInsets.symmetric(horizontal: 2.5),
            width:  _page == i ? 20.0 : 6.0,
            height: 6,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(_page == i ? 1.0 : 0.4),
              borderRadius: BorderRadius.circular(3)),
          )),
        ),
      ),
    ]),
  );

  @override void dispose() { _ctrl.dispose(); super.dispose(); }
}`,
  },
  {
    title: 'Scale depth via PageController.page',
    description: 'Use a fractional PageController listener to get the continuous page value. Compute dist = (page - index).abs() and map it to scale = 1.0 - dist * 0.08 inside itemBuilder.',
    code: `import 'package:flutter/material.dart';

class ImageCarousel extends StatefulWidget {
  const ImageCarousel({super.key});
  @override State<ImageCarousel> createState() => _State();
}

class _State extends State<ImageCarousel> {
  // viewportFraction < 1 shows peeking neighbours — remove for full-bleed
  final _ctrl = PageController(viewportFraction: 0.92);
  double _page = 0;

  static const _slides = [
    MapEntry(Color(0xFF534AB7), 'Mountain Vista'),
    MapEntry(Color(0xFF1D9E75), 'Forest Trail'),
    MapEntry(Color(0xFFD85A30), 'Ocean Sunset'),
  ];

  @override
  void initState() {
    super.initState();
    // Continuous fractional page value drives scale
    _ctrl.addListener(() => setState(() => _page = _ctrl.page ?? 0));
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    height: 280,
    child: Stack(children: [
      PageView.builder(
        controller: _ctrl,
        itemCount: _slides.length,
        itemBuilder: (_, i) {
          final dist  = (_page - i).abs().clamp(0.0, 1.0);
          final scale = 1.0 - dist * 0.08;

          return Transform.scale(
            scale: scale,
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              decoration: BoxDecoration(color: _slides[i].key, borderRadius: BorderRadius.circular(16)),
              alignment: Alignment.bottomLeft,
              padding: const EdgeInsets.all(20),
              child: Text(_slides[i].value,
                style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600)),
            ),
          );
        },
      ),
      Positioned(
        bottom: 12, left: 0, right: 0,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_slides.length, (i) => AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            margin: const EdgeInsets.symmetric(horizontal: 2.5),
            width: _page.round() == i ? 20.0 : 6.0, height: 6,
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(_page.round() == i ? 1.0 : 0.4),
              borderRadius: BorderRadius.circular(3)),
          )),
        ),
      ),
    ]),
  );

  @override void dispose() { _ctrl.dispose(); super.dispose(); }
}`,
  },
  {
    title: 'Dark overlay fading out',
    description: 'Add a second layer inside each slide — a Container with Colors.black.withOpacity(dist * 0.5). As dist approaches 0 (active slide), the overlay becomes transparent. No extra packages needed.',
    code: `import 'package:flutter/material.dart';

class ImageCarousel extends StatefulWidget {
  const ImageCarousel({super.key});
  @override State<ImageCarousel> createState() => _State();
}

class _State extends State<ImageCarousel> {
  final _ctrl = PageController(viewportFraction: 0.92);
  double _page = 0;

  static const _slides = [
    MapEntry(Color(0xFF534AB7), 'Mountain Vista'),
    MapEntry(Color(0xFF1D9E75), 'Forest Trail'),
    MapEntry(Color(0xFFD85A30), 'Ocean Sunset'),
  ];

  @override
  void initState() {
    super.initState();
    _ctrl.addListener(() => setState(() => _page = _ctrl.page ?? 0));
  }

  @override
  Widget build(BuildContext context) => SizedBox(
    height: 280,
    child: Stack(children: [
      PageView.builder(
        controller: _ctrl,
        itemCount: _slides.length,
        itemBuilder: (_, i) {
          final dist    = (_page - i).abs().clamp(0.0, 1.0);
          final scale   = 1.0 - dist * 0.08;
          final overlay = dist * 0.5; // 0 when active, 0.5 on neighbours

          return Transform.scale(
            scale: scale,
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 4),
              decoration: BoxDecoration(color: _slides[i].key, borderRadius: BorderRadius.circular(16)),
              child: Stack(children: [
                // Dark overlay fades out as slide becomes active
                Container(decoration: BoxDecoration(
                  color: Colors.black.withOpacity(overlay),
                  borderRadius: BorderRadius.circular(16))),
                Positioned(bottom: 20, left: 20,
                  child: Text(_slides[i].value,
                    style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600))),
              ]),
            ),
          );
        },
      ),
      Positioned(
        bottom: 12, left: 0, right: 0,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_slides.length, (i) => GestureDetector(
            onTap: () => _ctrl.animateToPage(i,
              duration: const Duration(milliseconds: 350), curve: Curves.easeOut),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              margin: const EdgeInsets.symmetric(horizontal: 2.5),
              width: _page.round() == i ? 20.0 : 6.0, height: 6,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(_page.round() == i ? 1.0 : 0.4),
                borderRadius: BorderRadius.circular(3)),
            ),
          )),
        ),
      ),
    ]),
  );

  @override void dispose() { _ctrl.dispose(); super.dispose(); }
}`,
  },
]

const imageCarousel: StepMap = {
  react:          imageCarouselReact,
  nextjs:         imageCarouselNextjs,
  vue:            imageCarouselVue,
  'react-native': imageCarouselRN,
  flutter:        imageCarouselFlutter,
}

/* ─────────────────────────────────────────────────────────────────── */
/*  8. Onboarding Flow                                                  */
/* ─────────────────────────────────────────────────────────────────── */

const onboardingFlowReact: Step[] = [
  {
    title: 'Static screens',
    description: 'Render a single screen with an icon, title, and body. Add a basic step counter and Next button — no animation yet.',
    code: `import { useState } from 'react'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const s = screens[step]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: s.color }} />
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 400 }}>{s.title}</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#666', textAlign: 'center', maxWidth: 220 }}>{s.body}</p>
      </div>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 18 }}>
        {screens.map((_, i) => (
          <div key={i} style={{ width: i === step ? 20 : 8, height: 8, borderRadius: 4,
            background: i === step ? s.color : 'rgba(0,0,0,0.2)', transition: 'all 0.2s' }} />
        ))}
      </div>
      <button onClick={() => step < screens.length - 1 && setStep(s => s + 1)}
        style={{ padding: 10, borderRadius: 10, border: 'none', background: s.color,
          color: '#fff', fontSize: 13, cursor: 'pointer' }}>
        {step === screens.length - 1 ? 'Get started →' : 'Next →'}
      </button>
    </div>
  )
}`,
  },
  {
    title: 'AnimatePresence crossfade',
    description: 'Wrap the screen content in AnimatePresence mode="wait" so the exiting screen fades out before the entering one fades in. Key by step so changing it triggers the animation.',
    code: `import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const s = screens[step]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24 }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: s.color }} />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 400 }}>{s.title}</h2>
            <p style={{ margin: 0, fontSize: 13, color: '#666', textAlign: 'center', maxWidth: 220 }}>{s.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 18 }}>
        {screens.map((_, i) => (
          <div key={i} style={{ width: i === step ? 20 : 8, height: 8, borderRadius: 4,
            background: i === step ? s.color : 'rgba(0,0,0,0.2)', transition: 'all 0.2s' }} />
        ))}
      </div>
      <button onClick={() => step < screens.length - 1 && setStep(s => s + 1)}
        style={{ padding: 10, borderRadius: 10, border: 'none', background: s.color,
          color: '#fff', fontSize: 13, cursor: 'pointer' }}>
        {step === screens.length - 1 ? 'Get started →' : 'Next →'}
      </button>
    </div>
  )
}`,
  },
  {
    title: 'Slide + icon pop',
    description: 'Replace the fade with a slide-in from the right and slide-out to the left. Add a delayed scale animation on the icon so it "pops" in after the container settles.',
    code: `import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const s = screens[step]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24 }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            {/* Icon pops in 100ms after container */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 64, height: 64, borderRadius: 20, background: s.color }}
            />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 400 }}>{s.title}</h2>
            <p style={{ margin: 0, fontSize: 13, color: '#666', textAlign: 'center', maxWidth: 220 }}>{s.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 18 }}>
        {screens.map((_, i) => (
          <div key={i} style={{ width: i === step ? 20 : 8, height: 8, borderRadius: 4,
            background: i === step ? s.color : 'rgba(0,0,0,0.2)', transition: 'all 0.2s' }} />
        ))}
      </div>
      <button onClick={() => step < screens.length - 1 && setStep(s => s + 1)}
        style={{ padding: 10, borderRadius: 10, border: 'none', background: s.color,
          color: '#fff', fontSize: 13, cursor: 'pointer' }}>
        {step === screens.length - 1 ? 'Get started →' : 'Next →'}
      </button>
    </div>
  )
}`,
  },
  {
    title: 'Spring dots + Back button',
    description: 'Replace CSS dot transitions with motion.div spring-animated width. Add the Back button and a whileTap on the Next button for haptic-feel feedback.',
    code: `import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const s = screens[step]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24 }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 64, height: 64, borderRadius: 20, background: s.color }}
            />
            <h2 style={{ margin: 0, fontFamily: 'var(--font-power)', fontSize: 20,
              fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{s.title}</h2>
            <p style={{ margin: 0, fontFamily: 'var(--font-outfit)', fontSize: 13,
              color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, maxWidth: 220 }}>{s.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Spring pill dots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 18 }}>
        {screens.map((_, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            animate={{ width: i === step ? 24 : 8, opacity: i === step ? 1 : 0.3, background: s.color }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{ height: 8, borderRadius: 4, cursor: 'pointer' }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            flex: 1, padding: 10, borderRadius: 10, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-secondary)', fontSize: 13, cursor: 'pointer',
          }}>Back</button>
        )}
        <motion.button whileTap={{ scale: 0.97 }}
          onClick={() => step < screens.length - 1 && setStep(s => s + 1)}
          style={{ flex: 1, padding: 10, borderRadius: 10, border: 'none',
            background: s.color, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          {step === screens.length - 1 ? 'Get started →' : 'Next →'}
        </motion.button>
      </div>
    </div>
  )
}`,
  },
]

const onboardingFlowNextjs: Step[] = [
  {
    title: "Static screens",
    description: "Add 'use client' — useState requires the browser. Export from a dedicated component file so it can be imported into any Server Component page.",
    code: `'use client'
import { useState } from 'react'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const s = screens[step]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24 }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 14 }}>
        <div style={{ width: 64, height: 64, borderRadius: 20, background: s.color }} />
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{s.title}</h2>
        <p style={{ margin: 0, fontSize: 13, color: '#666', textAlign: 'center', maxWidth: 220 }}>{s.body}</p>
      </div>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 18 }}>
        {screens.map((_, i) => (
          <div key={i} style={{ width: i === step ? 20 : 8, height: 8, borderRadius: 4,
            background: i === step ? s.color : 'rgba(0,0,0,0.2)', transition: 'all 0.2s' }} />
        ))}
      </div>
      <button onClick={() => step < screens.length - 1 && setStep(s => s + 1)}
        style={{ padding: 10, borderRadius: 10, border: 'none', background: s.color,
          color: '#fff', fontSize: 13, cursor: 'pointer' }}>
        {step === screens.length - 1 ? 'Get started →' : 'Next →'}
      </button>
    </div>
  )
}

// In any Server Component:
// import { OnboardingFlow } from '@/components/OnboardingFlow'`,
  },
  {
    title: 'AnimatePresence crossfade',
    description: 'AnimatePresence mode="wait" works identically in Next.js — framer-motion is client-safe once the use client boundary is declared.',
    code: `'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const s = screens[step]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24 }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <div style={{ width: 64, height: 64, borderRadius: 20, background: s.color }} />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{s.title}</h2>
            <p style={{ margin: 0, fontSize: 13, color: '#666', textAlign: 'center', maxWidth: 220 }}>{s.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 18 }}>
        {screens.map((_, i) => (
          <div key={i} style={{ width: i === step ? 20 : 8, height: 8, borderRadius: 4,
            background: i === step ? s.color : 'rgba(0,0,0,0.2)', transition: 'all 0.2s' }} />
        ))}
      </div>
      <button onClick={() => step < screens.length - 1 && setStep(s => s + 1)}
        style={{ padding: 10, borderRadius: 10, border: 'none', background: s.color,
          color: '#fff', fontSize: 13, cursor: 'pointer' }}>
        {step === screens.length - 1 ? 'Get started →' : 'Next →'}
      </button>
    </div>
  )
}`,
  },
  {
    title: 'Slide + icon pop',
    description: 'Add x-axis slide and the delayed icon scale animation. The cubiz-bezier ease ([0.22,1,0.36,1]) is the same deceleration curve used across the rest of the UI for visual coherence.',
    code: `'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const s = screens[step]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24 }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 64, height: 64, borderRadius: 20, background: s.color }}
            />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{s.title}</h2>
            <p style={{ margin: 0, fontSize: 13, color: '#666', textAlign: 'center', maxWidth: 220 }}>{s.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 18 }}>
        {screens.map((_, i) => (
          <div key={i} style={{ width: i === step ? 20 : 8, height: 8, borderRadius: 4,
            background: i === step ? s.color : 'rgba(0,0,0,0.2)', transition: 'all 0.2s' }} />
        ))}
      </div>
      <button onClick={() => step < screens.length - 1 && setStep(s => s + 1)}
        style={{ padding: 10, borderRadius: 10, border: 'none', background: s.color,
          color: '#fff', fontSize: 13, cursor: 'pointer' }}>
        {step === screens.length - 1 ? 'Get started →' : 'Next →'}
      </button>
    </div>
  )
}`,
  },
  {
    title: 'Spring dots + Back button',
    description: 'Add motion.div spring-animated dots and the Back button. TypeScript generics work normally inside "use client" components.',
    code: `'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const s = screens[step]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24 }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div key={step}
            initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 64, height: 64, borderRadius: 20, background: s.color }}
            />
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{s.title}</h2>
            <p style={{ margin: 0, fontSize: 13, color: '#666', textAlign: 'center', maxWidth: 220 }}>{s.body}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 18 }}>
        {screens.map((_, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            animate={{ width: i === step ? 24 : 8, opacity: i === step ? 1 : 0.3, background: s.color }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{ height: 8, borderRadius: 4, cursor: 'pointer' }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            flex: 1, padding: 10, borderRadius: 10, border: '1px solid #ddd',
            background: 'transparent', fontSize: 13, cursor: 'pointer' }}>Back</button>
        )}
        <motion.button whileTap={{ scale: 0.97 }}
          onClick={() => step < screens.length - 1 && setStep(s => s + 1)}
          style={{ flex: 1, padding: 10, borderRadius: 10, border: 'none',
            background: s.color, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          {step === screens.length - 1 ? 'Get started →' : 'Next →'}
        </motion.button>
      </div>
    </div>
  )
}`,
  },
]

const onboardingFlowVue: Step[] = [
  {
    title: 'Static screens',
    description: 'Render one screen at a time using v-if or computed properties. Use reactive step state and a basic button to advance.',
    code: `<template>
  <div class="ob">
    <div class="content">
      <div class="icon" :style="{ background: current.color }" />
      <h2>{{ current.title }}</h2>
      <p>{{ current.body }}</p>
    </div>
    <div class="dots">
      <div v-for="(_, i) in screens" :key="i" class="dot" :class="{ active: i === step }" />
    </div>
    <button class="next" :style="{ background: current.color }" @click="advance">
      {{ step === screens.length - 1 ? 'Get started →' : 'Next →' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

const step    = ref(0)
const current = computed(() => screens[step.value])

function advance() {
  if (step.value < screens.length - 1) step.value++
}
</script>

<style scoped>
.ob      { height: 100%; display: flex; flex-direction: column; padding: 24px; }
.content { flex: 1; display: flex; flex-direction: column; align-items: center;
           justify-content: center; gap: 14px; }
.icon    { width: 64px; height: 64px; border-radius: 20px; }
h2       { margin: 0; font-size: 20px; font-weight: 700; }
p        { margin: 0; font-size: 13px; color: #666; text-align: center; max-width: 220px; }
.dots    { display: flex; gap: 5px; justify-content: center; margin-bottom: 18px; }
.dot     { width: 8px; height: 8px; border-radius: 4px; background: rgba(0,0,0,0.2);
           transition: all 0.2s; }
.dot.active { width: 20px; }
.next    { padding: 10px; border-radius: 10px; border: none; color: #fff;
           font-size: 13px; cursor: pointer; }
</style>`,
  },
  {
    title: 'Transition mode="out-in" crossfade',
    description: 'Wrap the screen content in <Transition mode="out-in"> and key it by step. Vue unmounts the old screen completely before mounting the new one — identical to AnimatePresence mode="wait".',
    code: `<template>
  <div class="ob">
    <div class="content-wrap">
      <Transition name="fade" mode="out-in">
        <div :key="step" class="content">
          <div class="icon" :style="{ background: current.color }" />
          <h2>{{ current.title }}</h2>
          <p>{{ current.body }}</p>
        </div>
      </Transition>
    </div>
    <div class="dots">
      <div v-for="(_, i) in screens" :key="i" class="dot" :class="{ active: i === step }" />
    </div>
    <button class="next" :style="{ background: current.color }" @click="advance">
      {{ step === screens.length - 1 ? 'Get started →' : 'Next →' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]
const step    = ref(0)
const current = computed(() => screens[step.value])
function advance() { if (step.value < screens.length - 1) step.value++ }
</script>

<style scoped>
.ob           { height: 100%; display: flex; flex-direction: column; padding: 24px; }
.content-wrap { flex: 1; position: relative; overflow: hidden; }
.content      { position: absolute; inset: 0; display: flex; flex-direction: column;
                align-items: center; justify-content: center; gap: 14px; }
.icon         { width: 64px; height: 64px; border-radius: 20px; }
h2            { margin: 0; font-size: 20px; font-weight: 700; }
p             { margin: 0; font-size: 13px; color: #666; text-align: center; max-width: 220px; }
.dots         { display: flex; gap: 5px; justify-content: center; margin-bottom: 18px; }
.dot          { width: 8px; height: 8px; border-radius: 4px; background: rgba(0,0,0,0.2); transition: all 0.2s; }
.dot.active   { width: 20px; }
.next         { padding: 10px; border-radius: 10px; border: none; color: #fff; font-size: 13px; cursor: pointer; }

.fade-enter-from, .fade-leave-to   { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.25s; }
</style>`,
  },
  {
    title: 'Slide direction + icon pop',
    description: 'Switch from fade to a slide transition. Track the direction in a ref and update it before changing step so the transition name picks the correct CSS class.',
    code: `<template>
  <div class="ob">
    <div class="content-wrap">
      <Transition :name="dir > 0 ? 'slide-left' : 'slide-right'" mode="out-in">
        <div :key="step" class="content">
          <!-- Icon pop via CSS animation keyed to step -->
          <div class="icon" :style="{ background: current.color }" :key="'icon-' + step" />
          <h2>{{ current.title }}</h2>
          <p>{{ current.body }}</p>
        </div>
      </Transition>
    </div>
    <div class="dots">
      <div v-for="(_, i) in screens" :key="i" class="dot" :class="{ active: i === step }"
        :style="{ background: i === step ? current.color : undefined }" @click="go(i)" />
    </div>
    <div class="nav">
      <button v-if="step > 0" class="back" @click="go(step - 1)">Back</button>
      <button class="next" :style="{ background: current.color }" @click="go(step + 1)">
        {{ step === screens.length - 1 ? 'Get started →' : 'Next →' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]
const step    = ref(0)
const dir     = ref(1)
const current = computed(() => screens[step.value])

function go(i: number) {
  if (i < 0 || i >= screens.length) return
  dir.value  = i > step.value ? 1 : -1
  step.value = i
}
</script>

<style scoped>
.ob           { height: 100%; display: flex; flex-direction: column; padding: 24px; }
.content-wrap { flex: 1; position: relative; overflow: hidden; }
.content      { position: absolute; inset: 0; display: flex; flex-direction: column;
                align-items: center; justify-content: center; gap: 14px; }
.icon         { width: 64px; height: 64px; border-radius: 20px; animation: pop 0.35s cubic-bezier(0.22,1,0.36,1); }
.nav          { display: flex; gap: 8px; }
.back         { flex: 1; padding: 10px; border-radius: 10px; border: 1px solid #ddd;
                background: transparent; font-size: 13px; cursor: pointer; }
.next         { flex: 1; padding: 10px; border-radius: 10px; border: none; color: #fff;
                font-size: 13px; cursor: pointer; }
.dots         { display: flex; gap: 6px; justify-content: center; margin-bottom: 18px; }
.dot          { height: 8px; width: 8px; border-radius: 4px; background: rgba(0,0,0,0.2);
                cursor: pointer; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.dot.active   { width: 24px; }
h2            { margin: 0; font-size: 20px; font-weight: 700; }
p             { margin: 0; font-size: 13px; color: #666; text-align: center; max-width: 220px; }

@keyframes pop { from { transform: scale(0.7); opacity: 0; } to { transform: scale(1); opacity: 1; } }

.slide-left-enter-from  { opacity: 0; transform: translateX(32px); }
.slide-left-leave-to    { opacity: 0; transform: translateX(-32px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-32px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(32px); }
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  position: absolute; width: 100%;
  transition: opacity 0.28s cubic-bezier(0.22,1,0.36,1), transform 0.28s cubic-bezier(0.22,1,0.36,1);
}
</style>`,
  },
  {
    title: 'Animated pill dots',
    description: 'The active dot already transitions width via CSS. Match the dot color to the active screen color reactively — bind :style with the current color when active.',
    code: `<template>
  <div class="ob">
    <div class="content-wrap">
      <Transition :name="dir > 0 ? 'slide-left' : 'slide-right'" mode="out-in">
        <div :key="step" class="content">
          <div class="icon" :style="{ background: current.color }" :key="'icon-' + step" />
          <h2>{{ current.title }}</h2>
          <p>{{ current.body }}</p>
        </div>
      </Transition>
    </div>

    <!-- Dots: active dot expands to 24px and matches screen color -->
    <div class="dots">
      <div v-for="(s, i) in screens" :key="i"
        class="dot" :class="{ active: i === step }"
        :style="i === step ? { background: s.color, opacity: '1' } : {}"
        @click="go(i)" />
    </div>

    <div class="nav">
      <button v-if="step > 0" class="back" @click="go(step - 1)">Back</button>
      <button class="next" :style="{ background: current.color }" @click="go(step + 1)">
        {{ step === screens.length - 1 ? 'Get started →' : 'Next →' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]
const step    = ref(0)
const dir     = ref(1)
const current = computed(() => screens[step.value])

function go(i: number) {
  if (i < 0 || i >= screens.length) return
  dir.value  = i > step.value ? 1 : -1
  step.value = i
}
</script>

<style scoped>
.ob           { height: 100%; display: flex; flex-direction: column; padding: 24px; }
.content-wrap { flex: 1; position: relative; overflow: hidden; }
.content      { position: absolute; inset: 0; display: flex; flex-direction: column;
                align-items: center; justify-content: center; gap: 14px; }
.icon         { width: 64px; height: 64px; border-radius: 20px;
                animation: pop 0.35s 0.1s cubic-bezier(0.22,1,0.36,1) both; }
.dots         { display: flex; gap: 6px; justify-content: center; margin-bottom: 18px; }
.dot          { height: 8px; width: 8px; border-radius: 4px; background: rgba(0,0,0,0.2);
                opacity: 0.3; cursor: pointer;
                transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); }
.dot.active   { width: 24px; }
.nav          { display: flex; gap: 8px; }
.back         { flex: 1; padding: 10px; border-radius: 10px; border: 1px solid #ddd;
                background: transparent; font-size: 13px; cursor: pointer; }
.next         { flex: 1; padding: 10px; border-radius: 10px; border: none; color: #fff;
                font-size: 13px; font-weight: 500; cursor: pointer; }
h2            { margin: 0; font-size: 20px; font-weight: 700; }
p             { margin: 0; font-size: 13px; color: #666; text-align: center; max-width: 220px; }

@keyframes pop { from { transform: scale(0.7); opacity: 0; } }

.slide-left-enter-from  { opacity: 0; transform: translateX(32px); }
.slide-left-leave-to    { opacity: 0; transform: translateX(-32px); }
.slide-right-enter-from { opacity: 0; transform: translateX(-32px); }
.slide-right-leave-to   { opacity: 0; transform: translateX(32px); }
.slide-left-enter-active,  .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  position: absolute; width: 100%;
  transition: opacity 0.28s cubic-bezier(0.22,1,0.36,1), transform 0.28s cubic-bezier(0.22,1,0.36,1);
}
</style>`,
  },
]

const onboardingFlowRN: Step[] = [
  {
    title: 'Static screens',
    description: 'Show one screen at a time using state. Use StyleSheet.absoluteFillObject so screens overlap in the same parent View — this is the container we will animate into.',
    code: `import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const s = screens[step]

  return (
    <View style={st.root}>
      <View style={st.content}>
        <View style={[st.icon, { backgroundColor: s.color }]} />
        <Text style={st.title}>{s.title}</Text>
        <Text style={st.body}>{s.body}</Text>
      </View>
      <View style={st.dots}>
        {screens.map((_, i) => (
          <View key={i} style={[st.dot, i === step && st.dotActive]} />
        ))}
      </View>
      <Pressable style={[st.next, { backgroundColor: s.color }]}
        onPress={() => step < screens.length - 1 && setStep(n => n + 1)}>
        <Text style={st.nextTxt}>{step === screens.length - 1 ? 'Get started →' : 'Next →'}</Text>
      </Pressable>
    </View>
  )
}

const st = StyleSheet.create({
  root:     { flex: 1, padding: 24 },
  content:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },
  icon:     { width: 64, height: 64, borderRadius: 20 },
  title:    { fontSize: 20, fontWeight: '700' },
  body:     { fontSize: 13, color: '#666', textAlign: 'center', maxWidth: 220 },
  dots:     { flexDirection: 'row', justifyContent: 'center', gap: 5, marginBottom: 18 },
  dot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.2)' },
  dotActive:{ width: 20 },
  next:     { padding: 10, borderRadius: 10, alignItems: 'center' },
  nextTxt:  { color: '#fff', fontSize: 13, fontWeight: '500' },
})`,
  },
  {
    title: 'FadeIn / FadeOut from Reanimated',
    description: 'Add the Animated.View key prop — Reanimated detects the key change, runs FadeOut on the old screen, then FadeIn on the new one. No explicit AnimatePresence equivalent needed.',
    code: `import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const s = screens[step]

  return (
    <View style={st.root}>
      <View style={st.contentWrap}>
        {/* Key change triggers FadeOut → FadeIn sequence */}
        <Animated.View key={step}
          entering={FadeIn.duration(280)}
          exiting={FadeOut.duration(180)}
          style={st.content}>
          <View style={[st.icon, { backgroundColor: s.color }]} />
          <Text style={st.title}>{s.title}</Text>
          <Text style={st.body}>{s.body}</Text>
        </Animated.View>
      </View>
      <View style={st.dots}>
        {screens.map((_, i) => (
          <View key={i} style={[st.dot, i === step && { width: 20 }]} />
        ))}
      </View>
      <Pressable style={[st.next, { backgroundColor: s.color }]}
        onPress={() => step < screens.length - 1 && setStep(n => n + 1)}>
        <Text style={st.nextTxt}>{step === screens.length - 1 ? 'Get started →' : 'Next →'}</Text>
      </Pressable>
    </View>
  )
}

const st = StyleSheet.create({
  root:        { flex: 1, padding: 24 },
  contentWrap: { flex: 1 },
  content:     { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: 14 },
  icon:        { width: 64, height: 64, borderRadius: 20 },
  title:       { fontSize: 20, fontWeight: '700' },
  body:        { fontSize: 13, color: '#666', textAlign: 'center', maxWidth: 220 },
  dots:        { flexDirection: 'row', justifyContent: 'center', gap: 5, marginBottom: 18 },
  dot:         { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.2)' },
  next:        { padding: 10, borderRadius: 10, alignItems: 'center' },
  nextTxt:     { color: '#fff', fontSize: 13, fontWeight: '500' },
})`,
  },
  {
    title: 'Slide direction + icon scale',
    description: 'Replace FadeIn with SlideInRight / SlideOutLeft (and the reverse on Back). Chain with .springify() to match the ease curve. Add a separate ScaleIn on the icon with a 100ms delay.',
    code: `import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  SlideInRight, SlideInLeft, SlideOutRight, SlideOutLeft, ZoomIn,
} from 'react-native-reanimated'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep]   = useState(0)
  const [dir,  setDir]    = useState<1 | -1>(1)
  const s = screens[step]

  function go(d: 1 | -1) {
    const next = step + d
    if (next < 0 || next >= screens.length) return
    setDir(d)
    setStep(next)
  }

  return (
    <View style={st.root}>
      <View style={st.contentWrap}>
        <Animated.View key={step}
          entering={(dir > 0 ? SlideInRight : SlideInLeft).springify().damping(20)}
          exiting={(dir > 0 ? SlideOutLeft : SlideOutRight).duration(200)}
          style={st.content}>
          {/* Icon pops in after the screen settles */}
          <Animated.View key={step + '-icon'} entering={ZoomIn.delay(100).springify()}
            style={[st.icon, { backgroundColor: s.color }]} />
          <Text style={st.title}>{s.title}</Text>
          <Text style={st.body}>{s.body}</Text>
        </Animated.View>
      </View>
      <View style={st.dots}>
        {screens.map((_, i) => (
          <View key={i} style={[st.dot, i === step && { width: 20 }]} />
        ))}
      </View>
      <View style={st.nav}>
        {step > 0 && (
          <Pressable style={st.back} onPress={() => go(-1)}>
            <Text style={st.backTxt}>Back</Text>
          </Pressable>
        )}
        <Pressable style={[st.next, { backgroundColor: s.color }]} onPress={() => go(1)}>
          <Text style={st.nextTxt}>{step === screens.length - 1 ? 'Get started →' : 'Next →'}</Text>
        </Pressable>
      </View>
    </View>
  )
}

const st = StyleSheet.create({
  root:        { flex: 1, padding: 24 },
  contentWrap: { flex: 1 },
  content:     { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: 14 },
  icon:        { width: 64, height: 64, borderRadius: 20 },
  title:       { fontSize: 20, fontWeight: '700' },
  body:        { fontSize: 13, color: '#666', textAlign: 'center', maxWidth: 220 },
  dots:        { flexDirection: 'row', justifyContent: 'center', gap: 5, marginBottom: 18 },
  dot:         { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.2)' },
  nav:         { flexDirection: 'row', gap: 8 },
  back:        { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  backTxt:     { fontSize: 13, color: '#666' },
  next:        { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center' },
  nextTxt:     { color: '#fff', fontSize: 13, fontWeight: '500' },
})`,
  },
  {
    title: 'Animated pill dots',
    description: 'Replace the static dot width with useSharedValue + useAnimatedStyle so the active dot springs to 24px. Pass the current screen color as a shared value so the dot color also transitions.',
    code: `import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  SlideInRight, SlideInLeft, SlideOutRight, SlideOutLeft, ZoomIn,
  useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy code straight into your project.' },
]

function Dot({ active }: { active: boolean }) {
  const width = useSharedValue(active ? 24 : 8)

  // React to active changes
  if (active) width.value = withSpring(24, { stiffness: 500, damping: 30 })
  else        width.value = withSpring(8,  { stiffness: 500, damping: 30 })

  const style = useAnimatedStyle(() => ({ width: width.value }))
  return <Animated.View style={[st.dot, style]} />
}

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const [dir,  setDir]  = useState<1 | -1>(1)
  const s = screens[step]

  function go(d: 1 | -1) {
    const next = step + d
    if (next < 0 || next >= screens.length) return
    setDir(d); setStep(next)
  }

  return (
    <View style={st.root}>
      <View style={st.contentWrap}>
        <Animated.View key={step}
          entering={(dir > 0 ? SlideInRight : SlideInLeft).springify().damping(20)}
          exiting={(dir > 0 ? SlideOutLeft : SlideOutRight).duration(200)}
          style={st.content}>
          <Animated.View key={step + '-icon'} entering={ZoomIn.delay(100).springify()}
            style={[st.icon, { backgroundColor: s.color }]} />
          <Text style={st.title}>{s.title}</Text>
          <Text style={st.body}>{s.body}</Text>
        </Animated.View>
      </View>

      <View style={st.dots}>
        {screens.map((_, i) => <Dot key={i} active={i === step} />)}
      </View>

      <View style={st.nav}>
        {step > 0 && (
          <Pressable style={st.back} onPress={() => go(-1)}>
            <Text style={st.backTxt}>Back</Text>
          </Pressable>
        )}
        <Pressable style={[st.next, { backgroundColor: s.color }]} onPress={() => go(1)}>
          <Text style={st.nextTxt}>{step === screens.length - 1 ? 'Get started →' : 'Next →'}</Text>
        </Pressable>
      </View>
    </View>
  )
}

const st = StyleSheet.create({
  root:        { flex: 1, padding: 24 },
  contentWrap: { flex: 1 },
  content:     { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: 14 },
  icon:        { width: 64, height: 64, borderRadius: 20 },
  title:       { fontSize: 20, fontWeight: '700' },
  body:        { fontSize: 13, color: '#666', textAlign: 'center', maxWidth: 220 },
  dots:        { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 18 },
  dot:         { height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.2)' },
  nav:         { flexDirection: 'row', gap: 8 },
  back:        { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  backTxt:     { fontSize: 13, color: '#666' },
  next:        { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center' },
  nextTxt:     { color: '#fff', fontSize: 13, fontWeight: '500' },
})`,
  },
]

const onboardingFlowFlutter: Step[] = [
  {
    title: 'Static screens',
    description: 'Use an IndexedStack or switch on _step to show one screen at a time. Store step state in a StatefulWidget and advance it with setState.',
    code: `import 'package:flutter/material.dart';

class OnboardingFlow extends StatefulWidget {
  const OnboardingFlow({super.key});
  @override State<OnboardingFlow> createState() => _State();
}

class _State extends State<OnboardingFlow> {
  int _step = 0;

  static const _screens = [
    (color: Color(0xFF534AB7), title: 'Welcome',       body: 'The animation platform for every stack.'),
    (color: Color(0xFF1D9E75), title: 'Pick a pattern', body: 'Six animations, five platforms.'),
    (color: Color(0xFFD85A30), title: 'Ship it',        body: 'Copy code straight into your project.'),
  ];

  @override
  Widget build(BuildContext context) {
    final s = _screens[_step];
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(children: [
        Expanded(child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(width: 64, height: 64,
              decoration: BoxDecoration(color: s.color, borderRadius: BorderRadius.circular(20))),
            const SizedBox(height: 14),
            Text(s.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            Text(s.body, textAlign: TextAlign.center,
              style: const TextStyle(fontSize: 13, color: Colors.grey)),
          ],
        )),
        Row(mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_screens.length, (i) => Container(
            margin: const EdgeInsets.symmetric(horizontal: 2.5),
            width: i == _step ? 20.0 : 8.0, height: 8,
            decoration: BoxDecoration(
              color: i == _step ? s.color : Colors.black.withOpacity(0.2),
              borderRadius: BorderRadius.circular(4)),
          ))),
        const SizedBox(height: 18),
        SizedBox(width: double.infinity, child: ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: s.color, foregroundColor: Colors.white),
          onPressed: () { if (_step < _screens.length - 1) setState(() => _step++); },
          child: Text(_step == _screens.length - 1 ? 'Get started →' : 'Next →'),
        )),
      ]),
    );
  }
}`,
  },
  {
    title: 'AnimatedSwitcher crossfade',
    description: 'Wrap the screen content in AnimatedSwitcher. The key drives the swap — when _step changes, AnimatedSwitcher fades out the old widget and fades in the new one.',
    code: `import 'package:flutter/material.dart';

class OnboardingFlow extends StatefulWidget {
  const OnboardingFlow({super.key});
  @override State<OnboardingFlow> createState() => _State();
}

class _State extends State<OnboardingFlow> {
  int _step = 0;

  static const _screens = [
    (color: Color(0xFF534AB7), title: 'Welcome',       body: 'The animation platform for every stack.'),
    (color: Color(0xFF1D9E75), title: 'Pick a pattern', body: 'Six animations, five platforms.'),
    (color: Color(0xFFD85A30), title: 'Ship it',        body: 'Copy code straight into your project.'),
  ];

  @override
  Widget build(BuildContext context) {
    final s = _screens[_step];
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(children: [
        Expanded(
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 280),
            // FadeTransition is the default — explicit here for clarity
            transitionBuilder: (child, anim) => FadeTransition(opacity: anim, child: child),
            child: Column(
              key: ValueKey(_step),
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Container(width: 64, height: 64,
                  decoration: BoxDecoration(color: s.color, borderRadius: BorderRadius.circular(20))),
                const SizedBox(height: 14),
                Text(s.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                Text(s.body, textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 13, color: Colors.grey)),
              ],
            ),
          ),
        ),
        // Dots + button unchanged from step 1
        Row(mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_screens.length, (i) => Container(
            margin: const EdgeInsets.symmetric(horizontal: 2.5),
            width: i == _step ? 20.0 : 8.0, height: 8,
            decoration: BoxDecoration(
              color: i == _step ? s.color : Colors.black.withOpacity(0.2),
              borderRadius: BorderRadius.circular(4))))),
        const SizedBox(height: 18),
        SizedBox(width: double.infinity, child: ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: s.color, foregroundColor: Colors.white),
          onPressed: () { if (_step < _screens.length - 1) setState(() => _step++); },
          child: Text(_step == _screens.length - 1 ? 'Get started →' : 'Next →'),
        )),
      ]),
    );
  }
}`,
  },
  {
    title: 'Slide direction + icon pop',
    description: 'Add a custom SlideTransition to AnimatedSwitcher. Track direction to flip the slide axis. The icon gets its own AnimatedSwitcher so it can pop in independently with a scale + fade.',
    code: `import 'package:flutter/material.dart';

class OnboardingFlow extends StatefulWidget {
  const OnboardingFlow({super.key});
  @override State<OnboardingFlow> createState() => _State();
}

class _State extends State<OnboardingFlow> {
  int  _step = 0;
  bool _forward = true;

  static const _screens = [
    (color: Color(0xFF534AB7), title: 'Welcome',       body: 'The animation platform for every stack.'),
    (color: Color(0xFF1D9E75), title: 'Pick a pattern', body: 'Six animations, five platforms.'),
    (color: Color(0xFFD85A30), title: 'Ship it',        body: 'Copy code straight into your project.'),
  ];

  void _go(int i) {
    if (i < 0 || i >= _screens.length) return;
    setState(() { _forward = i > _step; _step = i; });
  }

  @override
  Widget build(BuildContext context) {
    final s = _screens[_step];
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(children: [
        Expanded(
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 280),
            transitionBuilder: (child, anim) => FadeTransition(
              opacity: anim,
              child: SlideTransition(
                position: Tween(
                  begin: Offset(_forward ? 0.15 : -0.15, 0),
                  end: Offset.zero,
                ).animate(anim),
                child: child,
              ),
            ),
            child: Column(
              key: ValueKey(_step),
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                // Icon pops in via its own AnimatedSwitcher
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 350),
                  transitionBuilder: (child, anim) => ScaleTransition(scale: anim,
                    child: FadeTransition(opacity: anim, child: child)),
                  child: Container(
                    key: ValueKey('icon-$_step'),
                    width: 64, height: 64,
                    decoration: BoxDecoration(color: s.color, borderRadius: BorderRadius.circular(20))),
                ),
                const SizedBox(height: 14),
                Text(s.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                Text(s.body, textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 13, color: Colors.grey)),
              ],
            ),
          ),
        ),
        Row(mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_screens.length, (i) => GestureDetector(
            onTap: () => _go(i),
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 2.5),
              width: i == _step ? 20.0 : 8.0, height: 8,
              decoration: BoxDecoration(
                color: i == _step ? s.color : Colors.black.withOpacity(0.2),
                borderRadius: BorderRadius.circular(4))))),
        const SizedBox(height: 18),
        Row(children: [
          if (_step > 0) ...[
            Expanded(child: OutlinedButton(onPressed: () => _go(_step - 1), child: const Text('Back'))),
            const SizedBox(width: 8),
          ],
          Expanded(child: ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: s.color, foregroundColor: Colors.white),
            onPressed: () => _go(_step + 1),
            child: Text(_step == _screens.length - 1 ? 'Get started →' : 'Next →'),
          )),
        ]),
      ]),
    );
  }
}`,
  },
  {
    title: 'Animated pill dots',
    description: 'Wrap each dot in AnimatedContainer. The active dot expands its width from 8 to 24 using the spring-like easeOut curve. Animate color too by passing the screen color conditionally.',
    code: `import 'package:flutter/material.dart';

class OnboardingFlow extends StatefulWidget {
  const OnboardingFlow({super.key});
  @override State<OnboardingFlow> createState() => _State();
}

class _State extends State<OnboardingFlow> {
  int  _step    = 0;
  bool _forward = true;

  static const _screens = [
    (color: Color(0xFF534AB7), title: 'Welcome',       body: 'The animation platform for every stack.'),
    (color: Color(0xFF1D9E75), title: 'Pick a pattern', body: 'Six animations, five platforms.'),
    (color: Color(0xFFD85A30), title: 'Ship it',        body: 'Copy code straight into your project.'),
  ];

  void _go(int i) {
    if (i < 0 || i >= _screens.length) return;
    setState(() { _forward = i > _step; _step = i; });
  }

  @override
  Widget build(BuildContext context) {
    final s = _screens[_step];
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(children: [
        Expanded(
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 280),
            transitionBuilder: (child, anim) => FadeTransition(
              opacity: anim,
              child: SlideTransition(
                position: Tween(begin: Offset(_forward ? 0.15 : -0.15, 0), end: Offset.zero).animate(anim),
                child: child)),
            child: Column(
              key: ValueKey(_step),
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AnimatedSwitcher(
                  duration: const Duration(milliseconds: 350),
                  transitionBuilder: (child, anim) => ScaleTransition(scale: anim,
                    child: FadeTransition(opacity: anim, child: child)),
                  child: Container(key: ValueKey('icon-$_step'), width: 64, height: 64,
                    decoration: BoxDecoration(color: s.color, borderRadius: BorderRadius.circular(20)))),
                const SizedBox(height: 14),
                Text(s.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w700)),
                const SizedBox(height: 8),
                Text(s.body, textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 13, color: Colors.grey)),
              ],
            ),
          ),
        ),

        // Animated pill dots — width AND color animate
        Row(mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_screens.length, (i) => GestureDetector(
            onTap: () => _go(i),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 300),
              curve: Curves.easeOut,
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width:  i == _step ? 24.0 : 8.0,
              height: 8,
              decoration: BoxDecoration(
                color: i == _step ? s.color : Colors.black.withOpacity(0.2),
                borderRadius: BorderRadius.circular(4)),
            ),
          ))),
        const SizedBox(height: 18),
        Row(children: [
          if (_step > 0) ...[
            Expanded(child: OutlinedButton(onPressed: () => _go(_step - 1), child: const Text('Back'))),
            const SizedBox(width: 8),
          ],
          Expanded(child: ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: s.color, foregroundColor: Colors.white),
            onPressed: () => _go(_step + 1),
            child: Text(_step == _screens.length - 1 ? 'Get started →' : 'Next →'),
          )),
        ]),
      ]),
    );
  }
}`,
  },
]

const onboardingFlow: StepMap = {
  react:          onboardingFlowReact,
  nextjs:         onboardingFlowNextjs,
  vue:            onboardingFlowVue,
  'react-native': onboardingFlowRN,
  flutter:        onboardingFlowFlutter,
}

/* ─────────────────────────────────────────────────────────────────── */
/*  9. Shared Element Transitions                                       */
/* ─────────────────────────────────────────────────────────────────── */

const sharedElementReact: Step[] = [
  {
    title: 'List + static overlay',
    description: 'Render a list of items and a detail overlay that appears when an item is clicked. No animation yet — just the state machine.',
    code: `import { useState } from 'react'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

export function SharedElementDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const item = items.find(i => i.id === selected)

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => (
          <div key={it.id} onClick={() => setSelected(it.id)}
            style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12,
              borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', cursor: 'pointer' }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: it.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{it.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
      {selected && item && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'flex-end', zIndex: 40 }}>
          <div style={{ width: '100%', background: 'var(--bg)', borderRadius: '20px 20px 0 0', padding: 24 }}>
            <div style={{ width: '100%', height: 160, borderRadius: 16, background: item.color, marginBottom: 18 }} />
            <div style={{ fontSize: 22, color: 'var(--text-primary)', marginBottom: 6 }}>{item.title}</div>
            <button onClick={() => setSelected(null)}
              style={{ marginTop: 12, padding: '10px 20px', borderRadius: 10,
                background: item.color, color: '#fff', border: 'none', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}`,
  },
  {
    title: 'Animated backdrop + sheet',
    description: 'Wrap the overlay in AnimatePresence so the backdrop fades in/out and the bottom sheet slides up from below.',
    code: `import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

export function SharedElementDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const item = items.find(i => i.id === selected)

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => (
          <div key={it.id} onClick={() => setSelected(it.id)}
            style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12,
              borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', cursor: 'pointer' }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: it.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{it.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && item && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
            <motion.div key="sh"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'var(--bg)', borderRadius: '20px 20px 0 0', padding: 24, zIndex: 50 }}>
              <div style={{ width: '100%', height: 160, borderRadius: 16, background: item.color, marginBottom: 18 }} />
              <div style={{ fontSize: 22, color: 'var(--text-primary)', marginBottom: 6 }}>{item.title}</div>
              <button onClick={() => setSelected(null)}
                style={{ marginTop: 12, padding: '10px 20px', borderRadius: 10,
                  background: item.color, color: '#fff', border: 'none', cursor: 'pointer' }}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}`,
  },
  {
    title: 'layoutId on thumbnail',
    description: 'Add layoutId to the list thumbnail. Framer Motion detects the matching layoutId in the detail sheet and FLIP-animates the element between positions automatically.',
    code: `import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

export function SharedElementDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const item = items.find(i => i.id === selected)

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => (
          <div key={it.id} onClick={() => setSelected(it.id)}
            style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12,
              borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', cursor: 'pointer' }}>
            {/* layoutId marks this as a shared element */}
            <motion.div layoutId={\`hero-\${it.id}\`}
              style={{ width: 48, height: 48, borderRadius: 10, background: it.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, color: 'var(--text-primary)' }}>{it.title}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && item && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
            <motion.div key="sh"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'var(--bg)', borderRadius: '20px 20px 0 0', padding: 24, zIndex: 50 }}>
              {/* Same layoutId — morphs from 48×48 thumbnail to full-width banner */}
              <motion.div layoutId={\`hero-\${selected}\`}
                style={{ width: '100%', height: 160, borderRadius: 16, background: item.color, marginBottom: 18 }} />
              <div style={{ fontSize: 22, color: 'var(--text-primary)', marginBottom: 6 }}>{item.title}</div>
              <button onClick={() => setSelected(null)}
                style={{ marginTop: 12, padding: '10px 20px', borderRadius: 10,
                  background: item.color, color: '#fff', border: 'none', cursor: 'pointer' }}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}`,
  },
  {
    title: 'Polish — spring + list reflow',
    description: 'Add a layout prop to every list row so siblings reflow smoothly when the overlay unmounts. Tune the layoutId spring for a slower, more cinematic morph.',
    code: `import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

export function SharedElementDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const item = items.find(i => i.id === selected)

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => (
          <motion.div layout key={it.id} onClick={() => setSelected(it.id)}
            style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12,
              borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', cursor: 'pointer' }}>
            <motion.div
              layoutId={\`hero-\${it.id}\`}
              transition={{ type: 'spring', stiffness: 200, damping: 28 }}
              style={{ width: 48, height: 48, borderRadius: 10, background: it.color, flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-power)', fontSize: 13,
                color: 'var(--text-primary)' }}>{it.title}</div>
              <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 11,
                color: 'var(--text-tertiary)', marginTop: 2 }}>{it.sub}</div>
            </div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>›</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selected && item && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
            <motion.div key="sh"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'var(--bg)', borderRadius: '20px 20px 0 0', padding: 24, zIndex: 50 }}>
              <motion.div
                layoutId={\`hero-\${selected}\`}
                transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                style={{ width: '100%', height: 160, borderRadius: 16, background: item.color, marginBottom: 18 }}
              />
              <div style={{ fontFamily: 'var(--font-power)', fontSize: 22,
                color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 13,
                color: 'var(--text-secondary)' }}>{item.sub} · Tap backdrop to close</div>
              <button onClick={() => setSelected(null)} style={{
                marginTop: 20, padding: '10px 20px', borderRadius: 10,
                background: item.color, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}`,
  },
]

const sharedElementNextjs: Step[] = [
  {
    title: 'List + static overlay',
    description: "Add 'use client'. The state machine and overlay are identical to React — the only Next.js requirement is the client directive.",
    code: `'use client'
import { useState } from 'react'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

export function SharedElementDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const item = items.find(i => i.id === selected)

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => (
          <div key={it.id} onClick={() => setSelected(it.id)}
            style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12,
              borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', cursor: 'pointer' }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: it.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13 }}>{it.title}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
      {selected && item && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40,
          display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ width: '100%', background: 'var(--bg)', borderRadius: '20px 20px 0 0', padding: 24 }}>
            <div style={{ width: '100%', height: 160, borderRadius: 16, background: item.color, marginBottom: 18 }} />
            <div style={{ fontSize: 22 }}>{item.title}</div>
            <button onClick={() => setSelected(null)} style={{
              marginTop: 16, padding: '10px 20px', borderRadius: 10,
              background: item.color, color: '#fff', border: 'none', cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}`,
  },
  {
    title: 'Animated backdrop + sheet',
    description: 'AnimatePresence works inside "use client" components in App Router. The backdrop fades and the sheet springs up as before.',
    code: `'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

export function SharedElementDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const item = items.find(i => i.id === selected)

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => (
          <div key={it.id} onClick={() => setSelected(it.id)}
            style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12,
              borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', cursor: 'pointer' }}>
            <div style={{ width: 48, height: 48, borderRadius: 10, background: it.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13 }}>{it.title}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {selected && item && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
            <motion.div key="sh"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'var(--bg)', borderRadius: '20px 20px 0 0', padding: 24, zIndex: 50 }}>
              <div style={{ width: '100%', height: 160, borderRadius: 16, background: item.color, marginBottom: 18 }} />
              <div style={{ fontSize: 22 }}>{item.title}</div>
              <button onClick={() => setSelected(null)} style={{
                marginTop: 16, padding: '10px 20px', borderRadius: 10,
                background: item.color, color: '#fff', border: 'none', cursor: 'pointer' }}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}`,
  },
  {
    title: 'layoutId on thumbnail',
    description: 'Add layoutId to the list thumbnail and the detail banner. Both the list and the detail sheet must be rendered inside the same Client Component tree for layoutId to match them.',
    code: `'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

export function SharedElementDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const item = items.find(i => i.id === selected)

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => (
          <div key={it.id} onClick={() => setSelected(it.id)}
            style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12,
              borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', cursor: 'pointer' }}>
            <motion.div layoutId={\`hero-\${it.id}\`}
              style={{ width: 48, height: 48, borderRadius: 10, background: it.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13 }}>{it.title}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{it.sub}</div>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {selected && item && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
            <motion.div key="sh"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'var(--bg)', borderRadius: '20px 20px 0 0', padding: 24, zIndex: 50 }}>
              <motion.div layoutId={\`hero-\${selected}\`}
                style={{ width: '100%', height: 160, borderRadius: 16, background: item.color, marginBottom: 18 }} />
              <div style={{ fontSize: 22 }}>{item.title}</div>
              <button onClick={() => setSelected(null)} style={{
                marginTop: 16, padding: '10px 20px', borderRadius: 10,
                background: item.color, color: '#fff', border: 'none', cursor: 'pointer' }}>Close</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}`,
  },
  {
    title: 'Polish — spring + list reflow',
    description: 'Add layout to list rows and tune the layoutId spring. Export from components/SharedElementDemo.tsx — any Server Component page can import it directly.',
    code: `'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

export function SharedElementDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const item = items.find(i => i.id === selected)

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => (
          <motion.div layout key={it.id} onClick={() => setSelected(it.id)}
            style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12,
              borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', cursor: 'pointer' }}>
            <motion.div
              layoutId={\`hero-nj-\${it.id}\`}
              transition={{ type: 'spring', stiffness: 200, damping: 28 }}
              style={{ width: 48, height: 48, borderRadius: 10, background: it.color, flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13 }}>{it.title}</div>
              <div style={{ fontSize: 11, color: '#999', marginTop: 2 }}>{it.sub}</div>
            </div>
            <span style={{ color: '#999', fontSize: 12 }}>›</span>
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selected && item && (
          <>
            <motion.div key="bd" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
            <motion.div key="sh"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'var(--bg)', borderRadius: '20px 20px 0 0', padding: 24, zIndex: 50 }}>
              <motion.div
                layoutId={\`hero-nj-\${selected}\`}
                transition={{ type: 'spring', stiffness: 200, damping: 28 }}
                style={{ width: '100%', height: 160, borderRadius: 16, background: item.color, marginBottom: 18 }}
              />
              <div style={{ fontSize: 22, letterSpacing: '-0.02em', marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 16 }}>{item.sub} · Tap backdrop to close</div>
              <button onClick={() => setSelected(null)} style={{
                padding: '10px 20px', borderRadius: 10,
                background: item.color, color: '#fff', border: 'none', cursor: 'pointer', fontSize: 13 }}>
                Close
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}`,
  },
]

const sharedElementVue: Step[] = [
  {
    title: 'List + static overlay',
    description: 'Render the list and a v-if overlay. Track the selected item id in a ref. No animation yet — establish the state machine first.',
    code: `<template>
  <div class="root">
    <div class="list">
      <div v-for="it in items" :key="it.id" class="row" @click="selected = it.id">
        <div class="thumb" :style="{ background: it.color }" />
        <div class="meta">
          <strong>{{ it.title }}</strong>
          <span>{{ it.sub }}</span>
        </div>
      </div>
    </div>

    <div v-if="selected && item" class="overlay" @click.self="selected = null">
      <div class="sheet">
        <div class="hero" :style="{ background: item.color }" />
        <h2>{{ item.title }}</h2>
        <button :style="{ background: item.color }" @click="selected = null">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]
const selected = ref<string | null>(null)
const item     = computed(() => items.find(i => i.id === selected.value))
</script>

<style scoped>
.root  { position: relative; height: 100%; overflow: hidden; }
.list  { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.row   { display: flex; gap: 12px; align-items: center; padding: 12px; border-radius: 12px;
         border: 1px solid var(--border); background: var(--bg-secondary); cursor: pointer; }
.thumb { width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0; }
.meta  { display: flex; flex-direction: column; gap: 2px; font-size: 13px; }
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 40;
           display: flex; align-items: flex-end; }
.sheet { width: 100%; background: var(--bg); border-radius: 20px 20px 0 0; padding: 24px; }
.hero  { width: 100%; height: 160px; border-radius: 16px; margin-bottom: 18px; }
button { margin-top: 16px; padding: 10px 20px; border-radius: 10px; border: none;
         color: #fff; cursor: pointer; font-size: 13px; }
</style>`,
  },
  {
    title: 'Transition overlay in/out',
    description: 'Wrap the overlay in <Transition name="fade"> so the backdrop fades and the sheet slides up using CSS transitions. The bottom sheet uses translateY.',
    code: `<template>
  <div class="root">
    <div class="list">
      <div v-for="it in items" :key="it.id" class="row" @click="selected = it.id">
        <div class="thumb" :style="{ background: it.color }" />
        <div class="meta">
          <strong>{{ it.title }}</strong>
          <span>{{ it.sub }}</span>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="selected && item" class="overlay" @click.self="selected = null">
        <Transition name="sheet" appear>
          <div v-if="selected" class="sheet">
            <div class="hero" :style="{ background: item.color }" />
            <h2>{{ item.title }}</h2>
            <button :style="{ background: item.color }" @click="selected = null">Close</button>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]
const selected = ref<string | null>(null)
const item     = computed(() => items.find(i => i.id === selected.value))
</script>

<style scoped>
/* (list styles as before) */
.root  { position: relative; height: 100%; overflow: hidden; }
.list  { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.row   { display: flex; gap: 12px; align-items: center; padding: 12px; border-radius: 12px;
         border: 1px solid var(--border); background: var(--bg-secondary); cursor: pointer; }
.thumb { width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0; }
.meta  { display: flex; flex-direction: column; gap: 2px; font-size: 13px; }
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 40;
           display: flex; align-items: flex-end; }
.sheet { width: 100%; background: var(--bg); border-radius: 20px 20px 0 0; padding: 24px; }
.hero  { width: 100%; height: 160px; border-radius: 16px; margin-bottom: 18px; }
button { margin-top: 16px; padding: 10px 20px; border-radius: 10px; border: none;
         color: #fff; cursor: pointer; font-size: 13px; }

.fade-enter-from, .fade-leave-to   { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }

.sheet-enter-from, .sheet-leave-to   { transform: translateY(100%); }
.sheet-enter-active, .sheet-leave-active {
  transition: transform 0.4s cubic-bezier(0.22,1,0.36,1);
}
</style>`,
  },
  {
    title: 'FLIP hero transition — record thumb rect',
    description: 'Vue has no layoutId equivalent. Implement FLIP manually: record the thumbnail\'s getBoundingClientRect() on click, then after the sheet mounts, translate the hero FROM that rect TO its natural position.',
    code: `<template>
  <div class="root">
    <div class="list">
      <div v-for="it in items" :key="it.id" class="row" @click="open(it)">
        <div class="thumb" :style="{ background: it.color }" :ref="el => thumbRefs[it.id] = el as HTMLElement" />
        <div class="meta">
          <strong>{{ it.title }}</strong><span>{{ it.sub }}</span>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="selected && item" class="overlay" @click.self="close">
        <div class="sheet">
          <div class="hero" :style="{ background: item.color }" ref="heroEl" />
          <h2>{{ item.title }}</h2>
          <button :style="{ background: item.color }" @click="close">Close</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

const selected  = ref<string | null>(null)
const item      = computed(() => items.find(i => i.id === selected.value))
const thumbRefs = ref<Record<string, HTMLElement>>({})
const heroEl    = ref<HTMLElement | null>(null)

async function open(it: typeof items[0]) {
  const thumb = thumbRefs.value[it.id]
  const from  = thumb?.getBoundingClientRect()
  selected.value = it.id
  await nextTick()
  if (!from || !heroEl.value) return

  const to = heroEl.value.getBoundingClientRect()
  const dx = from.left - to.left
  const dy = from.top  - to.top
  const sx = from.width  / to.width
  const sy = from.height / to.height

  heroEl.value.style.transition = 'none'
  heroEl.value.style.transform  = \`translate(\${dx}px, \${dy}px) scale(\${sx}, \${sy})\`
  heroEl.value.style.borderRadius = '10px'
  heroEl.value.style.transformOrigin = 'top left'

  requestAnimationFrame(() => {
    heroEl.value!.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), border-radius 0.4s'
    heroEl.value!.style.transform  = ''
    heroEl.value!.style.borderRadius = '16px'
  })
}

function close() { selected.value = null }
</script>

<style scoped>
.root  { position: relative; height: 100%; overflow: hidden; }
.list  { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.row   { display: flex; gap: 12px; align-items: center; padding: 12px; border-radius: 12px;
         border: 1px solid var(--border); background: var(--bg-secondary); cursor: pointer; }
.thumb { width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0; }
.meta  { display: flex; flex-direction: column; gap: 2px; font-size: 13px; }
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 40;
           display: flex; align-items: flex-end; }
.sheet { width: 100%; background: var(--bg); border-radius: 20px 20px 0 0; padding: 24px; }
.hero  { width: 100%; height: 160px; border-radius: 16px; margin-bottom: 18px;
         transform-origin: top left; }
button { margin-top: 16px; padding: 10px 20px; border-radius: 10px; border: none;
         color: #fff; cursor: pointer; font-size: 13px; }
.fade-enter-from, .fade-leave-to   { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
</style>`,
  },
  {
    title: 'Reverse FLIP on close',
    description: 'Record the hero\'s rect before closing, then animate it back to the thumbnail position using the same FLIP technique. This gives the "fly back" effect on dismiss.',
    code: `<template>
  <div class="root">
    <div class="list">
      <div v-for="it in items" :key="it.id" class="row" @click="open(it)">
        <div class="thumb" :style="{ background: it.color }" :ref="el => thumbRefs[it.id] = el as HTMLElement" />
        <div class="meta">
          <strong>{{ it.title }}</strong><span>{{ it.sub }}</span>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="selected && item" class="overlay" @click.self="close">
        <div class="sheet">
          <div class="hero" :style="{ background: item.color }" ref="heroEl" />
          <h2>{{ item.title }}</h2>
          <p>{{ item.sub }} · Tap outside to close</p>
          <button :style="{ background: item.color }" @click="close">Close</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

const selected  = ref<string | null>(null)
const item      = computed(() => items.find(i => i.id === selected.value))
const thumbRefs = ref<Record<string, HTMLElement>>({})
const heroEl    = ref<HTMLElement | null>(null)

async function open(it: typeof items[0]) {
  const thumb = thumbRefs.value[it.id]
  const from  = thumb?.getBoundingClientRect()
  selected.value = it.id
  await nextTick()
  if (!from || !heroEl.value) return

  const to = heroEl.value.getBoundingClientRect()
  const dx = from.left - to.left
  const dy = from.top  - to.top
  const sx = from.width  / to.width
  const sy = from.height / to.height

  // Start from thumb position, spring to natural position
  heroEl.value.style.transition    = 'none'
  heroEl.value.style.transform     = \`translate(\${dx}px, \${dy}px) scale(\${sx}, \${sy})\`
  heroEl.value.style.borderRadius  = '10px'
  heroEl.value.style.transformOrigin = 'top left'

  requestAnimationFrame(() => {
    heroEl.value!.style.transition   = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), border-radius 0.4s'
    heroEl.value!.style.transform    = ''
    heroEl.value!.style.borderRadius = '16px'
  })
}

function close() {
  if (!heroEl.value || !selected.value) { selected.value = null; return }
  const thumb = thumbRefs.value[selected.value]
  if (!thumb) { selected.value = null; return }

  const from = heroEl.value.getBoundingClientRect()
  const to   = thumb.getBoundingClientRect()
  const dx   = to.left - from.left
  const dy   = to.top  - from.top
  const sx   = to.width  / from.width
  const sy   = to.height / from.height

  // Animate hero back to thumb position, THEN unmount
  heroEl.value.style.transition   = 'transform 0.35s cubic-bezier(0.4,0,1,1), border-radius 0.35s, opacity 0.35s'
  heroEl.value.style.transform    = \`translate(\${dx}px, \${dy}px) scale(\${sx}, \${sy})\`
  heroEl.value.style.borderRadius = '10px'
  heroEl.value.style.opacity      = '0'
  setTimeout(() => { selected.value = null }, 350)
}
</script>

<style scoped>
.root  { position: relative; height: 100%; overflow: hidden; }
.list  { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.row   { display: flex; gap: 12px; align-items: center; padding: 12px; border-radius: 12px;
         border: 1px solid var(--border); background: var(--bg-secondary); cursor: pointer; }
.thumb { width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0; }
.meta  { display: flex; flex-direction: column; gap: 2px; font-size: 13px; }
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 40;
           display: flex; align-items: flex-end; }
.sheet { width: 100%; background: var(--bg); border-radius: 20px 20px 0 0; padding: 24px; }
.hero  { width: 100%; height: 160px; border-radius: 16px; margin-bottom: 18px;
         transform-origin: top left; }
button { margin-top: 16px; padding: 10px 20px; border-radius: 10px; border: none;
         color: #fff; cursor: pointer; font-size: 13px; }
.fade-enter-from, .fade-leave-to   { opacity: 0; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
</style>`,
  },
]

const sharedElementRN: Step[] = [
  {
    title: 'List + static overlay',
    description: 'Build the list and overlay state machine. Use StyleSheet.absoluteFillObject on the backdrop and a bottom-aligned sheet — no animation yet.',
    code: `import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

export function SharedElementDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const item = items.find(i => i.id === selected)

  return (
    <View style={s.root}>
      {items.map(it => (
        <Pressable key={it.id} style={s.row} onPress={() => setSelected(it.id)}>
          <View style={[s.thumb, { backgroundColor: it.color }]} />
          <View style={s.meta}>
            <Text style={s.title}>{it.title}</Text>
            <Text style={s.sub}>{it.sub}</Text>
          </View>
        </Pressable>
      ))}

      {selected && item && (
        <>
          <Pressable style={s.backdrop} onPress={() => setSelected(null)} />
          <View style={s.sheet}>
            <View style={[s.hero, { backgroundColor: item.color }]} />
            <Text style={s.sheetTitle}>{item.title}</Text>
            <Pressable style={[s.btn, { backgroundColor: item.color }]} onPress={() => setSelected(null)}>
              <Text style={{ color: '#fff', fontSize: 13 }}>Close</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  root:       { flex: 1, padding: 16 },
  row:        { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12,
                borderRadius: 12, borderWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa', marginBottom: 10 },
  thumb:      { width: 48, height: 48, borderRadius: 10 },
  meta:       { flex: 1 },
  title:      { fontSize: 13, fontWeight: '600', color: '#111' },
  sub:        { fontSize: 11, color: '#999', marginTop: 2 },
  backdrop:   { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 },
  sheet:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff',
                borderRadius: 20, padding: 24, zIndex: 50 },
  hero:       { width: '100%', height: 160, borderRadius: 16, marginBottom: 18 },
  sheetTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.4, marginBottom: 8 },
  btn:        { padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 12 },
})`,
  },
  {
    title: 'Animated backdrop + spring sheet',
    description: 'Add FadeIn on the backdrop and drive the sheet with useSharedValue + withSpring so it springs up from the bottom.',
    code: `import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, FadeIn, FadeOut,
} from 'react-native-reanimated'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

export function SharedElementDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const item = items.find(i => i.id === selected)
  const sheetY = useSharedValue(500)

  function open(id: string) {
    setSelected(id)
    sheetY.value = withSpring(0, { stiffness: 400, damping: 40 })
  }
  function close() {
    sheetY.value = withSpring(500, { stiffness: 400, damping: 40 })
    setTimeout(() => setSelected(null), 350)
  }

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sheetY.value }] }))

  return (
    <View style={s.root}>
      {items.map(it => (
        <Pressable key={it.id} style={s.row} onPress={() => open(it.id)}>
          <View style={[s.thumb, { backgroundColor: it.color }]} />
          <View style={s.meta}>
            <Text style={s.title}>{it.title}</Text>
            <Text style={s.sub}>{it.sub}</Text>
          </View>
        </Pressable>
      ))}

      {selected && item && (
        <>
          <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)} style={s.backdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={close} />
          </Animated.View>
          <Animated.View style={[s.sheet, sheetStyle]}>
            <View style={[s.hero, { backgroundColor: item.color }]} />
            <Text style={s.sheetTitle}>{item.title}</Text>
            <Pressable style={[s.btn, { backgroundColor: item.color }]} onPress={close}>
              <Text style={{ color: '#fff', fontSize: 13 }}>Close</Text>
            </Pressable>
          </Animated.View>
        </>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  root:       { flex: 1, padding: 16 },
  row:        { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12,
                borderRadius: 12, borderWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa', marginBottom: 10 },
  thumb:      { width: 48, height: 48, borderRadius: 10 },
  meta:       { flex: 1 },
  title:      { fontSize: 13, fontWeight: '600', color: '#111' },
  sub:        { fontSize: 11, color: '#999', marginTop: 2 },
  backdrop:   { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 },
  sheet:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff',
                borderRadius: 20, padding: 24, zIndex: 50 },
  hero:       { width: '100%', height: 160, borderRadius: 16, marginBottom: 18 },
  sheetTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.4, marginBottom: 8 },
  btn:        { padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 12 },
})`,
  },
  {
    title: 'sharedTransitionTag — hero morph',
    description: 'Add sharedTransitionTag from react-native-reanimated to both the list thumbnail and the sheet hero. Reanimated animates size and position between the two automatically.',
    code: `import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, FadeIn, FadeOut,
  SharedTransition, SharedTransitionType,
} from 'react-native-reanimated'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

// Custom spring transition applied to the shared element
const spring = SharedTransition.custom((values) => {
  'worklet'
  return {
    width:  withSpring(values.targetWidth,  { stiffness: 200, damping: 28 }),
    height: withSpring(values.targetHeight, { stiffness: 200, damping: 28 }),
    originX: withSpring(values.targetOriginX, { stiffness: 200, damping: 28 }),
    originY: withSpring(values.targetOriginY, { stiffness: 200, damping: 28 }),
  }
})

export function SharedElementDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const item = items.find(i => i.id === selected)
  const sheetY = useSharedValue(500)

  function open(id: string) {
    setSelected(id)
    sheetY.value = withSpring(0, { stiffness: 400, damping: 40 })
  }
  function close() {
    sheetY.value = withSpring(500)
    setTimeout(() => setSelected(null), 350)
  }

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sheetY.value }] }))

  return (
    <View style={s.root}>
      {items.map(it => (
        <Pressable key={it.id} style={s.row} onPress={() => open(it.id)}>
          {/* Tag matches the hero in the sheet */}
          <Animated.View
            sharedTransitionTag={\`thumb-\${it.id}\`}
            sharedTransitionStyle={spring}
            style={[s.thumb, { backgroundColor: it.color }]}
          />
          <View style={s.meta}>
            <Text style={s.title}>{it.title}</Text>
            <Text style={s.sub}>{it.sub}</Text>
          </View>
        </Pressable>
      ))}

      {selected && item && (
        <>
          <Animated.View entering={FadeIn.duration(200)} style={s.backdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={close} />
          </Animated.View>
          <Animated.View style={[s.sheet, sheetStyle]}>
            {/* Same tag — Reanimated morphs from 48×48 thumb to this full-width banner */}
            <Animated.View
              sharedTransitionTag={\`thumb-\${selected}\`}
              sharedTransitionStyle={spring}
              style={[s.hero, { backgroundColor: item.color }]}
            />
            <Text style={s.sheetTitle}>{item.title}</Text>
            <Pressable style={[s.btn, { backgroundColor: item.color }]} onPress={close}>
              <Text style={{ color: '#fff', fontSize: 13 }}>Close</Text>
            </Pressable>
          </Animated.View>
        </>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  root:       { flex: 1, padding: 16 },
  row:        { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12,
                borderRadius: 12, borderWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa', marginBottom: 10 },
  thumb:      { width: 48, height: 48, borderRadius: 10 },
  meta:       { flex: 1 },
  title:      { fontSize: 13, fontWeight: '600', color: '#111' },
  sub:        { fontSize: 11, color: '#999', marginTop: 2 },
  backdrop:   { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 },
  sheet:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff',
                borderRadius: 20, padding: 24, zIndex: 50 },
  hero:       { width: '100%', height: 160, borderRadius: 16, marginBottom: 18 },
  sheetTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.4, marginBottom: 8 },
  btn:        { padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 12 },
})`,
  },
  {
    title: 'Spring tuning + border radius morph',
    description: 'Add borderRadius to the sharedTransitionStyle worklet so it animates from 10px (thumbnail) to 16px (hero). Tune stiffness/damping for a slower, more cinematic morph.',
    code: `import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, FadeIn,
  SharedTransition,
} from 'react-native-reanimated'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

const heroTransition = SharedTransition.custom((values) => {
  'worklet'
  return {
    width:        withSpring(values.targetWidth,        { stiffness: 180, damping: 26 }),
    height:       withSpring(values.targetHeight,       { stiffness: 180, damping: 26 }),
    originX:      withSpring(values.targetOriginX,      { stiffness: 180, damping: 26 }),
    originY:      withSpring(values.targetOriginY,      { stiffness: 180, damping: 26 }),
    borderRadius: withSpring(values.targetBorderRadius, { stiffness: 180, damping: 26 }),
  }
})

export function SharedElementDemo() {
  const [selected, setSelected] = useState<string | null>(null)
  const item = items.find(i => i.id === selected)
  const sheetY = useSharedValue(500)

  function open(id: string) { setSelected(id); sheetY.value = withSpring(0, { stiffness: 400, damping: 40 }) }
  function close() { sheetY.value = withSpring(500); setTimeout(() => setSelected(null), 380) }

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sheetY.value }] }))

  return (
    <View style={s.root}>
      {items.map(it => (
        <Pressable key={it.id} style={s.row} onPress={() => open(it.id)}>
          <Animated.View
            sharedTransitionTag={\`hero-\${it.id}\`}
            sharedTransitionStyle={heroTransition}
            style={[s.thumb, { backgroundColor: it.color, borderRadius: 10 }]}
          />
          <View style={s.meta}>
            <Text style={s.title}>{it.title}</Text>
            <Text style={s.sub}>{it.sub}</Text>
          </View>
        </Pressable>
      ))}

      {selected && item && (
        <>
          <Animated.View entering={FadeIn.duration(200)} style={s.backdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={close} />
          </Animated.View>
          <Animated.View style={[s.sheet, sheetStyle]}>
            <Animated.View
              sharedTransitionTag={\`hero-\${selected}\`}
              sharedTransitionStyle={heroTransition}
              style={[s.hero, { backgroundColor: item.color, borderRadius: 16 }]}
            />
            <Text style={s.sheetTitle}>{item.title}</Text>
            <Text style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>{item.sub} · Tap outside to close</Text>
            <Pressable style={[s.btn, { backgroundColor: item.color }]} onPress={close}>
              <Text style={{ color: '#fff', fontSize: 13 }}>Close</Text>
            </Pressable>
          </Animated.View>
        </>
      )}
    </View>
  )
}

const s = StyleSheet.create({
  root:       { flex: 1, padding: 16 },
  row:        { flexDirection: 'row', gap: 12, alignItems: 'center', padding: 12,
                borderRadius: 12, borderWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa', marginBottom: 10 },
  thumb:      { width: 48, height: 48 },
  meta:       { flex: 1 },
  title:      { fontSize: 13, fontWeight: '600', color: '#111' },
  sub:        { fontSize: 11, color: '#999', marginTop: 2 },
  backdrop:   { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 40 },
  sheet:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff',
                borderRadius: 20, padding: 24, zIndex: 50 },
  hero:       { width: '100%', height: 160, marginBottom: 18 },
  sheetTitle: { fontSize: 22, fontWeight: '700', letterSpacing: -0.4, marginBottom: 6 },
  btn:        { padding: 10, borderRadius: 10, alignItems: 'center' },
})`,
  },
]

const sharedElementFlutter: Step[] = [
  {
    title: 'List + detail route (static)',
    description: 'Create two screens — ItemList and ItemDetail. Use Navigator.push to navigate between them. No Hero yet — just establish the two-screen structure.',
    code: `import 'package:flutter/material.dart';

const _items = [
  (id: 'a', color: Color(0xFF534AB7), title: 'Northern Lights', sub: 'Nature'),
  (id: 'b', color: Color(0xFF1D9E75), title: 'Forest Path',     sub: 'Outdoors'),
  (id: 'c', color: Color(0xFFD85A30), title: 'Desert Dunes',    sub: 'Travel'),
];

class ItemList extends StatelessWidget {
  const ItemList({super.key});

  @override
  Widget build(BuildContext context) => ListView.separated(
    padding: const EdgeInsets.all(16),
    itemCount: _items.length,
    separatorBuilder: (_, __) => const SizedBox(height: 10),
    itemBuilder: (_, i) {
      final it = _items[i];
      return GestureDetector(
        onTap: () => Navigator.push(context,
          MaterialPageRoute(builder: (_) => ItemDetail(item: it))),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFFAFAFA),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFEEEEEE))),
          child: Row(children: [
            // Plain container — no Hero yet
            Container(width: 48, height: 48,
              decoration: BoxDecoration(color: it.color, borderRadius: BorderRadius.circular(10))),
            const SizedBox(width: 12),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(it.title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              Text(it.sub,   style: const TextStyle(color: Colors.grey, fontSize: 11)),
            ]),
          ]),
        ),
      );
    },
  );
}

class ItemDetail extends StatelessWidget {
  final ({String id, Color color, String title, String sub}) item;
  const ItemDetail({super.key, required this.item});

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Container(width: double.infinity, height: 200,
          decoration: BoxDecoration(color: item.color, borderRadius: BorderRadius.circular(16))),
        const SizedBox(height: 20),
        Text(item.title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, letterSpacing: -0.5)),
        const SizedBox(height: 6),
        Text(item.sub, style: const TextStyle(color: Colors.grey, fontSize: 14)),
        const Spacer(),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: item.color, foregroundColor: Colors.white),
          onPressed: () => Navigator.pop(context),
          child: const Text('Back')),
      ]),
    )),
  );
}`,
  },
  {
    title: 'Wrap thumbnail in Hero',
    description: 'Add Hero(tag: ...) around the list thumbnail. The tag is the only shared identifier Flutter needs — nothing else changes.',
    code: `import 'package:flutter/material.dart';

const _items = [
  (id: 'a', color: Color(0xFF534AB7), title: 'Northern Lights', sub: 'Nature'),
  (id: 'b', color: Color(0xFF1D9E75), title: 'Forest Path',     sub: 'Outdoors'),
  (id: 'c', color: Color(0xFFD85A30), title: 'Desert Dunes',    sub: 'Travel'),
];

class ItemList extends StatelessWidget {
  const ItemList({super.key});

  @override
  Widget build(BuildContext context) => ListView.separated(
    padding: const EdgeInsets.all(16),
    itemCount: _items.length,
    separatorBuilder: (_, __) => const SizedBox(height: 10),
    itemBuilder: (_, i) {
      final it = _items[i];
      return GestureDetector(
        onTap: () => Navigator.push(context,
          MaterialPageRoute(builder: (_) => ItemDetail(item: it))),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFFAFAFA),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFEEEEEE))),
          child: Row(children: [
            // Hero wraps the thumbnail — tag must match the detail screen
            Hero(
              tag: 'hero-\${it.id}',
              child: Container(width: 48, height: 48,
                decoration: BoxDecoration(color: it.color, borderRadius: BorderRadius.circular(10))),
            ),
            const SizedBox(width: 12),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(it.title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              Text(it.sub,   style: const TextStyle(color: Colors.grey, fontSize: 11)),
            ]),
          ]),
        ),
      );
    },
  );
}

class ItemDetail extends StatelessWidget {
  final ({String id, Color color, String title, String sub}) item;
  const ItemDetail({super.key, required this.item});

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // No Hero here yet — plain container
        Container(width: double.infinity, height: 200,
          decoration: BoxDecoration(color: item.color, borderRadius: BorderRadius.circular(16))),
        const SizedBox(height: 20),
        Text(item.title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, letterSpacing: -0.5)),
        const SizedBox(height: 6),
        Text(item.sub, style: const TextStyle(color: Colors.grey, fontSize: 14)),
        const Spacer(),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: item.color, foregroundColor: Colors.white),
          onPressed: () => Navigator.pop(context),
          child: const Text('Back')),
      ]),
    )),
  );
}`,
  },
  {
    title: 'Wrap detail banner in Hero',
    description: 'Add the matching Hero(tag: ...) to the detail banner. Flutter now animates the element between the two positions automatically on push and pop.',
    code: `import 'package:flutter/material.dart';

const _items = [
  (id: 'a', color: Color(0xFF534AB7), title: 'Northern Lights', sub: 'Nature'),
  (id: 'b', color: Color(0xFF1D9E75), title: 'Forest Path',     sub: 'Outdoors'),
  (id: 'c', color: Color(0xFFD85A30), title: 'Desert Dunes',    sub: 'Travel'),
];

class ItemList extends StatelessWidget {
  const ItemList({super.key});

  @override
  Widget build(BuildContext context) => ListView.separated(
    padding: const EdgeInsets.all(16),
    itemCount: _items.length,
    separatorBuilder: (_, __) => const SizedBox(height: 10),
    itemBuilder: (_, i) {
      final it = _items[i];
      return GestureDetector(
        onTap: () => Navigator.push(context,
          MaterialPageRoute(builder: (_) => ItemDetail(item: it))),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFFAFAFA),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFEEEEEE))),
          child: Row(children: [
            Hero(
              tag: 'hero-\${it.id}',
              child: Container(width: 48, height: 48,
                decoration: BoxDecoration(color: it.color, borderRadius: BorderRadius.circular(10))),
            ),
            const SizedBox(width: 12),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(it.title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              Text(it.sub,   style: const TextStyle(color: Colors.grey, fontSize: 11)),
            ]),
          ]),
        ),
      );
    },
  );
}

class ItemDetail extends StatelessWidget {
  final ({String id, Color color, String title, String sub}) item;
  const ItemDetail({super.key, required this.item});

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        // Matching Hero tag — Flutter flies the element here on navigation
        Hero(
          tag: 'hero-\${item.id}',
          child: Container(width: double.infinity, height: 200,
            decoration: BoxDecoration(color: item.color, borderRadius: BorderRadius.circular(16))),
        ),
        const SizedBox(height: 20),
        Text(item.title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, letterSpacing: -0.5)),
        const SizedBox(height: 6),
        Text(item.sub, style: const TextStyle(color: Colors.grey, fontSize: 14)),
        const Spacer(),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: item.color, foregroundColor: Colors.white),
          onPressed: () => Navigator.pop(context),
          child: const Text('Back')),
      ]),
    )),
  );
}`,
  },
  {
    title: 'Custom FlightShuttleBuilder for border radius morph',
    description: 'The default Hero flight widget clips at its source shape. Override flightShuttleBuilder to interpolate borderRadius during the flight so the thumbnail rounds out to the full banner shape.',
    code: `import 'package:flutter/material.dart';

const _items = [
  (id: 'a', color: Color(0xFF534AB7), title: 'Northern Lights', sub: 'Nature'),
  (id: 'b', color: Color(0xFF1D9E75), title: 'Forest Path',     sub: 'Outdoors'),
  (id: 'c', color: Color(0xFFD85A30), title: 'Desert Dunes',    sub: 'Travel'),
];

// Interpolates border radius during the Hero flight
Widget _heroFlight(BuildContext flightContext, Animation<double> animation,
    HeroFlightDirection direction, BuildContext from, BuildContext to) {
  final radius = BorderRadiusTween(
    begin: BorderRadius.circular(10),
    end:   BorderRadius.circular(16),
  ).animate(CurvedAnimation(parent: animation, curve: Curves.easeOut));

  return AnimatedBuilder(
    animation: animation,
    builder: (_, __) => ClipRRect(
      borderRadius: direction == HeroFlightDirection.push
          ? radius.value!
          : radius.value!.flipped,  // reverse on pop
      child: to.widget,
    ),
  );
}

class ItemList extends StatelessWidget {
  const ItemList({super.key});

  @override
  Widget build(BuildContext context) => ListView.separated(
    padding: const EdgeInsets.all(16),
    itemCount: _items.length,
    separatorBuilder: (_, __) => const SizedBox(height: 10),
    itemBuilder: (_, i) {
      final it = _items[i];
      return GestureDetector(
        onTap: () => Navigator.push(context,
          MaterialPageRoute(builder: (_) => ItemDetail(item: it))),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: const Color(0xFFFAFAFA),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFEEEEEE))),
          child: Row(children: [
            Hero(
              tag: 'hero-\${it.id}',
              flightShuttleBuilder: _heroFlight,
              child: Container(width: 48, height: 48,
                decoration: BoxDecoration(color: it.color, borderRadius: BorderRadius.circular(10))),
            ),
            const SizedBox(width: 12),
            Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(it.title, style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
              Text(it.sub,   style: const TextStyle(color: Colors.grey, fontSize: 11)),
            ]),
          ]),
        ),
      );
    },
  );
}

class ItemDetail extends StatelessWidget {
  final ({String id, Color color, String title, String sub}) item;
  const ItemDetail({super.key, required this.item});

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(child: Padding(
      padding: const EdgeInsets.all(24),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Hero(
          tag: 'hero-\${item.id}',
          flightShuttleBuilder: _heroFlight,
          child: Container(width: double.infinity, height: 200,
            decoration: BoxDecoration(color: item.color, borderRadius: BorderRadius.circular(16))),
        ),
        const SizedBox(height: 20),
        Text(item.title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w700, letterSpacing: -0.5)),
        const SizedBox(height: 6),
        Text(item.sub, style: const TextStyle(color: Colors.grey, fontSize: 14)),
        const Spacer(),
        ElevatedButton(
          style: ElevatedButton.styleFrom(backgroundColor: item.color, foregroundColor: Colors.white),
          onPressed: () => Navigator.pop(context),
          child: const Text('Back')),
      ]),
    )),
  );
}`,
  },
]

const sharedElement: StepMap = {
  react:          sharedElementReact,
  nextjs:         sharedElementNextjs,
  vue:            sharedElementVue,
  'react-native': sharedElementRN,
  flutter:        sharedElementFlutter,
}

/* ─────────────────────────────────────────────────────────────────── */
/*  10. Collapsing Header                                               */
/* ─────────────────────────────────────────────────────────────────── */

const collapsingHeaderReact: Step[] = [
  {
    title: 'Static header',
    description: 'Build the header layout with avatar, title, and search bar. Scroll the content below — nothing collapses yet.',
    code: `export function CollapsingHeader() {
  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 10,
        padding: '20px 16px', background: 'var(--bg)',
        borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: '#534AB7', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Profile</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>@username · 128 posts</div>
          </div>
        </div>
        <div style={{ padding: '7px 12px', borderRadius: 10,
          border: '1px solid var(--border)', background: 'var(--bg-secondary)',
          fontSize: 12, color: 'var(--text-tertiary)' }}>Search posts...</div>
      </header>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 10,
            border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div style={{ width: 80, height: 7, borderRadius: 4, background: 'var(--border-strong)', marginBottom: 8 }} />
            <div style={{ width: '90%', height: 6, borderRadius: 3, background: 'var(--border)', marginBottom: 5 }} />
            <div style={{ width: '70%', height: 6, borderRadius: 3, background: 'var(--border)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    title: 'Track scroll with useScroll',
    description: 'Attach a ref to the scroll container and pass it to useScroll. Log scrollY to confirm it tracks the container, not the page.',
    code: `import { useRef } from 'react'
import { useScroll } from 'framer-motion'

export function CollapsingHeader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ container: containerRef })

  // Confirm scroll tracking in dev
  // scrollY.on('change', v => console.log(v))

  return (
    <div ref={containerRef} style={{ height: '100%', overflowY: 'auto' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 10,
        padding: '20px 16px', background: 'var(--bg)',
        borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <div style={{ width: 44, height: 44, borderRadius: 22, background: '#534AB7', flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Profile</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>@username · 128 posts</div>
          </div>
        </div>
        <div style={{ padding: '7px 12px', borderRadius: 10,
          border: '1px solid var(--border)', background: 'var(--bg-secondary)',
          fontSize: 12, color: 'var(--text-tertiary)' }}>Search posts...</div>
      </header>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 10,
            border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div style={{ width: 80, height: 7, borderRadius: 4, background: 'var(--border-strong)', marginBottom: 8 }} />
            <div style={{ width: '90%', height: 6, borderRadius: 3, background: 'var(--border)', marginBottom: 5 }} />
            <div style={{ width: '70%', height: 6, borderRadius: 3, background: 'var(--border)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    title: 'useTransform — search fades, avatar shrinks',
    description: 'Map scrollY 0→120px to avatar scale (1→0.55) and search opacity (1→0). useTransform clamps automatically — scrolling past 120px holds the values at their endpoints.',
    code: `import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function CollapsingHeader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY }  = useScroll({ container: containerRef })

  const avatarScale = useTransform(scrollY, [0, 120], [1, 0.55])
  const searchOp    = useTransform(scrollY, [0, 80],  [1, 0])

  return (
    <div ref={containerRef} style={{ height: '100%', overflowY: 'auto' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 10,
        padding: '20px 16px', background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <motion.div style={{ scale: avatarScale, transformOrigin: 'left center', flexShrink: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: '#534AB7' }} />
          </motion.div>
          <div>
            <div style={{ fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>Profile</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>@username · 128 posts</div>
          </div>
        </div>
        <motion.div style={{ opacity: searchOp }}>
          <div style={{ padding: '7px 12px', borderRadius: 10,
            border: '1px solid var(--border)', background: 'var(--bg-secondary)',
            fontSize: 12, color: 'var(--text-tertiary)' }}>Search posts...</div>
        </motion.div>
      </header>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 10,
            border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div style={{ width: 80, height: 7, borderRadius: 4, background: 'var(--border-strong)', marginBottom: 8 }} />
            <div style={{ width: '90%', height: 6, borderRadius: 3, background: 'var(--border)', marginBottom: 5 }} />
            <div style={{ width: '70%', height: 6, borderRadius: 3, background: 'var(--border)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    title: 'Title font size + padding sync',
    description: 'Add useTransform for header padding (20→10px) and title font size (22→14px). All four transforms share the same scrollY — perfect synchronisation with no extra state.',
    code: `import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function CollapsingHeader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY }  = useScroll({ container: containerRef })

  const headerPadY  = useTransform(scrollY, [0, 120], [20, 10])
  const avatarScale = useTransform(scrollY, [0, 120], [1, 0.55])
  const titleSize   = useTransform(scrollY, [0, 120], [22, 14])
  const searchOp    = useTransform(scrollY, [0, 80],  [1, 0])

  return (
    <div ref={containerRef} style={{ height: '100%', overflowY: 'auto' }}>
      <motion.header style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        paddingLeft: 16, paddingRight: 16,
        paddingTop: headerPadY, paddingBottom: headerPadY,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
          <motion.div style={{ scale: avatarScale, transformOrigin: 'left center', flexShrink: 0 }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: '#534AB7' }} />
          </motion.div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <motion.div style={{
              fontSize: titleSize, color: 'var(--text-primary)',
              fontFamily: 'var(--font-power)', letterSpacing: '-0.02em',
              lineHeight: 1.2, whiteSpace: 'nowrap',
            }}>Profile</motion.div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>@username · 128 posts</div>
          </div>
        </div>
        <motion.div style={{ opacity: searchOp, pointerEvents: 'none' }}>
          <div style={{ padding: '7px 12px', borderRadius: 10,
            border: '1px solid var(--border)', background: 'var(--bg-secondary)',
            fontFamily: 'var(--font-outfit)', fontSize: 12, color: 'var(--text-tertiary)' }}>
            Search posts...
          </div>
        </motion.div>
      </motion.header>

      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{ padding: 14, borderRadius: 10,
            border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
            <div style={{ width: 80, height: 7, borderRadius: 4, background: 'var(--border-strong)', marginBottom: 8 }} />
            <div style={{ width: '90%', height: 6, borderRadius: 3, background: 'var(--border)', marginBottom: 5 }} />
            <div style={{ width: '70%', height: 6, borderRadius: 3, background: 'var(--border)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}`,
  },
]

const collapsingHeaderNextjs: Step[] = [
  {
    title: 'Static header layout',
    description: "Add 'use client' — any component that uses scroll hooks must be a Client Component in App Router. Build the static header and scrollable content area first.",
    code: `'use client'

export function CollapsingHeaderDemo() {
  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '20px 16px 16px',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, #534AB7, #7C3AED)',
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Alex Rivera</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>UX Designer · San Francisco</div>
          </div>
        </div>
        <div style={{
          height: 34, borderRadius: 8,
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 12px',
          fontSize: 13, color: 'var(--text-tertiary)',
        }}>
          Search posts…
        </div>
      </div>

      {/* Content */}
      <div style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 130 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{
            margin: '0 16px 12px',
            padding: 16,
            borderRadius: 12,
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)',
          }}>
            Post {i + 1} — Scroll up to collapse the header.
          </div>
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    title: 'useScroll setup',
    description: 'Import useScroll and useRef from framer-motion and react. Attach a containerRef to the scrollable div and pass it to useScroll — this scopes the scroll tracking to the container, not the page.',
    code: `'use client'
import { useRef } from 'react'
import { useScroll } from 'framer-motion'

export function CollapsingHeaderDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ container: containerRef })

  // scrollY.get() now tracks the container's scroll position
  // Next step: feed scrollY into useTransform to drive visual changes

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '20px 16px 16px',
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, #534AB7, #7C3AED)',
            flexShrink: 0,
          }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Alex Rivera</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>UX Designer · San Francisco</div>
          </div>
        </div>
        <div style={{
          height: 34, borderRadius: 8,
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 12px',
          fontSize: 13, color: 'var(--text-tertiary)',
        }}>
          Search posts…
        </div>
      </div>

      {/* Attach ref — useScroll watches this element's scrollTop */}
      <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 130 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{
            margin: '0 16px 12px', padding: 16, borderRadius: 12,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)',
          }}>
            Post {i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    title: 'Avatar scale + search opacity',
    description: 'Feed scrollY into useTransform to shrink the avatar and hide the search bar as the user scrolls. Convert the header and avatar divs to motion elements.',
    code: `'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function CollapsingHeaderDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY }  = useScroll({ container: containerRef })

  const avatarScale    = useTransform(scrollY, [0, 120], [1, 0.6])
  const searchOpacity  = useTransform(scrollY, [0, 80],  [1, 0])
  const searchHeight   = useTransform(scrollY, [0, 80],  [34, 0])

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        padding: '20px 16px 16px',
        background: 'var(--bg)', borderBottom: '1px solid var(--border)', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <motion.div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, #534AB7, #7C3AED)',
            flexShrink: 0, scale: avatarScale,
            transformOrigin: 'left center',
          }} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>Alex Rivera</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>UX Designer · San Francisco</div>
          </div>
        </div>
        <motion.div style={{
          height: searchHeight, opacity: searchOpacity, overflow: 'hidden',
          borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 12px',
          fontSize: 13, color: 'var(--text-tertiary)',
        }}>
          Search posts…
        </motion.div>
      </div>

      <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 130 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{
            margin: '0 16px 12px', padding: 16, borderRadius: 12,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)',
          }}>
            Post {i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}`,
  },
  {
    title: 'Title font size + padding sync',
    description: 'Add title font size and header padding transforms so the header compresses smoothly. Export from a "use client" component file — any Server Component page imports it directly.',
    code: `'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Export from app/components/CollapsingHeaderDemo.tsx
// Any Server page: import { CollapsingHeaderDemo } from '@/components/CollapsingHeaderDemo'
export function CollapsingHeaderDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY }  = useScroll({ container: containerRef })

  const avatarScale   = useTransform(scrollY, [0, 120], [1, 0.6])
  const searchOpacity = useTransform(scrollY, [0, 80],  [1, 0])
  const searchHeight  = useTransform(scrollY, [0, 80],  [34, 0])
  const titleSize     = useTransform(scrollY, [0, 120], [16, 13])
  const headerPadY    = useTransform(scrollY, [0, 120], [20, 10])

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      <motion.div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        paddingTop: headerPadY, paddingBottom: headerPadY,
        paddingLeft: 16, paddingRight: 16,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)', zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <motion.div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'linear-gradient(135deg, #534AB7, #7C3AED)',
            flexShrink: 0, scale: avatarScale, transformOrigin: 'left center',
          }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <motion.div style={{
              fontSize: titleSize, fontWeight: 700, color: 'var(--text-primary)',
            }}>
              Alex Rivera
            </motion.div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
              UX Designer · San Francisco
            </div>
          </div>
        </div>
        <motion.div style={{
          height: searchHeight, opacity: searchOpacity, overflow: 'hidden',
          borderRadius: 8, background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', padding: '0 12px',
          fontSize: 13, color: 'var(--text-tertiary)',
        }}>
          Search posts…
        </motion.div>
      </motion.div>

      <div ref={containerRef} style={{ position: 'absolute', inset: 0, overflowY: 'auto', paddingTop: 130 }}>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} style={{
            margin: '0 16px 12px', padding: 16, borderRadius: 12,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)',
          }}>
            Post {i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}`,
  },
]

const collapsingHeaderVue: Step[] = [
  {
    title: 'Static header layout',
    description: 'Build the static header and scrollable list in Vue. The header has an avatar row and a search bar. No scroll tracking yet — just the visual structure.',
    code: `<template>
  <div class="root">
    <div class="header">
      <div class="profile-row">
        <div class="avatar" />
        <div class="meta">
          <strong>Alex Rivera</strong>
          <span>UX Designer · San Francisco</span>
        </div>
      </div>
      <div class="search">Search posts…</div>
    </div>

    <div class="feed">
      <div v-for="i in 12" :key="i" class="card">Post {{ i }} — scroll to collapse the header.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No JS needed yet
</script>

<style scoped>
.root    { position: relative; height: 100%; overflow: hidden; font-family: sans-serif; }
.header  { position: absolute; top: 0; left: 0; right: 0; padding: 20px 16px 16px;
           background: var(--bg); border-bottom: 1px solid var(--border); z-index: 10; }
.profile-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.avatar  { width: 48px; height: 48px; border-radius: 50%;
           background: linear-gradient(135deg, #534AB7, #7C3AED); flex-shrink: 0; }
.meta    { display: flex; flex-direction: column; gap: 3px; font-size: 13px; color: var(--text-secondary); }
.meta strong { font-size: 16px; color: var(--text-primary); }
.search  { height: 34px; border-radius: 8px; background: var(--bg-secondary);
           border: 1px solid var(--border); display: flex; align-items: center;
           padding: 0 12px; font-size: 13px; color: var(--text-tertiary); }
.feed    { position: absolute; inset: 0; overflow-y: auto; padding-top: 130px; }
.card    { margin: 0 16px 12px; padding: 16px; border-radius: 12px;
           background: var(--bg-secondary); border: 1px solid var(--border);
           font-size: 13px; line-height: 1.6; color: var(--text-primary); }
</style>`,
  },
  {
    title: 'Track scroll with @vueuse/core useScroll',
    description: 'Add a templateRef for the feed div and use useScroll from @vueuse/core to reactively track its scrollTop. No visual change yet — log scrollTop to verify.',
    code: `<template>
  <div class="root">
    <div class="header">
      <div class="profile-row">
        <div class="avatar" />
        <div class="meta">
          <strong>Alex Rivera</strong>
          <span>UX Designer · San Francisco</span>
        </div>
      </div>
      <div class="search">Search posts…</div>
    </div>

    <!-- attach ref here -->
    <div ref="feedRef" class="feed">
      <div v-for="i in 12" :key="i" class="card">
        Post {{ i }} — scrollY: {{ Math.round(y) }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useScroll } from '@vueuse/core'

const feedRef = ref<HTMLElement | null>(null)
const { y }   = useScroll(feedRef)
// y is a reactive number — bind it to CSS in the next step
</script>

<style scoped>
.root    { position: relative; height: 100%; overflow: hidden; font-family: sans-serif; }
.header  { position: absolute; top: 0; left: 0; right: 0; padding: 20px 16px 16px;
           background: var(--bg); border-bottom: 1px solid var(--border); z-index: 10; }
.profile-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.avatar  { width: 48px; height: 48px; border-radius: 50%;
           background: linear-gradient(135deg, #534AB7, #7C3AED); flex-shrink: 0; }
.meta    { display: flex; flex-direction: column; gap: 3px; font-size: 13px; color: var(--text-secondary); }
.meta strong { font-size: 16px; color: var(--text-primary); }
.search  { height: 34px; border-radius: 8px; background: var(--bg-secondary);
           border: 1px solid var(--border); display: flex; align-items: center;
           padding: 0 12px; font-size: 13px; color: var(--text-tertiary); }
.feed    { position: absolute; inset: 0; overflow-y: auto; padding-top: 130px; }
.card    { margin: 0 16px 12px; padding: 16px; border-radius: 12px;
           background: var(--bg-secondary); border: 1px solid var(--border);
           font-size: 13px; line-height: 1.6; color: var(--text-primary); }
</style>`,
  },
  {
    title: 'Avatar scale + search opacity via computed',
    description: 'Write lerp() helper computed values that map scrollY [0→120] to the CSS property range. Bind them to inline styles on the avatar and search bar.',
    code: `<template>
  <div class="root">
    <div class="header" :style="{ paddingTop: headerPadY + 'px', paddingBottom: headerPadY + 'px' }">
      <div class="profile-row">
        <div class="avatar" :style="{ transform: \`scale(\${avatarScale})\` }" />
        <div class="meta">
          <strong :style="{ fontSize: titleSize + 'px' }">Alex Rivera</strong>
          <span>UX Designer · San Francisco</span>
        </div>
      </div>
      <div class="search"
        :style="{ height: searchHeight + 'px', opacity: searchOpacity, overflow: 'hidden' }">
        Search posts…
      </div>
    </div>

    <div ref="feedRef" class="feed">
      <div v-for="i in 12" :key="i" class="card">Post {{ i }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScroll } from '@vueuse/core'

const feedRef = ref<HTMLElement | null>(null)
const { y }   = useScroll(feedRef)

// Clamp y between 0 and max, then lerp from start to end
function lerp(yVal: number, max: number, start: number, end: number) {
  const t = Math.min(Math.max(yVal / max, 0), 1)
  return start + (end - start) * t
}

const avatarScale   = computed(() => lerp(y.value, 120, 1,    0.6))
const searchOpacity = computed(() => lerp(y.value, 80,  1,    0))
const searchHeight  = computed(() => lerp(y.value, 80,  34,   0))
const titleSize     = computed(() => lerp(y.value, 120, 16,   13))
const headerPadY    = computed(() => lerp(y.value, 120, 20,   10))
</script>

<style scoped>
.root    { position: relative; height: 100%; overflow: hidden; font-family: sans-serif; }
.header  { position: absolute; top: 0; left: 0; right: 0; padding-left: 16px; padding-right: 16px;
           background: var(--bg); border-bottom: 1px solid var(--border); z-index: 10;
           transition: none; }
.profile-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.avatar  { width: 48px; height: 48px; border-radius: 50%;
           background: linear-gradient(135deg, #534AB7, #7C3AED); flex-shrink: 0;
           transform-origin: left center; }
.meta    { display: flex; flex-direction: column; gap: 3px; color: var(--text-secondary); }
.meta strong { color: var(--text-primary); font-weight: 700; }
.search  { border-radius: 8px; background: var(--bg-secondary); border: 1px solid var(--border);
           display: flex; align-items: center; padding: 0 12px;
           font-size: 13px; color: var(--text-tertiary); }
.feed    { position: absolute; inset: 0; overflow-y: auto; padding-top: 130px; }
.card    { margin: 0 16px 12px; padding: 16px; border-radius: 12px;
           background: var(--bg-secondary); border: 1px solid var(--border);
           font-size: 13px; line-height: 1.6; color: var(--text-primary); }
</style>`,
  },
  {
    title: 'Dynamic paddingTop + smooth transition fallback',
    description: 'Drive paddingTop on the feed div from computed headerHeight so content never hides under the collapsing header. Add will-change: transform for GPU compositing.',
    code: `<template>
  <div class="root">
    <div ref="headerRef" class="header"
      :style="{ paddingTop: headerPadY + 'px', paddingBottom: headerPadY + 'px' }">
      <div class="profile-row">
        <div class="avatar"
          :style="{ transform: \`scale(\${avatarScale})\`, willChange: 'transform' }" />
        <div class="meta">
          <strong :style="{ fontSize: titleSize + 'px' }">Alex Rivera</strong>
          <span>UX Designer · San Francisco</span>
        </div>
      </div>
      <div class="search"
        :style="{ height: searchHeight + 'px', opacity: searchOpacity, overflow: 'hidden' }">
        Search posts…
      </div>
    </div>

    <div ref="feedRef" class="feed" :style="{ paddingTop: feedPad + 'px' }">
      <div v-for="i in 12" :key="i" class="card">
        Post {{ i }} — scroll down to collapse the header.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScroll, useElementSize } from '@vueuse/core'

const feedRef   = ref<HTMLElement | null>(null)
const headerRef = ref<HTMLElement | null>(null)
const { y }     = useScroll(feedRef)
const { height: headerHeight } = useElementSize(headerRef)

function lerp(yVal: number, max: number, start: number, end: number) {
  const t = Math.min(Math.max(yVal / max, 0), 1)
  return start + (end - start) * t
}

const avatarScale   = computed(() => lerp(y.value, 120, 1,  0.6))
const searchOpacity = computed(() => lerp(y.value, 80,  1,  0))
const searchHeight  = computed(() => lerp(y.value, 80,  34, 0))
const titleSize     = computed(() => lerp(y.value, 120, 16, 13))
const headerPadY    = computed(() => lerp(y.value, 120, 20, 10))
const feedPad       = computed(() => headerHeight.value || 130)
</script>

<style scoped>
.root    { position: relative; height: 100%; overflow: hidden; font-family: sans-serif; }
.header  { position: absolute; top: 0; left: 0; right: 0; padding-left: 16px; padding-right: 16px;
           background: var(--bg); border-bottom: 1px solid var(--border); z-index: 10; }
.profile-row { display: flex; align-items: center; gap: 12px; margin-bottom: 14px; }
.avatar  { width: 48px; height: 48px; border-radius: 50%;
           background: linear-gradient(135deg, #534AB7, #7C3AED); flex-shrink: 0;
           transform-origin: left center; }
.meta    { display: flex; flex-direction: column; gap: 3px; color: var(--text-secondary); }
.meta strong { color: var(--text-primary); font-weight: 700; }
.search  { border-radius: 8px; background: var(--bg-secondary); border: 1px solid var(--border);
           display: flex; align-items: center; padding: 0 12px;
           font-size: 13px; color: var(--text-tertiary); }
.feed    { position: absolute; inset: 0; overflow-y: auto; }
.card    { margin: 0 16px 12px; padding: 16px; border-radius: 12px;
           background: var(--bg-secondary); border: 1px solid var(--border);
           font-size: 13px; line-height: 1.6; color: var(--text-primary); }
</style>`,
  },
]

const collapsingHeaderRN: Step[] = [
  {
    title: 'Static header + FlatList',
    description: 'Render the static profile header above a FlatList. Use position: absolute for the header and a paddingTop on the FlatList so content starts below it. No animation yet.',
    code: `import { View, Text, FlatList, StyleSheet } from 'react-native'

const POSTS = Array.from({ length: 20 }, (_, i) => ({ id: String(i), text: \`Post \${i + 1}\` }))

export function CollapsingHeaderDemo() {
  return (
    <View style={s.root}>
      {/* Static header */}
      <View style={s.header}>
        <View style={s.profileRow}>
          <View style={s.avatar} />
          <View style={s.meta}>
            <Text style={s.name}>Alex Rivera</Text>
            <Text style={s.sub}>UX Designer · San Francisco</Text>
          </View>
        </View>
        <View style={s.search}>
          <Text style={s.searchTxt}>Search posts…</Text>
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={POSTS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingTop: 130 }}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.cardTxt}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  )
}

const s = StyleSheet.create({
  root:       { flex: 1 },
  header:     { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
                padding: 16, paddingTop: 20, backgroundColor: '#fff',
                borderBottomWidth: 1, borderBottomColor: '#eee' },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar:     { width: 48, height: 48, borderRadius: 24, backgroundColor: '#534AB7' },
  meta:       { flex: 1 },
  name:       { fontSize: 16, fontWeight: '700', color: '#111' },
  sub:        { fontSize: 12, color: '#888', marginTop: 2 },
  search:     { height: 34, borderRadius: 8, backgroundColor: '#f3f3f5',
                borderWidth: 1, borderColor: '#e0e0e0',
                justifyContent: 'center', paddingHorizontal: 12 },
  searchTxt:  { fontSize: 13, color: '#aaa' },
  card:       { marginHorizontal: 16, marginBottom: 12, padding: 16,
                borderRadius: 12, backgroundColor: '#fafafa',
                borderWidth: 1, borderColor: '#eee' },
  cardTxt:    { fontSize: 13, lineHeight: 20, color: '#222' },
})`,
  },
  {
    title: 'Animated.event scroll tracking',
    description: 'Replace FlatList with Animated.FlatList and wire onScroll to an Animated.Value with useNativeDriver. The animated value now tracks the scroll position on the UI thread.',
    code: `import { useRef } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Animated from 'react-native-reanimated'
// OR using built-in Animated:
import { Animated as RNAnimated, FlatList } from 'react-native'

const POSTS = Array.from({ length: 20 }, (_, i) => ({ id: String(i), text: \`Post \${i + 1}\` }))

export function CollapsingHeaderDemo() {
  const scrollY = useRef(new RNAnimated.Value(0)).current

  return (
    <View style={s.root}>
      <View style={s.header}>
        <View style={s.profileRow}>
          <View style={s.avatar} />
          <View style={s.meta}>
            <Text style={s.name}>Alex Rivera</Text>
            <Text style={s.sub}>UX Designer · San Francisco</Text>
          </View>
        </View>
        <View style={s.search}>
          <Text style={s.searchTxt}>Search posts…</Text>
        </View>
      </View>

      <Animated.FlatList
        data={POSTS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingTop: 130 }}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }  // runs on UI thread — no JS bridge per frame
        )}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.cardTxt}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  )
}

const s = StyleSheet.create({
  root:       { flex: 1 },
  header:     { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
                padding: 16, paddingTop: 20, backgroundColor: '#fff',
                borderBottomWidth: 1, borderBottomColor: '#eee' },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar:     { width: 48, height: 48, borderRadius: 24, backgroundColor: '#534AB7' },
  meta:       { flex: 1 },
  name:       { fontSize: 16, fontWeight: '700', color: '#111' },
  sub:        { fontSize: 12, color: '#888', marginTop: 2 },
  search:     { height: 34, borderRadius: 8, backgroundColor: '#f3f3f5',
                borderWidth: 1, borderColor: '#e0e0e0',
                justifyContent: 'center', paddingHorizontal: 12 },
  searchTxt:  { fontSize: 13, color: '#aaa' },
  card:       { marginHorizontal: 16, marginBottom: 12, padding: 16,
                borderRadius: 12, backgroundColor: '#fafafa',
                borderWidth: 1, borderColor: '#eee' },
  cardTxt:    { fontSize: 13, lineHeight: 20, color: '#222' },
})`,
  },
  {
    title: 'interpolate avatar scale + search opacity',
    description: 'Call scrollY.interpolate() to map the raw scroll offset to the CSS property range. Wrap avatar and search in Animated.View and bind the interpolated values.',
    code: `import { useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'

const POSTS = Array.from({ length: 20 }, (_, i) => ({ id: String(i), text: \`Post \${i + 1}\` }))

export function CollapsingHeaderDemo() {
  const scrollY = useRef(new Animated.Value(0)).current

  const avatarScale   = scrollY.interpolate({ inputRange: [0, 120], outputRange: [1, 0.6],     extrapolate: 'clamp' })
  const searchOpacity = scrollY.interpolate({ inputRange: [0, 80],  outputRange: [1, 0],       extrapolate: 'clamp' })
  const searchHeight  = scrollY.interpolate({ inputRange: [0, 80],  outputRange: [34, 0],      extrapolate: 'clamp' })

  return (
    <View style={s.root}>
      <View style={s.header}>
        <View style={s.profileRow}>
          {/* Drive scale with interpolated value */}
          <Animated.View style={[s.avatar, { transform: [{ scale: avatarScale }] }]} />
          <View style={s.meta}>
            <Text style={s.name}>Alex Rivera</Text>
            <Text style={s.sub}>UX Designer · San Francisco</Text>
          </View>
        </View>
        {/* Clamp height to 0 so it collapses without a ghost gap */}
        <Animated.View style={[s.search, { height: searchHeight, opacity: searchOpacity, overflow: 'hidden' }]}>
          <Text style={s.searchTxt}>Search posts…</Text>
        </Animated.View>
      </View>

      <Animated.FlatList
        data={POSTS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingTop: 130 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }  // useNativeDriver: false needed for height interpolation
        )}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.cardTxt}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  )
}

const s = StyleSheet.create({
  root:       { flex: 1 },
  header:     { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
                padding: 16, paddingTop: 20, backgroundColor: '#fff',
                borderBottomWidth: 1, borderBottomColor: '#eee' },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar:     { width: 48, height: 48, borderRadius: 24, backgroundColor: '#534AB7' },
  meta:       { flex: 1 },
  name:       { fontSize: 16, fontWeight: '700', color: '#111' },
  sub:        { fontSize: 12, color: '#888', marginTop: 2 },
  search:     { borderRadius: 8, backgroundColor: '#f3f3f5',
                borderWidth: 1, borderColor: '#e0e0e0',
                justifyContent: 'center', paddingHorizontal: 12 },
  searchTxt:  { fontSize: 13, color: '#aaa' },
  card:       { marginHorizontal: 16, marginBottom: 12, padding: 16,
                borderRadius: 12, backgroundColor: '#fafafa',
                borderWidth: 1, borderColor: '#eee' },
  cardTxt:    { fontSize: 13, lineHeight: 20, color: '#222' },
})`,
  },
  {
    title: 'Title size + padding sync',
    description: 'Add interpolations for title font size and header padding so the entire header compresses smoothly. Switch avatar scale to useNativeDriver: true by separating opacity/height onto a JS-driven value.',
    code: `import { useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'

const POSTS = Array.from({ length: 20 }, (_, i) => ({ id: String(i), text: \`Post \${i + 1}\` }))

export function CollapsingHeaderDemo() {
  // Two separate Animated.Values: one for GPU driver (transform), one for JS (layout)
  const scrollNative = useRef(new Animated.Value(0)).current
  const scrollJS     = useRef(new Animated.Value(0)).current

  const avatarScale   = scrollNative.interpolate({ inputRange: [0, 120], outputRange: [1, 0.6],  extrapolate: 'clamp' })
  const searchOpacity = scrollJS.interpolate({     inputRange: [0, 80],  outputRange: [1, 0],    extrapolate: 'clamp' })
  const searchHeight  = scrollJS.interpolate({     inputRange: [0, 80],  outputRange: [34, 0],   extrapolate: 'clamp' })
  const titleSize     = scrollJS.interpolate({     inputRange: [0, 120], outputRange: [16, 13],  extrapolate: 'clamp' })
  const headerPadY    = scrollJS.interpolate({     inputRange: [0, 120], outputRange: [20, 10],  extrapolate: 'clamp' })

  function handleScroll(e: any) {
    const y = e.nativeEvent.contentOffset.y
    scrollNative.setValue(y)
    scrollJS.setValue(y)
  }

  return (
    <View style={s.root}>
      <Animated.View style={[s.header, { paddingVertical: headerPadY }]}>
        <View style={s.profileRow}>
          <Animated.View style={[s.avatar, { transform: [{ scale: avatarScale }] }]} />
          <View style={s.meta}>
            <Animated.Text style={[s.name, { fontSize: titleSize }]}>Alex Rivera</Animated.Text>
            <Text style={s.sub}>UX Designer · San Francisco</Text>
          </View>
        </View>
        <Animated.View style={[s.search, { height: searchHeight, opacity: searchOpacity, overflow: 'hidden' }]}>
          <Text style={s.searchTxt}>Search posts…</Text>
        </Animated.View>
      </Animated.View>

      <Animated.FlatList
        data={POSTS}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingTop: 130 }}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={s.card}>
            <Text style={s.cardTxt}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  )
}

const s = StyleSheet.create({
  root:       { flex: 1 },
  header:     { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
                paddingHorizontal: 16, backgroundColor: '#fff',
                borderBottomWidth: 1, borderBottomColor: '#eee' },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  avatar:     { width: 48, height: 48, borderRadius: 24, backgroundColor: '#534AB7',
                transformOrigin: 'left' },
  meta:       { flex: 1 },
  name:       { fontWeight: '700', color: '#111' },
  sub:        { fontSize: 12, color: '#888', marginTop: 2 },
  search:     { borderRadius: 8, backgroundColor: '#f3f3f5',
                borderWidth: 1, borderColor: '#e0e0e0',
                justifyContent: 'center', paddingHorizontal: 12 },
  searchTxt:  { fontSize: 13, color: '#aaa' },
  card:       { marginHorizontal: 16, marginBottom: 12, padding: 16,
                borderRadius: 12, backgroundColor: '#fafafa',
                borderWidth: 1, borderColor: '#eee' },
  cardTxt:    { fontSize: 13, lineHeight: 20, color: '#222' },
})`,
  },
]

const collapsingHeaderFlutter: Step[] = [
  {
    title: 'Static SliverAppBar layout',
    description: 'Use CustomScrollView with SliverAppBar and SliverList. SliverAppBar handles the collapsing header — expandedHeight sets its max size.',
    code: `import 'package:flutter/material.dart';

class CollapsingHeaderDemo extends StatelessWidget {
  const CollapsingHeaderDemo({super.key});

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: 130,
          floating: false,
          pinned: true,              // keeps a compact bar visible when scrolled
          backgroundColor: Colors.white,
          flexibleSpace: FlexibleSpaceBar(
            background: Padding(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    const CircleAvatar(
                      radius: 24,
                      backgroundColor: Color(0xFF534AB7),
                    ),
                    const SizedBox(width: 12),
                    Column(crossAxisAlignment: CrossAxisAlignment.start, children: const [
                      Text('Alex Rivera',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                      SizedBox(height: 2),
                      Text('UX Designer · San Francisco',
                        style: TextStyle(fontSize: 12, color: Colors.grey)),
                    ]),
                  ]),
                  const SizedBox(height: 14),
                  Container(
                    height: 34,
                    decoration: BoxDecoration(
                      color: const Color(0xFFF3F3F5),
                      borderRadius: BorderRadius.circular(8),
                      border: Border.all(color: const Color(0xFFE0E0E0)),
                    ),
                    alignment: Alignment.centerLeft,
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    child: const Text('Search posts…',
                      style: TextStyle(fontSize: 13, color: Colors.grey)),
                  ),
                ],
              ),
            ),
          ),
        ),
        SliverList(delegate: SliverChildBuilderDelegate(
          (_, i) => Container(
            margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFFAFAFA),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFEEEEEE)),
            ),
            child: Text('Post \${i + 1}',
              style: const TextStyle(fontSize: 13, height: 1.6)),
          ),
          childCount: 20,
        )),
      ],
    );
  }
}`,
  },
  {
    title: 'LayoutBuilder to read collapse ratio',
    description: 'Wrap FlexibleSpaceBar content in a LayoutBuilder. The availableHeight vs expandedHeight ratio gives a t value (0 = expanded, 1 = fully collapsed) for manual interpolation.',
    code: `import 'package:flutter/material.dart';

class CollapsingHeaderDemo extends StatelessWidget {
  const CollapsingHeaderDemo({super.key});

  static const double _expandedHeight = 130;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: _expandedHeight,
          floating: false,
          pinned: true,
          backgroundColor: Colors.white,
          flexibleSpace: LayoutBuilder(
            builder: (context, constraints) {
              // t goes from 0 (fully expanded) to 1 (collapsed to kToolbarHeight)
              final double t = 1 -
                ((constraints.maxHeight - kToolbarHeight) /
                 (_expandedHeight - kToolbarHeight))
                    .clamp(0.0, 1.0);

              // Log t to verify it changes with scroll
              // debugPrint('collapse t: \$t');

              return FlexibleSpaceBar(
                background: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        const CircleAvatar(radius: 24, backgroundColor: Color(0xFF534AB7)),
                        const SizedBox(width: 12),
                        Column(crossAxisAlignment: CrossAxisAlignment.start, children: const [
                          Text('Alex Rivera',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                          SizedBox(height: 2),
                          Text('UX Designer · San Francisco',
                            style: TextStyle(fontSize: 12, color: Colors.grey)),
                        ]),
                      ]),
                      const SizedBox(height: 14),
                      // t available here — will wire up in next step
                      Container(
                        height: 34,
                        decoration: BoxDecoration(
                          color: const Color(0xFFF3F3F5),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color(0xFFE0E0E0)),
                        ),
                        alignment: Alignment.centerLeft,
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        child: const Text('Search posts…',
                          style: TextStyle(fontSize: 13, color: Colors.grey)),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        SliverList(delegate: SliverChildBuilderDelegate(
          (_, i) => Container(
            margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFFAFAFA),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFEEEEEE))),
            child: Text('Post \${i + 1}',
              style: const TextStyle(fontSize: 13, height: 1.6)),
          ),
          childCount: 20,
        )),
      ],
    );
  }
}`,
  },
  {
    title: 'Avatar scale + search opacity',
    description: 'Use t to drive Transform.scale on the avatar and Opacity on the search bar. lerpDouble interpolates between start and end values.',
    code: `import 'package:flutter/material.dart';

class CollapsingHeaderDemo extends StatelessWidget {
  const CollapsingHeaderDemo({super.key});

  static const double _expandedHeight = 130;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: _expandedHeight,
          floating: false,
          pinned: true,
          backgroundColor: Colors.white,
          flexibleSpace: LayoutBuilder(
            builder: (context, constraints) {
              final double t = 1 -
                ((constraints.maxHeight - kToolbarHeight) /
                 (_expandedHeight - kToolbarHeight))
                    .clamp(0.0, 1.0);

              final double avatarScale   = lerpDouble(1.0,  0.6, t)!;
              final double searchOpacity = lerpDouble(1.0,  0.0, t)!.clamp(0.0, 1.0);
              final double searchHeight  = lerpDouble(34.0, 0.0, t)!.clamp(0.0, 34.0);

              return FlexibleSpaceBar(
                background: Padding(
                  padding: const EdgeInsets.fromLTRB(16, 20, 16, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        Transform.scale(
                          scale: avatarScale,
                          alignment: Alignment.centerLeft,
                          child: const CircleAvatar(
                            radius: 24, backgroundColor: Color(0xFF534AB7)),
                        ),
                        const SizedBox(width: 12),
                        Column(crossAxisAlignment: CrossAxisAlignment.start, children: const [
                          Text('Alex Rivera',
                            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                          SizedBox(height: 2),
                          Text('UX Designer · San Francisco',
                            style: TextStyle(fontSize: 12, color: Colors.grey)),
                        ]),
                      ]),
                      const SizedBox(height: 14),
                      Opacity(
                        opacity: searchOpacity,
                        child: SizedBox(
                          height: searchHeight,
                          child: Container(
                            decoration: BoxDecoration(
                              color: const Color(0xFFF3F3F5),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: const Color(0xFFE0E0E0)),
                            ),
                            alignment: Alignment.centerLeft,
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            child: const Text('Search posts…',
                              style: TextStyle(fontSize: 13, color: Colors.grey)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        SliverList(delegate: SliverChildBuilderDelegate(
          (_, i) => Container(
            margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFFAFAFA),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFEEEEEE))),
            child: Text('Post \${i + 1}',
              style: const TextStyle(fontSize: 13, height: 1.6)),
          ),
          childCount: 20,
        )),
      ],
    );
  }
}`,
  },
  {
    title: 'Title size + padding sync',
    description: 'Add title font size and padding interpolations so every element in the header compresses in sync. The result is a buttery smooth collapsing profile header driven entirely by SliverAppBar\'s constraints.',
    code: `import 'package:flutter/material.dart';

class CollapsingHeaderDemo extends StatelessWidget {
  const CollapsingHeaderDemo({super.key});

  static const double _expandedHeight = 130;

  @override
  Widget build(BuildContext context) {
    return CustomScrollView(
      slivers: [
        SliverAppBar(
          expandedHeight: _expandedHeight,
          floating: false,
          pinned: true,
          backgroundColor: Colors.white,
          elevation: 0,
          flexibleSpace: LayoutBuilder(
            builder: (context, constraints) {
              final double t = 1 -
                ((constraints.maxHeight - kToolbarHeight) /
                 (_expandedHeight - kToolbarHeight))
                    .clamp(0.0, 1.0);

              final double avatarScale   = lerpDouble(1.0,  0.6,  t)!;
              final double searchOpacity = (1.0 - t * 1.3).clamp(0.0, 1.0);
              final double searchHeight  = lerpDouble(34.0, 0.0,  t)!.clamp(0.0, 34.0);
              final double titleSize     = lerpDouble(16.0, 13.0, t)!;
              final double padTop        = lerpDouble(20.0, 10.0, t)!;

              return FlexibleSpaceBar(
                background: Padding(
                  padding: EdgeInsets.fromLTRB(16, padTop, 16, 0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(children: [
                        Transform.scale(
                          scale: avatarScale,
                          alignment: Alignment.centerLeft,
                          child: const CircleAvatar(
                            radius: 24,
                            backgroundColor: Color(0xFF534AB7),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Alex Rivera',
                              style: TextStyle(
                                fontSize: titleSize,
                                fontWeight: FontWeight.w700,
                                color: const Color(0xFF111111),
                              )),
                            const SizedBox(height: 2),
                            const Text('UX Designer · San Francisco',
                              style: TextStyle(fontSize: 12, color: Colors.grey)),
                          ],
                        )),
                      ]),
                      const SizedBox(height: 14),
                      Opacity(
                        opacity: searchOpacity,
                        child: SizedBox(
                          height: searchHeight,
                          child: Container(
                            decoration: BoxDecoration(
                              color: const Color(0xFFF3F3F5),
                              borderRadius: BorderRadius.circular(8),
                              border: Border.all(color: const Color(0xFFE0E0E0)),
                            ),
                            alignment: Alignment.centerLeft,
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            child: const Text('Search posts…',
                              style: TextStyle(fontSize: 13, color: Colors.grey)),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
        SliverList(delegate: SliverChildBuilderDelegate(
          (_, i) => Container(
            margin: const EdgeInsets.fromLTRB(16, 0, 16, 12),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFFAFAFA),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFFEEEEEE))),
            child: Text('Post \${i + 1}',
              style: const TextStyle(fontSize: 13, height: 1.6, color: Color(0xFF222222))),
          ),
          childCount: 20,
        )),
      ],
    );
  }
}`,
  },
]

const collapsingHeader: StepMap = {
  react:          collapsingHeaderReact,
  nextjs:         collapsingHeaderNextjs,
  vue:            collapsingHeaderVue,
  'react-native': collapsingHeaderRN,
  flutter:        collapsingHeaderFlutter,
}

export const ALL_STEPS: Record<string, StepMap> = {
  'entrance-reveal':   entranceReveal,
  'page-transitions':  pageTransitions,
  'gesture-feedback':  gestureFeedback,
  'parallax':          parallax,
  'skeleton-loading':  skeletonLoading,
  'stagger-list':      staggerList,
  'image-carousel':    imageCarousel,
  'onboarding-flow':   onboardingFlow,
  'shared-element':    sharedElement,
  'collapsing-header': collapsingHeader,
}

export function getSteps(slug: string, platform: PlatformId): Step[] {
  return ALL_STEPS[slug]?.[platform] ?? []
}
