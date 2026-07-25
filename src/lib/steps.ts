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
      title: 'Render the static element',
      description: 'Start with a plain `div` and get the layout, spacing, and styles exactly right *before* introducing any motion. **Every good animation begins from a working static state** — if the element looks correct here, you only have one variable to reason about later. The element renders immediately at full opacity, and this is the visual baseline we animate *from*.',
      fr: {
        title: 'Rendre l\'élément statique',
        description: 'Commencez par un `div` simple et réglez la mise en page, les espacements et les styles *avant* d\'introduire le moindre mouvement. **Toute bonne animation part d\'un état statique fonctionnel** — si l\'élément est correct ici, il ne reste qu\'une seule variable à raisonner ensuite. L\'élément s\'affiche immédiatement en opacité totale : c\'est la base visuelle depuis laquelle nous animons.',
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
      title: 'Swap in motion.div',
      description: 'Replace the `div` with `motion.div` and declare an `initial` and `animate` state — Framer Motion **animates the difference between them automatically**. The element now fades from invisible to visible on every mount, which proves the motion library is wired up correctly. There is *no scroll awareness yet*; it simply plays once when the component appears.',
      fr: {
        title: 'Passer à motion.div',
        description: 'Remplacez le `div` par `motion.div` et déclarez un état `initial` et `animate` — Framer Motion **anime automatiquement la différence entre les deux**. L\'élément passe maintenant d\'invisible à visible à chaque montage, ce qui prouve que la bibliothèque de mouvement est bien branchée. Il n\'y a *aucune conscience du scroll* pour l\'instant : il se joue une fois à l\'apparition du composant.',
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
      description: 'Adding `y: 32` to `initial` gives the fade a **direction of travel**, so the element rises into place instead of just appearing — motion that has an origin reads as intentional. The *easing curve* matters even more than the distance: `[0.22, 1, 0.36, 1]` starts fast and decelerates, mirroring how real objects settle under momentum. **A linear fade always feels mechanical**, which is why this curve is the single biggest quality upgrade here.',
      fr: {
        title: 'Ajouter une direction de glissement',
        description: 'Ajouter `y: 32` à `initial` donne au fondu une **direction de déplacement** : l\'élément s\'élève en place au lieu de simplement apparaître, et un mouvement qui a une origine paraît intentionnel. La *courbe d\'accélération* compte encore plus que la distance : `[0.22, 1, 0.36, 1]` démarre vite puis décélère, imitant la façon dont un objet réel se stabilise sous son élan. **Un fondu linéaire paraît toujours mécanique**, c\'est pourquoi cette courbe est ici le plus grand gain de qualité.',
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
      description: 'This is the step that turns a *mount animation* into a true **scroll reveal**. `useInView` wraps an `IntersectionObserver`, so the browser — not a scroll listener — tells you when the element is near the viewport; the `margin: \'-80px\'` fires it *80px early* so the motion is already underway by the time the user looks. With `once: true` the reveal plays a single time, and a `delay` prop lets siblings **stagger** into view, which guides the eye through the content in sequence.',
      fr: {
        title: 'Déclencher au scroll + cascade',
        description: 'C\'est l\'étape qui transforme une *animation au montage* en véritable **révélation au scroll**. `useInView` enveloppe un `IntersectionObserver` : c\'est le navigateur — pas un écouteur de scroll — qui signale que l\'élément approche du viewport, et le `margin: \'-80px\'` le déclenche *80px en avance* pour que le mouvement soit déjà en cours quand l\'utilisateur regarde. Avec `once: true` la révélation ne joue qu\'une fois, et une prop `delay` permet de faire **cascader** les frères, ce qui guide l\'œil à travers le contenu de façon séquentielle.',
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
      description: 'The App Router renders components on the **server by default**, where there is no DOM and no hooks like `useRef` or `useInView`. Declaring `\'use client\'` opts this component into the browser runtime so those APIs actually exist at runtime. The key insight: this directive marks a *boundary*, not a whole page — Server Components can freely import and render it, and only this leaf ships JavaScript to the client.',
      fr: { title: 'Ajouter la directive client', description: 'L\'App Router rend les composants **côté serveur par défaut**, où il n\'y a ni DOM ni hooks comme `useRef` ou `useInView`. Déclarer `\'use client\'` fait basculer ce composant vers le runtime navigateur pour que ces APIs existent réellement à l\'exécution. L\'idée clé : cette directive marque une *frontière*, pas une page entière — les Server Components peuvent l\'importer librement, et seule cette feuille envoie du JavaScript au client.' },
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
      description: 'Once the client boundary exists, the motion code is **identical to plain React** — `initial`, `animate`, and `transition` behave exactly the same. That symmetry is the real lesson here: Framer Motion is *framework-agnostic*, so the only Next.js-specific cost is the `\'use client\'` directive at the top. Everything you learn in one environment carries directly to the other.',
      fr: { title: 'Ajouter motion.div', description: 'Une fois la frontière client en place, le code de mouvement est **identique au React classique** — `initial`, `animate` et `transition` se comportent exactement pareil. Cette symétrie est la vraie leçon : Framer Motion est *agnostique du framework*, donc le seul coût propre à Next.js est la directive `\'use client\'` en haut. Tout ce que vous apprenez dans un environnement se transpose directement à l\'autre.' },
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
      description: 'Adding the `y` offset and the `[0.22, 1, 0.36, 1]` cubic-bezier gives the reveal the same **rise-and-settle** feel as the React version. There is a routing subtlety worth knowing: this animation fires on every *mount*, and in Next.js a **hard navigation remounts the page**, so users replay the reveal each time they arrive fresh. Soft client transitions keep the component alive and *won\'t* retrigger it — a distinction that explains most "why did my animation stop playing?" confusion.',
      fr: { title: 'Ajouter le glissement + easing', description: 'Ajouter le décalage `y` et le cubic-bezier `[0.22, 1, 0.36, 1]` donne à la révélation le même effet de **montée et stabilisation** que la version React. Une subtilité de routage mérite d\'être connue : cette animation se joue à chaque *montage*, et dans Next.js une **navigation dure remonte la page**, donc les utilisateurs rejouent la révélation à chaque arrivée à neuf. Les transitions client douces gardent le composant en vie et ne la *redéclenchent pas* — une distinction qui explique la plupart des confusions du type « pourquoi mon animation ne joue plus ? ».' },
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
      description: 'Wiring in `useInView` finally ties the reveal to the **scroll position** rather than the mount, and packaging it as a reusable export is what makes it practical. By exporting from a dedicated `\'use client\'` file, *any* Server Component page can drop it in — the client boundary travels with the component, so consumers never think about it. The `delay` prop then **staggers siblings declaratively**, letting you choreograph a whole section with nothing but numbers.',
      fr: { title: 'Connecter useInView + cascade', description: 'Brancher `useInView` rattache enfin la révélation à la **position de scroll** plutôt qu\'au montage, et l\'empaqueter en export réutilisable est ce qui la rend pratique. En l\'exportant depuis un fichier `\'use client\'` dédié, *n\'importe quelle* page Server Component peut l\'insérer — la frontière client voyage avec le composant, donc les consommateurs n\'y pensent jamais. La prop `delay` permet ensuite de **cascader les frères de façon déclarative**, orchestrant toute une section avec de simples nombres.' },
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
      description: 'Begin with the markup alone, no motion at all — in Vue 3 the `<template>` block holds the structure and `<slot />` forwards whatever the parent passes in. **Nailing the static layout first means any later glitch is an animation bug, not a layout bug**, which keeps debugging simple. This is the *visual baseline* every transition will animate away from.',
      fr: { title: 'Div template simple', description: 'Commencez par le seul balisage, sans aucun mouvement — en Vue 3 le bloc `<template>` contient la structure et `<slot />` transmet ce que le parent fournit. **Verrouiller la mise en page statique d\'abord garantit que tout défaut ultérieur est un bug d\'animation, pas de mise en page**, ce qui simplifie le débogage. C\'est la *base visuelle* depuis laquelle chaque transition animera.' },
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
      description: 'This step introduces Vue\'s core animation pattern: **drive a style from reactive state and let CSS interpolate the change**. An `isVisible` ref bound through `:style` flips from `0` to `1`, and because a CSS `transition` is declared, the browser tweens the opacity *for free* on the compositor. Toggling the flag in `onMounted` plays the reveal once the element exists — *state changes, the DOM follows*, which is the mental model behind nearly every Vue transition.',
      fr: { title: 'Lier l\'opacité à un flag réactif', description: 'Cette étape introduit le motif d\'animation central de Vue : **piloter un style depuis un état réactif et laisser CSS interpoler le changement**. Un ref `isVisible` lié via `:style` passe de `0` à `1`, et comme une `transition` CSS est déclarée, le navigateur anime l\'opacité *gratuitement* sur le compositeur. Basculer le flag dans `onMounted` joue la révélation dès que l\'élément existe — *l\'état change, le DOM suit*, le modèle mental derrière presque toutes les transitions Vue.' },
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
      description: 'Moving the inline styles into a `computed` keeps the template clean and lets us add `transform: translateY` alongside opacity, so the element **slides and fades as one gesture**. The easing is the exact same `cubic-bezier(0.22,1,0.36,1)` string Framer Motion uses — a reminder that *easing curves are a web-platform primitive*, not a library feature. Animating `transform` and `opacity` (rather than layout properties) keeps the whole reveal on the **GPU compositor**, so it stays smooth even on cheap devices.',
      fr: { title: 'Ajouter translateY', description: 'Déplacer les styles inline dans un `computed` garde le template propre et permet d\'ajouter `transform: translateY` à côté de l\'opacité, pour que l\'élément **glisse et s\'estompe d\'un seul geste**. L\'accélération est exactement la même chaîne `cubic-bezier(0.22,1,0.36,1)` qu\'utilise Framer Motion — un rappel que les *courbes d\'accélération sont une primitive de la plateforme web*, pas une fonctionnalité de bibliothèque. Animer `transform` et `opacity` (plutôt que des propriétés de mise en page) garde toute la révélation sur le **compositeur GPU**, donc fluide même sur les appareils modestes.' },
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
      description: 'Swapping `onMounted` for **`useIntersectionObserver`** from VueUse is what turns a mount animation into a real scroll reveal — the flag now flips when the element actually *enters the viewport*, not when it\'s created. Calling `stop()` after the first intersection disconnects the observer, which is both the `{ once: true }` behavior and a small **performance win**: no idle observer lingering on the page. Leaning on a composable here is idiomatic Vue — *the messy observer lifecycle is hidden behind a clean reactive surface*.',
      fr: { title: 'Déclenchement au scroll avec VueUse', description: 'Remplacer `onMounted` par **`useIntersectionObserver`** de VueUse est ce qui transforme une animation au montage en véritable révélation au scroll — le flag bascule désormais quand l\'élément *entre réellement dans le viewport*, et non à sa création. Appeler `stop()` après la première intersection déconnecte l\'observateur, ce qui constitue à la fois le comportement `{ once: true }` et un petit **gain de performance** : aucun observateur inactif ne traîne sur la page. S\'appuyer sur un composable ici est du Vue idiomatique — *le cycle de vie complexe de l\'observateur est masqué derrière une surface réactive propre*.' },
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
      description: 'Start with a bare `View`, the native equivalent of a `div`. The crucial difference from the web: **React Native has no DOM and therefore no `IntersectionObserver`**, so you can\'t key an animation off scroll position the same way. Instead the reveal will hang off the `onLayout` callback — *the moment the element is measured and placed* — which is why the component is named `RevealOnMount` rather than on scroll.',
      fr: { title: 'View simple', description: 'Commencez avec un `View` nu, l\'équivalent natif d\'un `div`. La différence cruciale avec le web : **React Native n\'a pas de DOM, donc pas d\'`IntersectionObserver`**, on ne peut pas accrocher une animation à la position de scroll de la même manière. La révélation s\'appuiera plutôt sur le callback `onLayout` — *le moment où l\'élément est mesuré et placé* — d\'où le nom `RevealOnMount` plutôt qu\'au scroll.' },
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
      description: 'Reanimated\'s **`useSharedValue`** is the heart of why it feels native: these values live on the **UI thread**, so animations that read them run *without ever crossing the JS bridge*. That matters because the JS thread can be busy or janky, yet a shared-value animation keeps hitting 60fps regardless. Here we declare two — one for `opacity`, one for `translateY` — seeded at their *hidden* starting state, ready to be driven toward visible.',
      fr: { title: 'Créer des valeurs partagées', description: '**`useSharedValue`** de Reanimated est au cœur de son rendu natif : ces valeurs vivent sur le **thread UI**, donc les animations qui les lisent s\'exécutent *sans jamais traverser le pont JS*. C\'est déterminant, car le thread JS peut être occupé ou saccadé, alors qu\'une animation par valeur partagée tient le 60fps quoi qu\'il arrive. Ici on en déclare deux — une pour `opacity`, une pour `translateY` — initialisées à leur état *caché*, prêtes à être menées vers visible.' },
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
      description: 'The `onLayout` callback fires *exactly once* when the element is first measured, giving a precise, **timer-free trigger** for the reveal — far more reliable than guessing with a `setTimeout`. Inside it, `withTiming` animates each shared value toward its visible target, and `Easing.bezier(0.22, 1, 0.36, 1)` reuses the same curve as every other platform here. The glue is `useAnimatedStyle`: it *subscribes to the shared values on the UI thread* and produces the style object, so the whole animation runs natively without involving React re-renders.',
      fr: { title: 'Animer au layout', description: 'Le callback `onLayout` se déclenche *exactement une fois* quand l\'élément est d\'abord mesuré, offrant un **déclencheur sans minuterie** précis pour la révélation — bien plus fiable qu\'un `setTimeout` approximatif. À l\'intérieur, `withTiming` anime chaque valeur partagée vers sa cible visible, et `Easing.bezier(0.22, 1, 0.36, 1)` réutilise la même courbe que toutes les autres plateformes ici. Le liant est `useAnimatedStyle` : il *s\'abonne aux valeurs partagées sur le thread UI* et produit l\'objet de style, donc toute l\'animation s\'exécute nativement sans déclencher de re-render React.' },
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
      description: 'Reanimated\'s animation helpers **compose**, and `withDelay` is the proof: wrap any existing `withTiming` and it simply defers the start by the given milliseconds — no rewrite, no extra state. Exposing that as a `delay` prop pushes orchestration *up to the parent*, so a cascade is just three instances with increasing delays rather than a dedicated stagger hook. This composability — *animations as values you can wrap and nest* — is what makes Reanimated scale to complex sequences.',
      fr: { title: 'Ajouter une prop delay pour la cascade', description: 'Les helpers d\'animation de Reanimated **se composent**, et `withDelay` en est la preuve : enveloppez n\'importe quel `withTiming` existant et il diffère simplement le départ du nombre de millisecondes donné — sans réécriture ni état supplémentaire. Exposer cela en prop `delay` remonte l\'orchestration *vers le parent*, donc une cascade n\'est que trois instances aux délais croissants, sans hook de stagger dédié. Cette composabilité — *des animations comme des valeurs que l\'on enveloppe et imbrique* — est ce qui permet à Reanimated de gérer des séquences complexes.' },
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
      description: 'Flutter animations need a **`StatefulWidget`** because an `AnimationController` holds live resources that must be created in `initState` and released in `dispose` — a `StatelessWidget` has no place to hang that lifecycle. Starting with just the scaffold, before any animation logic, makes the lifecycle hooks visible and gives the controller a *home to be born and die in*. **Skipping disposal later leaks the controller**, so building this structure first is what keeps the animation memory-safe.',
      fr: { title: 'Structure StatefulWidget', description: 'Les animations Flutter exigent un **`StatefulWidget`** car un `AnimationController` détient des ressources vivantes à créer dans `initState` et à libérer dans `dispose` — un `StatelessWidget` n\'a nulle part où accrocher ce cycle de vie. Commencer par la seule structure, avant toute logique d\'animation, rend les hooks de cycle de vie visibles et donne au contrôleur *un foyer où naître et mourir*. **Oublier la libération plus tard fait fuir le contrôleur**, donc bâtir cette structure d\'abord est ce qui garde l\'animation sûre en mémoire.' },
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
      description: 'The **`AnimationController`** is Flutter\'s clock: it ticks a value from `0` to `1` over a duration, and *everything else reads off it* — conceptually the `useMotionValue(0)` you animate toward 1. A `Tween` maps that raw `0→1` onto a real range and `CurvedAnimation` bends it through an easing curve, while **`FadeTransition`** subscribes and rebuilds *only the opacity* — far cheaper than wrapping the child in `setState`. Calling `_ctrl.forward()` in `initState` plays the reveal the moment the widget mounts.',
      fr: { title: 'Ajouter AnimationController + FadeTransition', description: 'L\'**`AnimationController`** est l\'horloge de Flutter : il fait avancer une valeur de `0` à `1` sur une durée, et *tout le reste s\'y réfère* — conceptuellement le `useMotionValue(0)` que vous animez vers 1. Un `Tween` mappe ce `0→1` brut sur une plage réelle et `CurvedAnimation` le courbe via une courbe d\'accélération, tandis que **`FadeTransition`** s\'abonne et ne reconstruit *que l\'opacité* — bien moins coûteux qu\'envelopper l\'enfant dans un `setState`. Appeler `_ctrl.forward()` dans `initState` joue la révélation dès le montage du widget.' },
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
      description: '**`SlideTransition`** adds the *rise* that pairs with the fade, but its offset is **fractional, not pixel-based** — `Offset(0, 0.1)` means "10% of my own height below", so `translateY: 32px` on a 320px element. That relative model is a feature: the slide *scales with the widget*, staying proportional across screen sizes without hardcoded distances. Because the new `_slide` animation shares the **same `_ctrl`**, the fade and slide are perfectly synchronized by construction.',
      fr: { title: 'Ajouter SlideTransition', description: '**`SlideTransition`** ajoute la *montée* qui accompagne le fondu, mais son décalage est **fractionnaire, pas en pixels** — `Offset(0, 0.1)` signifie « 10 % de ma propre hauteur en dessous », soit `translateY: 32px` sur un élément de 320px. Ce modèle relatif est un atout : le glissement *s\'adapte au widget*, restant proportionnel sur toutes les tailles d\'écran sans distances codées en dur. Comme la nouvelle animation `_slide` partage le **même `_ctrl`**, le fondu et le glissement sont parfaitement synchronisés par construction.' },
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
      description: 'A `delay` parameter plus **`Future.delayed`** defers the controller\'s `forward()` call, so passing increasing delays to siblings produces a **staggered cascade** from the parent. The easy-to-miss but critical detail is the **`mounted` check**: if the user navigates away before the delay fires, calling `forward()` on a disposed controller *throws*. Guarding with `if (mounted)` makes the stagger **safe under fast navigation** — exactly the kind of lifecycle edge case Flutter forces you to handle explicitly.',
      fr: { title: 'Ajouter un délai pour la cascade', description: 'Un paramètre `delay` plus **`Future.delayed`** diffère l\'appel `forward()` du contrôleur, donc passer des délais croissants aux frères produit une **cascade décalée** depuis le parent. Le détail facile à manquer mais essentiel est la **vérification `mounted`** : si l\'utilisateur quitte avant la fin du délai, appeler `forward()` sur un contrôleur libéré *lève une exception*. Se protéger avec `if (mounted)` rend la cascade **sûre en navigation rapide** — exactement le genre de cas limite de cycle de vie que Flutter oblige à gérer explicitement.' },
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
      description: 'Two views are controlled by a single `useState` boolean, and a ternary picks which component to render. When the state flips, React **unmounts** the old tree and **mounts** the new one in the same frame — visually jarring because nothing eases the cut. This is the *baseline* we improve on: every animation step from here exists to soften this abrupt swap.',
      fr: { title: 'Changement d\'état instantané', description: 'Deux vues sont contrôlées par un seul booléen `useState`, et un ternaire choisit quel composant afficher. Quand l\'état bascule, React **démonte** l\'ancien arbre et **monte** le nouveau dans la même frame — brutal car rien n\'adoucit la coupure. C\'est la *base* que nous améliorons : chaque étape d\'animation qui suit existe pour atténuer cet échange abrupt.' },
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
      description: 'Normally React removes a component from the DOM the instant it stops being rendered, leaving no chance to animate it out. `AnimatePresence` solves this by *keeping* a leaving child alive until its `exit` animation finishes, then unmounting it. At this stage there is no `exit` prop yet, so nothing is visible — but the **plumbing that defers unmounting** is now in place, which is the hard part.',
      fr: { title: 'Envelopper dans AnimatePresence', description: 'Normalement React retire un composant du DOM dès qu\'il cesse d\'être rendu, sans laisser le temps de l\'animer en sortie. `AnimatePresence` résout cela en *gardant* un enfant sortant en vie jusqu\'à la fin de son animation `exit`, puis le démonte. À ce stade il n\'y a pas encore de prop `exit`, donc rien n\'est visible — mais la **plomberie qui diffère le démontage** est en place, et c\'est le plus dur.' },
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
      description: 'Each page becomes a `motion.div` declaring three states: `initial` (where it starts before mounting), `animate` (its resting state), and `exit` (where it animates to before unmounting). The `key` prop is the linchpin — React uses it to tell *which* child changed, and `AnimatePresence` keys off the same value to know an element left and a new one arrived. Without distinct keys, no enter/exit fires.',
      fr: { title: 'Ajouter initial + exit à la page', description: 'Chaque page devient un `motion.div` déclarant trois états : `initial` (le point de départ avant le montage), `animate` (l\'état de repos) et `exit` (vers où elle anime avant le démontage). La prop `key` est le pivot — React s\'en sert pour savoir *quel* enfant a changé, et `AnimatePresence` se base sur la même valeur pour détecter qu\'un élément est parti et qu\'un nouveau est arrivé. Sans clés distinctes, aucune entrée/sortie ne se déclenche.' },
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
      description: 'By default `AnimatePresence` runs exit and enter *simultaneously*, so two pages briefly stack on top of each other. Setting `mode="wait"` serializes them — the old page fully leaves before the new one begins — which keeps layout clean inside a `relative`/`overflow: hidden` container. Adding a `y` offset turns the swap **directional**: the old page lifts up and out while the new one rises in from below, giving the motion a sense of forward flow.',
      fr: { title: 'Ajouter mode="wait" et glissement directionnel', description: 'Par défaut `AnimatePresence` joue la sortie et l\'entrée *simultanément*, donc deux pages se chevauchent un instant. Définir `mode="wait"` les sérialise — l\'ancienne page part entièrement avant que la nouvelle commence — ce qui garde la mise en page propre dans un conteneur `relative`/`overflow: hidden`. Ajouter un décalage `y` rend l\'échange **directionnel** : l\'ancienne page s\'élève et sort tandis que la nouvelle monte par le bas, donnant au mouvement une impression de progression.' },
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
      description: 'In the App Router there is no single component that re-mounts on navigation, so you need a value that *changes* with the URL to drive transitions. `usePathname` from `next/navigation` returns the current path as a string (e.g. `/work/project-1`) and re-renders whenever it changes. That string becomes the **stable identity key** React and `AnimatePresence` use to tell one page from the next.',
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
      description: 'Animations require client-side state, so `AnimatePresence` must live in a **Client Component** (`\'use client\'`) — here a wrapper mounted inside `app/layout.tsx`. Passing `pathname` as the `key` is what makes route changes animatable: React sees a different key as an entirely new child, so the old one runs its `exit` → enter sequence. Doing this in the layout means **every route inherits the transition** without touching individual pages.',
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
      description: 'Swapping the plain `div` for a `motion.div` activates the actual animation: `initial` sets the off-screen starting state, `animate` the resting state, and `exit` where it goes on the way out. Because this wrapper sits in the layout and is keyed by `pathname`, **every page in the app gets the transition for free** — a single declaration replaces per-page animation code. The custom `ease` cubic-bezier gives the slide a polished, decelerating feel.',
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
      description: 'This is the payoff of Next.js\'s **server/client boundary**: `RootLayout` stays a Server Component (no `\'use client\'`) and simply renders the client `LayoutWrapper` as a child. The `{children}` it passes are server-rendered page components that **stream to the browser without waiting on the client bundle** — you get fast first paint *and* animated transitions. Mixing the two component types like this is the idiomatic App Router pattern.',
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
      description: '`<RouterView>` is the outlet where Vue Router renders whichever component matches the current URL. Out of the box the swap is **instant**: the leaving component unmounts and the entering one mounts in the same tick, with no easing between them. Seeing this raw behaviour first makes it clear *what* the `<Transition>` wrapper in the next steps actually buys you.',
      fr: { title: 'RouterView instantané', description: '`<RouterView>` est la sortie où Vue Router affiche le composant correspondant à l\'URL actuelle. Par défaut l\'échange est **instantané** : le composant sortant est démonté et l\'entrant monté dans le même tick, sans aucun adoucissement. Voir ce comportement brut d\'abord clarifie *ce que* le wrapper `<Transition>` des étapes suivantes apporte réellement.' },
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
      description: 'Vue\'s built-in `<Transition>` doesn\'t animate anything itself — it **toggles well-known CSS classes** on the entering and leaving element at each phase of the lifecycle, leaving the actual motion to your stylesheet. The `name="page"` prop prefixes every class, so you get `page-enter-from`, `page-enter-active`, `page-leave-to`, and so on. Using the `v-slot` form of `<RouterView>` exposes the resolved `Component` so it can be wrapped. With no CSS yet, the transition exists but is still instant.',
      fr: { title: 'Envelopper RouterView dans Transition', description: 'Le composant intégré `<Transition>` de Vue n\'anime rien lui-même — il **bascule des classes CSS connues** sur l\'élément entrant et sortant à chaque phase du cycle de vie, laissant le mouvement réel à votre feuille de style. La prop `name="page"` préfixe chaque classe, donnant `page-enter-from`, `page-enter-active`, `page-leave-to`, etc. La forme `v-slot` de `<RouterView>` expose le `Component` résolu pour pouvoir l\'envelopper. Sans CSS encore, la transition existe mais reste instantanée.' },
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
      description: 'Now you fill in the classes Vue toggles. The `-active` classes carry the `transition` property — they define *which* properties animate and over what duration — while `-from`/`-to` pin the **start and end states** (e.g. `opacity: 0` and a `translateY` offset). Vue adds the `-from` class for one frame, swaps to `-to`, and the browser interpolates between them. This separation of *what changes* (your CSS) from *when* (Vue) is the core of the model.',
      fr: { title: 'Ajouter les classes de transition CSS', description: 'Vous remplissez maintenant les classes que Vue bascule. Les classes `-active` portent la propriété `transition` — elles définissent *quelles* propriétés s\'animent et sur quelle durée — tandis que `-from`/`-to` fixent les **états de début et de fin** (par ex. `opacity: 0` et un décalage `translateY`). Vue ajoute la classe `-from` pour une frame, passe à `-to`, et le navigateur interpole entre les deux. Cette séparation entre *ce qui change* (votre CSS) et *quand* (Vue) est le cœur du modèle.' },
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
      description: 'Without a `mode`, Vue runs leave and enter at once, so the two pages briefly sit side by side and the layout jumps. `mode="out-in"` **serializes** the phases — the leaving page finishes before the entering one mounts — for a clean single-page-at-a-time feel. The `:key="route.path"` is the subtle but essential bit: when two routes share the *same* component, Vue would otherwise reuse it and skip the transition entirely; a changing key forces a real unmount/mount so the animation fires.',
      fr: { title: 'Ajouter mode="out-in" pour éviter le chevauchement', description: 'Sans `mode`, Vue joue la sortie et l\'entrée en même temps, donc les deux pages se côtoient brièvement et la mise en page saute. `mode="out-in"` **sérialise** les phases — la page sortante se termine avant que l\'entrante monte — pour un rendu propre, une page à la fois. Le `:key="route.path"` est le détail subtil mais essentiel : quand deux routes partagent le *même* composant, Vue le réutiliserait sinon et sauterait la transition ; une clé qui change force un vrai démontage/montage pour que l\'animation se déclenche.' },
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
      description: 'React Navigation\'s `createStackNavigator` ships with **platform-native transitions out of the box** — a right-to-left slide on iOS, a scale-and-fade-up on Android — so screens already feel correct to each OS\'s conventions. Knowing this default matters because users expect their platform\'s motion language; any customization should be a deliberate deviation, not an accident. Start here, then override only what you need.',
      fr: { title: 'Navigateur Stack par défaut', description: '`createStackNavigator` de React Navigation fournit des **transitions natives à la plateforme prêtes à l\'emploi** — un glissement de droite à gauche sur iOS, un agrandissement-fondu vers le haut sur Android — donc les écrans paraissent déjà corrects selon les conventions de chaque OS. Connaître ce comportement par défaut compte car les utilisateurs attendent le langage de mouvement de leur plateforme ; toute personnalisation doit être un écart délibéré, pas un accident. Partez d\'ici, puis ne surchargez que le nécessaire.' },
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
      description: 'Before writing animation math by hand, reach for `CardStyleInterpolators` — a set of **ready-made presets** you assign to `cardStyleInterpolator` in `screenOptions`. `forFadeFromCenter` gives a cross-fade, `forHorizontalIOS` the native iOS push slide, and you pair it with a `transitionSpec` to control timing. This is the pragmatic 90% solution: a consistent custom transition across every screen with zero interpolation code.',
      fr: { title: 'Utiliser un interpolateur intégré', description: 'Avant d\'écrire les calculs d\'animation à la main, utilisez `CardStyleInterpolators` — un ensemble de **préréglages prêts à l\'emploi** que vous assignez à `cardStyleInterpolator` dans `screenOptions`. `forFadeFromCenter` donne un fondu enchaîné, `forHorizontalIOS` le glissement iOS natif, et vous le combinez à un `transitionSpec` pour contrôler le timing. C\'est la solution pragmatique à 90 % : une transition personnalisée cohérente sur chaque écran sans aucun code d\'interpolation.' },
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
      description: 'When the presets aren\'t enough, a custom `cardStyleInterpolator` gives you full control. It receives `current.progress` — an **Animated value driven 0 → 1 on enter and 1 → 0 on exit** — plus `layouts` with the screen dimensions, and returns a `cardStyle`. The key technique is `progress.interpolate({ inputRange, outputRange })`, which maps that 0–1 driver onto any pixel or opacity range, so a single animated value can fade *and* slide the card at once.',
      fr: { title: 'Écrire un interpolateur personnalisé', description: 'Quand les préréglages ne suffisent pas, un `cardStyleInterpolator` personnalisé offre un contrôle total. Il reçoit `current.progress` — une **valeur Animated pilotée de 0 → 1 à l\'entrée et 1 → 0 à la sortie** — ainsi que `layouts` avec les dimensions de l\'écran, et retourne un `cardStyle`. La technique clé est `progress.interpolate({ inputRange, outputRange })`, qui mappe ce pilote 0–1 sur n\'importe quelle plage de pixels ou d\'opacité, donc une seule valeur animée peut à la fois faire un fondu *et* glisser la carte.' },
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
      description: '`transitionSpec` decouples the *duration and curve* from the interpolator\'s *shape*, and crucially lets `open` (push) and `close` (pop) differ. The practical tip baked in here: make **closing faster than opening** (~280ms vs ~380ms). When users go back they already know the destination, so a snappier pop feels more responsive, while a slightly slower push gives the new screen room to make an entrance.',
      fr: { title: 'Configurer le timing par transition', description: '`transitionSpec` découple la *durée et la courbe* de la *forme* de l\'interpolateur, et permet surtout à `open` (push) et `close` (pop) de différer. L\'astuce pratique intégrée ici : rendre la **fermeture plus rapide que l\'ouverture** (~280ms contre ~380ms). En revenant en arrière, l\'utilisateur connaît déjà la destination, donc un pop plus vif paraît plus réactif, tandis qu\'un push un peu plus lent laisse à l\'écran entrant le temps de faire son entrée.' },
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
      description: 'Flutter models navigation as a **stack of routes**, and `Navigator.push` puts a new one on top. Wrapping a screen in `MaterialPageRoute` gives it the platform-adaptive default transition — a slide-up from the bottom on Android, a right-to-left push on iOS. It works and respects each platform, but the animation is fixed; the next steps swap in `PageRouteBuilder` so *you* own the motion.',
      fr: { title: 'Navigator.push avec la route par défaut', description: 'Flutter modélise la navigation comme une **pile de routes**, et `Navigator.push` en empile une nouvelle au sommet. Envelopper un écran dans `MaterialPageRoute` lui donne la transition par défaut adaptée à la plateforme — un glissement depuis le bas sur Android, un push de droite à gauche sur iOS. Ça fonctionne et respecte chaque plateforme, mais l\'animation est figée ; les étapes suivantes basculent vers `PageRouteBuilder` pour que *vous* maîtrisiez le mouvement.' },
      code: `// Navigate with the default transition
Navigator.push(
  context,
  MaterialPageRoute(builder: (_) => const DetailScreen()),
);`,
    },
    {
      title: 'Replace with PageRouteBuilder',
      description: '`PageRouteBuilder` is the customizable cousin of `MaterialPageRoute`: it exposes a `transitionsBuilder` callback that runs on every animation frame. Its `animation` parameter is an `Animation<double>` **driven 0 → 1 as the route enters and back to 0 as it leaves** — the single source of truth every transition reads from. Returning `child` unmodified here keeps the motion instant on purpose, proving the wiring works before any effect is added.',
      fr: { title: 'Remplacer par PageRouteBuilder', description: '`PageRouteBuilder` est le cousin personnalisable de `MaterialPageRoute` : il expose un callback `transitionsBuilder` exécuté à chaque frame d\'animation. Son paramètre `animation` est une `Animation<double>` **pilotée de 0 → 1 à l\'entrée de la route et de retour à 0 à sa sortie** — la source de vérité unique que lit chaque transition. Retourner `child` inchangé ici garde le mouvement instantané volontairement, prouvant que le câblage fonctionne avant d\'ajouter le moindre effet.' },
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
      description: '`FadeTransition` is a built-in widget that **listens to an animation and drives its child\'s opacity**, so you wrap `child` in it rather than animating opacity by hand. Feeding the raw linear `animation` straight in would look mechanical, so you first run it through a `Tween` chained with `CurveTween(curve: Curves.easeOut)` — the curve reshapes the 0–1 progression for **natural deceleration**. Tween + curve + transition widget is the canonical Flutter animation recipe.',
      fr: { title: 'Ajouter FadeTransition', description: '`FadeTransition` est un widget intégré qui **écoute une animation et pilote l\'opacité de son enfant**, vous enveloppez donc `child` dedans plutôt que d\'animer l\'opacité à la main. Injecter l\'`animation` linéaire brute donnerait un rendu mécanique, vous la passez donc d\'abord dans un `Tween` enchaîné avec `CurveTween(curve: Curves.easeOut)` — la courbe remodèle la progression 0–1 pour une **décélération naturelle**. Tween + courbe + widget de transition est la recette d\'animation canonique de Flutter.' },
      code: `transitionsBuilder: (context, animation, secondary, child) {
  final fade = Tween<double>(begin: 0.0, end: 1.0)
      .chain(CurveTween(curve: Curves.easeOut))
      .animate(animation);

  return FadeTransition(opacity: fade, child: child);
},`,
    },
    {
      title: 'Combine fade + slide as a reusable route',
      description: 'The final step composes two transitions — nesting `SlideTransition` inside `FadeTransition` so the page fades *and* rises together — and **encapsulates the whole thing in a reusable `FadeSlideRoute` class** that extends `PageRouteBuilder`. This is the payoff of subclassing: the timing, curves, and `reverseTransitionDuration` live in one place, and every call site shrinks to `Navigator.push(context, FadeSlideRoute(page: ...))`. One definition gives the entire app a consistent, custom transition with zero boilerplate.',
      fr: { title: 'Combiner fondu + glissement en route réutilisable', description: 'La dernière étape compose deux transitions — en imbriquant `SlideTransition` dans `FadeTransition` pour que la page fasse un fondu *et* monte ensemble — et **encapsule le tout dans une classe réutilisable `FadeSlideRoute`** qui étend `PageRouteBuilder`. C\'est l\'intérêt du sous-classement : le timing, les courbes et `reverseTransitionDuration` vivent au même endroit, et chaque site d\'appel se réduit à `Navigator.push(context, FadeSlideRoute(page: ...))`. Une seule définition donne à toute l\'app une transition personnalisée et cohérente sans code répétitif.' },
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
      description: 'A plain `<button>` with **no motion**. The click handler fires, but the user gets *zero* tactile confirmation that their press landed. This matters because **gesture feedback** is what makes an interface feel alive and trustworthy — without it, users tap twice or wonder if the app froze. This is the baseline we\'ll progressively enrich.',
      fr: { title: 'Bouton HTML simple', description: 'Un `<button>` ordinaire, **sans aucun mouvement**. Le gestionnaire de clic se déclenche, mais l\'utilisateur n\'a *aucune* confirmation tactile que son appui a été pris en compte. C\'est important car le **retour gestuel** est ce qui rend une interface vivante et fiable — sans lui, l\'utilisateur tape deux fois ou se demande si l\'app a planté. C\'est la base que nous allons enrichir.' },
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
      description: 'Swapping `<button>` for `motion.button` unlocks Framer Motion\'s gesture props. `whileTap={{ scale: 0.94 }}` shrinks the element to **94%** while the pointer is held and springs it back on release, mimicking a physical button depressing. The key insight: the `spring` `transition` — its **stiffness/damping** ratio — is what makes the rebound feel *natural* rather than mechanical.',
      fr: { title: 'Ajouter le retour whileTap', description: 'Remplacer `<button>` par `motion.button` débloque les props de geste de Framer Motion. `whileTap={{ scale: 0.94 }}` réduit l\'élément à **94%** tant que le pointeur est maintenu, puis le ramène par ressort au relâchement, imitant un vrai bouton enfoncé. L\'idée clé : la `transition` de type `spring` — son ratio **stiffness/damping** — est ce qui rend le rebond *naturel* plutôt que mécanique.' },
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
      description: '`whileHover` fires whenever the cursor is over the element, layering an **anticipation** cue on top of the press feedback. Pairing a subtle `scale: 1.03` with a negative `y` offset reads as the button *lifting* toward the user — this depth cue signals interactivity before any click. A matching `box-shadow` would complete the floating illusion. Hover and tap states *compose* cleanly because each owns a distinct gesture.',
      fr: { title: 'Ajouter la lévitation whileHover', description: '`whileHover` se déclenche dès que le curseur survole l\'élément, ajoutant un indice d\'**anticipation** par-dessus le retour d\'appui. Associer un léger `scale: 1.03` à un décalage `y` négatif donne l\'impression que le bouton *s\'élève* vers l\'utilisateur — cet indice de profondeur signale l\'interactivité avant même le clic. Une `box-shadow` assortie compléterait l\'illusion de lévitation. Les états survol et appui se *composent* proprement car chacun gère un geste distinct.' },
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
      description: 'Beyond buttons, **direct manipulation** lets users fling content away with their finger. `drag="x"` constrains motion to the horizontal axis, while `dragConstraints={{ left: 0, right: 0 }}` makes the card *want* to snap back to center. `dragElastic` controls the rubber-band give past those bounds, and `onDragEnd` reads **velocity** and **offset** to decide commit-vs-cancel — flicking fast dismisses even on a short drag, matching how physical objects respond to a quick swipe.',
      fr: { title: 'Ajouter le glissement pour rejeter', description: 'Au-delà des boutons, la **manipulation directe** permet de chasser un contenu d\'un geste du doigt. `drag="x"` limite le mouvement à l\'axe horizontal, tandis que `dragConstraints={{ left: 0, right: 0 }}` fait que la carte *veut* revenir au centre. `dragElastic` règle l\'effet élastique au-delà de ces bornes, et `onDragEnd` lit la **vélocité** et le décalage pour décider de valider ou d\'annuler — un coup rapide rejette même sur un court glissement, comme réagirait un objet physique à un balayage vif.' },
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
      description: '`Pressable` is React Native\'s **modern** touch primitive, meant to replace the older `TouchableOpacity` and `TouchableHighlight`. Crucially, it ships with *no* built-in animation — unlike `TouchableOpacity`\'s fixed fade — which hands you a **blank canvas** for custom feedback. Starting from this neutral baseline lets us craft spring physics that feel exactly right rather than fighting a preset effect.',
      fr: { title: 'Pressable sans animation', description: '`Pressable` est la primitive tactile **moderne** de React Native, conçue pour remplacer les anciens `TouchableOpacity` et `TouchableHighlight`. Surtout, il n\'embarque *aucune* animation par défaut — contrairement au fondu figé de `TouchableOpacity` — ce qui offre une **toile vierge** pour un retour personnalisé. Partir de cette base neutre permet de façonner une physique de ressort exactement comme on le veut, sans lutter contre un effet imposé.' },
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
      description: '`useSharedValue(1)` holds the scale on the **UI thread**, the core idea behind **Reanimated**: animations run independently of JavaScript. `Gesture.Tap().onBegin()` shrinks the value the instant a touch begins, and `.onFinalize()` springs it back. Because the whole loop lives on the UI thread, it stays a buttery **60fps** even when the JS thread is busy rendering or fetching — the usual culprit behind janky native gestures.',
      fr: { title: 'Ajouter la mise à l\'échelle avec useSharedValue', description: '`useSharedValue(1)` conserve l\'échelle sur le **thread UI**, l\'idée centrale de **Reanimated** : les animations tournent indépendamment du JavaScript. `Gesture.Tap().onBegin()` réduit la valeur dès qu\'un toucher commence, et `.onFinalize()` la ramène par ressort. Comme toute la boucle vit sur le thread UI, elle reste à un fluide **60fps** même quand le thread JS est occupé à rendre ou à charger — la cause habituelle des gestes natifs saccadés.' },
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
      description: 'The same UI-thread isolation that buys smoothness introduces a **boundary**: code in a gesture handler runs as a *worklet*, not on the JS thread. Invoking a normal JS callback like `onPress()` directly from there would crash. `runOnJS(onPress)()` is the official **bridge** that schedules the call back on the JS thread. This is the one rule you must respect whenever a gesture needs to trigger app logic — navigation, state updates, network calls.',
      fr: { title: 'Appeler onPress depuis le thread UI', description: 'L\'isolation sur le thread UI qui apporte la fluidité introduit une **frontière** : le code d\'un gestionnaire de geste s\'exécute comme un *worklet*, pas sur le thread JS. Appeler directement un callback JS classique comme `onPress()` depuis là planterait. `runOnJS(onPress)()` est le **pont** officiel qui replanifie l\'appel sur le thread JS. C\'est la règle à respecter dès qu\'un geste doit déclencher la logique de l\'app — navigation, mises à jour d\'état, appels réseau.' },
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
      description: '`Gesture.Pan()` tracks a continuous drag, the foundation of **direct manipulation** on mobile. `onChange` writes the finger\'s `translationX` straight into a shared value so the card tracks the touch *frame-perfectly*. On release, `onEnd` weighs both **velocity** and total offset: cross either threshold and it animates off-screen, otherwise `withSpring(0)` snaps it home. Honoring velocity is what makes a quick flick feel as decisive as a long, deliberate drag.',
      fr: { title: 'Ajouter le glissement pour ignorer avec geste Pan', description: '`Gesture.Pan()` suit un glissement continu, le socle de la **manipulation directe** sur mobile. `onChange` écrit le `translationX` du doigt directement dans une valeur partagée, si bien que la carte suit le toucher *image par image*. Au relâchement, `onEnd` pèse la **vélocité** et le décalage total : si l\'un des seuils est franchi, la carte sort de l\'écran, sinon `withSpring(0)` la ramène en place. Tenir compte de la vélocité fait qu\'un coup rapide paraît aussi décisif qu\'un long glissement appuyé.' },
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
      description: 'Flutter\'s `ElevatedButton` ships with a built-in **Material ink ripple** that radiates from the touch point. That convention is perfect for stock Material apps, but it gives you *no* control over timing or feel. Since our goal is precise **spring physics**, we\'ll set it aside and build a custom gesture widget from primitives — trading a one-liner for full authorship of the motion.',
      fr: { title: 'ElevatedButton simple', description: 'L\'`ElevatedButton` de Flutter embarque un **effet ripple Material** intégré qui rayonne depuis le point de contact. Cette convention est parfaite pour les apps Material standard, mais elle ne laisse *aucun* contrôle sur le timing ou le ressenti. Comme notre objectif est une **physique de ressort** précise, nous le mettrons de côté pour bâtir un widget de geste personnalisé à partir de primitives — on échange une ligne contre la maîtrise totale du mouvement.' },
      code: `ElevatedButton(
  onPressed: () {},
  child: const Text('Press me'),
)`,
    },
    {
      title: 'GestureDetector + press state',
      description: '`GestureDetector` exposes the **raw lifecycle** of a touch: `onTapDown` fires the moment a finger lands, `onTapUp` on a clean release, and `onTapCancel` when the finger slides off or the gesture is stolen. Handling all three is what keeps the button from getting *stuck* mid-press. An `AnimationController` — Flutter\'s engine for time-based motion — is driven `forward()` on press and `reverse()` on release, giving us a single 0→1 value to map onto scale next.',
      fr: { title: 'GestureDetector + état d\'appui', description: '`GestureDetector` expose le **cycle de vie brut** d\'un toucher : `onTapDown` se déclenche dès qu\'un doigt se pose, `onTapUp` à un relâchement net, et `onTapCancel` quand le doigt glisse hors de la zone ou que le geste est intercepté. Gérer les trois évite que le bouton ne reste *bloqué* en plein appui. Un `AnimationController` — le moteur de mouvement temporel de Flutter — est piloté avec `forward()` à l\'appui et `reverse()` au relâchement, fournissant une seule valeur 0→1 à mapper ensuite sur l\'échelle.' },
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
      description: '`ScaleTransition` is a purpose-built widget that rebuilds *only* its `Transform.scale` as the animation ticks — far cheaper than wrapping a `setState` around the whole subtree. A `Tween(begin: 1.0, end: 0.94)` remaps the controller\'s raw 0→1 progress onto the visible 1.0→0.94 scale range. The real magic is the **curve**: `Curves.elasticOut` on the *reverse* leg overshoots and settles, delivering that satisfying **spring-back** without any physics math.',
      fr: { title: 'Ajouter ScaleTransition', description: '`ScaleTransition` est un widget dédié qui ne reconstruit *que* son `Transform.scale` à chaque tick de l\'animation — bien moins coûteux qu\'envelopper tout le sous-arbre dans un `setState`. Un `Tween(begin: 1.0, end: 0.94)` remappe la progression brute 0→1 du contrôleur sur la plage d\'échelle visible 1.0→0.94. La vraie magie est la **courbe** : `Curves.elasticOut` sur le trajet *retour* dépasse puis se stabilise, offrant ce **rebond** satisfaisant sans aucun calcul de physique.' },
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
      description: '`Dismissible` is a **first-party** Flutter widget that handles the entire swipe-to-dismiss flow — drag tracking, the reveal `background`, and the `onDismissed` callback — out of the box. The lesson here is **composition over reinvention**: pair your custom `SpringButton` for tap feedback with the built-in `Dismissible` for swipe, each doing one job well. A stable `key` is mandatory so Flutter can correctly remove the right item from the list.',
      fr: { title: 'Ajouter Dismissible pour le glissement', description: '`Dismissible` est un widget **natif** de Flutter qui gère tout le flux du glissement pour ignorer — suivi du drag, `background` révélé et callback `onDismissed` — clé en main. La leçon ici est la **composition plutôt que la réinvention** : associez votre `SpringButton` personnalisé pour le retour tactile au `Dismissible` intégré pour le glissement, chacun faisant bien une seule tâche. Une `key` stable est obligatoire pour que Flutter retire correctement le bon élément de la liste.' },
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
      description: 'Parallax starts with **layering**: a background and a foreground stacked via `position: absolute` inside a `relative` container. Getting this skeleton right *before* any motion matters because the layers must be free to slide independently. Set `overflow: hidden` now — once we animate, an unclipped background will *bleed* past the section edges and break the illusion of a framed window.',
      fr: { title: 'Divs superposés statiques', description: 'Le parallax commence par la **superposition** : un arrière-plan et un premier plan empilés via `position: absolute` dans un conteneur `relative`. Bien poser ce squelette *avant* tout mouvement est important car les couches doivent pouvoir glisser indépendamment. Définissez `overflow: hidden` dès maintenant — une fois animé, un arrière-plan non rogné *déborde* hors des bords de la section et brise l\'illusion d\'une fenêtre encadrée.' },
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
      description: 'Parallax needs to be driven by *scroll position*, not time. `useScroll({ target: sectionRef })` gives you a `scrollYProgress` **MotionValue** that runs from 0 (section bottom entering the viewport) to 1 (section top leaving it). The `offset` option defines exactly where that 0→1 range begins and ends. A MotionValue updates *outside* React render, so reading it here costs nothing — we wire the source first, then connect outputs to it.',
      fr: { title: 'Connecter useScroll à la section', description: 'Le parallax doit être piloté par la *position de scroll*, pas par le temps. `useScroll({ target: sectionRef })` fournit une **MotionValue** `scrollYProgress` qui va de 0 (bas de la section entrant dans la fenêtre) à 1 (haut de la section la quittant). L\'option `offset` définit précisément où cette plage 0→1 commence et finit. Une MotionValue se met à jour *en dehors* du rendu React, donc la lire ici ne coûte rien — on branche la source d\'abord, puis on y connecte les sorties.' },
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
      description: '`useTransform` is the bridge that *remaps* one MotionValue into another — here turning the abstract 0→1 progress into a concrete pixel offset of `-40→40`. Feeding it straight into `style={{ y: bgY }}` on a `motion.div` lets Framer Motion drive the transform without re-rendering the component. Keep the range small: parallax reads as **depth**, not displacement, so a subtle ±40px is more convincing than a dramatic shift.',
      fr: { title: 'Appliquer le mouvement à l\'arrière-plan', description: '`useTransform` est le pont qui *remappe* une MotionValue en une autre — ici en transformant la progression abstraite 0→1 en un décalage concret de `-40→40` pixels. L\'injecter directement dans `style={{ y: bgY }}` sur un `motion.div` laisse Framer Motion piloter la transformation sans re-rendre le composant. Gardez la plage petite : le parallax se lit comme de la **profondeur**, pas du déplacement, donc un subtil ±40px est plus convaincant qu\'un décalage spectaculaire.' },
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
      title: 'Foreground at a different speed',
      description: 'This is the step where the effect actually *becomes* parallax. By giving the foreground a **reversed** `useTransform` range, the two layers move in opposite directions as you scroll — the brain interprets that **relative motion** as one layer being closer than the other. The principle is borrowed from real life: objects near you sweep past faster than distant ones. Tune the two ranges against each other to dial the apparent depth up or down.',
      fr: { title: 'Premier plan à vitesse différente', description: 'C\'est l\'étape où l\'effet *devient* réellement du parallax. En donnant au premier plan une plage `useTransform` **inversée**, les deux couches se déplacent en sens opposés au scroll — le cerveau interprète ce **mouvement relatif** comme une couche plus proche que l\'autre. Le principe vient de la vie réelle : les objets proches défilent plus vite que les lointains. Ajustez les deux plages l\'une par rapport à l\'autre pour augmenter ou réduire la profondeur apparente.' },
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
      description: 'On native, the parallax header lives *inside* the `ScrollView` so it scrolls away with the content — the motion we add later only adjusts how fast it leaves. Start with a fixed-height `View` wrapping the hero `Image` above the body. The `overflow: hidden` on that wrapper is what later lets the image translate *within* its frame instead of spilling over neighbouring content.',
      fr: { title: 'ScrollView avec une image d\'en-tête', description: 'Sur natif, l\'en-tête parallax vit *à l\'intérieur* du `ScrollView` pour défiler avec le contenu — le mouvement ajouté ensuite ne fait qu\'ajuster la vitesse à laquelle il disparaît. Commencez par un `View` à hauteur fixe enveloppant l\'`Image` hero au-dessus du corps. Le `overflow: hidden` sur ce wrapper est ce qui permettra plus tard à l\'image de se translater *dans* son cadre au lieu de déborder sur le contenu voisin.' },
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
      description: 'Smooth parallax demands the scroll value reach the animation **without a round-trip through JS** on every frame. `Animated.event` wires `nativeEvent.contentOffset.y` straight into an `Animated.Value`, and with `useNativeDriver: true` the whole pipeline runs on the UI thread — so it never stutters even if JS is busy. `scrollEventThrottle={16}` caps updates to roughly one per frame at **60fps**, the sweet spot between smoothness and overhead.',
      fr: { title: 'Suivre le scroll avec Animated.event', description: 'Un parallax fluide exige que la valeur de scroll atteigne l\'animation **sans aller-retour par JS** à chaque frame. `Animated.event` câble `nativeEvent.contentOffset.y` directement dans un `Animated.Value`, et avec `useNativeDriver: true` tout le pipeline tourne sur le thread UI — il ne saccade jamais même si JS est occupé. `scrollEventThrottle={16}` limite les mises à jour à environ une par frame à **60fps**, le bon compromis entre fluidité et surcharge.' },
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
      description: '`.interpolate()` is the native equivalent of `useTransform`: it remaps the raw scroll offset onto a `translateY` for the image. Driving the image up at only **0.3×** the scroll speed is what produces the *lag* the eye reads as depth. The three-point range also handles the **pull-down** case — a negative offset stretches the image larger, a small touch that makes the header feel elastic. `extrapolate: \'clamp\'` stops the transform running away past the defined bounds.',
      fr: { title: 'Interpoler scrollY vers translateY', description: '`.interpolate()` est l\'équivalent natif de `useTransform` : il remappe le décalage de scroll brut vers un `translateY` pour l\'image. Faire monter l\'image à seulement **0.3×** de la vitesse de scroll produit le *décalage* que l\'œil lit comme de la profondeur. La plage à trois points gère aussi le cas du **tirer-vers-le-bas** — un décalage négatif agrandit l\'image, un détail qui rend l\'en-tête élastique. `extrapolate: \'clamp\'` empêche la transformation de s\'emballer au-delà des bornes définies.' },
      code: `const imageTranslate = scrollY.interpolate({
  inputRange:  [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
  outputRange: [ HEADER_HEIGHT * 0.5, 0, -HEADER_HEIGHT * 0.3],
  extrapolate: 'clamp',
})
//  ↑ pull-down stretches image ↑ normal ↑ scroll-up moves image slower`,
    },
    {
      title: 'Apply to Animated.Image',
      description: 'Only `Animated.*` components can consume an `Animated.Value`, so the plain `Image` becomes `Animated.Image` to receive the interpolated `translateY`. Layering a **second** interpolation onto `opacity` lets the overlay text *fade out* as the header collapses — proof that one scroll source can drive many independent effects at once. Composing several interpolations off the same value is the core pattern behind rich, polished scroll experiences.',
      fr: { title: 'Appliquer à Animated.Image', description: 'Seuls les composants `Animated.*` peuvent consommer un `Animated.Value`, donc l\'`Image` simple devient `Animated.Image` pour recevoir le `translateY` interpolé. Superposer une **seconde** interpolation sur `opacity` fait *disparaître en fondu* le texte en surimpression quand l\'en-tête se réduit — la preuve qu\'une seule source de scroll peut piloter plusieurs effets indépendants à la fois. Composer plusieurs interpolations sur la même valeur est le motif central des expériences de scroll riches et soignées.' },
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
      description: 'Flutter models scrollable areas as **slivers** — composable scroll regions a `CustomScrollView` stitches together. Pairing a `SliverAppBar` (the collapsing header) with a `SliverToBoxAdapter` (your normal widget body) is the idiomatic foundation for a parallax screen. Reaching for slivers instead of a plain `ListView` matters because only they expose the *collapse* and *parallax* hooks the framework drives natively, with no manual scroll math.',
      fr: { title: 'Structure CustomScrollView', description: 'Flutter modélise les zones défilables comme des **slivers** — des régions de scroll composables qu\'un `CustomScrollView` assemble. Associer un `SliverAppBar` (l\'en-tête réductible) à un `SliverToBoxAdapter` (votre corps de widgets normal) est la base idiomatique d\'un écran parallax. Recourir aux slivers plutôt qu\'à un simple `ListView` est important car eux seuls exposent les points d\'ancrage de *réduction* et de *parallax* que le framework pilote nativement, sans calcul de scroll manuel.' },
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
      description: 'This is the payoff of staying on the sliver path: a single line, `collapseMode: CollapseMode.parallax` on the `FlexibleSpaceBar`, and the framework moves the background slower than the bar as it collapses. Flutter computes every offset against the scroll position for you, so you get correct, jank-free depth with **zero** controllers or listeners. Always try the built-in mode first — only drop to manual parallax when you need motion the `SliverAppBar` can\'t express.',
      fr: { title: 'Activer le parallax intégré', description: 'C\'est la récompense de rester sur la voie des slivers : une seule ligne, `collapseMode: CollapseMode.parallax` sur le `FlexibleSpaceBar`, et le framework déplace l\'arrière-plan plus lentement que la barre quand elle se réduit. Flutter calcule chaque décalage par rapport à la position de scroll pour vous, offrant une profondeur correcte et sans à-coups avec **zéro** contrôleur ni écouteur. Essayez toujours le mode intégré d\'abord — ne passez au parallax manuel que lorsque vous avez besoin d\'un mouvement que le `SliverAppBar` ne peut exprimer.' },
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
      description: 'When the effect outgrows `SliverAppBar`, you take the wheel: a `ScrollController` exposes the live `offset`, and a listener calls `setState` to rebuild on every frame. A `Transform.translate` then shifts the background by `offset × factor`, where a **factor below 1** is precisely what makes it lag behind the content and read as distant. This is the same slow-the-far-layer principle as the built-in mode, just expressed by hand so you control every pixel.',
      fr: { title: 'Parallax manuel avec ScrollController', description: 'Quand l\'effet dépasse `SliverAppBar`, vous prenez les commandes : un `ScrollController` expose le `offset` en direct, et un écouteur appelle `setState` pour reconstruire à chaque frame. Un `Transform.translate` décale alors l\'arrière-plan de `offset × factor`, où un **facteur inférieur à 1** est précisément ce qui le fait traîner derrière le contenu et paraître lointain. C\'est le même principe de ralentir-la-couche-lointaine que le mode intégré, exprimé à la main pour contrôler chaque pixel.' },
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
      description: 'The final move is **encapsulation**: fold the controller, listener, and transform into a self-contained `ParallaxImage` widget exposing just `imageUrl` and `factor`. Surfacing `factor` as a prop turns the effect into a *dial* — **0** pins the image fixed, **1** scrolls it at full speed (no parallax), and `0.3` is a tasteful default. Bundling the lifecycle (including `dispose` on the controller) inside one widget keeps call sites clean and prevents the listener leaks that creep in when this logic is copy-pasted.',
      fr: { title: 'Encapsuler dans un widget réutilisable', description: 'Le dernier geste est l\'**encapsulation** : replier le contrôleur, l\'écouteur et la transformation dans un widget `ParallaxImage` autonome n\'exposant que `imageUrl` et `factor`. Exposer `factor` comme prop transforme l\'effet en *molette* — **0** fige l\'image, **1** la fait défiler à pleine vitesse (pas de parallax), et `0.3` est un défaut élégant. Regrouper le cycle de vie (y compris `dispose` sur le contrôleur) dans un seul widget garde les appels propres et évite les fuites d\'écouteurs qui apparaissent quand cette logique est copiée-collée.' },
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
      description: 'Start with a gray rectangle sized to match the *real* content. A **skeleton** beats a spinner because it preserves the page\'s **layout shape** — the user perceives structure, not just "loading". This avoids the jarring **layout shift** that happens when content suddenly pops into an empty space.',
      fr: { title: 'Espace réservé gris statique', description: 'Commencez par un rectangle gris dimensionné comme le *vrai* contenu. Un **squelette** vaut mieux qu\'un spinner car il préserve la **forme de la mise en page** — l\'utilisateur perçoit une structure, pas seulement « chargement ». Cela évite le **décalage de mise en page** brutal qui survient quand le contenu surgit dans un espace vide.' },
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
      description: 'A static box reads as *broken* — the **shimmer** signals "actively working". An absolutely-positioned `motion.div` sweeps left to right via `animate={{ x: ["-100%", "100%"] }}`, and its transparent-to-light **gradient** mimics light catching a surface. The parent\'s `overflow: hidden` clips the sweep to the skeleton\'s rounded bounds.',
      fr: { title: 'Ajouter l\'animation shimmer', description: 'Une boîte statique semble *cassée* — le **shimmer** signale « en cours de traitement ». Un `motion.div` en position absolue balaie de gauche à droite via `animate={{ x: ["-100%", "100%"] }}`, et son **dégradé** transparent-vers-clair imite la lumière captée par une surface. Le `overflow: hidden` du parent rogne le balayage aux bords arrondis du squelette.' },
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
      description: 'A single bar isn\'t convincing — real skeletons **mirror the final layout**. Compose `<Skeleton>` primitives into the card\'s exact structure: a round avatar, a short name line, and longer body lines. Matching proportions means the swap to real content feels seamless, with *zero* reflow.',
      fr: { title: 'Composer en squelette de carte', description: 'Une seule barre n\'est pas convaincante — un vrai squelette **reflète la mise en page finale**. Composez des primitives `<Skeleton>` selon la structure exacte de la carte : un avatar rond, une courte ligne de nom et des lignes de corps plus longues. Des proportions identiques rendent le passage au vrai contenu fluide, avec *zéro* redisposition.' },
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
      description: 'The final piece is a *graceful* transition — a hard cut feels abrupt. `AnimatePresence mode="wait"` sequences the swap: the skeleton fully fades out **before** the real content fades in, never overlapping. Keying each branch (`key="skeleton"` vs `key="content"`) is what lets Framer Motion detect the change and animate the exit.',
      fr: { title: 'Remplacer par le vrai contenu au chargement', description: 'La dernière touche est une transition *élégante* — une coupure nette paraît brutale. `AnimatePresence mode="wait"` ordonne le remplacement : le squelette s\'estompe complètement **avant** que le vrai contenu n\'apparaisse, sans chevauchement. C\'est la clé distincte de chaque branche (`key="skeleton"` vs `key="content"`) qui permet à Framer Motion de détecter le changement et d\'animer la sortie.' },
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
      description: 'Begin with a plain `View` whose `backgroundColor` and dimensions match the real content. On mobile, where lists and cards dominate, a **skeleton** holds the layout in place so nothing jumps when data lands. This `Skeleton` primitive — parameterized by `width`, `height`, and `borderRadius` — becomes the building block for everything that follows.',
      fr: { title: 'Placeholder View gris', description: 'Commencez par un simple `View` dont le `backgroundColor` et les dimensions correspondent au vrai contenu. Sur mobile, où dominent listes et cartes, un **squelette** maintient la mise en page afin que rien ne saute quand les données arrivent. Cette primitive `Skeleton` — paramétrée par `width`, `height` et `borderRadius` — devient la brique de base de tout ce qui suit.' },
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
      description: 'Reanimated runs animations on the **UI thread**, so the shimmer stays smooth even while JS is busy fetching. A `useSharedValue` holds the animated position, and `withRepeat(withTiming(...), -1)` loops it forever — the `-1` is the magic value for *infinite* repeats. Driving this from -1 to 1 gives us a normalized value to map onto `translateX` next.',
      fr: { title: 'Ajouter le shimmer avec useSharedValue', description: 'Reanimated exécute les animations sur le **thread UI**, donc le shimmer reste fluide même pendant que le JS récupère des données. Un `useSharedValue` conserve la position animée, et `withRepeat(withTiming(...), -1)` la boucle indéfiniment — le `-1` est la valeur magique pour des répétitions *infinies*. Animer de -1 à 1 donne une valeur normalisée à mapper sur `translateX` à l\'étape suivante.' },
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
      description: 'Now the shared value becomes motion you can see. `useAnimatedStyle` converts it into a `translateX` transform, and a `LinearGradient` overlay (transparent → light → transparent) slides across the surface to produce the light-sweep effect. The parent\'s `overflow: hidden` masks the gradient so it only appears *inside* the skeleton\'s bounds.',
      fr: { title: 'Appliquer le dégradé de surimpression', description: 'La valeur partagée devient maintenant un mouvement visible. `useAnimatedStyle` la convertit en transformation `translateX`, et une surimpression `LinearGradient` (transparent → clair → transparent) glisse sur la surface pour produire l\'effet de balayage lumineux. Le `overflow: hidden` du parent masque le dégradé afin qu\'il n\'apparaisse qu\'*à l\'intérieur* des limites du squelette.' },
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
      description: 'Tie it together: compose the `Skeleton` primitives into a `CardSkeleton` that mirrors the final card, then swap to the real `UserCard` once `user` arrives. Reanimated\'s **layout animations** `FadeIn` / `FadeOut` handle the cross-fade declaratively — just attach `entering` and `exiting`, and the runtime animates the mount/unmount with no manual controller.',
      fr: { title: 'Composer et basculer vers le contenu réel', description: 'Assemblez le tout : composez les primitives `Skeleton` en un `CardSkeleton` qui reflète la carte finale, puis basculez vers le vrai `UserCard` dès que `user` arrive. Les **animations de mise en page** `FadeIn` / `FadeOut` de Reanimated gèrent le fondu enchaîné de façon déclarative — il suffit d\'attacher `entering` et `exiting`, et le runtime anime le montage/démontage sans contrôleur manuel.' },
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
      description: 'Begin with a `Container` sized to the target and filled with a flat gray color. Wrapping it in a `ClipRRect` does double duty: it rounds the corners *and* establishes the **clip boundary** that will contain the shimmer gradient in later steps. Building the static shape first keeps the widget tree simple before we layer in animation.',
      fr: { title: 'Placeholder Container', description: 'Commencez par un `Container` dimensionné selon la cible et rempli d\'une couleur grise unie. L\'envelopper dans un `ClipRRect` a un double rôle : il arrondit les coins *et* établit la **limite de rognage** qui contiendra le dégradé shimmer aux étapes suivantes. Construire d\'abord la forme statique garde l\'arbre de widgets simple avant d\'ajouter l\'animation.' },
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
      description: 'Flutter\'s explicit animations need a clock: an `AnimationController` paired with a `TickerProvider` (`SingleTickerProviderStateMixin`). Calling `..repeat()` loops it continuously, and a `Tween` maps progress to a shimmer position from -1.5 to 2.5 — deliberately overshooting the widget\'s edges so the highlight glides fully in and out instead of snapping. Always `dispose()` the controller to avoid leaking the ticker.',
      fr: { title: 'Ajouter AnimationController pour le shimmer', description: 'Les animations explicites de Flutter ont besoin d\'une horloge : un `AnimationController` associé à un `TickerProvider` (`SingleTickerProviderStateMixin`). Appeler `..repeat()` le boucle en continu, et un `Tween` mappe la progression sur une position de shimmer de -1.5 à 2.5 — débordant volontairement les bords du widget pour que le reflet entre et sorte entièrement au lieu de surgir d\'un coup. Pensez toujours à `dispose()` le contrôleur pour éviter de fuiter le ticker.' },
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
      description: '`AnimatedBuilder` is the **performance** lever here: it rebuilds *only* the decorated box each frame, leaving the rest of the tree untouched. The `LinearGradient`\'s `begin` and `end` alignments are recomputed from `_shimmer.value`, sliding the lighter midpoint color across the surface to read as a moving highlight. This is the idiomatic way to bind a `Listenable` to a small, isolated repaint.',
      fr: { title: 'Peindre le dégradé avec AnimatedBuilder', description: '`AnimatedBuilder` est ici le levier de **performance** : il ne reconstruit *que* la boîte décorée à chaque frame, laissant le reste de l\'arbre intact. Les alignements `begin` et `end` du `LinearGradient` sont recalculés à partir de `_shimmer.value`, faisant glisser la couleur médiane plus claire sur la surface pour donner un reflet en mouvement. C\'est la façon idiomatique de lier un `Listenable` à un repeint petit et isolé.' },
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
      description: 'Finally, compose the primitives into a `CardSkeleton` that mirrors the real layout, then let `AnimatedSwitcher` cross-fade to `UserCard` when data arrives. The trick is the **key**: `AnimatedSwitcher` only animates when its child\'s `Key` changes, which is why each branch carries a distinct `ValueKey`. No manual `AnimationController` — the framework drives the whole transition for you.',
      fr: { title: 'Composer et basculer avec AnimatedSwitcher', description: 'Enfin, composez les primitives en un `CardSkeleton` qui reflète la vraie mise en page, puis laissez `AnimatedSwitcher` faire un fondu enchaîné vers `UserCard` quand les données arrivent. L\'astuce, c\'est la **clé** : `AnimatedSwitcher` n\'anime que lorsque la `Key` de son enfant change, d\'où la `ValueKey` distincte sur chaque branche. Aucun `AnimationController` manuel — le framework pilote toute la transition à votre place.' },
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
      description: 'A regular HTML `<ul>`/`<li>` list with no motion at all. Every item paints in the *same frame*, which is exactly what makes the appearance feel abrupt — there is no visual hierarchy guiding the eye down the list. This is our baseline: understanding why the instant render feels cheap is the first step toward fixing it with a **staggered** entrance.',
      fr: { title: 'Liste ul/li simple', description: 'Une liste HTML `<ul>`/`<li>` ordinaire, sans aucun mouvement. Chaque élément s\'affiche dans la *même frame*, ce qui rend justement l\'apparition abrupte — aucune hiérarchie visuelle ne guide l\'oeil le long de la liste. C\'est notre point de départ : comprendre pourquoi le rendu instantané paraît bon marché est la première étape avant de le corriger avec une entrée **en cascade**.' },
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
      title: 'Animate each item',
      description: 'Swap each `li` for a `motion.li` and give it `initial={{ opacity: 0 }}` plus `animate={{ opacity: 1 }}` so Framer Motion tweens the fade for you. The items *do* animate now — but they all start and finish at exactly the same moment, so it looks identical to a single block fading in. This reveals the key insight: **animation alone is not stagger**. To get a cascade we need each child to start at a different time, which the next step solves with the parent.',
      fr: { title: 'Animer chaque élément', description: 'Remplacez chaque `li` par un `motion.li` et donnez-lui `initial={{ opacity: 0 }}` ainsi que `animate={{ opacity: 1 }}` pour que Framer Motion gère le fondu à votre place. Les éléments s\'animent désormais — mais ils démarrent et finissent tous au même instant, ce qui ressemble à un seul bloc qui apparaît en fondu. D\'où l\'idée clé : **animer ne suffit pas à créer une cascade**. Pour l\'obtenir, chaque enfant doit démarrer à un moment différent, ce que l\'étape suivante résout via le parent.' },
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
      title: 'Stagger with variants',
      description: 'Named `variants` let the parent `motion.ul` *orchestrate* its children instead of each item animating independently. Setting `staggerChildren: 0.07` on the container\'s `transition` tells Framer Motion to offset each child\'s start by 70ms, producing the cascade. The elegant part: children only need a `hidden`/`visible` variant — they **inherit the timing from the parent**, so adding or removing items requires no per-item delay math.',
      fr: { title: 'Cascade avec des variantes', description: 'Des `variants` nommées permettent au parent `motion.ul` d\'*orchestrer* ses enfants au lieu de les animer chacun de façon isolée. Définir `staggerChildren: 0.07` sur la `transition` du conteneur indique à Framer Motion de décaler le démarrage de chaque enfant de 70ms, créant la cascade. Le point élégant : les enfants n\'ont besoin que d\'une variante `hidden`/`visible` — ils **héritent du timing du parent**, donc ajouter ou retirer des éléments ne demande aucun calcul de délai individuel.' },
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
      title: 'Trigger on scroll',
      description: 'A cascade is far more impactful when it fires *as the list enters the viewport* rather than on page load where the user may never see it. The `useInView` hook watches the container and flips the `animate` prop from `"hidden"` to `"visible"` at the right moment, with `once: true` so it plays a single time and never replays on scroll-back. Crucially, the stagger logic is untouched — it still lives on the container, so we only changed *when* the entrance starts, not *how* it cascades.',
      fr: { title: 'Déclencher au scroll', description: 'Une cascade est bien plus marquante lorsqu\'elle se déclenche *au moment où la liste entre dans le viewport* plutôt qu\'au chargement de la page, où l\'utilisateur ne la verra peut-être jamais. Le hook `useInView` observe le conteneur et bascule la prop `animate` de `"hidden"` à `"visible"` au bon instant, avec `once: true` pour qu\'elle ne joue qu\'une fois sans rejouer au retour du scroll. Point essentiel : la logique de cascade reste intacte — elle vit toujours sur le conteneur, on a seulement changé *quand* l\'entrée commence, pas *comment* elle se déroule.' },
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
      title: 'FlatList baseline',
      description: '`FlatList` *virtualizes* long lists — it only mounts the rows currently on screen and recycles them as you scroll, which keeps memory and frame times low. That makes it the right container for anything beyond ~20 items, where a plain `View` + `map` would render everything at once and jank. Here it renders with no animation as our starting point; the trade-off to remember is that virtualization recycles rows, so entrance animations must be driven *per row* as each one mounts.',
      fr: { title: 'FlatList de base', description: '`FlatList` *virtualise* les longues listes — elle ne monte que les lignes visibles à l\'écran et les recycle au défilement, ce qui réduit la mémoire et le temps de rendu. C\'est donc le bon conteneur dès qu\'on dépasse ~20 éléments, là où un simple `View` + `map` afficherait tout d\'un coup et saccaderait. Ici elle s\'affiche sans animation, comme point de départ ; le compromis à retenir est que la virtualisation recycle les lignes, donc les animations d\'entrée doivent être pilotées *par ligne*, au montage de chacune.' },
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
      title: 'Fade each item on mount',
      description: 'Replace the inner `View` with an `Animated.View` driven by a `useSharedValue` for opacity — shared values live on the UI thread, so the fade stays smooth even while JS is busy. Kicking `withTiming` off inside `onLayout` is the trick: that callback fires exactly once when a row is first measured, which is the natural moment to begin its entrance. They all fade together for now, but this per-row mount hook is precisely the hook we\'ll *delay by index* in the next step to build the stagger.',
      fr: { title: 'Fondre chaque élément au montage', description: 'Remplacez le `View` interne par un `Animated.View` piloté par un `useSharedValue` pour l\'opacité — les shared values vivent sur le thread UI, donc le fondu reste fluide même quand le JS est occupé. L\'astuce est de lancer `withTiming` dans `onLayout` : ce callback se déclenche exactement une fois, quand la ligne est mesurée pour la première fois, le moment naturel pour démarrer son entrée. Ils fondent tous ensemble pour l\'instant, mais ce hook de montage par ligne est précisément celui qu\'on va *retarder selon l\'index* à l\'étape suivante pour construire la cascade.' },
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
      title: 'Slide + stagger with withDelay',
      description: 'Wrapping each animation in `withDelay(index * 70, ...)` offsets every row by 70ms × its position, which is what finally turns the simultaneous fade into a true cascade. The `index` comes straight from `FlatList`\'s `renderItem` callback, so the math stays declarative and tied to list order. Running opacity *and* `translateY` in parallel adds a subtle slide-up that makes the entrance feel like the content is settling into place rather than merely appearing.',
      fr: { title: 'Glissement + cascade avec withDelay', description: 'Envelopper chaque animation dans `withDelay(index * 70, ...)` décale chaque ligne de 70ms × sa position, ce qui transforme enfin le fondu simultané en véritable cascade. L\'`index` provient directement du callback `renderItem` de `FlatList`, ce qui garde le calcul déclaratif et lié à l\'ordre de la liste. Faire tourner l\'opacité *et* `translateY` en parallèle ajoute un léger glissement vers le haut qui donne l\'impression que le contenu se met en place plutôt que d\'apparaître simplement.' },
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
      description: 'A linear `index * 70` delay is fine for five items but disastrous for fifty — the last row would wait several seconds, which reads as broken rather than elegant. Clamping with `Math.min(index * 70, 400)` caps the longest wait at 400ms so the cascade stays *energetic* no matter how long the list grows. This is the general rule for stagger: the per-item offset should taper or cap so total duration never scales unbounded with item count.',
      fr: { title: 'Limiter le délai pour les longues listes', description: 'Un délai linéaire `index * 70` convient pour cinq éléments mais devient désastreux pour cinquante — la dernière ligne attendrait plusieurs secondes, ce qui paraît cassé plutôt qu\'élégant. Borner avec `Math.min(index * 70, 400)` plafonne l\'attente la plus longue à 400ms pour que la cascade reste *énergique* quelle que soit la longueur de la liste. C\'est la règle générale de la cascade : le décalage par élément doit s\'atténuer ou se plafonner afin que la durée totale ne croisse jamais sans limite avec le nombre d\'éléments.' },
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
      description: 'A `Column` lays out and paints all of its children in a single build pass, so every `Container` appears at once with no motion. Because a `StatelessWidget` has no lifecycle ticks, there is simply nowhere for an entrance animation to live yet. This is our baseline, and it frames the central Flutter question we\'ll answer over the next steps: *where does the animation clock come from, and who owns it?*',
      fr: { title: 'Colonne de widgets simples', description: 'Une `Column` dispose et peint tous ses enfants en une seule passe de build, donc chaque `Container` apparaît d\'un coup, sans mouvement. Comme un `StatelessWidget` n\'a aucun tick de cycle de vie, il n\'existe encore aucun endroit où loger une animation d\'entrée. C\'est notre point de départ, et il pose la question centrale de Flutter à laquelle les prochaines étapes répondent : *d\'où vient l\'horloge d\'animation, et qui la possède ?*' },
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
      title: 'AnimationController for one item',
      description: 'To animate at all in Flutter you need a clock, and that clock is an `AnimationController`. Converting a single item to a `StatefulWidget` gives it the lifecycle to own one, while `SingleTickerProviderStateMixin` supplies the `vsync` that ties the controller to the screen\'s refresh rate (and pauses it off-screen to save battery). Feeding the controller through `FadeTransition` + `SlideTransition` produces a clean entrance — but note one controller per item gets expensive, which motivates sharing a single controller next.',
      fr: { title: 'AnimationController pour un élément', description: 'Pour animer quoi que ce soit dans Flutter il faut une horloge, et cette horloge est un `AnimationController`. Convertir un seul élément en `StatefulWidget` lui donne le cycle de vie nécessaire pour en posséder un, tandis que `SingleTickerProviderStateMixin` fournit le `vsync` qui relie le contrôleur au taux de rafraîchissement de l\'écran (et le met en pause hors écran pour économiser la batterie). Passer le contrôleur dans `FadeTransition` + `SlideTransition` produit une entrée nette — mais un contrôleur par élément devient coûteux, ce qui justifie de partager un seul contrôleur à l\'étape suivante.' },
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
      title: 'Stagger with one controller + Interval',
      description: 'Flutter\'s idiomatic stagger uses a *single* `AnimationController` on the parent driving a normalized 0–1 timeline, rather than one controller per row. Each item then claims a slice of that timeline with an `Interval` curve — item 0 plays over 0.0–0.3, item 1 over 0.07–0.37, and so on — so the controller\'s single forward pass produces the cascade. This is dramatically cheaper than N controllers and keeps all the timing in one place you can reason about.',
      fr: { title: 'Cascade avec un contrôleur + Interval', description: 'La cascade idiomatique de Flutter utilise un *seul* `AnimationController` sur le parent pour piloter une timeline normalisée 0–1, plutôt qu\'un contrôleur par ligne. Chaque élément réclame ensuite une tranche de cette timeline via une courbe `Interval` — l\'élément 0 joue sur 0.0–0.3, l\'élément 1 sur 0.07–0.37, et ainsi de suite — si bien qu\'une seule passe avant du contrôleur produit la cascade. C\'est nettement moins coûteux que N contrôleurs et garde tout le timing à un seul endroit que l\'on peut raisonner.' },
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
      title: 'Slide + cap delay for long lists',
      description: 'Layering a `SlideTransition` over the same `Interval` curve adds the polished slide-up while reusing the exact timing window each item already owns. The important refinement is clamping the start offset so rows past index ~5 share the final slot instead of pushing the timeline ever longer — the same *cap the delay* principle as the React Native step, expressed through `Interval` bounds. With the per-item controllers gone, one controller now rules them all, giving a cascade that stays snappy on lists of any length.',
      fr: { title: 'Glissement + limiter le délai pour les longues listes', description: 'Superposer un `SlideTransition` sur la même courbe `Interval` ajoute le glissement vers le haut soigné tout en réutilisant la fenêtre de timing que chaque élément possède déjà. Le raffinement important est de borner le décalage de départ pour que les lignes au-delà de l\'index ~5 partagent le dernier créneau au lieu d\'allonger sans cesse la timeline — le même principe de *plafonnement du délai* que l\'étape React Native, exprimé via les bornes d\'`Interval`. Les contrôleurs par élément ayant disparu, un seul contrôleur les dirige désormais tous, offrant une cascade qui reste vive sur des listes de n\'importe quelle longueur.' },
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
    description: 'Render three coloured slides inside a `position: relative` container with `overflow: hidden`. This step sets the **layout foundation** every later animation builds on: the clipping box defines what stays visible, and a single `useState` index decides which slide shows. Nail the structure first — animation is meaningless without a stable stage to play on.',
    fr: { title: 'Slides statiques', description: 'Afficher trois slides colorées dans un conteneur `position: relative` avec `overflow: hidden`. Cette étape pose la **base de mise en page** sur laquelle toutes les animations suivantes se construisent : la boîte de découpe définit ce qui reste visible, et un seul index `useState` décide quelle slide s\'affiche. Soigne la structure d\'abord — l\'animation n\'a aucun sens sans une scène stable.' },
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
    description: 'Wrap the active slide in `AnimatePresence` so the **outgoing element still animates after React removes it** from the tree — without this, exits are impossible. A changing `key` tells Framer Motion to treat each slide as a distinct element, and a `custom` direction value drives the `initial`/`exit` x-offsets so cards always slide in from the correct edge. This is the core pattern behind almost every page transition.',
    fr: { title: 'AnimatePresence + glissement', description: 'Envelopper la slide active dans `AnimatePresence` pour que **l\'élément sortant continue de s\'animer après son retrait** de l\'arbre React — sans cela, les sorties sont impossibles. Un `key` qui change indique à Framer Motion de traiter chaque slide comme un élément distinct, et une valeur de direction `custom` pilote les décalages x de `initial`/`exit` pour que les cartes glissent toujours du bon bord. C\'est le motif central derrière presque toutes les transitions de page.' },
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
    description: 'Refactor the inline props into a `variants` object and add `scale: 0.92` to the enter state so slides **zoom forward as they arrive**, giving a sense of depth rather than a flat slide. A sibling `motion.div` overlay fades from `opacity` 0.5 to 0, darkening the slide during entry and clearing as it settles — the cinematic *dark-reveal* effect. Variants keep the markup readable once states multiply.',
    fr: { title: 'Profondeur de scale + overlay sombre', description: 'Extraire les props inline dans un objet `variants` et ajouter `scale: 0.92` à l\'état d\'entrée pour que les slides **zooment vers l\'avant en arrivant**, donnant une impression de profondeur plutôt qu\'un glissement plat. Un `motion.div` frère en overlay s\'estompe de `opacity` 0.5 à 0, assombrissant la slide pendant l\'entrée puis s\'éclaircissant — l\'effet de *révélation sombre* cinématique. Les variantes gardent le markup lisible quand les états se multiplient.' },
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
    description: 'Make the carousel feel native by adding `drag="x"` and reading `offset` and `velocity` in `onDragEnd` — a **flick threshold** means a fast short swipe counts just like a slow long one, matching real touch physics. The pagination dots switch from CSS transitions to `motion.div` springs animating `width`, so they bounce into their pill shape instead of easing linearly. Spring motion is what separates a polished gesture UI from a mechanical one.',
    fr: { title: 'Glisser pour swiper + pastilles spring', description: 'Rendre le carrousel natif en ajoutant `drag="x"` et en lisant `offset` et `velocity` dans `onDragEnd` — un **seuil de flick** fait qu\'un swipe court et rapide compte comme un long et lent, reproduisant la vraie physique tactile. Les pastilles de pagination passent des transitions CSS à des springs `motion.div` animant `width`, donc elles rebondissent vers leur forme de pilule au lieu d\'un easing linéaire. Le mouvement spring distingue une UI gestuelle soignée d\'une UI mécanique.' },
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
    description: "The single most important line is `'use client'` at the top: this carousel needs `useState` and pointer events, which only exist in the browser, so it **must opt out of Server Components**. Everything below the directive is identical to the plain React version — the App Router difference is purely the client boundary, not the component logic. Forgetting this directive is the most common Next.js animation error.",
    fr: { title: 'Slides statiques', description: "La ligne la plus importante est `'use client'` en haut : ce carrousel a besoin de `useState` et d\'événements de pointeur, qui n\'existent que dans le navigateur, donc il **doit se retirer des Server Components**. Tout ce qui suit la directive est identique à la version React classique — la différence App Router tient uniquement à la frontière client, pas à la logique du composant. Oublier cette directive est l\'erreur d\'animation Next.js la plus courante." },
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
    description: 'Because the component is already a Client Component, `framer-motion` works without extra setup — the library reads layout and animates on the client. The `custom` prop is the key concept here: it **threads the swipe direction through `AnimatePresence`** so the exiting slide (which no longer has access to current state) still knows which edge to leave from. That direction-passing trick is what makes the enter and exit feel like one continuous gesture.',
    fr: { title: 'AnimatePresence + glissement', description: 'Comme le composant est déjà un Client Component, `framer-motion` fonctionne sans configuration supplémentaire — la librairie lit la mise en page et anime côté client. La prop `custom` est le concept clé ici : elle **fait passer la direction du swipe à travers `AnimatePresence`** pour que la slide sortante (qui n\'a plus accès à l\'état courant) sache de quel bord partir. Cette astuce de transmission de direction fait que l\'entrée et la sortie semblent un seul geste continu.' },
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
    description: 'Add the `scale: 0.92` enter state and the fading dark overlay `motion.div` for the same depth-and-reveal polish as the React build. The Next.js-specific insight: a Server Component page **can import and render this client component directly** — the `"use client"` boundary is self-contained, so the rest of your page stays a server-rendered, zero-JS shell. You get rich interactivity in one island without making the whole route client-side.',
    fr: { title: 'Profondeur de scale + overlay sombre', description: 'Ajouter l\'état d\'entrée `scale: 0.92` et le `motion.div` d\'overlay sombre qui s\'estompe, pour la même finition profondeur-et-révélation que la version React. L\'enseignement propre à Next.js : une page Server Component **peut importer et rendre ce composant client directement** — la frontière `"use client"` est auto-suffisante, donc le reste de la page reste une coquille rendue côté serveur sans JS. Vous obtenez une interactivité riche dans un seul îlot sans rendre toute la route côté client.' },
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
    description: 'Finish with `drag="x"` plus a velocity/offset flick threshold and spring-animated pagination dots — the same gesture physics as plain React. The deployment takeaway is structural: drop this file under `app/components/` and it just works, because the **`"use client"` boundary travels with the component**, not the route. No webpack tweaks, no dynamic import with `ssr: false` — Framer Motion ships and hydrates inside the island automatically.',
    fr: { title: 'Glisser pour swiper + pastilles spring', description: 'Terminer avec `drag="x"`, un seuil de flick vélocité/offset et des pastilles de pagination animées en spring — la même physique gestuelle que React pur. L\'enseignement de déploiement est structurel : déposez ce fichier dans `app/components/` et ça marche, car la **frontière `"use client"` voyage avec le composant**, pas avec la route. Aucun ajustement webpack, aucun import dynamique avec `ssr: false` — Framer Motion est livré et hydraté dans l\'îlot automatiquement.' },
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
    description: 'Set up the carousel with a reactive `ref` for the current page and a clipping `.carousel` container. Clicking a dot simply assigns `page = i`, and Vue\'s **reactivity re-renders the active slide automatically** — no manual DOM updates. Getting the data and template shape right now means every later step only adds transitions, never restructures the markup.',
    fr: { title: 'Diapositives statiques', description: 'Mettre en place le carrousel avec un `ref` réactif pour la page courante et un conteneur `.carousel` qui découpe le contenu. Cliquer sur un point assigne simplement `page = i`, et la **réactivité de Vue rerend la slide active automatiquement** — aucune mise à jour manuelle du DOM. Bien définir la forme des données et du template maintenant fait que chaque étape suivante ajoute seulement des transitions, sans jamais restructurer le markup.' },
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
    description: 'Vue\'s `<TransitionGroup>` auto-applies enter/leave CSS classes, but it can\'t know swipe direction on its own — so bind its `name` to a computed `"slide-left"` or `"slide-right"` based on the stored `dir`. **Absolute positioning on the active transition classes lets the leaving and entering slides overlap** instead of pushing each other, which is what makes the cross-fade slide read as a single motion. This is Vue\'s declarative answer to React\'s `AnimatePresence`.',
    fr: { title: 'TransitionGroup sensible à la direction', description: 'Le `<TransitionGroup>` de Vue applique automatiquement les classes CSS d\'entrée/sortie, mais il ne peut pas connaître seul la direction du swipe — donc liez son `name` à un `"slide-left"` ou `"slide-right"` calculé selon le `dir` stocké. **Le positionnement absolu sur les classes de transition actives laisse la slide sortante et entrante se chevaucher** au lieu de se pousser, ce qui fait lire le glissement comme un seul mouvement. C\'est la réponse déclarative de Vue à l\'`AnimatePresence` de React.' },
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
    description: 'Add an `.overlay` div per slide driven by a CSS `@keyframes` that fades it from 0.4 to 0 opacity as the slide settles. The lesson is that **not every animation needs JavaScript** — a pure keyframe with `forwards` fill runs entirely on the compositor, costs zero reactivity overhead, and fires automatically each time the slide is freshly mounted by `TransitionGroup`. Reach for CSS first; reserve JS for anything that depends on live state.',
    fr: { title: 'Surimpression sombre via keyframe', description: 'Ajouter un div `.overlay` par slide piloté par un `@keyframes` CSS qui le fait passer de 0.4 à 0 d\'opacité pendant que la slide se stabilise. La leçon : **toute animation n\'a pas besoin de JavaScript** — un keyframe pur avec remplissage `forwards` tourne entièrement sur le compositeur, sans coût de réactivité, et se déclenche automatiquement à chaque montage de la slide par `TransitionGroup`. Privilégiez le CSS d\'abord ; réservez le JS à ce qui dépend de l\'état en direct.' },
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
    description: 'Capture `touchstart` to record the start X and `touchend` to measure the delta; cross a 50px threshold and `go()` advances the carousel. Note `.passive` on `touchstart` — it **promises the browser you won\'t call `preventDefault`**, so scrolling stays smooth and jank-free. The dots use a `cubic-bezier` overshoot curve so their width springs past target and back, giving the pill an elastic, tactile pop without any JS animation loop.',
    fr: { title: 'Glissement tactile + points animés', description: 'Capturer `touchstart` pour mémoriser le X de départ et `touchend` pour mesurer le delta ; dépasser un seuil de 50px et `go()` avance le carrousel. Notez `.passive` sur `touchstart` — il **promet au navigateur que vous n\'appellerez pas `preventDefault`**, donc le défilement reste fluide et sans saccade. Les points utilisent une courbe `cubic-bezier` avec dépassement pour que leur largeur rebondisse au-delà de la cible puis revienne, donnant à la pilule un pop élastique et tactile sans boucle d\'animation JS.' },
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
    description: 'Build the base on a horizontal `FlatList` with `pagingEnabled`, which gives you **native snap-to-slide for free** — the OS handles momentum, deceleration, and edge bounce that would be painful to hand-roll. Each slide is sized to the full screen `width` from `Dimensions`, so one item fills the viewport per page. Starting from a virtualized list also means the carousel scales to many slides without rendering them all up front.',
    fr: { title: 'Diapositives statiques', description: 'Construire la base sur un `FlatList` horizontal avec `pagingEnabled`, qui vous donne **le snap natif vers chaque slide gratuitement** — l\'OS gère l\'inertie, la décélération et le rebond aux bords, pénibles à coder à la main. Chaque slide a la `width` plein écran issue de `Dimensions`, donc un seul élément remplit la fenêtre par page. Partir d\'une liste virtualisée fait aussi que le carrousel passe à l\'échelle sur de nombreuses slides sans toutes les rendre d\'emblée.' },
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
    description: 'Swap in `Animated.FlatList` and feed scroll position into an `Animated.Value` via `Animated.event`. The critical flag is `useNativeDriver: true`: it **serializes the animation to the native UI thread once**, so subsequent frames never cross the JS bridge and stay at 60fps even while JS is busy. This `scrollX` value is the single source of truth that every later interpolation — scale, overlay, dots — will read from.',
    fr: { title: 'Suivre scrollX avec Animated.event', description: 'Passer à `Animated.FlatList` et injecter la position de défilement dans une `Animated.Value` via `Animated.event`. Le drapeau crucial est `useNativeDriver: true` : il **sérialise l\'animation vers le thread UI natif une seule fois**, donc les frames suivantes ne traversent jamais le pont JS et restent à 60fps même quand le JS est occupé. Cette valeur `scrollX` est l\'unique source de vérité que chaque interpolation suivante — échelle, overlay, points — lira.' },
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
    description: 'For each slide, call `scrollX.interpolate()` mapping the input range `[prev, current, next]` page offsets to a `scale` output of `[0.92, 1, 0.92]`. This is the core RN animation idea: instead of triggering animations on events, you **derive style continuously from scroll position**, so the slide is largest exactly when centered and shrinks symmetrically as it leaves. `extrapolate: \'clamp\'` stops the scale from drifting past the end slides.',
    fr: { title: 'Profondeur d\'échelle via interpolate', description: 'Pour chaque slide, appeler `scrollX.interpolate()` en mappant la plage d\'entrée `[précédente, actuelle, suivante]` vers une sortie `scale` de `[0.92, 1, 0.92]`. C\'est l\'idée centrale de l\'animation RN : au lieu de déclencher des animations sur des événements, vous **dérivez le style en continu depuis la position de défilement**, donc la slide est la plus grande exactement quand elle est centrée et rétrécit symétriquement en partant. `extrapolate: \'clamp\'` empêche l\'échelle de dériver au-delà des slides de bord.' },
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
    description: 'Reuse the exact same `scrollX` to drive two more interpolations: an overlay `opacity` of `[0.5, 0, 0.5]` and a dot `width` of `[6, 20, 6]`. The takeaway is **composability** — one native-driven scroll value feeds many derived styles, so overlay, scale, and dots all stay perfectly in sync because they read from a single timeline. The dots become a live progress indicator that tracks finger position continuously, not just snapped pages.',
    fr: { title: 'Surimpression sombre + indicateurs de points animés', description: 'Réutiliser exactement le même `scrollX` pour piloter deux interpolations de plus : une `opacity` d\'overlay de `[0.5, 0, 0.5]` et une `width` de point de `[6, 20, 6]`. L\'enseignement est la **composabilité** — une seule valeur de défilement native alimente de nombreux styles dérivés, donc overlay, échelle et points restent parfaitement synchronisés car ils lisent une même timeline. Les points deviennent un indicateur de progression vivant qui suit la position du doigt en continu, pas seulement les pages snappées.' },
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
    description: 'Found the carousel on `PageView.builder`, Flutter\'s lazy paging widget that **only builds the slides near the viewport**. A `PageController` is the bridge between gesture and state: attaching a listener lets you read `page` and call `setState` so the UI reflects the current slide. Note the `dispose()` that releases the controller — forgetting it is the classic Flutter memory leak.',
    fr: { title: 'Diapositives statiques', description: 'Fonder le carrousel sur `PageView.builder`, le widget de pagination paresseux de Flutter qui **ne construit que les slides proches de la fenêtre**. Un `PageController` est le pont entre le geste et l\'état : y attacher un listener permet de lire `page` et d\'appeler `setState` pour que l\'UI reflète la slide courante. Notez le `dispose()` qui libère le contrôleur — l\'oublier est la fuite mémoire classique de Flutter.' },
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
    description: 'Wrap the page view in a `Stack` so dots float above the slides, then build the row with `AnimatedContainer`. This is the **implicit animation** pattern: you just declare the new `width` (6 or 20) and Flutter *tweens* between old and new values over the given `Duration` for you — no controller, no listener. It is the fastest way to make any property change feel smooth instead of snapping.',
    fr: { title: 'Indicateurs de points', description: 'Envelopper la vue de pages dans un `Stack` pour que les points flottent au-dessus des slides, puis construire la rangée avec `AnimatedContainer`. C\'est le motif d\'**animation implicite** : vous déclarez simplement la nouvelle `width` (6 ou 20) et Flutter *interpole* entre l\'ancienne et la nouvelle valeur sur la `Duration` donnée — sans contrôleur ni listener. C\'est le moyen le plus rapide de rendre tout changement de propriété fluide plutôt que brusque.' },
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
    description: 'Read the **fractional** `_ctrl.page` value (e.g. 1.4 mid-swipe) instead of a rounded index, and in `itemBuilder` compute `dist = (page - index).abs()` to drive `scale = 1.0 - dist * 0.08` via `Transform.scale`. Because the value is continuous, the slide scales smoothly *while you drag*, not just on settle. A `viewportFraction` below 1 reveals peeking neighbours, selling the depth illusion.',
    fr: { title: 'Profondeur d\'échelle via PageController.page', description: 'Lire la valeur **fractionnaire** `_ctrl.page` (par ex. 1.4 en plein swipe) plutôt qu\'un index arrondi, et dans `itemBuilder` calculer `dist = (page - index).abs()` pour piloter `scale = 1.0 - dist * 0.08` via `Transform.scale`. Comme la valeur est continue, la slide change d\'échelle en douceur *pendant* le glissement, pas seulement à l\'arrêt. Une `viewportFraction` inférieure à 1 laisse entrevoir les voisines, renforçant l\'illusion de profondeur.' },
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
    description: 'Layer a `Container` tinted `Colors.black.withOpacity(dist * 0.5)` inside each slide\'s `Stack`. Reusing the same `dist` that drives scale means **one derived value controls two effects in lockstep** — as a slide centers (`dist → 0`) it both grows and clears its shade, focusing the eye on the active card. Tapping a dot now calls `animateToPage`, and the whole effect ships with the SDK, no third-party carousel package.',
    fr: { title: 'Surimpression sombre qui disparaît', description: 'Superposer un `Container` teinté `Colors.black.withOpacity(dist * 0.5)` dans le `Stack` de chaque slide. Réutiliser le même `dist` qui pilote l\'échelle signifie qu\'**une seule valeur dérivée contrôle deux effets à l\'unisson** — quand une slide se centre (`dist → 0`), elle grandit et s\'éclaircit, attirant l\'œil sur la carte active. Toucher un point appelle désormais `animateToPage`, et tout l\'effet tient avec le SDK, sans package de carrousel tiers.' },
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
    description: 'Build the **stage** before the choreography: a single screen showing an icon, title, and body, driven by a `useState` step index. The pill-shaped dots and the `Next` button render off that same index, so advancing is just `setStep(s => s + 1)`. Getting this state machine right first means every animation you layer on later has **one source of truth** to react to.',
    fr: { title: 'Écrans statiques', description: 'Construire la **scène** avant la chorégraphie : un seul écran affichant une icône, un titre et un corps, piloté par un index d\'étape `useState`. Les pastilles et le bouton `Next` se basent sur ce même index, donc avancer revient à `setStep(s => s + 1)`. Réussir cette machine à états d\'abord garantit que chaque animation ajoutée ensuite dispose d\'une **source de vérité unique**.' },
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
    description: 'Wrap the screen in `AnimatePresence` with `mode="wait"` so the **outgoing screen finishes its exit before the next one enters** — no overlap, no flicker. The `key={step}` is what makes it work: when the key changes, Framer Motion treats it as a brand-new element and runs the `exit` then `initial`/`animate` cycle. This is the foundational pattern for animating anything that mounts and unmounts.',
    fr: { title: 'Fondu enchaîné AnimatePresence', description: 'Envelopper l\'écran dans `AnimatePresence` avec `mode="wait"` pour que **l\'écran sortant termine sa sortie avant l\'entrée du suivant** — aucun chevauchement, aucun scintillement. Le `key={step}` est la clé : quand il change, Framer Motion considère l\'élément comme entièrement nouveau et exécute le cycle `exit` puis `initial`/`animate`. C\'est le motif fondamental pour animer tout ce qui se monte et se démonte.' },
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
    description: 'Swap the flat fade for **directional motion**: screens enter from the right (`x: 32`) and exit left (`x: -32`), giving users a spatial sense of moving *forward* through the flow. A nested `motion.div` on the icon scales up with a `delay: 0.1`, so it **pops in just after the container settles** — staggering child animations like this is what separates a polished sequence from everything moving at once.',
    fr: { title: 'Glissement + pop d\'icône', description: 'Remplacer le fondu plat par un **mouvement directionnel** : les écrans entrent par la droite (`x: 32`) et sortent par la gauche (`x: -32`), donnant à l\'utilisateur la sensation d\'avancer *vers l\'avant*. Un `motion.div` imbriqué sur l\'icône s\'agrandit avec un `delay: 0.1`, donc il **apparaît juste après que le conteneur se stabilise** — décaler ainsi les animations enfants distingue une séquence soignée d\'un ensemble qui bouge d\'un coup.' },
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
    description: 'Upgrade the dots from linear CSS transitions to `motion.div` with a `spring` so the active pill **stretches with natural momentum** instead of a mechanical ease. The `Back` button makes the flow two-way, and `whileTap={{ scale: 0.97 }}` on `Next` gives a tactile, *haptic-feel* press response. Springs and tap feedback are the small touches that make an interface feel physical rather than scripted.',
    fr: { title: 'Pastilles spring + bouton Retour', description: 'Faire évoluer les pastilles des transitions CSS linéaires vers un `motion.div` avec un `spring`, pour que la pastille active **s\'étire avec un élan naturel** plutôt qu\'une accélération mécanique. Le bouton `Back` rend le parcours bidirectionnel, et `whileTap={{ scale: 0.97 }}` sur `Next` offre une réponse tactile au toucher. Les springs et le retour au toucher sont les détails qui rendent une interface *physique* plutôt que scriptée.' },
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
    description: "Onboarding is **inherently interactive**, so it must opt out of the App Router's default server rendering with `'use client'` at the top — `useState` only exists in the browser. Keeping it in a dedicated component file means any Server Component page can import `<OnboardingFlow />` without itself becoming a client boundary. Drawing that line deliberately keeps your server tree lean while isolating the stateful island.",
    fr: { title: 'Écrans statiques', description: "L'onboarding est **intrinsèquement interactif**, il doit donc renoncer au rendu serveur par défaut de l'App Router avec `'use client'` en tête — `useState` n'existe que dans le navigateur. Le garder dans un fichier de composant dédié permet à n'importe quelle page Server Component d'importer `<OnboardingFlow />` sans devenir elle-même une frontière client. Tracer cette ligne délibérément garde l'arbre serveur léger tout en isolant l'îlot avec état." },
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
    description: 'Once the `use client` boundary is in place, `AnimatePresence` with `mode="wait"` behaves **exactly as in plain React** — the old screen fully exits before the next enters, keyed by `step`. The point of this step is reassurance: `framer-motion` is fully client-safe, so you don\'t need Next-specific workarounds to animate mount/unmount transitions. Treat client components as ordinary React once the directive is set.',
    fr: { title: 'Fondu enchaîné AnimatePresence', description: 'Une fois la frontière `use client` posée, `AnimatePresence` avec `mode="wait"` se comporte **exactement comme en React pur** — l\'ancien écran sort entièrement avant l\'entrée du suivant, clé par `step`. L\'enjeu ici est rassurant : `framer-motion` est totalement compatible client, donc aucun contournement propre à Next n\'est nécessaire pour animer le montage/démontage. Considère les composants client comme du React ordinaire une fois la directive posée.' },
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
    description: 'Layer in the x-axis slide and the delayed icon `scale` so screens move with direction and the icon pops once it lands. The `ease: [0.22, 1, 0.36, 1]` cubic-bézier is deliberately the **same deceleration curve used everywhere else in the UI** — reusing one easing token across components is what makes motion feel like a single, coherent system rather than a grab-bag of effects.',
    fr: { title: 'Glissement + pop d\'icône', description: 'Ajouter le glissement sur l\'axe x et le `scale` retardé de l\'icône, pour que les écrans se déplacent avec une direction et que l\'icône surgisse une fois posée. Le cubic-bézier `ease: [0.22, 1, 0.36, 1]` est volontairement la **même courbe de décélération employée partout ailleurs dans l\'interface** — réutiliser un seul jeton d\'easing entre composants donne au mouvement l\'allure d\'un système cohérent plutôt que d\'un assortiment d\'effets.' },
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
    description: 'Finish the flow with `spring`-animated `motion.div` dots and a `Back` button for two-way navigation. The takeaway for Next.js specifically: **TypeScript generics, hooks, and typed state work exactly as normal inside a `"use client"` file** — the directive changes *where* the component runs, not how you write it. Client islands are first-class React, fully typed and fully interactive.',
    fr: { title: 'Pastilles spring + bouton Retour', description: 'Terminer le parcours avec des pastilles `motion.div` animées en `spring` et un bouton `Back` pour la navigation bidirectionnelle. L\'enseignement propre à Next.js : **les generics TypeScript, les hooks et l\'état typé fonctionnent exactement comme d\'habitude dans un fichier `"use client"`** — la directive change *où* le composant s\'exécute, pas la façon de l\'écrire. Les îlots client sont du React à part entière, entièrement typés et interactifs.' },
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
    description: 'Lay the reactive foundation: a `ref(0)` step and a `computed` that derives the current screen, so the template re-renders automatically whenever step changes. The icon, dots, and `Next` button all read from that single `current` computed — **derive, don\'t duplicate**. Establishing this clean reactive data flow first means the later `<Transition>` steps only need to wrap markup, not rework logic.',
    fr: { title: 'Écrans statiques', description: 'Poser la base réactive : un `ref(0)` pour l\'étape et un `computed` qui dérive l\'écran courant, pour que le template se re-rende automatiquement à chaque changement d\'étape. L\'icône, les pastilles et le bouton `Next` lisent tous ce même `computed` `current` — **dériver, ne pas dupliquer**. Établir ce flux de données réactif propre d\'abord fait que les étapes `<Transition>` suivantes n\'ont qu\'à envelopper le balisage, sans retravailler la logique.' },
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
    description: 'Vue ships transitions in the framework itself: wrap the screen in `<Transition>` and set `mode="out-in"` so the **old screen fully leaves before the new one enters**, keyed by `step`. You only declare the `.fade-enter-*` / `.fade-leave-*` classes in CSS and Vue orchestrates the timing — this is the direct conceptual twin of React\'s `AnimatePresence mode="wait"`, with no extra library required.',
    fr: { title: 'Transition mode="out-in" fondu enchaîné', description: 'Vue intègre les transitions dans le framework lui-même : envelopper l\'écran dans `<Transition>` avec `mode="out-in"` pour que **l\'ancien écran parte entièrement avant l\'entrée du nouveau**, clé par `step`. Tu ne déclares que les classes `.fade-enter-*` / `.fade-leave-*` en CSS et Vue orchestre le timing — c\'est le jumeau conceptuel direct de `AnimatePresence mode="wait"` de React, sans aucune librairie supplémentaire.' },
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
    description: 'Make the motion **directional** by swapping the `<Transition>` `name` between `slide-left` and `slide-right` based on whether the user moved forward or back. The trick is a `dir` ref updated *before* `step` inside `go()`, so the correct CSS class is bound on the very render that triggers the transition. A separate keyed icon replays its `pop` keyframe each step — order of state updates matters here.',
    fr: { title: 'Direction de glissement + pop d\'icône', description: 'Rendre le mouvement **directionnel** en alternant le `name` de `<Transition>` entre `slide-left` et `slide-right` selon que l\'utilisateur avance ou recule. L\'astuce : un ref `dir` mis à jour *avant* `step` dans `go()`, pour que la bonne classe CSS soit liée sur le rendu même qui déclenche la transition. Une icône clé séparée rejoue son keyframe `pop` à chaque étape — l\'ordre des mises à jour d\'état compte ici.' },
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
    description: 'The active dot already grows its width through a CSS `transition`, so the final polish is **tying its color to the live screen color** via a reactive `:style` binding that only applies `s.color` when the dot is active. Because the binding reads reactive state, Vue updates it for free on every step. This shows how much expressive animation you can get from plain CSS transitions plus reactive style bindings — no JS animation loop needed.',
    fr: { title: 'Points pilule animés', description: 'Le point actif élargit déjà sa largeur via une `transition` CSS, la finition consiste donc à **lier sa couleur à la couleur de l\'écran en direct** via un `:style` réactif qui n\'applique `s.color` que lorsque le point est actif. Comme le binding lit l\'état réactif, Vue le met à jour gratuitement à chaque étape. Cela montre toute l\'expressivité atteignable avec de simples transitions CSS et des bindings de style réactifs — sans boucle d\'animation JS.' },
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
    description: 'Render one screen at a time from a `useState` index, but set up the layout with intent: `StyleSheet.absoluteFillObject` makes every screen **stack in the same parent `View`** rather than flow below it. That overlap is essential — for outgoing and incoming screens to crossfade or slide *over* each other later, they have to occupy the same space now. This step is really about preparing the stage for Reanimated.',
    fr: { title: 'Écrans statiques', description: 'Afficher un écran à la fois depuis un index `useState`, mais préparer la mise en page avec intention : `StyleSheet.absoluteFillObject` fait **empiler chaque écran dans le même `View` parent** au lieu de les enchaîner. Ce chevauchement est essentiel — pour que les écrans sortant et entrant se fondent ou glissent *l\'un sur l\'autre* plus tard, ils doivent occuper le même espace dès maintenant. Cette étape prépare en réalité la scène pour Reanimated.' },
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
    description: 'Reanimated\'s **layout animations** make crossfades almost free: hand `Animated.View` an `entering={FadeIn}` and `exiting={FadeOut}`, then just change its `key`. The library detects the key change, plays `FadeOut` on the old screen and `FadeIn` on the new — **there\'s no `AnimatePresence` to wrap with**, the entering/exiting props carry that behavior themselves. These transitions also run on the UI thread, so they stay smooth even under JS load.',
    fr: { title: 'FadeIn / FadeOut depuis Reanimated', description: 'Les **layout animations** de Reanimated rendent les fondus quasi gratuits : donner à `Animated.View` un `entering={FadeIn}` et un `exiting={FadeOut}`, puis simplement changer sa `key`. La librairie détecte le changement de clé, joue `FadeOut` sur l\'ancien écran et `FadeIn` sur le nouveau — **aucun `AnimatePresence` à envelopper**, les props entering/exiting portent ce comportement elles-mêmes. Ces transitions s\'exécutent aussi sur le thread UI, restant fluides même sous charge JS.' },
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
    description: 'Make motion directional by choosing the preset from a `dir` state: `SlideInRight`/`SlideOutLeft` going forward, the mirror going back. Chaining `.springify().damping(20)` swaps the default timing for **spring physics**, giving the slide weight and a touch of overshoot. A separately keyed icon uses `ZoomIn.delay(100)` so it pops *after* the screen lands — composing entering animations from these chainable builders is Reanimated\'s signature.',
    fr: { title: 'Direction de glissement + mise à l\'échelle d\'icône', description: 'Rendre le mouvement directionnel en choisissant le preset depuis un état `dir` : `SlideInRight`/`SlideOutLeft` en avançant, le miroir en reculant. Chaîner `.springify().damping(20)` remplace le timing par défaut par une **physique de ressort**, donnant au glissement du poids et un léger dépassement. Une icône clé séparée utilise `ZoomIn.delay(100)` pour surgir *après* l\'arrivée de l\'écran — composer les animations d\'entrée avec ces builders chaînables est la signature de Reanimated.' },
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
    description: 'Drive the dots imperatively with Reanimated\'s core hooks: a `useSharedValue` for width, animated via `withSpring`, and a `useAnimatedStyle` that maps that value onto the `View`. Pulling each dot into its own `Dot` component keeps one shared value per dot so they animate independently. This is the **shared-value model** under the layout-animation presets you used earlier — values live on the UI thread, so springs stay buttery regardless of JS work.',
    fr: { title: 'Points pilule animés', description: 'Piloter les pastilles de façon impérative avec les hooks centraux de Reanimated : un `useSharedValue` pour la largeur, animé via `withSpring`, et un `useAnimatedStyle` qui reporte cette valeur sur le `View`. Extraire chaque pastille dans son propre composant `Dot` garde une valeur partagée par pastille pour qu\'elles s\'animent indépendamment. C\'est le **modèle de valeurs partagées** sous-jacent aux presets de layout animation vus plus tôt — les valeurs vivent sur le thread UI, donc les springs restent fluides quel que soit le travail JS.' },
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
    description: 'In Flutter, mutable UI state lives in a `StatefulWidget`: hold `_step` in the `State` class and call `setState` to advance, which schedules a rebuild of `build()`. Indexing into a `const` list of record screens keeps the data declarative while the widget tree stays a pure function of `_step`. Internalizing this **state-triggers-rebuild** loop is the prerequisite for every animation step that follows.',
    fr: { title: 'Écrans statiques', description: 'En Flutter, l\'état d\'interface mutable vit dans un `StatefulWidget` : conserver `_step` dans la classe `State` et appeler `setState` pour avancer, ce qui planifie une reconstruction de `build()`. Indexer une liste `const` d\'écrans (records) garde les données déclaratives tandis que l\'arbre de widgets reste une fonction pure de `_step`. Intérioriser cette boucle **état déclenche reconstruction** est le prérequis de chaque étape d\'animation suivante.' },
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
    description: 'Wrap the screen `Column` in an `AnimatedSwitcher` and give it a `ValueKey(_step)`. The **key is what signals a swap**: when `_step` changes the key differs, so `AnimatedSwitcher` cross-fades the outgoing child out and the incoming one in. `FadeTransition` is the default builder — spelled out here for clarity. This is Flutter\'s built-in answer to animating *between* two discrete widgets without managing controllers yourself.',
    fr: { title: 'Fondu enchaîné AnimatedSwitcher', description: 'Envelopper le `Column` de l\'écran dans un `AnimatedSwitcher` et lui donner une `ValueKey(_step)`. La **clé signale le basculement** : quand `_step` change, la clé diffère, donc `AnimatedSwitcher` fait disparaître l\'enfant sortant et apparaître l\'entrant en fondu. `FadeTransition` est le builder par défaut — explicité ici pour la clarté. C\'est la réponse intégrée de Flutter pour animer *entre* deux widgets distincts sans gérer soi-même de contrôleurs.' },
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
    description: 'Replace the default fade by passing a custom `transitionBuilder` that wraps the child in a `SlideTransition` (plus a fade), with a `_forward` flag flipping the `Offset` so screens slide the way the user is heading. Nesting a second `AnimatedSwitcher` around the icon — keyed by `icon-$_step` — lets it **pop in independently** with its own scale+fade. Composing transition builders this way is how you get layered, staggered motion in Flutter.',
    fr: { title: 'Direction de glissement + pop d\'icône', description: 'Remplacer le fondu par défaut en passant un `transitionBuilder` personnalisé qui enveloppe l\'enfant dans un `SlideTransition` (plus un fondu), avec un drapeau `_forward` qui inverse l\'`Offset` pour que les écrans glissent dans le sens du déplacement. Imbriquer un second `AnimatedSwitcher` autour de l\'icône — clé par `icon-$_step` — la fait **surgir indépendamment** avec son propre scale+fondu. Composer ainsi les builders de transition donne un mouvement en couches et décalé en Flutter.' },
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
    description: 'Swap each static dot for an `AnimatedContainer` — an **implicitly animated widget** that tweens whenever its properties change. Toggling `width` between 8 and 24 and `color` based on `_step` makes the active pill stretch and recolor over the `easeOut` curve, no controller required. This implicit-animation pattern is Flutter\'s lowest-effort tool: describe the target values, hand it a `duration`, and it interpolates the rest for you.',
    fr: { title: 'Points pilule animés', description: 'Remplacer chaque point statique par un `AnimatedContainer` — un **widget implicitement animé** qui interpole dès que ses propriétés changent. Basculer `width` entre 8 et 24 et `color` selon `_step` fait que la pastille active s\'étire et change de couleur sur la courbe `easeOut`, sans contrôleur. Ce motif d\'animation implicite est l\'outil le moins coûteux de Flutter : décrire les valeurs cibles, fournir une `duration`, et il interpole le reste pour toi.' },
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
    description: 'Before animating anything, get the *structure* right: a list of items plus a detail overlay that mounts when an item is clicked. A single `selected` state value drives everything — the overlay renders only when an id is set. Nailing this state machine first means the animation work later is purely visual, with no logic to untangle.',
    fr: { title: 'Liste + overlay statique', description: 'Avant d\'animer quoi que ce soit, il faut poser la *structure* : une liste d\'éléments plus un overlay de détail qui se monte au clic. Une seule valeur d\'état `selected` pilote tout — l\'overlay ne s\'affiche que si un id est défini. Bien établir cette machine à états rend le travail d\'animation purement visuel, sans logique à démêler.' },
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
    description: 'Wrap the overlay in `AnimatePresence` so it can animate *out* as well as in — without it, React would unmount the overlay instantly and you\'d never see an exit. The backdrop fades via `opacity`, and a `spring` transition slides the bottom sheet up from below. This gives the modal real physical presence before any shared element is involved.',
    fr: { title: 'Backdrop animé + sheet', description: 'Envelopper l\'overlay dans `AnimatePresence` pour qu\'il puisse s\'animer *en sortie* aussi bien qu\'en entrée — sans cela, React démonterait l\'overlay instantanément et la sortie ne serait jamais visible. Le backdrop s\'estompe via `opacity`, et une transition `spring` fait glisser la bottom sheet depuis le bas. Cela donne au modal une vraie présence physique avant même d\'introduire l\'élément partagé.' },
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
    description: 'This is the heart of the shared-element effect. Give the list thumbnail and the detail banner the *same* `layoutId`, and Framer Motion treats them as one element — when one unmounts and the other mounts, it FLIP-animates between their positions and sizes automatically. *FLIP* (First, Last, Invert, Play) means it measures both rects and transforms between them, so a 48×48 thumbnail morphs smoothly into a full-width hero with zero manual math.',
    fr: { title: 'layoutId sur la miniature', description: 'C\'est le cœur de l\'effet d\'élément partagé. Donner à la miniature et à la bannière de détail le *même* `layoutId`, et Framer Motion les traite comme un seul élément — quand l\'un se démonte et l\'autre se monte, il anime entre leurs positions et tailles automatiquement avec FLIP. *FLIP* (First, Last, Invert, Play) mesure les deux rects et transforme entre eux, donc une miniature 48×48 se transforme en douceur en un héros pleine largeur sans aucun calcul manuel.' },
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
    description: 'The details separate a prototype from a shipped feature. Add the `layout` prop to every row so siblings glide into place instead of jumping when the overlay mounts and unmounts. Then tune the `layoutId` spring — lowering `stiffness` and `damping` gives the morph a slower, more cinematic feel that reads as deliberate rather than abrupt.',
    fr: { title: 'Polissage — spring + reflow de la liste', description: 'Ce sont les détails qui séparent un prototype d\'une fonctionnalité aboutie. Ajouter la prop `layout` à chaque ligne pour que les frères se replacent en douceur au lieu de sauter quand l\'overlay se monte et se démonte. Puis ajuster le spring du `layoutId` — baisser `stiffness` et `damping` donne au morph un rythme plus lent et cinématique, qui paraît délibéré plutôt que brusque.' },
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

/* ─────────────────────────────────────────────────────────────────── */
/*  morphing-button                                                      */
/* ─────────────────────────────────────────────────────────────────── */

const morphingButtonReact: Step[] = [
  {
    title: 'Static button',
    description: 'Start with a plain HTML button. Get the size, font, and border-radius right first. This is the idle state baseline everything else animates from.',
    fr: { title: 'Bouton statique', description: 'Commencez par un bouton HTML simple. Definissez la taille, la police et le rayon de bordure. C\'est la base de l\'etat inactif depuis laquelle tout s\'anime.' },
    code: `export function MorphingButton() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <button style={{
        borderRadius: 999,
        border: 'none',
        background: '#A3E635',
        color: '#0a0a0a',
        height: 48,
        width: 160,
        fontFamily: 'system-ui',
        fontWeight: 600,
        fontSize: 15,
        cursor: 'pointer',
      }}>
        Submit
      </button>
    </div>
  )
}`,
  },
  {
    title: 'Add state machine',
    description: 'Introduce a `state` variable that cycles idle -> loading -> success. The click handler drives the transitions. Nothing animates yet — verify the state changes work correctly in isolation.',
    fr: { title: 'Ajouter la machine d\'etat', description: 'Introduire une variable `state` qui cycle idle -> loading -> success. Le gestionnaire de clic pilote les transitions. Rien n\'anime encore — verifiez que les changements d\'etat fonctionnent correctement.' },
    code: `import { useState } from 'react'

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
      <button onClick={handleClick} style={{
        borderRadius: 999, border: 'none',
        background: state === 'success' ? '#22c55e' : '#A3E635',
        color: '#0a0a0a', height: 48, width: state === 'idle' ? 160 : 48,
        fontFamily: 'system-ui', fontWeight: 600, fontSize: 15,
        cursor: state === 'idle' ? 'pointer' : 'default',
      }}>
        {state === 'idle' ? 'Submit' : state === 'loading' ? '...' : 'OK'}
      </button>
    </div>
  )
}`,
  },
  {
    title: 'Animate width with motion.button layout',
    description: 'Replace the plain `button` with `motion.button` and add the `layout` prop. Framer Motion now animates the width change automatically using a spring. The button collapses to a circle on click.',
    fr: { title: 'Animer la largeur avec layout', description: 'Remplacer le `button` par `motion.button` avec la prop `layout`. Framer Motion anime maintenant le changement de largeur automatiquement avec un ressort. Le bouton se retrecit en cercle au clic.' },
    code: `import { useState } from 'react'
import { motion } from 'framer-motion'

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
          borderRadius: 999, border: 'none',
          background: state === 'success' ? '#22c55e' : '#A3E635',
          color: '#0a0a0a', height: 48,
          width: state === 'idle' ? 160 : 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          fontFamily: 'system-ui', fontWeight: 600, fontSize: 15,
          cursor: state === 'idle' ? 'pointer' : 'default',
        }}
      >
        {state === 'idle' ? 'Submit' : state === 'loading' ? '...' : 'OK'}
      </motion.button>
    </div>
  )
}`,
  },
  {
    title: 'Swap inner content with AnimatePresence',
    description: 'Wrap the inner content in `AnimatePresence mode="wait"` so each state\'s icon fades out before the next fades in. Add an SVG spinner for loading and an SVG checkmark for success — the check uses `pathLength` animation.',
    fr: { title: 'Alterner le contenu avec AnimatePresence', description: 'Envelopper le contenu interne dans `AnimatePresence mode="wait"` pour que chaque icone fade out avant que la suivante fade in. Ajouter un spinner SVG et une coche SVG animee via `pathLength`.' },
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
          borderRadius: 999, border: 'none',
          cursor: state === 'idle' ? 'pointer' : 'default',
          background: state === 'success' ? '#22c55e' : '#A3E635',
          color: '#0a0a0a', height: 48, width: state === 'idle' ? 160 : 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', fontFamily: 'system-ui', fontWeight: 600, fontSize: 15,
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
]

const morphingButtonNextjs: Step[] = [
  {
    title: 'Static button in a Client Component',
    description: 'Next.js requires the `"use client"` directive for any component with state or event handlers. Add it at the top — everything else is identical to the React version.',
    fr: { title: 'Bouton statique dans un composant client', description: 'Next.js exige la directive `"use client"` pour tout composant avec un etat ou des gestionnaires d\'evenements. Ajoutez-la en haut — tout le reste est identique a la version React.' },
    code: `'use client'

export function MorphingButton() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <button style={{
        borderRadius: 999, border: 'none',
        background: '#A3E635', color: '#0a0a0a',
        height: 48, width: 160,
        fontFamily: 'system-ui', fontWeight: 600, fontSize: 15,
        cursor: 'pointer',
      }}>
        Submit
      </button>
    </div>
  )
}`,
  },
  {
    title: 'Add state machine',
    description: 'Same state machine as React — `useState` works identically inside a Client Component. The `"use client"` directive unlocks all React hooks.',
    fr: { title: 'Ajouter la machine d\'etat', description: 'Meme machine d\'etat qu\'en React — `useState` fonctionne identiquement dans un composant client. La directive `"use client"` debloque tous les hooks React.' },
    code: `'use client'
import { useState } from 'react'

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
      <button onClick={handleClick} style={{
        borderRadius: 999, border: 'none',
        background: state === 'success' ? '#22c55e' : '#A3E635',
        color: '#0a0a0a', height: 48, width: state === 'idle' ? 160 : 48,
        fontFamily: 'system-ui', fontWeight: 600, fontSize: 15,
        cursor: state === 'idle' ? 'pointer' : 'default',
      }}>
        {state === 'idle' ? 'Submit' : state === 'loading' ? '...' : 'OK'}
      </button>
    </div>
  )
}`,
  },
  {
    title: 'Add motion.button layout animation',
    description: 'Framer Motion works the same in Next.js Client Components. Add `motion.button` with `layout` and a spring transition to animate the width collapse.',
    fr: { title: 'Ajouter l\'animation layout avec motion.button', description: 'Framer Motion fonctionne de la meme facon dans les composants client Next.js. Ajoutez `motion.button` avec `layout` et une transition ressort pour animer la contraction de la largeur.' },
    code: `'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

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
          borderRadius: 999, border: 'none',
          background: state === 'success' ? '#22c55e' : '#A3E635',
          color: '#0a0a0a', height: 48, width: state === 'idle' ? 160 : 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          fontFamily: 'system-ui', fontWeight: 600, fontSize: 15,
          cursor: state === 'idle' ? 'pointer' : 'default',
        }}
      >
        {state === 'idle' ? 'Submit' : state === 'loading' ? '...' : 'OK'}
      </motion.button>
    </div>
  )
}`,
  },
  {
    title: 'AnimatePresence for inner content swap',
    description: 'Complete the component with `AnimatePresence` for the spinner and check SVGs. The result is a fully functional morphing button as a Next.js Client Component ready for any App Router page.',
    fr: { title: 'AnimatePresence pour l\'echange de contenu', description: 'Completer le composant avec `AnimatePresence` pour le spinner et la coche SVG. Le resultat est un bouton morphing complet en composant client Next.js pret pour tout page App Router.' },
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
          borderRadius: 999, border: 'none',
          cursor: state === 'idle' ? 'pointer' : 'default',
          background: state === 'success' ? '#22c55e' : '#A3E635',
          color: '#0a0a0a', height: 48, width: state === 'idle' ? 160 : 48,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden', fontFamily: 'system-ui', fontWeight: 600, fontSize: 15,
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
]

const morphingButtonVue: Step[] = [
  {
    title: 'Static button',
    description: 'Start with a plain Vue `<button>`. Define the styles for the idle state. This establishes the visual baseline before any reactive state or animation.',
    fr: { title: 'Bouton statique', description: 'Commencez avec un simple `<button>` Vue. Definissez les styles pour l\'etat inactif. Cela etablit la base visuelle avant tout etat reactif ou animation.' },
    code: `<template>
  <div style="display:flex;justify-content:center;padding:40px">
    <button :style="{
      borderRadius: '999px', border: 'none',
      background: '#A3E635', color: '#0a0a0a',
      height: '48px', width: '160px',
      fontFamily: 'system-ui', fontWeight: 600, fontSize: '15px',
      cursor: 'pointer',
    }">
      Submit
    </button>
  </div>
</template>`,
  },
  {
    title: 'Add reactive state',
    description: 'Use `ref` from Vue 3 Composition API to track the button state. The `handleClick` async function drives the idle -> loading -> success cycle.',
    fr: { title: 'Ajouter l\'etat reactif', description: 'Utiliser `ref` de l\'API de composition Vue 3 pour suivre l\'etat du bouton. La fonction async `handleClick` pilote le cycle idle -> loading -> success.' },
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
      borderRadius: '999px', border: 'none',
      background: state === 'success' ? '#22c55e' : '#A3E635',
      color: '#0a0a0a', height: '48px',
      width: state === 'idle' ? '160px' : '48px',
      fontFamily: 'system-ui', fontWeight: 600, fontSize: '15px',
      cursor: state === 'idle' ? 'pointer' : 'default',
      transition: 'width 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s',
      overflow: 'hidden',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <span v-if="state === 'idle'">Submit</span>
      <span v-else-if="state === 'loading'">...</span>
      <span v-else>OK</span>
    </button>
  </div>
</template>`,
  },
  {
    title: 'Add CSS transitions and v-if content swap',
    description: 'Use Vue `<Transition>` component to fade content in and out between states. The `mode="out-in"` ensures the old content leaves before the new content enters — same behaviour as Framer Motion\'s `AnimatePresence mode="wait"`.',
    fr: { title: 'Ajouter des transitions CSS et l\'echange de contenu v-if', description: 'Utiliser le composant `<Transition>` de Vue pour faire apparaitre et disparaitre le contenu entre les etats. Le `mode="out-in"` garantit que l\'ancien contenu part avant que le nouveau arrive.' },
    code: `<script setup>
import { ref } from 'vue'

const state = ref('idle')

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
      borderRadius: '999px', border: 'none',
      background: state === 'success' ? '#22c55e' : '#A3E635',
      color: '#0a0a0a', height: '48px',
      width: state === 'idle' ? '160px' : '48px',
      transition: 'width 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s',
      overflow: 'hidden', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
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
]

const morphingButtonRN: Step[] = [
  {
    title: 'Static button with TouchableOpacity',
    description: 'Start with a plain `TouchableOpacity` and `View` in React Native. Define the dimensions for the idle state. React Native uses `StyleSheet` for performance-optimised styles.',
    fr: { title: 'Bouton statique avec TouchableOpacity', description: 'Commencez avec un simple `TouchableOpacity` et `View` en React Native. Definissez les dimensions pour l\'etat inactif. React Native utilise `StyleSheet` pour des styles optimises.' },
    code: `import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'

export function MorphingButton() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.label}>Submit</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 40 },
  button: {
    height: 48, width: 160,
    borderRadius: 999,
    backgroundColor: '#A3E635',
    alignItems: 'center', justifyContent: 'center',
  },
  label: { fontWeight: '600', fontSize: 15, color: '#0a0a0a' },
})`,
  },
  {
    title: 'Add state and animated width',
    description: 'Use `Animated.Value` for the button width and `Animated.spring` to animate it when state changes. React Native\'s `Animated` API drives native-thread animations without JS bridge overhead.',
    fr: { title: 'Ajouter l\'etat et la largeur animee', description: 'Utiliser `Animated.Value` pour la largeur du bouton et `Animated.spring` pour l\'animer lors des changements d\'etat. L\'API `Animated` de React Native pilote les animations sur le thread natif.' },
    code: `import { useRef, useState } from 'react'
import { TouchableOpacity, Text, StyleSheet, View, Animated } from 'react-native'

export function MorphingButton() {
  const [state, setState] = useState('idle')
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
      <Animated.View style={[styles.button, { width: widthAnim,
        backgroundColor: state === 'success' ? '#22c55e' : '#A3E635' }]}>
        <TouchableOpacity onPress={handlePress} style={styles.inner}>
          <Text style={styles.label}>
            {state === 'idle' ? 'Submit' : state === 'loading' ? '...' : 'OK'}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 40 },
  button: { height: 48, borderRadius: 999, overflow: 'hidden' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontWeight: '600', fontSize: 15, color: '#0a0a0a' },
})`,
  },
  {
    title: 'Add ActivityIndicator and checkmark',
    description: 'Replace the text labels with `ActivityIndicator` for the loading state and a custom SVG checkmark for success. Use conditional rendering to swap the inner content.',
    fr: { title: 'Ajouter ActivityIndicator et coche', description: 'Remplacer les labels texte par `ActivityIndicator` pour l\'etat loading et une coche personnalisee pour le succes. Utiliser le rendu conditionnel pour echanger le contenu interne.' },
    code: `import { useRef, useState } from 'react'
import {
  TouchableOpacity, Text, StyleSheet, View,
  Animated, ActivityIndicator
} from 'react-native'

export function MorphingButton() {
  const [state, setState] = useState('idle')
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
          {state === 'idle' && <Text style={styles.label}>Submit</Text>}
          {state === 'loading' && <ActivityIndicator color="#0a0a0a" size="small" />}
          {state === 'success' && <Text style={styles.check}>OK</Text>}
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 40 },
  button: { height: 48, borderRadius: 999, overflow: 'hidden' },
  inner: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontWeight: '600', fontSize: 15, color: '#0a0a0a' },
  check: { fontWeight: '700', fontSize: 16, color: '#fff' },
})`,
  },
]

const morphingButtonFlutter: Step[] = [
  {
    title: 'Static ElevatedButton',
    description: 'Start with a plain `ElevatedButton` styled to the idle shape. Flutter\'s `BorderRadius.circular` with a large value produces the pill shape. No state or animation yet.',
    fr: { title: 'ElevatedButton statique', description: 'Commencez avec un simple `ElevatedButton` style en forme de pilule. Le `BorderRadius.circular` de Flutter avec une grande valeur produit la forme pilule. Pas d\'etat ni d\'animation.' },
    code: `import 'package:flutter/material.dart';

class MorphingButton extends StatelessWidget {
  const MorphingButton({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: ElevatedButton(
        onPressed: () {},
        style: ElevatedButton.styleFrom(
          backgroundColor: const Color(0xFFA3E635),
          foregroundColor: const Color(0xFF0A0A0A),
          shape: const StadiumBorder(),
          minimumSize: const Size(160, 48),
        ),
        child: const Text('Submit',
          style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
      ),
    );
  }
}`,
  },
  {
    title: 'Add state with StatefulWidget',
    description: 'Convert to a `StatefulWidget` and add a `_ButtonState` enum. `setState` drives the rebuild when the state changes — this is Flutter\'s equivalent of React\'s `useState`.',
    fr: { title: 'Ajouter l\'etat avec StatefulWidget', description: 'Convertir en `StatefulWidget` et ajouter un enum `_ButtonState`. `setState` declenche le rebuild lors des changements d\'etat — c\'est l\'equivalent Flutter de `useState` en React.' },
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
      child: ElevatedButton(
        onPressed: _handleTap,
        style: ElevatedButton.styleFrom(
          backgroundColor: _state == _Btn.success
            ? const Color(0xFF22C55E) : const Color(0xFFA3E635),
          foregroundColor: const Color(0xFF0A0A0A),
          shape: const StadiumBorder(),
          minimumSize: Size(_state == _Btn.idle ? 160 : 48, 48),
        ),
        child: Text(_state == _Btn.idle ? 'Submit'
          : _state == _Btn.loading ? '...' : 'OK'),
      ),
    );
  }
}`,
  },
  {
    title: 'Animate width with AnimatedContainer',
    description: 'Wrap the button content in `AnimatedContainer` to smoothly interpolate the width change. The `duration` and `curve` control the spring-like feel. `AnimatedContainer` automatically animates any property change.',
    fr: { title: 'Animer la largeur avec AnimatedContainer', description: 'Envelopper le contenu dans `AnimatedContainer` pour interpoler en douceur le changement de largeur. La `duration` et la `curve` controlent l\'effet ressort. `AnimatedContainer` anime automatiquement tout changement de propriete.' },
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
              ? const Color(0xFF22C55E) : const Color(0xFFA3E635),
            borderRadius: BorderRadius.circular(999),
          ),
          child: Center(
            child: _state == _Btn.idle
              ? const Text('Submit',
                  style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15, color: Color(0xFF0A0A0A)))
              : _state == _Btn.loading
                ? const SizedBox(width: 20, height: 20,
                    child: CircularProgressIndicator(strokeWidth: 2.5, color: Color(0xFF0A0A0A)))
                : const Icon(Icons.check, color: Colors.white, size: 20),
          ),
        ),
      ),
    );
  }
}`,
  },
]

const morphingButton: StepMap = {
  react:          morphingButtonReact,
  nextjs:         morphingButtonNextjs,
  vue:            morphingButtonVue,
  'react-native': morphingButtonRN,
  flutter:        morphingButtonFlutter,
}

/* ─────────────────────────────────────────────────────────────────── */
/*  drag-reorder                                                         */
/* ─────────────────────────────────────────────────────────────────── */

const dragReorderReact: Step[] = [
  {
    title: 'Static list',
    description: 'Render a plain list of items with a drag handle icon. No dragging yet — focus on getting the layout, spacing, and handle position right.',
    fr: { title: 'Liste statique', description: 'Afficher une liste simple avec une icone de poignee. Pas de glisser encore — concentrez-vous sur la mise en page et la position de la poignee.' },
    code: `const ITEMS = [
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
]

export function DragReorder() {
  return (
    <ul style={{ listStyle: 'none', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {ITEMS.map(item => (
        <li key={item.id} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '12px 14px',
        }}>
          <span style={{ cursor: 'grab', color: 'var(--text-tertiary)' }}>::::</span>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
          <span style={{ fontFamily: 'system-ui', fontSize: 14 }}>{item.label}</span>
        </li>
      ))}
    </ul>
  )
}`,
  },
  {
    title: 'Add Reorder.Group and Reorder.Item',
    description: 'Replace `ul`/`li` with Framer Motion\'s `Reorder.Group` and `Reorder.Item`. Pass the `values` array and `onReorder` callback. Framer Motion now tracks drag position and reorders the array automatically.',
    fr: { title: 'Ajouter Reorder.Group et Reorder.Item', description: 'Remplacer `ul`/`li` par `Reorder.Group` et `Reorder.Item` de Framer Motion. Passer le tableau `values` et le callback `onReorder`. Framer Motion suit maintenant la position de glisser et reordonne le tableau automatiquement.' },
    code: `import { useState } from 'react'
import { Reorder } from 'framer-motion'

const INITIAL_ITEMS = [
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
]

export function DragReorder() {
  const [items, setItems] = useState(INITIAL_ITEMS)

  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems}
      style={{ listStyle: 'none', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(item => (
        <Reorder.Item key={item.id} value={item}
          style={{ display: 'flex', alignItems: 'center', gap: 12,
            background: 'var(--bg-secondary)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '12px 14px', listStyle: 'none' }}>
          <span style={{ cursor: 'grab', color: 'var(--text-tertiary)' }}>::::</span>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
          <span style={{ fontFamily: 'system-ui', fontSize: 14 }}>{item.label}</span>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}`,
  },
  {
    title: 'Restrict drag to handle only',
    description: 'Add `useDragControls` and set `dragListener={false}` on `Reorder.Item`. The `onPointerDown` on the handle element starts the drag — this prevents accidental drags when clicking on text.',
    fr: { title: 'Restreindre le glisser a la poignee', description: 'Ajouter `useDragControls` et definir `dragListener={false}` sur `Reorder.Item`. Le `onPointerDown` sur la poignee demarre le glisser — cela evite les glissers accidentels lors d\'un clic sur le texte.' },
    code: `import { useState } from 'react'
import { Reorder, useDragControls } from 'framer-motion'

const INITIAL_ITEMS = [
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
]

function ReorderItem({ item }) {
  const controls = useDragControls()
  return (
    <Reorder.Item value={item} dragListener={false} dragControls={controls}
      style={{ listStyle: 'none' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12,
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '12px 14px', userSelect: 'none' }}>
        <div onPointerDown={e => controls.start(e)}
          style={{ cursor: 'grab', color: 'var(--text-tertiary)' }}>::::</div>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
        <span style={{ fontFamily: 'system-ui', fontSize: 14 }}>{item.label}</span>
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
    title: 'Add lift effect on drag',
    description: 'Add `whileDrag` to the `Reorder.Item` to apply scale, shadow, and z-index while dragging. This gives the user clear visual feedback that an item is "picked up" and floating above the list.',
    fr: { title: 'Ajouter l\'effet de levee au glisser', description: 'Ajouter `whileDrag` a `Reorder.Item` pour appliquer scale, ombre et z-index pendant le glisser. Cela donne a l\'utilisateur un retour visuel clair que l\'element est "souleve" au-dessus de la liste.' },
    code: `import { useState } from 'react'
import { Reorder, useDragControls } from 'framer-motion'

const INITIAL_ITEMS = [
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
  { id: '5', label: 'Performance review',     color: '#E6C430' },
]

function ReorderItem({ item }) {
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
]

const dragReorderNextjs: Step[] = [
  {
    title: 'Static list as Client Component',
    description: 'Add `"use client"` — Framer Motion\'s drag features require browser APIs and must run on the client. The static list structure is identical to React.',
    fr: { title: 'Liste statique en composant client', description: 'Ajouter `"use client"` — les fonctionnalites de glisser de Framer Motion necessitent les APIs du navigateur et doivent s\'executer cote client.' },
    code: `'use client'

const ITEMS = [
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
]

export function DragReorder() {
  return (
    <ul style={{ listStyle: 'none', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {ITEMS.map(item => (
        <li key={item.id} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '12px 14px',
        }}>
          <span style={{ cursor: 'grab', color: 'var(--text-tertiary)' }}>::::</span>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
          <span style={{ fontFamily: 'system-ui', fontSize: 14 }}>{item.label}</span>
        </li>
      ))}
    </ul>
  )
}`,
  },
  {
    title: 'Add Reorder.Group',
    description: 'Wire up `Reorder.Group` and `useState`. Identical to the React version — Next.js Client Components use the same React hooks and Framer Motion API.',
    fr: { title: 'Ajouter Reorder.Group', description: 'Brancher `Reorder.Group` et `useState`. Identique a la version React — les composants client Next.js utilisent les memes hooks React et la meme API Framer Motion.' },
    code: `'use client'
import { useState } from 'react'
import { Reorder } from 'framer-motion'

const INITIAL_ITEMS = [
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
]

export function DragReorder() {
  const [items, setItems] = useState(INITIAL_ITEMS)
  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems}
      style={{ listStyle: 'none', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {items.map(item => (
        <Reorder.Item key={item.id} value={item} style={{ listStyle: 'none',
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--bg-secondary)', border: '1px solid var(--border)',
          borderRadius: 10, padding: '12px 14px' }}>
          <span style={{ cursor: 'grab' }}>::::</span>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
          <span style={{ fontFamily: 'system-ui', fontSize: 14 }}>{item.label}</span>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  )
}`,
  },
  {
    title: 'Add drag handle and whileDrag lift',
    description: 'Extract `ReorderItem` as a separate Client Component with `useDragControls`. The `whileDrag` prop adds the lifted appearance. Both components need `"use client"` when they live in separate files.',
    fr: { title: 'Ajouter la poignee et l\'effet de levee', description: 'Extraire `ReorderItem` en composant client separe avec `useDragControls`. La prop `whileDrag` ajoute l\'apparence soulevee. Les deux composants ont besoin de `"use client"` dans des fichiers separes.' },
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

function ReorderItem({ item }) {
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
            display: 'flex', flexDirection: 'column', gap: 3 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ display: 'flex', gap: 3 }}>
              <div style={{ width: 3, height: 3, borderRadius: 1, background: 'currentColor' }} />
              <div style={{ width: 3, height: 3, borderRadius: 1, background: 'currentColor' }} />
            </div>
          ))}
        </div>
        <div style={{ width: 10, height: 10, borderRadius: '50%', background: item.color }} />
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
]

const dragReorderVue: Step[] = [
  {
    title: 'Static list',
    description: 'Render a plain `v-for` list with a drag handle. No drag yet — establish the visual layout first.',
    fr: { title: 'Liste statique', description: 'Afficher une liste `v-for` simple avec une poignee. Pas de glisser encore — etablissez d\'abord la mise en page visuelle.' },
    code: `<script setup>
const items = [
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
]
</script>

<template>
  <ul style="list-style:none;padding:12px 16px;display:flex;flex-direction:column;gap:8px">
    <li v-for="item in items" :key="item.id"
      style="display:flex;align-items:center;gap:12px;
        background:var(--bg-secondary);border:1px solid var(--border);
        border-radius:10px;padding:12px 14px">
      <span style="cursor:grab;color:var(--text-tertiary)">::::</span>
      <div :style="{ width:'10px', height:'10px', borderRadius:'50%', background: item.color }" />
      <span style="font-family:system-ui;font-size:14px">{{ item.label }}</span>
    </li>
  </ul>
</template>`,
  },
  {
    title: 'Install and configure vuedraggable',
    description: 'Install `vuedraggable` (wraps SortableJS). Replace the `ul` with `<draggable>` and bind `v-model` to the reactive items array. SortableJS handles the DOM drag detection and array mutation.',
    fr: { title: 'Installer et configurer vuedraggable', description: 'Installer `vuedraggable` (encapsule SortableJS). Remplacer le `ul` par `<draggable>` et lier `v-model` au tableau reactif. SortableJS gere la detection du drag et la mutation du tableau.' },
    code: `<script setup>
import { ref } from 'vue'
import draggable from 'vuedraggable'

const items = ref([
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
])
</script>

<template>
  <draggable v-model="items" item-key="id" tag="ul"
    style="list-style:none;padding:12px 16px;display:flex;flex-direction:column;gap:8px">
    <template #item="{ element }">
      <li style="display:flex;align-items:center;gap:12px;
        background:var(--bg-secondary);border:1px solid var(--border);
        border-radius:10px;padding:12px 14px;cursor:grab">
        <span style="color:var(--text-tertiary)">::::</span>
        <div :style="{ width:'10px', height:'10px', borderRadius:'50%', background: element.color }" />
        <span style="font-family:system-ui;font-size:14px">{{ element.label }}</span>
      </li>
    </template>
  </draggable>
</template>`,
  },
  {
    title: 'Add animation and lift on drag',
    description: 'Pass `animation` to `<draggable>` for the sibling shuffle animation. Add a CSS class for the ghost (dragged item) and a chosen class for the lifted appearance.',
    fr: { title: 'Ajouter animation et levee au glisser', description: 'Passer `animation` a `<draggable>` pour l\'animation des voisins. Ajouter une classe CSS pour le ghost (element glisse) et une classe chosen pour l\'apparence soulevee.' },
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
        <span style="color:var(--text-tertiary)">::::</span>
        <div :style="{ width:'10px', height:'10px', borderRadius:'50%', background: element.color, flexShrink:0 }" />
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
]

const dragReorderRN: Step[] = [
  {
    title: 'Static FlatList',
    description: 'Render a plain `FlatList` with a drag handle indicator. No drag yet — verify the list renders correctly and items are spaced properly.',
    fr: { title: 'FlatList statique', description: 'Afficher un simple `FlatList` avec un indicateur de poignee. Pas de glisser encore — verifiez que la liste s\'affiche correctement.' },
    code: `import { View, Text, FlatList, StyleSheet } from 'react-native'

const ITEMS = [
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
]

export function DragReorder() {
  return (
    <FlatList
      data={ITEMS}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 16, gap: 8 }}
      renderItem={({ item }) => (
        <View style={styles.row}>
          <Text style={styles.handle}>::</Text>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333',
    borderRadius: 10, padding: 12 },
  handle: { color: '#666', fontSize: 16 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { fontFamily: 'System', fontSize: 14, color: '#fff', flex: 1 },
})`,
  },
  {
    title: 'Install react-native-draggable-flatlist',
    description: 'Replace `FlatList` with `DraggableFlatList` from `react-native-draggable-flatlist`. Pass `onDragEnd` to update the data array. The library uses `react-native-reanimated` internally for smooth native-thread animations.',
    fr: { title: 'Installer react-native-draggable-flatlist', description: 'Remplacer `FlatList` par `DraggableFlatList` de `react-native-draggable-flatlist`. Passer `onDragEnd` pour mettre a jour le tableau. La bibliotheque utilise `react-native-reanimated` en interne.' },
    code: `import { useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import DraggableFlatList from 'react-native-draggable-flatlist'

const INITIAL_ITEMS = [
  { id: '1', label: 'Design system tokens', color: '#534AB7' },
  { id: '2', label: 'Component architecture', color: '#1D9E75' },
  { id: '3', label: 'Animation library',      color: '#D85A30' },
  { id: '4', label: 'Accessibility audit',    color: '#A3E635' },
]

export function DragReorder() {
  const [items, setItems] = useState(INITIAL_ITEMS)

  return (
    <DraggableFlatList
      data={items}
      keyExtractor={item => item.id}
      onDragEnd={({ data }) => setItems(data)}
      contentContainerStyle={{ padding: 16, gap: 8 }}
      renderItem={({ item, drag }) => (
        <View style={styles.row}>
          <Text style={styles.handle} onLongPress={drag}>::</Text>
          <View style={[styles.dot, { backgroundColor: item.color }]} />
          <Text style={styles.label}>{item.label}</Text>
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333',
    borderRadius: 10, padding: 12 },
  handle: { color: '#666', fontSize: 16 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { fontFamily: 'System', fontSize: 14, color: '#fff', flex: 1 },
})`,
  },
  {
    title: 'Add visual lift on drag',
    description: 'Use `isActive` from the `renderItem` callback to apply a lifted style (scale + shadow) while an item is being dragged. This gives the same visual feedback as `whileDrag` in Framer Motion.',
    fr: { title: 'Ajouter l\'effet visuel de levee', description: 'Utiliser `isActive` du callback `renderItem` pour appliquer un style souleve (scale + ombre) pendant le glisser. Cela donne le meme retour visuel que `whileDrag` dans Framer Motion.' },
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

export function DragReorder() {
  const [items, setItems] = useState(INITIAL_ITEMS)

  return (
    <DraggableFlatList
      data={items}
      keyExtractor={item => item.id}
      onDragEnd={({ data }) => setItems(data)}
      contentContainerStyle={{ padding: 16, gap: 8 }}
      renderItem={({ item, drag, isActive }) => (
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
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { fontFamily: 'System', fontSize: 14, color: '#fff', flex: 1 },
})`,
  },
]

const dragReorderFlutter: Step[] = [
  {
    title: 'Static list with drag handle icons',
    description: 'Build a plain `ListView` with `ListTile` and a `drag_handle` icon. No drag yet — confirm the layout renders correctly.',
    fr: { title: 'Liste statique avec icones de poignee', description: 'Construire un `ListView` simple avec `ListTile` et une icone `drag_handle`. Pas de glisser encore — verifiez que la mise en page s\'affiche correctement.' },
    code: `import 'package:flutter/material.dart';

const _items = [
  (label: 'Design system tokens', color: Color(0xFF534AB7)),
  (label: 'Component architecture', color: Color(0xFF1D9E75)),
  (label: 'Animation library',      color: Color(0xFFD85A30)),
  (label: 'Accessibility audit',    color: Color(0xFFA3E635)),
];

class DragReorder extends StatelessWidget {
  const DragReorder({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.all(16),
      itemCount: _items.length,
      separatorBuilder: (_, __) => const SizedBox(height: 8),
      itemBuilder: (context, index) {
        final item = _items[index];
        return Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.grey[900],
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.grey[800]!),
          ),
          child: Row(children: [
            const Icon(Icons.drag_handle, color: Colors.grey),
            const SizedBox(width: 12),
            Container(width: 10, height: 10,
              decoration: BoxDecoration(color: item.color, shape: BoxShape.circle)),
            const SizedBox(width: 12),
            Text(item.label, style: const TextStyle(fontSize: 14, color: Colors.white)),
          ]),
        );
      },
    );
  }
}`,
  },
  {
    title: 'Convert to ReorderableListView',
    description: 'Replace `ListView` with Flutter\'s built-in `ReorderableListView`. It provides drag-to-reorder out of the box. The `onReorder` callback gives you the `oldIndex` and `newIndex` to update the list.',
    fr: { title: 'Convertir en ReorderableListView', description: 'Remplacer `ListView` par le `ReorderableListView` integre de Flutter. Il fournit le glisser-pour-reordonner directement. Le callback `onReorder` donne les index pour mettre a jour la liste.' },
    code: `import 'package:flutter/material.dart';

class DragReorder extends StatefulWidget {
  const DragReorder({super.key});
  @override
  State<DragReorder> createState() => _DragReorderState();
}

class _DragReorderState extends State<DragReorder> {
  final _items = [
    (id: '1', label: 'Design system tokens', color: const Color(0xFF534AB7)),
    (id: '2', label: 'Component architecture', color: const Color(0xFF1D9E75)),
    (id: '3', label: 'Animation library',      color: const Color(0xFFD85A30)),
    (id: '4', label: 'Accessibility audit',    color: const Color(0xFFA3E635)),
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
      itemBuilder: (context, index) {
        final item = _items[index];
        return Container(
          key: ValueKey(item.id),
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            color: Colors.grey[900],
            borderRadius: BorderRadius.circular(10),
            border: Border.all(color: Colors.grey[800]!),
          ),
          child: Row(children: [
            const Icon(Icons.drag_handle, color: Colors.grey),
            const SizedBox(width: 12),
            Container(width: 10, height: 10,
              decoration: BoxDecoration(color: item.color, shape: BoxShape.circle)),
            const SizedBox(width: 12),
            Text(item.label, style: const TextStyle(fontSize: 14, color: Colors.white)),
          ]),
        );
      },
    );
  }
}`,
  },
  {
    title: 'Custom drag handle and animated lift',
    description: 'Use `ReorderableDragStartListener` to restrict dragging to the handle icon only. Wrap each item in an `AnimatedContainer` to apply a scale effect when active — Flutter\'s `ReorderableListView` passes a drag proxy that animates automatically.',
    fr: { title: 'Poignee personnalisee et levee animee', description: 'Utiliser `ReorderableDragStartListener` pour restreindre le glisser a la poignee uniquement. Envelopper dans `AnimatedContainer` pour l\'effet scale — le proxy de glisser de Flutter anime automatiquement.' },
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
]

const dragReorder: StepMap = {
  react:          dragReorderReact,
  nextjs:         dragReorderNextjs,
  vue:            dragReorderVue,
  'react-native': dragReorderRN,
  flutter:        dragReorderFlutter,
}

/* ─────────────────────────────────────────────────────────────────── */
/*  number-counter                                                       */
/* ─────────────────────────────────────────────────────────────────── */

const numberCounterReact: Step[] = [
  {
    title: 'Static number display',
    description: 'Start with a plain `span` showing the target number. Get the typography, font size, and container layout right before adding any animation.',
    fr: { title: 'Affichage statique du nombre', description: 'Commencez avec un simple `span` affichant le nombre cible. Reglez la typographie et la mise en page du conteneur avant d\'ajouter une animation.' },
    code: `export function Counter() {
  return (
    <div style={{ display: 'flex', gap: 24, padding: 32, justifyContent: 'center' }}>
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 14, padding: '20px 28px', textAlign: 'center',
      }}>
        <div style={{ fontFamily: 'system-ui', fontSize: 32, fontWeight: 800,
          color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          2,400,000
        </div>
        <div style={{ fontFamily: 'system-ui', fontSize: 12,
          color: 'var(--text-tertiary)', marginTop: 4 }}>Revenue</div>
      </div>
    </div>
  )
}`,
  },
  {
    title: 'Add useMotionValue and animate',
    description: 'Import `useMotionValue` and `animate` from Framer Motion. The `animate` function drives the motion value from 0 to the target on mount. `useTransform` converts the raw float to a formatted string.',
    fr: { title: 'Ajouter useMotionValue et animate', description: 'Importer `useMotionValue` et `animate` de Framer Motion. La fonction `animate` pilote la valeur de 0 vers la cible au montage. `useTransform` convertit le flottant en chaine formatee.' },
    code: `import { useEffect } from 'react'
import { useMotionValue, useTransform, animate, motion } from 'framer-motion'

export function Counter({ to = 2400000, prefix = '$' }) {
  const val  = useMotionValue(0)
  const disp = useTransform(val, v =>
    prefix + Math.round(v).toLocaleString()
  )

  useEffect(() => {
    const ctrl = animate(val, to, { duration: 1.8, ease: [0.16, 1, 0.3, 1] })
    return () => ctrl.stop()
  }, [val, to])

  return (
    <div style={{ display: 'flex', gap: 24, padding: 32, justifyContent: 'center' }}>
      <div style={{
        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
        borderRadius: 14, padding: '20px 28px', textAlign: 'center',
      }}>
        <motion.div style={{
          fontFamily: 'system-ui', fontSize: 32, fontWeight: 800,
          color: 'var(--text-primary)', letterSpacing: '-0.03em',
        }}>
          {disp}
        </motion.div>
        <div style={{ fontFamily: 'system-ui', fontSize: 12,
          color: 'var(--text-tertiary)', marginTop: 4 }}>Revenue</div>
      </div>
    </div>
  )
}`,
  },
  {
    title: 'Trigger on viewport enter with useInView',
    description: 'Replace the immediate `useEffect` trigger with `useInView`. The counter only starts counting when it scrolls into the viewport — use `once: true` so it does not replay on scroll-back.',
    fr: { title: 'Declencher a l\'entree dans le viewport avec useInView', description: 'Remplacer le declenchement immediat de `useEffect` par `useInView`. Le compteur ne commence a compter que lorsqu\'il entre dans le viewport — utiliser `once: true` pour ne pas rejouer au defilement.' },
    code: `import { useEffect, useRef } from 'react'
import { useMotionValue, useTransform, animate, motion, useInView } from 'framer-motion'

export function Counter({ to = 2400000, prefix = '$', duration = 1.8 }) {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const val    = useMotionValue(0)
  const disp   = useTransform(val, v => prefix + Math.round(v).toLocaleString())

  useEffect(() => {
    if (!inView) return
    const ctrl = animate(val, to, { duration, ease: [0.16, 1, 0.3, 1] })
    return () => ctrl.stop()
  }, [inView, val, to, duration])

  return (
    <div ref={ref} style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '20px 28px', textAlign: 'center',
    }}>
      <motion.div style={{
        fontFamily: 'system-ui', fontSize: 32, fontWeight: 800,
        color: 'var(--text-primary)', letterSpacing: '-0.03em',
      }}>
        {disp}
      </motion.div>
      <div style={{ fontFamily: 'system-ui', fontSize: 12,
        color: 'var(--text-tertiary)', marginTop: 4 }}>Revenue</div>
    </div>
  )
}`,
  },
  {
    title: 'Full dashboard with multiple counters',
    description: 'Extract the counter into a reusable component that accepts `from`, `to`, `prefix`, `suffix`, and `decimals`. Render a stat card grid. Each counter starts independently when its card enters the viewport.',
    fr: { title: 'Tableau de bord complet avec plusieurs compteurs', description: 'Extraire le compteur en composant reutilisable acceptant `from`, `to`, `prefix`, `suffix` et `decimals`. Afficher une grille de cartes de statistiques. Chaque compteur demarre independamment quand sa carte entre dans le viewport.' },
    code: `import { useEffect, useRef } from 'react'
import { useMotionValue, useTransform, animate, motion, useInView } from 'framer-motion'

interface CounterProps {
  from?: number; to: number; duration?: number
  prefix?: string; suffix?: string; decimals?: number
}

export function Counter({ from = 0, to, duration = 1.8, prefix = '', suffix = '', decimals = 0 }: CounterProps) {
  const ref  = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const val  = useMotionValue(from)
  const disp = useTransform(val, v =>
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
  { to: 2400000, prefix: '$', label: 'Revenue', duration: 2 },
  { to: 98.6, suffix: '%', label: 'Uptime', decimals: 1, duration: 1.6 },
  { to: 14832, label: 'Users', duration: 1.8 },
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
]

const numberCounterNextjs: Step[] = [
  {
    title: 'Static counter as Client Component',
    description: 'Add `"use client"` — the counter uses `useEffect` and `useRef` which require a browser environment. Static server rendering would output the raw number without animation.',
    fr: { title: 'Compteur statique en composant client', description: 'Ajouter `"use client"` — le compteur utilise `useEffect` et `useRef` qui necessitent un environnement navigateur. Le rendu serveur statique afficherait le nombre brut sans animation.' },
    code: `'use client'

export function Counter() {
  return (
    <div style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '20px 28px', textAlign: 'center',
    }}>
      <div style={{ fontFamily: 'system-ui', fontSize: 32, fontWeight: 800,
        color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
        2,400,000
      </div>
      <div style={{ fontFamily: 'system-ui', fontSize: 12,
        color: 'var(--text-tertiary)', marginTop: 4 }}>Revenue</div>
    </div>
  )
}`,
  },
  {
    title: 'Add animation with useMotionValue',
    description: 'Same as React — `useMotionValue`, `useTransform`, and `animate` work identically in Next.js Client Components. The `"use client"` directive is the only difference.',
    fr: { title: 'Ajouter l\'animation avec useMotionValue', description: 'Identique a React — `useMotionValue`, `useTransform` et `animate` fonctionnent de facon identique dans les composants client Next.js. La directive `"use client"` est la seule difference.' },
    code: `'use client'
import { useEffect } from 'react'
import { useMotionValue, useTransform, animate, motion } from 'framer-motion'

export function Counter({ to = 2400000, prefix = '$', duration = 1.8 }) {
  const val  = useMotionValue(0)
  const disp = useTransform(val, v => prefix + Math.round(v).toLocaleString())

  useEffect(() => {
    const ctrl = animate(val, to, { duration, ease: [0.16, 1, 0.3, 1] })
    return () => ctrl.stop()
  }, [val, to, duration])

  return (
    <div style={{
      background: 'var(--bg-secondary)', border: '1px solid var(--border)',
      borderRadius: 14, padding: '20px 28px', textAlign: 'center',
    }}>
      <motion.div style={{ fontFamily: 'system-ui', fontSize: 32, fontWeight: 800,
        color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
        {disp}
      </motion.div>
      <div style={{ fontFamily: 'system-ui', fontSize: 12,
        color: 'var(--text-tertiary)', marginTop: 4 }}>Revenue</div>
    </div>
  )
}`,
  },
  {
    title: 'Trigger on scroll with useInView',
    description: 'Add `useInView` so the counter only animates when in the viewport. In Next.js, the page can be long — triggering on scroll rather than mount is especially important for below-the-fold stat sections.',
    fr: { title: 'Declencher au defilement avec useInView', description: 'Ajouter `useInView` pour que le compteur ne s\'anime qu\'au scroll. Dans Next.js, la page peut etre longue — declencher au defilement plutot qu\'au montage est particulierement important pour les sections statistiques.' },
    code: `'use client'
import { useEffect, useRef } from 'react'
import { useMotionValue, useTransform, animate, motion, useInView } from 'framer-motion'

interface CounterProps {
  from?: number; to: number; duration?: number
  prefix?: string; suffix?: string; decimals?: number
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
  { to: 2400000, prefix: '$', label: 'Revenue', duration: 2 },
  { to: 98.6, suffix: '%', label: 'Uptime', decimals: 1, duration: 1.6 },
  { to: 14832, label: 'Users', duration: 1.8 },
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
]

const numberCounterVue: Step[] = [
  {
    title: 'Static counter',
    description: 'Start with a plain template showing a hardcoded number. Establish the card layout and typography before adding reactivity.',
    fr: { title: 'Compteur statique', description: 'Commencez par un template simple affichant un nombre en dur. Etablissez la mise en page de la carte et la typographie avant d\'ajouter la reactivite.' },
    code: `<template>
  <div style="display:flex;gap:24px;padding:32px;flex-wrap:wrap;justify-content:center">
    <div style="background:var(--bg-secondary);border:1px solid var(--border);
      border-radius:14px;padding:20px 28px;text-align:center;min-width:140px">
      <div style="font-family:system-ui;font-size:32px;font-weight:800;
        color:var(--text-primary);letter-spacing:-0.03em">
        2,400,000
      </div>
      <div style="font-family:system-ui;font-size:12px;color:var(--text-tertiary);margin-top:4px">
        Revenue
      </div>
    </div>
  </div>
</template>`,
  },
  {
    title: 'Animate with GSAP on mount',
    description: 'Install `gsap` and use `gsap.to` to animate a reactive `count` ref from 0 to the target on `onMounted`. GSAP\'s `onUpdate` callback updates the ref each frame.',
    fr: { title: 'Animer avec GSAP au montage', description: 'Installer `gsap` et utiliser `gsap.to` pour animer un ref reactif `count` de 0 vers la cible dans `onMounted`. Le callback `onUpdate` de GSAP met a jour le ref a chaque frame.' },
    code: `<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({ to: { type: Number, default: 2400000 } })
const count = ref(0)

onMounted(() => {
  gsap.to(count, {
    value: props.to,
    duration: 1.8,
    ease: 'power3.out',
    onUpdate: () => { count.value = count.value },
  })
})
</script>

<template>
  <div style="background:var(--bg-secondary);border:1px solid var(--border);
    border-radius:14px;padding:20px 28px;text-align:center;min-width:140px">
    <div style="font-family:system-ui;font-size:32px;font-weight:800;
      color:var(--text-primary);letter-spacing:-0.03em">
      {{ Math.round(count).toLocaleString() }}
    </div>
  </div>
</template>`,
  },
  {
    title: 'Trigger on viewport entry with IntersectionObserver',
    description: 'Use `useIntersectionObserver` (from VueUse) or a manual `IntersectionObserver` to delay the animation until the element scrolls into view. Disconnect after first trigger.',
    fr: { title: 'Declencher a l\'entree dans le viewport', description: 'Utiliser `useIntersectionObserver` (de VueUse) ou un `IntersectionObserver` manuel pour retarder l\'animation jusqu\'a ce que l\'element entre dans le viewport. Deconnecter apres le premier declenchement.' },
    code: `<script setup>
import { ref, onMounted } from 'vue'
import gsap from 'gsap'

const props = defineProps({
  to:       { type: Number, default: 2400000 },
  prefix:   { type: String, default: '' },
  suffix:   { type: String, default: '' },
  decimals: { type: Number, default: 0 },
  duration: { type: Number, default: 1.8 },
})

const el    = ref(null)
const count = ref({ value: 0 })

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      gsap.to(count.value, {
        value: props.to, duration: props.duration, ease: 'power3.out',
      })
    },
    { threshold: 0.1 }
  )
  if (el.value) observer.observe(el.value)
})

