export type PlatformId = 'react' | 'nextjs' | 'vue' | 'react-native' | 'flutter'
export type Context = 'web' | 'mobile'

export const WEB_PLATFORMS:    PlatformId[] = ['react', 'nextjs', 'vue']
export const MOBILE_PLATFORMS: PlatformId[] = ['react-native', 'flutter']

export interface Platform {
  id: PlatformId
  label: string
  badge: string
  color: string
  hasLiveDemo: boolean
}

export const PLATFORMS: Platform[] = [
  { id: 'react',        label: 'React',        badge: 'Framer Motion',  color: '#61DAFB', hasLiveDemo: true  },
  { id: 'nextjs',       label: 'Next.js',      badge: 'App Router',     color: '#FFFFFF', hasLiveDemo: true  },
  { id: 'vue',          label: 'Vue 3',         badge: 'Motion One',     color: '#42B883', hasLiveDemo: false },
  { id: 'react-native', label: 'React Native', badge: 'Reanimated 3',   color: '#61DAFB', hasLiveDemo: false },
  { id: 'flutter',      label: 'Flutter',      badge: 'AnimationCtrl',  color: '#54C5F8', hasLiveDemo: false },
]

export interface UseCase {
  label: string
  example: string
}

export interface PlatformImpl {
  platform: PlatformId
  deps: string[]
  notes?: string
  code: string
}

export interface AnimationFr {
  title?: string
  tagline?: string
  concept?: string
  howItWorks?: string[]
  useCases?: UseCase[]
  tips?: string[]
}

export interface Animation {
  slug: string
  title: string
  category: 'Entrance' | 'Navigation' | 'Scroll' | 'Feedback' | 'Loading' | 'List' | 'Carousel'
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  tagline: string
  concept: string
  howItWorks: string[]
  implementations: PlatformImpl[]
  useCases: UseCase[]
  tips: string[]
  fr?: AnimationFr
}

export function localizeAnim(anim: Animation, lang: 'en' | 'fr'): Animation {
  if (lang === 'en' || !anim.fr) return anim
  const fr = anim.fr
  return {
    ...anim,
    title:      fr.title      ?? anim.title,
    tagline:    fr.tagline    ?? anim.tagline,
    concept:    fr.concept    ?? anim.concept,
    howItWorks: fr.howItWorks ?? anim.howItWorks,
    useCases:   fr.useCases   ?? anim.useCases,
    tips:       fr.tips       ?? anim.tips,
  }
}

export function localizeStep(step: import('./steps').Step, lang: 'en' | 'fr'): import('./steps').Step {
  if (lang === 'en' || !step.fr) return step
  return {
    ...step,
    title:       step.fr.title       ?? step.title,
    description: step.fr.description ?? step.description,
  }
}

export const ANIMATIONS: Animation[] = [
  /* ─────────────────────────────────────────────── */
  /*  1. Entrance Reveal                             */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'entrance-reveal',
    title: 'Entrance Reveal',
    category: 'Entrance',
    difficulty: 'Beginner',
    tagline: 'Fade + slide elements into view on scroll',
    concept:
      'An entrance reveal animates content from invisible to visible as it enters the viewport. Rather than showing everything at once, elements slide up from below and fade in — guiding the user\'s eye through the page in a deliberate, editorial way. It\'s the most common animation pattern on the web, and when done with the right easing and timing, it makes any layout feel polished.',
    howItWorks: [
      'Track whether the element has crossed the viewport boundary using an Intersection Observer (or the framework\'s wrapper around it).',
      'When `isVisible` flips to true, transition from `opacity: 0, translateY: 32px` to `opacity: 1, translateY: 0` using a cubic-bezier easing that starts fast and decelerates.',
      'Use `once: true` so the animation only plays on the first scroll-in. Re-triggering on scroll-back feels noisy.',
      'For lists, stagger child elements by 60–80ms each so they cascade in rather than all appearing simultaneously.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
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
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

// Usage
export function Page() {
  return (
    <div>
      <RevealOnScroll><h2>Section heading</h2></RevealOnScroll>
      <RevealOnScroll delay={0.1}><p>Supporting copy</p></RevealOnScroll>
    </div>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: 'Add `\'use client\'` — `useRef` and `useInView` are browser-only APIs.',
        code: `'use client'

import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

// Identical to the React implementation.
// The only Next.js-specific requirement is 'use client' at the top,
// since this component uses browser APIs (IntersectionObserver).
//
// For the App Router, place this in a shared component file and
// import it from Server Components freely — Next.js handles the
// client/server boundary automatically.

function RevealOnScroll({ children, delay = 0 }: {
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
}`,
      },
      {
        platform: 'vue',
        deps: ['@vueuse/core'],
        notes: '`useIntersectionObserver` from VueUse handles the viewport detection. Pure CSS transitions — no animation library needed.',
        code: `<template>
  <div ref="el" :style="style">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

const props = withDefaults(defineProps<{ delay?: number }>(), { delay: 0 })

const el = ref<HTMLElement | null>(null)
const isVisible = ref(false)

useIntersectionObserver(
  el,
  ([entry]) => { if (entry.isIntersecting) isVisible.value = true },
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
</script>

<!-- Usage -->
<!--
<RevealOnScroll>
  <h2>Section heading</h2>
</RevealOnScroll>
<RevealOnScroll :delay="0.1">
  <p>Supporting copy</p>
</RevealOnScroll>
-->`,
      },
      {
        platform: 'react-native',
        deps: ['react-native-reanimated'],
        notes: 'React Native has no scroll-based IntersectionObserver. Use `onLayout` to trigger on mount/layout, or a scroll-position approach for true scroll-triggered reveals.',
        code: `import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated'

interface Props {
  children: React.ReactNode
  delay?: number
}

export function RevealOnMount({ children, delay = 0 }: Props) {
  const opacity = useSharedValue(0)
  const translateY = useSharedValue(32)

  // Trigger on layout — fires once the element is measured and rendered.
  function onLayout() {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 600 })
    )
    translateY.value = withDelay(
      delay,
      withTiming(0, {
        duration: 600,
        easing: Easing.bezier(0.22, 1, 0.36, 1),
      })
    )
  }

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={style} onLayout={onLayout}>
      {children}
    </Animated.View>
  )
}`,
      },
      {
        platform: 'flutter',
        deps: [],
        notes: 'Flutter\'s `visibility_detector` package provides viewport callbacks. Here we use a simpler `initState` trigger — swap for `VisibilityDetector` for true scroll-triggered reveals.',
        code: `import 'package:flutter/material.dart';

class RevealOnMount extends StatefulWidget {
  final Widget child;
  final Duration delay;

  const RevealOnMount({
    required this.child,
    this.delay = Duration.zero,
    super.key,
  });

  @override
  State<RevealOnMount> createState() => _RevealOnMountState();
}

class _RevealOnMountState extends State<RevealOnMount>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _opacity;
  late final Animation<Offset> _slide;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _opacity = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeOut),
    );
    _slide = Tween<Offset>(
      begin: const Offset(0, 0.15),
      end: Offset.zero,
    ).animate(CurvedAnimation(parent: _ctrl, curve: Curves.easeOutCubic));

    Future.delayed(widget.delay, () {
      if (mounted) _ctrl.forward();
    });
  }

  @override
  Widget build(BuildContext context) => FadeTransition(
    opacity: _opacity,
    child: SlideTransition(position: _slide, child: widget.child),
  );

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }
}`,
      },
    ],
    useCases: [
      { label: 'Section headings', example: 'H2 titles that slide up as users scroll into each section. Paces reading and gives each section a sense of arrival.' },
      { label: 'Feature grid', example: '6 feature cards staggered at 70ms each. The cascade implies the grid is being built in real time, not pre-rendered.' },
      { label: 'Article content', example: 'Paragraphs and images in a long-form article. Subtle reveals (small Y offset, short duration) keep reading flow intact.' },
      { label: 'Stats row', example: 'Large numbers ("127 countries, 4200 users") that fade in individually. Each stat lands with its own beat.' },
    ],
    tips: [
      'Keep Y offset between 20–40px. Larger values feel dramatic on first view but become exhausting on repeated visits.',
      'Always implement `prefers-reduced-motion`. If the media query matches, skip the animation and show the `visible` state immediately — never gate content behind motion.',
    ],
    fr: {
      title: 'Révélation à l\'entrée',
      tagline: 'Fondu + glissement des éléments à l\'apparition lors du défilement',
      concept: 'Une révélation à l\'entrée anime le contenu de invisible à visible au fur et à mesure qu\'il entre dans la fenêtre. Plutôt que d\'afficher tout d\'un coup, les éléments glissent depuis le bas et s\'estompent — guidant l\'œil de l\'utilisateur à travers la page de manière éditoriale. C\'est le pattern d\'animation le plus courant sur le web, et avec le bon easing et timing, il donne une sensation de soin à n\'importe quelle mise en page.',
      howItWorks: [
        'Suivre si l\'élément a franchi la limite de la fenêtre avec un Intersection Observer (ou le wrapper du framework).',
        'Quand `isVisible` passe à true, transition de `opacity: 0, translateY: 32px` à `opacity: 1, translateY: 0` avec un easing cubic-bezier qui démarre vite et décélère.',
        'Utiliser `once: true` pour que l\'animation ne se joue qu\'au premier défilement. Le re-déclenchement au retour est perturbant.',
        'Pour les listes, décaler les enfants de 60–80ms chacun pour qu\'ils cascadent plutôt que d\'apparaître tous simultanément.',
      ],
      useCases: [
        { label: 'Titres de section', example: 'Les titres H2 qui glissent vers le haut quand l\'utilisateur défile dans chaque section. Cadence la lecture et donne à chaque section un sentiment d\'arrivée.' },
        { label: 'Grille de fonctionnalités', example: '6 cartes de fonctionnalités décalées de 70ms chacune. La cascade suggère que la grille se construit en temps réel.' },
        { label: 'Contenu d\'article', example: 'Paragraphes et images dans un article long. Des révélations subtiles (petit décalage Y, courte durée) préservent le flux de lecture.' },
        { label: 'Ligne de statistiques', example: 'Grands chiffres qui s\'estompent individuellement. Chaque statistique atterrit avec son propre rythme.' },
      ],
      tips: [
        'Garder le décalage Y entre 20–40px. Des valeurs plus grandes semblent dramatiques au premier coup d\'œil mais deviennent fatigantes à la longue.',
        'Toujours implémenter `prefers-reduced-motion`. Si la media query correspond, sauter l\'animation et afficher l\'état `visible` immédiatement.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  2. Page Transitions                            */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'page-transitions',
    title: 'Page Transitions',
    category: 'Navigation',
    difficulty: 'Intermediate',
    tagline: 'Animate between routes so navigation feels spatial',
    concept:
      'Page transitions replace the default browser "flash to white" between routes with a deliberate animated handoff. The outgoing page exits while the incoming page enters, carrying the user\'s mental model from one context to the next. The direction of motion can imply spatial hierarchy — slide left to go deeper, slide right to go back, fade for sibling pages.',
    howItWorks: [
      'Detect when the current view is changing — this is a route key or component key change.',
      '`AnimatePresence` (Framer Motion) or `<Transition mode="out-in">` (Vue Router) orchestrates the exit of the old view before the new one enters.',
      'The exiting element plays its `exit` animation; once complete, the incoming element plays `initial → animate`. `mode="wait"` ensures they never overlap.',
      'Match transition direction to navigation intent: going "into" a detail page → slide up or scale. Going "back" → reverse the slide. Switching tabs → fade only.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        code: `import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const pages = { home: <Home />, about: <About />, work: <Work /> }
type PageKey = keyof typeof pages

export function App() {
  const [page, setPage] = useState<PageKey>('home')

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <nav>
        {(Object.keys(pages) as PageKey[]).map(key => (
          <button key={key} onClick={() => setPage(key)}>{key}</button>
        ))}
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          {pages[page]}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: 'The `AnimatePresence` wrapper must live in a `\'use client\'` component in the App Router. Wrap it around `{children}` in your root layout.',
        code: `// app/layout.tsx
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

// components/LayoutWrapper.tsx
'use client'
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
        platform: 'vue',
        deps: ['vue-router'],
        notes: 'Vue Router\'s `<RouterView>` slot provides the component and route. `<Transition mode="out-in">` handles the exit-before-enter sequencing natively.',
        code: `<!-- App.vue -->
<template>
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
    opacity 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>`,
      },
      {
        platform: 'react-native',
        deps: ['@react-navigation/stack'],
        notes: 'React Navigation\'s Stack navigator ships with platform-appropriate transitions. Override with `cardStyleInterpolator` for fully custom animations.',
        code: `import { createStackNavigator } from '@react-navigation/stack'
import { CardStyleInterpolators } from '@react-navigation/stack'

const Stack = createStackNavigator()

// Option A — built-in preset
export function AppNavigator() {
  return (
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
      <Stack.Screen name="Home"   component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  )
}

// Option B — custom fade + slide interpolator
export const forFadeSlide = ({ current, layouts }) => ({
  cardStyle: {
    opacity: current.progress,
    transform: [{
      translateY: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [layouts.screen.height * 0.05, 0],
      }),
    }],
  },
})`,
      },
      {
        platform: 'flutter',
        deps: [],
        notes: 'Extend `PageRouteBuilder` to create reusable transition routes. Use `go_router` with `CustomTransitionPage` for declarative routing.',
        code: `import 'package:flutter/material.dart';

/// Reusable fade + slide page route.
class FadeSlideRoute<T> extends PageRouteBuilder<T> {
  final Widget page;

  FadeSlideRoute({required this.page})
      : super(
          pageBuilder: (_, __, ___) => page,
          transitionDuration: const Duration(milliseconds: 350),
          reverseTransitionDuration: const Duration(milliseconds: 280),
          transitionsBuilder: (context, animation, secondary, child) {
            // Outgoing page fades out
            final fadeTween = Tween<double>(begin: 0.0, end: 1.0)
                .chain(CurveTween(curve: Curves.easeOut));

            // Incoming page slides up
            final slideTween = Tween<Offset>(
              begin: const Offset(0, 0.06),
              end: Offset.zero,
            ).chain(CurveTween(curve: Curves.easeOutCubic));

            return FadeTransition(
              opacity: animation.drive(fadeTween),
              child: SlideTransition(
                position: animation.drive(slideTween),
                child: child,
              ),
            );
          },
        );
}

// Usage
Navigator.push(context, FadeSlideRoute(page: const DetailScreen()));

// With go_router:
// GoRoute(
//   path: '/detail',
//   pageBuilder: (context, state) => CustomTransitionPage(
//     child: const DetailScreen(),
//     transitionsBuilder: (_, animation, __, child) => FadeTransition(
//       opacity: animation, child: child,
//     ),
//   ),
// )`,
      },
    ],
    useCases: [
      { label: 'Portfolio case study', example: 'Navigating from project grid to detail page. A scale-up (0.96 → 1) implies zooming into the selected work — the direction of motion matches the spatial metaphor.' },
      { label: 'Onboarding flow', example: 'A 4-step onboarding with slide-left on "Next" and slide-right on "Back". Direction tells users exactly where they are without a step counter.' },
      { label: 'Tab switching', example: 'Dashboard tabs (Overview / Analytics / Settings). Use a simple fade — deep interfaces need fast transitions, not theatrical slides.' },
      { label: 'Mobile bottom sheet nav', example: 'Main tab navigation in a mobile app. Slides up when entering, slides down on back. Matches the physical gesture direction.' },
    ],
    tips: [
      'Keep transitions under 350ms. Users navigate with intent — long transitions feel like lag. Reserve slower animations for initial page load only.',
      'In Next.js App Router, `AnimatePresence` must be a Client Component. The exiting page\'s subtree is unmounted immediately by the router, so the `exit` animation window is very short — test it.',
    ],
    fr: {
      title: 'Transitions de page',
      tagline: 'Animez entre les routes pour que la navigation soit spatiale',
      concept: 'Les transitions de page remplacent le "flash blanc" par défaut du navigateur entre les routes avec un transfert animé délibéré. La page sortante quitte pendant que la page entrante arrive, préservant le modèle mental de l\'utilisateur. La direction du mouvement peut impliquer une hiérarchie spatiale — glisser à gauche pour aller plus profond, à droite pour revenir.',
      howItWorks: [
        'Envelopper le composant de route dans `AnimatePresence` pour que React puisse animer la sortie avant de démonter.',
        'Chaque page reçoit des variantes `initial`, `animate` et `exit`. La combinaison `initial: { x: "100%" }` + `exit: { x: "-100%" }` crée un effet de glissement naturel.',
        'Utiliser `mode="wait"` sur `AnimatePresence` pour s\'assurer que la page sortante finit son exit avant que l\'entrante commence à apparaître.',
        'Lire la route précédente depuis un contexte ou un état global pour déterminer la direction — gauche/droite ou haut/bas selon la hiérarchie.',
      ],
      useCases: [
        { label: 'Portfolio', example: 'Navigation de la grille de projets à la page de détail. Un scale-up (0.96 → 1) implique un zoom sur le projet sélectionné.' },
        { label: 'Onboarding', example: 'Un onboarding en 4 étapes avec glissement gauche sur "Suivant" et droite sur "Retour". La direction dit aux utilisateurs où ils sont.' },
        { label: 'Onglets de tableau de bord', example: 'Onglets Aperçu / Analytique / Paramètres. Utiliser un fondu simple — les interfaces complexes ont besoin de transitions rapides.' },
        { label: 'Navigation mobile', example: 'Navigation principale d\'une app mobile. Glisse vers le haut à l\'entrée, vers le bas au retour. Correspond à la direction du geste physique.' },
      ],
      tips: [
        'Garder les transitions sous 350ms. Les utilisateurs naviguent avec intention — les longues transitions semblent être du lag.',
        'Dans Next.js App Router, `AnimatePresence` doit être un Client Component. Le sous-arbre de la page sortante est démonté immédiatement par le routeur — testez la fenêtre `exit`.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  3. Gesture Feedback                            */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'gesture-feedback',
    title: 'Gesture Feedback',
    category: 'Feedback',
    difficulty: 'Beginner',
    tagline: 'Spring press, swipe, and hover responses',
    concept:
      'Gesture feedback makes interactive elements feel physical. A button that squishes on press, a card that lifts on hover, a row that springs back after a swipe — these micro-animations confirm that the interface received the input before the actual action completes. The spring physics feel alive in a way that CSS `transition: transform 0.1s` never does.',
    howItWorks: [
      'For press feedback: animate `scale` from 1 to 0.94 on pointer-down, spring back on pointer-up. The spring\'s stiffness and damping determine how snappy vs. bouncy it feels.',
      'For hover feedback: `whileHover` (Framer Motion) or `@mouseover` / `:hover` triggers a lift (`y: -4px`), shadow increase, and subtle scale-up (1.02×).',
      'For swipe-to-dismiss: constrain drag to one axis, track velocity on `dragEnd`. If velocity exceeds a threshold or offset exceeds 40% of width, animate to exit; otherwise spring back.',
      'On mobile, Reanimated 3\'s `withSpring` and Flutter\'s spring curves are the native equivalents — hardware-accelerated and gesture-synchronized.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        code: `import { motion } from 'framer-motion'

// ── Press feedback button
export function SpringButton({ children, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      style={{ cursor: 'pointer' }}
    >
      {children}
    </motion.button>
  )
}

// ── Swipe-to-dismiss card
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
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: 'Add `\'use client\'` — `motion` components use browser event listeners.',
        code: `'use client'
// Same implementation as React.
// In Next.js, ensure this file or the component using SpringButton
// is marked 'use client'. You can import it from any Server Component.

import { motion } from 'framer-motion'

export function SpringButton({ children, onClick }: {
  children: React.ReactNode
  onClick?: () => void
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.94 }}
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  )
}`,
      },
      {
        platform: 'vue',
        deps: ['motion-v'],
        notes: 'Motion for Vue (`motion-v`) mirrors the Framer Motion API. Alternatively, use the Composables approach with `useSpring` from Motion One.',
        code: `<template>
  <!-- Option A: motion-v (mirrors Framer Motion API) -->
  <Motion
    tag="button"
    :while-tap="{ scale: 0.94 }"
    :while-hover="{ scale: 1.03, y: -2 }"
    :transition="{ type: 'spring', stiffness: 400, damping: 17 }"
    @click="$emit('click')"
  >
    <slot />
  </Motion>

  <!-- Option B: Pure CSS spring (no library) -->
  <button
    ref="btn"
    @mousedown="press"
    @mouseup="release"
    @mouseleave="release"
    style="transition: transform 0.1s; cursor: pointer"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const btn = ref<HTMLButtonElement | null>(null)

// Keyframe spring approximation
function press() {
  if (btn.value) btn.value.style.transform = 'scale(0.94)'
}
function release() {
  if (!btn.value) return
  btn.value.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)'
  btn.value.style.transform = 'scale(1)'
  setTimeout(() => {
    if (btn.value) btn.value.style.transition = 'transform 0.1s'
  }, 500)
}
</script>`,
      },
      {
        platform: 'react-native',
        deps: ['react-native-reanimated', 'react-native-gesture-handler'],
        notes: 'Reanimated 3 runs animations on the UI thread — zero JS-thread lag even under heavy load. Always prefer `withSpring` over `withTiming` for interactive feedback.',
        code: `import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import { View } from 'react-native'

// ── Press feedback
export function SpringButton({ children, onPress }) {
  const scale = useSharedValue(1)

  const tap = Gesture.Tap()
    .onBegin(() => { scale.value = withSpring(0.94, { stiffness: 400, damping: 17 }) })
    .onFinalize(() => {
      scale.value = withSpring(1, { stiffness: 400, damping: 17 })
      if (onPress) runOnJS(onPress)()
    })

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={style}>{children}</Animated.View>
    </GestureDetector>
  )
}

// ── Swipe to dismiss
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
      {
        platform: 'flutter',
        deps: [],
        notes: 'Flutter\'s `GestureDetector` + `AnimationController` covers press feedback. For swipe-to-dismiss, `Dismissible` is a built-in widget.',
        code: `import 'package:flutter/material.dart';

// ── Press feedback button
class SpringButton extends StatefulWidget {
  final Widget child;
  final VoidCallback? onPressed;
  const SpringButton({required this.child, this.onPressed, super.key});

  @override
  State<SpringButton> createState() => _SpringButtonState();
}

class _SpringButtonState extends State<SpringButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 80),
      reverseDuration: const Duration(milliseconds: 400),
    );
    _scale = Tween<double>(begin: 1.0, end: 0.94).animate(
      CurvedAnimation(
        parent: _ctrl,
        curve: Curves.easeIn,
        reverseCurve: Curves.elasticOut,
      ),
    );
  }

  @override
  Widget build(BuildContext context) => GestureDetector(
    onTapDown: (_) => _ctrl.forward(),
    onTapUp: (_) { _ctrl.reverse(); widget.onPressed?.call(); },
    onTapCancel: () => _ctrl.reverse(),
    child: ScaleTransition(scale: _scale, child: widget.child),
  );

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }
}

