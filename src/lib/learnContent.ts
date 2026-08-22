export type PlatformId = 'react' | 'nextjs' | 'vue' | 'angular' | 'react-native' | 'flutter' | 'swiftui'
export type Context = 'web' | 'mobile'

export const WEB_PLATFORMS:    PlatformId[] = ['react', 'nextjs', 'vue', 'angular']
export const MOBILE_PLATFORMS: PlatformId[] = ['react-native', 'flutter', 'swiftui']

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
  { id: 'angular',      label: 'Angular',      badge: 'Animations API', color: '#DD0031', hasLiveDemo: false },
  { id: 'react-native', label: 'React Native', badge: 'Reanimated 3',   color: '#61DAFB', hasLiveDemo: false },
  { id: 'flutter',      label: 'Flutter',      badge: 'AnimationCtrl',  color: '#54C5F8', hasLiveDemo: false },
  { id: 'swiftui',      label: 'SwiftUI',      badge: 'withAnimation',  color: '#F9633B', hasLiveDemo: false },
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
  category: 'Entrance' | 'Navigation' | 'Scroll' | 'Feedback' | 'Loading' | 'List' | 'Carousel' | 'Morphing' | 'Spring'
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
        platform: 'angular',
        deps: [],
        notes: 'The Angular Animations API (`@angular/animations`) declares states and transitions upfront in the component decorator, then an `IntersectionObserver` toggles a bound state variable to trigger them — no imperative animation calls needed.',
        code: `import { Component, ElementRef, AfterViewInit, Input } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations'

@Component({
  selector: 'app-reveal-on-scroll',
  template: \`<div [@reveal]="visible ? 'in' : 'out'"><ng-content /></div>\`,
  animations: [
    trigger('reveal', [
      state('out', style({ opacity: 0, transform: 'translateY(32px)' })),
      state('in',  style({ opacity: 1, transform: 'translateY(0)' })),
      transition('out => in', animate('600ms cubic-bezier(0.22,1,0.36,1)')),
    ]),
  ],
})
export class RevealOnScrollComponent implements AfterViewInit {
  @Input() delay = 0
  visible = false

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => (this.visible = true), this.delay * 1000)
        observer.disconnect()
      }
    }, { rootMargin: '-80px' })
    observer.observe(this.el.nativeElement)
  }
}`,
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
      {
        platform: 'swiftui',
        deps: [],
        notes: 'SwiftUI has no built-in scroll-viewport callback like `IntersectionObserver`. `.onAppear` fires when the view is laid out inside a `ScrollView`, which is the closest native equivalent for a first-appearance reveal.',
        code: `import SwiftUI

struct RevealOnScroll<Content: View>: View {
    let delay: Double
    @ViewBuilder let content: Content

    @State private var visible = false

    init(delay: Double = 0, @ViewBuilder content: () -> Content) {
        self.delay = delay
        self.content = content()
    }

    var body: some View {
        content
            .opacity(visible ? 1 : 0)
            .offset(y: visible ? 0 : 32)
            .onAppear {
                withAnimation(.timingCurve(0.22, 1, 0.36, 1, duration: 0.6).delay(delay)) {
                    visible = true
                }
            }
    }
}

// Usage
struct SectionView: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            RevealOnScroll { Text("Section heading").font(.title2.bold()) }
            RevealOnScroll(delay: 0.1) { Text("Supporting copy") }
        }
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
        platform: 'angular',
        deps: ['@angular/animations'],
        notes: 'Angular Router exposes route data on the `<router-outlet>`\'s activated component, which `RouteReuseStrategy`-aware transition triggers use as the animation key — analogous to keying on `route.path` in Vue Router.',
        code: `import { trigger, transition, style, query, group, animate } from '@angular/animations'

export const routeFadeSlide = trigger('routeAnimations', [
  transition('* <=> *', [
    query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
    query(':enter', style({ opacity: 0, transform: 'translateY(16px)' }), { optional: true }),
    group([
      query(':leave', [
        animate('300ms cubic-bezier(0.22,1,0.36,1)', style({ opacity: 0, transform: 'translateY(-16px)' })),
      ], { optional: true }),
      query(':enter', [
        animate('300ms cubic-bezier(0.22,1,0.36,1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ], { optional: true }),
    ]),
  ]),
])

// app.component.ts
@Component({
  selector: 'app-root',
  template: \`<div [@routeAnimations]="getRouteKey(outlet)">
    <router-outlet #outlet="outlet"></router-outlet>
  </div>\`,
  animations: [routeFadeSlide],
})
export class AppComponent {
  getRouteKey(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation']
  }
}`,
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
      {
        platform: 'swiftui',
        deps: [],
        notes: 'SwiftUI has no built-in exit/enter sequencing like `AnimatePresence` — `.transition()` combined with `withAnimation` around the state change that swaps the view is the idiomatic equivalent, and `.id()` forces a fresh transition per key change.',
        code: `import SwiftUI

enum Page { case home, about, work }

struct RootView: View {
    @State private var page: Page = .home

    var body: some View {
        VStack {
            HStack {
                Button("Home")  { navigate(to: .home) }
                Button("About") { navigate(to: .about) }
                Button("Work")  { navigate(to: .work) }
            }

            ZStack {
                switch page {
                case .home:  HomeView()
                case .about: AboutView()
                case .work:  WorkView()
                }
            }
            .id(page)
            .transition(.asymmetric(
                insertion: .opacity.combined(with: .move(edge: .bottom)),
                removal: .opacity.combined(with: .move(edge: .top))
            ))
        }
    }

    func navigate(to newPage: Page) {
        withAnimation(.timingCurve(0.22, 1, 0.36, 1, duration: 0.3)) {
            page = newPage
        }
    }
}`,
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
        platform: 'angular',
        deps: ['@angular/animations'],
        notes: 'Angular has no gesture library equivalent to Framer Motion\'s `whileTap`/`drag`, so press feedback uses `HostListener` bindings driving a state-based animation trigger, and swipe uses raw pointer events with manual velocity tracking.',
        code: `import { Component, HostListener } from '@angular/core'
import { trigger, state, style, transition, animate } from '@angular/animations'

@Component({
  selector: 'app-spring-button',
  template: \`<button [@press]="pressed ? 'down' : 'up'"><ng-content /></button>\`,
  animations: [
    trigger('press', [
      state('up',   style({ transform: 'scale(1)' })),
      state('down', style({ transform: 'scale(0.94)' })),
      transition('up => down', animate('80ms ease-in')),
      transition('down => up', animate('400ms cubic-bezier(0.34,1.56,0.64,1)')),
    ]),
  ],
})
export class SpringButtonComponent {
  pressed = false

  @HostListener('pointerdown') onDown() { this.pressed = true }
  @HostListener('pointerup')   onUp()   { this.pressed = false }
  @HostListener('pointerleave') onLeave() { this.pressed = false }
}

// ── Swipe to dismiss
@Component({
  selector: 'app-swipe-card',
  template: \`<div (pointerdown)="onDown($event)" (pointermove)="onMove($event)" (pointerup)="onUp($event)"
    [style.transform]="'translateX(' + offsetX + 'px)'"
    [style.transition]="dragging ? 'none' : 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)'">
    <ng-content />
  </div>\`,
})
export class SwipeCardComponent {
  offsetX = 0
  dragging = false
  private startX = 0
  private lastTime = 0
  private velocity = 0

  onDown(e: PointerEvent) { this.dragging = true; this.startX = e.clientX; this.lastTime = e.timeStamp }
  onMove(e: PointerEvent) {
    if (!this.dragging) return
    const dx = e.clientX - this.startX
    this.velocity = dx / (e.timeStamp - this.lastTime)
    this.offsetX = dx
  }
  onUp() {
    this.dragging = false
    if (Math.abs(this.velocity) > 0.5 || Math.abs(this.offsetX) > 120) {
      this.offsetX = this.velocity > 0 ? 400 : -400
    } else {
      this.offsetX = 0
    }
  }
}`,
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
      {
        platform: 'swiftui',
        deps: [],
        notes: 'SwiftUI reads press state directly off a custom `ButtonStyle`\'s `configuration.isPressed` — no gesture wiring needed for press feedback. Swipe-to-dismiss uses `DragGesture` with a velocity-aware `.onEnded`.',
        code: `import SwiftUI

// ── Press feedback button
struct SpringButtonStyle: ButtonStyle {
    func makeBody(configuration: Configuration) -> some View {
        configuration.label
            .scaleEffect(configuration.isPressed ? 0.94 : 1)
            .animation(.spring(response: 0.25, dampingFraction: 0.5), value: configuration.isPressed)
    }
}

// Usage: Button("Buy now") { }.buttonStyle(SpringButtonStyle())

// ── Swipe to dismiss
struct SwipeCard<Content: View>: View {
    let onDismiss: () -> Void
    @ViewBuilder let content: Content

    @State private var offsetX: CGFloat = 0

    var body: some View {
        content
            .offset(x: offsetX)
            .gesture(
                DragGesture()
                    .onChanged { value in offsetX = value.translation.width }
                    .onEnded { value in
                        let velocity = value.predictedEndLocation.x - value.location.x
                        if abs(velocity) > 200 || abs(offsetX) > 120 {
                            withAnimation(.spring()) { offsetX = velocity > 0 ? 400 : -400 }
                            onDismiss()
                        } else {
                            withAnimation(.spring()) { offsetX = 0 }
                        }
                    }
            )
    }
}`,
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
        platform: 'angular',
        deps: [],
        notes: 'Angular has no reactive scroll-position primitive built in, so a `@HostListener(\'window:scroll\')` binding recomputes the progress on every scroll event and drives the parallax offsets through plain component properties bound in the template.',
        code: `import { Component, ElementRef, HostListener, Input } from '@angular/core'

@Component({
  selector: 'app-parallax-section',
  template: \`
    <section style="position: relative; overflow: hidden; min-height: 480px">
      <div [style.transform]="'translateY(' + bgY + 'px)'"
           [style.background-image]="'url(' + image + ')'"
           style="position: absolute; inset: -10%; background-size: cover; background-position: center; will-change: transform">
      </div>
      <div [style.transform]="'translateY(' + textY + 'px)'"
           style="position: relative; z-index: 1; padding: 80px 40px; will-change: transform">
        <ng-content />
      </div>
    </section>
  \`,
})
export class ParallaxSectionComponent {
  @Input() image = ''
  bgY = 0
  textY = 0

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('window:scroll')
  onScroll() {
    const rect = this.el.nativeElement.getBoundingClientRect()
    const vh = window.innerHeight
    const progress = 1 - rect.bottom / (rect.height + vh)
    this.bgY   = (progress * 2 - 1) * 40
    this.textY = (progress * 2 - 1) * -40
  }
}`,
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
      {
        platform: 'swiftui',
        deps: [],
        notes: 'SwiftUI has no direct scroll-offset API pre-iOS 17, so this uses a `GeometryReader` inside a `ScrollView` to read each layer\'s frame relative to the global coordinate space and derive an offset from it.',
        code: `import SwiftUI

struct ParallaxSection<Content: View>: View {
    let image: String
    @ViewBuilder let content: Content

    var body: some View {
        GeometryReader { geo in
            let minY = geo.frame(in: .global).minY
            let bgY = minY * 0.4      // background moves slower
            let textY = minY * -0.2   // foreground moves opposite, faster

            ZStack {
                Image(image)
                    .resizable()
                    .scaledToFill()
                    .frame(width: geo.size.width, height: geo.size.height + 100)
                    .offset(y: bgY)
                    .clipped()

                content
                    .offset(y: textY)
            }
        }
        .frame(height: 480)
        .clipped()
    }
}

// Usage inside a ScrollView
ScrollView {
    ParallaxSection(image: "hero") {
        Text("Section heading").font(.title.bold()).foregroundStyle(.white)
    }
    // ...rest of scrollable content
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
        platform: 'angular',
        deps: [],
        notes: 'Same technique as Vue — a plain CSS `@keyframes` shimmer is performant and needs no animation library. Angular components use `:host` styling instead of Vue\'s `scoped` attribute.',
        code: `import { Component, Input } from '@angular/core'

@Component({
  selector: 'app-skeleton',
  template: \`<div class="skeleton" [style.width]="width" [style.height.px]="height" [style.border-radius.px]="borderRadius"></div>\`,
  styles: [\`
    .skeleton {
      position: relative;
      overflow: hidden;
      background: var(--bg-tertiary);
    }
    .skeleton::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%);
      animation: shimmer 1.5s infinite linear;
    }
    @keyframes shimmer {
      from { transform: translateX(-100%); }
      to   { transform: translateX(100%); }
    }
  \`],
})
export class SkeletonComponent {
  @Input() width = '100%'
  @Input() height = 16
  @Input() borderRadius = 6
}

// ── Composed card skeleton
@Component({
  selector: 'app-card-skeleton',
  template: \`
    <div style="padding: 20px; border-radius: 12px; border: 1px solid var(--border)">
      <app-skeleton [width]="'48px'" [height]="48" [borderRadius]="24"></app-skeleton>
      <div style="margin-top: 16px; display: flex; flex-direction: column; gap: 8px">
        <app-skeleton width="60%" [height]="14"></app-skeleton>
        <app-skeleton width="90%" [height]="12"></app-skeleton>
        <app-skeleton width="75%" [height]="12"></app-skeleton>
      </div>
    </div>
  \`,
})
export class CardSkeletonComponent {}`,
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
      {
        platform: 'swiftui',
        deps: [],
        notes: 'Pure SwiftUI — no packages required. A `LinearGradient` inside a `TimelineView` (or an animated offset) sweeps across a shape mask, the same mental model as the CSS gradient sweep.',
        code: `import SwiftUI

struct Skeleton: View {
    var width: CGFloat? = nil
    var height: CGFloat = 16
    var cornerRadius: CGFloat = 6

    @State private var phase: CGFloat = -1

    var body: some View {
        RoundedRectangle(cornerRadius: cornerRadius)
            .fill(Color(.systemGray5))
            .frame(width: width, height: height)
            .overlay(
                LinearGradient(
                    colors: [.clear, .white.opacity(0.3), .clear],
                    startPoint: .leading,
                    endPoint: .trailing
                )
                .offset(x: phase * 200)
                .mask(RoundedRectangle(cornerRadius: cornerRadius))
            )
            .onAppear {
                withAnimation(.linear(duration: 1.5).repeatForever(autoreverses: false)) {
                    phase = 1
                }
            }
    }
}

// ── Card skeleton
struct CardSkeleton: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Skeleton(width: 48, height: 48, cornerRadius: 24)
            Skeleton(width: 160, height: 14)
            Skeleton(height: 12)
            Skeleton(width: 220, height: 12)
        }
        .padding(20)
    }
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
        platform: 'angular',
        deps: ['@angular/animations'],
        notes: 'The `query()` + `stagger()` combinator inside a list-level trigger is Angular\'s built-in answer to `staggerChildren` — it selects every entering child and applies increasing delays automatically, no manual index math required.',
        code: `import { trigger, transition, query, stagger, animate, style } from '@angular/animations'

export const staggerList = trigger('staggerList', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(20px)' }),
      stagger(70, [
        animate('500ms cubic-bezier(0.22,1,0.36,1)', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ], { optional: true }),
  ]),
])

@Component({
  selector: 'app-stagger-list',
  template: \`
    <ul [@staggerList]="items.length" style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px">
      <li *ngFor="let item of items">{{ item.label }}</li>
    </ul>
  \`,
  animations: [staggerList],
})
export class StaggerListComponent {
  @Input() items: { id: string; label: string }[] = []
}`,
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
      {
        platform: 'swiftui',
        deps: [],
        notes: 'SwiftUI has no built-in stagger container, so each row\'s `.animation(...).delay(index * interval)` provides the cascade — conceptually identical to the React Native `withDelay` per-item approach.',
        code: `import SwiftUI

struct StaggerList: View {
    let items: [String]
    @State private var appeared = false

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            ForEach(Array(items.enumerated()), id: \\.offset) { index, label in
                Text(label)
                    .opacity(appeared ? 1 : 0)
                    .offset(y: appeared ? 0 : 20)
                    .animation(
                        .timingCurve(0.22, 1, 0.36, 1, duration: 0.5)
                            .delay(Double(index) * 0.07),
                        value: appeared
                    )
            }
        }
        .onAppear { appeared = true }
    }
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
        platform: 'angular',
        deps: ['@angular/animations'],
        notes: 'Angular lacks a `custom` prop like Framer Motion\'s AnimatePresence, so direction is tracked as a plain component property and read inside the `params` of a parameterized `transition()` to pick the enter/exit edge.',
        code: `import { Component } from '@angular/core'
import { trigger, transition, style, animate, query, group } from '@angular/animations'

@Component({
  selector: 'app-image-carousel',
  template: \`
    <div class="carousel">
      <div [@slide]="{ value: page, params: { dir: dir } }" class="slide" [style.background]="slides[page].color"
           (touchstart)="onTouchStart($event)" (touchend)="onTouchEnd($event)">
        <div class="overlay"></div>
        <span class="label">{{ slides[page].label }}</span>
      </div>
      <div class="dots">
        <div *ngFor="let s of slides; let i = index" class="dot" [class.active]="i === page" (click)="go(i - page)"></div>
      </div>
    </div>
  \`,
  animations: [
    trigger('slide', [
      transition('* => *', [
        style({ position: 'relative' }),
        query(':enter', [
          style({ transform: 'translateX({{ dir }}%) scale(0.92)', opacity: 0.4 }),
        ], { optional: true }),
        group([
          query(':leave', [
            animate('350ms cubic-bezier(0.22,1,0.36,1)',
              style({ transform: 'translateX(calc(-1 * {{ dir }}%)) scale(0.92)', opacity: 0.4 })),
          ], { optional: true }),
          query(':enter', [
            animate('350ms cubic-bezier(0.22,1,0.36,1)', style({ transform: 'translateX(0) scale(1)', opacity: 1 })),
          ], { optional: true }),
        ]),
      ], { params: { dir: 100 } }),
    ]),
  ],
})
export class ImageCarouselComponent {
  slides = [
    { color: '#534AB7', label: 'Mountain Vista' },
    { color: '#1D9E75', label: 'Forest Trail' },
    { color: '#D85A30', label: 'Ocean Sunset' },
  ]
  page = 0
  dir = 100
  private startX = 0

  go(d: number) {
    if (d === 0) return
    this.dir = d > 0 ? 100 : -100
    this.page = (this.page + d + this.slides.length) % this.slides.length
  }

  onTouchStart(e: TouchEvent) { this.startX = e.touches[0].clientX }
  onTouchEnd(e: TouchEvent) {
    const dx = this.startX - e.changedTouches[0].clientX
    if (Math.abs(dx) > 50) this.go(dx > 0 ? 1 : -1)
  }
}`,
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
      {
        platform: 'swiftui',
        deps: [],
        notes: 'A `TabView` with `.tabViewStyle(.page)` gives paging and dot indicators for free, but this custom version keeps manual control over the scale-depth and overlay effects using `GeometryReader`-derived progress per slide.',
        code: `import SwiftUI

struct Slide { let color: Color; let label: String }

struct ImageCarousel: View {
    let slides: [Slide] = [
        Slide(color: Color(hex: "534AB7"), label: "Mountain Vista"),
        Slide(color: Color(hex: "1D9E75"), label: "Forest Trail"),
        Slide(color: Color(hex: "D85A30"), label: "Ocean Sunset"),
    ]
    @State private var page = 0

    var body: some View {
        ZStack(alignment: .bottom) {
            TabView(selection: $page) {
                ForEach(Array(slides.enumerated()), id: \\.offset) { index, slide in
                    ZStack(alignment: .bottomLeading) {
                        slide.color
                        Color.black.opacity(page == index ? 0 : 0.4)
                            .animation(.easeOut(duration: 0.3), value: page)
                        Text(slide.label)
                            .font(.headline).foregroundStyle(.white)
                            .padding(20)
                    }
                    .clipShape(RoundedRectangle(cornerRadius: 16))
                    .tag(index)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .animation(.spring(response: 0.4, dampingFraction: 0.85), value: page)

            HStack(spacing: 5) {
                ForEach(slides.indices, id: \\.self) { i in
                    Capsule()
                        .fill(.white.opacity(i == page ? 1 : 0.4))
                        .frame(width: i == page ? 20 : 6, height: 6)
                        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: page)
                        .onTapGesture { page = i }
                }
            }
            .padding(.bottom, 12)
        }
        .frame(height: 280)
    }
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
        'Pastilles animées : chaque indicateur utilise `animate={{ width }}` piloté par un spring — la pastille active s\'étend à 20px, les inactives se contractent à 6px.',
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
        platform: 'angular',
        deps: ['@angular/animations'],
        notes: 'The same query/group slide trigger from Page Transitions is reused here, keyed by step index instead of route — a good example of how one Angular Animations trigger can serve any "swap this view for that one" scenario.',
        code: `import { Component } from '@angular/core'
import { trigger, transition, query, style, group, animate } from '@angular/animations'

@Component({
  selector: 'app-onboarding-flow',
  template: \`
    <div class="onboarding">
      <div class="content" [@slide]="step">
        <div class="icon" [style.background]="current.color"></div>
        <h2>{{ current.title }}</h2>
        <p>{{ current.body }}</p>
      </div>

      <div class="dots">
        <div *ngFor="let s of screens; let i = index" class="dot" [class.active]="i === step"
             [style.background]="i === step ? current.color : ''" (click)="step = i"></div>
      </div>

      <div class="nav">
        <button *ngIf="step > 0" class="back" (click)="step = step - 1">Back</button>
        <button class="next" [style.background]="current.color" (click)="advance()">
          {{ step === screens.length - 1 ? 'Get started →' : 'Next →' }}
        </button>
      </div>
    </div>
  \`,
  animations: [
    trigger('slide', [
      transition('* => *', [
        query(':enter, :leave', style({ position: 'absolute' }), { optional: true }),
        query(':enter', style({ opacity: 0, transform: 'translateX(32px)' }), { optional: true }),
        group([
          query(':leave', [animate('280ms cubic-bezier(0.22,1,0.36,1)', style({ opacity: 0, transform: 'translateX(-32px)' }))], { optional: true }),
          query(':enter', [animate('280ms cubic-bezier(0.22,1,0.36,1)', style({ opacity: 1, transform: 'translateX(0)' }))], { optional: true }),
        ]),
      ]),
    ]),
  ],
})
export class OnboardingFlowComponent {
  screens = [
    { color: '#534AB7', title: 'Welcome', body: 'The animation platform for every stack.' },
    { color: '#1D9E75', title: 'Pick a pattern', body: 'Six production animations, five platforms.' },
    { color: '#D85A30', title: 'Ship it', body: 'Copy step-by-step code straight into your project.' },
  ]
  step = 0
  get current() { return this.screens[this.step] }

  advance() {
    if (this.step < this.screens.length - 1) this.step++
  }
}`,
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
      {
        platform: 'swiftui',
        deps: [],
        notes: 'SwiftUI\'s asymmetric `.transition()` from Page Transitions is reused here keyed on `step` via `.id()`, and the dots reuse the same spring-width pattern as the parallax and carousel implementations.',
        code: `import SwiftUI

struct OnboardingScreen { let color: Color; let title: String; let body: String }

struct OnboardingFlow: View {
    let screens = [
        OnboardingScreen(color: Color(hex: "534AB7"), title: "Welcome", body: "The animation platform for every stack."),
        OnboardingScreen(color: Color(hex: "1D9E75"), title: "Pick a pattern", body: "Six production animations, five platforms."),
        OnboardingScreen(color: Color(hex: "D85A30"), title: "Ship it", body: "Copy step-by-step code straight into your project."),
    ]
    @State private var step = 0
    var current: OnboardingScreen { screens[step] }

    var body: some View {
        VStack(spacing: 18) {
            VStack(spacing: 14) {
                RoundedRectangle(cornerRadius: 20).fill(current.color).frame(width: 64, height: 64)
                Text(current.title).font(.title3)
                Text(current.body).font(.footnote).multilineTextAlignment(.center)
                    .foregroundStyle(.secondary).frame(maxWidth: 220)
            }
            .id(step)
            .transition(.asymmetric(
                insertion: .opacity.combined(with: .move(edge: .trailing)),
                removal: .opacity.combined(with: .move(edge: .leading))
            ))
            .frame(maxHeight: .infinity)

            HStack(spacing: 6) {
                ForEach(screens.indices, id: \\.self) { i in
                    Capsule()
                        .fill(i == step ? current.color : Color.black.opacity(0.2))
                        .frame(width: i == step ? 24 : 8, height: 8)
                        .animation(.spring(response: 0.3, dampingFraction: 0.7), value: step)
                        .onTapGesture { step = i }
                }
            }

            HStack(spacing: 8) {
                if step > 0 {
                    Button("Back") { withAnimation(.timingCurve(0.22, 1, 0.36, 1, duration: 0.28)) { step -= 1 } }
                        .buttonStyle(.bordered)
                }
                Button(step == screens.count - 1 ? "Get started →" : "Next →") {
                    if step < screens.count - 1 {
                        withAnimation(.timingCurve(0.22, 1, 0.36, 1, duration: 0.28)) { step += 1 }
                    }
                }
                .buttonStyle(.borderedProminent)
                .tint(current.color)
            }
        }
        .padding(24)
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
        '`AnimatePresence mode="wait"` garantit que l\'écran sortant termine complètement sa sortie avant que l\'écran entrant ne commence — pas de double visibilité qui créerait un flash.',
        'Indexé par l\'étape : changer la `key` démonte l\'ancien écran et monte le nouveau, déclenchant automatiquement l\'animation d\'entrée.',
        'Spring de largeur des pastilles : un spring à forte rigidité (500) et faible amortissement (30) rend l\'expansion de la pastille vive et physique.',
        'Entrée de l\'icône : l\'icône de chaque étape se monte avec son propre initial/animate, retardée de 100ms pour apparaître après que le conteneur de texte s\'est stabilisé.',
        '`isLast` pilote le libellé et le comportement du bouton — "Suivant →" avance tandis que "Commencer" peut naviguer vers l\'application principale.',
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
        platform: 'angular',
        deps: [],
        notes: 'Angular Animations has no layoutId/FLIP primitive either, so this uses the same manual FLIP technique as the Vue implementation — record the thumbnail\'s rect on click, then animate the detail hero from that rect back to its natural layout with a plain CSS transition.',
        code: `import { Component, ElementRef, ViewChild, AfterViewChecked } from '@angular/core'

@Component({
  selector: 'app-shared-element-demo',
  template: \`
    <div class="root">
      <div class="list">
        <div *ngFor="let it of items" class="row" (click)="open(it, $event)">
          <div class="thumb" [style.background]="it.color"></div>
          <div class="meta"><strong>{{ it.title }}</strong><span>{{ it.sub }}</span></div>
        </div>
      </div>

      <div class="overlay" *ngIf="selected" (click)="close()">
        <div class="sheet" (click)="$event.stopPropagation()">
          <div #hero class="hero" [style.background]="selected.color"></div>
          <h2>{{ selected.title }}</h2>
          <p>{{ selected.sub }} · Click outside to close</p>
        </div>
      </div>
    </div>
  \`,
})
export class SharedElementDemoComponent {
  @ViewChild('hero') heroRef?: ElementRef<HTMLElement>
  items = [
    { id: 'a', color: '#534AB7', title: 'Northern Lights', sub: 'Nature' },
    { id: 'b', color: '#1D9E75', title: 'Forest Path', sub: 'Outdoors' },
    { id: 'c', color: '#D85A30', title: 'Desert Dunes', sub: 'Travel' },
  ]
  selected: typeof this.items[0] | null = null
  private originRect: DOMRect | null = null

  open(item: typeof this.items[0], e: MouseEvent) {
    this.originRect = (e.currentTarget as HTMLElement).querySelector('.thumb')!.getBoundingClientRect()
    this.selected = item
    requestAnimationFrame(() => this.playFlip())
  }

  private playFlip() {
    const hero = this.heroRef?.nativeElement
    if (!hero || !this.originRect) return
    const heroRect = hero.getBoundingClientRect()
    const dx = this.originRect.left - heroRect.left
    const dy = this.originRect.top - heroRect.top
    const sx = this.originRect.width / heroRect.width
    const sy = this.originRect.height / heroRect.height

    hero.style.transition = 'none'
    hero.style.transform = \`translate(\${dx}px, \${dy}px) scale(\${sx}, \${sy})\`
    hero.style.borderRadius = '10px'

    requestAnimationFrame(() => {
      hero.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1), border-radius 0.4s'
      hero.style.transform = ''
      hero.style.borderRadius = '16px'
    })
  }

  close() { this.selected = null }
}`,
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
      {
        platform: 'swiftui',
        deps: [],
        notes: 'A `matchedGeometryEffect` with the same `id`/`namespace` on both the list thumbnail and the detail hero is SwiftUI\'s first-class equivalent of `layoutId` — it interpolates frame, and combined with `.transition()` on the modal, gives the full hero-morph effect.',
        code: `import SwiftUI

struct GalleryItem: Identifiable { let id: String; let color: Color; let title: String; let sub: String }

struct SharedElementDemo: View {
    let items = [
        GalleryItem(id: "a", color: Color(hex: "534AB7"), title: "Northern Lights", sub: "Nature"),
        GalleryItem(id: "b", color: Color(hex: "1D9E75"), title: "Forest Path", sub: "Outdoors"),
        GalleryItem(id: "c", color: Color(hex: "D85A30"), title: "Desert Dunes", sub: "Travel"),
    ]
    @Namespace private var heroSpace
    @State private var selected: GalleryItem?

    var body: some View {
        ZStack {
            List(items) { item in
                HStack(spacing: 12) {
                    RoundedRectangle(cornerRadius: 10)
                        .fill(item.color)
                        .frame(width: 48, height: 48)
                        .matchedGeometryEffect(id: item.id, in: heroSpace, isSource: selected == nil)
                    VStack(alignment: .leading) {
                        Text(item.title).font(.subheadline.bold())
                        Text(item.sub).font(.caption).foregroundStyle(.secondary)
                    }
                }
                .onTapGesture { withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) { selected = item } }
            }

            if let item = selected {
                Color.black.opacity(0.5).ignoresSafeArea()
                    .onTapGesture { withAnimation { selected = nil } }
                VStack(alignment: .leading, spacing: 18) {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(item.color)
                        .frame(height: 160)
                        .matchedGeometryEffect(id: item.id, in: heroSpace, isSource: true)
                    Text(item.title).font(.title2)
                    Text("\\(item.sub) · Tap outside to close").font(.footnote).foregroundStyle(.secondary)
                }
                .padding(24)
                .frame(maxHeight: .infinity, alignment: .bottom)
                .background(.background, in: RoundedRectangle(cornerRadius: 20))
                .transition(.move(edge: .bottom))
            }
        }
    }
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
        'Correspondance par `layoutId` : quand un élément avec `layoutId="card-img-1"` démonte et qu\'un autre élément avec le même `layoutId` monte, Framer Motion détecte la paire et anime la transition en FLIP — aucun calcul de coordonnées requis.',
        '`AnimatePresence` permet l\'animation de sortie — sans elle, l\'élément sortant disparaît instantanément et l\'animation de layout n\'a rien depuis quoi voyager.',
        'La superposition de détail apparaît avec une animation d\'opacité séparée ; seul l\'élément partagé utilise `layoutId`. Cela garde les deux préoccupations indépendantes.',
        'Morphing du rayon de bordure : `background`, `borderRadius`, `width` et `height` s\'interpolent tous automatiquement via l\'animation de layout — aucune transition explicite n\'est nécessaire.',
        'Décalage de scroll : pour les éléments de liste qui peuvent être scrollés hors de vue, Framer Motion lit le `getBoundingClientRect` de l\'élément source au moment du montage, donc l\'origine de l\'animation est toujours exacte.',
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
        platform: 'angular',
        deps: [],
        notes: 'Angular has no reactive scroll-position primitive, so a `@HostListener(\'scroll\')` bound to the scrollable container recomputes every derived value via the same clamp/lerp helper on each event — matching the pattern used in the Vue implementation, which faces the same lack-of-primitive constraint.',
        code: `import { Component, ElementRef, ViewChild } from '@angular/core'

function lerp(val: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = Math.max(0, Math.min(1, (val - inMin) / (inMax - inMin)))
  return outMin + t * (outMax - outMin)
}

@Component({
  selector: 'app-collapsing-header',
  template: \`
    <div #container class="root" (scroll)="onScroll()">
      <header class="header" [style.padding-top.px]="headerPadY" [style.padding-bottom.px]="headerPadY">
        <div class="top-row">
          <div class="avatar-wrap" [style.transform]="'scale(' + avatarScale + ')'">
            <div class="avatar"></div>
          </div>
          <div class="names">
            <div class="username" [style.font-size.px]="titleSize">Profile</div>
            <div class="handle">&#64;username · 128 posts</div>
          </div>
        </div>
        <div class="search" [style.opacity]="searchOp">Search posts...</div>
      </header>
      <div class="feed">
        <div *ngFor="let i of [].constructor(14); let idx = index" class="card">
          <div class="line a"></div>
          <div class="line b"></div>
          <div class="line c"></div>
        </div>
      </div>
    </div>
  \`,
})
export class CollapsingHeaderComponent {
  @ViewChild('container') containerRef!: ElementRef<HTMLElement>
  headerPadY = 20
  avatarScale = 1
  titleSize = 22
  searchOp = 1

  onScroll() {
    const y = this.containerRef.nativeElement.scrollTop
    this.headerPadY   = lerp(y, 0, 120, 20, 10)
    this.avatarScale  = lerp(y, 0, 120, 1, 0.55)
    this.titleSize    = lerp(y, 0, 120, 22, 14)
    this.searchOp     = lerp(y, 0, 80, 1, 0)
  }
}`,
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
      {
        platform: 'swiftui',
        deps: [],
        notes: 'SwiftUI has no direct pre-iOS-17 scroll-offset publisher, so a `GeometryReader` inside the `ScrollView` reads the content offset via a `PreferenceKey`, and derived values feed the same header, avatar, and search bar.',
        code: `import SwiftUI

struct ScrollOffsetKey: PreferenceKey {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) { value = nextValue() }
}

struct CollapsingHeader: View {
    @State private var offset: CGFloat = 0

    var headerPadY: CGFloat  { lerp(offset, 0, 120, 20, 10) }
    var avatarScale: CGFloat { lerp(offset, 0, 120, 1, 0.55) }
    var titleSize: CGFloat   { lerp(offset, 0, 120, 22, 14) }
    var searchOp: CGFloat    { lerp(offset, 0, 80, 1, 0) }

    var body: some View {
        ScrollView {
            GeometryReader { geo in
                Color.clear.preference(key: ScrollOffsetKey.self, value: -geo.frame(in: .named("scroll")).minY)
            }
            .frame(height: 0)

            LazyVStack(spacing: 10) {
                ForEach(0..<14) { _ in
                    RoundedRectangle(cornerRadius: 10).fill(Color(.systemGray6)).frame(height: 60)
                }
            }
            .padding(16)
        }
        .coordinateSpace(name: "scroll")
        .onPreferenceChange(ScrollOffsetKey.self) { offset = max(0, $0) }
        .safeAreaInset(edge: .top) {
            VStack(spacing: 10) {
                HStack(spacing: 12) {
                    Circle().fill(Color(hex: "534AB7")).frame(width: 44 * avatarScale, height: 44 * avatarScale)
                    VStack(alignment: .leading) {
                        Text("Profile").font(.system(size: titleSize))
                        Text("@username · 128 posts").font(.caption2).foregroundStyle(.secondary)
                    }
                }
                Text("Search posts...")
                    .font(.caption)
                    .opacity(searchOp)
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .padding(8)
                    .background(Color(.systemGray6), in: RoundedRectangle(cornerRadius: 10))
            }
            .padding(.horizontal, 16)
            .padding(.vertical, headerPadY)
            .background(.background)
        }
    }
}

func lerp(_ val: CGFloat, _ inMin: CGFloat, _ inMax: CGFloat, _ outMin: CGFloat, _ outMax: CGFloat) -> CGFloat {
    let t = max(0, min(1, (val - inMin) / (inMax - inMin)))
    return outMin + t * (outMax - outMin)
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
        '`useScroll` avec une `container` ref : au lieu de suivre le scroll de la page, on passe le ref du div scrollable pour que l\'animation soit limitée au composant.',
        'Plusieurs appels `useTransform` : chaque propriété CSS a son propre mapping `useTransform` depuis le même `scrollY`. Cette source unique de vérité garde toutes les animations parfaitement synchronisées.',
        'Pas de spring sur les transforms : les animations pilotées par le scroll doivent utiliser une interpolation linéaire ou ease. Les springs ajoutent un délai qui donne l\'impression que l\'en-tête "flotte" derrière le doigt.',
        '`position: sticky` sur l\'en-tête : l\'en-tête reste épinglé à `top: 0` dans le conteneur de scroll sans recalcul de position en JS.',
        'Clamp : `useTransform` limite les valeurs de sortie — scroller au-delà de 120px n\'accentue plus la réduction ; l\'en-tête se fige à sa taille minimale.',
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

  /* ─────────────────────────────────────────────── */
  /*  11. Pan Dismiss                                */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'pan-dismiss',
    title: 'Pan Dismiss',
    category: 'Feedback',
    difficulty: 'Intermediate',
    tagline: 'Drag a card or sheet off-screen to dismiss it with native gesture feel',
    concept:
      'Pan dismiss tracks a drag gesture and maps the drag distance to opacity and scale transforms in real time. When the gesture exceeds a velocity or distance threshold, the element is animated off-screen and removed from the tree. Below the threshold it springs back to its origin. The result is a dismissal interaction that feels physically connected to the user\'s finger — the defining pattern of native mobile UIs.',
    howItWorks: [
      'Attach a gesture handler (`PanResponder` on React Native, `GestureDetector` on Flutter, or Framer Motion `drag` on web) to the element.',
      'On each drag event, update a `translateY` animated value. Simultaneously interpolate opacity and scale so the card visually fades as it moves away.',
      'In the gesture release handler, check `dy` (distance) and `vy` (velocity). If either exceeds the threshold, animate the card to off-screen and call the dismiss callback.',
      'If below the threshold, spring the animated value back to 0 using a stiff spring so it snaps home satisfyingly.',
    ],
    implementations: [
      {
        platform: 'react-native',
        deps: [],
        notes: 'Uses the built-in `PanResponder` API — no extra dependencies required. For complex gesture scenarios consider `react-native-gesture-handler`.',
        code: `import { useRef, useState } from 'react'
import { Animated, PanResponder, View, Text, StyleSheet } from 'react-native'

export function DismissableCard({ onDismiss }) {
  const translateY = useRef(new Animated.Value(0)).current
  const opacity    = translateY.interpolate({ inputRange: [0, 180], outputRange: [1, 0] })
  const scale      = translateY.interpolate({ inputRange: [0, 180], outputRange: [1, 0.88] })

  const pan = useRef(PanResponder.create({
    onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 8,
    onPanResponderMove: (_, g) => {
      if (g.dy > 0) translateY.setValue(g.dy)
    },
    onPanResponderRelease: (_, g) => {
      if (g.dy > 80 || g.vy > 0.5) {
        Animated.timing(translateY, { toValue: 400, duration: 220, useNativeDriver: true }).start(onDismiss)
      } else {
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true }).start()
      }
    },
  })).current

  return (
    <Animated.View
      {...pan.panHandlers}
      style={[styles.card, { transform: [{ translateY }, { scale }], opacity }]}
    >
      <Text style={styles.title}>Notification</Text>
      <Text style={styles.sub}>Drag down to dismiss</Text>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card:  { backgroundColor: '#fff', borderRadius: 16, padding: 20, margin: 16, elevation: 4 },
  title: { fontSize: 16, fontWeight: '600' },
  sub:   { fontSize: 13, color: '#888', marginTop: 4 },
})`,
      },
      {
        platform: 'flutter',
        deps: [],
        notes: 'Uses `GestureDetector` + `AnimationController`. No packages required — everything is built into the Flutter SDK.',
        code: `import 'package:flutter/material.dart';

class DismissableCard extends StatefulWidget {
  final VoidCallback onDismiss;
  const DismissableCard({super.key, required this.onDismiss});
  @override State<DismissableCard> createState() => _State();
}

class _State extends State<DismissableCard> with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  double _dy = 0;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(vsync: this, duration: const Duration(milliseconds: 220));
  }

  @override
  void dispose() { _ctrl.dispose(); super.dispose(); }

  void _onEnd(DragEndDetails d) {
    if (_dy > 80 || d.velocity.pixelsPerSecond.dy > 500) {
      _ctrl.forward().then((_) => widget.onDismiss());
    } else {
      setState(() => _dy = 0);
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = (_dy / 180).clamp(0.0, 1.0);
    return GestureDetector(
      onVerticalDragUpdate: (d) => setState(() => _dy = (_dy + d.delta.dy).clamp(0, 400)),
      onVerticalDragEnd:    _onEnd,
      child: Transform.translate(
        offset: Offset(0, _dy),
        child: Opacity(
          opacity: (1 - t).clamp(0.0, 1.0),
          child: Transform.scale(
            scale: 1 - t * 0.12,
            child: Card(
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: const [
                  Text('Notification', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
                  SizedBox(height: 4),
                  Text('Drag down to dismiss', style: TextStyle(color: Colors.grey)),
                ]),
              ),
            ),
          ),
        ),
      ),
    );
  }
}`,
      },
      {
        platform: 'swiftui',
        deps: [],
        notes: '`DragGesture` combined with `withAnimation` on release gives the same threshold-check-then-spring-or-dismiss flow — no third-party gesture library needed.',
        code: `import SwiftUI

struct DismissableCard: View {
    let onDismiss: () -> Void
    @State private var dy: CGFloat = 0

    var body: some View {
        VStack(alignment: .leading, spacing: 4) {
            Text("Notification").font(.headline)
            Text("Drag down to dismiss").font(.subheadline).foregroundStyle(.secondary)
        }
        .padding(20)
        .background(.background, in: RoundedRectangle(cornerRadius: 16))
        .shadow(radius: 4)
        .offset(y: dy)
        .opacity(Double(1 - min(dy, 180) / 180))
        .scaleEffect(1 - min(dy, 180) / 180 * 0.12)
        .gesture(
            DragGesture()
                .onChanged { value in if value.translation.height > 0 { dy = value.translation.height } }
                .onEnded { value in
                    if dy > 80 || value.predictedEndTranslation.height > 500 {
                        withAnimation(.easeIn(duration: 0.22)) { dy = 400 }
                        DispatchQueue.main.asyncAfter(deadline: .now() + 0.22) { onDismiss() }
                    } else {
                        withAnimation(.spring(response: 0.3, dampingFraction: 0.75)) { dy = 0 }
                    }
                }
        )
    }
}`,
      },
      {
        platform: 'react',
        deps: ['framer-motion'],
        code: `import { useMotionValue, useTransform, animate, motion } from 'framer-motion'

export function DismissableCard({ onDismiss }) {
  const y       = useMotionValue(0)
  const opacity = useTransform(y, [0, 180], [1, 0])
  const scale   = useTransform(y, [0, 180], [1, 0.88])

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.6}
      style={{ y, opacity, scale }}
      onDragEnd={(_, { offset, velocity }) => {
        if (offset.y > 80 || velocity.y > 500) {
          animate(y, 400, { duration: 0.22, ease: 'easeIn' }).then(onDismiss)
        } else {
          animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 })
        }
      }}
      className="card"
    >
      <h3>Notification</h3>
      <p>Drag down to dismiss</p>
    </motion.div>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: 'Add `\'use client\'` — all drag and animation hooks require a browser environment.',
        code: `'use client'
import { useMotionValue, useTransform, animate, motion } from 'framer-motion'

export function DismissableCard({ onDismiss }: { onDismiss: () => void }) {
  const y       = useMotionValue(0)
  const opacity = useTransform(y, [0, 180], [1, 0])
  const scale   = useTransform(y, [0, 180], [1, 0.88])

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.6}
      style={{ y, opacity, scale, touchAction: 'none' }}
      onDragEnd={(_, { offset, velocity }) => {
        if (offset.y > 80 || velocity.y > 500) {
          animate(y, 400, { duration: 0.22, ease: 'easeIn' }).then(onDismiss)
        } else {
          animate(y, 0, { type: 'spring', stiffness: 400, damping: 30 })
        }
      }}
      className="card"
    >
      <h3>Notification</h3>
      <p>Drag down to dismiss</p>
    </motion.div>
  )
}`,
      },
      {
        platform: 'vue',
        deps: ['@vueuse/gesture'],
        notes: '`@vueuse/gesture` wraps pointer events. Alternatively wire up `@vue-use/pointer` or raw `pointermove` listeners.',
        code: `<template>
  <div
    v-gesture.drag="onDrag"
    :style="{
      transform: \`translateY(\${dy}px) scale(\${cardScale})\`,
      opacity: cardOpacity,
      touchAction: 'none',
    }"
    class="card"
  >
    <h3>Notification</h3>
    <p>Drag down to dismiss</p>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['dismiss'])
const dy = ref(0)

const cardOpacity = computed(() => Math.max(0, 1 - dy.value / 180))
const cardScale   = computed(() => Math.max(0.88, 1 - (dy.value / 180) * 0.12))

function onDrag({ delta, velocityY, last }) {
  if (!last) {
    dy.value = Math.max(0, dy.value + delta[1])
    return
  }
  if (dy.value > 80 || velocityY > 0.5) {
    emit('dismiss')
  } else {
    dy.value = 0
  }
}
</script>`,
      },
      {
        platform: 'angular',
        deps: [],
        notes: 'Raw `pointerdown`/`pointermove`/`pointerup` bindings drive the same delta/velocity threshold check as every other platform here — Angular has no built-in drag directive, so this stays close to the DOM.',
        code: `import { Component } from '@angular/core'

@Component({
  selector: 'app-dismissable-card',
  template: \`
    <div class="card"
         [style.transform]="'translateY(' + dy + 'px) scale(' + cardScale + ')'"
         [style.opacity]="cardOpacity"
         style="touch-action: none"
         (pointerdown)="onDown($event)" (pointermove)="onMove($event)" (pointerup)="onUp()">
      <h3>Notification</h3>
      <p>Drag down to dismiss</p>
    </div>
  \`,
})
export class DismissableCardComponent {
  dy = 0
  private startY = 0
  private lastY = 0
  private lastTime = 0
  private velocity = 0
  private dragging = false

  get cardOpacity() { return Math.max(0, 1 - this.dy / 180) }
  get cardScale()   { return Math.max(0.88, 1 - (this.dy / 180) * 0.12) }

  onDown(e: PointerEvent) {
    this.dragging = true
    this.startY = e.clientY - this.dy
    this.lastY = e.clientY
    this.lastTime = e.timeStamp
  }

  onMove(e: PointerEvent) {
    if (!this.dragging) return
    const next = e.clientY - this.startY
    this.velocity = (e.clientY - this.lastY) / (e.timeStamp - this.lastTime)
    this.lastY = e.clientY
    this.lastTime = e.timeStamp
    if (next > 0) this.dy = next
  }

  onUp() {
    this.dragging = false
    if (this.dy > 80 || this.velocity > 0.5) {
      this.dy = 400 // trigger CSS transition to off-screen, then emit dismiss
    } else {
      this.dy = 0
    }
  }
}`,
      },
    ],
    useCases: [
      { label: 'Notification tray',  example: 'Pull down a notification card to dismiss it — the native iOS/Android interaction replicated in-app.' },
      { label: 'Bottom sheet',       example: 'A modal sheet the user can drag down to close instead of tapping a close button.' },
      { label: 'Swipe-to-delete',    example: 'Swipe a list item horizontally to reveal a delete action — standard pattern in mail and todo apps.' },
      { label: 'Story viewer',       example: 'Drag down to exit a full-screen story or image viewer, matching the Instagram/Snapchat interaction model.' },
    ],
    tips: [
      'Use `dragConstraints={{ top: 0, bottom: 0 }}` in Framer Motion so the card springs back automatically when released below the threshold — you only need to override this in `onDragEnd` when dismissing.',
      'Apply `touch-action: none` on the draggable element to prevent the browser from intercepting the gesture for scroll.',
      'Combine translateY with opacity and scale transforms for a rich dismiss feel — a card that only translates looks flat.',
      'Keep the dismiss threshold between 60–100px and velocity threshold around 500px/s. Too low = accidental dismissal; too high = the gesture feels broken.',
    ],
    fr: {
      title: 'Balayage pour fermer',
      tagline: 'Faites glisser une carte ou une feuille hors de l\'écran pour la fermer avec un geste natif fluide',
      concept:
        'Le balayage pour fermer suit un geste de glissement et mappe la distance de glissement à des transformations d\'opacité et d\'échelle en temps réel. Quand le geste dépasse un seuil de vitesse ou de distance, l\'élément est animé hors de l\'écran et retiré de l\'arbre. En dessous du seuil, il revient à son origine avec un ressort. Le résultat est une interaction de fermeture qui semble physiquement liée au doigt de l\'utilisateur — le pattern signature des interfaces mobiles natives.',
      howItWorks: [
        'Attacher un gestionnaire de gestes (`PanResponder` sur React Native, `GestureDetector` sur Flutter, ou `drag` de Framer Motion sur le web) à l\'élément.',
        'À chaque événement de glissement, mettre à jour une valeur animée `translateY`. Interpoler simultanément l\'opacité et l\'échelle pour que la carte s\'estompe visuellement au fur et à mesure qu\'elle s\'éloigne.',
        'Dans le gestionnaire de fin de geste, vérifier `dy` (distance) et `vy` (vitesse). Si l\'un dépasse le seuil, animer la carte hors de l\'écran et appeler le callback de fermeture.',
        'En dessous du seuil, ramener la valeur animée à 0 avec un ressort rigide pour qu\'elle revienne à sa place de façon satisfaisante.',
      ],
      useCases: [
        { label: 'Barre de notifications', example: 'Tirer vers le bas une carte de notification pour la fermer — l\'interaction native iOS/Android reproduite dans l\'application.' },
        { label: 'Feuille inférieure',     example: 'Une feuille modale que l\'utilisateur peut faire glisser vers le bas pour fermer au lieu de taper sur un bouton de fermeture.' },
        { label: 'Glisser pour supprimer', example: 'Glisser un élément de liste horizontalement pour révéler une action de suppression — pattern standard dans les applications mail et todo.' },
        { label: 'Visionneuse de stories', example: 'Faire glisser vers le bas pour quitter une visionneuse d\'images plein écran, correspondant au modèle d\'interaction Instagram/Snapchat.' },
      ],
      tips: [
        'Utiliser `dragConstraints={{ top: 0, bottom: 0 }}` dans Framer Motion pour que la carte revienne automatiquement quand relâchée en dessous du seuil — override uniquement dans `onDragEnd` lors de la fermeture.',
        'Appliquer `touch-action: none` sur l\'élément draggable pour éviter que le navigateur intercepte le geste pour le scroll.',
        'Combiner translateY avec des transformations d\'opacité et d\'échelle pour une fermeture riche — une carte qui se translate seulement paraît plate.',
        'Garder le seuil de fermeture entre 60–100px et le seuil de vitesse autour de 500px/s. Trop bas = fermeture accidentelle ; trop haut = le geste semble cassé.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  12. Flutter Hero                               */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'flutter-hero',
    title: 'Flutter Hero',
    category: 'Navigation',
    difficulty: 'Intermediate',
    tagline: 'A shared element morphs seamlessly between two screens during navigation',
    concept:
      'The Hero pattern animates a shared visual element — an image, avatar, or card — from its position on one screen to its position on another. Instead of the two screens cutting or crossfading independently, the shared element flies through space while the rest of the UI transitions around it. Flutter\'s `Hero` widget and Framer Motion\'s `layoutId` both implement this idea: they snapshot the element in its origin state, then FLIP-animate it to its destination position during the route change.',
    howItWorks: [
      'Mark the same element on both screens with a matching identifier (`tag` in Flutter, `layoutId` in Framer Motion, `sharedElementTransition` in React Navigation).',
      'On navigation, the framework detects the matching pair and creates an animation overlay — the element is rendered above both screens during the transition.',
      'The element interpolates from its origin bounding box to its destination bounding box. Border-radius, size, and position all animate smoothly.',
      'The rest of the UI (non-hero content) crossfades or slides independently, providing context that a navigation has occurred.',
    ],
    implementations: [
      {
        platform: 'flutter',
        deps: [],
        notes: 'Flutter\'s `Hero` widget is built into the SDK — zero configuration required. Just wrap the shared element with `Hero(tag: ...)` on both routes.',
        code: `import 'package:flutter/material.dart';

// List screen
class PhotoGrid extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 3,
      children: photos.map((photo) => GestureDetector(
        onTap: () => Navigator.push(context, MaterialPageRoute(
          builder: (_) => PhotoDetail(photo: photo),
        )),
        child: Hero(
          tag: 'photo-\${photo.id}',          // matching tag
          child: Image.network(photo.url, fit: BoxFit.cover),
        ),
      )).toList(),
    );
  }
}

// Detail screen
class PhotoDetail extends StatelessWidget {
  final Photo photo;
  const PhotoDetail({required this.photo});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(children: [
        Hero(
          tag: 'photo-\${photo.id}',          // same tag = shared element
          child: Image.network(photo.url, width: double.infinity, height: 320, fit: BoxFit.cover),
        ),
        Padding(
          padding: const EdgeInsets.all(16),
          child: Text(photo.title, style: Theme.of(context).textTheme.headlineMedium),
        ),
      ]),
    );
  }
}`,
      },
      {
        platform: 'swiftui',
        deps: [],
        notes: '`matchedGeometryEffect` is the closest SwiftUI equivalent to Flutter\'s `Hero` — tagging the thumbnail and the detail image with the same `id` and `Namespace` lets SwiftUI interpolate frame automatically.',
        code: `import SwiftUI

struct Photo: Identifiable { let id: String; let color: Color; let title: String }

struct PhotoGallery: View {
    let photos = [
        Photo(id: "a", color: Color(hex: "534AB7"), title: "Aurora"),
        Photo(id: "b", color: Color(hex: "1D9E75"), title: "Forest"),
        Photo(id: "c", color: Color(hex: "D85A30"), title: "Ember"),
    ]
    @Namespace private var heroSpace
    @State private var selected: Photo?

    var body: some View {
        ZStack {
            LazyVGrid(columns: [GridItem(), GridItem(), GridItem()]) {
                ForEach(photos) { photo in
                    RoundedRectangle(cornerRadius: 12)
                        .fill(photo.color)
                        .matchedGeometryEffect(id: photo.id, in: heroSpace, isSource: selected == nil)
                        .frame(height: 90)
                        .onTapGesture {
                            withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) { selected = photo }
                        }
                }
            }

            if let photo = selected {
                VStack {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(photo.color)
                        .matchedGeometryEffect(id: photo.id, in: heroSpace, isSource: true)
                        .frame(height: 320)
                    Text(photo.title).font(.title).padding()
                    Spacer()
                }
                .background(.background)
                .onTapGesture { withAnimation(.spring(response: 0.4, dampingFraction: 0.85)) { selected = nil } }
            }
        }
    }
}`,
      },
      {
        platform: 'react-native',
        deps: ['react-native-reanimated', '@react-navigation/native', 'react-native-shared-element'],
        notes: '`react-native-shared-element` + the React Navigation bindings provide the closest equivalent to Flutter\'s Hero widget on React Native.',
        code: `import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'

const Stack = createSharedElementStackNavigator()

// List item
function PhotoCard({ photo, navigation }) {
  return (
    <TouchableOpacity onPress={() => navigation.push('Detail', { photo })}>
      <SharedElement id={\`photo.\${photo.id}\`}>
        <Image source={{ uri: photo.url }} style={styles.thumbnail} />
      </SharedElement>
    </TouchableOpacity>
  )
}

// Detail screen
function PhotoDetail({ route }) {
  const { photo } = route.params
  return (
    <View>
      <SharedElement id={\`photo.\${photo.id}\`}>
        <Image source={{ uri: photo.url }} style={styles.hero} />
      </SharedElement>
      <Text style={styles.title}>{photo.title}</Text>
    </View>
  )
}

// Register shared elements on the screen component
PhotoDetail.sharedElements = (route) => [
  { id: \`photo.\${route.params.photo.id}\`, animation: 'move' },
]

export function App() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="List"   component={PhotoGrid} />
      <Stack.Screen name="Detail" component={PhotoDetail} />
    </Stack.Navigator>
  )
}`,
      },
      {
        platform: 'react',
        deps: ['framer-motion'],
        notes: 'Framer Motion\'s `layoutId` is the React equivalent of Flutter\'s Hero tag. Wrap both instances of the element in a `<LayoutGroup>` for cross-component coordination.',
        code: `import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useState } from 'react'

const photos = [
  { id: 'a', color: '#534AB7', title: 'Aurora' },
  { id: 'b', color: '#1D9E75', title: 'Forest' },
  { id: 'c', color: '#D85A30', title: 'Ember'  },
]

export function Gallery() {
  const [selected, setSelected] = useState(null)
  const photo = photos.find(p => p.id === selected)

  return (
    <LayoutGroup>
      <div className="grid">
        {photos.map(p => (
          <motion.div
            key={p.id}
            layoutId={\`hero-\${p.id}\`}
            onClick={() => setSelected(p.id)}
            style={{ background: p.color, borderRadius: 12 }}
            transition={{ type: 'spring', stiffness: 200, damping: 28 }}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && photo && (
          <>
            <motion.div className="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
            />
            <motion.div
              layoutId={\`hero-\${selected}\`}
              style={{ background: photo.color, borderRadius: 16 }}
              transition={{ type: 'spring', stiffness: 200, damping: 28 }}
              className="detail"
              onClick={() => setSelected(null)}
            >
              <h2>{photo.title}</h2>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </LayoutGroup>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: 'Add `\'use client\'` — `layoutId` and `AnimatePresence` require browser APIs. Wrap the page layout in `<LayoutGroup>` if the hero spans different Server Components.',
        code: `'use client'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
import { useState } from 'react'

const photos = [
  { id: 'a', color: '#534AB7', title: 'Aurora' },
  { id: 'b', color: '#1D9E75', title: 'Forest' },
]

export function Gallery() {
  const [selected, setSelected] = useState<string | null>(null)
  const photo = photos.find(p => p.id === selected)

  return (
    <LayoutGroup>
      <div className="grid">
        {photos.map(p => (
          <motion.div
            key={p.id}
            layoutId={\`photo-\${p.id}\`}
            onClick={() => setSelected(p.id)}
            style={{ background: p.color, borderRadius: 12 }}
            transition={{ type: 'spring', stiffness: 200, damping: 28 }}
          />
        ))}
      </div>

      <AnimatePresence>
        {selected && photo && (
          <motion.div
            layoutId={\`photo-\${selected}\`}
            style={{ background: photo.color, borderRadius: 20, position: 'fixed', inset: '5%', zIndex: 50 }}
            transition={{ type: 'spring', stiffness: 200, damping: 28 }}
            onClick={() => setSelected(null)}
          >
            <h2 style={{ color: '#fff', padding: 24 }}>{photo.title}</h2>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  )
}`,
      },
      {
        platform: 'vue',
        deps: [],
        notes: 'Vue doesn\'t have a built-in Hero API. This implementation uses manual FLIP — reading the element\'s bounding box before and after navigation and interpolating with CSS transitions.',
        code: `<template>
  <div>
    <!-- Grid view -->
    <div v-if="!selected" class="grid">
      <div
        v-for="photo in photos"
        :key="photo.id"
        :ref="el => thumbRefs[photo.id] = el"
        :style="{ background: photo.color }"
        class="thumb"
        @click="open(photo)"
      />
    </div>

    <!-- Detail view — animates from thumb position using FLIP -->
    <Transition name="hero" @before-enter="onBeforeEnter">
      <div v-if="selected" :style="detailStyle" class="detail" @click="selected = null">
        <h2>{{ selected.title }}</h2>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const photos    = [{ id: 'a', color: '#534AB7', title: 'Aurora' }, { id: 'b', color: '#1D9E75', title: 'Forest' }]
const selected  = ref(null)
const thumbRefs = reactive({})
const firstRect = ref(null)

function open(photo) {
  firstRect.value = thumbRefs[photo.id]?.getBoundingClientRect()
  selected.value  = photo
}

const detailStyle = computed(() => ({ background: selected.value?.color }))

function onBeforeEnter(el) {
  if (!firstRect.value) return
  const r = firstRect.value
  el.style.transform = \`translate(\${r.left}px, \${r.top}px) scale(\${r.width / 400})\`
  el.style.opacity   = '0.8'
  requestAnimationFrame(() => {
    el.style.transform = ''
    el.style.opacity   = '1'
  })
}
</script>`,
      },
      {
        platform: 'angular',
        deps: [],
        notes: 'Same manual FLIP approach as Vue and Shared Element Transitions — Angular has no Hero-equivalent primitive, so this reads the thumbnail\'s rect on click and animates the detail image from it.',
        code: `import { Component, ElementRef, ViewChild } from '@angular/core'

@Component({
  selector: 'app-photo-gallery',
  template: \`
    <div class="grid" *ngIf="!selected">
      <div *ngFor="let p of photos" class="thumb" [style.background]="p.color" (click)="open(p, $event)"></div>
    </div>
    <div class="detail" *ngIf="selected" (click)="selected = null">
      <div #hero class="hero" [style.background]="selected.color"></div>
      <h2>{{ selected.title }}</h2>
    </div>
  \`,
})
export class PhotoGalleryComponent {
  @ViewChild('hero') heroRef?: ElementRef<HTMLElement>
  photos = [
    { id: 'a', color: '#534AB7', title: 'Aurora' },
    { id: 'b', color: '#1D9E75', title: 'Forest' },
    { id: 'c', color: '#D85A30', title: 'Ember' },
  ]
  selected: typeof this.photos[0] | null = null
  private originRect: DOMRect | null = null

  open(photo: typeof this.photos[0], e: MouseEvent) {
    this.originRect = (e.target as HTMLElement).getBoundingClientRect()
    this.selected = photo
    requestAnimationFrame(() => this.playFlip())
  }

  private playFlip() {
    const hero = this.heroRef?.nativeElement
    if (!hero || !this.originRect) return
    const heroRect = hero.getBoundingClientRect()
    const dx = this.originRect.left - heroRect.left
    const dy = this.originRect.top - heroRect.top
    const scale = this.originRect.width / heroRect.width

    hero.style.transition = 'none'
    hero.style.transform = \`translate(\${dx}px, \${dy}px) scale(\${scale})\`
    requestAnimationFrame(() => {
      hero.style.transition = 'transform 0.4s cubic-bezier(0.22,1,0.36,1)'
      hero.style.transform = ''
    })
  }
}`,
      },
    ],
    useCases: [
      { label: 'Photo gallery',    example: 'A thumbnail expands into a full-screen detail view — the image itself flies across while metadata fades in below it.' },
      { label: 'Product listing',  example: 'A product card\'s image morphs into the hero image on the product detail page, maintaining visual continuity.' },
      { label: 'Card to modal',    example: 'A compact dashboard card expands in-place to a full detail overlay without a jarring cut.' },
      { label: 'List to profile',  example: 'An avatar in a contacts list flies to the top of the profile screen when the user taps a row.' },
    ],
    tips: [
      'In Flutter, the `Hero` tag must be unique per page pair — avoid using array indices as tags since they can collide.',
      'In Framer Motion, always pair `layoutId` with a `<LayoutGroup>` when the hero spans different component trees; without it the animation may not fire.',
      'Keep the spring stiffness ≤ 250 and damping ≥ 25 for hero transitions — too fast looks like a layout glitch, not a morph.',
      'Border-radius changes during the hero fly are often jarring. Interpolate from the source radius to the destination radius explicitly using a style transition.',
    ],
    fr: {
      title: 'Héros Flutter',
      tagline: 'Un élément partagé se transforme en douceur entre deux écrans pendant la navigation',
      concept:
        'Le pattern Héros anime un élément visuel partagé — image, avatar ou carte — depuis sa position sur un écran vers sa position sur un autre. Au lieu que les deux écrans se coupent ou s\'estompent indépendamment, l\'élément partagé traverse l\'espace pendant que le reste de l\'interface transite autour. Le widget `Hero` de Flutter et le `layoutId` de Framer Motion implémentent tous deux cette idée : ils capturent l\'état d\'origine de l\'élément, puis l\'animent en FLIP vers sa position de destination pendant le changement de route.',
      howItWorks: [
        'Marquer le même élément sur les deux écrans avec un identifiant correspondant (`tag` dans Flutter, `layoutId` dans Framer Motion, `sharedElementTransition` dans React Navigation).',
        'À la navigation, le framework détecte la paire correspondante et crée une couche d\'animation — l\'élément est rendu au-dessus des deux écrans pendant la transition.',
        'L\'élément interpole depuis sa boîte de délimitation d\'origine vers sa boîte de délimitation de destination. Le rayon de bordure, la taille et la position s\'animent en douceur.',
        'Le reste de l\'interface (contenu non-héros) s\'estompe ou glisse indépendamment, fournissant le contexte qu\'une navigation a eu lieu.',
      ],
      useCases: [
        { label: 'Galerie photos',    example: 'Une vignette s\'agrandit en vue détail plein écran — l\'image elle-même vole pendant que les métadonnées s\'affichent en dessous.' },
        { label: 'Liste de produits', example: 'L\'image d\'une carte produit se transforme en image héros sur la page détail, maintenant la continuité visuelle.' },
        { label: 'Carte vers modal',  example: 'Une carte de tableau de bord compacte s\'agrandit en une superposition de détail complète sans coupure brutale.' },
        { label: 'Liste vers profil', example: 'Un avatar dans une liste de contacts vole vers le haut de l\'écran de profil quand l\'utilisateur appuie sur une ligne.' },
      ],
      tips: [
        'Dans Flutter, le tag `Hero` doit être unique par paire de pages — éviter d\'utiliser des indices de tableau comme tags car ils peuvent entrer en conflit.',
        'Dans Framer Motion, toujours associer `layoutId` à un `<LayoutGroup>` quand le héros s\'étend sur différents arbres de composants ; sans cela, l\'animation peut ne pas se déclencher.',
        'Garder la rigidité du ressort ≤ 250 et l\'amortissement ≥ 25 pour les transitions héros — trop rapide ressemble à un problème de mise en page, pas à une transformation.',
        'Les changements de rayon de bordure pendant le vol héros sont souvent choquants. Interpoler explicitement du rayon source au rayon destination via une transition de style.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  13. View Transitions                           */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'view-transitions',
    title: 'View Transitions',
    category: 'Navigation',
    difficulty: 'Intermediate',
    tagline: 'Morph between pages using the browser\'s native View Transitions API',
    concept:
      'The View Transitions API is a browser-native way to animate between any two DOM states — including full page navigations in SPAs. The browser captures a screenshot of the current state, makes the DOM change, then animates from the snapshot to the new state using CSS. Named view-transition elements morph individually, enabling smooth shared-element effects without a JavaScript animation library. In Next.js, `document.startViewTransition()` wraps any router push; in frameworks with built-in support, it\'s a single flag.',
    howItWorks: [
      'Call `document.startViewTransition(() => { /* make DOM change */ })`. The browser takes a snapshot before the callback and another after, then cross-fades between them.',
      'Assign `view-transition-name: my-hero` (in CSS) to elements that should morph individually. The browser will independently animate those elements from their old to new position and size.',
      'Customize the crossfade duration and easing via `::view-transition-old(root)` and `::view-transition-new(root)` pseudo-elements — they behave like regular animation keyframes.',
      'In Next.js App Router, intercept `router.push()` inside `document.startViewTransition()`. Add `view-transition-name` CSS via a `className` or inline style on the shared element.',
    ],
    implementations: [
      {
        platform: 'nextjs',
        deps: [],
        notes: 'No external packages required — the API is available in all major browsers (Chrome 111+, Safari 18+, Firefox 133+). The `useRouter` from `next/navigation` is used to trigger navigation inside the transition.',
        code: `'use client'
import { useRouter } from 'next/navigation'

export function ArticleCard({ article }) {
  const router = useRouter()

  function navigate() {
    // Wrap the navigation in startViewTransition
    if (!document.startViewTransition) {
      router.push(\`/article/\${article.id}\`)
      return
    }
    document.startViewTransition(() => {
      router.push(\`/article/\${article.id}\`)
    })
  }

  return (
    <div onClick={navigate} style={{ cursor: 'pointer' }}>
      {/* Give the hero image a view-transition-name */}
      <img
        src={article.cover}
        style={{ viewTransitionName: \`article-cover-\${article.id}\` }}
      />
      <h2>{article.title}</h2>
    </div>
  )
}

// On the detail page, use the SAME view-transition-name
// app/article/[id]/page.tsx
export default function ArticlePage({ params }) {
  return (
    <div>
      <img
        src={article.cover}
        style={{ viewTransitionName: \`article-cover-\${params.id}\` }}
      />
      <h1>{article.title}</h1>
    </div>
  )
}`,
      },
      {
        platform: 'react',
        deps: [],
        notes: 'Uses `document.startViewTransition` directly — no library needed. Pair with `react-router-dom` v6.28+ which has experimental built-in support via `unstable_viewTransition`.',
        code: `import { useNavigate } from 'react-router-dom'

function ArticleCard({ article }) {
  const navigate = useNavigate()

  function handleClick() {
    if (!document.startViewTransition) {
      navigate(\`/article/\${article.id}\`)
      return
    }
    document.startViewTransition(() => {
      navigate(\`/article/\${article.id}\`)
    })
  }

  return (
    <div onClick={handleClick}>
      <img
        src={article.cover}
        style={{ viewTransitionName: \`cover-\${article.id}\` }}
      />
      <h2>{article.title}</h2>
    </div>
  )
}

// Customize the crossfade in CSS:
// ::view-transition-old(root) { animation-duration: 300ms; }
// ::view-transition-new(root) { animation-duration: 300ms; }`,
      },
      {
        platform: 'vue',
        deps: [],
        notes: 'Vue Router 4.4+ has built-in View Transitions support via the `viewTransition` option — the cleanest integration across any framework.',
        code: `// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [ /* ... */ ],
})

// Enable View Transitions globally
router.beforeEach((to, from) => {
  if (!document.startViewTransition) return true
  return new Promise(resolve => {
    document.startViewTransition(() => { resolve(true) })
  })
})

export default router

<!-- ArticleCard.vue -->
<template>
  <div @click="router.push(\`/article/\${article.id}\`)" style="cursor: pointer">
    <img :src="article.cover" :style="{ viewTransitionName: \`cover-\${article.id}\` }" />
    <h2>{{ article.title }}</h2>
  </div>
</template>

<!-- ArticleDetail.vue -->
<template>
  <img :src="article.cover" :style="{ viewTransitionName: \`cover-\${article.id}\` }" />
  <h1>{{ article.title }}</h1>
</template>`,
      },
      {
        platform: 'angular',
        deps: [],
        notes: 'Angular Router has no built-in View Transitions flag (unlike Vue Router 4.4+), so wrap the navigation call in `document.startViewTransition` inside the click handler — the API itself is entirely framework-agnostic.',
        code: `import { Component } from '@angular/core'
import { Router } from '@angular/router'

@Component({
  selector: 'app-article-card',
  template: \`
    <div (click)="navigate()" style="cursor: pointer">
      <img [src]="article.cover" [style.view-transition-name]="'article-cover-' + article.id" />
      <h2>{{ article.title }}</h2>
    </div>
  \`,
})
export class ArticleCardComponent {
  @Input() article!: { id: string; cover: string; title: string }
  constructor(private router: Router) {}

  navigate() {
    const go = () => this.router.navigate(['/article', this.article.id])
    if (!(document as any).startViewTransition) { go(); return }
    ;(document as any).startViewTransition(go)
  }
}

// On the detail component — same view-transition-name via [style.view-transition-name]`,
      },
      {
        platform: 'react-native',
        deps: ['react-native-reanimated', '@react-navigation/native', '@react-navigation/stack'],
        notes: 'React Native doesn\'t support the browser View Transitions API. The equivalent is a custom `cardStyleInterpolator` in React Navigation — a function that receives the animation progress and maps it to card styles.',
        code: `import { createStackNavigator } from '@react-navigation/stack'
import Animated from 'react-native-reanimated'

const Stack = createStackNavigator()

// Custom crossfade transition — equivalent to the browser's default view transition
const fadeTransition = {
  cardStyleInterpolator: ({ current, next }) => ({
    cardStyle: {
      opacity: current.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
    },
    overlayStyle: {
      opacity: next?.progress.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 0.6],
      }),
    },
  }),
  transitionSpec: {
    open:  { animation: 'timing', config: { duration: 300 } },
    close: { animation: 'timing', config: { duration: 300 } },
  },
}

export function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="List"   component={ListScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} options={fadeTransition} />
    </Stack.Navigator>
  )
}`,
      },
      {
        platform: 'flutter',
        deps: [],
        notes: 'Flutter uses `PageRouteBuilder` with a custom `transitionsBuilder` — the equivalent of `::view-transition-*` pseudo-element animations.',
        code: `import 'package:flutter/material.dart';

// Custom fade+scale transition (equivalent to a crossfade view transition)
class FadeScaleRoute extends PageRouteBuilder {
  final Widget page;
  FadeScaleRoute({required this.page}) : super(
    pageBuilder: (_, __, ___) => page,
    transitionsBuilder: (_, animation, __, child) {
      return FadeTransition(
        opacity: animation,
        child: ScaleTransition(
          scale: Tween<double>(begin: 0.96, end: 1.0).animate(
            CurvedAnimation(parent: animation, curve: Curves.easeOutCubic),
          ),
          child: child,
        ),
      );
    },
    transitionDuration: const Duration(milliseconds: 300),
  );
}

// Usage
Navigator.of(context).push(FadeScaleRoute(page: const DetailPage()))`,
      },
      {
        platform: 'swiftui',
        deps: [],
        notes: 'iOS has no browser-style View Transitions API. The closest built-in construct is a `matchedGeometryEffect` inside a `NavigationStack`, combined with a custom push transition — conceptually the same "closest equivalent" role that `cardStyleInterpolator` plays on React Native and `PageRouteBuilder` plays on Flutter.',
        code: `import SwiftUI

struct ArticleCard: View {
    let article: Article
    @Namespace var transition

    var body: some View {
        NavigationLink(value: article) {
            VStack {
                AsyncImage(url: article.coverURL)
                    .matchedGeometryEffect(id: "cover-\\(article.id)", in: transition)
                Text(article.title)
            }
        }
    }
}

// In the NavigationStack root:
NavigationStack {
    ArticleList()
        .navigationDestination(for: Article.self) { article in
            ArticleDetail(article: article, transition: transition)
        }
}

// ArticleDetail reuses the same matchedGeometryEffect id and namespace
// so the cover image morphs during the push, the nearest SwiftUI analog
// to a browser view-transition-name match.`,
      },
    ],
    useCases: [
      { label: 'Article list → detail',   example: 'The article cover image morphs from the card thumbnail to the full-width hero on the detail page.' },
      { label: 'E-commerce PDP',          example: 'Product images transition from the listing grid to the product detail page without a white-flash cut.' },
      { label: 'Dashboard → report',      example: 'A summary card expands into a full report page, preserving the visual context of which card was tapped.' },
      { label: 'Settings section expand', example: 'A settings group header morphs as its detail screen slides in, confirming to the user which section they\'re entering.' },
    ],
    tips: [
      'Always provide a `document.startViewTransition` feature-check fallback — the API is not available in all browsers yet.',
      'Each `view-transition-name` must be unique in the DOM at any given time. Duplicate names during a transition cause the morph to break silently.',
      'The default crossfade is 250ms. Match your spring/easing to this duration if you\'re mixing library-based animations (like Framer Motion) on the same page.',
      'Use `will-change: transform` on named view-transition elements to promote them to their own compositor layer before the transition fires, reducing jank on lower-end devices.',
    ],
    fr: {
      title: 'Transitions de vue',
      tagline: 'Morphez entre les pages en utilisant l\'API View Transitions native du navigateur',
      concept:
        'L\'API View Transitions est un moyen natif du navigateur d\'animer entre deux états DOM — y compris les navigations de pages complètes dans les SPA. Le navigateur capture une capture d\'écran de l\'état actuel, effectue le changement DOM, puis anime de la capture vers le nouvel état via CSS. Les éléments de transition nommés se morphent individuellement, permettant des effets d\'éléments partagés fluides sans bibliothèque d\'animation JavaScript. Dans Next.js, `document.startViewTransition()` enveloppe n\'importe quel push du routeur.',
      howItWorks: [
        'Appeler `document.startViewTransition(() => { /* changement DOM */ })`. Le navigateur prend un snapshot avant le callback et un autre après, puis effectue un fondu croisé entre eux.',
        'Assigner `view-transition-name: mon-hero` (en CSS) aux éléments qui doivent se morpher individuellement. Le navigateur animera indépendamment ces éléments de leur ancienne à leur nouvelle position et taille.',
        'Personnaliser la durée et l\'easing du fondu via les pseudo-éléments `::view-transition-old(root)` et `::view-transition-new(root)` — ils se comportent comme des keyframes d\'animation réguliers.',
        'Dans Next.js App Router, intercepter `router.push()` à l\'intérieur de `document.startViewTransition()`. Ajouter le CSS `view-transition-name` via un `className` ou un style inline sur l\'élément partagé.',
      ],
      useCases: [
        { label: 'Article liste → détail', example: 'L\'image de couverture de l\'article se transforme de la vignette de la carte vers le héros pleine largeur sur la page de détail.' },
        { label: 'E-commerce PDP',          example: 'Les images de produits transitent de la grille de liste à la page de détail du produit sans coupure blanche.' },
        { label: 'Tableau de bord → rapport', example: 'Une carte de résumé s\'agrandit en page de rapport complète, préservant le contexte visuel de la carte touchée.' },
        { label: 'Extension de section paramètres', example: 'Un en-tête de groupe de paramètres se morphe lorsque son écran de détail glisse, confirmant à l\'utilisateur quelle section il entre.' },
      ],
      tips: [
        'Toujours fournir un fallback de vérification de fonctionnalité `document.startViewTransition` — l\'API n\'est pas encore disponible dans tous les navigateurs.',
        'Chaque `view-transition-name` doit être unique dans le DOM à tout moment. Les noms dupliqués pendant une transition font échouer le morphing silencieusement.',
        'Le fondu croisé par défaut est de 250ms. Faire correspondre votre spring/easing à cette durée si vous mélangez des animations basées sur des bibliothèques (comme Framer Motion) sur la même page.',
        'Utiliser `will-change: transform` sur les éléments de transition de vue nommés pour les promouvoir sur leur propre couche de compositeur avant le déclenchement de la transition, réduisant les saccades sur les appareils moins puissants.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  14. FLIP List                                  */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'flip-list',
    title: 'FLIP List',
    category: 'List',
    difficulty: 'Intermediate',
    tagline: 'Items animate to their new positions when the list is filtered, sorted, or reordered',
    concept:
      'FLIP stands for First, Last, Invert, Play. When a list changes (filter, sort, add, remove), record each item\'s position before and after the change. The difference between First and Last positions is the Invert — a transform that makes the item appear not to have moved. Then Play the animation by transitioning the inverted transform to identity. The result is items that appear to glide to their new positions rather than jumping. Vue\'s `<TransitionGroup>` automates this, Framer Motion uses `layout`, and Flutter uses `AnimatedList`.',
    howItWorks: [
      'Before the state change, snapshot the bounding box of every visible item (the "First" position).',
      'After the state change, let the DOM update and read each item\'s new bounding box (the "Last" position).',
      'Apply a CSS transform to each item that offsets it back to its First position — this is the "Invert" step. The user sees no jump.',
      'Remove (or transition) the inverted transform to zero — this is the "Play" step. The item appears to animate from where it was to where it now is. Vue and Framer Motion handle steps 1–4 automatically via their layout animation APIs.',
    ],
    implementations: [
      {
        platform: 'vue',
        deps: [],
        notes: 'Vue\'s `<TransitionGroup>` performs the full FLIP calculation for free when you add the `move-class` attribute — no library or manual measurement needed.',
        code: `<template>
  <div>
    <div class="filters">
      <button @click="filter = 'all'">All</button>
      <button @click="filter = 'web'">Web</button>
      <button @click="shuffle">Shuffle</button>
    </div>

    <TransitionGroup
      name="flip"
      tag="ul"
      class="list"
    >
      <li v-for="item in filtered" :key="item.id" class="item">
        {{ item.label }}
      </li>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const filter = ref('all')
const items  = ref([
  { id: 'a', label: 'React',   type: 'web'    },
  { id: 'b', label: 'Vue',     type: 'web'    },
  { id: 'c', label: 'Flutter', type: 'mobile' },
  { id: 'd', label: 'Kotlin',  type: 'mobile' },
])

const filtered = computed(() =>
  filter.value === 'all' ? items.value : items.value.filter(i => i.type === filter.value)
)

function shuffle() {
  items.value = [...items.value].sort(() => Math.random() - 0.5)
}
</script>

<style>
/* Enter/leave transitions */
.flip-enter-active, .flip-leave-active { transition: all 0.3s ease; }
.flip-enter-from, .flip-leave-to      { opacity: 0; transform: translateY(12px); }
.flip-leave-active                    { position: absolute; }  /* critical for FLIP */

/* Move transition — this IS the FLIP */
.flip-move { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
</style>`,
      },
      {
        platform: 'react',
        deps: ['framer-motion'],
        notes: 'Add `layout` to each item and wrap in `<AnimatePresence mode="popLayout">`. Framer Motion performs the FLIP measurement automatically on every re-render.',
        code: `import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'

const items = [
  { id: 'a', label: 'React',   type: 'web'    },
  { id: 'b', label: 'Vue',     type: 'web'    },
  { id: 'c', label: 'Flutter', type: 'mobile' },
  { id: 'd', label: 'Kotlin',  type: 'mobile' },
]

export function FlipList() {
  const [filter, setFilter] = useState('all')
  const [order,  setOrder]  = useState(items)

  const visible = useMemo(
    () => order.filter(i => filter === 'all' || i.type === filter),
    [order, filter]
  )

  return (
    <div>
      <div className="filters">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('web')}>Web</button>
        <button onClick={() => setOrder(o => [...o].reverse())}>Flip ↕</button>
      </div>

      <motion.ul layout style={{ padding: 0, listStyle: 'none' }}>
        <AnimatePresence mode="popLayout">
          {visible.map(item => (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              {item.label}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: 'Add `\'use client\'` at the top. The `layout` prop requires DOM measurements which are browser-only.',
        code: `'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'

const items = [
  { id: 'a', label: 'React',   type: 'web'    },
  { id: 'b', label: 'Vue',     type: 'web'    },
  { id: 'c', label: 'Flutter', type: 'mobile' },
]

export function FlipList() {
  const [filter, setFilter] = useState('all')
  const [order,  setOrder]  = useState(items)

  const visible = useMemo(
    () => order.filter(i => filter === 'all' || i.type === filter),
    [order, filter]
  )

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {['all', 'web', 'mobile'].map(f => (
          <button key={f} onClick={() => setFilter(f)}>{f}</button>
        ))}
        <button onClick={() => setOrder(o => [...o].reverse())}>Flip ↕</button>
      </div>
      <motion.ul layout style={{ padding: 0, listStyle: 'none' }}>
        <AnimatePresence mode="popLayout">
          {visible.map(item => (
            <motion.li key={item.id} layout
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 6, border: '1px solid #ddd' }}
            >
              {item.label}
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  )
}`,
      },
      {
        platform: 'angular',
        deps: ['@angular/animations'],
        notes: 'Angular Animations\' `query()` + `animateChild()` combined with the `:increment`/`:decrement` aliases on `*ngFor` gives a FLIP-style move animation — conceptually the same automation Vue\'s `<TransitionGroup>` provides.',
        code: `import { trigger, transition, query, style, animate, stagger } from '@angular/animations'

export const flipList = trigger('flipList', [
  transition('* => *', [
    query(':leave', [
      style({ position: 'absolute' }),
      animate('300ms ease', style({ opacity: 0, transform: 'translateY(-8px)' })),
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(8px)' }),
      stagger(20, animate('300ms cubic-bezier(0.22,1,0.36,1)', style({ opacity: 1, transform: 'translateY(0)' }))),
    ], { optional: true }),
  ]),
])

@Component({
  selector: 'app-flip-list',
  template: \`
    <div class="filters">
      <button (click)="filter = 'all'">All</button>
      <button (click)="filter = 'web'">Web</button>
      <button (click)="items = [...items].reverse()">Flip ↕</button>
    </div>
    <ul [@flipList]="visible.length" class="list">
      <li *ngFor="let item of visible; trackBy: trackById">{{ item.label }}</li>
    </ul>
  \`,
  animations: [flipList],
})
export class FlipListComponent {
  items = [
    { id: 'a', label: 'React', type: 'web' },
    { id: 'b', label: 'Vue', type: 'web' },
    { id: 'c', label: 'Flutter', type: 'mobile' },
    { id: 'd', label: 'Kotlin', type: 'mobile' },
  ]
  filter = 'all'
  get visible() { return this.filter === 'all' ? this.items : this.items.filter(i => i.type === this.filter) }
  trackById(_: number, item: { id: string }) { return item.id }
}`,
      },
      {
        platform: 'react-native',
        deps: [],
        notes: 'React Native\'s `LayoutAnimation` performs the FLIP calculation natively — call `LayoutAnimation.configureNext()` before the state change.',
        code: `import { LayoutAnimation, Platform, UIManager, View, Text, TouchableOpacity } from 'react-native'
import { useState } from 'react'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true)
}

const items = [
  { id: 'a', label: 'React Native', type: 'mobile' },
  { id: 'b', label: 'Flutter',      type: 'mobile' },
  { id: 'c', label: 'React',        type: 'web'    },
  { id: 'd', label: 'Vue',          type: 'web'    },
]

export function FlipList() {
  const [filter, setFilter] = useState('all')

  const visible = items.filter(i => filter === 'all' || i.type === filter)

  function changeFilter(f) {
    // Trigger layout animation BEFORE the state change
    LayoutAnimation.configureNext(
      LayoutAnimation.create(300, LayoutAnimation.Types.easeInEaseOut, LayoutAnimation.Properties.opacity)
    )
    setFilter(f)
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <TouchableOpacity onPress={() => changeFilter('all')}><Text>All</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => changeFilter('web')}><Text>Web</Text></TouchableOpacity>
      </View>
      {visible.map(item => (
        <View key={item.id} style={{ padding: 14, marginBottom: 8, borderRadius: 10, borderWidth: 1, borderColor: '#ddd' }}>
          <Text>{item.label}</Text>
        </View>
      ))}
    </View>
  )
}`,
      },
      {
        platform: 'flutter',
        deps: [],
        notes: 'Flutter\'s `AnimatedList` + `AnimatedSwitcher` handle entry/exit. For reorder animations, use `ReorderableListView` or the `animated_list` package for more control.',
        code: `import 'package:flutter/material.dart';

class FlipList extends StatefulWidget {
  @override State<FlipList> createState() => _FlipListState();
}

class _FlipListState extends State<FlipList> {
  String _filter = 'all';
  final _listKey = GlobalKey<AnimatedListState>();
  final _items   = ['React', 'Vue', 'Flutter', 'Kotlin'];
  List<String> get _visible =>
      _filter == 'all' ? _items : _items.where((i) => i == 'Flutter' || i == 'Kotlin').toList();

  void _setFilter(String f) => setState(() => _filter = f);

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      Row(children: [
        TextButton(onPressed: () => _setFilter('all'),    child: const Text('All')),
        TextButton(onPressed: () => _setFilter('mobile'), child: const Text('Mobile')),
      ]),
      AnimatedSwitcher(
        duration: const Duration(milliseconds: 300),
        child: Column(
          key: ValueKey(_filter),
          children: _visible.map((item) => AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            curve:    Curves.easeOutCubic,
            margin:   const EdgeInsets.only(bottom: 8),
            padding:  const EdgeInsets.all(14),
            decoration: BoxDecoration(border: Border.all(color: Colors.grey.shade300), borderRadius: BorderRadius.circular(10)),
            child: Text(item),
          )).toList(),
        ),
      ),
    ]);
  }
}`,
      },
      {
        platform: 'swiftui',
        deps: [],
        notes: 'A `List` (or `LazyVStack`) automatically animates row moves, insertions, and removals when its data changes inside `withAnimation` — SwiftUI performs the FLIP-equivalent measurement internally, no manual rect math required.',
        code: `import SwiftUI

struct Item: Identifiable, Equatable { let id: String; let label: String; let type: String }

struct FlipList: View {
    @State private var items = [
        Item(id: "a", label: "React", type: "web"),
        Item(id: "b", label: "Vue", type: "web"),
        Item(id: "c", label: "Flutter", type: "mobile"),
        Item(id: "d", label: "Kotlin", type: "mobile"),
    ]
    @State private var filter = "all"

    var visible: [Item] {
        filter == "all" ? items : items.filter { $0.type == filter }
    }

    var body: some View {
        VStack {
            HStack {
                Button("All") { withAnimation { filter = "all" } }
                Button("Web") { withAnimation { filter = "web" } }
                Button("Flip ↕") { withAnimation { items.reverse() } }
            }
            ForEach(visible) { item in
                Text(item.label)
                    .padding()
                    .frame(maxWidth: .infinity, alignment: .leading)
                    .background(.background, in: RoundedRectangle(cornerRadius: 10))
                    .transition(.asymmetric(insertion: .opacity, removal: .opacity))
            }
            .animation(.timingCurve(0.22, 1, 0.36, 1, duration: 0.3), value: visible)
        }
    }
}`,
      },
    ],
    useCases: [
      { label: 'Filter UI',        example: 'A product grid filtered by category — items smoothly slide to fill gaps rather than snapping into a new layout.' },
      { label: 'Sort order',       example: 'A data table sorted by column — rows animate to their new sorted positions on click.' },
      { label: 'Drag & drop',      example: 'A kanban board where dropping a card in a new column triggers the surrounding cards to FLIP into their new positions.' },
      { label: 'Tag/chip removal', example: 'A tag pill removed from a list causes the remaining tags to animate and fill the gap smoothly.' },
    ],
    tips: [
      'The critical trick in Vue\'s `<TransitionGroup>` is `position: absolute` on `.flip-leave-active` — without it, leaving items still occupy space and prevent siblings from moving.',
      'In Framer Motion, `mode="popLayout"` in `<AnimatePresence>` immediately removes leaving items from the layout flow, letting remaining items start their FLIP animation without waiting.',
      'Only add `layout` to items that actually change position — animating every element on a large list can cause frame drops. Use `layoutId` only for items that persist between renders.',
      'Avoid mixing FLIP animations with CSS transitions on the same element — they fight each other. Use one or the other per element.',
    ],
    fr: {
      title: 'Liste FLIP',
      tagline: 'Les éléments s\'animent vers leurs nouvelles positions quand la liste est filtrée, triée ou réordonnée',
      concept:
        'FLIP signifie First, Last, Invert, Play. Quand une liste change (filtre, tri, ajout, suppression), enregistrez la position de chaque élément avant et après le changement. La différence entre les positions Première et Dernière est l\'Inverse — une transform qui fait paraître l\'élément immobile. Puis Jouez l\'animation en transitionnant la transform inversée vers l\'identité. Le résultat : des éléments qui semblent glisser vers leurs nouvelles positions. Le `<TransitionGroup>` de Vue automatise cela, Framer Motion utilise `layout`, et Flutter utilise `AnimatedList`.',
      howItWorks: [
        'Avant le changement d\'état, capturer la boîte de délimitation de chaque élément visible (la position "Première").',
        'Après le changement d\'état, laisser le DOM se mettre à jour et lire la nouvelle boîte de délimitation de chaque élément (la position "Dernière").',
        'Appliquer une transform CSS à chaque élément qui le repositionne à sa position Première — c\'est l\'étape "Inverse". L\'utilisateur ne voit aucun saut.',
        'Supprimer (ou transitionner) la transform inversée vers zéro — c\'est l\'étape "Jouer". L\'élément semble s\'animer de là où il était vers là où il est maintenant. Vue et Framer Motion gèrent automatiquement les étapes 1–4 via leurs APIs d\'animation de mise en page.',
      ],
      useCases: [
        { label: 'Interface de filtre', example: 'Une grille de produits filtrée par catégorie — les éléments glissent doucement pour remplir les espaces plutôt que de sauter dans une nouvelle disposition.' },
        { label: 'Ordre de tri',        example: 'Un tableau de données trié par colonne — les lignes s\'animent vers leurs nouvelles positions triées au clic.' },
        { label: 'Glisser-déposer',     example: 'Un tableau kanban où déposer une carte dans une nouvelle colonne déclenche l\'animation FLIP des cartes environnantes.' },
        { label: 'Suppression de tags', example: 'Un tag supprimé d\'une liste provoque l\'animation des tags restants pour combler le vide en douceur.' },
      ],
      tips: [
        'L\'astuce critique dans le `<TransitionGroup>` de Vue est `position: absolute` sur `.flip-leave-active` — sans cela, les éléments qui partent occupent toujours de l\'espace et empêchent les frères de bouger.',
        'Dans Framer Motion, `mode="popLayout"` dans `<AnimatePresence>` supprime immédiatement les éléments qui partent du flux de mise en page, permettant aux éléments restants de démarrer leur animation FLIP sans attendre.',
        'N\'ajouter `layout` qu\'aux éléments qui changent réellement de position — animer chaque élément d\'une grande liste peut causer des chutes de frames. Utiliser `layoutId` uniquement pour les éléments qui persistent entre les rendus.',
        'Éviter de mélanger les animations FLIP avec les transitions CSS sur le même élément — elles se combattent. Utiliser l\'un ou l\'autre par élément.',
      ],
    },
  },

  /* ── 15. Morphing Button ── */
  {
    slug: 'morphing-button',
    title: 'Morphing Button',
    category: 'Feedback',
    difficulty: 'Beginner',
    tagline: 'A button that morphs into a spinner, then a success state — all in one element',
    concept:
      'The Morphing Button pattern replaces the classic disabled-state-loading spinner with a single element that transitions through three states: idle → loading → success. Instead of toggling visibility between separate elements, the button\'s shape, text, and icon all animate within one DOM node using layout animations. The result feels native, smooth, and communicates progress without visual jumps.',
    howItWorks: [
      'On click, the button width collapses to a circle via a layout animation — the text fades out simultaneously.',
      'A spinner SVG fades in at the center of the now-circular button.',
      'On completion, the spinner fades out and a checkmark draws itself via an SVG stroke dash animation.',
      'After a short hold, the button expands back to its original width with the idle label — or remains in success state.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        notes: 'Use Framer Motion `layout` on the button and `AnimatePresence` to swap inner content (text/spinner/check).',
        code: `import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type State = 'idle' | 'loading' | 'success'

export function MorphingButton() {
  const [state, setState] = useState<State>('idle')

  async function handleClick() {
    if (state !== 'idle') return
    setState('loading')
    await new Promise(r => setTimeout(r, 1800))
    setState('success')
    setTimeout(() => setState('idle'), 2200)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <motion.button
        layout
        onClick={handleClick}
        transition={{ type: 'spring', stiffness: 500, damping: 36 }}
        style={{
          borderRadius: 999,
          border: 'none',
          cursor: state === 'idle' ? 'pointer' : 'default',
          background: state === 'success' ? '#22c55e' : '#A3E635',
          color: '#0a0a0a',
          height: 48,
          width: state === 'idle' ? 160 : 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          fontFamily: 'system-ui', fontWeight: 600, fontSize: 15,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {state === 'idle' && (
            <motion.span key="label"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >Submit</motion.span>
          )}
          {state === 'loading' && (
            <motion.svg key="spinner"
              initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.15 }, rotate: { repeat: Infinity, duration: 0.8, ease: 'linear' } }}
              width="20" height="20" viewBox="0 0 20 20" fill="none"
            >
              <circle cx="10" cy="10" r="8" stroke="rgba(0,0,0,0.2)" strokeWidth="2.5"/>
              <path d="M10 2a8 8 0 018 8" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round"/>
            </motion.svg>
          )}
          {state === 'success' && (
            <motion.svg key="check"
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              width="20" height="20" viewBox="0 0 20 20" fill="none"
            >
              <motion.path
                d="M4 10l4.5 4.5 7.5-8"
                stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: 'Add `"use client"` at the top — framer-motion layout animations require browser APIs. The rest of the implementation is identical to React.',
        code: `'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type State = 'idle' | 'loading' | 'success'

export function MorphingButton() {
  const [state, setState] = useState<State>('idle')

  async function handleClick() {
    if (state !== 'idle') return
    setState('loading')
    await new Promise(r => setTimeout(r, 1800))
    setState('success')
    setTimeout(() => setState('idle'), 2200)
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <motion.button
        layout
        onClick={handleClick}
        transition={{ type: 'spring', stiffness: 500, damping: 36 }}
        style={{
          borderRadius: 999,
          border: 'none',
          cursor: state === 'idle' ? 'pointer' : 'default',
          background: state === 'success' ? '#22c55e' : '#A3E635',
          color: '#0a0a0a',
          height: 48,
          width: state === 'idle' ? 160 : 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          fontFamily: 'system-ui', fontWeight: 600, fontSize: 15,
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {state === 'idle' && (
            <motion.span key="label"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >Submit</motion.span>
          )}
          {state === 'loading' && (
            <motion.svg key="spinner"
              initial={{ opacity: 0, rotate: 0 }} animate={{ opacity: 1, rotate: 360 }}
              exit={{ opacity: 0 }}
              transition={{ opacity: { duration: 0.15 }, rotate: { repeat: Infinity, duration: 0.8, ease: 'linear' } }}
              width="20" height="20" viewBox="0 0 20 20" fill="none"
            >
              <circle cx="10" cy="10" r="8" stroke="rgba(0,0,0,0.2)" strokeWidth="2.5"/>
              <path d="M10 2a8 8 0 018 8" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round"/>
            </motion.svg>
          )}
          {state === 'success' && (
            <motion.svg key="check"
              initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              width="20" height="20" viewBox="0 0 20 20" fill="none"
            >
              <motion.path
                d="M4 10l4.5 4.5 7.5-8"
                stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}`,
      },
      {
        platform: 'vue',
        deps: [],
        notes: 'Uses Vue 3 Composition API `ref` for state, CSS `transition` for width animation, and `<Transition mode="out-in">` for content swap between states.',
        code: `<script setup>
import { ref } from 'vue'

const state = ref('idle') // 'idle' | 'loading' | 'success'

async function handleClick() {
  if (state.value !== 'idle') return
  state.value = 'loading'
  await new Promise(r => setTimeout(r, 1800))
  state.value = 'success'
  setTimeout(() => { state.value = 'idle' }, 2200)
}
</script>

<template>
  <div style="display:flex;justify-content:center;padding:40px">
    <button @click="handleClick" :style="{
      borderRadius: '999px',
      border: 'none',
      background: state === 'success' ? '#22c55e' : '#A3E635',
      color: '#0a0a0a',
      height: '48px',
      width: state === 'idle' ? '160px' : '48px',
      transition: 'width 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s',
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      cursor: state === 'idle' ? 'pointer' : 'default',
      fontFamily: 'system-ui', fontWeight: 600, fontSize: '15px',
    }">
      <Transition mode="out-in">
        <span v-if="state === 'idle'" key="label">Submit</span>
        <svg v-else-if="state === 'loading'" key="spinner"
          width="20" height="20" viewBox="0 0 20 20" fill="none"
          style="animation: spin 0.8s linear infinite">
          <circle cx="10" cy="10" r="8" stroke="rgba(0,0,0,0.2)" stroke-width="2.5"/>
          <path d="M10 2a8 8 0 018 8" stroke="#0a0a0a" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <svg v-else key="check" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10l4.5 4.5 7.5-8" stroke="#fff" stroke-width="2.5"
            stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </Transition>
    </button>
  </div>
</template>

<style scoped>
@keyframes spin { to { transform: rotate(360deg) } }
.v-enter-active, .v-leave-active { transition: opacity 0.15s }
.v-enter-from, .v-leave-to { opacity: 0 }
</style>`,
      },
      {
        platform: 'angular',
        deps: [],
        notes: 'A CSS `transition` on `width` handles the morph, while `*ngIf` swaps the inner label/spinner/check with a simple fade — no Animations API needed since only one property (opacity) needs orchestrating per swap.',
        code: `import { Component } from '@angular/core'

type BtnState = 'idle' | 'loading' | 'success'

@Component({
  selector: 'app-morphing-button',
  template: \`
    <div style="display:flex; justify-content:center; padding:40px">
      <button (click)="handleClick()" class="morph-btn"
              [style.width.px]="state === 'idle' ? 160 : 48"
              [style.background]="state === 'success' ? '#22c55e' : '#A3E635'">
        <span *ngIf="state === 'idle'">Submit</span>
        <svg *ngIf="state === 'loading'" class="spinner" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="8" stroke="rgba(0,0,0,0.2)" stroke-width="2.5"/>
          <path d="M10 2a8 8 0 018 8" stroke="#0a0a0a" stroke-width="2.5" stroke-linecap="round"/>
        </svg>
        <svg *ngIf="state === 'success'" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M4 10l4.5 4.5 7.5-8" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
  \`,
  styles: [\`
    .morph-btn { height: 48px; border-radius: 999px; border: none; overflow: hidden;
      display: flex; align-items: center; justify-content: center;
      transition: width 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s; }
    .spinner { animation: spin 0.8s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  \`],
})
export class MorphingButtonComponent {
  state: BtnState = 'idle'

  async handleClick() {
    if (this.state !== 'idle') return
    this.state = 'loading'
    await new Promise(r => setTimeout(r, 1800))
    this.state = 'success'
    setTimeout(() => (this.state = 'idle'), 2200)
  }
}`,
      },
      {
        platform: 'react-native',
        deps: [],
        notes: 'Uses `Animated.Value` + `Animated.spring` for the width morph and `ActivityIndicator` for the loading spinner. No external dependencies.',
        code: `import { useRef, useState } from 'react'
import {
  TouchableOpacity, Text, StyleSheet, View,
  Animated, ActivityIndicator
} from 'react-native'

export function MorphingButton() {
  const [state, setState] = useState<'idle' | 'loading' | 'success'>('idle')
  const widthAnim = useRef(new Animated.Value(160)).current

  async function handlePress() {
    if (state !== 'idle') return
    setState('loading')
    Animated.spring(widthAnim, { toValue: 48, useNativeDriver: false }).start()
    await new Promise(r => setTimeout(r, 1800))
    setState('success')
    setTimeout(() => {
      setState('idle')
      Animated.spring(widthAnim, { toValue: 160, useNativeDriver: false }).start()
    }, 2200)
  }

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.button, {
        width: widthAnim,
        backgroundColor: state === 'success' ? '#22c55e' : '#A3E635',
      }]}>
        <TouchableOpacity onPress={handlePress} style={styles.inner}>
          {state === 'idle'    && <Text style={styles.label}>Submit</Text>}
          {state === 'loading' && <ActivityIndicator color="#0a0a0a" size="small" />}
          {state === 'success' && <Text style={styles.check}>OK</Text>}
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 40 },
  button:    { height: 48, borderRadius: 999, overflow: 'hidden' },
  inner:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label:     { fontWeight: '600', fontSize: 15, color: '#0a0a0a' },
  check:     { fontWeight: '700', fontSize: 16, color: '#fff' },
})`,
      },
      {
        platform: 'flutter',
        deps: [],
        notes: 'Uses `AnimatedContainer` for the width morph with an elastic curve and `CircularProgressIndicator` for loading. Pure Flutter — no external packages.',
        code: `import 'package:flutter/material.dart';

enum _Btn { idle, loading, success }

class MorphingButton extends StatefulWidget {
  const MorphingButton({super.key});
  @override
  State<MorphingButton> createState() => _MorphingButtonState();
}

class _MorphingButtonState extends State<MorphingButton> {
  _Btn _state = _Btn.idle;

  Future<void> _handleTap() async {
    if (_state != _Btn.idle) return;
    setState(() => _state = _Btn.loading);
    await Future.delayed(const Duration(milliseconds: 1800));
    setState(() => _state = _Btn.success);
    await Future.delayed(const Duration(milliseconds: 2200));
    setState(() => _state = _Btn.idle);
  }

  @override
  Widget build(BuildContext context) {
    return Center(
      child: GestureDetector(
        onTap: _handleTap,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 400),
          curve: Curves.elasticOut,
          height: 48,
          width: _state == _Btn.idle ? 160 : 48,
          decoration: BoxDecoration(
            color: _state == _Btn.success
              ? const Color(0xFF22C55E)
              : const Color(0xFFA3E635),
            borderRadius: BorderRadius.circular(999),
          ),
          child: Center(
            child: _state == _Btn.idle
              ? const Text('Submit',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15,
                    color: Color(0xFF0A0A0A)))
              : _state == _Btn.loading
                ? const SizedBox(width: 20, height: 20,
                    child: CircularProgressIndicator(
                      strokeWidth: 2.5, color: Color(0xFF0A0A0A)))
                : const Icon(Icons.check, color: Colors.white, size: 20),
          ),
        ),
      ),
    );
  }
}`,
      },
      {
        platform: 'swiftui',
        deps: [],
        notes: '`.frame(width:)` animated implicitly, combined with a `switch` over an enum state, reproduces the same morph — `ProgressView` provides the spinner for free, no custom SVG needed.',
        code: `import SwiftUI

enum ButtonState { case idle, loading, success }

struct MorphingButton: View {
    @State private var state: ButtonState = .idle

    var body: some View {
        Button(action: handleTap) {
            Group {
                switch state {
                case .idle: Text("Submit").fontWeight(.semibold)
                case .loading: ProgressView().tint(.black)
                case .success: Image(systemName: "checkmark").foregroundStyle(.white)
                }
            }
            .frame(width: state == .idle ? 160 : 48, height: 48)
            .background(state == .success ? Color.green : Color(hex: "A3E635"))
            .clipShape(Capsule())
        }
        .disabled(state != .idle)
        .animation(.spring(response: 0.4, dampingFraction: 0.7), value: state)
    }

    func handleTap() {
        guard state == .idle else { return }
        state = .loading
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.8) {
            state = .success
            DispatchQueue.main.asyncAfter(deadline: .now() + 2.2) { state = .idle }
        }
    }
}`,
      },
    ],
    useCases: [
      { label: 'Form submit', example: 'A contact form Submit button that morphs into a spinner while the API call runs, then shows a green check on success.' },
      { label: 'Payment flow', example: 'A "Pay now" button in a checkout that prevents double-taps by transitioning to a loading state immediately on press.' },
      { label: 'File upload', example: 'An upload button that collapses to a spinner while uploading, then expands back with "Uploaded ✓" on completion.' },
      { label: 'Auth button', example: 'A "Sign in" button that enters loading while credentials are verified, preventing user confusion during async operations.' },
    ],
    tips: [
      'Always lock pointer-events during loading/success states to prevent double submissions.',
      'The spring stiffness on the width layout animation is critical — too stiff feels mechanical, too loose feels laggy. 400–500 stiffness with damping ~30 is the sweet spot.',
      'Use `mode="wait"` in AnimatePresence so the outgoing content fully fades before the incoming content appears — prevents a crowded overlap.',
      'On mobile, add haptic feedback (navigator.vibrate) on the success state for a more native feel.',
    ],
    fr: {
      title: 'Bouton Morphique',
      tagline: 'Un bouton qui se transforme en spinner puis en état de succès — dans un seul élément',
      concept: 'Le pattern Bouton Morphique remplace le classique spinner de chargement par un seul élément qui passe par trois états : inactif → chargement → succès. Au lieu de basculer la visibilité entre des éléments séparés, la forme, le texte et l\'icône du bouton s\'animent au sein d\'un seul nœud DOM grâce aux animations de mise en page.',
      howItWorks: [
        'Au clic, la largeur du bouton se réduit en cercle via une animation de layout — le texte s\'efface simultanément.',
        'Un SVG spinner apparaît en fondu au centre du bouton désormais circulaire.',
        'À la fin, le spinner disparaît et une coche se dessine via une animation de tiret SVG.',
        'Après un bref maintien, le bouton s\'élargit vers sa largeur d\'origine avec l\'étiquette initiale.',
      ],
      useCases: [
        { label: 'Soumission de formulaire', example: 'Un bouton Envoyer qui se morphe en spinner pendant l\'appel API, puis affiche une coche verte au succès.' },
        { label: 'Paiement', example: 'Un bouton "Payer maintenant" qui passe immédiatement en état de chargement pour éviter les doubles clics.' },
        { label: 'Upload de fichier', example: 'Un bouton d\'upload qui se réduit pendant le transfert, puis revient avec "Envoyé ✓".' },
        { label: 'Authentification', example: 'Un bouton "Se connecter" qui entre en chargement pendant la vérification des identifiants.' },
      ],
      tips: [
        'Toujours bloquer les événements pointeur pendant les états chargement/succès pour éviter les doubles soumissions.',
        'La raideur du spring sur l\'animation de largeur est critique — 400–500 avec un amortissement ~30 est la zone idéale.',
        'Utiliser `mode="wait"` dans AnimatePresence pour que le contenu sortant disparaisse complètement avant l\'arrivée du suivant.',
        'Sur mobile, ajouter un retour haptique (navigator.vibrate) à l\'état succès pour un ressenti plus natif.',
      ],
    },
  },

  /* ── 16. Drag to Reorder ── */
  {
    slug: 'drag-reorder',
    title: 'Drag to Reorder',
    category: 'List',
    difficulty: 'Intermediate',
    tagline: 'List items smoothly shuffle as you drag one to a new position',
    concept:
      'Drag-to-reorder lets users rearrange list items by grabbing and dragging them. The key challenge is that other items need to shift out of the way in real time as the dragged item moves — not just snap into place after drop. This requires tracking the dragged item\'s position, detecting which slot it\'s hovering over, and applying FLIP layout animations to the surrounding items continuously during the drag.',
    howItWorks: [
      'Each item has a drag handle. On drag start, the item lifts visually (scale up, shadow, z-index) and decouples from the layout flow.',
      'As the dragged item moves, its Y position is compared against the midpoints of sibling items to determine the target index.',
      'Siblings animate to their new positions using layout animations — they shift up or down to make room.',
      'On drag end, the array is reordered to match the target index, and all items animate to their final positions.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        notes: 'Framer Motion\'s `Reorder` component handles the hit detection and array reordering automatically.',
        code: `import { useState } from 'react'
import { Reorder, useDragControls } from 'framer-motion'

const INITIAL_ITEMS = [
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
  { id: '5', label: 'Performance review',     color: '#E6C430' },
]

export function DragReorder() {
  const [items, setItems] = useState(INITIAL_ITEMS)

  return (
    <Reorder.Group
      axis="y"
      values={items}
      onReorder={setItems}
      style={{ listStyle: 'none', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}
    >
      {items.map(item => (
        <ReorderItem key={item.id} item={item} />
      ))}
    </Reorder.Group>
  )
}

function ReorderItem({ item }: { item: typeof INITIAL_ITEMS[0] }) {
  const controls = useDragControls()

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={controls}
      style={{ listStyle: 'none' }}
      whileDrag={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 99 }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '12px 14px',
        userSelect: 'none',
      }}>
        {/* Drag handle */}
        <div
          onPointerDown={e => controls.start(e)}
          style={{ cursor: 'grab', color: 'var(--text-tertiary)', display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}
        >
          {[0,1,2].map(i => (
            <div key={i} style={{ display: 'flex', gap: 3 }}>
              <div style={{ width: 3, height: 3, borderRadius: 1, background: 'currentColor' }} />
              <div style={{ width: 3, height: 3, borderRadius: 1, background: 'currentColor' }} />
            </div>
          ))}
        </div>
        {/* Color dot */}
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
        <span style={{ fontFamily: 'system-ui', fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>{item.label}</span>
      </div>
    </Reorder.Item>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: 'Add `"use client"` — Framer Motion Reorder uses pointer events and must run in the browser. Otherwise identical to the React implementation.',
        code: `'use client'
import { useState } from 'react'
import { Reorder, useDragControls } from 'framer-motion'

const INITIAL_ITEMS = [
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
  { id: '5', label: 'Performance review',     color: '#E6C430' },
]

function ReorderItem({ item }: { item: typeof INITIAL_ITEMS[0] }) {
  const controls = useDragControls()
  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls}
      style={{ listStyle: 'none' }}
      whileDrag={{ scale: 1.03, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', zIndex: 99 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12,
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '12px 14px', userSelect: 'none' }}>
        <div onPointerDown={e => controls.start(e)}
          style={{ cursor: 'grab', color: 'var(--text-tertiary)',
            display: 'flex', flexDirection: 'column', gap: 3, flexShrink: 0 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ display: 'flex', gap: 3 }}>
              <div style={{ width: 3, height: 3, borderRadius: 1, background: 'currentColor' }} />
              <div style={{ width: 3, height: 3, borderRadius: 1, background: 'currentColor' }} />
            </div>
          ))}
        </div>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color, flexShrink: 0 }} />
        <span style={{ fontFamily: 'system-ui', fontSize: 14, color: 'var(--text-primary)', flex: 1 }}>
          {item.label}
        </span>
      </div>
    </Reorder.Item>
  )
}

export function DragReorder() {
  const [items, setItems] = useState(INITIAL_ITEMS)
  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems}
      style={{ listStyle: 'none', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(item => <ReorderItem key={item.id} item={item} />)}
    </Reorder.Group>
  )
}`,
      },
      {
        platform: 'vue',
        deps: ['vuedraggable'],
        notes: 'Uses `vuedraggable` (a Vue 3 wrapper around SortableJS). Bind `v-model` to the reactive items array and use the `animation` prop for the sibling shuffle effect.',
        code: `<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'

const items = ref([
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
  { id: '5', label: 'Performance review',     color: '#E6C430' },
])
</script>

<template>
  <draggable v-model="items" item-key="id" tag="ul"
    :animation="200"
    ghost-class="drag-ghost"
    chosen-class="drag-chosen"
    style="list-style:none;padding:12px 16px;display:flex;flex-direction:column;gap:8px">
    <template #item="{ element }">
      <li style="display:flex;align-items:center;gap:12px;
        background:var(--bg-secondary);border:1px solid var(--border);
        border-radius:10px;padding:12px 14px;user-select:none;cursor:grab">
        <span style="color:var(--text-tertiary);letter-spacing:1px">:: :: ::</span>
        <div :style="{ width:'10px', height:'10px', borderRadius:'50%',
          background: element.color, flexShrink:0 }" />
        <span style="font-family:system-ui;font-size:14px;color:var(--text-primary);flex:1">
          {{ element.label }}
        </span>
      </li>
    </template>
  </draggable>
</template>

<style scoped>
.drag-ghost { opacity: 0.3; }
.drag-chosen { transform: scale(1.03); box-shadow: 0 8px 24px rgba(0,0,0,0.2); z-index: 99; }
</style>`,
      },
      {
        platform: 'angular',
        deps: ['@angular/cdk'],
        notes: 'The Angular CDK\'s `DragDropModule` provides `cdkDropList` + `cdkDrag`, which handles hit detection and the sibling-shift animation out of the box — the closest official equivalent to Framer Motion\'s `Reorder`.',
        code: `import { Component } from '@angular/core'
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop'

@Component({
  selector: 'app-drag-reorder',
  template: \`
    <ul cdkDropList (cdkDropListDropped)="drop($event)" class="list">
      <li *ngFor="let item of items" cdkDrag class="row">
        <span cdkDragHandle class="handle">⠿</span>
        <span class="dot" [style.background]="item.color"></span>
        <span class="label">{{ item.label }}</span>
      </li>
    </ul>
  \`,
  styles: [\`
    .list { list-style: none; padding: 12px 16px; display: flex; flex-direction: column; gap: 8px; }
    .row { display: flex; align-items: center; gap: 12px; background: var(--bg-secondary);
      border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; }
    .cdk-drag-preview { box-shadow: 0 8px 24px rgba(0,0,0,0.2); transform: scale(1.03); }
    .cdk-drag-placeholder { opacity: 0.3; }
    .cdk-drop-list-dragging .row:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0,0,0.2,1);
    }
  \`],
})
export class DragReorderComponent {
  items = [
    { id: '1', label: 'Design system tokens', color: '#534AB7' },
    { id: '2', label: 'Component architecture', color: '#1D9E75' },
    { id: '3', label: 'Animation library', color: '#D85A30' },
    { id: '4', label: 'Accessibility audit', color: '#A3E635' },
    { id: '5', label: 'Performance review', color: '#E6C430' },
  ]

  drop(event: CdkDragDrop<typeof this.items>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex)
  }
}`,
      },
      {
        platform: 'react-native',
        deps: ['react-native-draggable-flatlist', 'react-native-reanimated', 'react-native-gesture-handler'],
        notes: 'Uses `react-native-draggable-flatlist` which wraps Reanimated for smooth native-thread animations. `ScaleDecorator` provides the lift effect on drag.',
        code: `import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist'

const INITIAL_ITEMS = [
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
  { id: '5', label: 'Performance review',     color: '#E6C430' },
]

type Item = typeof INITIAL_ITEMS[0]

export function DragReorder() {
  const [items, setItems] = useState(INITIAL_ITEMS)

  return (
    <DraggableFlatList
      data={items}
      keyExtractor={item => item.id}
      onDragEnd={({ data }) => setItems(data)}
      contentContainerStyle={{ padding: 16, gap: 8 }}
      renderItem={({ item, drag, isActive }: { item: Item; drag: () => void; isActive: boolean }) => (
        <ScaleDecorator>
          <View style={[styles.row, isActive && styles.rowActive]}>
            <Text style={styles.handle} onLongPress={drag}>::</Text>
            <View style={[styles.dot, { backgroundColor: item.color }]} />
            <Text style={styles.label}>{item.label}</Text>
          </View>
        </ScaleDecorator>
      )}
    />
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333',
    borderRadius: 10, padding: 12 },
  rowActive: { shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  handle: { color: '#666', fontSize: 16 },
  dot:    { width: 10, height: 10, borderRadius: 5 },
  label:  { fontFamily: 'System', fontSize: 14, color: '#fff', flex: 1 },
})`,
      },
      {
        platform: 'flutter',
        deps: [],
        notes: 'Flutter\'s built-in `ReorderableListView` handles drag detection and array reordering. Use `ReorderableDragStartListener` to restrict drag to the handle icon and `proxyDecorator` for the lift effect.',
        code: `import 'package:flutter/material.dart';

class DragReorder extends StatefulWidget {
  const DragReorder({super.key});
  @override
  State<DragReorder> createState() => _DragReorderState();
}

class _DragReorderState extends State<DragReorder> {
  final _items = [
    {'id': '1', 'label': 'Design system tokens', 'color': const Color(0xFF534AB7)},
    {'id': '2', 'label': 'Component architecture', 'color': const Color(0xFF1D9E75)},
    {'id': '3', 'label': 'Animation library',      'color': const Color(0xFFD85A30)},
    {'id': '4', 'label': 'Accessibility audit',    'color': const Color(0xFFA3E635)},
    {'id': '5', 'label': 'Performance review',     'color': const Color(0xFFE6C430)},
  ];

  void _onReorder(int oldIndex, int newIndex) {
    setState(() {
      if (newIndex > oldIndex) newIndex--;
      final item = _items.removeAt(oldIndex);
      _items.insert(newIndex, item);
    });
  }

  @override
  Widget build(BuildContext context) {
    return ReorderableListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _items.length,
      onReorder: _onReorder,
      proxyDecorator: (child, index, animation) => AnimatedBuilder(
        animation: animation,
        builder: (context, child) => Transform.scale(
          scale: 1.03,
          child: Material(elevation: 8, borderRadius: BorderRadius.circular(10), child: child),
        ),
        child: child,
      ),
      itemBuilder: (context, index) {
        final item = _items[index];
        return Container(
          key: ValueKey(item['id']),
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.grey[900],
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.grey[800]!),
          ),
          child: Row(children: [
            ReorderableDragStartListener(
              index: index,
              child: const Icon(Icons.drag_handle, color: Colors.grey),
            ),
            const SizedBox(width: 12),
            Container(width: 10, height: 10,
              decoration: BoxDecoration(
                color: item['color'] as Color, shape: BoxShape.circle)),
            const SizedBox(width: 12),
            Expanded(child: Text(item['label'] as String,
              style: const TextStyle(fontSize: 14, color: Colors.white))),
          ]),
        );
      },
    );
  }
}`,
      },
      {
        platform: 'swiftui',
        deps: [],
        notes: 'A `List` with `.onMove` gives free drag-to-reorder with the system\'s native lift-and-shift animation — pair with `EditMode` or a persistent handle icon so users know rows are draggable outside of `List`\'s default edit mode.',
        code: `import SwiftUI

struct ReorderItem: Identifiable {
    let id: String; let label: String; let color: Color
}

struct DragReorder: View {
    @State private var items = [
        ReorderItem(id: "1", label: "Design system tokens", color: Color(hex: "534AB7")),
        ReorderItem(id: "2", label: "Component architecture", color: Color(hex: "1D9E75")),
        ReorderItem(id: "3", label: "Animation library", color: Color(hex: "D85A30")),
        ReorderItem(id: "4", label: "Accessibility audit", color: Color(hex: "A3E635")),
        ReorderItem(id: "5", label: "Performance review", color: Color(hex: "E6C430")),
    ]

    var body: some View {
        List {
            ForEach(items) { item in
                HStack(spacing: 12) {
                    Image(systemName: "line.3.horizontal").foregroundStyle(.secondary)
                    Circle().fill(item.color).frame(width: 10, height: 10)
                    Text(item.label)
                }
            }
            .onMove { indices, newOffset in
                items.move(fromOffsets: indices, toOffset: newOffset)
            }
        }
        .environment(\\.editMode, .constant(.active))
    }
}`,
      },
    ],
    useCases: [
      { label: 'Task management', example: 'A to-do list where tasks can be dragged to reprioritize order, with siblings animating to make space as you drag.' },
      { label: 'Playlist editor', example: 'A music queue where tracks can be reordered by dragging — the playlist updates live as you move songs.' },
      { label: 'Form builder', example: 'A settings panel where sections (notifications, appearance, privacy) can be rearranged by the user.' },
      { label: 'Kanban columns', example: 'Column headers in a kanban board that can be dragged to reorder the overall workflow layout.' },
    ],
    tips: [
      'Use `dragListener={false}` + `dragControls` to restrict dragging to the handle only — prevents accidental drags on clickable content.',
      'Add `layout` to sibling elements so they animate when the array reorders after drop — without it they snap.',
      'Lift the dragged item visually with scale and z-index (`whileDrag`) so users always know what they\'re moving.',
      'On touch devices, add a slight delay before drag starts (200–300ms) to differentiate a tap from a drag intent.',
    ],
    fr: {
      title: 'Glisser pour Réordonner',
      tagline: 'Les éléments de la liste se réorganisent en douceur pendant le glisser',
      concept: 'Le glisser-réordonner permet aux utilisateurs de réarranger des éléments de liste en les faisant glisser. Le défi clé est que les autres éléments doivent se déplacer en temps réel pendant le glisser — pas seulement se repositionner après le lâcher.',
      howItWorks: [
        'Chaque élément a une poignée. Au début du glisser, l\'élément se soulève visuellement (scale, ombre, z-index) et se découple du flux de mise en page.',
        'Pendant le déplacement, la position Y est comparée aux points médians des éléments voisins pour déterminer l\'index cible.',
        'Les voisins s\'animent vers leurs nouvelles positions via des animations de layout.',
        'Au lâcher, le tableau est réordonné et tous les éléments s\'animent vers leurs positions finales.',
      ],
      useCases: [
        { label: 'Gestion de tâches', example: 'Une liste de tâches où les éléments peuvent être glissés pour changer leur priorité.' },
        { label: 'Éditeur de playlist', example: 'Une file d\'attente musicale où les pistes peuvent être réordonnées par glisser.' },
        { label: 'Constructeur de formulaire', example: 'Un panneau de paramètres où les sections peuvent être réarrangées par l\'utilisateur.' },
        { label: 'Colonnes Kanban', example: 'Les en-têtes de colonnes d\'un tableau kanban peuvent être réordonnés par glisser.' },
      ],
      tips: [
        'Utiliser `dragListener={false}` + `dragControls` pour restreindre le glisser à la poignée uniquement.',
        'Ajouter `layout` aux éléments frères pour qu\'ils s\'animent lors du réordonnancement.',
        'Soulever visuellement l\'élément glissé avec scale et z-index (`whileDrag`).',
        'Sur mobile, ajouter un délai de 200–300ms avant de démarrer le glisser pour différencier un tap d\'un drag.',
      ],
    },
  },

  /* ── 17. Number Counter ── */
  {
    slug: 'number-counter',
    title: 'Animated Counter',
    category: 'Entrance',
    difficulty: 'Beginner',
    tagline: 'Numbers count up smoothly on enter — dashboards, stats, and KPIs come alive',
    concept:
      'The Animated Counter pattern brings attention to key metrics by animating numeric values from zero (or a previous value) to their target when they enter the viewport. Rather than a number simply appearing, it counts up with an easing curve — fast at first, then decelerating as it approaches the final value. This draws the eye and creates a sense of the value being "earned".',
    howItWorks: [
      'An IntersectionObserver detects when the counter enters the viewport and triggers the animation.',
      'A `useMotionValue` or `requestAnimationFrame` loop drives a numeric value from 0 to the target over a set duration.',
      'An easing function (ease-out cubic) makes the count start fast and slow down near the target — mimicking natural deceleration.',
      'The raw float is formatted with `Intl.NumberFormat` or a custom formatter to display as currency, percentage, or integer.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        notes: 'Framer Motion\'s `useMotionValue`, `useTransform`, and `animate` make this trivial — no manual RAF loop needed.',
        code: `import { useEffect, useRef } from 'react'
import { useMotionValue, useTransform, animate, motion, useInView } from 'framer-motion'

interface CounterProps {
  from?: number
  to: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
}

export function Counter({ from = 0, to, duration = 1.8, prefix = '', suffix = '', decimals = 0 }: CounterProps) {
  const ref  = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const val  = useMotionValue(from)
  const disp = useTransform(val, v => prefix + v.toFixed(decimals).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',') + suffix)

  useEffect(() => {
    if (!inView) return
    const ctrl = animate(val, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    })
    return () => ctrl.stop()
  }, [inView, val, to, duration])

  return <motion.span ref={ref}>{disp}</motion.span>
}

/* Demo */
const STATS = [
  { to: 2400000, prefix: '$', label: 'Revenue', duration: 2   },
  { to: 98.6,    suffix: '%', label: 'Uptime',  decimals: 1, duration: 1.6 },
  { to: 14832,               label: 'Users',    duration: 1.8 },
]

export function Dashboard() {
  return (
    <div style={{ display: 'flex', gap: 24, padding: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
      {STATS.map(s => (
        <div key={s.label} style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '20px 28px', textAlign: 'center', minWidth: 140,
        }}>
          <div style={{ fontFamily: 'system-ui', fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            <Counter {...s} />
          </div>
          <div style={{ fontFamily: 'system-ui', fontSize: 12, color: 'var(--text-tertiary)', marginTop: 4 }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: 'Add `"use client"` — `useEffect`, `useRef`, and Framer Motion\'s motion values all require the browser. The Server Component that imports this can still SSR the surrounding page layout.',
        code: `'use client'
import { useEffect, useRef } from 'react'
import { useMotionValue, useTransform, animate, motion, useInView } from 'framer-motion'

interface CounterProps {
  from?: number
  to: number
  duration?: number
  prefix?: string
  suffix?: string
  decimals?: number
}

export function Counter({ from = 0, to, duration = 1.8, prefix = '', suffix = '', decimals = 0 }: CounterProps) {
  const ref    = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const val    = useMotionValue(from)
  const disp   = useTransform(val, v =>
    prefix + v.toFixed(decimals).replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',') + suffix
  )

  useEffect(() => {
    if (!inView) return
    const ctrl = animate(val, to, { duration, ease: [0.16, 1, 0.3, 1] })
    return () => ctrl.stop()
  }, [inView, val, to, duration])

  return <motion.span ref={ref}>{disp}</motion.span>
}

const STATS = [
  { to: 2400000, prefix: '$', label: 'Revenue', duration: 2   },
  { to: 98.6,    suffix: '%', label: 'Uptime',  decimals: 1, duration: 1.6 },
  { to: 14832,               label: 'Users',    duration: 1.8 },
]

export function Dashboard() {
  return (
    <div style={{ display: 'flex', gap: 24, padding: 32, flexWrap: 'wrap', justifyContent: 'center' }}>
      {STATS.map(s => (
        <div key={s.label} style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: 14, padding: '20px 28px', textAlign: 'center', minWidth: 140,
        }}>
          <div style={{ fontFamily: 'system-ui', fontSize: 32, fontWeight: 800,
            color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            <Counter {...s} />
          </div>
          <div style={{ fontFamily: 'system-ui', fontSize: 12,
            color: 'var(--text-tertiary)', marginTop: 4 }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}`,
      },
      {
        platform: 'vue',
        deps: ['gsap'],
        notes: 'Uses GSAP for the animation loop and a manual `IntersectionObserver` for viewport detection. `gsap.to` drives a reactive `count` object; the template reads `count.value` each frame.',
        code: `<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  to:       { type: Number, default: 2400000 },
  prefix:   { type: String, default: '' },
  suffix:   { type: String, default: '' },
  decimals: { type: Number, default: 0 },
  duration: { type: Number, default: 1.8 },
  label:    { type: String, default: '' },
})

const el    = ref(null)
const count = ref({ value: 0 })

function fmt(v: number) {
  return props.prefix + Number(v).toFixed(props.decimals)
    .replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',') + props.suffix
}

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      gsap.to(count.value, {
        value: props.to,
        duration: props.duration,
        ease: 'power3.out',
      })
    },
    { threshold: 0.1 }
  )
  if (el.value) observer.observe(el.value)
})
</script>

<template>
  <div ref="el" style="background:var(--bg-secondary);border:1px solid var(--border);
    border-radius:14px;padding:20px 28px;text-align:center;min-width:140px">
    <div style="font-family:system-ui;font-size:32px;font-weight:800;
      color:var(--text-primary);letter-spacing:-0.03em">
      {{ fmt(count.value) }}
    </div>
    <div style="font-family:system-ui;font-size:12px;color:var(--text-tertiary);margin-top:4px">
      {{ label }}
    </div>
  </div>
</template>`,
      },
      {
        platform: 'angular',
        deps: [],
        notes: 'A `requestAnimationFrame` loop with a manual ease-out-cubic function drives the count — no animation library needed, since Angular has no motion-value primitive like Framer Motion\'s `useMotionValue`.',
        code: `import { Component, ElementRef, Input, OnInit } from '@angular/core'

@Component({
  selector: 'app-counter',
  template: \`
    <div #el class="card">
      <div class="number">{{ display }}</div>
      <div class="label">{{ label }}</div>
    </div>
  \`,
  styles: [\`
    .card { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 14px;
      padding: 20px 28px; text-align: center; min-width: 140px; }
    .number { font-size: 32px; font-weight: 800; letter-spacing: -0.03em; }
    .label { font-size: 12px; color: var(--text-tertiary); margin-top: 4px; }
  \`],
})
export class CounterComponent implements OnInit {
  @Input() to = 0
  @Input() duration = 1800
  @Input() prefix = ''
  @Input() suffix = ''
  @Input() decimals = 0
  @Input() label = ''
  display = '0'

  constructor(private el: ElementRef<HTMLElement>) {}

  ngOnInit() {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      this.animate()
    }, { threshold: 0.1 })
    observer.observe(this.el.nativeElement)
  }

  private animate() {
    const start = performance.now()
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / this.duration)
      const value = easeOutCubic(t) * this.to
      this.display = this.prefix + value.toFixed(this.decimals)
        .replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',') + this.suffix
      if (t < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }
}`,
      },
      {
        platform: 'react-native',
        deps: [],
        notes: 'Uses `Animated.Value` + `Animated.timing` with a cubic ease-out easing function. An `addListener` reads the raw value each frame to update the displayed text. No external packages needed.',
        code: `import { useRef, useState, useEffect } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'

interface CounterProps {
  to: number
  prefix?: string
  suffix?: string
  duration?: number
  label?: string
}

export function Counter({ to, prefix = '', suffix = '', duration = 1800, label = '' }: CounterProps) {
  const anim    = useRef(new Animated.Value(0)).current
  const [display, setDisplay] = useState(prefix + '0' + suffix)

  useEffect(() => {
    const id = anim.addListener(({ value }) => {
      setDisplay(prefix + Math.round(value).toLocaleString() + suffix)
    })
    Animated.timing(anim, {
      toValue: to,
      duration,
      easing: t => 1 - Math.pow(1 - t, 3),
      useNativeDriver: false,
    }).start()
    return () => anim.removeListener(id)
  }, [to, duration])

  return (
    <View style={styles.card}>
      <Text style={styles.number}>{display}</Text>
      {!!label && <Text style={styles.label}>{label}</Text>}
    </View>
  )
}

const STATS = [
  { to: 2400000, prefix: '$', label: 'Revenue', duration: 2000 },
  { to: 14832,               label: 'Users',   duration: 1800 },
]

export function Dashboard() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16,
      padding: 24, justifyContent: 'center' }}>
      {STATS.map(s => <Counter key={s.label} {...s} />)}
    </View>
  )
}

const styles = StyleSheet.create({
  card:   { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333',
    borderRadius: 14, padding: 20, alignItems: 'center', minWidth: 140 },
  number: { fontFamily: 'System', fontSize: 32, fontWeight: '800', color: '#fff' },
  label:  { fontFamily: 'System', fontSize: 12, color: '#666', marginTop: 4 },
})`,
      },
      {
        platform: 'flutter',
        deps: ['visibility_detector'],
        notes: 'Uses Flutter\'s built-in `TweenAnimationBuilder` for the count-up animation and the `visibility_detector` package to trigger on viewport entry. No Rive or Lottie needed.',
        code: `import 'package:flutter/material.dart';
import 'package:visibility_detector/visibility_detector.dart';

class CounterCard extends StatefulWidget {
  final double to;
  final String prefix;
  final String suffix;
  final String label;
  final int decimals;
  const CounterCard({
    super.key,
    required this.to,
    this.prefix = '',
    this.suffix = '',
    required this.label,
    this.decimals = 0,
  });

  @override
  State<CounterCard> createState() => _CounterCardState();
}

class _CounterCardState extends State<CounterCard> {
  bool _visible = false;

  String _format(double v) {
    final fixed = v.toStringAsFixed(widget.decimals);
    final parts = fixed.split('.');
    final intPart = parts[0].replaceAllMapped(
      RegExp(r'(\\d)(?=(\\d{3})+(?!\\d))'), (m) => '\${m[1]},');
    return widget.prefix +
      (parts.length > 1 ? '\$intPart.\${parts[1]}' : intPart) +
      widget.suffix;
  }

  @override
  Widget build(BuildContext context) {
    return VisibilityDetector(
      key: Key('counter-\${widget.label}'),
      onVisibilityChanged: (info) {
        if (info.visibleFraction > 0.1 && !_visible) {
          setState(() => _visible = true);
        }
      },
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: const Color(0xFF1A1A1A),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: const Color(0xFF333333)),
        ),
        child: Column(mainAxisSize: MainAxisSize.min, children: [
          TweenAnimationBuilder<double>(
            tween: Tween(begin: 0, end: _visible ? widget.to : 0),
            duration: const Duration(milliseconds: 1800),
            curve: Curves.easeOutCubic,
            builder: (context, value, _) => Text(_format(value),
              style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w800,
                color: Colors.white, letterSpacing: -1)),
          ),
          const SizedBox(height: 4),
          Text(widget.label,
            style: const TextStyle(fontSize: 12, color: Colors.grey)),
        ]),
      ),
    );
  }
}

class Dashboard extends StatelessWidget {
  const Dashboard({super.key});

  @override
  Widget build(BuildContext context) {
    return Wrap(spacing: 16, runSpacing: 16,
      children: const [
        CounterCard(to: 2400000, prefix: r'$', label: 'Revenue'),
        CounterCard(to: 98.6,    suffix: '%',  label: 'Uptime', decimals: 1),
        CounterCard(to: 14832,                 label: 'Users'),
      ]);
  }
}`,
      },
      {
        platform: 'swiftui',
        deps: [],
        notes: 'SwiftUI has no built-in tweened-value builder, so this drives the count manually with a `Timer` publisher and an ease-out-cubic function — conceptually the same RAF-loop technique as the Angular and React Native implementations.',
        code: `import SwiftUI

struct Counter: View {
    let to: Double
    var duration: Double = 1.8
    var prefix: String = ""
    var suffix: String = ""
    var decimals: Int = 0
    var label: String = ""

    @State private var value: Double = 0
    @State private var hasAnimated = false

    var body: some View {
        VStack {
            Text(formatted)
                .font(.system(size: 32, weight: .heavy))
            Text(label).font(.caption).foregroundStyle(.secondary)
        }
        .padding(20)
        .background(.background, in: RoundedRectangle(cornerRadius: 14))
        .onAppear {
            guard !hasAnimated else { return }
            hasAnimated = true
            animate()
        }
    }

    var formatted: String {
        prefix + String(format: "%.\\(decimals)f", value) + suffix
    }

    func animate() {
        let start = Date()
        Timer.scheduledTimer(withTimeInterval: 1.0 / 60.0, repeats: true) { timer in
            let elapsed = Date().timeIntervalSince(start)
            let t = min(1, elapsed / duration)
            let eased = 1 - pow(1 - t, 3)
            value = eased * to
            if t >= 1 { timer.invalidate() }
        }
    }
}`,
      },
    ],
    useCases: [
      { label: 'SaaS marketing page', example: 'A "10,000+ teams trust us" stat that counts up from 0 as the section scrolls into view.' },
      { label: 'Analytics dashboard', example: 'KPI cards that animate their values when the dashboard first loads, drawing attention to key metrics.' },
      { label: 'Fundraising tracker', example: 'A progress counter showing "$248,320 raised" counting up to the current amount when the page loads.' },
      { label: 'Score reveal', example: 'A quiz result screen where the score counts up dramatically from 0 to the final value after completion.' },
    ],
    tips: [
      'Use `useInView` with `once: true` so the counter only animates once — re-triggering on scroll-back feels broken.',
      'The easing curve `[0.16, 1, 0.3, 1]` (expo-out) gives a satisfying deceleration. Avoid linear — it feels mechanical.',
      'For large numbers (millions), animate from a nearby value (e.g. 1.8M → 2.4M) rather than from 0 — the count takes too long otherwise.',
      'Add `aria-live="polite"` to the counter element so screen readers announce the final value after the animation completes.',
    ],
    fr: {
      title: 'Compteur Animé',
      tagline: 'Les chiffres montent en douceur à l\'entrée — tableaux de bord et KPIs prennent vie',
      concept: 'Le pattern Compteur Animé attire l\'attention sur les métriques clés en animant les valeurs numériques de zéro vers leur cible lorsqu\'elles entrent dans la zone visible. Le compteur monte rapidement puis décélère à l\'approche de la valeur finale.',
      howItWorks: [
        'Un IntersectionObserver détecte l\'entrée dans la zone visible et déclenche l\'animation.',
        'Une `useMotionValue` ou une boucle `requestAnimationFrame` anime la valeur de 0 vers la cible sur une durée définie.',
        'Une fonction d\'easing (ease-out cubique) fait démarrer le compteur vite et ralentit près de la cible.',
        'Le flottant brut est formaté avec `Intl.NumberFormat` pour afficher devises, pourcentages ou entiers.',
      ],
      useCases: [
        { label: 'Page marketing SaaS', example: 'Une stat "10 000+ équipes nous font confiance" qui compte depuis 0 au défilement.' },
        { label: 'Tableau de bord analytique', example: 'Des cartes KPI qui animent leurs valeurs au chargement initial du tableau de bord.' },
        { label: 'Suivi de collecte de fonds', example: 'Un compteur de progression affichant "248 320 € collectés" comptant jusqu\'au montant actuel.' },
        { label: 'Révélation de score', example: 'Un écran de résultat de quiz où le score monte dramatiquement de 0 à la valeur finale.' },
      ],
      tips: [
        'Utiliser `useInView` avec `once: true` pour que le compteur ne s\'anime qu\'une seule fois.',
        'La courbe d\'easing `[0.16, 1, 0.3, 1]` (expo-out) donne une décélération satisfaisante. Éviter le linéaire.',
        'Pour les grands nombres, animer depuis une valeur proche plutôt que depuis 0.',
        'Ajouter `aria-live="polite"` pour que les lecteurs d\'écran annoncent la valeur finale après l\'animation.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  18. Scroll Header Collapse                     */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'scroll-header-collapse',
    title: 'Scroll Header Collapse',
    category: 'Scroll',
    difficulty: 'Beginner',
    tagline: 'A sticky header shrinks, blurs, and fades its subtitle as the page scrolls',
    concept:
      'A collapsing header ties a nav bar\'s height, background blur, and subtitle opacity directly to scroll position instead of a fixed breakpoint. As the user scrolls down, the header progressively compresses — this reclaims vertical space for content while keeping navigation reachable. It\'s a web-native pattern: it depends on continuous scroll position and `backdrop-filter`, with no direct mobile-native equivalent (native apps use large-title collapse instead, a different mechanism).',
    howItWorks: [
      'Read scroll progress with a `MotionValue` (Framer Motion\'s `useScroll`) rather than a scroll event listener — this avoids re-renders on every pixel of scroll.',
      'Feed that `MotionValue` into one or more `useTransform` calls to derive height, blur, and opacity as pure functions of scroll offset.',
      'Apply the derived values directly as `style` props on a `motion.header` — Framer Motion updates them on the compositor thread, skipping React re-renders entirely.',
      'Clamp the input range (e.g. 0–120px of scroll) so the collapse finishes early and the header stays in its compact state for the rest of the scroll.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        notes: 'Works with any scrollable container — pass a `target` ref to `useScroll` to track a specific element instead of the window.',
        code: `import { motion, useScroll, useTransform } from 'framer-motion'

export function CollapsingHeader() {
  const { scrollY } = useScroll()

  const height  = useTransform(scrollY, [0, 120], [88, 56])
  const blur    = useTransform(scrollY, [0, 120], [0, 12])
  const subOpac = useTransform(scrollY, [0, 80],  [1, 0])
  const bg      = useTransform(scrollY, [0, 120], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.75)'])

  return (
    <motion.header
      style={{
        position: 'sticky', top: 0, zIndex: 50,
        height,
        backdropFilter: useTransform(blur, b => \`blur(\${b}px)\`),
        background: bg,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 24px', borderBottom: '1px solid rgba(0,0,0,0.06)',
      }}
    >
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Dashboard</h1>
      <motion.p style={{ opacity: subOpac, fontSize: 13, margin: 0, height: 18 }}>
        Last updated 2 minutes ago
      </motion.p>
    </motion.header>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: 'Add `\'use client\'` — `useScroll` reads `window` and must run in the browser. Works the same inside a layout or page component.',
        code: `'use client'
import { motion, useScroll, useTransform } from 'framer-motion'

export function CollapsingHeader() {
  const { scrollY } = useScroll()

  const height  = useTransform(scrollY, [0, 120], [88, 56])
  const subOpac = useTransform(scrollY, [0, 80],  [1, 0])
  const bg      = useTransform(scrollY, [0, 120], ['rgba(10,10,10,0)', 'rgba(10,10,10,0.8)'])
  const blurPx  = useTransform(scrollY, [0, 120], [0, 12])

  return (
    <motion.header
      style={{
        position: 'sticky', top: 0, zIndex: 50, height,
        backdropFilter: useTransform(blurPx, b => \`blur(\${b}px)\`),
        background: bg,
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 24px',
      }}
    >
      <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#fff' }}>Dashboard</h1>
      <motion.p style={{ opacity: subOpac, fontSize: 13, margin: 0, color: '#aaa', height: 18 }}>
        Last updated 2 minutes ago
      </motion.p>
    </motion.header>
  )
}`,
      },
      {
        platform: 'angular',
        deps: [],
        notes: 'Same `@HostListener(\'window:scroll\')` + `lerp` technique used in the Collapsing Header animation — this is the same underlying pattern, just with `backdrop-filter` blur added to the derived styles.',
        code: `import { Component, HostListener } from '@angular/core'

function lerp(val: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  const t = Math.max(0, Math.min(1, (val - inMin) / (inMax - inMin)))
  return outMin + t * (outMax - outMin)
}

@Component({
  selector: 'app-collapsing-header',
  template: \`
    <header class="header" [style.height.px]="height"
            [style.backdrop-filter]="'blur(' + blur + 'px)'"
            [style.background]="'rgba(255,255,255,' + bgOpacity + ')'">
      <h1>Dashboard</h1>
      <p [style.opacity]="subOpac">Last updated 2 minutes ago</p>
    </header>
  \`,
  styles: [\`
    .header { position: sticky; top: 0; z-index: 50; display: flex; flex-direction: column;
      justify-content: center; padding: 0 24px; border-bottom: 1px solid rgba(0,0,0,0.06); }
  \`],
})
export class CollapsingHeaderComponent {
  height = 88
  blur = 0
  bgOpacity = 0
  subOpac = 1

  @HostListener('window:scroll')
  onScroll() {
    const y = window.scrollY
    this.height    = lerp(y, 0, 120, 88, 56)
    this.blur      = lerp(y, 0, 120, 0, 12)
    this.bgOpacity = lerp(y, 0, 120, 0, 0.75)
    this.subOpac   = lerp(y, 0, 80, 1, 0)
  }
}`,
      },
      {
        platform: 'swiftui',
        deps: [],
        notes: 'iOS has a first-class collapsing header mechanism that is genuinely different from the web version: `.navigationBarTitleDisplayMode(.large)` on a `NavigationStack` shrinks the title into the compact nav bar automatically as the user scrolls, using the system\'s large-title behavior rather than manual scroll math.',
        code: `import SwiftUI

struct ProfileScreen: View {
    var body: some View {
        NavigationStack {
            List {
                Section {
                    ForEach(0..<14) { _ in
                        RoundedRectangle(cornerRadius: 10)
                            .fill(Color(.systemGray6))
                            .frame(height: 60)
                    }
                }
            }
            .navigationTitle("Dashboard")
            .navigationBarTitleDisplayMode(.large)
            .toolbar {
                ToolbarItem(placement: .principal) {
                    // Optional: custom subtitle shown only when scrolled to top
                }
            }
        }
    }
}

// For custom subtitle fade + blur behavior beyond what the system
// large-title provides, combine with a GeometryReader-based scroll
// offset (see the Collapsing Header animation) and apply it to a
// custom header view instead of relying on navigationBarTitleDisplayMode.`,
      },
    ],
    useCases: [
      { label: 'Analytics dashboard', example: 'The page title header shrinks and blurs as the user scrolls through a long report, keeping filters accessible without eating screen space.' },
      { label: 'Documentation site', example: 'A docs nav bar compresses on scroll, trading its tagline for more reading room while keeping the search bar pinned.' },
      { label: 'Blog post', example: 'The article title bar collapses into a slim reading-progress bar once the reader passes the hero section.' },
    ],
    tips: [
      'Derive `backdropFilter` from a `MotionValue` via a nested `useTransform`, not a plain string — Safari needs the blur value to update continuously, not jump.',
      'Keep the scroll range small (80–150px) — a collapse that takes 500px of scrolling feels sluggish rather than responsive.',
      'Pair the header height transform with a `layout` shift on the content below it, or use `padding-top` on the body so content doesn\'t jump under the sticky header.',
    ],
    fr: {
      title: 'Réduction d\'en-tête au scroll',
      tagline: 'Un en-tête collant rétrécit, se floute et estompe son sous-titre au défilement de la page',
      concept: 'Un en-tête réductible lie directement la hauteur d\'une barre de nav, le flou d\'arrière-plan et l\'opacité du sous-titre à la position de scroll plutôt qu\'à un point de rupture fixe. Au fur et à mesure que l\'utilisateur défile, l\'en-tête se comprime progressivement — cela libère de l\'espace vertical pour le contenu tout en gardant la navigation accessible. C\'est un pattern natif du web : il dépend d\'une position de scroll continue et de `backdrop-filter`, sans équivalent natif mobile direct (les apps natives utilisent plutôt la réduction de grand titre, un mécanisme différent).',
      howItWorks: [
        'Lire la progression du scroll avec une `MotionValue` (`useScroll` de Framer Motion) plutôt qu\'un écouteur d\'événement scroll — cela évite les re-renders à chaque pixel de défilement.',
        'Injecter cette `MotionValue` dans un ou plusieurs appels `useTransform` pour dériver hauteur, flou et opacité comme fonctions pures du décalage de scroll.',
        'Appliquer les valeurs dérivées directement comme props `style` sur un `motion.header` — Framer Motion les met à jour sur le thread du compositeur, sans passer par les re-renders React.',
        'Limiter la plage d\'entrée (ex. 0–120px de scroll) pour que la réduction se termine tôt et que l\'en-tête reste dans son état compact pour le reste du défilement.',
      ],
      useCases: [
        { label: 'Tableau de bord analytique', example: 'L\'en-tête du titre de page rétrécit et se floute pendant que l\'utilisateur défile un long rapport, gardant les filtres accessibles sans manger l\'espace écran.' },
        { label: 'Site de documentation', example: 'Une barre de nav de docs se compresse au scroll, échangeant sa tagline contre plus d\'espace de lecture tout en gardant la barre de recherche épinglée.' },
        { label: 'Article de blog', example: 'La barre de titre de l\'article se réduit en une fine barre de progression de lecture une fois que le lecteur dépasse la section hero.' },
      ],
      tips: [
        'Dériver `backdropFilter` d\'une `MotionValue` via un `useTransform` imbriqué, pas une simple chaîne — Safari a besoin que la valeur de flou se mette à jour en continu, pas par sauts.',
        'Garder la plage de scroll petite (80–150px) — une réduction qui prend 500px de scroll paraît lente plutôt que réactive.',
        'Associer le transform de hauteur de l\'en-tête à un décalage `layout` du contenu en dessous, ou utiliser `padding-top` sur le body pour que le contenu ne saute pas sous l\'en-tête collant.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  19. Magnetic Button                            */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'magnetic-button',
    title: 'Magnetic Button',
    category: 'Feedback',
    difficulty: 'Beginner',
    tagline: 'A button warps toward the cursor as it approaches, then springs back on leave',
    concept:
      'A magnetic button tracks the mouse position relative to its own bounding box and nudges its content toward the cursor within a small radius, as if pulled by a weak magnet. It\'s a pointer-driven micro-interaction — entirely dependent on continuous `mousemove` coordinates and hover state — so it has no real mobile equivalent (touch has no hover, no proximity signal). It is one of the cheapest ways to make a CTA feel alive.',
    howItWorks: [
      'Attach a `mousemove` listener to the button itself, and compute the cursor\'s offset from the button\'s center on every event.',
      'Scale that offset down (e.g. multiply by 0.3–0.4) so the button moves a fraction of the actual cursor displacement — a subtle pull, not a 1:1 drag.',
      'Feed the scaled offset into a `useSpring` (or CSS spring-based transition) so the button eases toward the target position rather than snapping.',
      'On `mouseleave`, reset the offset to `{ x: 0, y: 0 }` — the same spring animates it back to rest.',
    ],
    implementations: [
      {
        platform: 'react',
        deps: ['framer-motion'],
        notes: 'The spring config controls the "magnet strength" — higher stiffness snaps back faster, lower damping adds a slight overshoot wobble.',
        code: `import { motion, useSpring } from 'framer-motion'
import { useRef } from 'react'

export function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = ref.current!.getBoundingClientRect()
    const relX = e.clientX - (rect.left + rect.width / 2)
    const relY = e.clientY - (rect.top + rect.height / 2)
    x.set(relX * 0.35)
    y.set(relY * 0.35)
  }

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="magnetic-btn"
    >
      {children}
    </motion.button>
  )
}`,
      },
      {
        platform: 'nextjs',
        deps: ['framer-motion'],
        notes: 'Add `\'use client\'` since the component relies on `mousemove` events and refs, which only exist in the browser.',
        code: `'use client'
import { motion, useSpring } from 'framer-motion'
import { useRef } from 'react'

export function MagneticButton({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })
  const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })

  return (
    <motion.button
      ref={ref}
      style={{ x, y }}
      onMouseMove={(e) => {
        const rect = ref.current!.getBoundingClientRect()
        x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35)
        y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      className="magnetic-btn"
    >
      {children}
    </motion.button>
  )
}`,
      },
      {
        platform: 'angular',
        deps: [],
        notes: 'Raw `mousemove`/`mouseleave` `@HostListener` bindings compute the same offset math as the React version — Angular has no motion-value spring primitive, so a CSS `transition` with an overshoot cubic-bezier approximates the spring pull-back.',
        code: `import { Component, ElementRef, HostListener } from '@angular/core'

@Component({
  selector: 'app-magnetic-button',
  template: \`<button #btn class="magnetic-btn" [style.transform]="'translate(' + x + 'px, ' + y + 'px)'">
    <ng-content />
  </button>\`,
  styles: [\`
    .magnetic-btn { transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1); }
    .magnetic-btn.tracking { transition: none; }
  \`],
})
export class MagneticButtonComponent {
  x = 0
  y = 0

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    const rect = this.el.nativeElement.getBoundingClientRect()
    this.x = (e.clientX - (rect.left + rect.width / 2)) * 0.35
    this.y = (e.clientY - (rect.top + rect.height / 2)) * 0.35
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.x = 0
    this.y = 0
  }
}`,
      },
      {
        platform: 'swiftui',
        deps: [],
        notes: 'True finger-touch has no hover or proximity signal, so this pattern only makes sense on iPadOS with a trackpad or Apple Pencil hover — `.onContinuousHover` reports pointer position before contact, the nearest iOS equivalent to a `mousemove` event. On iPhone, skip this pattern entirely.',
        code: `import SwiftUI

struct MagneticButton<Content: View>: View {
    @ViewBuilder let content: Content
    @State private var offset: CGSize = .zero

    var body: some View {
        Button(action: {}) { content }
            .offset(offset)
            .onContinuousHover { phase in
                switch phase {
                case .active(let location):
                    // location is relative to the view's own bounds
                    let dx = location.x - 22 // approx half button width
                    let dy = location.y - 22
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                        offset = CGSize(width: dx * 0.35, height: dy * 0.35)
                    }
                case .ended:
                    withAnimation(.spring(response: 0.3, dampingFraction: 0.6)) {
                        offset = .zero
                    }
                }
            }
    }
}

// Note: .onContinuousHover only fires on iPadOS with a trackpad/mouse,
// or with Apple Pencil hover on supported iPads — it never fires from
// direct finger touch, since touch has no "approaching" phase to report.`,
      },
    ],
    useCases: [
      { label: 'Hero CTA', example: 'A "Get started" button on a landing page pulls gently toward the cursor as visitors approach it, drawing the click.' },
      { label: 'Portfolio nav dot', example: 'Circular navigation dots in a portfolio site warp toward the pointer, reinforcing a playful, crafted feel.' },
      { label: 'Icon-only action button', example: 'A floating action button in a web app tool follows the cursor within a small radius before triggering its click.' },
    ],
    tips: [
      'Cap the pull radius by only attaching the listener within a slightly larger invisible wrapper — outside that zone the button should sit still, not drift from anywhere on screen.',
      'Keep the multiplier under 0.4; anything higher makes the button feel like it\'s chasing the cursor rather than being pulled by it.',
      'Combine with a `scale` bump on hover for extra tactility, but keep it under 1.05 — magnetic buttons are about position, not size.',
    ],
    fr: {
      title: 'Bouton magnétique',
      tagline: 'Un bouton se déforme vers le curseur quand il s\'approche, puis rebondit à son départ',
      concept: 'Un bouton magnétique suit la position de la souris relative à sa propre boîte englobante et pousse son contenu vers le curseur dans un petit rayon, comme attiré par un aimant faible. C\'est une micro-interaction pilotée par le pointeur — entièrement dépendante des coordonnées `mousemove` continues et de l\'état de survol — donc sans réel équivalent mobile (le tactile n\'a ni survol ni signal de proximité). C\'est l\'un des moyens les moins chers de donner vie à un CTA.',
      howItWorks: [
        'Attacher un écouteur `mousemove` au bouton lui-même, et calculer le décalage du curseur par rapport au centre du bouton à chaque événement.',
        'Réduire ce décalage (ex. multiplier par 0.3–0.4) pour que le bouton se déplace d\'une fraction du déplacement réel du curseur — une traction subtile, pas un drag 1:1.',
        'Injecter le décalage réduit dans un `useSpring` (ou une transition CSS basée sur un spring) pour que le bouton glisse vers la position cible plutôt que de s\'y téléporter.',
        'Sur `mouseleave`, remettre le décalage à `{ x: 0, y: 0 }` — le même spring l\'anime de retour au repos.',
      ],
      useCases: [
        { label: 'CTA hero', example: 'Un bouton "Get started" sur une landing page tire doucement vers le curseur quand les visiteurs s\'en approchent, attirant le clic.' },
        { label: 'Point de nav de portfolio', example: 'Des points de navigation circulaires dans un site portfolio se déforment vers le pointeur, renforçant une sensation ludique et soignée.' },
        { label: 'Bouton d\'action icône seule', example: 'Un bouton d\'action flottant dans un outil web suit le curseur dans un petit rayon avant de déclencher son clic.' },
      ],
      tips: [
        'Limiter le rayon de traction en n\'attachant l\'écouteur que dans un wrapper invisible légèrement plus grand — en dehors de cette zone, le bouton doit rester immobile, pas dériver depuis n\'importe où à l\'écran.',
        'Garder le multiplicateur sous 0.4 ; au-delà, le bouton donne l\'impression de courir après le curseur plutôt que d\'être attiré par lui.',
        'Combiner avec un `scale` léger au survol pour plus de tactilité, mais rester sous 1.05 — les boutons magnétiques concernent la position, pas la taille.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  20. Swipe to Delete                            */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'swipe-to-delete',
    title: 'Swipe to Delete',
    category: 'List',
    difficulty: 'Intermediate',
    tagline: 'Drag a list row left to reveal a delete action, release past a threshold to confirm',
    concept:
      'Swipe-to-delete is a native mobile list gesture: dragging a row horizontally reveals a destructive action underneath, and releasing past a distance threshold commits to deleting the row with a spring collapse. It relies on a continuous pan gesture recognizer tied to the OS touch system — there is no equivalent trackpad/mouse convention on the web, making this a defining mobile-only interaction pattern.',
    howItWorks: [
      'Wrap each row in a pan gesture handler that only responds to horizontal drags, so vertical list scrolling still works undisturbed.',
      'Translate the row by the gesture\'s horizontal delta in real time, and reveal a red delete background clipped behind it as it slides.',
      'On release, compare the final offset against a threshold (commonly 30–40% of row width). Past it, animate the row fully off-screen and collapse its height to zero; under it, spring back to rest.',
      'Run the actual list-item removal (e.g. filtering it out of state) only after the collapse animation completes, using a completion callback — never mutate state mid-gesture.',
    ],
    implementations: [
      {
        platform: 'react-native',
        deps: ['react-native-gesture-handler', 'react-native-reanimated'],
        notes: 'Reanimated\'s `useAnimatedStyle` reads shared values on the UI thread, so the row translates at 60fps even while the JS thread is busy.',
        code: `import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS,
} from 'react-native-reanimated'
import { View, Text, StyleSheet } from 'react-native'

const SWIPE_THRESHOLD = -100

function SwipeableRow({ item, onDelete }) {
  const translateX = useSharedValue(0)
  const rowHeight = useSharedValue(64)

  const pan = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      translateX.value = Math.min(0, e.translationX)
    })
    .onEnd(() => {
      if (translateX.value < SWIPE_THRESHOLD) {
        translateX.value = withTiming(-400, { duration: 200 })
        rowHeight.value = withTiming(0, { duration: 200 }, (finished) => {
          if (finished) runOnJS(onDelete)(item.id)
        })
      } else {
        translateX.value = withSpring(0, { stiffness: 300, damping: 26 })
      }
    })

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    height: rowHeight.value,
  }))

  return (
    <View style={styles.rowWrapper}>
      <View style={styles.deleteBackground}>
        <Text style={styles.deleteText}>Delete</Text>
      </View>
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.row, rowStyle]}>
          <Text style={styles.title}>{item.title}</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  )
}

const styles = StyleSheet.create({
  rowWrapper: { overflow: 'hidden' },
  row: { backgroundColor: '#fff', padding: 16, justifyContent: 'center' },
  deleteBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E5484D', justifyContent: 'center', alignItems: 'flex-end', paddingRight: 24,
  },
  deleteText: { color: '#fff', fontWeight: '600' },
  title: { fontSize: 15 },
})`,
      },
      {
        platform: 'angular',
        deps: [],
        notes: 'No trackpad/mouse convention makes this feel natural on desktop, but touch web (mobile Safari/Chrome) does support it — raw `pointerdown`/`pointermove`/`pointerup` bindings replicate the same threshold-and-collapse logic as the React Native version.',
        code: `import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-swipeable-row',
  template: \`
    <div class="row-wrapper">
      <div class="delete-bg"><span>Delete</span></div>
      <div class="row" [style.transform]="'translateX(' + translateX + 'px)'"
           [style.height.px]="rowHeight"
           (pointerdown)="onDown($event)" (pointermove)="onMove($event)" (pointerup)="onUp()">
        {{ item.title }}
      </div>
    </div>
  \`,
  styles: [\`
    .row-wrapper { position: relative; overflow: hidden; }
    .row { background: #fff; padding: 16px; transition: transform 0.2s, height 0.2s; touch-action: pan-y; }
    .delete-bg { position: absolute; inset: 0; background: #E5484D; display: flex;
      align-items: center; justify-content: flex-end; padding-right: 24px; color: #fff; }
  \`],
})
export class SwipeableRowComponent {
  @Input() item!: { id: string; title: string }
  @Output() deleted = new EventEmitter<string>()

  translateX = 0
  rowHeight = 64
  private startX = 0
  private dragging = false

  onDown(e: PointerEvent) { this.dragging = true; this.startX = e.clientX - this.translateX }
  onMove(e: PointerEvent) {
    if (!this.dragging) return
    this.translateX = Math.min(0, e.clientX - this.startX)
  }
  onUp() {
    this.dragging = false
    if (this.translateX < -100) {
      this.translateX = -400
      this.rowHeight = 0
      setTimeout(() => this.deleted.emit(this.item.id), 200)
    } else {
      this.translateX = 0
    }
  }
}`,
      },
      {
        platform: 'swiftui',
        deps: [],
        notes: 'iOS ships this exact pattern as a first-class list modifier — `.swipeActions()` on a `List` row handles the drag, threshold, and destructive-action reveal natively, with none of the manual gesture math every other platform needs.',
        code: `import SwiftUI

struct SwipeableList: View {
    @State private var items = [
        (id: "1", title: "Design review"),
        (id: "2", title: "Update docs"),
        (id: "3", title: "Fix bug #42"),
    ]

    var body: some View {
        List {
            ForEach(items, id: \\.id) { item in
                Text(item.title)
                    .swipeActions(edge: .trailing) {
                        Button(role: .destructive) {
                            withAnimation { items.removeAll { $0.id == item.id } }
                        } label: {
                            Label("Delete", systemImage: "trash")
                        }
                    }
            }
        }
    }
}

// .swipeActions handles the drag distance threshold, the spring
// collapse, and the red destructive background automatically —
// no GestureDetector, no manual translateX, no runOnJS equivalent.`,
      },
    ],
    useCases: [
      { label: 'Mail inbox', example: 'Swiping an email left reveals Archive and Delete actions, a pattern users expect from every native mail client.' },
      { label: 'Todo list', example: 'Swiping a task row left past the threshold deletes it immediately with a satisfying collapse, no confirmation dialog needed for low-stakes items.' },
      { label: 'Notification center', example: 'Dismissing an individual notification by swiping it away, matching the OS-level notification tray behavior.' },
    ],
    tips: [
      'Set `activeOffsetX` on the pan gesture so small vertical scroll movements aren\'t hijacked as horizontal swipes — this is the #1 source of janky list feel.',
      'Never delete from state until the collapse animation\'s completion callback fires; deleting mid-swipe causes the row to unmount and snap instead of animating out.',
      'Show the delete background at full opacity as soon as any drag starts, not proportional to distance — a fading-in background reads as laggy rather than responsive.',
    ],
    fr: {
      title: 'Glisser pour supprimer',
      tagline: 'Glisser une ligne de liste vers la gauche révèle une action de suppression, relâcher au-delà d\'un seuil confirme',
      concept: 'Glisser-pour-supprimer est un geste de liste natif mobile : faire glisser une ligne horizontalement révèle une action destructrice en dessous, et relâcher au-delà d\'un seuil de distance valide la suppression de la ligne avec un effondrement en spring. Il repose sur un reconnaisseur de geste de pan continu lié au système tactile de l\'OS — il n\'existe pas de convention trackpad/souris équivalente sur le web, faisant de ce pattern une interaction définitivement propre au mobile.',
      howItWorks: [
        'Envelopper chaque ligne dans un gestionnaire de geste de pan qui ne répond qu\'aux glissements horizontaux, pour que le défilement vertical de la liste continue de fonctionner sans perturbation.',
        'Translater la ligne selon le delta horizontal du geste en temps réel, et révéler un fond rouge de suppression découpé derrière elle pendant qu\'elle glisse.',
        'Au relâchement, comparer le décalage final à un seuil (généralement 30–40% de la largeur de la ligne). Au-delà, animer la ligne complètement hors écran et effondrer sa hauteur à zéro ; en-deçà, revenir au repos avec un spring.',
        'N\'exécuter la suppression réelle de l\'élément de liste (ex. le filtrer hors de l\'état) qu\'après la fin de l\'animation d\'effondrement, via un callback de complétion — ne jamais muter l\'état pendant le geste.',
      ],
      useCases: [
        { label: 'Boîte mail', example: 'Glisser un email vers la gauche révèle les actions Archiver et Supprimer, un pattern que les utilisateurs attendent de tout client mail natif.' },
        { label: 'Liste de tâches', example: 'Glisser une ligne de tâche vers la gauche au-delà du seuil la supprime immédiatement avec un effondrement satisfaisant, sans dialogue de confirmation nécessaire pour les éléments à faible enjeu.' },
        { label: 'Centre de notifications', example: 'Rejeter une notification individuelle en la glissant, correspondant au comportement du tiroir de notifications au niveau OS.' },
      ],
      tips: [
        'Définir `activeOffsetX` sur le geste de pan pour que les petits mouvements de scroll vertical ne soient pas détournés en glissements horizontaux — c\'est la source n°1 d\'une sensation de liste saccadée.',
        'Ne jamais supprimer de l\'état avant que le callback de complétion de l\'animation d\'effondrement ne se déclenche ; supprimer en plein geste fait démonter et sauter la ligne au lieu de l\'animer en sortie.',
        'Afficher le fond de suppression à pleine opacité dès qu\'un glissement commence, pas proportionnellement à la distance — un fond qui apparaît en fondu se lit comme lent plutôt que réactif.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  21. Bottom Sheet Snap Points                   */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'bottom-sheet-snap',
    title: 'Bottom Sheet Snap Points',
    category: 'Spring',
    difficulty: 'Intermediate',
    tagline: 'A draggable sheet that settles into fixed snap heights with spring physics',
    concept:
      'A snap-point bottom sheet is dragged freely along the vertical axis but always settles into one of a few predefined heights (e.g. peek, half, full) when released, rather than stopping wherever the finger lifted. The nearest snap point is chosen based on release position and velocity, then animated to with a spring. This is the defining mobile interaction pattern for maps, media players, and detail overlays — it has no direct web equivalent since it depends on a touch-driven drag gesture layered under other scrollable content.',
    howItWorks: [
      'Define snap points as a set of translateY offsets (e.g. `[height * 0.9, height * 0.4, 0]` for peek, half, and full).',
      'During the pan gesture, translate the sheet 1:1 with the finger, clamping so it can\'t be dragged past the topmost or bottommost snap point.',
      'On release, use the gesture\'s velocity as a tiebreaker: a fast upward flick snaps to the next point up even if the release position is closer to the current one.',
      'Animate to the chosen snap point with `withSpring`, and update an `initialSnap`-style shared value so the next gesture starts calculations from the sheet\'s actual resting position.',
    ],
    implementations: [
      {
        platform: 'react-native',
        deps: ['react-native-gesture-handler', 'react-native-reanimated'],
        notes: 'This mirrors the internals of libraries like `@gorhom/bottom-sheet` — those add virtualized content and backdrop handling, but the snap-point math is exactly this.',
        code: `import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring, runOnJS,
} from 'react-native-reanimated'
import { Dimensions, View, StyleSheet } from 'react-native'

const SCREEN_HEIGHT = Dimensions.get('window').height
const SNAP_POINTS = [SCREEN_HEIGHT * 0.9, SCREEN_HEIGHT * 0.4, SCREEN_HEIGHT * 0.08] // peek, half, full

function BottomSheet({ children }) {
  const translateY = useSharedValue(SNAP_POINTS[0])
  const startY = useSharedValue(0)

  function nearestSnap(y: number, velocityY: number) {
    'worklet'
    const projected = y + velocityY * 0.15
    return SNAP_POINTS.reduce((closest, point) =>
      Math.abs(point - projected) < Math.abs(closest - projected) ? point : closest
    )
  }

  const pan = Gesture.Pan()
    .onStart(() => { startY.value = translateY.value })
    .onUpdate((e) => {
      const next = startY.value + e.translationY
      translateY.value = Math.max(SNAP_POINTS[SNAP_POINTS.length - 1], Math.min(SNAP_POINTS[0], next))
    })
    .onEnd((e) => {
      const target = nearestSnap(translateY.value, e.velocityY)
      translateY.value = withSpring(target, { stiffness: 260, damping: 30 })
    })

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }))

  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[styles.sheet, sheetStyle]}>
        <View style={styles.handle} />
        {children}
      </Animated.View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute', left: 0, right: 0, top: 0, height: SCREEN_HEIGHT,
    backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: -4 },
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: '#D0D0D5', alignSelf: 'center', marginVertical: 10 },
})`,
      },
      {
        platform: 'angular',
        deps: [],
        notes: 'Mobile web (touch) can absolutely support this pattern — raw pointer events replicate the same clamp-drag-and-snap logic, with velocity computed manually between `pointermove` events since there is no gesture library to provide it.',
        code: `import { Component, HostListener } from '@angular/core'

const SNAP_POINTS = [0.9, 0.4, 0.08] // fraction of viewport height: peek, half, full

@Component({
  selector: 'app-bottom-sheet',
  template: \`
    <div class="sheet" [style.transform]="'translateY(' + translateY + 'px)'"
         (pointerdown)="onDown($event)">
      <div class="handle"></div>
      <ng-content />
    </div>
  \`,
  styles: [\`
    .sheet { position: fixed; left: 0; right: 0; bottom: 0; height: 100vh;
      background: #fff; border-radius: 20px 20px 0 0; box-shadow: 0 -4px 20px rgba(0,0,0,0.15); }
    .handle { width: 40px; height: 4px; border-radius: 2px; background: #D0D0D5; margin: 10px auto; }
  \`],
})
export class BottomSheetComponent {
  translateY = window.innerHeight * SNAP_POINTS[0]
  private startY = 0
  private lastY = 0
  private lastTime = 0
  private velocity = 0
  private dragging = false

  onDown(e: PointerEvent) {
    this.dragging = true
    this.startY = e.clientY - this.translateY
    this.lastY = e.clientY
    this.lastTime = e.timeStamp
  }

  @HostListener('document:pointermove', ['$event'])
  onMove(e: PointerEvent) {
    if (!this.dragging) return
    this.velocity = (e.clientY - this.lastY) / (e.timeStamp - this.lastTime)
    this.lastY = e.clientY
    this.lastTime = e.timeStamp
    const min = window.innerHeight * SNAP_POINTS[2]
    const max = window.innerHeight * SNAP_POINTS[0]
    this.translateY = Math.max(min, Math.min(max, e.clientY - this.startY))
  }

  @HostListener('document:pointerup')
  onUp() {
    this.dragging = false
    const projected = this.translateY + this.velocity * 150
    const points = SNAP_POINTS.map(f => window.innerHeight * f)
    this.translateY = points.reduce((closest, p) =>
      Math.abs(p - projected) < Math.abs(closest - projected) ? p : closest)
  }
}`,
      },
      {
        platform: 'swiftui',
        deps: [],
        notes: 'Since iOS 16, `.presentationDetents()` on a `.sheet()` gives snap-point behavior as a one-line modifier — no gesture handling, no velocity math, no manual clamping required at all.',
        code: `import SwiftUI

struct MapScreen: View {
    @State private var showSheet = true

    var body: some View {
        MapView()
            .sheet(isPresented: $showSheet) {
                SearchResultsSheet()
                    .presentationDetents([.height(80), .medium, .large])
                    .presentationDragIndicator(.visible)
                    .interactiveDismissDisabled()
            }
    }
}

struct SearchResultsSheet: View {
    var body: some View {
        List(0..<10) { i in
            Text("Result \\(i)")
        }
    }
}

// .presentationDetents([.height(80), .medium, .large]) is the peek/half/full
// equivalent — the system handles drag, velocity-aware snapping, and the
// spring settle animation entirely internally.`,
      },
    ],
    useCases: [
      { label: 'Maps app', example: 'A search-results sheet peeks over the map, and a swipe up expands it to half or full screen for browsing results.' },
      { label: 'Media player', example: 'A mini player docked at the bottom expands into a full "Now Playing" screen when dragged up.' },
      { label: 'Product detail overlay', example: 'An e-commerce app shows a peeking product summary sheet that snaps to full detail on swipe-up.' },
    ],
    tips: [
      'Always factor gesture velocity into the snap decision, not just release position — without it, fast flicks feel unresponsive because they snap to the nearest point rather than the intended one.',
      'Clamp `translateY` during the drag itself (not just on release) so the sheet never visibly overshoots past the topmost or bottommost snap point while dragging.',
      'Keep spring `damping` above 26 for sheets — a bouncy overshoot on a large surface like this reads as glitchy rather than delightful.',
    ],
    fr: {
      title: 'Points d\'ancrage de bottom sheet',
      tagline: 'Une feuille glissable qui se stabilise sur des hauteurs d\'ancrage fixes avec de la physique de spring',
      concept: 'Une bottom sheet à points d\'ancrage se glisse librement sur l\'axe vertical mais se stabilise toujours sur l\'une de quelques hauteurs prédéfinies (ex. aperçu, mi-hauteur, plein écran) au relâchement, plutôt que de s\'arrêter où le doigt s\'est levé. Le point d\'ancrage le plus proche est choisi selon la position et la vélocité au relâchement, puis animé avec un spring. C\'est le pattern d\'interaction mobile de référence pour les cartes, lecteurs média et superpositions de détail — sans équivalent web direct puisqu\'il dépend d\'un geste de glissement tactile superposé à d\'autres contenus scrollables.',
      howItWorks: [
        'Définir les points d\'ancrage comme un ensemble de décalages `translateY` (ex. `[height * 0.9, height * 0.4, 0]` pour aperçu, mi-hauteur et plein écran).',
        'Pendant le geste de pan, translater la feuille 1:1 avec le doigt, en limitant pour qu\'elle ne puisse pas être tirée au-delà du point d\'ancrage le plus haut ou le plus bas.',
        'Au relâchement, utiliser la vélocité du geste comme départage : un flick rapide vers le haut ancre au point suivant même si la position de relâchement est plus proche du point actuel.',
        'Animer vers le point d\'ancrage choisi avec `withSpring`, et mettre à jour une shared value de type `initialSnap` pour que le prochain geste calcule depuis la position de repos réelle de la feuille.',
      ],
      useCases: [
        { label: 'App de cartes', example: 'Une feuille de résultats de recherche apparaît en aperçu sur la carte, et un swipe vers le haut l\'étend en mi-hauteur ou plein écran pour parcourir les résultats.' },
        { label: 'Lecteur média', example: 'Un mini lecteur ancré en bas s\'étend en écran "En cours de lecture" complet quand on le glisse vers le haut.' },
        { label: 'Superposition de détail produit', example: 'Une app e-commerce affiche une feuille de résumé produit en aperçu qui s\'ancre au détail complet au swipe vers le haut.' },
      ],
      tips: [
        'Toujours intégrer la vélocité du geste dans la décision d\'ancrage, pas seulement la position de relâchement — sans cela, les flicks rapides paraissent peu réactifs car ils s\'ancrent au point le plus proche plutôt qu\'au point voulu.',
        'Limiter `translateY` pendant le glissement lui-même (pas seulement au relâchement) pour que la feuille ne dépasse jamais visiblement le point d\'ancrage le plus haut ou le plus bas pendant le drag.',
        'Garder l\'amortissement (`damping`) du spring au-dessus de 26 pour les feuilles — un rebond excessif sur une aussi grande surface se lit comme un bug plutôt que comme un plaisir.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  22. Implicit Animation (AnimatedContainer)     */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'implicit-animation',
    title: 'Implicit Animation',
    category: 'Morphing',
    difficulty: 'Beginner',
    tagline: 'Change a property, Flutter tweens it automatically — no controllers, no keyframes',
    concept:
      'Flutter\'s implicit animation widgets (`AnimatedContainer`, `AnimatedOpacity`, `AnimatedPadding`, and friends) animate automatically whenever their input properties change between rebuilds — there is no `AnimationController`, no explicit `Tween`, no `addListener`. You simply set new values on a stateful rebuild, and the widget interpolates from the old values to the new ones over the given duration and curve. This is architecturally unlike anything in React or the DOM: there\'s no CSS transition to declare and no animation library to import, because the interpolation is a built-in widget behavior.',
    howItWorks: [
      'Wrap the content in `AnimatedContainer` (or another `Animated*` widget) and give it a `duration` and `curve`.',
      'Read animatable properties (`color`, `width`, `height`, `borderRadius`, `padding`, ...) from local state instead of hardcoding them.',
      'Call `setState` to change that state — Flutter diffs the new widget against the old one and detects that an `AnimatedContainer`\'s properties changed.',
      'The widget\'s internal `AnimatedContainerState` builds an implicit `Tween` for each changed property and drives it forward over `duration`, calling `setState` on every tick to repaint — all of this is invisible to your code.',
    ],
    implementations: [
      {
        platform: 'flutter',
        deps: [],
        notes: 'No extra packages — every `Animated*` implicit widget ships in the Flutter SDK\'s `material`/`widgets` libraries.',
        code: `import 'package:flutter/material.dart';

class ExpandingCard extends StatefulWidget {
  @override
  State<ExpandingCard> createState() => _ExpandingCardState();
}

class _ExpandingCardState extends State<ExpandingCard> {
  bool _expanded = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () => setState(() => _expanded = !_expanded),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeOutCubic,
        width: _expanded ? 320 : 160,
        height: _expanded ? 200 : 90,
        padding: EdgeInsets.all(_expanded ? 24 : 12),
        decoration: BoxDecoration(
          color: _expanded ? const Color(0xFF7C3AED) : const Color(0xFFE9E4FB),
          borderRadius: BorderRadius.circular(_expanded ? 24 : 12),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(_expanded ? 0.2 : 0.05),
              blurRadius: _expanded ? 24 : 6,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: AnimatedDefaultTextStyle(
          duration: const Duration(milliseconds: 350),
          style: TextStyle(
            color: _expanded ? Colors.white : Colors.black87,
            fontSize: _expanded ? 20 : 14,
            fontWeight: FontWeight.w600,
          ),
          child: const Text('Tap to expand'),
        ),
      ),
    );
  }
}`,
      },
      {
        platform: 'angular',
        deps: [],
        notes: 'Angular has no implicit-animation widget system like Flutter — the closest equivalent is binding animatable CSS properties to component state and declaring a `transition` rule once. The interpolation still comes from the browser\'s CSS engine, not from Angular itself.',
        code: `import { Component } from '@angular/core'

@Component({
  selector: 'app-expanding-card',
  template: \`
    <div class="card" [class.expanded]="expanded" (click)="expanded = !expanded">
      <span>Tap to expand</span>
    </div>
  \`,
  styles: [\`
    .card {
      width: 160px; height: 90px; padding: 12px;
      background: #E9E4FB; border-radius: 12px;
      display: flex; align-items: flex-end;
      transition: width 350ms cubic-bezier(0.22,1,0.36,1),
                  height 350ms cubic-bezier(0.22,1,0.36,1),
                  background 350ms, border-radius 350ms, padding 350ms;
    }
    .card span { color: #3a2e6e; font-size: 14px; font-weight: 600; transition: color 350ms, font-size 350ms; }
    .card.expanded { width: 320px; height: 200px; padding: 24px; background: #7C3AED; border-radius: 24px; }
    .card.expanded span { color: #fff; font-size: 20px; }
  \`],
})
export class ExpandingCardComponent {
  expanded = false
}

// Unlike Flutter, there is no single widget that "owns" the interpolation —
// toggling the .expanded class just changes computed style values, and the
// CSS transition property (declared once) is what actually animates them.`,
      },
      {
        platform: 'swiftui',
        deps: [],
        notes: 'SwiftUI\'s own implicit animation system — `.animation(_:value:)` — is architecturally the closest real parallel to Flutter\'s `AnimatedContainer` of any platform here: both interpolate automatically whenever a bound value changes, with no explicit `AnimationController`/timeline object required.',
        code: `import SwiftUI

struct ExpandingCard: View {
    @State private var expanded = false

    var body: some View {
        VStack(alignment: .leading) {
            Spacer()
            Text("Tap to expand")
                .font(.system(size: expanded ? 20 : 14, weight: .semibold))
                .foregroundStyle(expanded ? .white : Color(hex: "3a2e6e"))
        }
        .padding(expanded ? 24 : 12)
        .frame(width: expanded ? 320 : 160, height: expanded ? 200 : 90, alignment: .bottomLeading)
        .background(expanded ? Color(hex: "7C3AED") : Color(hex: "E9E4FB"))
        .clipShape(RoundedRectangle(cornerRadius: expanded ? 24 : 12))
        .onTapGesture { expanded.toggle() }
        .animation(.timingCurve(0.22, 1, 0.36, 1, duration: 0.35), value: expanded)
    }
}

// Just like AnimatedContainer, there is no AnimationController here —
// .animation(_:value:) watches expanded and interpolates every
// dependent modifier (frame, padding, background, clipShape) automatically
// whenever it changes, exactly mirroring Flutter's implicit-widget model.`,
      },
    ],
    useCases: [
      { label: 'Expandable card', example: 'A settings card grows in place to reveal more options when tapped, tweening size, color, and radius together.' },
      { label: 'Selection state', example: 'A chip or filter pill animates its background color and border smoothly when toggled selected/unselected.' },
      { label: 'Loading-to-content swap', example: 'A skeleton box animates its color and opacity into the real content once data has loaded, using `AnimatedOpacity` layered under `AnimatedContainer`.' },
    ],
    tips: [
      'If you need to run an animation without a state-changing trigger (e.g. an infinite loop, or a gesture-driven scrub), switch to explicit `AnimationController`-based widgets instead — implicit widgets only react to rebuilds.',
      'Multiple implicit widgets nested together (like `AnimatedContainer` + `AnimatedDefaultTextStyle`) will animate independently on their own `duration`/`curve` — keep them equal unless you deliberately want a staggered feel.',
      'Avoid putting expensive widgets (large images, complex layouts) directly inside an `AnimatedContainer` that resizes — cache or const-ify children where possible since the container rebuilds every tick.',
    ],
    fr: {
      title: 'Animation implicite',
      tagline: 'Changez une propriété, Flutter l\'interpole automatiquement — sans contrôleur, sans keyframes',
      concept: 'Les widgets d\'animation implicite de Flutter (`AnimatedContainer`, `AnimatedOpacity`, `AnimatedPadding`, et consorts) s\'animent automatiquement dès que leurs propriétés d\'entrée changent entre deux rebuilds — pas d\'`AnimationController`, pas de `Tween` explicite, pas d\'`addListener`. On se contente de définir de nouvelles valeurs lors d\'un rebuild stateful, et le widget interpole des anciennes valeurs vers les nouvelles sur la durée et la courbe données. C\'est architecturalement différent de tout ce qui existe en React ou dans le DOM : il n\'y a aucune transition CSS à déclarer et aucune bibliothèque d\'animation à importer, car l\'interpolation est un comportement natif du widget.',
      howItWorks: [
        'Envelopper le contenu dans `AnimatedContainer` (ou un autre widget `Animated*`) et lui donner une `duration` et une `curve`.',
        'Lire les propriétés animables (`color`, `width`, `height`, `borderRadius`, `padding`, ...) depuis l\'état local plutôt que de les coder en dur.',
        'Appeler `setState` pour changer cet état — Flutter compare le nouveau widget à l\'ancien et détecte que les propriétés d\'un `AnimatedContainer` ont changé.',
        'L\'`AnimatedContainerState` interne du widget construit un `Tween` implicite pour chaque propriété modifiée et le fait progresser sur la `duration`, appelant `setState` à chaque tick pour repeindre — tout cela est invisible dans votre code.',
      ],
      useCases: [
        { label: 'Carte extensible', example: 'Une carte de paramètres grandit sur place pour révéler plus d\'options au tap, interpolant taille, couleur et rayon ensemble.' },
        { label: 'État de sélection', example: 'Un chip ou une pastille de filtre anime sa couleur de fond et sa bordure en douceur au basculement sélectionné/désélectionné.' },
        { label: 'Transition chargement vers contenu', example: 'Une boîte squelette anime sa couleur et son opacité vers le contenu réel une fois les données chargées, via `AnimatedOpacity` superposé sous `AnimatedContainer`.' },
      ],
      tips: [
        'Pour une animation sans déclencheur de changement d\'état (ex. une boucle infinie, ou un scrub piloté par geste), passer plutôt à des widgets explicites basés sur `AnimationController` — les widgets implicites ne réagissent qu\'aux rebuilds.',
        'Plusieurs widgets implicites imbriqués (comme `AnimatedContainer` + `AnimatedDefaultTextStyle`) s\'animeront indépendamment sur leur propre `duration`/`curve` — les garder identiques sauf si un effet décalé est voulu délibérément.',
        'Éviter de placer des widgets coûteux (grandes images, layouts complexes) directement dans un `AnimatedContainer` qui se redimensionne — mettre en cache ou passer en `const` les enfants si possible, car le conteneur se reconstruit à chaque tick.',
      ],
    },
  },

  /* ─────────────────────────────────────────────── */
  /*  23. Flutter Staggered List                     */
  /* ─────────────────────────────────────────────── */
  {
    slug: 'staggered-list-flutter',
    title: 'Flutter Staggered List',
    category: 'List',
    difficulty: 'Intermediate',
    tagline: 'List items cascade in with per-item delay, driven by one shared AnimationController',
    concept:
      'A staggered list reveal animates each row in sequence rather than all at once, cascading down the screen. In Flutter this is built with a single `AnimationController` shared across all rows, where each row derives its own `Interval`-based `CurvedAnimation` from the same controller — one animation clock drives every item\'s individually-timed fade and slide. This differs fundamentally from the web version (independent per-element `transition-delay` or stagger helpers in a JS library): Flutter\'s approach keeps every row\'s timeline mathematically locked to a single source of truth.',
    howItWorks: [
      'Create one `AnimationController` in the list\'s parent `State`, with a duration long enough to cover the full cascade (e.g. 800ms for 8 rows).',
      'For each row at index `i`, build a `CurvedAnimation` using `Interval(i * stagger, i * stagger + itemDuration, curve: Curves.easeOut)` against the shared controller.',
      'Use that per-row `CurvedAnimation` to drive an `Opacity` + `Transform.translate` (or wrap with `FadeTransition`/`SlideTransition`) for that row\'s widget.',
      'Call `controller.forward()` once, in `initState` or when the list first becomes visible — every row animates on its own slice of the same timeline automatically.',
    ],
    implementations: [
      {
        platform: 'flutter',
        deps: [],
        notes: 'No package needed for the core technique — `flutter_staggered_animations` exists for a drop-in version, but implementing it directly teaches the `Interval` mechanism.',
        code: `import 'package:flutter/material.dart';

class StaggeredList extends StatefulWidget {
  final List<String> items;
  const StaggeredList({required this.items});

  @override
  State<StaggeredList> createState() => _StaggeredListState();
}

class _StaggeredListState extends State<StaggeredList>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    )..forward();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Animation<double> _intervalFor(int index) {
    final stagger = 1 / widget.items.length;
    final start = index * stagger * 0.6;
    final end = (start + stagger * 1.5).clamp(0.0, 1.0);
    return CurvedAnimation(
      parent: _controller,
      curve: Interval(start, end, curve: Curves.easeOutCubic),
    );
  }

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      itemCount: widget.items.length,
      itemBuilder: (context, i) {
        final animation = _intervalFor(i);
        return AnimatedBuilder(
          animation: animation,
          builder: (context, child) => Opacity(
            opacity: animation.value,
            child: Transform.translate(
              offset: Offset(0, 24 * (1 - animation.value)),
              child: child,
            ),
          ),
          child: ListTile(title: Text(widget.items[i])),
        );
      },
    );
  }
}`,
      },
      {
        platform: 'angular',
        deps: ['@angular/animations'],
        notes: 'Angular Animations\' `stagger()` inside a `query(\':enter\')` block is the framework-level equivalent of Flutter\'s per-row `Interval` — one trigger declaration replaces the manual `AnimationController` + `Interval` math entirely.',
        code: `import { trigger, transition, query, style, animate, stagger } from '@angular/animations'

export const staggeredList = trigger('staggeredList', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0, transform: 'translateY(24px)' }),
      stagger(50, animate('400ms cubic-bezier(0.22,1,0.36,1)',
        style({ opacity: 1, transform: 'translateY(0)' }))),
    ], { optional: true }),
  ]),
])

@Component({
  selector: 'app-staggered-list',
  template: \`
    <ul [@staggeredList]="items.length">
      <li *ngFor="let item of items">{{ item }}</li>
    </ul>
  \`,
  animations: [staggeredList],
})
export class StaggeredListComponent {
  items: string[] = []
  ngOnInit() { this.items = ['Notifications', 'Dark mode', 'Language', 'Privacy']; }
}`,
      },
      {
        platform: 'swiftui',
        deps: [],
        notes: 'Without a shared-controller concept, SwiftUI staggers by giving each row its own `.animation(value:)` with a per-index `.delay()` — architecturally closer to independent per-element delays (the web approach the Flutter concept explicitly contrasts itself against) than to Flutter\'s single-clock `Interval` system.',
        code: `import SwiftUI

struct StaggeredList: View {
    let items: [String]
    @State private var appeared = false

    var body: some View {
        List {
            ForEach(Array(items.enumerated()), id: \\.offset) { index, item in
                Text(item)
                    .opacity(appeared ? 1 : 0)
                    .offset(y: appeared ? 0 : 24)
                    .animation(
                        .timingCurve(0.22, 1, 0.36, 1, duration: 0.4)
                            .delay(Double(index) * 0.05),
                        value: appeared
                    )
            }
        }
        .onAppear { appeared = true }
    }
}

// Each row's .delay(index * 0.05) plays the same cascading role as
// Flutter's Interval(index * stagger, ...) — but here every row owns
// its own independent animation timeline instead of reading a slice
// of one shared AnimationController.`,
      },
    ],
    useCases: [
      { label: 'Onboarding checklist', example: 'A list of setup steps cascades in one by one as the onboarding screen first appears, drawing the eye down the list in order.' },
      { label: 'Search results', example: 'Result rows fade and slide in with a slight cascade after a search completes, softening the abrupt appearance of a full result set.' },
      { label: 'Settings screen', example: 'Grouped settings sections stagger into view on first load, giving the screen a sense of assembling rather than snapping into place.' },
    ],
    tips: [
      'Keep the total stagger duration proportional to list length, but cap it — beyond ~10-12 visible rows, stop increasing total duration and instead shrink the per-item stagger so a long list doesn\'t take seconds to finish animating.',
      'Only stagger on first appearance (e.g. gate with a `hasAnimated` flag), never on every rebuild — re-triggering the cascade on scroll or state changes reads as a bug, not a feature.',
      'Because every row shares one controller, this doesn\'t work well combined with lazy-loading (`ListView.builder` recycling): rows built after `forward()` has already progressed will appear instantly at full opacity instead of animating in.',
    ],
    fr: {
      title: 'Liste échelonnée Flutter',
      tagline: 'Les éléments de liste apparaissent en cascade avec un délai par élément, pilotés par un AnimationController partagé',
      concept: 'Une révélation de liste échelonnée anime chaque ligne en séquence plutôt que toutes à la fois, en cascade vers le bas de l\'écran. En Flutter, cela se construit avec un unique `AnimationController` partagé entre toutes les lignes, où chaque ligne dérive sa propre `CurvedAnimation` basée sur un `Interval` depuis ce même contrôleur — une seule horloge d\'animation pilote le fade et le slide individuellement chronométrés de chaque élément. Cela diffère fondamentalement de la version web (`transition-delay` indépendant par élément ou helpers de stagger dans une bibliothèque JS) : l\'approche de Flutter garde la timeline de chaque ligne mathématiquement verrouillée sur une source unique de vérité.',
      howItWorks: [
        'Créer un `AnimationController` dans le `State` parent de la liste, avec une durée assez longue pour couvrir toute la cascade (ex. 800ms pour 8 lignes).',
        'Pour chaque ligne à l\'index `i`, construire une `CurvedAnimation` en utilisant `Interval(i * stagger, i * stagger + itemDuration, curve: Curves.easeOut)` contre le contrôleur partagé.',
        'Utiliser cette `CurvedAnimation` par ligne pour piloter un `Opacity` + `Transform.translate` (ou envelopper avec `FadeTransition`/`SlideTransition`) pour le widget de cette ligne.',
        'Appeler `controller.forward()` une seule fois, dans `initState` ou quand la liste devient visible pour la première fois — chaque ligne s\'anime automatiquement sur sa propre tranche de la même timeline.',
      ],
      useCases: [
        { label: 'Checklist d\'onboarding', example: 'Une liste d\'étapes de configuration apparaît en cascade une par une à la première apparition de l\'écran d\'onboarding, guidant l\'œil le long de la liste dans l\'ordre.' },
        { label: 'Résultats de recherche', example: 'Les lignes de résultats apparaissent en fondu et glissent avec une légère cascade après une recherche, adoucissant l\'apparition brutale d\'un jeu de résultats complet.' },
        { label: 'Écran de paramètres', example: 'Des sections de paramètres groupées apparaissent en cascade au premier chargement, donnant à l\'écran une sensation d\'assemblage plutôt que d\'apparition brutale.' },
      ],
      tips: [
        'Garder la durée totale de cascade proportionnelle à la longueur de la liste, mais la plafonner — au-delà de ~10-12 lignes visibles, arrêter d\'augmenter la durée totale et réduire plutôt le décalage par élément pour qu\'une longue liste ne mette pas des secondes à finir de s\'animer.',
        'Ne déclencher la cascade qu\'à la première apparition (ex. avec un flag `hasAnimated`), jamais à chaque rebuild — redéclencher la cascade au scroll ou aux changements d\'état se lit comme un bug, pas une fonctionnalité.',
        'Comme chaque ligne partage un seul contrôleur, cela fonctionne mal combiné avec le lazy-loading (recyclage de `ListView.builder`) : les lignes construites après que `forward()` a déjà progressé apparaîtront instantanément à pleine opacité au lieu de s\'animer.',
      ],
    },
  },
]