function fmt(v) {
  return props.prefix + Number(v).toFixed(props.decimals)
    .replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',') + props.suffix
}
</script>

<template>
  <div ref="el" style="background:var(--bg-secondary);border:1px solid var(--border);
    border-radius:14px;padding:20px 28px;text-align:center;min-width:140px">
    <div style="font-family:system-ui;font-size:32px;font-weight:800;
      color:var(--text-primary);letter-spacing:-0.03em">
      {{ fmt(count.value) }}
    </div>
  </div>
</template>`,
  },
]

const numberCounterRN: Step[] = [
  {
    title: 'Static number display',
    description: 'Render a plain `Text` component with the target value. Get the card styles and typography right before adding animation.',
    fr: { title: 'Affichage statique du nombre', description: 'Afficher un simple composant `Text` avec la valeur cible. Reglez les styles de la carte et la typographie avant d\'ajouter l\'animation.' },
    code: `import { View, Text, StyleSheet } from 'react-native'

export function Counter() {
  return (
    <View style={styles.card}>
      <Text style={styles.number}>2,400,000</Text>
      <Text style={styles.label}>Revenue</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333',
    borderRadius: 14, padding: 20, alignItems: 'center', minWidth: 140,
  },
  number: { fontFamily: 'System', fontSize: 32, fontWeight: '800', color: '#fff' },
  label:  { fontFamily: 'System', fontSize: 12, color: '#666', marginTop: 4 },
})`,
  },
  {
    title: 'Animate with Animated.timing',
    description: 'Use `Animated.Value` starting at 0 and `Animated.timing` to animate it to the target on mount. An `addListener` extracts the raw value each frame to update the displayed text.',
    fr: { title: 'Animer avec Animated.timing', description: 'Utiliser `Animated.Value` partant de 0 et `Animated.timing` pour l\'animer vers la cible au montage. Un `addListener` extrait la valeur brute a chaque frame pour mettre a jour le texte affiche.' },
    code: `import { useRef, useState, useEffect } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'