// ── Swipe to dismiss (built-in)
Dismissible(
  key: Key(item.id),
  direction: DismissDirection.horizontal,
  background: Container(color: Colors.red),
  onDismissed: (_) => onDismiss(item),
  child: ItemCard(item: item),
)`,
      },
    ],
    useCases: [
      { label: 'CTA buttons', example: 'Spring press on "Buy now" or "Sign up". The 6% squish confirms the tap registered before the network request completes — reducing double-taps by 40%.' },
      { label: 'List item actions', example: 'Swipe-to-delete on email or task list items. The swipe gesture + velocity threshold mirrors the native iOS Mail app behavior.' },
      { label: 'Card interactions', example: 'Hover lift (y: -4, shadow increase) on product or blog cards. The 3D shadow shift implies the card is physically rising from the surface.' },
      { label: 'Icon tap confirmation', example: 'Like, bookmark, share icons that scale to 1.2× on tap then spring back. Small but impactful — makes the app feel expensive.' },
    ],
    tips: [
      'Spring stiffness 300–500, damping 15–20 is the sweet spot for buttons. Below 300 feels sluggish; above 600 feels jittery. The "elastic" feel comes from damping under 15.',
      'On mobile, always run animations on the UI thread (Reanimated\'s `useAnimatedStyle`, Flutter\'s `AnimationController`). JS-thread animations stutter during scroll or heavy renders.',
    ],
    fr: {
      title: 'Retour gestuel',
      tagline: 'Réponses de pression spring, swipe et hover',
      concept: 'Le retour gestuel transforme chaque interaction en une confirmation physique. Un bouton qui se comprime légèrement à la pression, une carte qui lévite au survol, une liste qui se glisse pour révéler des actions — tous ces micros-comportements communiquent l\'état sans mots. Le spring physique (pas une courbe de Bézier) rend le retour authentique car il rebondit naturellement.',
      howItWorks: [
        '`whileTap={{ scale: 0.94 }}` déclenche une animation spring dès que l\'utilisateur appuie. Framer Motion calcule le rebond automatiquement selon `stiffness` et `damping`.',
        '`whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(0,0,0,0.15)" }}` simule la lévitation physique — l\'ombre s\'intensifie à mesure que l\'objet s\'élève.',
        'Pour le swipe, `useDrag` (Framer) ou `PanGestureHandler` (Reanimated) suivent la vélocité. Un threshold de vitesse détermine si le glissement aboutit ou rebondit.',
        'Sur les appareils mobiles, utiliser toujours le thread UI (Reanimated `useAnimatedStyle`) pour éviter les saccades pendant le scroll.',
      ],
      useCases: [
        { label: 'Boutons CTA', example: 'Compression spring sur "Acheter" ou "S\'inscrire". Le 6% de compression confirme que l\'appui a été enregistré avant la réponse réseau.' },
        { label: 'Actions sur liste', example: 'Glisser-pour-supprimer sur des éléments d\'e-mail ou de tâches. Le geste + threshold de vitesse reproduit le comportement iOS Mail.' },
        { label: 'Cartes interactives', example: 'Lévitation au survol (y: -4, augmentation d\'ombre) sur des cartes produit. Le décalage d\'ombre 3D implique que la carte se soulève physiquement.' },
        { label: 'Confirmation d\'icône', example: 'Icônes Like, Favori, Partager qui s\'agrandissent à 1.2× au tap. Petit mais impactant — rend l\'app plus premium.' },
      ],
      tips: [
        'Stiffness 300–500, damping 15–20 est le sweet spot pour les boutons. En dessous de 300, ça semble lent ; au-dessus de 600, c\'est saccadé.',
        'Sur mobile, toujours exécuter les animations sur le thread UI. Les animations sur le thread JS saccadent lors du scroll ou des rendus lourds.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  4. Parallax                                    */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'parallax',
    title: 'Parallax',
    category: 'Scroll',
    difficulty: 'Intermediate',
    tagline: 'Layered scroll speeds create perceived depth',
    concept:
      'Parallax moves different layers at different speeds relative to the scroll position. Background elements travel slowly; foreground content moves faster. The offset between layers suggests three-dimensional space on a flat screen. Used correctly, it makes a page feel like a physical environment being moved through. Used incorrectly, it causes motion sickness.',
    howItWorks: [
      '`useScroll({ target: sectionRef, offset: ["start end", "end start"] })` produces a `scrollYProgress` MotionValue from 0 (section bottom entering viewport) to 1 (section top leaving).',
      '`useTransform(scrollYProgress, [0, 1], [-60, 60])` maps that 0–1 range to a Y-pixel offset. Background layers get a small range (±40px); foreground text gets a larger range (±80px).',
      'Apply each offset with `style={{ y: bgY }}` on `motion.div` wrappers. Framer Motion handles the rAF loop.',
      'Clip the section with `overflow: hidden` to prevent shifted layers from bleeding outside their container bounds.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        code: `import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function ParallaxSection({ image, children }) {
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  })

  // Background moves slowly (±40px)
  const bgY   = useTransform(scrollYProgress, [0, 1], [-40, 40])
  // Text moves faster (opposite direction for depth)
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', overflow: 'hidden', minHeight: 480 }}
    >
      {/* Background layer */}
      <motion.div
        style={{
          y: bgY,
          position: 'absolute',
          inset: '-10%', // Oversized so motion doesn't reveal edges
          backgroundImage: \`url(\${image})\`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      {/* Foreground content */}
      <motion.div
        style={{
          y: textY,
          position: 'relative',
          zIndex: 1,
          padding: '80px 40px',
        }}
      >
        {children}
      </motion.div>
    </section>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: 'Mark as `\'use client\'` — `useScroll` and `useRef` are browser-only.',
        code: `'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// Identical to the React implementation.
// Use in a page.tsx freely — Next.js handles the client boundary.

export function ParallaxSection({ image, children }: {
  image: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const bgY   = useTransform(scrollYProgress, [0, 1], [-40, 40])
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40])

  return (
    <section ref={ref} style={{ position: 'relative', overflow: 'hidden', minHeight: 480 }}>
      <motion.div style={{ y: bgY, position: 'absolute', inset: '-10%',
        backgroundImage: \`url(\${image})\`, backgroundSize: 'cover' }} />
      <motion.div style={{ y: textY, position: 'relative', zIndex: 1, padding: '80px 40px' }}>
        {children}
      </motion.div>
    </section>
  )
}`,
      },
      {
        platform: 'vue',
        deps: ['@vueuse/core'],
        notes: '`useScroll` from VueUse provides reactive scroll position. We compute the parallax offset with a simple linear map.',
        code: `<template>
  <section ref="sectionRef" style="position: relative; overflow: hidden; min-height: 480px">
    <!-- Background layer -->
    <div :style="{
      position: 'absolute', inset: '-10%',
      backgroundImage: \`url(\${image})\`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      transform: \`translateY(\${bgOffset}px)\`,
      willChange: 'transform',
    }" />

    <!-- Foreground -->
    <div :style="{
      position: 'relative', zIndex: 1, padding: '80px 40px',
      transform: \`translateY(\${textOffset}px)\`,
      willChange: 'transform',
    }">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

defineProps<{ image: string }>()

const sectionRef = ref<HTMLElement | null>(null)
const progress = ref(0)

function update() {
  if (!sectionRef.value) return
  const rect = sectionRef.value.getBoundingClientRect()
  const vh = window.innerHeight
  // 0 when bottom of section enters, 1 when top of section leaves
  progress.value = 1 - (rect.bottom / (rect.height + vh))
}

onMounted(() => {
  window.addEventListener('scroll', update, { passive: true })
  update()
})
onUnmounted(() => window.removeEventListener('scroll', update))

const bgY   = computed(() => (progress.value * 2 - 1) * 40)   // ±40px
const textY = computed(() => (progress.value * 2 - 1) * -40)  // opposite
const bgOffset   = bgY
const textOffset = textY
</script>`,
      },
      {
        platform: 'react-native',
        deps: ['react-native-reanimated'],
        notes: 'Parallax in RN is driven by `ScrollView`\'s scroll offset, mapped via `interpolate`. Use `useNativeDriver: true` for 60fps on the UI thread.',
        code: `import { useRef } from 'react'
import { Animated, ScrollView, View, StyleSheet } from 'react-native'

const HEADER_HEIGHT = 300

export function ParallaxScrollView({ imageSource, children }) {
  const scrollY = useRef(new Animated.Value(0)).current

  const backgroundTranslate = scrollY.interpolate({
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
      {/* Parallax image */}
      <View style={{ height: HEADER_HEIGHT, overflow: 'hidden' }}>
        <Animated.Image
          source={imageSource}
          style={[
            StyleSheet.absoluteFill,
            { transform: [{ translateY: backgroundTranslate }] },
          ]}
          resizeMode="cover"
        />
        <Animated.View style={{ opacity: headerOpacity, flex: 1,
          justifyContent: 'flex-end', padding: 24 }}>
          {/* Text overlaid on image */}
        </Animated.View>
      </View>

      {/* Scrollable content */}
      <View style={{ backgroundColor: 'white', minHeight: 800 }}>
        {children}
      </View>
    </ScrollView>
  )
}`,
      },
      {
        platform: 'flutter',
        deps: [],
        notes: 'Flutter\'s `CustomScrollView` with `SliverAppBar(flexibleSpace: FlexibleSpaceBar)` provides built-in parallax. For custom control, use `NotificationListener<ScrollNotification>`.',
        code: `import 'package:flutter/material.dart';

// ── Built-in approach (recommended)
class ParallaxScreen extends StatelessWidget {
  final String imageUrl;
  final Widget body;

  const ParallaxScreen({required this.imageUrl, required this.body, super.key});

  @override
  Widget build(BuildContext context) => CustomScrollView(
    slivers: [
      SliverAppBar(
        expandedHeight: 300,
        pinned: true,
        flexibleSpace: FlexibleSpaceBar(
          // Flutter handles parallax automatically here
          background: Image.network(imageUrl, fit: BoxFit.cover),
          collapseMode: CollapseMode.parallax, // built-in!
        ),
      ),
      SliverToBoxAdapter(child: body),
    ],
  );
}

// ── Manual parallax with scroll listener
class ManualParallax extends StatefulWidget {
  final Widget child;
  const ManualParallax({required this.child, super.key});

  @override
  State<ManualParallax> createState() => _ManualParallaxState();
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
      offset: Offset(0, -_offset * 0.3), // background scrolls at 0.3x
      child: Image.network('https://...', fit: BoxFit.cover),
    ),
    SingleChildScrollView(controller: _controller, child: widget.child),
  ]);

  @override
  void dispose() { _controller.dispose(); super.dispose(); }
}`,
      },
    ],
    useCases: [
      { label: 'Hero banner', example: 'Landing page hero where the background image scrolls at 0.4× speed. As users scroll past, the image "stays behind" — conveying depth.' },
      { label: 'About section', example: 'Founder photo at 0.7× speed while copy scrolls at 1×. The offset keeps the portrait visible longer, giving it more read time.' },
      { label: 'Mobile app header', example: 'A profile or settings screen where the cover photo collapses with parallax as users scroll into the list content below.' },
      { label: 'Storytelling page', example: 'A timeline or narrative page where layers of illustration elements scroll at different rates, creating a sense of moving through the story.' },
    ],
    tips: [
      'Disable parallax on mobile web (`@media (hover: none)`) and offer a reduced-motion alternative. The combination of browser chrome resizing and parallax motion is nauseating on touch devices.',
      'Use `will-change: transform` on parallax layers to promote them to their own compositor layer — prevents painting during scroll. Remove it after mount if the element becomes static.',
    ],
    fr: {
      title: 'Parallaxe',
      tagline: 'Des vitesses de défilement en couches créent une profondeur perçue',
      concept: 'Le parallaxe déplace différentes couches à différentes vitesses par rapport à la position de défilement. Les éléments d\'arrière-plan bougent lentement ; le contenu de premier plan plus vite. Le décalage entre les couches suggère un espace tridimensionnel sur un écran plat. Bien utilisé, il donne l\'impression de traverser un environnement physique. Mal utilisé, il provoque le mal des transports.',
      howItWorks: [
        '`useScroll({ target: sectionRef, offset: ["start end", "end start"] })` produit un `scrollYProgress` de 0 (entrée) à 1 (sortie).',
        '`useTransform(scrollYProgress, [0, 1], [-60, 60])` mappe ce 0–1 à un décalage Y en pixels. Les couches d\'arrière-plan ont une petite plage (±40px) ; le texte au premier plan une grande (±80px).',
        'Appliquer chaque décalage avec `style={{ y: bgY }}` sur des wrappers `motion.div`. Framer Motion gère la boucle rAF.',
        'Clipper la section avec `overflow: hidden` pour éviter que les couches décalées débordent de leur conteneur.',
      ],
      useCases: [
        { label: 'Hero de landing', example: 'Image d\'arrière-plan qui bouge à 0.3× la vitesse de défilement. Donne l\'impression de "voler" au-dessus du contenu.' },
        { label: 'Galerie de portfolio', example: 'Chaque projet a des éléments d\'illustration en parallaxe. Le défilement révèle progressivement le détail de chaque œuvre.' },
        { label: 'Storytelling', example: 'Récits avec couches d\'arrière-plan, personnages et texte à vitesses différentes. Crée une narration immersive.' },
        { label: 'Section de témoignages', example: 'Fond texturé à vitesse lente, citation au premier plan à vitesse normale. La séparation visuelle met en valeur le contenu.' },
      ],
      tips: [
        'Désactiver le parallaxe sur mobile web (`@media (hover: none)`) et proposer une alternative. La combinaison Chrome mobile + parallaxe provoque des nausées.',
        'Utiliser `will-change: transform` sur les couches parallaxe pour les promouvoir sur leur propre couche compositor — évite le repaint pendant le défilement.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  5. Skeleton Loading                            */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'skeleton-loading',
    title: 'Skeleton Loading',
    category: 'Loading',
    difficulty: 'Beginner',
    tagline: 'Shimmer placeholders that match your content shape',
    concept:
      'Skeleton screens show the structural outline of content before the data arrives. Instead of a spinner (which says "wait, something is happening"), a skeleton says "here is exactly where your content will appear." The shimmer effect — a light wave sweeping left to right — signals active loading without demanding attention. Skeletons dramatically reduce perceived load time.',
    howItWorks: [
      'Create placeholder elements that mirror the dimensions and position of your real content — a rectangle for images, shorter rectangles for text lines, a circle for avatars.',
      'Overlay a gradient that moves from left to right with `translateX` from -100% to 100% on an infinite loop. The gradient is `transparent → rgba(255,255,255,0.08) → transparent`.',
      'The container clip (`overflow: hidden`) constrains the sweeping gradient to the shape of each placeholder.',
      'When data loads, replace the skeleton with real content using a fade transition so the swap isn\'t jarring.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        code: `import { motion } from 'framer-motion'

interface SkeletonProps {
  width?: string | number
  height?: number
  borderRadius?: number
}

function Skeleton({ width = '100%', height = 16, borderRadius = 6 }: SkeletonProps) {
  return (
    <div style={{
      width,
      height,
      borderRadius,
      overflow: 'hidden',
      background: 'var(--bg-tertiary)',
      position: 'relative',
    }}>
      <motion.div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

// ── Composed card skeleton
export function CardSkeleton() {
  return (
    <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)' }}>
      <Skeleton width={48} height={48} borderRadius={24} />     {/* avatar */}
      <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Skeleton width="60%" height={14} />   {/* name */}
        <Skeleton width="90%" height={12} />   {/* line 1 */}
        <Skeleton width="75%" height={12} />   {/* line 2 */}
      </div>
    </div>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: '`\'use client\'` required. In App Router, you can use this alongside React `<Suspense>` and Next.js streaming — show the skeleton as the `fallback` prop.',
        code: `// app/users/page.tsx — Server Component with Suspense
import { Suspense } from 'react'
import { CardSkeleton } from '@/components/CardSkeleton' // 'use client'
import { UserList } from './UserList'

export default function UsersPage() {
  return (
    <div>
      <h1>Users</h1>
      <Suspense fallback={
        <div style={{ display: 'grid', gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      }>
        <UserList /> {/* Streams in when data is ready */}
      </Suspense>
    </div>
  )
}

// components/CardSkeleton.tsx
'use client'
import { motion } from 'framer-motion'

export function CardSkeleton() {
  return (
    <div style={{ padding: 20, borderRadius: 12, border: '1px solid var(--border)' }}>
      {/* See React implementation for the Skeleton primitive */}
    </div>
  )
}`,
      },
      {
        platform: 'vue',
        deps: [],
        notes: 'No animation library needed — a CSS `@keyframes` shimmer is sufficient and performant.',
        code: `<template>
  <div class="skeleton" :style="{ width, height: height + 'px', borderRadius: borderRadius + 'px' }" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  width?: string
  height?: number
  borderRadius?: number
}>(), {
  width: '100%',
  height: 16,
  borderRadius: 6,
})
</script>

<style scoped>
.skeleton {
  position: relative;
  overflow: hidden;
  background: var(--bg-tertiary);
}

.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.07) 50%,
    transparent 100%
  );
  animation: shimmer 1.5s infinite linear;
}

@keyframes shimmer {
  from { transform: translateX(-100%); }
  to   { transform: translateX(100%); }
}
</style>

<!-- Usage -->
<!--
<Skeleton width="60%" :height="14" />
<Skeleton :height="48" :border-radius="24" />
-->`,
      },
      {
        platform: 'react-native',
        deps: ['react-native-reanimated', 'expo-linear-gradient'],
        notes: 'Linear gradients in RN require `expo-linear-gradient` or `react-native-linear-gradient`. The animation must be on the UI thread — never use `Animated.Value` with `useNativeDriver: false` for this.',
        code: `import { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { LinearGradient } from 'expo-linear-gradient'

interface SkeletonProps {
  width?: number | \`\${number}%\`
  height?: number
  borderRadius?: number
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 6 }: SkeletonProps) {
  const translateX = useSharedValue(-1)

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.linear }),
      -1, // infinite
    )
  }, [])

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value * 200 }],
  }))

  return (
    <View style={{ width, height, borderRadius, overflow: 'hidden',
      backgroundColor: '#1C1C1C' }}>
      <Animated.View style={[StyleSheet.absoluteFill, animStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.08)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  )
}

// ── Card skeleton
export function CardSkeleton() {
  return (
    <View style={{ padding: 20, borderRadius: 12, borderWidth: 1 }}>
      <Skeleton width={48} height={48} borderRadius={24} />
      <View style={{ marginTop: 16, gap: 8 }}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="90%" height={12} />
        <Skeleton width="75%" height={12} />
      </View>
    </View>
  )
}`,
      },
      {
        platform: 'flutter',
        deps: [],
        notes: 'Pure Flutter — no packages required. Uses `AnimatedBuilder` + a custom `LinearGradient` that shifts its `begin`/`end` alignment per frame.',
        code: `import 'package:flutter/material.dart';

class Skeleton extends StatefulWidget {
  final double width;
  final double height;
  final double borderRadius;

  const Skeleton({
    this.width = double.infinity,
    this.height = 16,
    this.borderRadius = 6,
    super.key,
  });

  @override
  State<Skeleton> createState() => _SkeletonState();
}

class _SkeletonState extends State<Skeleton>
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

  @override
  Widget build(BuildContext context) => AnimatedBuilder(
    animation: _shimmer,
    builder: (_, __) => Container(
      width: widget.width,
      height: widget.height,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(widget.borderRadius),
        gradient: LinearGradient(
          begin: Alignment(_shimmer.value - 1, 0),
          end: Alignment(_shimmer.value, 0),
          colors: const [
            Color(0xFF1C1C1C),
            Color(0xFF2D2D2D),
            Color(0xFF1C1C1C),
          ],
        ),
      ),
    ),
  );

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }
}

// ── Card skeleton
class CardSkeleton extends StatelessWidget {
  const CardSkeleton({super.key});

  @override
  Widget build(BuildContext context) => Padding(
    padding: const EdgeInsets.all(20),
    child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const Skeleton(width: 48, height: 48, borderRadius: 24),
      const SizedBox(height: 16),
      const Skeleton(height: 14),
      const SizedBox(height: 8),
      Skeleton(width: MediaQuery.of(context).size.width * 0.6, height: 12),
    ]),
  );
}`,
      },
    ],
    useCases: [
      { label: 'Feed / list screens', example: 'A social feed that shows 5 skeleton cards while the first page of posts loads. Users understand the shape of the content before it arrives.' },
      { label: 'Data tables', example: 'A dashboard table with skeleton rows. Each row\'s columns mirror the real data widths — "ID" column is narrow, "Description" is wide.' },
      { label: 'Next.js streaming', example: 'Place `<CardSkeleton>` in a `<Suspense fallback>`. As the server streams real data in, Next.js replaces skeletons automatically — no client-side loading state needed.' },
      { label: 'Image placeholders', example: 'A photo grid where each cell shows a skeleton while the image loads. Fades to the real image once loaded (`onLoad` → opacity transition).' },
    ],
    tips: [
      'Match skeleton proportions precisely to your real content. A skeleton that\'s the wrong size causes layout shift when content loads — arguably worse than a spinner.',
      'Don\'t animate the shimmer in reduced-motion mode. A static gray placeholder is perfectly acceptable and respects the user\'s system preference.',
    ],
    fr: {
      title: 'Chargement squelette',
      tagline: 'Espaces réservés shimmer qui correspondent à la forme de votre contenu',
      concept: 'Les écrans squelettes montrent la structure du contenu avant l\'arrivée des données. Au lieu d\'un spinner (qui dit "attendez"), un squelette dit "voici exactement où votre contenu va apparaître." L\'effet shimmer — une vague de lumière balayant de gauche à droite — signale un chargement actif sans monopoliser l\'attention. Les squelettes réduisent drastiquement le temps de chargement perçu.',
      howItWorks: [
        'Créer des éléments de substitution qui reflètent les dimensions de votre contenu réel — un rectangle pour les images, des rectangles plus courts pour les lignes de texte, un cercle pour les avatars.',
        'Superposer un dégradé qui se déplace de gauche à droite avec `translateX` de -100% à 100% en boucle infinie.',
        'Synchroniser l\'animation shimmer sur tous les squelettes de la page avec `animationDelay: 0s` uniforme — un décalage crée une apparence "brisée".',
        'Remplacer le squelette par le vrai contenu en douceur avec `AnimatePresence` + opacité — évite le flash brutal de substitution.',
      ],
      useCases: [
        { label: 'Fil d\'actualité', example: 'Les cartes de publication apparaissent comme des squelettes lors du premier chargement. Les utilisateurs voient immédiatement le layout avant les données.' },
        { label: 'Tableau de bord', example: 'Graphiques et widgets qui se chargent en parallèle. Chaque bloc squelette a les bonnes dimensions pour prévenir le décalage de mise en page.' },
        { label: 'Page de profil', example: 'Avatar circulaire + lignes de texte rectangulaires reflétant le nom et la bio. Familier et rassurant.' },
        { label: 'Résultats de recherche', example: 'Résultats squelettes apparaissant instantanément au tap, remplacés par les vrais résultats quand l\'API répond.' },
      ],
      tips: [
        'Correspondre précisément les proportions du squelette à votre contenu réel. Un squelette mal dimensionné cause un décalage de mise en page au chargement.',
        'Ne pas animer le shimmer en mode mouvement réduit. Un simple gris statique est parfaitement acceptable.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  6. Stagger List                                */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'stagger-list',
    title: 'Stagger List',
    category: 'List',
    difficulty: 'Beginner',
    tagline: 'Cascade children in with offset timing',
    concept:
      'A stagger list animates multiple children in sequence — each item starts after the previous one by a small delay (60–80ms). The cascade creates a wave of motion that guides the eye down the list naturally. It\'s the difference between a UI that "pops in" (jarring) and one that "unfolds" (considered). Stagger is especially powerful for grids and cards, where the cascade can follow reading order.',
    howItWorks: [
      'In Framer Motion, set `staggerChildren` on the container\'s `transition`. Each child automatically inherits the stagger delay based on its index.',
      'Children only need `hidden` and `visible` variants on themselves — the parent orchestrates the timing.',
      'Trigger with `useInView` on the container so the cascade starts as the list scrolls into view, not on page load.',
      'For dynamic lists (items added/removed), `AnimatePresence` handles enter/exit animations per item.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        code: `import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

export function StaggerList({ items }: { items: { id: string; label: string }[] }) {
  const ref = useRef<HTMLUListElement>(null)
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
        <motion.li key={it.id} variants={item}>
          {it.label}
        </motion.li>
      ))}
    </motion.ul>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: '`\'use client\'` required. In App Router, the list data can come from a Server Component — pass it as props to this Client Component.',
        code: `// app/page.tsx — Server Component
import { StaggerList } from '@/components/StaggerList'
import { getItems } from '@/lib/data' // server-side fetch

export default async function Page() {
  const items = await getItems()
  return <StaggerList items={items} />
}

// components/StaggerList.tsx — Client Component
'use client'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export function StaggerList({ items }: { items: { id: string; label: string }[] }) {
  const ref = useRef<HTMLUListElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.ul
      ref={ref}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
      }}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {items.map(it => (
        <motion.li
          key={it.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
        >
          {it.label}
        </motion.li>
      ))}
    </motion.ul>
  )
}`,
      },
      {
        platform: 'vue',
        deps: [],
        notes: 'Vue\'s `<TransitionGroup>` handles staggered list animations natively using CSS custom properties for the delay.',
        code: `<template>
  <TransitionGroup
    name="stagger"
    tag="ul"
    style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px"
  >
    <li
      v-for="(item, i) in items"
      :key="item.id"
      :style="{ '--i': i }"
    >
      {{ item.label }}
    </li>
  </TransitionGroup>
</template>

<script setup lang="ts">
defineProps<{
  items: { id: string; label: string }[]
}>()
</script>

<style scoped>
.stagger-enter-active {
  transition:
    opacity  0.5s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--i) * 70ms),
    transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) calc(var(--i) * 70ms);
}
.stagger-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
  position: absolute; /* Prevents layout shift during removal */
}
.stagger-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.stagger-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
/* Smooth reorder animation */
.stagger-move {
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
</style>`,
      },
      {
        platform: 'react-native',
        deps: ['react-native-reanimated'],
        notes: 'RN has no built-in stagger. Use `withDelay` per item. For long lists, use `FlatList` with `getItemLayout` — animating hundreds of items simultaneously tanks performance.',
        code: `import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { useEffect } from 'react'
import { View, FlatList } from 'react-native'

interface Item { id: string; label: string }

function StaggerItem({ item, index }: { item: Item; index: number }) {
  const opacity    = useSharedValue(0)
  const translateY = useSharedValue(20)
  const delay = index * 70 // ms

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 500 }))
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 500, easing: Easing.bezier(0.22, 1, 0.36, 1) })
    )
  }, [])

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <Animated.View style={[style, { marginBottom: 8 }]}>
      {/* render item.label */}
    </Animated.View>
  )
}

export function StaggerList({ items }: { items: Item[] }) {
  return (
    <FlatList
      data={items}
      keyExtractor={it => it.id}
      renderItem={({ item, index }) => <StaggerItem item={item} index={index} />}
    />
  )
}`,
      },
      {
        platform: 'flutter',
        deps: [],
        notes: 'Flutter\'s `AnimationController` drives a single timeline. Intervals (`Interval`) give each child its own start/end within that timeline.',
        code: `import 'package:flutter/material.dart';

class StaggerList extends StatefulWidget {
  final List<String> items;
  const StaggerList({required this.items, super.key});

  @override
  State<StaggerList> createState() => _StaggerListState();
}

class _StaggerListState extends State<StaggerList>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final List<Animation<double>> _fades;
  late final List<Animation<double>> _slides;

  @override
  void initState() {
    super.initState();
    final n = widget.items.length;
    // Total duration grows with item count
    _ctrl = AnimationController(
      vsync: this,
      duration: Duration(milliseconds: 300 + n * 70),
    );

    _fades  = List.generate(n, (i) {
      final start = (i * 70) / (300 + n * 70);
      final end   = (start + 500 / (300 + n * 70)).clamp(0.0, 1.0);
      return Tween<double>(begin: 0, end: 1).animate(
        CurvedAnimation(parent: _ctrl,
          curve: Interval(start, end, curve: Curves.easeOut)),
      );
    });

    _slides = List.generate(n, (i) {
      final start = (i * 70) / (300 + n * 70);
      final end   = (start + 500 / (300 + n * 70)).clamp(0.0, 1.0);
      return Tween<double>(begin: 20, end: 0).animate(
        CurvedAnimation(parent: _ctrl,
          curve: Interval(start, end, curve: Curves.easeOutCubic)),
      );
    });

    _ctrl.forward();
  }

  @override
  Widget build(BuildContext context) => Column(
    children: List.generate(widget.items.length, (i) =>
      AnimatedBuilder(
        animation: _ctrl,
        builder: (_, child) => Opacity(
          opacity: _fades[i].value,
          child: Transform.translate(
            offset: Offset(0, _slides[i].value),
            child: child,
          ),
        ),
        child: Padding(
          padding: const EdgeInsets.only(bottom: 8),
          child: Text(widget.items[i]),
        ),
      ),
    ),
  );

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }
}`,
      },
    ],
    useCases: [
      { label: 'Feature list', example: 'A "What\'s included" pricing list where each feature cascades in at 70ms. The reading-order stagger makes each feature register separately rather than as a wall of text.' },
      { label: 'Search results', example: 'Results that stagger in after a search query completes. The cascade signals "results are arriving" and makes even instant responses feel deliberate.' },
      { label: 'Navigation menu', example: 'A mobile nav that opens with menu items staggering in from the left. The cascade adds drama to an otherwise functional screen.' },
      { label: 'Card grid', example: 'A portfolio or product grid where cards stagger left-to-right, top-to-bottom. The wave pattern follows natural reading order.' },
    ],
    tips: [
      'Keep stagger delay at or below 80ms per item. At 100ms+, users wait for the last item — the cascade becomes a loading screen rather than an animation.',
      'For long lists (20+ items), cap the total stagger delay at ~400ms and compress the per-item delay accordingly. Nobody needs to wait 2 seconds for a list of 30 items to finish.',
    ],
    fr: {
      title: 'Liste en cascade',
      tagline: 'Faire cascader les enfants avec un timing décalé',
      concept: 'Une liste en cascade fait entrer les éléments un par un, chacun démarrant légèrement après le précédent. L\'œil suit naturellement la cascade — c\'est comme lire une liste à voix haute avec une pause entre chaque point. Ce pattern est particulièrement efficace pour les interfaces de navigation, menus, et résultats de recherche.',
      howItWorks: [
        'Définir des variantes `container` et `item`. Le container orchestre via `staggerChildren` ; chaque item hérite automatiquement du délai calculé.',
        'Le container déclenche ses enfants avec `staggerChildren: 0.07` — chaque enfant démarre 70ms après le précédent.',
        'Coupler avec `useInView` pour déclencher la cascade au défilement, pas au montage — les éléments hors-écran ne devraient pas animer.',
        'La cascade de sortie (`staggerDirection: -1`) inverse l\'ordre pour une sortie élégante.',
      ],
      useCases: [
        { label: 'Menu de navigation', example: 'Liens du menu qui apparaissent en cascade à l\'ouverture. Ajoute du caractère à un composant normalement statique.' },
        { label: 'Grille de résultats', example: 'Cartes de recherche ou produits qui cascadent à l\'apparition. Suggère que les résultats arrivent en temps réel.' },
        { label: 'Liste de tâches', example: 'Éléments qui glissent à leur apparition initiale. Établit la "physique" de l\'interface pour les insertions futures.' },
        { label: 'Notifications', example: 'Toast ou badge qui entrent en cascade. La hiérarchie temporelle indique l\'ordre de priorité.' },
      ],
      tips: [
        'Garder le délai de cascade à 80ms par élément maximum. Au-delà, les utilisateurs attendent le dernier item — la cascade devient un écran de chargement.',
        'Pour les longues listes (20+ éléments), plafonner le délai total à ~400ms et compresser le délai par élément en conséquence.',
      ],
    },
  },

  /* ── 7. Image Carousel ── */
  {
    slug: 'image-carousel',
    title: 'Image Carousel',
    category: 'Carousel',
    difficulty: 'Intermediate',
    tagline: 'Swipeable slides with scale depth and dark overlay.',
    concept: 'A direction-aware carousel uses AnimatePresence (web) or pagingEnabled FlatList (native) to slide cards in from the correct edge. A scale transform (0.92 → 1) adds depth as slides enter, and a dark overlay that fades out signals which slide is "arriving." Animated pill dots expand and contract to mark position.',
    howItWorks: [
      'Direction state: a [page, dir] tuple tracks which slide is active and which way we swiped so AnimatePresence can variant-pick the enter/exit edge.',
      'Scale-depth variants: the entering slide starts at scale 0.92 and springs to 1 — a subtle zoom that makes the transition feel three-dimensional.',
      'Dark overlay: a sibling motion.div initialises at opacity 0.5 and animates to 0 as the slide becomes active, creating a cinematic reveal.',
      'Drag-to-swipe: dragConstraints keep the card locked unless released above a velocity/offset threshold, at which point go(±1) advances the carousel.',
      'Animated dots: each indicator uses animate={{ width }} driven by a spring — the active dot expands to 20px; inactive ones collapse to 6px.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        notes: 'The custom prop on AnimatePresence passes dir to every variant function, enabling direction-aware enter/exit edges without external state.',
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
          key={page}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, { offset, velocity }) => {
            if (Math.abs(velocity.x) > 500 || Math.abs(offset.x) > 100)
              go(offset.x < 0 ? 1 : -1)
          }}
          style={{
            position: 'absolute', inset: 0,
            background: slides[page].color, borderRadius: 16,
            cursor: 'grab', display: 'flex', alignItems: 'flex-end', padding: 20,
          }}
        >
          {/* Overlay fades out as slide settles */}
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0.5 }}
            transition={{ duration: 0.3 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', borderRadius: 16 }}
          />
          <span style={{ position: 'relative', color: '#fff', fontSize: 16, fontWeight: 600 }}>
            {slides[page].label}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* Pill dots */}
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 5, zIndex: 10 }}>
        {slides.map((_, i) => (
          <motion.div
            key={i}
            onClick={() => go(i - page)}
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
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: "Add 'use client' — the drag handlers and useState require browser APIs. The implementation is otherwise identical to React.",
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
          key={page}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={(_, { offset, velocity }) => {
            if (Math.abs(velocity.x) > 500 || Math.abs(offset.x) > 100)
              go(offset.x < 0 ? 1 : -1)
          }}
          style={{
            position: 'absolute', inset: 0,
            background: slides[page].color, borderRadius: 16,
            cursor: 'grab', display: 'flex', alignItems: 'flex-end', padding: 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0.5 }}
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
          <motion.div
            key={i}
            onClick={() => go(i - page)}
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
      {
        platform: 'vue',
        deps: [],
        notes: 'Vue lacks a custom-prop equivalent for TransitionGroup, so we handle direction with two named transitions (slide-left / slide-right) and switch the name reactively.',
        code: `<template>
  <div class="carousel">
    <TransitionGroup :name="dir > 0 ? 'slide-left' : 'slide-right'">
      <div
        v-for="s in [slides[page]]"
        :key="page"
        class="slide"
        :style="{ background: s.color }"
        @touchstart.passive="startX = $event.touches[0].clientX"
        @touchend="onSwipe"
      >
        <div class="overlay" />
        <span class="label">{{ s.label }}</span>
      </div>
    </TransitionGroup>

    <div class="dots">
      <div
        v-for="(_, i) in slides"
        :key="i"
        class="dot"
        :class="{ active: i === page }"
        @click="go(i - page)"
      />
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
let startX = 0

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
.carousel { position: relative; overflow: hidden; height: 280px; border-radius: 16px; }
.slide    { position: absolute; inset: 0; border-radius: 16px; display: flex;
            align-items: flex-end; padding: 20px; }
.overlay  { position: absolute; inset: 0; border-radius: 16px; background: rgba(0,0,0,0.4);
            animation: fade-overlay 0.35s ease forwards; }
.label    { position: relative; color: #fff; font-size: 16px; font-weight: 600; }
.dots     { position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
            display: flex; gap: 5px; z-index: 10; }
.dot      { height: 6px; width: 6px; border-radius: 3px; background: rgba(255,255,255,0.4);
            cursor: pointer; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.dot.active { width: 20px; background: white; opacity: 1; }

.slide-left-enter-from,
.slide-right-leave-to  { transform: translateX(100%) scale(0.92); }
.slide-left-leave-to,
.slide-right-enter-from { transform: translateX(-100%) scale(0.92); }
.slide-left-enter-active, .slide-left-leave-active,
.slide-right-enter-active, .slide-right-leave-active {
  position: absolute; width: 100%;
  transition: transform 0.35s cubic-bezier(0.22,1,0.36,1), opacity 0.35s;
}

@keyframes fade-overlay { to { opacity: 0; } }
</style>`,
      },
      {
        platform: 'react-native',
        deps: [],
        notes: 'Animated.FlatList with pagingEnabled gives native-feel snapping for free. scrollX drives all per-item interpolations so no extra state is needed.',
        code: `import { useRef } from 'react'
import { Animated, View, FlatList, Dimensions, StyleSheet, Text } from 'react-native'

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
          const range  = [(index - 1) * W, index * W, (index + 1) * W]
          const scale  = scrollX.interpolate({ inputRange: range, outputRange: [0.92, 1, 0.92], extrapolate: 'clamp' })
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

      {/* Pill dots */}
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
      {
        platform: 'flutter',
        deps: [],
        notes: 'PageController.page drives AnimatedContainer width on the dots and manual Transform.scale on each page — no extra packages needed.',
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
          final overlay = dist * 0.5;
          return Container(
            margin: const EdgeInsets.symmetric(horizontal: 6),
            decoration: BoxDecoration(
              color: _slides[i].key, borderRadius: BorderRadius.circular(16),
            ),
            child: Stack(children: [
              Container(decoration: BoxDecoration(
                color: Colors.black.withOpacity(overlay),
                borderRadius: BorderRadius.circular(16))),
              Positioned(bottom: 20, left: 20,
                child: Text(_slides[i].value,
                  style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w600))),
            ]),
          );
        },
      ),
      Positioned(
        bottom: 12, left: 0, right: 0,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_slides.length, (i) => AnimatedContainer(
            duration: const Duration(milliseconds: 250),
            curve: Curves.easeOut,
            margin: const EdgeInsets.symmetric(horizontal: 2.5),
            width:  _page.round() == i ? 20.0 : 6.0,
            height: 6,
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
    ],
    useCases: [
      { label: 'Hero image gallery', example: 'A product page where the main photo carousel uses scale-depth so the active image feels "lifted" above the deck.' },
      { label: 'Onboarding slides', example: 'Full-bleed illustration slides that swipe in from the correct edge and dim as they leave — identical to App Store preview screens.' },
      { label: 'Testimonials', example: 'A quote carousel where each card fades its dark tint as it arrives, drawing the eye to the incoming content.' },
      { label: 'Featured content', example: 'A news or blog hero that auto-advances with pill dots signalling position without numbers.' },
    ],
    tips: [
      'Always pair scale with the dark overlay — without the overlay the scale-zoom looks like a glitch. Together they create a "depth pull" that reads as intentional.',
      'Set dragElastic to 0.2 not 1. Full elasticity lets the card drift far enough that users think they can swipe to nowhere — a small elastic feels responsive but bounded.',
    ],
    fr: {
      title: 'Carrousel d\'images',
      tagline: 'Slides swipables avec profondeur de scale et overlay sombre',
      concept: 'Un carrousel directionnel utilise `AnimatePresence` pour glisser les cartes depuis le bon bord. Un transform scale (0.92 → 1) ajoute de la profondeur à l\'entrée des slides, et un overlay sombre qui s\'estompe signale quelle slide "arrive". Des pastilles animées s\'étendent et se contractent pour indiquer la position.',
      howItWorks: [
        'Stocker `[page, direction]` dans un seul `useState`. La direction (+1/-1) est passée aux variantes via la prop `custom` d\'`AnimatePresence`.',
        'Les variantes `enter`/`exit` utilisent la direction pour choisir le bord d\'entrée/sortie. `enter: (d) => ({ x: d > 0 ? "100%" : "-100%", scale: 0.92 })`.',
        'L\'overlay sombre passe de `opacity: 0.4` (entrée) à `opacity: 0` (centre) pour chaque slide entrant — crée l\'effet de "surface s\'illuminant".',
        'Activer `drag="x"` avec `dragConstraints={{ left: 0, right: 0 }}` et un threshold `onDragEnd` pour le swipe mobile.',
      ],
      useCases: [
        { label: 'Galerie de produits', example: 'Photos du produit navigables gauche/droite. L\'animation directionnelle ancre l\'utilisateur dans l\'espace de la galerie.' },
        { label: 'Témoignages', example: 'Citations clients en rotation. Les transitions douces maintiennent le focus sur le contenu, pas sur le mécanisme.' },
        { label: 'Slides hero', example: 'Section hero en plein écran avec slides de contenu. Les pastilles donnent une navigation sans surcharger visuellement.' },
        { label: 'App mobile', example: 'Photo feed swipable à la Instagram. Le swipe avec élasticité imite le comportement natif attendu.' },
      ],
      tips: [
        'Toujours associer le scale avec l\'overlay sombre — sans l\'overlay, le zoom scale ressemble à un glitch. Ensemble, ils créent un "effet de profondeur".',
        'Mettre `dragElastic` à 0.2 et non 1. Une élasticité complète laisse la carte dériver trop loin et confuse l\'utilisateur.',
      ],
    },
  },

  /* ── 8. Onboarding Flow ── */
  {
    slug: 'onboarding-flow',
    title: 'Onboarding Flow',
    category: 'Navigation',
    difficulty: 'Beginner',
    tagline: 'Step-through screens with animated pill dot indicators.',
    concept: 'An onboarding flow cycles through 2–5 screens, each cross-fading or sliding with AnimatePresence. The signature detail is the dot row: the active dot expands its width via a spring from 8px to 24px while inactive dots contract, giving users a spatial sense of where they are without requiring numbers. The final step replaces "Next" with a CTA.',
    howItWorks: [
      'AnimatePresence mode="wait" ensures the outgoing screen fully exits before the incoming one enters — no simultaneous visibility that creates a flash.',
      'Keyed by step index: changing the key unmounts the old screen and mounts the new one, triggering the enter animation automatically.',
      'Dot width spring: a spring with high stiffness (500) and low damping (30) makes the dot expansion feel snappy and physical.',
      'Icon entrance: the per-step icon mounts with its own initial/animate, delayed 100ms so it pops in after the text container has settled.',
      'CTA swap: isLast drives the button label and behaviour — "Next →" advances while "Get started" can navigate to the main app.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        code: `import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const screens = [
  { color: '#534AB7', title: 'Welcome',      body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six production animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',      body: 'Copy step-by-step code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const s = screens[step]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24 }}>
      {/* Animated screen content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 64, height: 64, borderRadius: 20, background: s.color }}
            />
            <h2 style={{ margin: 0, fontFamily: 'var(--font-power)', fontSize: 20,
              fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {s.title}
            </h2>
            <p style={{ margin: 0, fontFamily: 'var(--font-outfit)', fontSize: 13,
              color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, maxWidth: 220 }}>
              {s.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pill dots */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 18 }}>
        {screens.map((_, i) => (
          <motion.div
            key={i}
            onClick={() => setStep(i)}
            animate={{ width: i === step ? 24 : 8, opacity: i === step ? 1 : 0.3, background: s.color }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{ height: 8, borderRadius: 4, cursor: 'pointer' }}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div style={{ display: 'flex', gap: 8 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-secondary)',
            fontFamily: 'var(--font-outfit)', fontSize: 13, cursor: 'pointer',
          }}>
            Back
          </button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => step < screens.length - 1 && setStep(s => s + 1)}
          style={{
            flex: 1, padding: '10px', borderRadius: 10, border: 'none',
            background: s.color, color: '#fff',
            fontFamily: 'var(--font-outfit)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}
        >
          {step === screens.length - 1 ? 'Get started →' : 'Next →'}
        </motion.button>
      </div>
    </div>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: "Requires 'use client'. Drop the component in any page.tsx — the server component boundary sits above it.",
        code: `'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const screens = [
  { color: '#534AB7', title: 'Welcome',      body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six production animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',      body: 'Copy step-by-step code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const s = screens[step]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24 }}>
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 32 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -32 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14 }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1,   opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              style={{ width: 64, height: 64, borderRadius: 20, background: s.color }}
            />
            <h2 style={{ margin: 0, fontFamily: 'var(--font-power)', fontSize: 20,
              fontWeight: 400, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              {s.title}
            </h2>
            <p style={{ margin: 0, fontFamily: 'var(--font-outfit)', fontSize: 13,
              color: 'var(--text-secondary)', textAlign: 'center', lineHeight: 1.6, maxWidth: 220 }}>
              {s.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 18 }}>
        {screens.map((_, i) => (
          <motion.div
            key={i}
            onClick={() => setStep(i)}
            animate={{ width: i === step ? 24 : 8, opacity: i === step ? 1 : 0.3, background: s.color }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{ height: 8, borderRadius: 4, cursor: 'pointer' }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} style={{
            flex: 1, padding: '10px', borderRadius: 10, border: '1px solid var(--border)',
            background: 'transparent', color: 'var(--text-secondary)',
            fontFamily: 'var(--font-outfit)', fontSize: 13, cursor: 'pointer',
          }}>
            Back
          </button>
        )}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => step < screens.length - 1 && setStep(s => s + 1)}
          style={{
            flex: 1, padding: '10px', borderRadius: 10, border: 'none',
            background: s.color, color: '#fff',
            fontFamily: 'var(--font-outfit)', fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}
        >
          {step === screens.length - 1 ? 'Get started →' : 'Next →'}
        </motion.button>
      </div>
    </div>
  )
}`,
      },
      {
        platform: 'vue',
        deps: [],
        notes: 'Vue Transition with mode="out-in" matches AnimatePresence mode="wait" — the leaving component fully unmounts before the entering one mounts.',
        code: `<template>
  <div class="onboarding">
    <div class="content">
      <Transition name="slide" mode="out-in">
        <div :key="step" class="screen">
          <div class="icon" :style="{ background: current.color }" />
          <h2>{{ current.title }}</h2>
          <p>{{ current.body }}</p>
        </div>
      </Transition>
    </div>

    <div class="dots">
      <div
        v-for="(_, i) in screens"
        :key="i"
        class="dot"
        :class="{ active: i === step }"
        :style="i === step ? { background: current.color } : {}"
        @click="step = i"
      />
    </div>

    <div class="nav">
      <button v-if="step > 0" class="back" @click="step--">Back</button>
      <button class="next" :style="{ background: current.color }" @click="advance">
        {{ step === screens.length - 1 ? 'Get started →' : 'Next →' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six production animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy step-by-step code straight into your project.' },
]

const step    = ref(0)
const current = computed(() => screens[step.value])

function advance() {
  if (step.value < screens.length - 1) step.value++
}
</script>

<style scoped>
.onboarding { height: 100%; display: flex; flex-direction: column; padding: 24px; }
.content    { flex: 1; position: relative; overflow: hidden; }
.screen     { position: absolute; inset: 0; display: flex; flex-direction: column;
              align-items: center; justify-content: center; gap: 14px; }
.icon       { width: 64px; height: 64px; border-radius: 20px; }
h2          { margin: 0; font-size: 20px; font-weight: 400; color: var(--text-primary); letter-spacing: -0.02em; }
p           { margin: 0; font-size: 13px; color: var(--text-secondary); text-align: center;
              line-height: 1.6; max-width: 220px; }
.dots       { display: flex; gap: 6px; justify-content: center; margin-bottom: 18px; }
.dot        { height: 8px; width: 8px; border-radius: 4px; background: rgba(0,0,0,0.2);
              cursor: pointer; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
.dot.active { width: 24px; opacity: 1; }
.nav        { display: flex; gap: 8px; }
.back       { flex: 1; padding: 10px; border-radius: 10px; border: 1px solid var(--border);
              background: transparent; color: var(--text-secondary); font-size: 13px; cursor: pointer; }
.next       { flex: 1; padding: 10px; border-radius: 10px; border: none;
              color: #fff; font-size: 13px; font-weight: 500; cursor: pointer; }

.slide-enter-from { opacity: 0; transform: translateX(32px); }
.slide-leave-to   { opacity: 0; transform: translateX(-32px); }
.slide-enter-active, .slide-leave-active { transition: all 0.28s cubic-bezier(0.22,1,0.36,1); }
</style>`,
      },
      {
        platform: 'react-native',
        deps: ['react-native-reanimated'],
        notes: 'FadeIn / FadeOut from react-native-reanimated provides the mode="wait" equivalent — exiting screen disappears before the next one appears.',
        code: `import { useState } from 'react'
import { View, Text, Pressable, StyleSheet } from 'react-native'
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

const screens = [
  { color: '#534AB7', title: 'Welcome',       body: 'The animation platform for every stack.' },
  { color: '#1D9E75', title: 'Pick a pattern', body: 'Six production animations, five platforms.' },
  { color: '#D85A30', title: 'Ship it',        body: 'Copy step-by-step code straight into your project.' },
]

export function OnboardingFlow() {
  const [step, setStep] = useState(0)
  const s = screens[step]

  return (
    <View style={styles.root}>
      {/* Screen content */}
      <View style={styles.content}>
        <Animated.View key={step} entering={FadeIn.duration(280)} exiting={FadeOut.duration(180)}
          style={styles.screen}>
          <View style={[styles.icon, { backgroundColor: s.color }]} />
          <Text style={styles.title}>{s.title}</Text>
          <Text style={styles.body}>{s.body}</Text>
        </Animated.View>
      </View>

      {/* Pill dots */}
      <View style={styles.dots}>
        {screens.map((_, i) => (
          <Pressable key={i} onPress={() => setStep(i)}>
            <Animated.View style={[styles.dot,
              i === step && { width: 24, backgroundColor: s.color, opacity: 1 }]} />
          </Pressable>
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.nav}>
        {step > 0 && (
          <Pressable style={styles.back} onPress={() => setStep(s => s - 1)}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
        )}
        <Pressable style={[styles.next, { backgroundColor: s.color }]}
          onPress={() => step < screens.length - 1 && setStep(s => s + 1)}>
          <Text style={styles.nextText}>
            {step === screens.length - 1 ? 'Get started →' : 'Next →'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  root:     { flex: 1, padding: 24 },
  content:  { flex: 1 },
  screen:   { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', gap: 14 },
  icon:     { width: 64, height: 64, borderRadius: 20 },
  title:    { fontSize: 20, fontWeight: '400', color: '#111', letterSpacing: -0.4 },
  body:     { fontSize: 13, color: '#666', textAlign: 'center', lineHeight: 20, maxWidth: 220 },
  dots:     { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 18 },
  dot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.2)' },
  nav:      { flexDirection: 'row', gap: 8 },
  back:     { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#ddd',
              alignItems: 'center' },
  backText: { fontSize: 13, color: '#666' },
  next:     { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center' },
  nextText: { fontSize: 13, fontWeight: '500', color: '#fff' },
})`,
      },
      {
        platform: 'flutter',
        deps: [],
        notes: 'AnimatedSwitcher with a custom SlideTransition gives the slide-in effect. PageController drives the dots via a listener on the PageView.',
        code: `import 'package:flutter/material.dart';

class OnboardingFlow extends StatefulWidget {
  const OnboardingFlow({super.key});
  @override State<OnboardingFlow> createState() => _State();
}

class _State extends State<OnboardingFlow> {
  int _step = 0;

  static const _screens = [
    (color: Color(0xFF534AB7), title: 'Welcome',       body: 'The animation platform for every stack.'),
    (color: Color(0xFF1D9E75), title: 'Pick a pattern', body: 'Six production animations, five platforms.'),
    (color: Color(0xFFD85A30), title: 'Ship it',        body: 'Copy step-by-step code straight into your project.'),
  ];

  @override
  Widget build(BuildContext context) {
    final s = _screens[_step];
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(children: [
        // Animated content
        Expanded(
          child: AnimatedSwitcher(
            duration: const Duration(milliseconds: 280),
            transitionBuilder: (child, anim) => FadeTransition(
              opacity: anim,
              child: SlideTransition(
                position: Tween(begin: const Offset(0.15, 0), end: Offset.zero).animate(anim),
                child: child,
              ),
            ),
            child: Column(
              key: ValueKey(_step),
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                AnimatedContainer(
                  duration: const Duration(milliseconds: 350),
                  curve: Curves.easeOutCubic,
                  width: 64, height: 64,
                  decoration: BoxDecoration(color: s.color, borderRadius: BorderRadius.circular(20)),
                ),
                const SizedBox(height: 14),
                Text(s.title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w400, letterSpacing: -0.4)),
                const SizedBox(height: 8),
                Text(s.body, textAlign: TextAlign.center,
                  style: const TextStyle(fontSize: 13, color: Colors.grey, height: 1.6)),
              ],
            ),
          ),
        ),

        // Pill dots
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: List.generate(_screens.length, (i) => GestureDetector(
            onTap: () => setState(() => _step = i),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 250),
              curve: Curves.easeOut,
              margin: const EdgeInsets.symmetric(horizontal: 3),
              width: i == _step ? 24.0 : 8.0,
              height: 8,
              decoration: BoxDecoration(
                color: i == _step ? s.color : Colors.black.withOpacity(0.2),
                borderRadius: BorderRadius.circular(4)),
            ),
          )),
        ),
        const SizedBox(height: 18),

        // Buttons
        Row(children: [
          if (_step > 0) ...[
            Expanded(child: OutlinedButton(
              onPressed: () => setState(() => _step--),
              child: const Text('Back'),
            )),
            const SizedBox(width: 8),
          ],
          Expanded(child: ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: s.color, foregroundColor: Colors.white),
            onPressed: () {
              if (_step < _screens.length - 1) setState(() => _step++);
            },
            child: Text(_step == _screens.length - 1 ? 'Get started →' : 'Next →'),
          )),
        ]),
      ]),
    );
  }
}`,
      },
    ],
    useCases: [
      { label: 'App first launch', example: 'A 3-step welcome flow that explains the value proposition before the user reaches the home screen.' },
      { label: 'Feature education', example: 'A contextual tooltip tour triggered when a user taps a "?" icon — same dot + AnimatePresence pattern, smaller surface.' },
      { label: 'Settings wizard', example: 'Multi-step setup (notification permissions, region, preferences) that can be abandoned mid-flow and resumed.' },
      { label: 'Subscription upsell', example: 'A 2–3 step paywall that walks through feature benefits before showing the pricing CTA.' },
    ],
    tips: [
      'Keep onboarding to 3 screens maximum. Research consistently shows completion rates drop sharply after slide 3 — every screen you add costs conversions.',
      'Animate the dot color to match the active screen\'s accent color. This tiny detail makes the dots feel thematically tied to the content rather than decorative.',
    ],
    fr: {
      title: 'Flux d\'onboarding',
      tagline: 'Écrans step-through avec indicateurs de pastilles animées',
      concept: 'Un flux d\'onboarding fait défiler 2–5 écrans avec `AnimatePresence`. La signature est la rangée de pastilles : la pastille active élargit sa largeur via un spring de 8px à 24px pendant que les inactives se contractent — donnant aux utilisateurs un sens spatial de leur position sans numéros. La dernière étape remplace "Suivant" par un CTA.',
      howItWorks: [
        'Stocker l\'index d\'étape actuel dans un `useState`. `AnimatePresence` + variantes de slide gèrent les transitions entre les écrans.',
        'La rangée de pastilles mappe chaque index à un `motion.div`. La pastille active a `width: 24` (spring), les inactives `width: 8`.',
        'Utiliser `layoutId` sur les pastilles pour que Framer Motion anime la largeur en douceur lors de la navigation.',
        'Le bouton "Suivant" devient conditionnellement "Commencer" ou votre CTA final sur la dernière étape.',
      ],
      useCases: [
        { label: 'Onboarding app', example: '3 écrans expliquant les fonctionnalités clés. Les pastilles indiquent la progression sans compter à voix haute.' },
        { label: 'Configuration initiale', example: 'Étapes de configuration (profil, préférences, notifications). L\'animation directionnelle ancre l\'utilisateur dans la séquence.' },
        { label: 'Tour de fonctionnalité', example: 'Présenter une nouvelle fonctionnalité post-mise à jour. Les slides ciblées informent sans submerger.' },
        { label: 'Tutoriel interactif', example: 'Guide d\'utilisation avec animations d\'illustration par étape. Le progrès visuel des pastilles maintient la motivation.' },
      ],
      tips: [
        'Garder l\'onboarding à 3 écrans maximum. Les taux de complétion chutent fortement après le slide 3.',
        'Animer la couleur des pastilles pour correspondre à l\'accent de l\'écran actif. Ce détail les rend thématiquement liées au contenu.',
      ],
    },
  },

  /* ── 9. Shared Element Transitions ── */
  {
    slug: 'shared-element',
    title: 'Shared Element Transitions',
    category: 'Navigation',
    difficulty: 'Advanced',
    tagline: 'Hero elements that morph seamlessly between list and detail.',
    concept: 'A shared element transition makes the same visual element appear to physically travel from its position in a list to its position in a detail view. In Framer Motion this is done with layoutId — the same string on two different motion elements tells the layout animation engine to animate between them rather than unmount/mount. The browser calculates position and size deltas automatically, interpolating corner radius, background, and dimensions simultaneously.',
    howItWorks: [
      'layoutId matching: when an element with layoutId="card-img-1" unmounts and a different element with the same layoutId mounts, Framer Motion detects the pair and FLIP-animates the transition — no coordinate math required.',
      'AnimatePresence enables the exit animation — without it, the outgoing element disappears instantly and the layout animation has nothing to travel from.',
      'The detail overlay appears with a separate opacity animation; only the shared element uses layoutId. This keeps the two concerns independent.',
      'Corner radius morphing: background, borderRadius, width, and height all interpolate automatically through the layout animation — no explicit transition needed.',
      'Scroll offset: for list items that may be scrolled out of view, Framer Motion reads the source element\'s getBoundingClientRect at mount time, so the animation origin is always accurate.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        notes: 'layoutId is the only API required for the hero transition. Everything else — overlay, sheet — is standard AnimatePresence.',
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
      {/* List */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(it => (
          <div
            key={it.id}
            onClick={() => setSelected(it.id)}
            style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 12,
              borderRadius: 12, border: '1px solid var(--border)',
              background: 'var(--bg-secondary)', cursor: 'pointer' }}
          >
            {/* Shared element — same layoutId as detail image */}
            <motion.div
              layoutId={\`hero-\${it.id}\`}
              style={{ width: 48, height: 48, borderRadius: 10,
                background: it.color, flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-power)', fontSize: 13,
                color: 'var(--text-primary)' }}>{it.title}</div>
              <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 11,
                color: 'var(--text-tertiary)', marginTop: 2 }}>{it.sub}</div>
            </div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>›</span>
          </div>
        ))}
      </div>

      {/* Detail overlay */}
      <AnimatePresence>
        {selected && item && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
            />
            <motion.div
              key="sheet"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'var(--bg)', borderRadius: '20px 20px 0 0',
                padding: 24, zIndex: 50 }}
            >
              {/* Same layoutId — morphs from list thumbnail to full banner */}
              <motion.div
                layoutId={\`hero-\${selected}\`}
                style={{ width: '100%', height: 160, borderRadius: 16,
                  background: item.color, marginBottom: 18 }}
              />
              <div style={{ fontFamily: 'var(--font-power)', fontSize: 22,
                color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 6 }}>
                {item.title}
              </div>
              <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 13,
                color: 'var(--text-secondary)' }}>
                {item.sub} · Tap backdrop to close
              </div>
              <button onClick={() => setSelected(null)} style={{
                marginTop: 20, padding: '10px 20px', borderRadius: 10,
                background: item.color, color: '#fff', border: 'none', cursor: 'pointer',
                fontFamily: 'var(--font-outfit)', fontSize: 13,
              }}>
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
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: "Add 'use client'. In App Router, layoutId transitions work across Client Component boundaries — both the list and the detail sheet must be in the same client tree.",
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
            <motion.div
              layoutId={\`hero-\${it.id}\`}
              style={{ width: 48, height: 48, borderRadius: 10, background: it.color, flexShrink: 0 }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-power)', fontSize: 13, color: 'var(--text-primary)' }}>{it.title}</div>
              <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>{it.sub}</div>
            </div>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>›</span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selected && item && (
          <>
            <motion.div key="backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }} />
            <motion.div key="sheet"
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 400, damping: 40 }}
              style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
                background: 'var(--bg)', borderRadius: '20px 20px 0 0', padding: 24, zIndex: 50 }}>
              <motion.div layoutId={\`hero-\${selected}\`}
                style={{ width: '100%', height: 160, borderRadius: 16, background: item.color, marginBottom: 18 }} />
              <div style={{ fontFamily: 'var(--font-power)', fontSize: 22, color: 'var(--text-primary)',
                letterSpacing: '-0.02em', marginBottom: 6 }}>{item.title}</div>
              <div style={{ fontFamily: 'var(--font-outfit)', fontSize: 13, color: 'var(--text-secondary)' }}>
                {item.sub} · Tap backdrop to close</div>
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
      {
        platform: 'vue',
        deps: ['@vueuse/motion'],
        notes: '@vueuse/motion does not support layoutId natively. The closest approach is a manual FLIP technique: record the thumbnail rect on click, then animate the detail image from that rect using CSS transforms.',
        code: `<template>
  <div class="root">
    <!-- List -->
    <div class="list">
      <div v-for="it in items" :key="it.id" class="row" @click="open(it)">
        <div class="thumb" :style="{ background: it.color }" :ref="el => thumbRefs[it.id] = el" />
        <div class="meta">
          <strong>{{ it.title }}</strong>
          <span>{{ it.sub }}</span>
        </div>
      </div>
    </div>

    <!-- Detail overlay -->
    <Transition name="sheet">
      <div v-if="selected" class="overlay" @click.self="close">
        <div class="sheet">
          <!-- Starts at thumb position, springs to full banner -->
          <div class="hero" :style="{ background: selected.color, ...heroStyle }" ref="heroRef" />
          <h2>{{ selected.title }}</h2>
          <p>{{ selected.sub }} · Click outside to close</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

const selected  = ref<typeof items[0] | null>(null)
const thumbRefs = ref<Record<string, HTMLElement>>({})
const heroRef   = ref<HTMLElement | null>(null)
const heroStyle = ref({})

async function open(item: typeof items[0]) {
  const thumb = thumbRefs.value[item.id]
  if (!thumb) { selected.value = item; return }

  const rect = thumb.getBoundingClientRect()
  selected.value = item

  await nextTick()

  if (!heroRef.value) return
  const heroRect = heroRef.value.getBoundingClientRect()
  const dx = rect.left - heroRect.left
  const dy = rect.top  - heroRect.top
  const sx = rect.width  / heroRect.width
  const sy = rect.height / heroRect.height

  // Start from thumb position
  heroRef.value.style.transition = 'none'
  heroRef.value.style.transform  = \`translate(\${dx}px, \${dy}px) scale(\${sx}, \${sy})\`
  heroRef.value.style.borderRadius = '10px'

  requestAnimationFrame(() => {
    heroRef.value!.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), border-radius 0.4s'
    heroRef.value!.style.transform  = ''
    heroRef.value!.style.borderRadius = '16px'
  })
}

function close() { selected.value = null }
</script>

<style scoped>
.root   { position: relative; height: 100%; overflow: hidden; }
.list   { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.row    { display: flex; gap: 12px; align-items: center; padding: 12px; border-radius: 12px;
          border: 1px solid var(--border); background: var(--bg-secondary); cursor: pointer; }
.thumb  { width: 48px; height: 48px; border-radius: 10px; flex-shrink: 0; }
.meta   { display: flex; flex-direction: column; gap: 2px; font-size: 13px; }
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 40;
           display: flex; align-items: flex-end; }
.sheet  { width: 100%; background: var(--bg); border-radius: 20px 20px 0 0; padding: 24px; }
.hero   { width: 100%; height: 160px; border-radius: 16px; margin-bottom: 18px;
          transform-origin: top left; }
h2      { margin: 0 0 6px; font-size: 20px; }
p       { margin: 0; font-size: 13px; color: var(--text-secondary); }

.sheet-enter-from, .sheet-leave-to { opacity: 0; }
.sheet-enter-active, .sheet-leave-active { transition: opacity 0.25s; }
</style>`,
      },
      {
        platform: 'react-native',
        deps: ['react-native-reanimated', '@react-navigation/native'],
        notes: 'React Navigation v7 has native shared element support via sharedElements on screen options. For standalone use, react-native-reanimated\'s layout animations achieve a similar effect.',
        code: `import { useState } from 'react'
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, FadeIn, FadeOut,
} from 'react-native-reanimated'

const { width: W } = Dimensions.get('window')

const items = [
  { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
  { id: 'b', color: '#1D9E75', title: 'Forest Path',     sub: 'Outdoors' },
  { id: 'c', color: '#D85A30', title: 'Desert Dunes',    sub: 'Travel' },
]

export function SharedElementDemo() {
  const [selected, setSelected] = useState<typeof items[0] | null>(null)
  const sheetY = useSharedValue(600)

  function open(item: typeof items[0]) {
    setSelected(item)
    sheetY.value = withSpring(0, { stiffness: 400, damping: 40 })
  }
  function close() {
    sheetY.value = withSpring(600, { stiffness: 400, damping: 40 })
    setTimeout(() => setSelected(null), 350)
  }

  const sheetStyle = useAnimatedStyle(() => ({ transform: [{ translateY: sheetY.value }] }))

  return (
    <View style={s.root}>
      {items.map(it => (
        <Pressable key={it.id} style={s.row} onPress={() => open(it)}>
          {/* In a real app, use sharedTransitionTag from Reanimated for the full effect */}
          <View style={[s.thumb, { backgroundColor: it.color }]} />
          <View style={s.meta}>
            <Text style={s.title}>{it.title}</Text>
            <Text style={s.sub}>{it.sub}</Text>
          </View>
        </Pressable>
      ))}

      {selected && (
        <>
          <Animated.View entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}
            style={s.backdrop}>
            <Pressable style={StyleSheet.absoluteFill} onPress={close} />
          </Animated.View>
          <Animated.View style={[s.sheet, sheetStyle]}>
            <View style={[s.hero, { backgroundColor: selected.color }]} />
            <Text style={s.sheetTitle}>{selected.title}</Text>
            <Text style={s.sheetSub}>{selected.sub} · Tap outside to close</Text>
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
  sheetTitle: { fontSize: 22, fontWeight: '400', letterSpacing: -0.4, marginBottom: 6 },
  sheetSub:   { fontSize: 13, color: '#666' },
})`,
      },
      {
        platform: 'flutter',
        deps: [],
        notes: "Flutter's Hero widget is the first-class shared element API. Wrap the same tag on both source and destination and Navigator handles the rest.",
        code: `import 'package:flutter/material.dart';

const _items = [
  (id: 'a', color: Color(0xFF534AB7), title: 'Northern Lights', sub: 'Nature'),
  (id: 'b', color: Color(0xFF1D9E75), title: 'Forest Path',     sub: 'Outdoors'),
  (id: 'c', color: Color(0xFFD85A30), title: 'Desert Dunes',    sub: 'Travel'),
];

// List screen
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
            border: Border.all(color: const Color(0xFFEEEEEE)),
          ),
          child: Row(children: [
            // Hero tag matches detail screen
            Hero(
              tag: 'hero-\${it.id}',
              child: Container(
                width: 48, height: 48,
                decoration: BoxDecoration(color: it.color, borderRadius: BorderRadius.circular(10)),
              ),
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

// Detail screen
class ItemDetail extends StatelessWidget {
  final ({String id, Color color, String title, String sub}) item;
  const ItemDetail({super.key, required this.item});

  @override
  Widget build(BuildContext context) => Scaffold(
    body: SafeArea(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          // Same Hero tag — Flutter animates between the two
          Hero(
            tag: 'hero-\${item.id}',
            child: Container(
              width: double.infinity, height: 200,
              decoration: BoxDecoration(color: item.color, borderRadius: BorderRadius.circular(16)),
            ),
          ),
          const SizedBox(height: 20),
          Text(item.title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w400, letterSpacing: -0.5)),
          const SizedBox(height: 6),
          Text(item.sub,   style: const TextStyle(color: Colors.grey, fontSize: 14)),
          const Spacer(),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: item.color, foregroundColor: Colors.white),
            onPressed: () => Navigator.pop(context),
            child: const Text('Back'),
          ),
        ]),
      ),
    ),
  );
}`,
      },
    ],
    useCases: [
      { label: 'Product list → detail', example: 'An e-commerce grid where the product image physically flies from the card to the full-bleed hero on the detail page.' },
      { label: 'Photo grid → lightbox', example: 'A gallery where tapping a thumbnail expands it into a full-screen lightbox with the image morphing position and size.' },
      { label: 'Avatar → profile', example: 'A message thread where tapping a contact avatar transitions to their profile with the avatar growing into the header image.' },
      { label: 'Card → modal', example: 'A notification card that expands into a detail sheet — the card surface morphs into the modal background.' },
    ],
    tips: [
      'Never put layoutId on a component that is conditionally rendered by the same parent at the same time — two matching layoutIds visible simultaneously causes a teleport glitch.',
      'Add layout to sibling elements adjacent to the shared element so they reflow smoothly rather than snapping when the hero expands.',
    ],
    fr: {
      title: 'Transitions d\'élément partagé',
      tagline: 'Éléments héros qui se morphent entre liste et détail',
      concept: 'Une transition d\'élément partagé donne l\'impression que le même élément visuel voyage physiquement de sa position dans une liste à sa position dans une vue détail. Dans Framer Motion, c\'est fait avec `layoutId` — la même chaîne sur deux `motion` éléments différents indique au moteur d\'animer entre eux plutôt que démonter/remonter.',
      howItWorks: [
        '`layoutId="hero-{id}"` sur l\'image dans la grille ET sur l\'image dans la vue détail. Framer Motion calcule automatiquement les deltas de position et taille.',
        'Envelopper la liste ET la vue détail dans un `<LayoutGroup>` pour que les animations de layout se coordonnent correctement.',
        'Utiliser `AnimatePresence mode="popLayout"` autour de la vue détail pour que les cartes de liste se recalculent quand le détail entre/sort.',
        'Les éléments frères avec `layout` se repositionnent en douceur quand le héros s\'expand — sans ça, ils snappent brutalement.',
      ],
      useCases: [
        { label: 'Grille vers détail', example: 'Vignette de photo qui se morphe en image plein écran. La continuité visuelle maintient le contexte de l\'utilisateur.' },
        { label: 'Liste de produits', example: 'Carte produit qui s\'expand en vue détail. L\'animation "d\'où ça vient" élimine la désorientation spatiale.' },
        { label: 'Article de blog', example: 'Image d\'en-tête en miniature dans le feed qui grandit à la taille complète dans l\'article.' },
        { label: 'App de musique', example: 'Cover album du mini-lecteur qui s\'expand vers le lecteur plein écran — signature de l\'app Apple Music.' },
      ],
      tips: [
        'Ne jamais mettre `layoutId` sur un composant rendu conditionnellement par le même parent en même temps — deux `layoutId` identiques visibles simultanément cause un glitch de téléportation.',
        'Ajouter `layout` aux éléments frères adjacents à l\'élément partagé pour qu\'ils se réorganisent en douceur quand le héros s\'expand.',
      ],
    },
  },

  /* ── 10. Collapsing Header ── */
  {
    slug: 'collapsing-header',
    title: 'Collapsing Header',
    category: 'Scroll',
    difficulty: 'Advanced',
    tagline: 'Scrolling shrinks the header, scales the avatar, and hides the search bar in perfect sync.',
    concept: 'A collapsing header links scroll position to multiple transform values simultaneously. useScroll tracks the container\'s scrollY, and useTransform maps that progress to independent CSS properties — header padding, avatar scale, title font size, and search bar opacity — all animating in parallel from a single scroll value. The result is a multi-layer morph that appears choreographed but requires no explicit keyframes.',
    howItWorks: [
      'useScroll with a container ref: instead of tracking page scroll, we pass the scrollable div\'s ref so the animation is scoped to the component.',
      'Multiple useTransform calls: each CSS property has its own useTransform mapping from the same scrollY. This single source of truth keeps all animations in lock step.',
      'No spring on transforms: scroll-driven animations must use linear or ease interpolation. Springs add lag that makes the header feel like it\'s "floating" behind the finger.',
      'position: sticky on the header: the header stays pinned at top:0 inside the scroll container without JS position recalculation.',
      'Clamp: useTransform clamps output values — scrolling past 120px doesn\'t keep shrinking; the header freezes at its minimum size.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        code: `import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function CollapsingHeader() {
  const containerRef = useRef<HTMLDivElement>(null)

  const { scrollY } = useScroll({ container: containerRef })

  // Map scroll 0→120px to each property's range
  const headerPadY  = useTransform(scrollY, [0, 120], [20, 10])
  const avatarScale = useTransform(scrollY, [0, 120], [1, 0.55])
  const titleSize   = useTransform(scrollY, [0, 120], [22, 14])
  const searchOp    = useTransform(scrollY, [0, 80],  [1, 0])

  return (
    <div ref={containerRef} style={{ height: '100%', overflowY: 'auto' }}>
      {/* Sticky collapsing header */}
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
              fontSize: titleSize,
              fontFamily: 'var(--font-power)', color: 'var(--text-primary)',
              letterSpacing: '-0.02em', lineHeight: 1.2, whiteSpace: 'nowrap',
            }}>
              Profile
            </motion.div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-outfit)',
              color: 'var(--text-tertiary)', marginTop: 2 }}>
              @username · 128 posts
            </div>
          </div>
        </div>

        <motion.div style={{ opacity: searchOp, pointerEvents: 'none' }}>
          <div style={{
            padding: '7px 12px', borderRadius: 10,
            border: '1px solid var(--border)', background: 'var(--bg-secondary)',
            fontFamily: 'var(--font-outfit)', fontSize: 12, color: 'var(--text-tertiary)',
          }}>
            Search posts...
          </div>
        </motion.div>
      </motion.header>

      {/* Scrollable content */}
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {Array.from({ length: 14 }).map((_, i) => (
          <div key={i} style={{
            padding: 14, borderRadius: 10,
            border: '1px solid var(--border)', background: 'var(--bg-secondary)',
          }}>
            <div style={{ width: 80, height: 7, borderRadius: 4,
              background: 'var(--border-strong)', marginBottom: 8 }} />
            <div style={{ width: '90%', height: 6, borderRadius: 3,
              background: 'var(--border)', marginBottom: 5 }} />
            <div style={{ width: '70%', height: 6, borderRadius: 3, background: 'var(--border)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: "Add 'use client' — useRef and useScroll are browser APIs. The implementation is otherwise identical to React.",
        code: `'use client'
import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

export function CollapsingHeader() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({ container: containerRef })

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
              fontSize: titleSize, fontFamily: 'var(--font-power)', color: 'var(--text-primary)',
              letterSpacing: '-0.02em', lineHeight: 1.2, whiteSpace: 'nowrap',
            }}>
              Profile
            </motion.div>
            <div style={{ fontSize: 11, fontFamily: 'var(--font-outfit)',
              color: 'var(--text-tertiary)', marginTop: 2 }}>
              @username · 128 posts
            </div>
          </div>
        </div>

        <motion.div style={{ opacity: searchOp, pointerEvents: 'none' }}>
          <div style={{
            padding: '7px 12px', borderRadius: 10,
            border: '1px solid var(--border)', background: 'var(--bg-secondary)',
            fontFamily: 'var(--font-outfit)', fontSize: 12, color: 'var(--text-tertiary)',
          }}>
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
      {
        platform: 'vue',
        deps: ['@vueuse/core'],
        notes: 'useScroll from @vueuse/core exposes a reactive y ref; computed properties map it to the same ranges as the Framer Motion useTransform calls.',
        code: `<template>
  <div ref="containerRef" class="root">
    <header class="header" :style="headerStyle">
      <div class="top-row">
        <div class="avatar-wrap" :style="avatarWrapStyle">
          <div class="avatar" />
        </div>
        <div class="names">
          <div class="username" :style="titleStyle">Profile</div>
          <div class="handle">@username · 128 posts</div>
        </div>
      </div>
      <div class="search" :style="searchStyle">Search posts...</div>
    </header>

    <div class="feed">
      <div v-for="i in 14" :key="i" class="card">
        <div class="line a" />
        <div class="line b" />
        <div class="line c" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useScroll } from '@vueuse/core'

const containerRef = ref<HTMLElement | null>(null)
const { y } = useScroll(containerRef)

function lerp(val: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = Math.max(0, Math.min(1, (val - inMin) / (inMax - inMin)))
  return outMin + t * (outMax - outMin)
}

const headerStyle = computed(() => ({
  paddingTop:    \`\${lerp(y.value, 0, 120, 20, 10)}px\`,
  paddingBottom: \`\${lerp(y.value, 0, 120, 20, 10)}px\`,
}))
const avatarWrapStyle = computed(() => ({
  transform: \`scale(\${lerp(y.value, 0, 120, 1, 0.55)})\`,
}))
const titleStyle = computed(() => ({
  fontSize: \`\${lerp(y.value, 0, 120, 22, 14)}px\`,
}))
const searchStyle = computed(() => ({
  opacity: lerp(y.value, 0, 80, 1, 0),
  pointerEvents: y.value > 70 ? 'none' : 'auto',
}))
</script>

<style scoped>
.root   { height: 100%; overflow-y: auto; }
.header { position: sticky; top: 0; z-index: 10; background: var(--bg);
          border-bottom: 1px solid var(--border); padding-left: 16px; padding-right: 16px; }
.top-row   { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.avatar-wrap { transform-origin: left center; flex-shrink: 0; }
.avatar  { width: 44px; height: 44px; border-radius: 22px; background: #534AB7; }
.names   { flex: 1; overflow: hidden; }
.username { font-size: 22px; letter-spacing: -0.02em; line-height: 1.2; white-space: nowrap; }
.handle  { font-size: 11px; color: var(--text-tertiary); margin-top: 2px; }
.search  { padding: 7px 12px; border-radius: 10px; border: 1px solid var(--border);
           background: var(--bg-secondary); font-size: 12px; color: var(--text-tertiary); }
.feed    { padding: 16px; display: flex; flex-direction: column; gap: 10px; }
.card    { padding: 14px; border-radius: 10px; border: 1px solid var(--border);
           background: var(--bg-secondary); }
.line    { border-radius: 3px; background: var(--border); margin-bottom: 5px; }
.line.a  { width: 80px; height: 7px; background: var(--border-strong); margin-bottom: 8px; }
.line.b  { width: 90%; height: 6px; }
.line.c  { width: 70%; height: 6px; margin-bottom: 0; }
</style>`,
      },
      {
        platform: 'react-native',
        deps: ['react-native-reanimated'],
        notes: 'useAnimatedScrollHandler feeds scrollY into useAnimatedStyle for a native-thread interpolation — no JS bridge jank on scroll.',
        code: `import { useRef } from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import Animated, {
  useSharedValue, useAnimatedScrollHandler, useAnimatedStyle, interpolate, Extrapolate,
} from 'react-native-reanimated'

const RANGE = [0, 120]

export function CollapsingHeader() {
  const scrollY = useSharedValue(0)

  const onScroll = useAnimatedScrollHandler(e => {
    scrollY.value = e.contentOffset.y
  })

  const headerStyle = useAnimatedStyle(() => ({
    paddingTop:    interpolate(scrollY.value, RANGE, [20, 10], Extrapolate.CLAMP),
    paddingBottom: interpolate(scrollY.value, RANGE, [20, 10], Extrapolate.CLAMP),
  }))
  const avatarStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(scrollY.value, RANGE, [1, 0.55], Extrapolate.CLAMP) }],
  }))
  const titleStyle = useAnimatedStyle(() => ({
    fontSize: interpolate(scrollY.value, RANGE, [22, 14], Extrapolate.CLAMP),
  }))
  const searchStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 80], [1, 0], Extrapolate.CLAMP),
  }))

  return (
    <View style={s.root}>
      <Animated.View style={[s.header, headerStyle]}>
        <View style={s.topRow}>
          <Animated.View style={[s.avatarWrap, avatarStyle]}>
            <View style={s.avatar} />
          </Animated.View>
          <View style={s.names}>
            <Animated.Text style={[s.username, titleStyle]}>Profile</Animated.Text>
            <Text style={s.handle}>@username · 128 posts</Text>
          </View>
        </View>
        <Animated.View style={[s.search, searchStyle]} pointerEvents="none">
          <Text style={s.searchText}>Search posts...</Text>
        </Animated.View>
      </Animated.View>

      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16} style={s.feed}>
        {Array.from({ length: 14 }).map((_, i) => (
          <View key={i} style={s.card}>
            <View style={[s.line, s.lineA]} />
            <View style={[s.line, s.lineB]} />
            <View style={[s.line, s.lineC]} />
          </View>
        ))}
      </Animated.ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  root:      { flex: 1, backgroundColor: '#fff' },
  header:    { paddingHorizontal: 16, borderBottomWidth: 1, borderColor: '#eee', backgroundColor: '#fff', zIndex: 10 },
  topRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  avatarWrap:{ transformOrigin: 'left', flexShrink: 0 },
  avatar:    { width: 44, height: 44, borderRadius: 22, backgroundColor: '#534AB7' },
  names:     { flex: 1, overflow: 'hidden' },
  username:  { letterSpacing: -0.4, lineHeight: 24 },
  handle:    { fontSize: 11, color: '#999', marginTop: 2 },
  search:    { paddingVertical: 7, paddingHorizontal: 12, borderRadius: 10,
               borderWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa' },
  searchText:{ fontSize: 12, color: '#999' },
  feed:      { flex: 1 },
  card:      { margin: 16, marginBottom: 0, padding: 14, borderRadius: 10,
               borderWidth: 1, borderColor: '#eee', backgroundColor: '#fafafa' },
  line:      { borderRadius: 3, backgroundColor: '#eee', marginBottom: 5 },
  lineA:     { width: 80, height: 7, backgroundColor: '#ddd', marginBottom: 8 },
  lineB:     { width: '90%', height: 6 },
  lineC:     { width: '70%', height: 6, marginBottom: 0 },
})`,
      },
      {
        platform: 'flutter',
        deps: [],
        notes: 'SliverAppBar handles collapsing natively — expandedHeight, flexibleSpace, and pinned: true provide the same behavior without custom scroll listeners.',
        code: `import 'package:flutter/material.dart';

class CollapsingHeaderPage extends StatelessWidget {
  const CollapsingHeaderPage({super.key});

  @override
  Widget build(BuildContext context) => CustomScrollView(
    slivers: [
      SliverAppBar(
        pinned: true,
        expandedHeight: 140,
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.white,
        elevation: 0,
        flexibleSpace: LayoutBuilder(
          builder: (_, constraints) {
            final t = ((constraints.maxHeight - kToolbarHeight) /
                       (140.0 - kToolbarHeight)).clamp(0.0, 1.0);

            return FlexibleSpaceBar(
              collapseMode: CollapseMode.pin,
              background: Padding(
                padding: const EdgeInsets.fromLTRB(16, 60, 16, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(children: [
                      // Avatar shrinks as t → 0
                      AnimatedScale(
                        scale: 0.55 + t * 0.45,
                        alignment: Alignment.centerLeft,
                        duration: Duration.zero,
                        child: CircleAvatar(radius: 22, backgroundColor: const Color(0xFF534AB7)),
                      ),
                      const SizedBox(width: 12),
                      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text('Profile',
                          style: TextStyle(
                            fontSize: 14 + t * 8,
                            fontWeight: FontWeight.w400,
                            letterSpacing: -0.4,
                          )),
                        const Text('@username · 128 posts',
                          style: TextStyle(fontSize: 11, color: Colors.grey)),
                      ]),
                    ]),
                    const SizedBox(height: 10),
                    // Search bar fades out
                    Opacity(
                      opacity: t.clamp(0.0, 1.0),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 7),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFAFAFA),
                          borderRadius: BorderRadius.circular(10),
                          border: Border.all(color: const Color(0xFFEEEEEE)),
                        ),
                        child: const Text('Search posts...',
                          style: TextStyle(fontSize: 12, color: Colors.grey)),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ),

      // Content
      SliverList.separated(
        itemCount: 14,
        separatorBuilder: (_, __) => const SizedBox(height: 0),
        itemBuilder: (_, i) => Container(
          margin: const EdgeInsets.fromLTRB(16, 10, 16, 0),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: const Color(0xFFFAFAFA),
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: const Color(0xFFEEEEEE)),
          ),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Container(width: 80, height: 7,  color: const Color(0xFFDDDDDD)),
            const SizedBox(height: 8),
            Container(width: double.infinity, height: 6, color: const Color(0xFFEEEEEE)),
            const SizedBox(height: 5),
            Container(width: 200, height: 6, color: const Color(0xFFEEEEEE)),
          ]),
        ),
      ),
    ],
  );
}`,
      },
    ],
    useCases: [
      { label: 'Social profile', example: 'A Twitter/Instagram-style profile header that collapses as the user scrolls through posts, keeping the username visible.' },
      { label: 'Product page', example: 'A product detail page where the hero image shrinks into a sticky price bar showing the name and CTA above the fold at all times.' },
      { label: 'Article reader', example: 'A blog post where the full publication header shrinks to a slim sticky bar showing just the title as the user reads.' },
      { label: 'Settings screen', example: 'A settings page with a large account avatar that compresses into the nav bar as sections scroll into view.' },
    ],
    tips: [
      'Never use a spring for scroll-driven transforms — springs lag behind the finger because they have momentum. Use linear or a fast ease curve (e.g., [0.25, 0.1, 0.25, 1]) so the header tracks 1:1 with scroll.',
      'Cap the scroll distance at 80–150px. If the header takes 300px to collapse, the user has already scrolled past two screens of content before it finishes — the effect goes unnoticed.',
    ],
    fr: {
      title: 'En-tête réductible',
      tagline: 'Le défilement réduit l\'en-tête, scale l\'avatar et masque la barre de recherche en parfaite synchronisation',
      concept: 'Un en-tête réductible lie la position de défilement à plusieurs valeurs de transform simultanément. `useScroll` suit le `scrollY` du conteneur, et `useTransform` mappe ce progrès à des propriétés CSS indépendantes — padding de l\'en-tête, scale de l\'avatar, taille du titre, opacité de la barre de recherche — s\'animant en parallèle depuis une seule valeur de défilement.',
      howItWorks: [
        '`useScroll({ container: scrollRef })` produit un `scrollY` MotionValue qui change à chaque frame de défilement sans re-render React.',
        '`useTransform(scrollY, [0, 80], [80, 50])` mappe 0–80px de scroll à une hauteur de 80px–50px. Chaque propriété a sa propre plage cible.',
        'Lier toutes les MotionValues transformées directement au `style` des éléments — Framer Motion met à jour le DOM en dehors de React pour les performances.',
        'L\'avatar scale de 1 à 0.6 pendant que le padding réduit — les deux se terminent au même point de défilement pour une chorégraphie serrée.',
      ],
      useCases: [
        { label: 'App mobile', example: 'En-tête de profil qui se réduit pendant que l\'utilisateur défile dans le contenu — pattern signature d\'Instagram et Twitter.' },
        { label: 'Page e-commerce', example: 'Barre de navigation sticky avec logo et recherche qui se contractent après quelques pixels de défilement.' },
        { label: 'Dashboard', example: 'En-tête avec résumé de stats qui se réduit pour donner plus d\'espace au contenu du tableau de bord.' },
        { label: 'Article/blog', example: 'Barre de progression de lecture qui apparaît dans l\'en-tête réductible. Combine deux patterns scroll en un.' },
      ],
      tips: [
        'Ne jamais utiliser un spring pour les transforms pilotés par le scroll — les springs ont de l\'inertie et lagent derrière le doigt. Utiliser linear ou une courbe d\'ease rapide.',
        'Plafonner la distance de scroll à 80–150px. Si l\'en-tête met 300px à se réduire, l\'effet passe inaperçu.',
      ],
    },
  },
]
