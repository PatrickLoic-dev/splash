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
      fr: { title: 'Ajouter la directive client', description: 'Dans l\'App Router, tout composant utilisant `useRef` ou `useInView` (APIs navigateur) doit déclarer `\'use client\'` en haut. Les Server Components peuvent toujours importer et utiliser ce composant — Next.js gère la frontière.' },
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
      fr: { title: 'Ajouter motion.div', description: 'Identique à l\'implémentation React. La directive `\'use client\'` en haut est la seule exigence spécifique à Next.js.' },
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
      fr: { title: 'Ajouter le glissement + easing', description: 'Ajouter le décalage `y` et l\'ease cubic-bezier. À ce stade, l\'animation se joue à chaque montage. Dans Next.js, les navigations dures remontent la page — les utilisateurs voient l\'animation à chaque arrivée.' },
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
      fr: { title: 'Connecter useInView + cascade', description: 'Exporter ce composant depuis un fichier dédié et l\'importer dans n\'importe quel Server Component — la frontière est implicite. La prop `delay` cascade les frères sans logique d\'orchestration supplémentaire.' },
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
      fr: { title: 'Div template simple', description: 'Afficher le contenu sans animation. En Vue 3, la balise `<template>` contient le balisage. Établir la mise en page correcte avant de toucher aux transitions.' },
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
      fr: { title: 'Lier l\'opacité à un flag réactif', description: 'Introduire un ref `isVisible` et lier `opacity` via `:style`. Mettre `isVisible` à true dans `onMounted` pour animer au montage. Ajouter une CSS `transition` pour le mouvement réel.' },
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
      fr: { title: 'Ajouter translateY', description: 'Ajouter `transform: translateY` à l\'objet de style lié. Utiliser la même chaîne cubic-bezier qu\'avec Framer Motion — CSS `transition` l\'accepte nativement.' },
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
      fr: { title: 'Déclenchement au scroll avec VueUse', description: '`useIntersectionObserver` de VueUse remplace le déclencheur `onMounted` manuel. L\'observateur se déclenche une fois quand l\'élément entre dans le viewport, puis se déconnecte (équivalent `{ once: true }` via `stop()`).' },
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
      fr: { title: 'View simple', description: 'Commencer avec un `View` standard. Dans React Native il n\'y a pas de DOM, donc pas d\'IntersectionObserver — l\'animation se déclenchera au layout (quand l\'élément est mesuré) plutôt qu\'au scroll.' },
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
      fr: { title: 'Créer des valeurs partagées', description: '`useSharedValue` crée des valeurs qui vivent sur le thread UI — les animations pilotées par elles ne passent jamais par le pont JS. Déclarer une valeur pour opacity et une pour translateY.' },
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
      fr: { title: 'Animer au layout', description: '`onLayout` se déclenche une fois quand l\'élément est mesuré et ajouté à l\'arbre de layout. Déclencher `withTiming` là — pas de setTimeout nécessaire. `useAnimatedStyle` s\'abonne aux changements de valeurs partagées sur le thread UI.' },
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
      fr: { title: 'Ajouter une prop delay pour la cascade', description: '`withDelay` enveloppe n\'importe quelle animation et la diffère du nombre de millisecondes donné. Passer une prop `delay` à chaque instance et le parent contrôle la cascade — pas de hook stagger séparé nécessaire.' },
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
      fr: { title: 'Structure StatefulWidget', description: 'Les animations Flutter nécessitent un `StatefulWidget` pour que l\'`AnimationController` puisse être initialisé et libéré avec le cycle de vie du widget. Commencer par la structure — pas encore de logique d\'animation.' },
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
      fr: { title: 'Ajouter AnimationController + FadeTransition', description: '`AnimationController` pilote toutes les animations en Flutter — pensez-y comme l\'équivalent de `useMotionValue(0)` → animer vers 1. `FadeTransition` s\'abonne à l\'animation et gère l\'opacité.' },
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
      fr: { title: 'Ajouter SlideTransition', description: '`SlideTransition` anime la position comme un décalage fractionnaire de la taille propre du widget. `Offset(0, 0.1)` commence 10% en dessous — équivalent à `translateY: 32px` sur un élément de 320px.' },
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
      fr: { title: 'Ajouter un délai pour la cascade', description: '`Future.delayed` diffère l\'appel `forward()` du contrôleur. La vérification `mounted` empêche d\'appeler `forward()` si le widget a été libéré avant la fin du délai — important pour la navigation rapide.' },
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
      fr: { title: 'Changement d\'état instantané', description: 'Deux vues contrôlées par un `useState`. Changer l\'état remplace immédiatement un composant par un autre — sans animation. C\'est la base que nous allons améliorer.' },
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
      fr: { title: 'Envelopper dans AnimatePresence', description: '`AnimatePresence` surveille ses enfants pour les démontages et exécute leur animation `exit` avant de les supprimer du DOM. Sans prop `exit` sur les enfants, il n\'y a toujours pas d\'animation visible — mais la plomberie est en place.' },
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
      fr: { title: 'Ajouter initial + exit à la page', description: 'Chaque composant de page devient un `motion.div` avec `initial`, `animate` et `exit`. La prop `key` est cruciale — React l\'utilise pour identifier quel enfant a changé, et `AnimatePresence` s\'en sert pour déclencher l\'entrée/sortie.' },
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
      fr: { title: 'Ajouter mode="wait" et glissement directionnel', description: '`mode="wait"` fait terminer l\'animation de sortie avant que l\'animation d\'entrée commence — évite que deux pages se superposent. Ajouter un décalage `y` rend l\'échange directionnel : l\'ancienne page glisse vers le haut, la nouvelle arrive par le bas.' },
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
      fr: { title: 'RouterView instantané', description: '`<RouterView>` affiche le composant de la route actuelle. Par défaut, le changement de route est instantané — l\'ancien composant est démonté et le nouveau est monté dans le même tick.' },
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
      fr: { title: 'Envelopper RouterView dans Transition', description: 'Le composant `<Transition>` de Vue enveloppe l\'élément entrant/sortant et applique des classes CSS à chaque phase. La prop `name` préfixe tous les noms de classe : `page-enter-from`, `page-leave-to`, etc.' },
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
      fr: { title: 'Ajouter les classes de transition CSS', description: 'Appliquer `transition` dans les classes `-active` et les états de début/fin dans `-from` / `-to`. Vue applique ces classes pendant les phases d\'entrée/sortie, et CSS réalise l\'animation réelle.' },
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
      fr: { title: 'Ajouter mode="out-in" pour éviter le chevauchement', description: '`mode="out-in"` indique à Vue d\'attendre que le composant sortant termine son exit avant de monter celui qui entre — empêchant deux pages de se chevaucher en pleine transition. Passer le chemin de route comme `:key` pour que Vue détecte les changements de route avec le même composant.' },
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
      fr: { title: 'Navigateur Stack par défaut', description: 'Le navigateur Stack de React Navigation fournit déjà des transitions natives à la plateforme (glissement sur iOS, fondu vers le haut sur Android). Comprendre le comportement par défaut est important avant de personnaliser.' },
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
      fr: { title: 'Utiliser un interpolateur intégré', description: '`CardStyleInterpolators` fournit des courbes d\'animation prédéfinies. `forFadeFromCenter` donne un fondu enchaîné, `forHorizontalIOS` donne le glissement iOS natif. Pas de calcul personnalisé nécessaire.' },
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
      fr: { title: 'Écrire un interpolateur personnalisé', description: 'Un `cardStyleInterpolator` reçoit `current.progress` (0 → 1 à l\'entrée, 1 → 0 à la sortie) et les dimensions de l\'écran. Retourner un objet de style animé.' },
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
      fr: { title: 'Configurer le timing par transition', description: '`transitionSpec` permet de définir des vitesses différentes pour push (ouverture) et pop (fermeture). Fermer légèrement plus vite qu\'ouvrir paraît plus réactif — l\'utilisateur sait déjà où il va.' },
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
      fr: { title: 'Navigator.push avec la route par défaut', description: 'La `MaterialPageRoute` par défaut de Flutter glisse depuis le bas sur Android et depuis la droite sur iOS. C\'est la base — nous la remplacerons par une route personnalisée.' },
      code: `// Navigate with the default transition
Navigator.push(
  context,
  MaterialPageRoute(builder: (_) => const DetailScreen()),
);`,
    },
    {
      title: 'Replace with PageRouteBuilder',
      description: '`PageRouteBuilder` lets you define `transitionsBuilder`. The `animation` parameter is the controller (0 → 1 on enter). Returning `child` unchanged gives an instant transition — the hook is in place.',
      fr: { title: 'Remplacer par PageRouteBuilder', description: '`PageRouteBuilder` permet de définir `transitionsBuilder`. Le paramètre `animation` est le contrôleur (0 → 1 à l\'entrée). Retourner `child` inchangé donne une transition instantanée — le crochet est en place.' },
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
      fr: { title: 'Ajouter FadeTransition', description: '`FadeTransition` s\'abonne à l\'`animation` et définit l\'opacité du widget. `CurveTween` mappe la valeur linéaire 0–1 du contrôleur à travers une courbe pour un mouvement plus naturel.' },
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
      fr: { title: 'Combiner fondu + glissement en route réutilisable', description: 'Extraire dans une classe `FadeSlideRoute` pour l\'utiliser partout dans l\'app avec `Navigator.push(context, FadeSlideRoute(page: ...))` — pas de code répétitif au site d\'appel.' },
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
      fr: { title: 'Bouton HTML simple', description: 'Un `<button>` ordinaire — pas d\'animation. Le clic fonctionne, mais il n\'y a aucune confirmation visuelle que l\'appui a été enregistré. C\'est le problème que nous allons résoudre.' },
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
      fr: { title: 'Ajouter le retour whileTap', description: '`motion.button` remplace le bouton simple. `whileTap={{ scale: 0.94 }}` anime à 94% de sa taille pendant que le pointeur est maintenu et rebondit à la relâche. Le ratio stiffness/damping du spring détermine le rebond.' },
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
      fr: { title: 'Ajouter la lévitation whileHover', description: '`whileHover` s\'active quand le curseur survole l\'élément. Combiner un léger scale-up avec un décalage `y` négatif simule le bouton qui s\'élève de la surface — une ombre compléterait l\'illusion.' },
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
      fr: { title: 'Ajouter le glissement pour rejeter', description: '`drag="x"` active le glissement horizontal. `dragConstraints` définit la plage autorisée — `{ left: 0, right: 0 }` signifie que la carte veut toujours revenir au centre. `dragElastic` contrôle jusqu\'où elle peut s\'étirer au-delà de la contrainte.' },
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
      fr: { title: 'Pressable sans animation', description: '`Pressable` est l\'élément tactile moderne de RN — contrairement à `TouchableOpacity`, il n\'anime pas par défaut. Cela nous donne un contrôle total sur le retour visuel.' },
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
      fr: { title: 'Ajouter la mise à l\'échelle avec useSharedValue', description: '`useSharedValue(1)` crée une valeur d\'échelle sur le thread UI. `Gesture.Tap().onBegin()` la réduit ; `.onFinalize()` la ramène par ressort. Cela s\'exécute à 60fps sans toucher au thread JS.' },
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
      fr: { title: 'Appeler onPress depuis le thread UI', description: '`runOnJS` relie un appel de fonction JS depuis le thread UI. Sans lui, appeler `onPress()` dans un gestionnaire de geste Reanimated planterait — les callbacks JS doivent être invoqués avec `runOnJS`.' },
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
      fr: { title: 'Ajouter le glissement pour ignorer avec geste Pan', description: '`Gesture.Pan()` suit le mouvement de glissement. `onChange` met à jour `translateX` en temps réel ; `onEnd` vérifie la vitesse et le décalage pour décider d\'ignorer ou de revenir avec `withSpring(0)`.' },
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
      fr: { title: 'ElevatedButton simple', description: 'L\'`ElevatedButton` de Flutter a un effet ripple intégré. C\'est bien pour les apps Material, mais nous voulons une physique de ressort précise — nous le remplacerons par un widget de geste personnalisé.' },
      code: `ElevatedButton(
  onPressed: () {},
  child: const Text('Press me'),
)`,
    },
    {
      title: 'GestureDetector + press state',
      description: '`GestureDetector` catches `onTapDown`, `onTapUp`, and `onTapCancel`. The `AnimationController` drives the scale — `forward()` on press, `reverse()` on release.',
      fr: { title: 'GestureDetector + état d\'appui', description: '`GestureDetector` capte `onTapDown`, `onTapUp` et `onTapCancel`. L\'`AnimationController` pilote l\'échelle — `forward()` à l\'appui, `reverse()` au relâchement.' },
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
      fr: { title: 'Ajouter ScaleTransition', description: '`ScaleTransition` pilote `Transform.scale` depuis l\'animation. Un `Tween(begin: 1.0, end: 0.94)` mappe la valeur 0–1 du contrôleur à la plage d\'échelle 1–0.94. `Curves.elasticOut` à l\'envers donne la sensation de ressort.' },
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
      fr: { title: 'Ajouter Dismissible pour le glissement', description: '`Dismissible` est un widget Flutter natif qui gère le glissement pour ignorer. Utiliser `SpringButton` pour le retour tactile et `Dismissible` pour le glissement — les composer plutôt que de les réimplémenter.' },
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
      fr: { title: 'Divs superposés statiques', description: 'Deux couches — un arrière-plan et un premier plan — empilées avec `position: absolute`. Pas encore d\'animation. Établir `overflow: hidden` sur le conteneur maintenant ; l\'oublier cause un débordement de l\'arrière-plan quand on ajoute le mouvement.' },
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
      fr: { title: 'Connecter useScroll à la section', description: '`useScroll({ target: sectionRef })` crée une MotionValue `scrollYProgress` qui va de 0 (bas de la section entrant dans la fenêtre) à 1 (haut de la section quittant). À ce stade, on lit juste la valeur — aucun changement visuel encore.' },
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
      fr: { title: 'Appliquer le mouvement à l\'arrière-plan', description: '`useTransform` mappe le range 0–1 du scroll à des décalages en pixels. L\'arrière-plan reçoit une plage ±40px — petit, mais suffisant pour créer de la profondeur visible. L\'appliquer via `style={{ y: bgY }}` sur un `motion.div`.' },
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
      fr: { title: 'Ajouter une couche de premier plan à vitesse différente', description: 'Le premier plan bouge dans la direction opposée à l\'arrière-plan — c\'est ce qui crée la profondeur perçue. Deux couches se déplaçant à des vitesses différentes trompent le cortex visuel en lisant la distance.' },
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
      fr: { title: 'ScrollView avec une image d\'en-tête', description: 'Placer l\'image hero au-dessus du contenu défilable dans un `ScrollView`. Pas encore de parallax — juste la structure. Utiliser `overflow: hidden` sur le conteneur d\'image pour rogner le mouvement ensuite.' },
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
      fr: { title: 'Suivre le scroll avec Animated.event', description: '`Animated.event` mappe `nativeEvent.contentOffset.y` directement vers un `Animated.Value` — pas de pont JS pour chaque frame de scroll. `scrollEventThrottle={16}` se synchronise à ~60fps.' },
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
      fr: { title: 'Interpoler scrollY vers translateY', description: '`.interpolate()` mappe la position de scroll vers un translateY pour l\'image. Quand l\'utilisateur défile vers le bas (Y positif), l\'image remonte à seulement 0.3× de la vitesse — créant le décalage qui donne l\'impression de profondeur.' },
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
      fr: { title: 'Appliquer à Animated.Image', description: 'Remplacer l\'`Image` simple par `Animated.Image` et appliquer la transformation interpolée. L\'en-tête s\'estompe quand le contenu défile vers le haut — combiner avec l\'interpolation `headerOpacity` pour l\'effet complet.' },
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
      fr: { title: 'Structure CustomScrollView', description: '`CustomScrollView` avec `SliverAppBar` et `SliverToBoxAdapter` est l\'approche native de Flutter pour les en-têtes parallax. `SliverAppBar` gère le comportement de réduction.' },
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
      fr: { title: 'Activer le parallax intégré', description: '`collapseMode: CollapseMode.parallax` est tout ce dont vous avez besoin pour le parallax intégré de Flutter sur `FlexibleSpaceBar`. Le framework gère automatiquement le calcul des décalages.' },
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
      fr: { title: 'Parallax manuel avec ScrollController', description: 'Pour un parallax personnalisé sur du contenu non-SliverAppBar, attacher un `ScrollController` et reconstruire au scroll. Multiplier le décalage par un facteur < 1 pour ralentir la couche d\'arrière-plan.' },
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
      fr: { title: 'Encapsuler dans un widget réutilisable', description: 'Extraire dans un widget `ParallaxImage` qui prend les props `imageUrl` et `factor`. Un `factor` de 0 signifie que l\'image est fixe ; 1 signifie qu\'elle défile à pleine vitesse (pas de parallax) ; 0.3 est un bon défaut.' },
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
      fr: { title: 'Espace réservé gris statique', description: 'Un rectangle gris de la même taille que le vrai contenu. C\'est déjà mieux qu\'un spinner — l\'utilisateur peut voir que quelque chose arrive et où il apparaîtra.' },
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
      fr: { title: 'Ajouter l\'animation shimmer', description: 'Un `motion.div` positionné en absolu à l\'intérieur du squelette balaie de gauche à droite avec `animate={{ x: ["-100%", "100%"] }}`. Le dégradé crée l\'effet de lumière captée. Le `overflow: hidden` du parent le garde clipé.' },
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
      fr: { title: 'Composer en squelette de carte', description: 'Construire le squelette structurel de la vraie carte — même mise en page, mêmes proportions, mais chaque élément est un `<Skeleton>`. Un avatar étroit, deux courtes lignes de texte, une longue ligne.' },
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
      fr: { title: 'Remplacer par le vrai contenu au chargement', description: '`AnimatePresence mode="wait"` gère le remplacement squelette → contenu. Le squelette s\'estompe, puis le vrai contenu s\'estompe. L\'état `once` garantit que le remplacement ne se fait que dans un sens.' },
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
      fr: { title: 'Placeholder View gris', description: 'Un `View` simple avec un `backgroundColor` gris et les mêmes dimensions que le vrai contenu. Déjà mieux que rien — l\'utilisateur voit où le contenu apparaîtra.' },
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
      fr: { title: 'Ajouter le shimmer avec useSharedValue', description: '`withRepeat(withTiming(...), -1)` boucle l\'animation indéfiniment. `-1` signifie des répétitions infinies. La valeur anime de -1 à 1, correspondant à un décalage translateX.' },
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
      fr: { title: 'Appliquer le dégradé de surimpression', description: '`useAnimatedStyle` mappe la valeur shimmer vers `translateX`. Une surimpression `LinearGradient` se déplace sur la surface, créant l\'effet de balayage lumineux.' },
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
      fr: { title: 'Composer et basculer vers le contenu réel', description: 'Construire un `CardSkeleton` avec des primitives `Skeleton`, puis basculer conditionnellement vers le vrai `UserCard` quand les données arrivent. Utiliser `FadeIn` / `FadeOut` de Reanimated pour le basculement.' },
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
      fr: { title: 'Placeholder Container', description: 'Un `Container` avec une `decoration` grise et les dimensions cibles. Envelopper dans un `ClipRRect` pour les coins arrondis — cela rognera le dégradé shimmer que nous ajouterons ensuite.' },
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
      fr: { title: 'Ajouter AnimationController pour le shimmer', description: 'Un `AnimationController` en boucle pilote la position du shimmer de -1.5 à 2.5 (s\'étendant au-delà des bords du widget pour que le dégradé entre et sorte en douceur).' },
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
      fr: { title: 'Peindre le dégradé avec AnimatedBuilder', description: '`AnimatedBuilder` reconstruit uniquement la boîte décorée à chaque frame. Les alignements `begin` et `end` du `LinearGradient` se déplacent avec `_shimmer.value`, faisant bouger le reflet sur la surface.' },
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
      fr: { title: 'Composer et basculer avec AnimatedSwitcher', description: '`AnimatedSwitcher` gère le basculement squelette → contenu réel avec un fondu enchaîné. Le changement de clé sur l\'enfant déclenche la transition. Pas d\'`AnimationController` manuel nécessaire.' },
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
      fr: { title: 'Liste ul/li simple', description: 'Une liste HTML ordinaire. Tous les éléments s\'affichent simultanément sans transition. C\'est ce que nous améliorons — l\'apparition instantanée semble abrupte, surtout pour les longues listes.' },
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
      fr: { title: 'Ajouter l\'animation d\'opacité à chaque élément', description: 'Remplacer `li` par `motion.li` avec `initial={{ opacity: 0 }}` et `animate={{ opacity: 1 }}`. Tous les éléments s\'animent — mais ils s\'estompent tous exactement au même moment. Toujours pas de cascade.' },
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
      fr: { title: 'Ajouter staggerChildren avec des variantes', description: '`variants` permettent au parent (`motion.ul`) d\'orchestrer ses enfants. Définir `staggerChildren: 0.07` sur la `transition` du conteneur indique à Framer Motion de retarder chaque animation d\'enfant de 70ms. Les enfants n\'ont pas besoin de délais explicites — ils héritent de la variante parent.' },
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
      fr: { title: 'Déclencher au scroll avec useInView', description: '`useInView` sur le conteneur contrôle quand la prop `animate` passe de `"hidden"` à `"visible"`. `once: true` empêche de rejouer au retour du scroll. Le stagger s\'exécute toujours depuis le conteneur — aucune modification par élément nécessaire.' },
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
      fr: { title: 'FlatList sans animation', description: '`FlatList` virtualise les longues listes — affiche uniquement ce qui est visible. Toujours l\'utiliser pour les listes de plus de 20 éléments. Les listes courtes peuvent utiliser un `View` + `map` simple.' },
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
      fr: { title: 'Fondre chaque élément au montage', description: 'Remplacer le `View` interne par `Animated.View`. Utiliser `withTiming` dans `onLayout` — il se déclenche une fois quand chaque élément est rendu pour la première fois. Tous les éléments animent simultanément.' },
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
      fr: { title: 'Ajouter le glissement + cascade avec withDelay', description: '`withDelay(index * 70, ...)` décale chaque élément de 70ms × son index. L\'`index` vient du callback `renderItem` de `FlatList`. opacity et translateY s\'exécutent en parallèle.' },
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
      fr: { title: 'Limiter le délai pour les longues listes', description: 'Pour les listes avec beaucoup d\'éléments, une cascade sans limite fait attendre le dernier élément trop longtemps. Limiter le délai à 400ms pour que l\'animation paraisse énergique quelle que soit la longueur de la liste.' },
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
      fr: { title: 'Colonne de widgets simples', description: 'Une `Column` affiche tous les enfants simultanément. Chaque élément est un `Container` simple. C\'est la base — pas d\'animation, pas de cascade.' },
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
      fr: { title: 'Ajouter AnimationController pour un seul élément', description: 'Convertir un élément de liste en `StatefulWidget`. Un `SingleTickerProviderStateMixin` lui donne accès à `vsync`. Le contrôleur pilote un `FadeTransition` + `SlideTransition`.' },
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
      fr: { title: 'Cascade avec un seul contrôleur + Interval', description: 'Déplacer l\'`AnimationController` vers le widget de liste parent. Chaque élément utilise un `Interval` pour définir sa fenêtre dans la timeline 0–1 du parent — c\'est le pattern de cascade de Flutter.' },
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
      fr: { title: 'Ajouter le glissement + limiter le délai pour les longues listes', description: 'Ajouter un `SlideTransition` par élément en utilisant le même `Interval`. Limiter le décalage de départ pour que les éléments au-delà de l\'index ~5 n\'attendent pas trop longtemps. Supprimer l\'`AnimationController` brut de chaque élément — un seul contrôleur les dirige tous.' },
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
    fr: { title: 'Slides statiques', description: 'Afficher trois slides colorées dans un conteneur relatif. Pas encore d\'animation — juste la base de mise en page.' },
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
    fr: { title: 'AnimatePresence + glissement', description: 'Envelopper les slides dans `AnimatePresence` pour que la slide sortante quitte avant que la suivante entre. Ajouter l\'entrée/sortie sur l\'axe x pour que les cartes glissent depuis le bon bord.' },
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
    fr: { title: 'Profondeur de scale + overlay sombre', description: 'Ajouter `scale: 0.92` à l\'entrée pour que les slides zooment en arrivant. Ajouter un `motion.div` frère qui s\'estompe de opacity 0.5 à 0, créant l\'effet de révélation cinématique sombre.' },
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
    fr: { title: 'Glisser pour swiper + pastilles spring', description: 'Ajouter `drag="x"` avec un threshold de vélocité/offset pour que le swipe avance le carrousel. Remplacer les transitions CSS des pastilles par des springs `motion.div animate={{ width }}`.' },
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
    fr: { title: 'Slides statiques', description: "Ajouter `'use client'` en haut — les événements de drag et `useState` sont des APIs navigateur. Tout le reste est identique à l'implémentation React." },
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
    fr: { title: 'AnimatePresence + glissement', description: 'Importer framer-motion (déjà client-safe). La prop `custom` passe la direction à travers `AnimatePresence` vers les fonctions de variantes.' },
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
    fr: { title: 'Profondeur de scale + overlay sombre', description: 'Ajouter `scale: 0.92` à l\'entrée et le `motion.div` d\'overlay sombre. Exporter depuis `components/ImageCarousel.tsx` pour que n\'importe quelle page Server Component puisse l\'importer.' },
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
    fr: { title: 'Glisser pour swiper + pastilles spring', description: 'Ajouter `drag="x"` avec un threshold de vélocité. Dans Next.js App Router, placer dans `app/components/` — aucune configuration spéciale ; la frontière `"use client"` est auto-suffisante.' },
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
    fr: { title: 'Diapositives statiques', description: 'Afficher les diapositives avec un état de page réactif. Un gestionnaire de clic basique sur les points met à jour l\'index de page. Pas encore de transition — juste établir la structure des données et du template.' },
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
    fr: { title: 'TransitionGroup sensible à la direction', description: 'Utiliser un nom de transition calculé ("slide-left" ou "slide-right") pour que la diapositive entrante arrive du bon bord. TransitionGroup avec positionnement absolu permet à l\'entrée et à la sortie de se chevaucher.' },
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
    fr: { title: 'Surimpression sombre via keyframe', description: 'Ajouter un div .overlay dans chaque diapositive. Une animation CSS @keyframes le fait passer de 0.4 à 0 d\'opacité pendant que la diapositive se stabilise — la même révélation cinématographique que la version React.' },
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
    fr: { title: 'Glissement tactile + points animés', description: 'Écouter touchstart / touchend sur le div de diapositive. Quand le delta horizontal dépasse 50px, appeler go(). Animer la largeur des points avec un ressort CSS cubic-bezier pour l\'effet de pilule expansible.' },
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
    fr: { title: 'Diapositives statiques', description: 'Utiliser un FlatList avec défilement horizontal et pagingEnabled pour un comportement de capture de diapositive gratuit. Pas encore d\'animation — juste la fondation de layout.' },
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
    fr: { title: 'Suivre scrollX avec Animated.event', description: 'Passer à Animated.FlatList et transmettre scrollX à onScroll via Animated.event. useNativeDriver: true garde tout sur le thread UI — pas de goulot d\'étranglement du pont JS.' },
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
    fr: { title: 'Profondeur d\'échelle via interpolate', description: 'Pour chaque diapositive, interpoler scrollX sur les positions de page [précédente, actuelle, suivante] → échelle [0.92, 1, 0.92]. Animated.View enveloppe le contenu de la diapositive et reçoit la transformation.' },
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
    fr: { title: 'Surimpression sombre + indicateurs de points animés', description: 'Ajouter un View de surimpression dont l\'opacité est également interpolée depuis scrollX — 0.5 sur les voisins, 0 sur la diapositive active. Piloter la largeur des points de la même façon pour l\'effet de pilule expansible.' },
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
    fr: { title: 'Diapositives statiques', description: 'Utiliser PageView.builder comme fondation. Un StatefulWidget simple suit la page actuelle via un listener sur PageController pour que les points reflètent la position.' },
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
    fr: { title: 'Indicateurs de points', description: 'Ajouter un Stack pour superposer les indicateurs de points. Utiliser AnimatedContainer pour que la largeur de chaque point anime entre 6 et 20 quand _page change.' },
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
    fr: { title: 'Profondeur d\'échelle via PageController.page', description: 'Utiliser un listener PageController fractionnel pour obtenir la valeur de page continue. Calculer dist = (page - index).abs() et la mapper sur scale = 1.0 - dist * 0.08 dans itemBuilder.' },
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
    fr: { title: 'Surimpression sombre qui disparaît', description: 'Ajouter une deuxième couche dans chaque diapositive — un Container avec Colors.black.withOpacity(dist * 0.5). Quand dist approche 0 (diapositive active), la surimpression devient transparente. Pas de packages supplémentaires nécessaires.' },
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
    fr: { title: 'Écrans statiques', description: 'Afficher un seul écran avec une icône, un titre et un corps. Ajouter un compteur d\'étapes basique et un bouton Suivant — pas encore d\'animation.' },
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
    fr: { title: 'Fondu enchaîné AnimatePresence', description: 'Envelopper le contenu de l\'écran dans `AnimatePresence mode="wait"` pour que l\'écran sortant s\'estompe avant que l\'entrant s\'estompe. Clef par étape pour déclencher l\'animation au changement.' },
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
    fr: { title: 'Glissement + pop d\'icône', description: 'Remplacer le fondu par un glissement depuis la droite et une sortie vers la gauche. Ajouter une animation de scale retardée sur l\'icône pour qu\'elle "pop" après que le conteneur se stabilise.' },
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
    fr: { title: 'Pastilles spring + bouton Retour', description: 'Remplacer les transitions CSS des pastilles par une largeur animée en spring avec `motion.div`. Ajouter le bouton Retour et un `whileTap` sur le bouton Suivant pour un retour haptique.' },
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
    fr: { title: 'Écrans statiques', description: "Ajouter `'use client'` — `useState` nécessite le navigateur. Exporter depuis un fichier de composant dédié pour pouvoir l'importer dans n'importe quelle page Server Component." },
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
    fr: { title: 'Fondu enchaîné AnimatePresence', description: '`AnimatePresence mode="wait"` fonctionne de manière identique dans Next.js — framer-motion est client-safe une fois la frontière `use client` déclarée.' },
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
    fr: { title: 'Glissement + pop d\'icône', description: 'Ajouter le glissement sur l\'axe x et l\'animation de scale retardée de l\'icône. Le cubic-bezier `[0.22,1,0.36,1]` est la même courbe de décélération utilisée dans toute l\'interface pour la cohérence visuelle.' },
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
    fr: { title: 'Pastilles spring + bouton Retour', description: 'Ajouter les pastilles animées en spring `motion.div` et le bouton Retour. Les generics TypeScript fonctionnent normalement dans les composants `"use client"`.' },
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
    fr: { title: 'Écrans statiques', description: 'Afficher un écran à la fois en utilisant v-if ou des propriétés calculées. Utiliser un état d\'étape réactif et un bouton basique pour avancer.' },
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
    fr: { title: 'Transition mode="out-in" fondu enchaîné', description: 'Envelopper le contenu de l\'écran dans <Transition mode="out-in"> et le clé par étape. Vue démonte complètement l\'ancien écran avant de monter le nouveau — identique à AnimatePresence mode="wait".' },
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
    fr: { title: 'Direction de glissement + explosion d\'icône', description: 'Passer du fondu à une transition par glissement. Suivre la direction dans un ref et la mettre à jour avant de changer d\'étape pour que le nom de transition sélectionne la bonne classe CSS.' },
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
    fr: { title: 'Points pilule animés', description: 'Le point actif passe déjà à une largeur via CSS. Faire correspondre la couleur du point à la couleur de l\'écran actif de façon réactive — lier :style avec la couleur actuelle quand actif.' },
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
    fr: { title: 'Écrans statiques', description: 'Afficher un écran à la fois en utilisant l\'état. Utiliser StyleSheet.absoluteFillObject pour que les écrans se superposent dans le même View parent — c\'est le conteneur dans lequel nous animerons.' },
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
    fr: { title: 'FadeIn / FadeOut depuis Reanimated', description: 'Ajouter la prop key à Animated.View — Reanimated détecte le changement de clé, exécute FadeOut sur l\'ancien écran, puis FadeIn sur le nouveau. Pas d\'équivalent explicite à AnimatePresence nécessaire.' },
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
    fr: { title: 'Direction de glissement + mise à l\'échelle d\'icône', description: 'Remplacer FadeIn par SlideInRight / SlideOutLeft (et l\'inverse sur Retour). Chaîner avec .springify() pour correspondre à la courbe d\'accélération. Ajouter un ScaleIn séparé sur l\'icône avec un délai de 100ms.' },
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
    fr: { title: 'Points pilule animés', description: 'Remplacer la largeur statique du point par useSharedValue + useAnimatedStyle pour que le point actif rebondisse à 24px. Passer la couleur de l\'écran actuel comme valeur partagée pour que la couleur du point soit également en transition.' },
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
    fr: { title: 'Écrans statiques', description: 'Utiliser un IndexedStack ou un switch sur _step pour afficher un écran à la fois. Stocker l\'état des étapes dans un StatefulWidget et l\'avancer avec setState.' },
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
    fr: { title: 'Fondu enchaîné AnimatedSwitcher', description: 'Envelopper le contenu de l\'écran dans AnimatedSwitcher. La clé pilote le basculement — quand _step change, AnimatedSwitcher fait disparaître l\'ancien widget et apparaître le nouveau.' },
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
    fr: { title: 'Direction de glissement + explosion d\'icône', description: 'Ajouter un SlideTransition personnalisé à AnimatedSwitcher. Suivre la direction pour inverser l\'axe de glissement. L\'icône obtient son propre AnimatedSwitcher pour pouvoir apparaître indépendamment avec une mise à l\'échelle + fondu.' },
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
    fr: { title: 'Points pilule animés', description: 'Envelopper chaque point dans AnimatedContainer. Le point actif élargit sa largeur de 8 à 24 en utilisant la courbe easeOut similaire à un ressort. Animer aussi la couleur en passant la couleur de l\'écran conditionnellement.' },
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
    fr: { title: 'Liste + overlay statique', description: 'Afficher une liste d\'éléments et un overlay de détail qui apparaît au clic. Pas encore d\'animation — juste la machine à états.' },
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
    fr: { title: 'Backdrop animé + sheet', description: 'Envelopper l\'overlay dans `AnimatePresence` pour que le backdrop s\'estompe et que la bottom sheet glisse depuis le bas.' },
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
    fr: { title: 'layoutId sur la miniature', description: 'Ajouter `layoutId` à la miniature de la liste. Framer Motion détecte le `layoutId` correspondant dans la sheet de détail et anime l\'élément entre les positions automatiquement avec FLIP.' },
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
    fr: { title: 'Polissage — spring + reflow de la liste', description: 'Ajouter une prop `layout` à chaque ligne de la liste pour que les frères se repositionnent en douceur quand l\'overlay se démonte. Ajuster le spring du `layoutId` pour un morph plus lent et cinématique.' },
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
    fr: { title: 'Liste + overlay statique', description: "Ajouter `'use client'`. La machine à états et l'overlay sont identiques à React — la seule exigence Next.js est la directive client." },
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
    fr: { title: 'Backdrop animé + sheet', description: '`AnimatePresence` fonctionne dans les composants `"use client"` de l\'App Router. Le backdrop s\'estompe et la sheet remonte en spring comme avant.' },
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
    fr: { title: 'layoutId sur la miniature', description: 'Ajouter `layoutId` à la miniature de la liste et à la bannière de détail. La liste et la sheet de détail doivent toutes deux être rendues dans le même arbre Client Component pour que `layoutId` les corresponde.' },
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
    fr: { title: 'Polissage — spring + reflow de la liste', description: 'Ajouter `layout` aux lignes de la liste et ajuster le spring du `layoutId`. Exporter depuis `components/SharedElementDemo.tsx` — n\'importe quelle page Server Component peut l\'importer directement.' },
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
    fr: { title: 'Liste + surimpression statique', description: 'Afficher la liste et une surimpression v-if. Suivre l\'id de l\'élément sélectionné dans un ref. Pas encore d\'animation — établir d\'abord la machine d\'état.' },
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
    fr: { title: 'Transition surimpression entrée/sortie', description: 'Envelopper la surimpression dans <Transition name="fade"> pour que le fond de scène disparaisse et que la feuille glisse vers le haut avec des transitions CSS. La feuille du bas utilise translateY.' },
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
    fr: { title: 'Transition héros FLIP — enregistrer le rect de la miniature', description: 'Vue n\'a pas d\'équivalent à layoutId. Implémenter FLIP manuellement : enregistrer getBoundingClientRect() de la miniature au clic, puis après le montage de la feuille, translater le héros DEPUIS ce rect VERS sa position naturelle.' },
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
    fr: { title: 'FLIP inversé à la fermeture', description: 'Enregistrer le rect du héros avant la fermeture, puis l\'animer vers la position de la miniature avec la même technique FLIP. Cela donne l\'effet "vol retour" au rejet.' },
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
    fr: { title: 'Liste + surimpression statique', description: 'Construire la liste et la machine d\'état de surimpression. Utiliser StyleSheet.absoluteFillObject sur le fond de scène et une feuille alignée en bas — pas encore d\'animation.' },
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
    fr: { title: 'Fond animé + feuille à ressort', description: 'Ajouter FadeIn sur le fond de scène et piloter la feuille avec useSharedValue + withSpring pour qu\'elle surgisse du bas comme un ressort.' },
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
    fr: { title: 'sharedTransitionTag — morphisme héros', description: 'Ajouter sharedTransitionTag de react-native-reanimated à la miniature de liste et au héros de la feuille. Reanimated anime automatiquement la taille et la position entre les deux.' },
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
    fr: { title: 'Réglage du ressort + morphisme du rayon de bordure', description: 'Ajouter borderRadius au worklet sharedTransitionStyle pour qu\'il anime de 10px (miniature) à 16px (héros). Ajuster la rigidité/amortissement pour un morphisme plus lent et cinématographique.' },
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
    fr: { title: 'Liste + route de détail (statique)', description: 'Créer deux écrans — ItemList et ItemDetail. Utiliser Navigator.push pour naviguer entre eux. Pas encore de Hero — juste établir la structure à deux écrans.' },
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
    fr: { title: 'Envelopper la miniature dans Hero', description: 'Ajouter Hero(tag: ...) autour de la miniature de liste. Le tag est le seul identifiant partagé dont Flutter a besoin — rien d\'autre ne change.' },
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
    fr: { title: 'Envelopper la bannière de détail dans Hero', description: 'Ajouter le Hero(tag: ...) correspondant à la bannière de détail. Flutter anime maintenant automatiquement l\'élément entre les deux positions à push et pop.' },
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
    fr: { title: 'FlightShuttleBuilder personnalisé pour le morphisme du rayon de bordure', description: 'Le widget de vol Hero par défaut coupe à sa forme source. Surcharger flightShuttleBuilder pour interpoler borderRadius pendant le vol afin que la miniature s\'arrondisse vers la forme complète de bannière.' },
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
    fr: { title: 'En-tête statique', description: 'Construire la mise en page de l\'en-tête avec avatar, titre et barre de recherche. Faire défiler le contenu en dessous — rien ne se réduit encore.' },
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
    fr: { title: 'Suivre le scroll avec useScroll', description: 'Attacher un ref au conteneur de scroll et le passer à `useScroll`. Logger `scrollY` pour confirmer qu\'il suit le conteneur, pas la page.' },
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
    fr: { title: 'useTransform — recherche s\'estompe, avatar rétrécit', description: 'Mapper scrollY 0→120px au scale de l\'avatar (1→0.55) et à l\'opacité de la recherche (1→0). `useTransform` clamp automatiquement — défiler au-delà de 120px maintient les valeurs à leurs endpoints.' },
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
    fr: { title: 'Taille de police du titre + sync du padding', description: 'Ajouter `useTransform` pour le padding de l\'en-tête (20→10px) et la taille de police du titre (22→14px). Les quatre transforms partagent le même `scrollY` — synchronisation parfaite sans état supplémentaire.' },
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
    fr: { title: 'Mise en page de l\'en-tête statique', description: "Ajouter `'use client'` — tout composant utilisant des hooks de scroll doit être un Client Component dans l'App Router. Construire d'abord l'en-tête statique et la zone de contenu défilable." },
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
    fr: { title: 'Configuration de useScroll', description: 'Importer `useScroll` et `useRef` depuis framer-motion et react. Attacher un `containerRef` à la div défilable et le passer à `useScroll` — cela scope le suivi du scroll au conteneur, pas à la page.' },
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
    fr: { title: 'Scale de l\'avatar + opacité de la recherche', description: 'Injecter `scrollY` dans `useTransform` pour rétrécir l\'avatar et masquer la barre de recherche au défilement. Convertir les divs de l\'en-tête et de l\'avatar en éléments motion.' },
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
    fr: { title: 'Taille de police du titre + sync du padding', description: 'Ajouter les transforms de taille de police du titre et de padding de l\'en-tête pour une compression fluide. Exporter depuis un fichier composant `"use client"` — n\'importe quelle page Server Component l\'importe directement.' },
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
    fr: { title: 'Mise en page d\'en-tête statique', description: 'Construire l\'en-tête statique et la liste défilable en Vue. L\'en-tête a une rangée d\'avatar et une barre de recherche. Pas encore de suivi du scroll — juste la structure visuelle.' },
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
    fr: { title: 'Suivre le scroll avec @vueuse/core useScroll', description: 'Ajouter un templateRef pour le div de flux et utiliser useScroll de @vueuse/core pour suivre réactivement son scrollTop. Pas encore de changement visuel — journaliser scrollTop pour vérifier.' },
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
    fr: { title: 'Mise à l\'échelle de l\'avatar + opacité de recherche via computed', description: 'Écrire des valeurs calculées d\'aide lerp() qui mappent scrollY [0→120] à la plage de propriété CSS. Les lier aux styles en ligne sur l\'avatar et la barre de recherche.' },
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
    fr: { title: 'paddingTop dynamique + repli de transition fluide', description: 'Piloter paddingTop sur le div de flux depuis headerHeight calculé pour que le contenu ne se cache jamais sous l\'en-tête rétractable. Ajouter will-change: transform pour la composition GPU.' },
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
    fr: { title: 'En-tête statique + FlatList', description: 'Afficher l\'en-tête de profil statique au-dessus d\'un FlatList. Utiliser position: absolute pour l\'en-tête et un paddingTop sur le FlatList pour que le contenu commence en dessous. Pas encore d\'animation.' },
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
    fr: { title: 'Suivi du scroll avec Animated.event', description: 'Remplacer FlatList par Animated.FlatList et connecter onScroll à un Animated.Value avec useNativeDriver. La valeur animée suit maintenant la position de défilement sur le thread UI.' },
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
    fr: { title: 'Interpoler la mise à l\'échelle de l\'avatar + l\'opacité de recherche', description: 'Appeler scrollY.interpolate() pour mapper le décalage de défilement brut à la plage de propriété CSS. Envelopper l\'avatar et la recherche dans Animated.View et lier les valeurs interpolées.' },
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
    fr: { title: 'Taille du titre + synchronisation du rembourrage', description: 'Ajouter des interpolations pour la taille de police du titre et le rembourrage de l\'en-tête pour que l\'en-tête entier se comprime en douceur. Passer la mise à l\'échelle de l\'avatar à useNativeDriver: true en séparant opacité/hauteur sur une valeur pilotée par JS.' },
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
    fr: { title: 'Mise en page SliverAppBar statique', description: 'Utiliser CustomScrollView avec SliverAppBar et SliverList. SliverAppBar gère l\'en-tête rétractable — expandedHeight définit sa taille maximale.' },
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
    fr: { title: 'LayoutBuilder pour lire le ratio de réduction', description: 'Envelopper le contenu de FlexibleSpaceBar dans un LayoutBuilder. Le ratio availableHeight vs expandedHeight donne une valeur t (0 = étendu, 1 = complètement réduit) pour l\'interpolation manuelle.' },
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
    fr: { title: 'Mise à l\'échelle de l\'avatar + opacité de recherche', description: 'Utiliser t pour piloter Transform.scale sur l\'avatar et Opacity sur la barre de recherche. lerpDouble interpole entre les valeurs de début et de fin.' },
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
    fr: { title: 'Taille du titre + synchronisation du rembourrage', description: 'Ajouter des interpolations de taille de police du titre et de rembourrage pour que chaque élément de l\'en-tête se comprime en synchronisation. Le résultat est un en-tête de profil rétractable extrêmement fluide entièrement piloté par les contraintes de SliverAppBar.' },
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

/* ─────────────────────────────────────────────────────────────────── */
/*  pan-dismiss                                                          */
/* ─────────────────────────────────────────────────────────────────── */

const panDismissReact: Step[] = [
  {
    title: 'Connect the gesture handler',
    description: 'Attach a drag gesture to the card using `useDragControls` or the `drag` prop. No threshold logic yet — the card simply follows the pointer so you can verify the connection works.',
    fr: { title: 'Connecter le gestionnaire de geste', description: 'Attacher un geste de glissement à la carte via `useDragControls` ou la prop `drag`. Pas encore de logique de seuil — la carte suit simplement le pointeur pour vérifier que la connexion fonctionne.' },
    code: `import { motion } from 'framer-motion'

export function DismissCard({ children }) {
  return (
    <motion.div
      drag="x"
      style={{ cursor: 'grab' }}
    >
      {children}
    </motion.div>
  )
}`,
  },
  {
    title: 'Track position → opacity/scale',
    description: 'Use `useMotionValue` and `useTransform` to map drag distance to opacity and scale. This gives the user continuous visual feedback that pulling the card is doing something meaningful.',
    fr: { title: 'Suivre la position → opacité/échelle', description: 'Utiliser `useMotionValue` et `useTransform` pour lier la distance de glissement à l\'opacité et à l\'échelle. Cela donne à l\'utilisateur un retour visuel continu indiquant que l\'action a du sens.' },
    code: `import { motion, useMotionValue, useTransform } from 'framer-motion'

export function DismissCard({ children }) {
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0])
  const scale  = useTransform(x, [-150, 0, 150], [0.85, 1, 0.85])

  return (
    <motion.div drag="x" style={{ x, opacity, scale, cursor: 'grab' }}>
      {children}
    </motion.div>
  )
}`,
  },
  {
    title: 'Add dismiss threshold',
    description: 'Check drag offset and velocity in `onDragEnd`. Dismiss when either exceeds the threshold; otherwise spring back. This prevents accidental dismissals from small nudges.',
    fr: { title: 'Ajouter le seuil de rejet', description: 'Vérifier le décalage et la vitesse de glissement dans `onDragEnd`. Rejeter si l\'un des deux dépasse le seuil ; sinon revenir en place. Cela évite les rejets accidentels suite à de petits mouvements.' },
    code: `const THRESHOLD = 120

function handleDragEnd(_, info) {
  const { offset, velocity } = info
  if (Math.abs(offset.x) > THRESHOLD || Math.abs(velocity.x) > 500) {
    onDismiss()
  }
  // framer-motion springs back automatically when dragSnapToOrigin is set
}

<motion.div
  drag="x"
  dragSnapToOrigin
  onDragEnd={handleDragEnd}
  style={{ x, opacity, scale }}
/>`,
  },
  {
    title: 'Polish: spring config + backdrop fade',
    description: 'Tune `dragTransition` spring stiffness/damping so the snap-back feels physical. Fade a semi-transparent backdrop using the same motion value to reinforce the dismiss intent.',
    fr: { title: 'Finition : ressort + fondu de l\'arrière-plan', description: 'Ajuster la raideur et l\'amortissement du ressort dans `dragTransition` pour que le retour en place soit réaliste. Estomper un arrière-plan semi-transparent via la même valeur de mouvement pour renforcer l\'intention de rejet.' },
    code: `const backdropOpacity = useTransform(x, [-150, 0, 150], [0.4, 0, 0.4])

<>
  <motion.div style={{ opacity: backdropOpacity }}
    className="backdrop" />
  <motion.div
    drag="x"
    dragSnapToOrigin
    dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
    onDragEnd={handleDragEnd}
    style={{ x, opacity, scale }}
  />
</>`,
  },
]

const panDismissNextjs: Step[] = [
  {
    title: 'Connect the gesture handler',
    description: 'Mark the component as a Client Component and attach a drag gesture. Next.js server components cannot hold motion state, so the `"use client"` directive is the first thing to add.',
    fr: { title: 'Connecter le gestionnaire de geste', description: 'Marquer le composant comme Client Component et attacher un geste de glissement. Les composants serveur Next.js ne peuvent pas gérer l\'état de mouvement, donc la directive `"use client"` est la première chose à ajouter.' },
    code: `'use client'
import { motion } from 'framer-motion'

export function DismissCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div drag="x" style={{ cursor: 'grab' }}>
      {children}
    </motion.div>
  )
}`,
  },
  {
    title: 'Track position → opacity/scale',
    description: 'Wire `useMotionValue` to visual properties with `useTransform`. The card dims and shrinks as it travels, signalling to the user that they are making progress toward dismissal.',
    fr: { title: 'Suivre la position → opacité/échelle', description: 'Lier `useMotionValue` aux propriétés visuelles via `useTransform`. La carte s\'assombrit et rétrécit en se déplaçant, indiquant à l\'utilisateur qu\'il progresse vers le rejet.' },
    code: `'use client'
import { motion, useMotionValue, useTransform } from 'framer-motion'

export function DismissCard({ children }: { children: React.ReactNode }) {
  const x = useMotionValue(0)
  const opacity = useTransform(x, [-150, 0, 150], [0, 1, 0])
  const scale   = useTransform(x, [-150, 0, 150], [0.85, 1, 0.85])

  return (
    <motion.div drag="x" style={{ x, opacity, scale, cursor: 'grab' }}>
      {children}
    </motion.div>
  )
}`,
  },
  {
    title: 'Add dismiss threshold',
    description: 'Evaluate offset and velocity on release. Calling a server action or router navigation after dismissal integrates naturally here — dismiss the card then trigger a data mutation.',
    fr: { title: 'Ajouter le seuil de rejet', description: 'Évaluer le décalage et la vitesse au relâchement. Appeler une action serveur ou la navigation du routeur après le rejet s\'intègre naturellement ici — rejeter la carte puis déclencher une mutation de données.' },
    code: `'use client'
const THRESHOLD = 120

function handleDragEnd(_: unknown, info: PanInfo) {
  if (Math.abs(info.offset.x) > THRESHOLD ||
      Math.abs(info.velocity.x) > 500) {
    // e.g. router.push('/next') or call a server action
    onDismiss()
  }
}

<motion.div drag="x" dragSnapToOrigin onDragEnd={handleDragEnd}
  style={{ x, opacity, scale }} />`,
  },
  {
    title: 'Polish: spring config + backdrop fade',
    description: 'Tune the snap-back spring and add a backdrop. In Next.js, keep the backdrop in the same Client Component so it shares the same motion value without extra props drilling.',
    fr: { title: 'Finition : ressort + fondu de l\'arrière-plan', description: 'Peaufiner le ressort de retour et ajouter un arrière-plan. Dans Next.js, garder l\'arrière-plan dans le même Client Component afin qu\'il partage la même valeur de mouvement sans prop drilling supplémentaire.' },
    code: `const backdropOpacity = useTransform(x, [-150, 0, 150], [0.4, 0, 0.4])

<>
  <motion.div className="fixed inset-0 bg-black"
    style={{ opacity: backdropOpacity }} />
  <motion.div
    drag="x" dragSnapToOrigin
    dragTransition={{ bounceStiffness: 300, bounceDamping: 30 }}
    onDragEnd={handleDragEnd}
    style={{ x, opacity, scale }}
  />
</>`,
  },
]

const panDismissVue: Step[] = [
  {
    title: 'Connect the gesture handler',
    description: 'Use `@vueuse/motion` or Vue\'s native touch events to track pointer position. Starting with a minimal event binding lets you confirm that the gesture layer is working before layering on animation.',
    fr: { title: 'Connecter le gestionnaire de geste', description: 'Utiliser `@vueuse/motion` ou les événements tactiles natifs de Vue pour suivre la position du pointeur. Commencer par une liaison d\'événement minimale permet de vérifier que la couche de geste fonctionne avant d\'ajouter l\'animation.' },
    code: `<template>
  <div ref="card" class="card"
    @pointerdown="onDown" @pointermove="onMove" @pointerup="onUp"
    :style="{ transform: \`translateX(\${x}px)\` }">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const x = ref(0)
const startX = ref(0)
function onDown(e: PointerEvent) { startX.value = e.clientX - x.value }
function onMove(e: PointerEvent) { x.value = e.clientX - startX.value }
function onUp() {}
</script>`,
  },
  {
    title: 'Track position → opacity/scale',
    description: 'Derive opacity and scale from the `x` ref with computed properties. Vue\'s reactivity system updates these in the same microtask, so the card always shows a consistent visual state.',
    fr: { title: 'Suivre la position → opacité/échelle', description: 'Dériver l\'opacité et l\'échelle du ref `x` avec des propriétés calculées. Le système de réactivité de Vue met ces valeurs à jour dans la même microtâche, assurant un état visuel toujours cohérent.' },
    code: `<script setup lang="ts">
import { ref, computed } from 'vue'
const x = ref(0)
const opacity = computed(() =>
  1 - Math.min(Math.abs(x.value) / 150, 1))
const scale = computed(() =>
  1 - Math.min(Math.abs(x.value) / 150, 0.15))
</script>

<template>
  <div :style="{ transform: \`translateX(\${x}px) scale(\${scale})\`,
                 opacity }">
    <slot />
  </div>
</template>`,
  },
  {
    title: 'Add dismiss threshold',
    description: 'In `onUp`, compare drag distance to the threshold. Resetting `x` to 0 with a CSS transition on pointerup creates the snap-back effect without a motion library.',
    fr: { title: 'Ajouter le seuil de rejet', description: 'Dans `onUp`, comparer la distance de glissement au seuil. Remettre `x` à 0 avec une transition CSS au relâchement crée l\'effet de retour sans bibliothèque d\'animation.' },
    code: `const THRESHOLD = 120
const emit = defineEmits<{ dismiss: [] }>()

function onUp() {
  if (Math.abs(x.value) > THRESHOLD) {
    emit('dismiss')
  } else {
    // snap back via CSS transition
    x.value = 0
  }
}`,
  },
  {
    title: 'Polish: CSS spring transition + backdrop',
    description: 'Add a `spring()` CSS custom property or use `transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)` on snap-back. Layer a `:before` backdrop that fades with the card.',
    fr: { title: 'Finition : transition ressort CSS + arrière-plan', description: 'Ajouter une propriété CSS personnalisée `spring()` ou utiliser `transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)` au retour. Superposer un arrière-plan `:before` qui s\'estompe avec la carte.' },
    code: `/* In <style> */
.card {
  transition: transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
              opacity 0.35s ease;
}
.card.dragging { transition: none; }

.backdrop {
  opacity: v-bind('Math.min(Math.abs(x) / 150, 0.4)');
  background: black;
  position: fixed; inset: 0;
  transition: opacity 0.3s ease;
}`,
  },
]

const panDismissRN: Step[] = [
  {
    title: 'Connect the gesture handler',
    description: 'Use `react-native-gesture-handler`\'s `PanGestureHandler` to receive raw pan events. Wrapping in `GestureHandlerRootView` at the app root is a prerequisite — missing it causes silent failures on Android.',
    fr: { title: 'Connecter le gestionnaire de geste', description: 'Utiliser `PanGestureHandler` de `react-native-gesture-handler` pour recevoir les événements de panoramique bruts. Envelopper l\'application dans `GestureHandlerRootView` est un prérequis — son absence cause des échecs silencieux sur Android.' },
    code: `import { PanGestureHandler } from 'react-native-gesture-handler'
import Animated from 'react-native-reanimated'

export function DismissCard({ children }) {
  return (
    <PanGestureHandler>
      <Animated.View style={styles.card}>
        {children}
      </Animated.View>
    </PanGestureHandler>
  )
}`,
  },
  {
    title: 'Track position → opacity/scale',
    description: 'Connect `useAnimatedGestureHandler` and `useAnimatedStyle` to derive visual properties from the translation value. Running on the UI thread avoids JS bridge jank on every frame.',
    fr: { title: 'Suivre la position → opacité/échelle', description: 'Connecter `useAnimatedGestureHandler` et `useAnimatedStyle` pour dériver les propriétés visuelles depuis la valeur de translation. L\'exécution sur le thread UI évite les saccades du pont JS à chaque image.' },
    code: `import { useSharedValue, useAnimatedStyle, interpolate }
  from 'react-native-reanimated'

const translateX = useSharedValue(0)

const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: translateX.value }],
  opacity: interpolate(Math.abs(translateX.value), [0, 150], [1, 0]),
}))

const gestureHandler = useAnimatedGestureHandler({
  onActive: (e) => { translateX.value = e.translationX },
})`,
  },
  {
    title: 'Add dismiss threshold',
    description: 'In `onEnd`, compare translation and velocity to thresholds. Run the dismiss via `runOnJS` so you can call React state setters and navigation APIs that must execute on the JS thread.',
    fr: { title: 'Ajouter le seuil de rejet', description: 'Dans `onEnd`, comparer la translation et la vitesse aux seuils. Exécuter le rejet via `runOnJS` pour pouvoir appeler les setters d\'état React et les APIs de navigation qui doivent s\'exécuter sur le thread JS.' },
    code: `import { runOnJS, withSpring } from 'react-native-reanimated'

const gestureHandler = useAnimatedGestureHandler({
  onActive: (e) => { translateX.value = e.translationX },
  onEnd: (e) => {
    if (Math.abs(e.translationX) > 120 || Math.abs(e.velocityX) > 800) {
      runOnJS(onDismiss)()
    } else {
      translateX.value = withSpring(0, { stiffness: 300, damping: 28 })
    }
  },
})`,
  },
  {
    title: 'Polish: spring config + haptic feedback',
    description: 'Tune `withSpring` stiffness/damping so the snap-back feels physical. Trigger `Haptics.impactAsync` on dismiss for tactile confirmation — haptics are free in Expo and make a big difference on iOS.',
    fr: { title: 'Finition : ressort + retour haptique', description: 'Ajuster la raideur et l\'amortissement de `withSpring` pour que le retour soit réaliste. Déclencher `Haptics.impactAsync` au rejet pour une confirmation tactile — les haptiques sont gratuits dans Expo et font une grande différence sur iOS.' },
    code: `import * as Haptics from 'expo-haptics'
import { runOnJS, withSpring } from 'react-native-reanimated'

function dismiss() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  onDismiss()
}

onEnd: (e) => {
  if (Math.abs(e.translationX) > 120 || Math.abs(e.velocityX) > 800) {
    runOnJS(dismiss)()
  } else {
    translateX.value = withSpring(0, { stiffness: 400, damping: 35 })
  }
}`,
  },
]

const panDismissFlutter: Step[] = [
  {
    title: 'Connect the gesture handler',
    description: 'Wrap the card in a `GestureDetector` and store the horizontal offset in state. This baseline confirms the gesture layer is wired before adding any physics.',
    fr: { title: 'Connecter le gestionnaire de geste', description: 'Envelopper la carte dans un `GestureDetector` et stocker le décalage horizontal dans l\'état. Cette base confirme que la couche de geste est connectée avant d\'ajouter des effets physiques.' },
    code: `class DismissCard extends StatefulWidget {
  const DismissCard({super.key, required this.child});
  final Widget child;
  @override State<DismissCard> createState() => _State();
}
class _State extends State<DismissCard> {
  double _dx = 0;
  @override Widget build(BuildContext context) => GestureDetector(
    onPanUpdate: (d) => setState(() => _dx += d.delta.dx),
    child: Transform.translate(
      offset: Offset(_dx, 0), child: widget.child),
  );
}`,
  },
  {
    title: 'Track position → opacity/scale',
    description: 'Derive opacity and scale from `_dx` inside the build method. Because Flutter rebuilds on every `setState` call, the card always reflects the current drag position without manual interpolation.',
    fr: { title: 'Suivre la position → opacité/échelle', description: 'Dériver l\'opacité et l\'échelle depuis `_dx` dans la méthode build. Comme Flutter reconstruit à chaque appel `setState`, la carte reflète toujours la position de glissement actuelle sans interpolation manuelle.' },
    code: `final double t = (_dx.abs() / 150).clamp(0.0, 1.0);
final double opacity = 1.0 - t;
final double scale   = 1.0 - t * 0.15;

return Opacity(
  opacity: opacity,
  child: Transform.scale(
    scale: scale,
    child: Transform.translate(
      offset: Offset(_dx, 0),
      child: widget.child,
    ),
  ),
);`,
  },
  {
    title: 'Add dismiss threshold',
    description: 'In `onPanEnd`, compare velocity and offset to thresholds. Calling `widget.onDismiss` is safe here because `onPanEnd` is called on the main isolate.',
    fr: { title: 'Ajouter le seuil de rejet', description: 'Dans `onPanEnd`, comparer la vitesse et le décalage aux seuils. Appeler `widget.onDismiss` est sûr ici car `onPanEnd` est exécuté sur l\'isolat principal.' },
    code: `onPanEnd: (details) {
  final velocity = details.velocity.pixelsPerSecond.dx;
  if (_dx.abs() > 120 || velocity.abs() > 800) {
    widget.onDismiss();
  } else {
    setState(() => _dx = 0); // snap back (add AnimationController for spring)
  }
},`,
  },
  {
    title: 'Polish: spring snap-back + backdrop',
    description: 'Replace the instant reset with an `AnimationController` using a spring simulation. Add a `ColorFiltered` or `Opacity` backdrop widget that reads `_dx` to fade alongside the card.',
    fr: { title: 'Finition : retour à ressort + arrière-plan', description: 'Remplacer la réinitialisation instantanée par un `AnimationController` utilisant une simulation à ressort. Ajouter un widget d\'arrière-plan `ColorFiltered` ou `Opacity` qui lit `_dx` pour s\'estomper avec la carte.' },
    code: `final spring = SpringSimulation(
  const SpringDescription(mass: 1, stiffness: 300, damping: 28),
  _dx, 0, velocity,
);
_controller.animateWith(spring);

// Backdrop
Positioned.fill(child: IgnorePointer(
  child: Opacity(
    opacity: (_dx.abs() / 150).clamp(0.0, 0.4),
    child: const ColoredBox(color: Colors.black),
  ),
)),`,
  },
]

const panDismiss: StepMap = {
  react:          panDismissReact,
  nextjs:         panDismissNextjs,
  vue:            panDismissVue,
  'react-native': panDismissRN,
  flutter:        panDismissFlutter,
}

/* ─────────────────────────────────────────────────────────────────── */
/*  flutter-hero                                                         */
/* ─────────────────────────────────────────────────────────────────── */

const flutterHeroReact: Step[] = [
  {
    title: 'Static layout — grid and detail view',
    description: 'Build the grid and detail views without any animation. Getting routing and data flow right first means you are only adding animation in later steps, not debugging logic and layout at the same time.',
    fr: { title: 'Mise en page statique — grille et vue détail', description: 'Construire la grille et la vue détail sans aucune animation. Mettre en place le routage et le flux de données en premier permet de n\'ajouter que l\'animation dans les étapes suivantes, sans déboguer la logique en même temps.' },
    code: `// Grid.tsx
export function Grid({ items, onSelect }) {
  return (
    <div className="grid">
      {items.map(item => (
        <img key={item.id} src={item.src}
          onClick={() => onSelect(item)} />
      ))}
    </div>
  )
}

// Detail.tsx
export function Detail({ item }) {
  return <img src={item.src} className="detail-image" />
}`,
  },
  {
    title: 'Page transition between views',
    description: 'Wrap each page in `AnimatePresence` with `motion.div` enter/exit variants. This gives you a page-level transition as foundation before adding the shared element layer.',
    fr: { title: 'Transition de page entre les vues', description: 'Envelopper chaque page dans `AnimatePresence` avec des variantes d\'entrée/sortie sur `motion.div`. Cela fournit une transition de page de base avant d\'ajouter la couche d\'élément partagé.' },
    code: `import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence mode="wait">
  {selected ? (
    <motion.div key="detail"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Detail item={selected} />
    </motion.div>
  ) : (
    <motion.div key="grid"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Grid items={items} onSelect={setSelected} />
    </motion.div>
  )}
</AnimatePresence>`,
  },
  {
    title: 'Add layoutId for shared element',
    description: 'Give the image in both the grid and the detail the same `layoutId`. Framer Motion detects that the element exists in both states and automatically morphs its position, size, and border-radius.',
    fr: { title: 'Ajouter layoutId pour l\'élément partagé', description: 'Donner à l\'image dans la grille et dans le détail le même `layoutId`. Framer Motion détecte que l\'élément existe dans les deux états et anime automatiquement sa position, sa taille et son rayon de bordure.' },
    code: `// In Grid
<motion.img
  key={item.id}
  layoutId={\`hero-\${item.id}\`}
  src={item.src}
  onClick={() => setSelected(item)}
/>

// In Detail
<motion.img
  layoutId={\`hero-\${selected.id}\`}
  src={selected.src}
  className="detail-image"
/>`,
  },
  {
    title: 'Tune spring stiffness/damping',
    description: 'Pass a `transition` prop with `type: "spring"` to the shared element. Lowering stiffness makes the morph feel weighty; raising damping prevents bounce — dial both until it feels satisfying.',
    fr: { title: 'Ajuster la raideur et l\'amortissement du ressort', description: 'Passer une prop `transition` avec `type: "spring"` à l\'élément partagé. Réduire la raideur rend le morphing plus lourd ; augmenter l\'amortissement évite les rebonds — ajuster les deux jusqu\'à obtenir un résultat satisfaisant.' },
    code: `<motion.img
  layoutId={\`hero-\${selected.id}\`}
  src={selected.src}
  transition={{
    type: 'spring',
    stiffness: 260,
    damping: 30,
  }}
  className="detail-image"
/>`,
  },
]

const flutterHeroNextjs: Step[] = [
  {
    title: 'Static layout — grid and detail route',
    description: 'Create a grid page and a dynamic detail route in the App Router. Separate routes mean the browser URL updates on navigation, giving users bookmarkable deep links before any animation.',
    fr: { title: 'Mise en page statique — grille et route détail', description: 'Créer une page grille et une route détail dynamique dans l\'App Router. Des routes séparées signifient que l\'URL du navigateur est mise à jour à la navigation, donnant aux utilisateurs des liens profonds enregistrables avant toute animation.' },
    code: `// app/gallery/page.tsx
export default function GalleryPage() {
  return (
    <div className="grid">
      {items.map(item => (
        <Link key={item.id} href={\`/gallery/\${item.id}\`}>
          <img src={item.src} />
        </Link>
      ))}
    </div>
  )
}

// app/gallery/[id]/page.tsx
export default function DetailPage({ params }) {
  return <img src={getItem(params.id).src} className="detail-image" />
}`,
  },
  {
    title: 'Page-level transition with layout animations',
    description: 'In Next.js App Router, wrap your root layout\'s children in `AnimatePresence`. Use `usePathname` as the key so Framer Motion remounts on route change and triggers enter/exit.',
    fr: { title: 'Transition de page avec animations de mise en page', description: 'Dans l\'App Router Next.js, envelopper les enfants du layout racine dans `AnimatePresence`. Utiliser `usePathname` comme clé pour que Framer Motion remonte le composant au changement de route et déclenche l\'entrée/sortie.' },
    code: `'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }) {
  const path = usePathname()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={path}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}>
        {children}
      </motion.div>
    </AnimatePresence>
  )
}`,
  },
  {
    title: 'Shared element with layoutId',
    description: 'Apply the same `layoutId` to the thumbnail in the grid page and the hero image in the detail page. Next.js keeps both components mounted during the transition so Framer Motion can animate between them.',
    fr: { title: 'Élément partagé avec layoutId', description: 'Appliquer le même `layoutId` à la miniature dans la page grille et à l\'image hero dans la page détail. Next.js maintient les deux composants montés pendant la transition pour que Framer Motion puisse animer entre eux.' },
    code: `// GalleryGrid (client component)
<motion.img layoutId={\`hero-\${item.id}\`} src={item.src} />

// DetailHero (client component)
<motion.img layoutId={\`hero-\${params.id}\`}
  src={item.src} className="hero" />`,
  },
  {
    title: 'Tune spring config',
    description: 'Pass `transition` to the detail hero image. Because Next.js pre-renders the detail page, the spring plays as soon as hydration completes — keep stiffness high enough that users see the animation start immediately.',
    fr: { title: 'Ajuster la configuration du ressort', description: 'Passer `transition` à l\'image hero du détail. Comme Next.js pré-rend la page de détail, le ressort se joue dès que l\'hydratation est terminée — garder une raideur suffisamment élevée pour que les utilisateurs voient l\'animation démarrer immédiatement.' },
    code: `<motion.img
  layoutId={\`hero-\${params.id}\`}
  src={item.src}
  className="hero"
  transition={{ type: 'spring', stiffness: 280, damping: 32 }}
/>`,
  },
]

const flutterHeroVue: Step[] = [
  {
    title: 'Static layout — grid and detail view',
    description: 'Build a Vue grid component and a detail view navigated with Vue Router. Separating concerns now means you swap only the animation layer in later steps.',
    fr: { title: 'Mise en page statique — grille et vue détail', description: 'Construire un composant grille Vue et une vue détail naviguée avec Vue Router. Séparer les préoccupations maintenant signifie ne remplacer que la couche d\'animation dans les étapes suivantes.' },
    code: `<!-- Gallery.vue -->
<template>
  <div class="grid">
    <img v-for="item in items" :key="item.id"
      :src="item.src" @click="$router.push(\`/detail/\${item.id}\`)" />
  </div>
</template>

<!-- Detail.vue -->
<template>
  <img :src="item.src" class="detail-image" />
</template>`,
  },
  {
    title: 'Page transition with <Transition>',
    description: 'Wrap `<RouterView>` in Vue\'s `<Transition>` component. This gives cross-fade between routes and is the foundation on which the shared-element animation will be layered.',
    fr: { title: 'Transition de page avec <Transition>', description: 'Envelopper `<RouterView>` dans le composant `<Transition>` de Vue. Cela donne un fondu croisé entre les routes et constitue la base sur laquelle l\'animation d\'élément partagé sera ajoutée.' },
    code: `<Transition name="fade" mode="out-in">
  <RouterView />
</Transition>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>`,
  },
  {
    title: 'Shared element with @vueuse/motion FLIP',
    description: 'Capture the thumbnail\'s bounding rect before navigation and apply a FLIP animation on the detail hero. FLIP (First, Last, Invert, Play) creates the illusion of a shared element without DOM teleportation.',
    fr: { title: 'Élément partagé avec @vueuse/motion FLIP', description: 'Capturer le rect de la miniature avant la navigation et appliquer une animation FLIP sur le hero du détail. FLIP (First, Last, Invert, Play) crée l\'illusion d\'un élément partagé sans téléportation DOM.' },
    code: `// In Gallery.vue — store rect before navigating
function navigate(item) {
  const el = document.getElementById(\`thumb-\${item.id}\`)
  store.heroRect = el?.getBoundingClientRect()
  router.push(\`/detail/\${item.id}\`)
}

// In Detail.vue — apply FLIP on mount
onMounted(() => {
  if (!store.heroRect) return
  const el = heroRef.value
  const last = el.getBoundingClientRect()
  const dy = store.heroRect.top  - last.top
  const dx = store.heroRect.left - last.left
  el.animate([{ transform: \`translate(\${dx}px, \${dy}px)\` }, {}],
    { duration: 400, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' })
})`,
  },
  {
    title: 'Tune spring config',
    description: 'Replace the cubic-bezier with a spring easing via the Web Animations API or `@vueuse/motion` spring. Adjust mass and stiffness until the hero lands with the right weight.',
    fr: { title: 'Ajuster la configuration du ressort', description: 'Remplacer le cubic-bezier par un easing à ressort via l\'API Web Animations ou `@vueuse/motion` spring. Ajuster la masse et la raideur jusqu\'à ce que le hero atterrisse avec le bon poids.' },
    code: `import { useSpring } from '@vueuse/motion'

const { set } = useSpring(heroRef, {
  stiffness: 260,
  damping: 28,
})

onMounted(() => {
  const { top: fromTop, left: fromLeft } = store.heroRect
  const { top, left } = heroRef.value.getBoundingClientRect()
  set({ x: fromLeft - left, y: fromTop - top })
  nextTick(() => set({ x: 0, y: 0 }))
})`,
  },
]

const flutterHeroRN: Step[] = [
  {
    title: 'Static layout — list and detail screen',
    description: 'Build the list and detail screens with React Navigation but no animation. Confirming that data passes correctly through navigation params is far easier without animation complexity.',
    fr: { title: 'Mise en page statique — liste et écran de détail', description: 'Construire les écrans liste et détail avec React Navigation sans animation. Vérifier que les données transitent correctement via les paramètres de navigation est bien plus facile sans la complexité de l\'animation.' },
    code: `// ListScreen.tsx
function ListScreen({ navigation }) {
  return (
    <FlatList data={items} renderItem={({ item }) => (
      <TouchableOpacity onPress={() =>
        navigation.navigate('Detail', { item })}>
        <Image source={{ uri: item.uri }} style={styles.thumb} />
      </TouchableOpacity>
    )} />
  )
}`,
  },
  {
    title: 'Shared transition with react-native-reanimated',
    description: 'Use `SharedTransition.custom()` from Reanimated 3 to define a custom page transition. This API drives the animation entirely on the UI thread, avoiding bridge latency during navigation.',
    fr: { title: 'Transition partagée avec react-native-reanimated', description: 'Utiliser `SharedTransition.custom()` de Reanimated 3 pour définir une transition de page personnalisée. Cette API pilote l\'animation entièrement sur le thread UI, évitant la latence du pont lors de la navigation.' },
    code: `import { SharedTransition } from 'react-native-reanimated'

const transition = SharedTransition.custom((values) => {
  'worklet'
  return {
    width: withSpring(values.targetWidth),
    height: withSpring(values.targetHeight),
  }
})`,
  },
  {
    title: 'Tag the shared element',
    description: 'Apply `sharedTransitionTag` with the same string on the image in both screens. Reanimated uses this tag to pair the two elements and interpolate between their layouts automatically.',
    fr: { title: 'Baliser l\'élément partagé', description: 'Appliquer `sharedTransitionTag` avec la même chaîne sur l\'image dans les deux écrans. Reanimated utilise cette balise pour associer les deux éléments et interpoler automatiquement entre leurs mises en page.' },
    code: `// ListScreen
<Animated.Image
  source={{ uri: item.uri }}
  sharedTransitionTag={\`hero-\${item.id}\`}
  style={styles.thumb}
/>

// DetailScreen
<Animated.Image
  source={{ uri: item.uri }}
  sharedTransitionTag={\`hero-\${item.id}\`}
  style={styles.hero}
/>`,
  },
  {
    title: 'Tune spring config',
    description: 'Customize the spring inside `SharedTransition.custom()` with stiffness/damping values. Higher stiffness makes the element snap into place faster; lower damping allows a subtle overshoot.',
    fr: { title: 'Ajuster la configuration du ressort', description: 'Personnaliser le ressort dans `SharedTransition.custom()` avec des valeurs de raideur et d\'amortissement. Une raideur plus élevée fait atterrir l\'élément plus vite ; un amortissement plus faible permet un léger dépassement.' },
    code: `const transition = SharedTransition.custom((values) => {
  'worklet'
  return {
    width:  withSpring(values.targetWidth,  { stiffness: 280, damping: 30 }),
    height: withSpring(values.targetHeight, { stiffness: 280, damping: 30 }),
    originX: withSpring(values.targetOriginX, { stiffness: 280, damping: 30 }),
    originY: withSpring(values.targetOriginY, { stiffness: 280, damping: 30 }),
  }
})`,
  },
]

const flutterHeroFlutter: Step[] = [
  {
    title: 'Static layout — grid and detail screen',
    description: 'Build a grid with `GridView.builder` and a detail screen routed via `Navigator.push`. Without any Hero widget, navigating replaces the screen instantly — this is the baseline.',
    fr: { title: 'Mise en page statique — grille et écran de détail', description: 'Construire une grille avec `GridView.builder` et un écran de détail routé via `Navigator.push`. Sans widget Hero, la navigation remplace l\'écran instantanément — c\'est la ligne de base.' },
    code: `GridView.builder(
  itemBuilder: (_, i) => GestureDetector(
    onTap: () => Navigator.push(context,
      MaterialPageRoute(builder: (_) => DetailScreen(item: items[i]))),
    child: Image.network(items[i].url, fit: BoxFit.cover),
  ),
)`,
  },
  {
    title: 'Wrap in Hero for shared animation',
    description: 'Wrap the image in a `Hero` widget with the same `tag` in both grid and detail. Flutter\'s navigator automatically morphs the element between routes — no extra animation code needed.',
    fr: { title: 'Envelopper dans Hero pour l\'animation partagée', description: 'Envelopper l\'image dans un widget `Hero` avec le même `tag` dans la grille et dans le détail. Le navigateur de Flutter anime automatiquement l\'élément entre les routes — aucun code d\'animation supplémentaire n\'est nécessaire.' },
    code: `// Grid
Hero(
  tag: 'hero-\${item.id}',
  child: Image.network(item.url, fit: BoxFit.cover),
)

// Detail
Hero(
  tag: 'hero-\${item.id}',
  child: Image.network(item.url, fit: BoxFit.cover,
    width: double.infinity),
)`,
  },
  {
    title: 'Custom page route for direction control',
    description: 'Replace `MaterialPageRoute` with a custom `PageRouteBuilder`. This lets you control the page\'s enter/exit curve independently from the Hero morph, preventing jarring background flashes.',
    fr: { title: 'Route de page personnalisée pour le contrôle de direction', description: 'Remplacer `MaterialPageRoute` par un `PageRouteBuilder` personnalisé. Cela permet de contrôler la courbe d\'entrée/sortie de la page indépendamment du morphing Hero, évitant les flashs d\'arrière-plan indésirables.' },
    code: `Navigator.push(context, PageRouteBuilder(
  pageBuilder: (_, __, ___) => DetailScreen(item: item),
  transitionsBuilder: (_, anim, __, child) =>
    FadeTransition(opacity: anim, child: child),
  transitionDuration: const Duration(milliseconds: 400),
))`,
  },
  {
    title: 'Tune spring config with flightShuttleBuilder',
    description: 'Use `flightShuttleBuilder` to wrap the Hero child in a `ClipRRect` that animates border-radius during the flight. Combined with `createRectTween` using a `MaterialRectArcTween`, the morph follows an arc path.',
    fr: { title: 'Ajuster le ressort avec flightShuttleBuilder', description: 'Utiliser `flightShuttleBuilder` pour envelopper l\'enfant Hero dans un `ClipRRect` qui anime le rayon de bordure pendant le vol. Combiné avec `createRectTween` utilisant `MaterialRectArcTween`, le morphing suit une trajectoire en arc.' },
    code: `Hero(
  tag: 'hero-\${item.id}',
  createRectTween: (a, b) => MaterialRectArcTween(begin: a, end: b),
  flightShuttleBuilder: (_, anim, __, ___, ____) =>
    AnimatedBuilder(
      animation: anim,
      builder: (_, child) => ClipRRect(
        borderRadius: BorderRadius.lerp(
          BorderRadius.circular(8), BorderRadius.zero, anim.value)!,
        child: child,
      ),
      child: Image.network(item.url, fit: BoxFit.cover),
    ),
  child: Image.network(item.url, fit: BoxFit.cover),
)`,
  },
]

const flutterHero: StepMap = {
  react:          flutterHeroReact,
  nextjs:         flutterHeroNextjs,
  vue:            flutterHeroVue,
  'react-native': flutterHeroRN,
  flutter:        flutterHeroFlutter,
}

/* ─────────────────────────────────────────────────────────────────── */
/*  view-transitions                                                     */
/* ─────────────────────────────────────────────────────────────────── */

const viewTransitionsReact: Step[] = [
  {
    title: 'Baseline navigation without transition',
    description: 'Set up a simple router with two routes and confirm navigation works. Having a clean baseline means you can attribute any visual glitch to the transition layer, not the routing logic.',
    fr: { title: 'Navigation de base sans transition', description: 'Configurer un routeur simple avec deux routes et confirmer que la navigation fonctionne. Avoir une base propre signifie que tout artefact visuel peut être attribué à la couche de transition, pas à la logique de routage.' },
    code: `import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'

export function App() {
  return (
    <BrowserRouter>
      <nav><Link to="/">Home</Link> <Link to="/about">About</Link></nav>
      <Routes>
        <Route path="/"      element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}`,
  },
  {
    title: 'Wrap navigation in startViewTransition',
    description: 'Intercept `Link` clicks and call `document.startViewTransition(() => navigate(to))`. The browser captures a snapshot of the current page, renders the next page, and cross-fades by default.',
    fr: { title: 'Envelopper la navigation dans startViewTransition', description: 'Intercepter les clics sur `Link` et appeler `document.startViewTransition(() => navigate(to))`. Le navigateur capture un instantané de la page actuelle, rend la page suivante et effectue un fondu croisé par défaut.' },
    code: `import { useNavigate } from 'react-router-dom'

function TransitionLink({ to, children }) {
  const navigate = useNavigate()
  function handleClick(e) {
    e.preventDefault()
    if (!document.startViewTransition) { navigate(to); return }
    document.startViewTransition(() => navigate(to))
  }
  return <a href={to} onClick={handleClick}>{children}</a>
}`,
  },
  {
    title: 'Name the shared element',
    description: 'Add `view-transition-name` CSS to the element that should morph between pages. The browser automatically finds matching named elements on old and new pages and interpolates their layout.',
    fr: { title: 'Nommer l\'élément partagé', description: 'Ajouter la CSS `view-transition-name` à l\'élément qui doit morphoser entre les pages. Le navigateur trouve automatiquement les éléments nommés correspondants sur les anciennes et nouvelles pages et interpole leur mise en page.' },
    code: `/* index.css */
.page-hero {
  view-transition-name: hero;
}

/* In Home.tsx */
<img src={hero.src} className="page-hero" />

/* In About.tsx */
<img src={hero.src} className="page-hero" />`,
  },
  {
    title: 'Customize the animation with CSS keyframes',
    description: 'Override the `::view-transition-old` and `::view-transition-new` pseudo-elements to replace the default cross-fade with a slide. Use `animation-timing-function` to control the easing.',
    fr: { title: 'Personnaliser l\'animation avec des keyframes CSS', description: 'Surcharger les pseudo-éléments `::view-transition-old` et `::view-transition-new` pour remplacer le fondu croisé par défaut par un glissement. Utiliser `animation-timing-function` pour contrôler l\'easing.' },
    code: `@keyframes slide-in  { from { transform: translateX(100%); } }
@keyframes slide-out { to   { transform: translateX(-100%); } }

::view-transition-old(root) {
  animation: 300ms ease-in slide-out;
}
::view-transition-new(root) {
  animation: 300ms ease-out slide-in;
}`,
  },
]

const viewTransitionsNextjs: Step[] = [
  {
    title: 'Baseline navigation without transition',
    description: 'Use Next.js `<Link>` for client-side navigation between two routes. Next.js App Router already prefetches routes — this baseline confirms that prefetching and rendering work before adding transitions.',
    fr: { title: 'Navigation de base sans transition', description: 'Utiliser `<Link>` de Next.js pour la navigation côté client entre deux routes. L\'App Router Next.js précharge déjà les routes — cette base confirme que le préchargement et le rendu fonctionnent avant d\'ajouter des transitions.' },
    code: `import Link from 'next/link'

export default function Home() {
  return (
    <>
      <h1>Home</h1>
      <Link href="/about">Go to About</Link>
    </>
  )
}`,
  },
  {
    title: 'Wrap router.push in startViewTransition',
    description: 'In a Client Component, intercept navigation and call `startViewTransition` before `router.push`. React\'s concurrent renderer flushes the new route inside the transition callback.',
    fr: { title: 'Envelopper router.push dans startViewTransition', description: 'Dans un Client Component, intercepter la navigation et appeler `startViewTransition` avant `router.push`. Le moteur de rendu concurrent de React vide la nouvelle route dans le callback de transition.' },
    code: `'use client'
import { useRouter } from 'next/navigation'

export function TransitionLink({ href, children }) {
  const router = useRouter()
  function navigate() {
    if (!document.startViewTransition) { router.push(href); return }
    document.startViewTransition(() => router.push(href))
  }
  return <button onClick={navigate}>{children}</button>
}`,
  },
  {
    title: 'Name the shared element',
    description: 'Apply `view-transition-name` in a CSS module or global stylesheet. In Next.js, use `globals.css` for the pseudo-element overrides so they apply to every page without scoping issues.',
    fr: { title: 'Nommer l\'élément partagé', description: 'Appliquer `view-transition-name` dans un CSS module ou une feuille de style globale. Dans Next.js, utiliser `globals.css` pour les surcharges de pseudo-éléments afin qu\'elles s\'appliquent à toutes les pages sans problème de portée.' },
    code: `/* globals.css */
.page-hero {
  view-transition-name: hero;
  contain: layout;
}

/* Page component */
<Image src={item.src} alt="" className="page-hero"
  width={800} height={600} priority />`,
  },
  {
    title: 'Customize animation',
    description: 'Override transition keyframes in `globals.css`. Because Next.js compiles CSS at build time, these rules are available on first paint — no flash of un-animated navigation.',
    fr: { title: 'Personnaliser l\'animation', description: 'Surcharger les keyframes de transition dans `globals.css`. Comme Next.js compile le CSS au moment du build, ces règles sont disponibles dès le premier rendu — pas de flash de navigation non animée.' },
    code: `@keyframes fade-scale-in {
  from { opacity: 0; transform: scale(0.96); }
}
@keyframes fade-scale-out {
  to   { opacity: 0; transform: scale(1.04); }
}

::view-transition-old(root) {
  animation: 250ms ease-in fade-scale-out;
}
::view-transition-new(root) {
  animation: 350ms ease-out fade-scale-in;
}`,
  },
]

const viewTransitionsVue: Step[] = [
  {
    title: 'Baseline navigation without transition',
    description: 'Use Vue Router with `<RouterLink>` and confirm navigation works. The router\'s `history` mode ensures clean URLs that the View Transitions API can snapshot correctly.',
    fr: { title: 'Navigation de base sans transition', description: 'Utiliser Vue Router avec `<RouterLink>` et confirmer que la navigation fonctionne. Le mode `history` du routeur assure des URLs propres que l\'API View Transitions peut capturer correctement.' },
    code: `<!-- App.vue -->
<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
  </nav>
  <RouterView />
</template>`,
  },
  {
    title: 'Wrap navigation in startViewTransition',
    description: 'Use a Vue Router navigation guard (`router.beforeEach`) combined with a custom `RouterLink` wrapper to call `startViewTransition`. The guard ensures all navigations go through the transition.',
    fr: { title: 'Envelopper la navigation dans startViewTransition', description: 'Utiliser un guard de navigation Vue Router (`router.beforeEach`) combiné à un wrapper `RouterLink` personnalisé pour appeler `startViewTransition`. Le guard assure que toutes les navigations passent par la transition.' },
    code: `// router/index.ts
router.beforeEach((to, from, next) => {
  if (!document.startViewTransition) { next(); return }
  document.startViewTransition(() => {
    next()
    return new Promise(resolve =>
      router.afterEach(() => resolve()))
  })
})`,
  },
  {
    title: 'Name the shared element',
    description: 'Bind `view-transition-name` dynamically with `:style`. Using the item ID in the name means each card in the grid gets a unique transition name — preventing the browser from trying to morph the wrong pair.',
    fr: { title: 'Nommer l\'élément partagé', description: 'Lier `view-transition-name` dynamiquement avec `:style`. Utiliser l\'ID de l\'item dans le nom signifie que chaque carte de la grille obtient un nom de transition unique — évitant que le navigateur tente de morphoser la mauvaise paire.' },
    code: `<!-- GridCard.vue -->
<img :src="item.src"
  :style="{ viewTransitionName: \`hero-\${item.id}\` }" />

<!-- DetailHero.vue -->
<img :src="item.src"
  :style="{ viewTransitionName: \`hero-\${item.id}\` }" />`,
  },
  {
    title: 'Customize the transition',
    description: 'Override `::view-transition-old` and `::view-transition-new` in your global CSS. In Vue, put these in `main.css` so they are not scoped. Target the named element directly for element-specific timing.',
    fr: { title: 'Personnaliser la transition', description: 'Surcharger `::view-transition-old` et `::view-transition-new` dans votre CSS global. Dans Vue, les placer dans `main.css` pour qu\'ils ne soient pas scopés. Cibler l\'élément nommé directement pour un timing spécifique à l\'élément.' },
    code: `/* main.css */
::view-transition-old(root) {
  animation: 280ms ease-in both slide-out-left;
}
::view-transition-new(root) {
  animation: 350ms ease-out both slide-in-right;
}
::view-transition-image-pair(hero-1) {
  animation-duration: 400ms;
}`,
  },
]

const viewTransitionsRN: Step[] = [
  {
    title: 'Baseline navigation without transition',
    description: 'Set up a React Navigation Stack with two screens and default transitions disabled. This gives you a clean starting point — you\'ll add the animation layer step by step.',
    fr: { title: 'Navigation de base sans transition', description: 'Configurer un Stack React Navigation avec deux écrans et les transitions par défaut désactivées. Cela donne un point de départ propre — la couche d\'animation sera ajoutée étape par étape.' },
    code: `import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

export function App() {
  return (
    <Stack.Navigator screenOptions={{ animation: 'none' }}>
      <Stack.Screen name="Home"   component={HomeScreen} />
      <Stack.Screen name="Detail" component={DetailScreen} />
    </Stack.Navigator>
  )
}`,
  },
  {
    title: 'Page transition with Reanimated',
    description: 'Replace `animation: "none"` with a custom entering/exiting animation via Reanimated\'s layout animation presets. `FadeIn` and `FadeOut` are the simplest starting point before adding shared elements.',
    fr: { title: 'Transition de page avec Reanimated', description: 'Remplacer `animation: "none"` par une animation d\'entrée/sortie personnalisée via les presets d\'animation de mise en page de Reanimated. `FadeIn` et `FadeOut` sont le point de départ le plus simple avant d\'ajouter des éléments partagés.' },
    code: `import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

// Wrap screen content
<Animated.View entering={FadeIn.duration(300)} exiting={FadeOut.duration(200)}>
  {/* screen content */}
</Animated.View>`,
  },
  {
    title: 'Tag the shared element',
    description: 'Apply `sharedTransitionTag` with matching names in both screens. Reanimated 3\'s Shared Element Transition API is the React Native equivalent of the View Transitions API — it pairs elements by tag.',
    fr: { title: 'Baliser l\'élément partagé', description: 'Appliquer `sharedTransitionTag` avec des noms correspondants dans les deux écrans. L\'API Shared Element Transition de Reanimated 3 est l\'équivalent React Native de l\'API View Transitions — elle associe les éléments par balise.' },
    code: `// HomeScreen
<Animated.Image
  source={{ uri: item.uri }}
  sharedTransitionTag="detail-hero"
  style={styles.thumbnail}
/>

// DetailScreen
<Animated.Image
  source={{ uri: item.uri }}
  sharedTransitionTag="detail-hero"
  style={styles.heroImage}
/>`,
  },
  {
    title: 'Customize transitionSpec',
    description: 'Pass a `sharedTransitionStyle` with a custom spring spec. Tuning `stiffness` and `damping` separately from the page fade gives the shared element its own feel — usually slower and bouncier than the page.',
    fr: { title: 'Personnaliser transitionSpec', description: 'Passer un `sharedTransitionStyle` avec un spec de ressort personnalisé. Ajuster `stiffness` et `damping` séparément du fondu de page donne à l\'élément partagé sa propre sensation — généralement plus lente et rebondissante que la page.' },
    code: `import { SharedTransition, withSpring } from 'react-native-reanimated'

const customTransition = SharedTransition.custom((values) => {
  'worklet'
  return {
    width:   withSpring(values.targetWidth,  { stiffness: 200, damping: 24 }),
    height:  withSpring(values.targetHeight, { stiffness: 200, damping: 24 }),
    originX: withSpring(values.targetOriginX,{ stiffness: 200, damping: 24 }),
    originY: withSpring(values.targetOriginY,{ stiffness: 200, damping: 24 }),
  }
})

<Animated.Image sharedTransitionTag="detail-hero"
  sharedTransitionStyle={customTransition} />`,
  },
]

const viewTransitionsFlutter: Step[] = [
  {
    title: 'Baseline navigation without transition',
    description: 'Push a new route with `Navigator.push` and `MaterialPageRoute`. The default Material slide transition will appear — override `transitionDuration` to zero to start from a clean, instant navigation baseline.',
    fr: { title: 'Navigation de base sans transition', description: 'Pousser une nouvelle route avec `Navigator.push` et `MaterialPageRoute`. La transition de glissement Material par défaut apparaîtra — surcharger `transitionDuration` à zéro pour partir d\'une base de navigation instantanée et propre.' },
    code: `Navigator.push(context,
  MaterialPageRoute(
    builder: (_) => const DetailScreen(),
    // start from instant navigation
  ),
)`,
  },
  {
    title: 'Add page transition with PageRouteBuilder',
    description: 'Replace `MaterialPageRoute` with `PageRouteBuilder` and a `FadeTransition`. This gives you full control over the page enter/exit animation before layering Hero animations on top.',
    fr: { title: 'Ajouter une transition de page avec PageRouteBuilder', description: 'Remplacer `MaterialPageRoute` par `PageRouteBuilder` avec une `FadeTransition`. Cela donne un contrôle total sur l\'animation d\'entrée/sortie de la page avant d\'y superposer des animations Hero.' },
    code: `Navigator.push(context, PageRouteBuilder(
  pageBuilder: (_, __, ___) => const DetailScreen(),
  transitionsBuilder: (_, animation, __, child) =>
    FadeTransition(opacity: animation, child: child),
  transitionDuration: const Duration(milliseconds: 350),
))`,
  },
  {
    title: 'Wrap in Hero for shared element',
    description: 'Wrap the element in both screens in a `Hero` widget with the same `tag`. Flutter\'s navigator detects matching tags and morphs the element during the page transition automatically.',
    fr: { title: 'Envelopper dans Hero pour l\'élément partagé', description: 'Envelopper l\'élément dans les deux écrans dans un widget `Hero` avec le même `tag`. Le navigateur de Flutter détecte les balises correspondantes et morphose l\'élément pendant la transition de page automatiquement.' },
    code: `// List screen
Hero(
  tag: 'item-\${item.id}',
  child: Image.network(item.url, fit: BoxFit.cover),
)

// Detail screen
Hero(
  tag: 'item-\${item.id}',
  child: Image.network(item.url, fit: BoxFit.cover,
    width: double.infinity),
)`,
  },
  {
    title: 'Customize animation with CurvedAnimation',
    description: 'Pass `createRectTween` to the `Hero` and combine it with a `CurvedAnimation` on the page route. `Curves.easeInOutCubicEmphasized` is the Material 3 recommended curve for container transforms.',
    fr: { title: 'Personnaliser l\'animation avec CurvedAnimation', description: 'Passer `createRectTween` au `Hero` et le combiner avec une `CurvedAnimation` sur la route de page. `Curves.easeInOutCubicEmphasized` est la courbe recommandée par Material 3 pour les transformations de conteneur.' },
    code: `Hero(
  tag: 'item-\${item.id}',
  createRectTween: (a, b) => MaterialRectArcTween(begin: a, end: b),
  child: Image.network(item.url, fit: BoxFit.cover),
)

// In PageRouteBuilder
transitionsBuilder: (_, animation, __, child) => FadeTransition(
  opacity: CurvedAnimation(
    parent: animation,
    curve: Curves.easeInOutCubicEmphasized,
  ),
  child: child,
),`,
  },
]

const viewTransitions: StepMap = {
  react:          viewTransitionsReact,
  nextjs:         viewTransitionsNextjs,
  vue:            viewTransitionsVue,
  'react-native': viewTransitionsRN,
  flutter:        viewTransitionsFlutter,
}

/* ─────────────────────────────────────────────────────────────────── */
/*  flip-list                                                            */
/* ─────────────────────────────────────────────────────────────────── */

const flipListReact: Step[] = [
  {
    title: 'Static list — render items without animation',
    description: 'Render a list of items with `Array.map`. Getting the data model and key strategy right now prevents animation bugs later — React needs stable keys to pair entering and exiting elements.',
    fr: { title: 'Liste statique — afficher les items sans animation', description: 'Afficher une liste d\'items avec `Array.map`. Mettre en place le modèle de données et la stratégie de clés maintenant évite les bugs d\'animation plus tard — React a besoin de clés stables pour associer les éléments entrants et sortants.' },
    code: `export function FlipList({ items }) {
  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>{item.label}</li>
      ))}
    </ul>
  )
}`,
  },
  {
    title: 'Fade enter/exit with AnimatePresence',
    description: 'Wrap the list in `AnimatePresence` and each item in `motion.li`. When an item is removed from the array, `AnimatePresence` keeps it in the DOM until its exit animation completes.',
    fr: { title: 'Fondu d\'entrée/sortie avec AnimatePresence', description: 'Envelopper la liste dans `AnimatePresence` et chaque item dans `motion.li`. Lorsqu\'un item est retiré du tableau, `AnimatePresence` le maintient dans le DOM jusqu\'à la fin de son animation de sortie.' },
    code: `import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence>
  {items.map(item => (
    <motion.li key={item.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}>
      {item.label}
    </motion.li>
  ))}
</AnimatePresence>`,
  },
  {
    title: 'Layout animation for position changes',
    description: 'Add the `layout` prop to each `motion.li`. Framer Motion uses FLIP under the hood to animate items smoothly when they shift position after a sort or reorder.',
    fr: { title: 'Animation de mise en page pour les changements de position', description: 'Ajouter la prop `layout` à chaque `motion.li`. Framer Motion utilise FLIP en interne pour animer les items en douceur lorsqu\'ils changent de position après un tri ou un réordonnancement.' },
    code: `<AnimatePresence>
  {items.map(item => (
    <motion.li
      key={item.id}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {item.label}
    </motion.li>
  ))}
</AnimatePresence>`,
  },
  {
    title: 'Stagger + spring config',
    description: 'Add `variants` with a `staggerChildren` delay on the parent and a spring `transition` on each item. Stagger gives the eye a path to follow; spring stiffness/damping controls how items settle.',
    fr: { title: 'Décalage + configuration du ressort', description: 'Ajouter des `variants` avec un délai `staggerChildren` sur le parent et une `transition` à ressort sur chaque item. Le décalage guide le regard ; la raideur et l\'amortissement du ressort contrôlent la façon dont les items se stabilisent.' },
    code: `const list = { animate: { transition: { staggerChildren: 0.05 } } }
const item = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 28 } },
  exit:    { opacity: 0 },
}

<motion.ul variants={list} animate="animate">
  <AnimatePresence>
    {items.map(i => (
      <motion.li key={i.id} variants={item} layout>{i.label}</motion.li>
    ))}
  </AnimatePresence>
</motion.ul>`,
  },
]

const flipListNextjs: Step[] = [
  {
    title: 'Static list — render items without animation',
    description: 'In the App Router, mark the list as a Client Component since it needs client-side state for sorting/filtering. A static render baseline confirms server rendering works before adding interactivity.',
    fr: { title: 'Liste statique — afficher les items sans animation', description: 'Dans l\'App Router, marquer la liste comme Client Component car elle a besoin d\'état côté client pour le tri/filtrage. Une base de rendu statique confirme que le rendu serveur fonctionne avant d\'ajouter de l\'interactivité.' },
    code: `'use client'

export function FlipList({ items }: { items: Item[] }) {
  return (
    <ul className="list">
      {items.map(item => (
        <li key={item.id} className="list-item">
          {item.label}
        </li>
      ))}
    </ul>
  )
}`,
  },
  {
    title: 'Fade enter/exit with AnimatePresence',
    description: 'Swap `li` for `motion.li` inside `AnimatePresence`. In Next.js, this runs purely client-side — server components that fetch data pass items as props to this client component.',
    fr: { title: 'Fondu d\'entrée/sortie avec AnimatePresence', description: 'Remplacer `li` par `motion.li` dans `AnimatePresence`. Dans Next.js, cela s\'exécute entièrement côté client — les composants serveur qui récupèrent les données passent les items comme props à ce composant client.' },
    code: `'use client'
import { AnimatePresence, motion } from 'framer-motion'

<AnimatePresence>
  {items.map(item => (
    <motion.li key={item.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="list-item">
      {item.label}
    </motion.li>
  ))}
</AnimatePresence>`,
  },
  {
    title: 'Layout animation for position changes',
    description: 'Add `layout` to each item. Next.js Server Actions can reorder items via `revalidatePath` — the client component picks up the new order and Framer Motion animates items to their new positions.',
    fr: { title: 'Animation de mise en page pour les changements de position', description: 'Ajouter `layout` à chaque item. Les Server Actions Next.js peuvent réordonner les items via `revalidatePath` — le composant client reçoit le nouvel ordre et Framer Motion anime les items vers leurs nouvelles positions.' },
    code: `<AnimatePresence>
  {items.map(item => (
    <motion.li
      key={item.id}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {item.label}
    </motion.li>
  ))}
</AnimatePresence>`,
  },
  {
    title: 'Stagger + spring config',
    description: 'Add `layoutId` in combination with stagger variants for a polished list. In Next.js, memoize the variant objects outside the component so they are not recreated on every render.',
    fr: { title: 'Décalage + configuration du ressort', description: 'Ajouter `layoutId` combiné à des variants de décalage pour une liste soignée. Dans Next.js, mémoriser les objets variant en dehors du composant pour éviter de les recréer à chaque rendu.' },
    code: `const listVariants = { animate: { transition: { staggerChildren: 0.06 } } }
const itemVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0,
    transition: { type: 'spring', stiffness: 320, damping: 30 } },
  exit: { opacity: 0 },
}

<motion.ul variants={listVariants} animate="animate">
  <AnimatePresence>
    {items.map(i => (
      <motion.li key={i.id} layout variants={itemVariants}>{i.label}</motion.li>
    ))}
  </AnimatePresence>
</motion.ul>`,
  },
]

const flipListVue: Step[] = [
  {
    title: 'Static list — render items without animation',
    description: 'Use `v-for` with a stable `:key`. Vue requires a key on transitioned list items — without it, the transition group cannot distinguish entering from moving elements.',
    fr: { title: 'Liste statique — afficher les items sans animation', description: 'Utiliser `v-for` avec un `:key` stable. Vue exige une clé sur les éléments de liste transitionés — sans elle, le groupe de transition ne peut pas distinguer les éléments entrants des éléments en mouvement.' },
    code: `<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.label }}
    </li>
  </ul>
</template>`,
  },
  {
    title: 'Fade enter/exit with TransitionGroup',
    description: 'Replace `<ul>` with `<TransitionGroup tag="ul">`. Vue animates elements entering and leaving the list using CSS classes — no JavaScript animation loop needed.',
    fr: { title: 'Fondu d\'entrée/sortie avec TransitionGroup', description: 'Remplacer `<ul>` par `<TransitionGroup tag="ul">`. Vue anime les éléments entrant et sortant de la liste avec des classes CSS — aucune boucle d\'animation JavaScript n\'est nécessaire.' },
    code: `<TransitionGroup tag="ul" name="fade">
  <li v-for="item in items" :key="item.id">
    {{ item.label }}
  </li>
</TransitionGroup>

<style>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>`,
  },
  {
    title: 'Layout animation with move-class',
    description: 'Add a `move-class` to `TransitionGroup`. When items reorder, Vue applies this class to elements that change position, enabling CSS to animate them from their old to new coordinates.',
    fr: { title: 'Animation de mise en page avec move-class', description: 'Ajouter une `move-class` à `TransitionGroup`. Lorsque les items se réordonnent, Vue applique cette classe aux éléments qui changent de position, permettant au CSS de les animer de leurs anciennes vers leurs nouvelles coordonnées.' },
    code: `<TransitionGroup tag="ul" name="fade" move-class="item-move">
  <li v-for="item in items" :key="item.id">{{ item.label }}</li>
</TransitionGroup>

<style>
.item-move { transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
.fade-leave-active { position: absolute; }
</style>`,
  },
  {
    title: 'Stagger + spring timing',
    description: 'Use the `:css="false"` mode with a JavaScript hook and a stagger delay based on element index. For spring-like easing, use `cubic-bezier(0.34, 1.56, 0.64, 1)` — CSS\'s closest approximation to a spring.',
    fr: { title: 'Décalage + timing à ressort', description: 'Utiliser le mode `:css="false"` avec un hook JavaScript et un délai de décalage basé sur l\'index de l\'élément. Pour un easing semblable à un ressort, utiliser `cubic-bezier(0.34, 1.56, 0.64, 1)` — l\'approximation CSS la plus proche d\'un ressort.' },
    code: `<TransitionGroup tag="ul" :css="false"
  @enter="onEnter" @leave="onLeave">
  <li v-for="(item, i) in items" :key="item.id"
    :data-index="i">{{ item.label }}</li>
</TransitionGroup>

<script setup>
function onEnter(el, done) {
  const i = +el.dataset.index
  el.animate(
    [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
    { duration: 350, delay: i * 50,
      easing: 'cubic-bezier(0.34, 1.56, 0.64, 1)', fill: 'backwards' }
  ).onfinish = done
}
</script>`,
  },
]

const flipListRN: Step[] = [
  {
    title: 'Static list — FlatList without animation',
    description: 'Use `FlatList` with a stable `keyExtractor`. FlatList virtualizes the list for performance — animations must work with this virtualization to avoid items disappearing when they scroll off screen.',
    fr: { title: 'Liste statique — FlatList sans animation', description: 'Utiliser `FlatList` avec un `keyExtractor` stable. FlatList virtualise la liste pour les performances — les animations doivent fonctionner avec cette virtualisation pour éviter que les items disparaissent en défilant hors de l\'écran.' },
    code: `<FlatList
  data={items}
  keyExtractor={item => item.id}
  renderItem={({ item }) => (
    <View style={styles.item}>
      <Text>{item.label}</Text>
    </View>
  )}
/>`,
  },
  {
    title: 'Fade enter/exit with layout animations',
    description: 'Switch to `Animated.FlatList` and add `entering` / `exiting` presets to each item. Reanimated handles the animation on the UI thread so scrolling stays smooth even during add/remove.',
    fr: { title: 'Fondu d\'entrée/sortie avec animations de mise en page', description: 'Passer à `Animated.FlatList` et ajouter les presets `entering` / `exiting` à chaque item. Reanimated gère l\'animation sur le thread UI pour que le défilement reste fluide même pendant les ajouts/suppressions.' },
    code: `import Animated, { FadeIn, FadeOut } from 'react-native-reanimated'

function ListItem({ item }) {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Text>{item.label}</Text>
    </Animated.View>
  )
}`,
  },
  {
    title: 'Layout animation for reorder',
    description: 'Add `layout={LinearTransition}` to each item. When the data array reorders, Reanimated calculates the delta between old and new positions and animates each item along that path.',
    fr: { title: 'Animation de mise en page pour le réordonnancement', description: 'Ajouter `layout={LinearTransition}` à chaque item. Lorsque le tableau de données se réordonne, Reanimated calcule le delta entre les anciennes et nouvelles positions et anime chaque item le long de cette trajectoire.' },
    code: `import Animated, {
  FadeIn, FadeOut, LinearTransition
} from 'react-native-reanimated'

<Animated.View
  entering={FadeIn}
  exiting={FadeOut}
  layout={LinearTransition}
>
  <Text>{item.label}</Text>
</Animated.View>`,
  },
  {
    title: 'Stagger + spring config',
    description: 'Combine `FadeInDown.delay(index * 50)` for stagger with a spring-based layout transition. `SpringTransition` from Reanimated gives each repositioned item a physical, overshooting feel.',
    fr: { title: 'Décalage + configuration du ressort', description: 'Combiner `FadeInDown.delay(index * 50)` pour le décalage avec une transition de mise en page à ressort. `SpringTransition` de Reanimated donne à chaque item repositionné une sensation physique avec léger dépassement.' },
    code: `import Animated, {
  FadeInDown, FadeOut, SpringTransition
} from 'react-native-reanimated'

function ListItem({ item, index }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()
        .stiffness(300).damping(28)}
      exiting={FadeOut.duration(200)}
      layout={SpringTransition.stiffness(300).damping(28)}
    >
      <Text>{item.label}</Text>
    </Animated.View>
  )
}`,
  },
]

const flipListFlutter: Step[] = [
  {
    title: 'Static list — ListView without animation',
    description: 'Use `ListView.builder` to render items. Using a builder constructor is essential for large lists — `AnimatedList` also has a builder API, so the migration in later steps is straightforward.',
    fr: { title: 'Liste statique — ListView sans animation', description: 'Utiliser `ListView.builder` pour afficher les items. L\'utilisation d\'un constructeur builder est essentielle pour les grandes listes — `AnimatedList` dispose également d\'une API builder, donc la migration dans les étapes suivantes est simple.' },
    code: `ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, index) => ListTile(
    key: ValueKey(items[index].id),
    title: Text(items[index].label),
  ),
)`,
  },
  {
    title: 'Fade enter/exit with AnimatedList',
    description: 'Replace `ListView.builder` with `AnimatedList` and a `GlobalKey`. Call `insertItem` and `removeItem` instead of mutating the list directly — Flutter plays the specified transition animation on each call.',
    fr: { title: 'Fondu d\'entrée/sortie avec AnimatedList', description: 'Remplacer `ListView.builder` par `AnimatedList` avec une `GlobalKey`. Appeler `insertItem` et `removeItem` au lieu de muter la liste directement — Flutter joue l\'animation de transition spécifiée à chaque appel.' },
    code: `final _listKey = GlobalKey<AnimatedListState>();

AnimatedList(
  key: _listKey,
  initialItemCount: items.length,
  itemBuilder: (context, index, animation) =>
    FadeTransition(
      opacity: animation,
      child: ListTile(title: Text(items[index].label)),
    ),
)

void addItem(Item item) {
  items.insert(0, item);
  _listKey.currentState!.insertItem(0);
}`,
  },
  {
    title: 'Layout animation with AnimatedList reorder',
    description: 'For reordering, remove the item at its old index and reinsert at the new index. Flutter\'s `AnimatedList` animates both operations — the remove plays an exit, the insert plays an entrance.',
    fr: { title: 'Animation de mise en page avec réordonnancement AnimatedList', description: 'Pour le réordonnancement, supprimer l\'item à son ancien index et le réinsérer au nouvel index. L\'`AnimatedList` de Flutter anime les deux opérations — la suppression joue une sortie, l\'insertion joue une entrée.' },
    code: `void reorder(int oldIndex, int newIndex) {
  final item = items.removeAt(oldIndex);
  _listKey.currentState!.removeItem(oldIndex,
    (context, animation) => SizeTransition(
      sizeFactor: animation,
      child: ListTile(title: Text(item.label)),
    ));
  items.insert(newIndex, item);
  _listKey.currentState!.insertItem(newIndex);
}`,
  },
  {
    title: 'Stagger + spring timing',
    description: 'Pass a `CurvedAnimation` with an interval-based curve to each item\'s transition for stagger. Wrapping in `SlideTransition` and `FadeTransition` in sequence gives a spring-like enter that pairs well with the reorder animation.',
    fr: { title: 'Décalage + timing à ressort', description: 'Passer une `CurvedAnimation` avec une courbe basée sur des intervalles à la transition de chaque item pour le décalage. Enchaîner `SlideTransition` et `FadeTransition` donne une entrée semblable à un ressort qui se marie bien avec l\'animation de réordonnancement.' },
    code: `itemBuilder: (context, index, animation) {
  final curved = CurvedAnimation(
    parent: animation,
    curve: Interval(index * 0.05, 1.0,
      curve: Curves.easeOutBack),
  );
  return SlideTransition(
    position: Tween<Offset>(
      begin: const Offset(0, 0.3), end: Offset.zero,
    ).animate(curved),
    child: FadeTransition(
      opacity: curved,
      child: ListTile(title: Text(items[index].label)),
    ),
  );
},`,
  },
]

const flipList: StepMap = {
  react:          flipListReact,
  nextjs:         flipListNextjs,
  vue:            flipListVue,
  'react-native': flipListRN,
  flutter:        flipListFlutter,
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
  'pan-dismiss':       panDismiss,
  'flutter-hero':      flutterHero,
  'view-transitions':  viewTransitions,
  'flip-list':         flipList,
}

export function getSteps(slug: string, platform: PlatformId): Step[] {
  return ALL_STEPS[slug]?.[platform] ?? []
}