export function Counter({ to = 2400000, prefix = '$', duration = 1800 }) {
  const anim = useRef(new Animated.Value(0)).current
  const [display, setDisplay] = useState('0')

  useEffect(() => {
    anim.addListener(({ value }) => {
      setDisplay(prefix + Math.round(value).toLocaleString())
    })
    Animated.timing(anim, {
      toValue: to, duration, easing: t => 1 - Math.pow(1 - t, 3),
      useNativeDriver: false,
    }).start()
    return () => anim.removeAllListeners()
  }, [to, duration])

  return (
    <View style={styles.card}>
      <Text style={styles.number}>{display}</Text>
      <Text style={styles.label}>Revenue</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333',
    borderRadius: 14, padding: 20, alignItems: 'center', minWidth: 140 },
  number: { fontFamily: 'System', fontSize: 32, fontWeight: '800', color: '#fff' },
  label:  { fontFamily: 'System', fontSize: 12, color: '#666', marginTop: 4 },
})`,
  },
  {
    title: 'Trigger on screen entry with useIsFocused',
    description: 'In React Native, screens mount when navigated to. Use `useIsFocused` (React Navigation) or track the component mount to start the animation. For scroll-triggered, use the `onLayout` + scroll position approach.',
    fr: { title: 'Declencher a l\'entree a l\'ecran', description: 'En React Native, les ecrans se montent a la navigation. Utiliser `useIsFocused` (React Navigation) ou suivre le montage du composant pour demarrer l\'animation.' },
    code: `import { useRef, useState, useEffect } from 'react'
import { View, Text, Animated, StyleSheet } from 'react-native'

interface CounterProps {
  to: number; prefix?: string; suffix?: string; duration?: number
}

export function Counter({ to, prefix = '', suffix = '', duration = 1800 }: CounterProps) {
  const anim    = useRef(new Animated.Value(0)).current
  const [display, setDisplay] = useState(prefix + '0' + suffix)

  useEffect(() => {
    const id = anim.addListener(({ value }) => {
      setDisplay(prefix + Math.round(value).toLocaleString() + suffix)
    })
    Animated.timing(anim, {
      toValue: to, duration,
      easing: t => 1 - Math.pow(1 - t, 3),
      useNativeDriver: false,
    }).start()
    return () => anim.removeListener(id)
  }, [to, duration])

  return <Text style={styles.number}>{display}</Text>
}

const STATS = [
  { to: 2400000, prefix: '$', label: 'Revenue', duration: 2000 },
  { to: 14832,               label: 'Users',   duration: 1800 },
]

export function Dashboard() {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16, padding: 24, justifyContent: 'center' }}>
      {STATS.map(s => (
        <View key={s.label} style={styles.card}>
          <Counter {...s} />
          <Text style={styles.label}>{s.label}</Text>
        </View>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1a1a1a', borderWidth: 1, borderColor: '#333',
    borderRadius: 14, padding: 20, alignItems: 'center', minWidth: 140 },
  number: { fontFamily: 'System', fontSize: 32, fontWeight: '800', color: '#fff' },
  label:  { fontFamily: 'System', fontSize: 12, color: '#666', marginTop: 4 },
})`,
  },
]

const numberCounterFlutter: Step[] = [
  {
    title: 'Static counter card',
    description: 'Build a plain `Container` with styled `Text` widgets. This is the target visual state the animation counts up to.',
    fr: { title: 'Carte compteur statique', description: 'Construire un simple `Container` avec des widgets `Text` styles. C\'est l\'etat visuel cible vers lequel l\'animation compte.' },
    code: `import 'package:flutter/material.dart';

class CounterCard extends StatelessWidget {
  const CounterCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF333333)),
      ),
      child: Column(mainAxisSize: MainAxisSize.min, children: const [
        Text('2,400,000',
          style: TextStyle(fontSize: 32, fontWeight: FontWeight.w800,
            color: Colors.white, letterSpacing: -1)),
        SizedBox(height: 4),
        Text('Revenue',
          style: TextStyle(fontSize: 12, color: Colors.grey)),
      ]),
    );
  }
}`,
  },
  {
    title: 'Animate with TweenAnimationBuilder',
    description: '`TweenAnimationBuilder` animates a `double` from 0 to the target over a duration. The `builder` callback receives the current value each frame — format it and display it in the `Text` widget.',
    fr: { title: 'Animer avec TweenAnimationBuilder', description: '`TweenAnimationBuilder` anime un `double` de 0 vers la cible sur une duree. Le callback `builder` recoit la valeur actuelle a chaque frame — formatez-la et affichez-la dans le widget `Text`.' },
    code: `import 'package:flutter/material.dart';

class CounterCard extends StatelessWidget {
  final double to;
  final String prefix;
  final String label;
  const CounterCard({super.key, required this.to, this.prefix = '', required this.label});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A1A),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: const Color(0xFF333333)),
      ),
      child: Column(mainAxisSize: MainAxisSize.min, children: [
        TweenAnimationBuilder<double>(
          tween: Tween(begin: 0, end: to),
          duration: const Duration(milliseconds: 1800),
          curve: Curves.easeOutCubic,
          builder: (context, value, _) {
            final formatted = prefix +
              value.round().toString().replaceAllMapped(
                RegExp(r'(\\d)(?=(\\d{3})+(?!\\d))'), (m) => '\${m[1]},');
            return Text(formatted,
              style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w800,
                color: Colors.white, letterSpacing: -1));
          },
        ),
        const SizedBox(height: 4),
        Text(label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
      ]),
    );
  }
}`,
  },
  {
    title: 'Trigger on visibility with VisibilityDetector',
    description: 'Add the `visibility_detector` package. Wrap the counter in `VisibilityDetector` and use a `StatefulWidget` to track whether the card is visible. The `Tween` `end` switches from 0 to the target when visibility is detected.',
    fr: { title: 'Declencher sur la visibilite avec VisibilityDetector', description: 'Ajouter le package `visibility_detector`. Envelopper le compteur dans `VisibilityDetector` et utiliser un `StatefulWidget` pour suivre la visibilite. L\'`end` du `Tween` passe de 0 a la cible quand la visibilite est detectee.' },
    code: `import 'package:flutter/material.dart';
import 'package:visibility_detector/visibility_detector.dart';

class CounterCard extends StatefulWidget {
  final double to;
  final String prefix;
  final String label;
  const CounterCard({super.key, required this.to, this.prefix = '', required this.label});
  @override
  State<CounterCard> createState() => _CounterCardState();
}

class _CounterCardState extends State<CounterCard> {
  bool _visible = false;

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
            builder: (context, value, _) {
              final formatted = widget.prefix +
                value.round().toString().replaceAllMapped(
                  RegExp(r'(\\d)(?=(\\d{3})+(?!\\d))'), (m) => '\${m[1]},');
              return Text(formatted,
                style: const TextStyle(fontSize: 32, fontWeight: FontWeight.w800,
                  color: Colors.white, letterSpacing: -1));
            },
          ),
          const SizedBox(height: 4),
          Text(widget.label, style: const TextStyle(fontSize: 12, color: Colors.grey)),
        ]),
      ),
    );
  }
}`,
  },
]

const numberCounter: StepMap = {
  react:          numberCounterReact,
  nextjs:         numberCounterNextjs,
  vue:            numberCounterVue,
  'react-native': numberCounterRN,
  flutter:        numberCounterFlutter,
}

/* ─────────────────────────────────────────────── */
/*  Scroll Header Collapse                         */
/* ─────────────────────────────────────────────── */
const scrollHeaderCollapseReact: Step[] = [
  {
    title: 'Static sticky header',
    description: 'Start with a plain `position: sticky` header — no scroll-driven behavior yet. This establishes the layout baseline.',
    code: `<header style={{ position: 'sticky', top: 0, height: 88, padding: '0 24px' }}>
  <h1>Dashboard</h1>
  <p>Last updated 2 minutes ago</p>
</header>`,
  },
  {
    title: 'Track scroll with useScroll',
    description: '`useScroll()` returns a `MotionValue` for scroll offset that updates without triggering React re-renders — the foundation for scroll-linked styling.',
    code: `import { useScroll } from 'framer-motion'

const { scrollY } = useScroll()`,
  },
  {
    title: 'Derive height and opacity with useTransform',
    description: 'Map the scroll `MotionValue` to a height range and a subtitle opacity range. Both update on the compositor thread as the user scrolls.',
    code: `const height  = useTransform(scrollY, [0, 120], [88, 56])
const subOpac = useTransform(scrollY, [0, 80], [1, 0])

<motion.header style={{ height }}>
  <h1>Dashboard</h1>
  <motion.p style={{ opacity: subOpac }}>Last updated 2 minutes ago</motion.p>
</motion.header>`,
  },
  {
    title: 'Add blur and background fade',
    description: 'Layer in a `backdrop-filter` blur and background opacity, both derived from the same scroll value, for a frosted-glass collapse effect.',
    code: `const blur = useTransform(scrollY, [0, 120], [0, 12])
const bg   = useTransform(scrollY, [0, 120], ['rgba(255,255,255,0)', 'rgba(255,255,255,0.75)'])

<motion.header style={{
  height,
  background: bg,
  backdropFilter: useTransform(blur, b => \`blur(\${b}px)\`),
}}>
  ...
</motion.header>`,
  },
]

const scrollHeaderCollapseNextjs: Step[] = [
  {
    title: 'Mark the component client-side',
    description: '`useScroll` reads `window` scroll position, which only exists in the browser — add `\'use client\'` at the top of the file.',
    code: `'use client'
import { motion, useScroll, useTransform } from 'framer-motion'`,
  },
  {
    title: 'Track scroll and derive height',
    description: 'Same `useScroll` + `useTransform` pattern as React — Next.js App Router components work identically once marked client-side.',
    code: `const { scrollY } = useScroll()
const height = useTransform(scrollY, [0, 120], [88, 56])`,
  },
  {
    title: 'Add dark-theme background and blur',
    description: 'Interpolate an RGBA background string and a blur radius together, matching a dark app shell.',
    code: `const bg     = useTransform(scrollY, [0, 120], ['rgba(10,10,10,0)', 'rgba(10,10,10,0.8)'])
const blurPx = useTransform(scrollY, [0, 120], [0, 12])

<motion.header style={{ height, background: bg, backdropFilter: useTransform(blurPx, b => \`blur(\${b}px)\`) }}>
  <h1 style={{ color: '#fff' }}>Dashboard</h1>
</motion.header>`,
  },
]

const scrollHeaderCollapse: StepMap = {
  react:  scrollHeaderCollapseReact,
  nextjs: scrollHeaderCollapseNextjs,
}

/* ─────────────────────────────────────────────── */
/*  Magnetic Button                                */
/* ─────────────────────────────────────────────── */
const magneticButtonReact: Step[] = [
  {
    title: 'Plain button',
    description: 'Start with a normal button — no motion values yet.',
    code: `<button className="magnetic-btn">Get started</button>`,
  },
  {
    title: 'Track mouse position on the button',
    description: 'Compute the cursor\'s offset from the button\'s own center using `getBoundingClientRect()` inside `onMouseMove`.',
    code: `function handleMouseMove(e) {
  const rect = ref.current.getBoundingClientRect()
  const relX = e.clientX - (rect.left + rect.width / 2)
  const relY = e.clientY - (rect.top + rect.height / 2)
}`,
  },
  {
    title: 'Drive position with useSpring',
    description: 'Feed the scaled offset into a `useSpring` motion value so the button eases toward the cursor instead of snapping.',
    code: `const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })
const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })

x.set(relX * 0.35)
y.set(relY * 0.35)

<motion.button style={{ x, y }} onMouseMove={handleMouseMove} />`,
  },
  {
    title: 'Reset on mouse leave',
    description: 'When the cursor leaves the button, set the spring targets back to zero — the same spring animates it back to rest.',
    code: `function handleMouseLeave() {
  x.set(0)
  y.set(0)
}

<motion.button style={{ x, y }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} />`,
  },
]

const magneticButtonNextjs: Step[] = [
  {
    title: 'Mark client-side',
    description: '`mousemove` events and refs require the browser — add `\'use client\'`.',
    code: `'use client'
import { motion, useSpring } from 'framer-motion'
import { useRef } from 'react'`,
  },
  {
    title: 'Set up spring motion values',
    description: 'Two independent springs for x and y, tuned soft so the pull feels magnetic rather than mechanical.',
    code: `const x = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })
const y = useSpring(0, { stiffness: 150, damping: 15, mass: 0.1 })`,
  },
  {
    title: 'Wire up move and leave handlers',
    description: 'Scale the cursor offset down to ~35% so the button moves a fraction of the actual pointer displacement.',
    code: `<motion.button
  ref={ref}
  style={{ x, y }}
  onMouseMove={(e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.35)
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.35)
  }}
  onMouseLeave={() => { x.set(0); y.set(0) }}
>
  Get started
</motion.button>`,
  },
]

const magneticButton: StepMap = {
  react:  magneticButtonReact,
  nextjs: magneticButtonNextjs,
}

/* ─────────────────────────────────────────────── */
/*  Swipe to Delete                                */
/* ─────────────────────────────────────────────── */
const swipeToDeleteRN: Step[] = [
  {
    title: 'Static row',
    description: 'Start with a plain list row — no gesture handling yet.',
    code: `<View style={styles.row}>
  <Text style={styles.title}>{item.title}</Text>
</View>`,
  },
  {
    title: 'Add a horizontal pan gesture',
    description: 'Restrict the gesture to horizontal drags with `activeOffsetX`, so vertical list scrolling still works undisturbed.',
    code: `const translateX = useSharedValue(0)

const pan = Gesture.Pan()
  .activeOffsetX([-10, 10])
  .onUpdate((e) => {
    translateX.value = Math.min(0, e.translationX)
  })`,
  },
  {
    title: 'Reveal delete background and translate the row',
    description: 'An absolutely-positioned red background sits behind the row; the row itself translates on top of it as the gesture updates.',
    code: `const rowStyle = useAnimatedStyle(() => ({
  transform: [{ translateX: translateX.value }],
}))

<View style={styles.rowWrapper}>
  <View style={styles.deleteBackground}><Text>Delete</Text></View>
  <GestureDetector gesture={pan}>
    <Animated.View style={[styles.row, rowStyle]}>...</Animated.View>
  </GestureDetector>
</View>`,
  },
  {
    title: 'Threshold check and commit the delete',
    description: 'On release, compare the offset to a threshold. Past it, animate off-screen and collapse height, then call `onDelete` via `runOnJS` only once the collapse finishes.',
    code: `.onEnd(() => {
  if (translateX.value < SWIPE_THRESHOLD) {
    translateX.value = withTiming(-400, { duration: 200 })
    rowHeight.value = withTiming(0, { duration: 200 }, (finished) => {
      if (finished) runOnJS(onDelete)(item.id)
    })
  } else {
    translateX.value = withSpring(0, { stiffness: 300, damping: 26 })
  }
})`,
  },
]

const swipeToDelete: StepMap = {
  'react-native': swipeToDeleteRN,
}

/* ─────────────────────────────────────────────── */
/*  Bottom Sheet Snap Points                       */
/* ─────────────────────────────────────────────── */
const bottomSheetSnapRN: Step[] = [
  {
    title: 'Static sheet at one fixed position',
    description: 'Start with the sheet pinned at a single translateY offset — no gesture yet.',
    code: `const translateY = useSharedValue(SCREEN_HEIGHT * 0.9)

<Animated.View style={[styles.sheet, { transform: [{ translateY: translateY.value }] }]}>
  {children}
</Animated.View>`,
  },
  {
    title: 'Define snap points',
    description: 'Express peek, half, and full states as translateY offsets derived from screen height.',
    code: `const SNAP_POINTS = [
  SCREEN_HEIGHT * 0.9,  // peek
  SCREEN_HEIGHT * 0.4,  // half
  SCREEN_HEIGHT * 0.08, // full
]`,
  },
  {
    title: 'Drag freely, clamped to the snap range',
    description: 'During the pan, translate 1:1 with the finger but clamp so the sheet never passes the topmost or bottommost snap point.',
    code: `const pan = Gesture.Pan()
  .onStart(() => { startY.value = translateY.value })
  .onUpdate((e) => {
    const next = startY.value + e.translationY
    translateY.value = Math.max(SNAP_POINTS[2], Math.min(SNAP_POINTS[0], next))
  })`,
  },
  {
    title: 'Snap to nearest point using velocity',
    description: 'On release, project the position slightly forward using velocity, then pick whichever snap point is closest to that projected value — this makes fast flicks feel intentional.',
    code: `function nearestSnap(y, velocityY) {
  'worklet'
  const projected = y + velocityY * 0.15
  return SNAP_POINTS.reduce((closest, point) =>
    Math.abs(point - projected) < Math.abs(closest - projected) ? point : closest
  )
}

.onEnd((e) => {
  const target = nearestSnap(translateY.value, e.velocityY)
  translateY.value = withSpring(target, { stiffness: 260, damping: 30 })
})`,
  },
]

const bottomSheetSnap: StepMap = {
  'react-native': bottomSheetSnapRN,
}

/* ─────────────────────────────────────────────── */
/*  Implicit Animation (AnimatedContainer)         */
/* ─────────────────────────────────────────────── */
const implicitAnimationFlutter: Step[] = [
  {
    title: 'Plain Container, no animation',
    description: 'Start with a static `Container` — changing its properties would jump instantly with no transition.',
    code: `Container(
  width: 160,
  height: 90,
  color: const Color(0xFFE9E4FB),
)`,
  },
  {
    title: 'Swap in AnimatedContainer',
    description: 'Replace `Container` with `AnimatedContainer` and add a `duration` and `curve`. No other code changes yet — the widget is a drop-in replacement.',
    code: `AnimatedContainer(
  duration: const Duration(milliseconds: 350),
  curve: Curves.easeOutCubic,
  width: 160,
  height: 90,
  color: const Color(0xFFE9E4FB),
)`,
  },
  {
    title: 'Read properties from state',
    description: 'Drive width, height, color, and radius from a boolean in `State` instead of hardcoding them — this is what makes the widget actually animate.',
    code: `bool _expanded = false;

AnimatedContainer(
  duration: const Duration(milliseconds: 350),
  curve: Curves.easeOutCubic,
  width: _expanded ? 320 : 160,
  height: _expanded ? 200 : 90,
  decoration: BoxDecoration(
    color: _expanded ? const Color(0xFF7C3AED) : const Color(0xFFE9E4FB),
    borderRadius: BorderRadius.circular(_expanded ? 24 : 12),
  ),
)`,
  },
  {
    title: 'Toggle with setState and animate text style too',
    description: 'Wrap in `GestureDetector` to toggle `_expanded` via `setState`, and add `AnimatedDefaultTextStyle` so the label\'s size and color tween in lockstep.',
    code: `GestureDetector(
  onTap: () => setState(() => _expanded = !_expanded),
  child: AnimatedContainer(
    duration: const Duration(milliseconds: 350),
    curve: Curves.easeOutCubic,
    width: _expanded ? 320 : 160,
    height: _expanded ? 200 : 90,
    child: AnimatedDefaultTextStyle(
      duration: const Duration(milliseconds: 350),
      style: TextStyle(fontSize: _expanded ? 20 : 14, color: _expanded ? Colors.white : Colors.black87),
      child: const Text('Tap to expand'),
    ),
  ),
)`,
  },
]

const implicitAnimation: StepMap = {
  flutter: implicitAnimationFlutter,
}

/* ─────────────────────────────────────────────── */
/*  Flutter Staggered List                         */
/* ─────────────────────────────────────────────── */
const staggeredListFlutterSteps: Step[] = [
  {
    title: 'Plain ListView, no animation',
    description: 'Start with a normal `ListView.builder` — every row appears instantly.',
    code: `ListView.builder(
  itemCount: items.length,
  itemBuilder: (context, i) => ListTile(title: Text(items[i])),
)`,
  },
  {
    title: 'Add one shared AnimationController',
    description: 'Create a single controller in the parent `State`, long enough to cover the whole cascade, and start it once in `initState`.',
    code: `late final AnimationController _controller;

@override
void initState() {
  super.initState();
  _controller = AnimationController(vsync: this, duration: const Duration(milliseconds: 800))..forward();
}`,
  },
  {
    title: 'Derive a per-row Interval',
    description: 'Each row computes its own slice of the shared timeline using `Interval`, so every row\'s CurvedAnimation is locked to the same controller.',
    code: `Animation<double> _intervalFor(int index) {
  final stagger = 1 / items.length;
  final start = index * stagger * 0.6;
  final end = (start + stagger * 1.5).clamp(0.0, 1.0);
  return CurvedAnimation(parent: _controller, curve: Interval(start, end, curve: Curves.easeOutCubic));
}`,
  },
  {
    title: 'Drive opacity and translate per row',
    description: 'Wrap each `ListTile` in an `AnimatedBuilder` that reads its own interval-based animation to fade and slide it into place.',
    code: `itemBuilder: (context, i) {
  final animation = _intervalFor(i);
  return AnimatedBuilder(
    animation: animation,
    builder: (context, child) => Opacity(
      opacity: animation.value,
      child: Transform.translate(offset: Offset(0, 24 * (1 - animation.value)), child: child),
    ),
    child: ListTile(title: Text(items[i])),
  );
}`,
  },
]

const staggeredListFlutter: StepMap = {
  flutter: staggeredListFlutterSteps,
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
  'morphing-button':   morphingButton,
  'drag-reorder':      dragReorder,
  'number-counter':    numberCounter,
  'scroll-header-collapse': scrollHeaderCollapse,
  'magnetic-button':        magneticButton,
  'swipe-to-delete':        swipeToDelete,
  'bottom-sheet-snap':      bottomSheetSnap,
  'implicit-animation':     implicitAnimation,
  'staggered-list-flutter': staggeredListFlutter,
}

export function getSteps(slug: string, platform: PlatformId): Step[] {
  return ALL_STEPS[slug]?.[platform] ?? []
}
